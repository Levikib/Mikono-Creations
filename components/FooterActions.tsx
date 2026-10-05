"use client";
import { CONSENT_OPEN_EVENT } from "@/lib/track";
import { clearSavedDetails } from "@/lib/cart";

const btn = "hit-y inline-flex min-h-8 items-center text-left text-[.8125rem] text-dusk-ink/90 underline underline-offset-4 hover:text-amber";

/** Cookie settings reopens the consent bar. Clear my saved details wipes the cart, draft, order summaries and attribution. */
export function FooterActions() {
  return (
    <div className="flex flex-wrap gap-x-3">
      <button type="button" className={btn} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>Cookie settings</button>
      <button type="button" className={btn} onClick={clearSavedDetails}>Clear my saved details</button>
    </div>
  );
}
