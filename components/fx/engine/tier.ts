// Which animal tier this visitor gets. Kept tiny and free of imports: the Animals switch (in every footer) and the engine both use it.
// public/splash-gate.js does the same decision before first paint and sets html[data-fx]; keep the two in step.
//   off    the Animals switch is off, or Save-Data / a 2g connection (unless the visitor switched Animals on)
//   still  prefers-reduced-motion: static decorations only
//   lite   weak device (low memory, few cores, 3g): a small budget, no peek-a-boo, no welcome
//   full   everything
export type FxTier = "full" | "lite" | "still" | "off";

export const ANIMALS_KEY = "mk-animals";
export const FX_EVENT = "mk:animals";

interface Hints { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }

export function readChoice(): "on" | "off" | null {
  try {
    const v = localStorage.getItem(ANIMALS_KEY);
    if (v === "on" || v === "off") return v;
    // The older Animals setting (mk-fx) still counts until the visitor uses the new switch.
    const old = localStorage.getItem("mk-fx");
    if (old === "off") return "off";
  } catch { /* storage blocked */ }
  return null;
}

export function detectTier(): FxTier {
  const choice = readChoice();
  if (choice === "off") return "off";
  const n = navigator as Navigator & Hints;
  const c = n.connection;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "still";
  const saver = Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? "");
  if (saver) return choice === "on" ? "lite" : "off";
  const mem = n.deviceMemory, cores = n.hardwareConcurrency;
  if (/(^|-)3g$/.test(c?.effectiveType ?? "") || (mem && mem <= 2) || (cores && cores <= 2) || (mem && mem <= 4 && cores && cores <= 4)) return "lite";
  return "full";
}

export function applyTier(): FxTier {
  const t = detectTier();
  document.documentElement.setAttribute("data-fx", t);
  document.documentElement.setAttribute("data-animals", t === "off" ? "off" : "on");
  return t;
}

export function setChoice(on: boolean) {
  try { localStorage.setItem(ANIMALS_KEY, on ? "on" : "off"); } catch { /* storage blocked */ }
  applyTier();
  window.dispatchEvent(new Event(FX_EVENT));
}
