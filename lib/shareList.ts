// Share my list (strategy/16 section 1.5): the order list as a link. /cart?list=<code>
// The code is base64url of "sku:qty,sku:qty" text. Every sku is checked against the catalogue when it is read,
// so a hand edited link can only ever produce real animals. No names, phones or notes travel in the link.
import { MAX_QTY_PER_LINE } from "./site";

export const SHARE_PARAM = "list";
export const SHARE_MAX_LINES = 60;
const SIZES = ["s", "m", "l", "xl"];

export interface ShareProduct {
  slug: string;
  colourAsk: boolean;
  sizes: readonly string[];
  colours: ReadonlyArray<{ key: string }>;
}
export interface ShareLine { slug: string; colourKey: string; size: string; qty: number }

const b64 = {
  enc: (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)),
};

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(Number.isFinite(n) ? n : 1)));
const skuOf = (l: ShareLine) => `${l.slug}-${l.colourKey}-${l.size}`.toLowerCase();

/** Same sku merges, at most SHARE_MAX_LINES lines. */
function normalise(lines: ShareLine[]): ShareLine[] {
  const out: ShareLine[] = [];
  for (const l of lines) {
    const sku = skuOf(l);
    const hit = out.find((x) => skuOf(x) === sku);
    if (hit) hit.qty = clampQty(hit.qty + l.qty);
    else if (out.length < SHARE_MAX_LINES) out.push({ ...l, qty: clampQty(l.qty) });
  }
  return out;
}

export function encodeShare(lines: ShareLine[]): string {
  const norm = normalise(lines);
  if (!norm.length) return "";
  return b64.enc(norm.map((l) => `${skuOf(l)}:${l.qty}`).join(","));
}

function parseSku(sku: string, products: readonly ShareProduct[]): { slug: string; colourKey: string; size: string } | null {
  const lower = sku.toLowerCase();
  const size = SIZES.find((s) => lower.endsWith(`-${s}`));
  if (!size) return null;
  const head = lower.slice(0, lower.length - size.length - 1);
  // Longest slug first so "lion-head-handbag" never loses to "lion".
  for (const p of [...products].sort((a, b) => b.slug.length - a.slug.length)) {
    if (!head.startsWith(`${p.slug}-`)) continue;
    const colourKey = head.slice(p.slug.length + 1);
    const colourOk = p.colourAsk ? colourKey === "ask" || p.colours.some((c) => c.key === colourKey) : p.colours.some((c) => c.key === colourKey);
    const sizeOk = p.sizes.some((s) => s.toLowerCase() === size);
    if (colourOk && sizeOk) return { slug: p.slug, colourKey, size: size.toUpperCase() };
  }
  return null;
}

/** Reads a code back into valid lines. Unknown or broken entries are dropped. Never throws. */
export function decodeShare(code: string, products: readonly ShareProduct[]): { lines: ShareLine[]; dropped: number } {
  let text = "";
  try { text = b64.dec((code ?? "").trim().slice(0, 8000)); } catch { return { lines: [], dropped: 0 }; }
  const lines: ShareLine[] = [];
  let dropped = 0;
  for (const part of text.split(",").slice(0, SHARE_MAX_LINES + 8)) {
    const m = /^([a-z0-9-]+):(\d{1,6})$/.exec(part.trim().toLowerCase());
    const p = m ? parseSku(m[1], products) : null;
    if (m && p) lines.push({ ...p, qty: clampQty(parseInt(m[2], 10)) });
    else dropped += 1;
  }
  return { lines: normalise(lines), dropped };
}

export function shareUrl(origin: string, lines: ShareLine[]): string {
  const code = encodeShare(lines);
  return code ? `${origin.replace(/\/$/, "")}/cart?${SHARE_PARAM}=${code}` : `${origin.replace(/\/$/, "")}/cart`;
}

export function shareMessage(link: string, animals: number): string {
  return `Here is my Mikono Creations list (${animals} ${animals === 1 ? "animal" : "animals"}). Have a look and tell me what you think:\n${link}`;
}
export const shareWaUrl = (link: string, animals: number) => `https://wa.me/?text=${encodeURIComponent(shareMessage(link, animals))}`;
