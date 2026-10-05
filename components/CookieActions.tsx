"use client";
import { ATTR_KEY, CONSENT_KEY, CONSENT_OPEN_EVENT } from "@/lib/track";
import { showToast } from "@/lib/toast";
import { clearSavedDetails } from "@/lib/cart";
import { buttonClass } from "./Button";

/** Cookie settings and clear-data buttons for the cookies and privacy pages. */
export function CookieActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" className={buttonClass("primary")} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>Cookie settings</button>
      <button type="button" className={buttonClass("ghost")} onClick={() => {
        try {
          for (const k of Object.keys(window.localStorage)) if (k.startsWith("mk")) window.localStorage.removeItem(k);
          window.localStorage.removeItem(CONSENT_KEY); window.localStorage.removeItem(ATTR_KEY);
        } catch { /* storage blocked */ }
        // Also empties the order list and the other things held in memory for this page.
        clearSavedDetails();
        showToast("Saved data on this device was cleared, including your cookie choice.", "success");
      }}>Clear my data</button>
    </div>
  );
}
