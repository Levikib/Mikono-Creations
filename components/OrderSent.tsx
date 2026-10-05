"use client";
import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart, useHydrated } from "@/lib/cart";
import { env, siteBaseUrl, whatsappUrl } from "@/lib/env";
import { clearDraft, readDraft, readOrders, type Sent } from "@/lib/orderForm";
import { clearSentMemory, getSentMemory } from "@/lib/sentMessage";
import { track } from "@/lib/track";
import { buildWaUrl, copyText, digitsOnly } from "@/lib/whatsapp";
import { Button, ButtonLink } from "./Button";
import { Icon } from "./Icon";

export function OrderSent({ celebrate }: { celebrate?: ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) return <p className="py-3 text-stone" aria-live="polite">Loading</p>;
  return <SentView celebrate={celebrate} />;
}

function SentView({ celebrate }: { celebrate?: ReactNode }) {
  const params = useSearchParams();
  const refParam = params.get("ref") ?? "";
  const { clear } = useCart();
  const [sent] = useState<{ ref: string; data: Sent | null; known: boolean }>(() => {
    // The full message (with a KRA PIN, if one was typed) is in memory right after sending. After a reload only the saved copy is left.
    const mem = getSentMemory();
    if (mem && (!refParam || mem.ref === refParam)) return { ref: mem.ref, data: { message: mem.message, text: mem.text, level: mem.level, at: mem.at, pasteRest: mem.pasteRest }, known: true };
    const d = readDraft();
    if (d?.sent && d.ref && (!refParam || d.ref === refParam)) return { ref: d.ref, data: d.sent, known: true };
    const known = !!refParam && readOrders().some((o) => o.ref === refParam);
    return { ref: refParam, data: null, known };
  });
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);
  const numberSet = !!digitsOnly(env.whatsappNumber);
  const url = sent.data ? buildWaUrl(env.whatsappNumber, sent.data.text) : null;

  const copy = async () => {
    if (!sent.data) return;
    const ok = await copyText(sent.data.message);
    setStatus(ok ? "Order text copied. Paste it into the WhatsApp chat with us." : "Copying did not work here. Press and hold the text to copy it.");
  };
  const finish = () => {
    clear();
    clearDraft();
    clearSentMemory();
    setDone(true);
    setTimeout(() => statusRef.current?.focus(), 0);
  };

  if (!sent.data) {
    return (
      <div className="max-w-[640px]">
        <p className="text-[.9375rem]">
          {sent.known
            ? `Order ${sent.ref} has already been marked as sent on this device. We reply on WhatsApp to confirm everything.`
            : "We could not find an order waiting on this device. If you meant to place one, your order list and form are still the place to start."}
        </p>
        <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/shop" size="large">Back to the shop</ButtonLink>
          <ButtonLink href="/cart" variant="ghost" size="large">Open my order list</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid max-w-[720px] gap-2.5">
      <div className="rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm md:p-4">
        <p className="text-[.8125rem] font-semibold text-stone">Your order reference</p>
        <p className="price mt-0.5 font-display text-[1.25rem] text-baobab" aria-label={`Order reference ${sent.ref}`}>{sent.ref}</p>
        {done ? (
          <p ref={statusRef} tabIndex={-1} role="status" className="mt-2 text-[.9375rem] font-semibold text-olive-deep focus:outline-none">
            Thank you. We have your order request, and your order list is now empty.
          </p>
        ) : (
          <p className="mt-2 text-[.9375rem]">
            {numberSet
              ? "WhatsApp should have opened with your order ready to send. Please press send there. If it did not open, use Send again below."
              : "The shop's WhatsApp number is not set on this site yet, so WhatsApp could not open. Copy your order text below and paste it into a WhatsApp message to us."}
          </p>
        )}
      </div>

      {!done && sent.data.pasteRest ? (
        <div role="note" className="rounded-[var(--radius-card)] border-2 border-ochre bg-ochre-tint p-3">
          <p className="text-[.875rem] font-semibold">Your order is long, so WhatsApp opened with a shorter message.</p>
          <p className="mt-0.5 text-[.8125rem]">We copied the full text. After you send the short message, paste the full text into the same chat so we have every detail.</p>
          <div className="mt-2"><Button variant="secondary" size="compact" onClick={copy}>Copy the full text again</Button></div>
        </div>
      ) : null}

      <section aria-labelledby="next-title" className="rounded-[var(--radius-card)] bg-paper p-3 shadow-clay-sm">
        <h2 id="next-title" className="text-[.9375rem]">What happens next</h2>
        <ol className="mt-1.5 grid gap-1 text-[.875rem]">
          <li>1. You send the message in WhatsApp.</li>
          <li>2. We reply on WhatsApp to confirm your items.</li>
          <li>3. We confirm the price and the delivery cost, and tell you how to pay. Nothing is charged until you agree.</li>
        </ol>
      </section>

      {!done ? (
        <div className="grid gap-2">
          <Button size="large" onClick={finish}><Icon name="check" size={22} />I have sent it</Button>
          {url ? <ButtonLink href={url} external variant="whatsapp" size="large" onClick={() => track("whatsapp_click", { context: "order_sent_again" })}><Icon name="whatsapp" size={22} />Send again</ButtonLink> : null}
          <Button variant="ghost" size="large" onClick={copy}>Copy message</Button>
          <p role="status" aria-live="polite" className="min-h-[1.2em] text-[.8125rem] text-olive-deep">{status}</p>
          <p className="text-[.8125rem] text-stone">Your order list stays as it is until you press I have sent it.</p>
        </div>
      ) : (
        <>
          {celebrate}
          <AfterSent />
        </>
      )}
      {!done ? <ButtonLink href="/shop" variant="ghost">Back to the shop</ButtonLink> : null}
    </div>
  );
}

