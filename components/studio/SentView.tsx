"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "../Icon";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { copyText } from "@/lib/whatsapp";
import { REPLY_TIME, STUDIO_PATH } from "@/data/studio";
import { clearDraft, clearSent, readSent, type SentRecord } from "@/lib/studio/state";
import { studioTrack } from "@/lib/studio/track";
import { PaperclipSteps } from "./Art";
import { Note } from "./ui";

const noop = () => () => {};
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);
const store = (): Storage | null => { try { return window.localStorage; } catch { return null; } };

export function SentView({ celebrate }: { celebrate?: ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) return <p className="st min-h-[50dvh] py-6 text-center st-soft" aria-live="polite">Loading your brief</p>;
  return <Sent celebrate={celebrate} />;
}

function Sent({ celebrate }: { celebrate?: ReactNode }) {
  const [rec] = useState<SentRecord | null>(() => readSent(store()));
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    if (rec) studioTrack("studio_attach_instruction_view", { lead_ref: rec.ref });
  }, [rec]);

  const copy = async () => setCopied((await copyText(rec!.fullText)) ? "Message copied. Paste it into WhatsApp." : "Copying did not work here. Press and hold the text below to copy it.");
  const finish = () => { clearDraft(store()); clearSent(store()); setDone(true); };
  const reopen = () => studioTrack("whatsapp_click", { lead_ref: rec?.ref });

  if (!rec && !done) {
    return (
      <section className="st st-panel mx-auto mt-3 max-w-[640px] p-3 md:p-4" aria-labelledby="sent-title">
        <h1 id="sent-title" ref={headingRef} tabIndex={-1} className="text-display-md focus:outline-none">We could not find a brief on this device</h1>
        <p className="mt-2 text-[.9375rem]">Briefs are kept on the device you used, for 24 hours. You can start a new one, or message us directly on WhatsApp at {PHONE_DISPLAY}.</p>
        <div className="mt-2.5 flex flex-wrap gap-3">
          <Link href={STUDIO_PATH} className="st-btn st-btn-primary">Start a brief</Link>
          <a href={PHONE_TEL} className="st-btn st-btn-sec"><Icon name="phone" size={20} />Call {PHONE_DISPLAY}</a>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="st st-panel mx-auto mt-3 max-w-[640px] p-3 md:p-4" aria-labelledby="sent-title">
        <h1 id="sent-title" ref={headingRef} tabIndex={-1} className="text-display-md focus:outline-none">Thank you</h1>
        <p className="mt-2 text-[.9375rem]">Your brief is cleared from this device. We will reply on WhatsApp with questions and a quote. Nothing is final until you approve the quote.</p>
        <div className="mt-2.5 flex flex-wrap gap-3">
          <Link href="/shop" className="st-btn st-btn-primary">See the animals</Link>
          <Link href={STUDIO_PATH} className="st-btn st-btn-sec">Start another brief</Link>
        </div>
      </section>
    );
  }

  const r = rec!;
  return (
    <div className="st mx-auto mt-3 grid max-w-[760px] gap-3">
      {celebrate}
      <header className="st-panel p-3 md:p-7">
        <p className="st-eyebrow">Brief ready</p>
        <h1 id="sent-title" ref={headingRef} tabIndex={-1} className="text-display-md mt-1 focus:outline-none">Your brief is ready on WhatsApp</h1>
        <p className="mt-2 text-[.9375rem]">WhatsApp should have opened with your message filled in. Press send there to share it with us. Keep your reference handy:</p>
        <p className="mt-3 inline-block rounded-[18px] px-4 py-3 text-[1.25rem] font-semibold tracking-[.06em] st-well" style={{ fontFamily: "var(--st-font-mono)" }} data-ref>{r.ref}</p>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
          {r.url ? (
            <a href={r.url} target="_blank" rel="noopener noreferrer" onClick={reopen} className="st-btn st-btn-wa st-btn-big"><Icon name="whatsapp" size={22} />Send again on WhatsApp</a>
          ) : (
            <a href={PHONE_TEL} className="st-btn st-btn-wa st-btn-big"><Icon name="phone" size={22} />Call {PHONE_DISPLAY}</a>
          )}
          <button type="button" onClick={copy} className="st-btn st-btn-sec st-btn-big"><Icon name="check" size={20} />Copy message</button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 min-h-6 text-base st-soft">{copied}</p>
        {r.level !== "full" ? <Note className="mt-2">Your brief was long, so WhatsApp opened with a short note. Tap Copy message and paste the full brief into the chat.</Note> : null}
      </header>

      <section className="st-surface grid gap-4 p-3 md:p-4" aria-labelledby="attach-title">
        <h2 id="attach-title" className="text-[1.125rem]">{r.photoCount > 0 ? `Now attach your ${r.photoCount === 1 ? "photo" : "photos"} in the chat` : "Have photos or a drawing? Attach them in the chat"}</h2>
        <PaperclipSteps />
        <p className="text-base st-soft">Photos are never uploaded to this website. They go straight to us in WhatsApp.</p>
      </section>

      <section className="st-surface p-3 md:p-4" aria-labelledby="next-title">
        <h2 id="next-title" className="text-[1.125rem]">What happens next</h2>
        <ol className="mt-3 grid gap-3 text-[.9375rem]">
          <li className="flex gap-3"><span className="st-ico shrink-0">1</span><span>You press send in WhatsApp, and add any photos.</span></li>
          <li className="flex gap-3"><span className="st-ico shrink-0">2</span><span>A person at Mikono replies on WhatsApp with questions and a quote. {REPLY_TIME} Custom pieces usually take from 3 days to 1 week, and the exact time and price are confirmed in your quote.</span></li>
          <li className="flex gap-3"><span className="st-ico shrink-0">3</span><span>Nothing is final until you approve the quote. A deposit may be asked before we start, confirmed in your quote. Take your time.</span></li>
        </ol>
      </section>

      <section className="st-surface grid gap-3 p-3 md:p-4" aria-labelledby="done-title">
        <h2 id="done-title" className="text-[1.125rem]">Sent it?</h2>
        <p className="text-base st-soft">Tap below when you have pressed send. This clears your brief from this device.</p>
        <div><button type="button" onClick={finish} className="st-btn st-btn-primary st-btn-big">I have sent it</button></div>
      </section>

      <details className="st-surface p-4">
        <summary className="min-h-11 cursor-pointer text-base font-semibold">See the message</summary>
        <pre className="mt-2 whitespace-pre-wrap break-words text-base [font-family:inherit]" tabIndex={0}>{r.fullText}</pre>
      </details>
    </div>
  );
}
