// Find the herd: hidden animals are real buttons in the page. This module marks the ones already found, handles a press,
// stores the list on the device (mk-found) and tells the footer counter through window events. No prize, no server, no analytics.
export const FOUND_KEY = "mk-found";
export const FOUND_EVENT = "mk:found";
export const RESET_EVENT = "mk:found-reset";

interface Api { bits: (x: number, y: number, n: number, spread?: number) => void; act: (el: HTMLElement) => void; enabled: () => boolean }
let api: Api | null = null;
let bound = false;

export function readFound(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(FOUND_KEY) || "null");
    return v && Array.isArray(v.found) ? v.found.filter((x: unknown) => typeof x === "string") : [];
  } catch { return []; }
}
function save(found: string[]) {
  try { localStorage.setItem(FOUND_KEY, JSON.stringify({ v: 1, found })); } catch { /* storage blocked */ }
}
const total = () => Number(document.querySelector<HTMLElement>("[data-fx-total]")?.dataset.fxTotal) || 12;

function mark() {
  const found = readFound();
  document.querySelectorAll<HTMLElement>(".fx-find").forEach((b) => {
    const id = b.dataset.find ?? "";
    const name = b.dataset.name ?? "animal";
    if (found.includes(id)) { b.setAttribute("data-found", ""); b.setAttribute("aria-label", `Found: ${name}. Press to see it wave`); }
    else { b.removeAttribute("data-found"); b.setAttribute("aria-label", "Hidden animal: tap to find it"); }
  });
}

function toast(text: string) {
  document.querySelector(".fx-toast")?.remove();
  const t = document.createElement("div");
  t.className = "fx-toast";
  t.setAttribute("aria-hidden", "true");
  t.textContent = text;
  document.body.appendChild(t);
  window.setTimeout(() => t.remove(), 3600);
}

export function message(n: number, tot: number, already: boolean): string {
  if (n >= tot && !already) return "You found the whole herd. Thank you for looking so closely.";
  if (already) return "Already found. This one is yours.";
  if (n === tot - 1) return `Found one. ${n} of ${tot}. One left.`;
  if (n >= 5) return `Found one. ${n} of ${tot}. Keep looking.`;
  return `Found one. ${n} of ${tot}.`;
}

function onClick(e: MouseEvent) {
  const b = (e.target as Element | null)?.closest<HTMLElement>(".fx-find");
  if (!b || !api?.enabled()) return;
  const id = b.dataset.find ?? "";
  const found = readFound();
  const already = found.includes(id);
  if (!already) { found.push(id); save(found); }
  mark();
  const tot = total();
  const n = found.length;
  const msg = message(n, tot, already);
  const r = b.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  api.act(b);
  if (!already) {
    const all = n >= tot;
    api.bits(cx, cy, all ? 28 : 12, all ? 120 : 60);
    if (all) { const w = innerWidth; for (let i = 1; i <= 3; i++) window.setTimeout(() => api?.bits((w * i) / 4, innerHeight * 0.4, 14, 90), i * 220); }
  }
  toast(msg);
  window.dispatchEvent(new CustomEvent(FOUND_EVENT, { detail: { id, n, total: tot, already, message: msg } }));
}

export function init(a: Api) {
  api = a;
  mark();
  if (!bound) {
    bound = true;
    document.addEventListener("click", onClick);
    window.addEventListener(RESET_EVENT, mark);
    window.addEventListener("storage", mark);
  }
}
