"use client";
import { useSyncExternalStore } from "react";

const KEY = "mk-density";
const read = () => (document.documentElement.dataset.density === "comfy" ? "comfy" : "compact");
const subscribe = (cb: () => void) => { window.addEventListener("mk:density", cb); return () => window.removeEventListener("mk:density", cb); };

/** Two state phone grid control: compact (3 across, default) or comfortable (2 across). public/splash-gate.js applies the stored choice before first paint. */
export function DensityToggle() {
  const mode = useSyncExternalStore(subscribe, read, () => "compact");
  const set = (m: "compact" | "comfy") => {
    document.documentElement.dataset.density = m;
    try { window.localStorage.setItem(KEY, m); } catch { /* ignore */ }
    window.dispatchEvent(new Event("mk:density"));
  };
  const b = "hit-area inline-flex h-8 w-8 items-center justify-center rounded-full text-baobab";
  return (
    <div role="group" aria-label="Grid size" className="inline-flex gap-1.5 md:hidden">
      <button type="button" aria-label="Three animals across" aria-pressed={mode === "compact"} onClick={() => set("compact")} className={`${b} ${mode === "compact" ? "btn-primary" : "btn-secondary"}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="1" width="4" height="4" rx="1"/><rect x="6" y="1" width="4" height="4" rx="1"/><rect x="11" y="1" width="4" height="4" rx="1"/><rect x="1" y="6" width="4" height="4" rx="1"/><rect x="6" y="6" width="4" height="4" rx="1"/><rect x="11" y="6" width="4" height="4" rx="1"/><rect x="1" y="11" width="4" height="4" rx="1"/><rect x="6" y="11" width="4" height="4" rx="1"/><rect x="11" y="11" width="4" height="4" rx="1"/></svg>
      </button>
      <button type="button" aria-label="Two animals across" aria-pressed={mode === "comfy"} onClick={() => set("comfy")} className={`${b} ${mode === "comfy" ? "btn-primary" : "btn-secondary"}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.2"/><rect x="1" y="9" width="6" height="6" rx="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.2"/></svg>
      </button>
    </div>
  );
}
