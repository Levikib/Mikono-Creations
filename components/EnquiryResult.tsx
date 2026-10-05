"use client";
import { useEffect, useRef, useState } from "react";
import type { Sendable } from "@/lib/enquiry";
import { copyText } from "@/lib/whatsapp";
import { Button, ButtonLink } from "./Button";
import { Icon } from "./Icon";

export function EnquiryResult({ sent, onAnother }: { sent: Sendable; onAnother: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState("");
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <section aria-labelledby="enq-done" className="rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm md:p-4">
      <h2 id="enq-done" ref={ref} tabIndex={-1} className="text-[1.125rem] focus:outline-none">Message ready</h2>
      <p className="mt-1 text-base text-stone">Reference</p>
      <p className="price font-display text-[1.125rem] text-baobab">{sent.ref}</p>
      <p className="mt-3 text-[.9375rem]">
        {sent.numberSet
          ? "WhatsApp should have opened with your message ready. Please press send there. If it did not open, use Open WhatsApp again."
          : "The shop's WhatsApp number is not set on this site yet, so WhatsApp could not open. Copy the message below and paste it into a WhatsApp message to us."}
      </p>
      {sent.plan.pasteRest ? (
        <p role="note" className="mt-2 rounded-[var(--radius-input)] bg-ochre-tint p-3 text-[.875rem]">Your message is long, so WhatsApp opens with a short one. We copied the full text. After you send the short message, paste the full text into the same chat.</p>
      ) : null}
      <pre tabIndex={0} aria-label="Your message" className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-input)] bg-bone p-3 font-sans text-base">{sent.plan.fullText}</pre>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {sent.plan.url ? <ButtonLink href={sent.plan.url} external variant="whatsapp"><Icon name="whatsapp" size={22} />Open WhatsApp again</ButtonLink> : null}
        <Button variant="ghost" onClick={async () => setStatus((await copyText(sent.plan.fullText)) ? "Message copied." : "Copying did not work here. Press and hold the text to copy it.")}>Copy message</Button>
        <Button variant="ghost" onClick={onAnother}>Write another</Button>
      </div>
      <p role="status" aria-live="polite" className="mt-3 text-base text-olive-deep">{status}</p>
    </section>
  );
}