/** After the order is marked as sent: a few quiet next steps. No timers, no rewards, nothing stored. */
function AfterSent() {
  const shareText = `I just sent an order to Mikono Creations on WhatsApp. Crocheted animals, handmade in Nairobi: ${siteBaseUrl()}`;
  const share = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const tell = whatsappUrl("Hello Mikono Creations, a question about my order.") ?? "/contact";
  return (
    <section aria-labelledby="after-title" className="grid gap-2.5">
      <h2 id="after-title" className="text-[.9375rem]">While you wait</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <ButtonLink href={share} external variant="whatsapp" size="large" data-wa-track="order_sent_share" onClick={() => track("share_list", { method: "wa", context: "order_sent" })}><Icon name="whatsapp" size={22} />Share on WhatsApp</ButtonLink>
        <ButtonLink prefetch={false} href="/build-a-family?src=post_order" data-track="sent_family" variant="secondary" size="large"><Icon name="people" size={22} />Build a safari family</ButtonLink>
      </div>
      <div className="rounded-[var(--radius-card)] bg-oat p-3 text-[.875rem]">
        <p><span className="font-semibold">After it arrives.</span> Tell us how it went, on WhatsApp. A review form is not ready yet.</p>
        <p className="mt-1"><span className="font-semibold">Order again later.</span> If you would like a reminder, say so in the chat with us. This site does not keep a reminder or any contact list for you.</p>
        <a href={tell} target={tell.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="ck-tbtn -ml-2 !justify-start">Open the chat with us</a>
      </div>
      <div className="flex flex-wrap gap-x-3">
        <Link prefetch={false} href="/custom/studio?src=post_order" data-track="sent_studio" className="ck-tbtn -ml-2">Planning something special? Start a custom brief</Link>
        <Link href="/journal" data-track="sent_journal" className="ck-tbtn">Read the journal</Link>
        <Link href="/shop" className="ck-tbtn">Back to the shop</Link>
      </div>
    </section>
  );
}
