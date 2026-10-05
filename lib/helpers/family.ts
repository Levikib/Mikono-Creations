// Build a Safari Family: tray lines, URL hash codec, summary text. Pure and deterministic.
import { FAMILY_MAX_LINES, FAMILY_MAX_QTY } from "@/data/helpers";
import type { FamilyLine, HelperAnimal, SizeKey } from "./types";

const ORDER: SizeKey[] = ["M", "S", "L", "XL"];

const SIZES: SizeKey[] = ["S", "M", "L", "XL"];
export const HASH_PREFIX = "family=";

export const skuFor = (l: FamilyLine) => `${l.slug}-${l.colourKey}-${l.size}`.toLowerCase();

export const clampQty = (n: number) => Math.max(1, Math.min(FAMILY_MAX_QTY, Math.floor(Number.isFinite(n) ? n : 1)));

/** Same sku merges into one line. Keeps the first FAMILY_MAX_LINES lines. */
export function normalise(lines: FamilyLine[]): FamilyLine[] {
  const out: FamilyLine[] = [];
  for (const l of lines) {
    const sku = skuFor(l);
    const hit = out.find((x) => skuFor(x) === sku);
    if (hit) hit.qty = clampQty(hit.qty + l.qty);
    else if (out.length < FAMILY_MAX_LINES) out.push({ ...l, qty: clampQty(l.qty) });
  }
  return out;
}

/** "elephant-grey-m.2,giraffe-orange-l" : sku, then ".qty" when more than one. */
export function encodeHash(lines: FamilyLine[]): string {
  if (!lines.length) return "";
  return HASH_PREFIX + normalise(lines).map((l) => skuFor(l) + (l.qty > 1 ? `.${l.qty}` : "")).join(",");
}

function parseSku(sku: string, animals: HelperAnimal[]): { slug: string; colourKey: string; size: SizeKey } | null {
  const lower = sku.toLowerCase();
  const size = SIZES.find((s) => lower.endsWith(`-${s.toLowerCase()}`));
  if (!size) return null;
  const head = lower.slice(0, lower.length - size.length - 1);
  // Longest slug first so "lion-head" style slugs never lose to "lion".
  const byLen = [...animals].sort((a, b) => b.slug.length - a.slug.length);
  for (const a of byLen) {
    if (!head.startsWith(a.slug + "-")) continue;
    const colourKey = head.slice(a.slug.length + 1);
    if (a.colours.some((c) => c.key === colourKey) && a.sizes.includes(size)) return { slug: a.slug, colourKey, size };
  }
  return null;
}

/** Reads a hash such as "#family=..." back into valid lines. Unknown or broken entries are dropped. */
export function decodeHash(hash: string, animals: HelperAnimal[]): FamilyLine[] {
  const h = hash.replace(/^#/, "");
  if (!h.startsWith(HASH_PREFIX)) return [];
  const raw = h.slice(HASH_PREFIX.length);
  const lines: FamilyLine[] = [];
  for (const part of raw.split(",").slice(0, 40)) {
    const m = /^([a-z0-9-]+?)(?:\.(\d{1,6}))?$/.exec(part.trim().toLowerCase());
    if (!m) continue;
    const p = parseSku(m[1], animals);
    if (p) lines.push({ ...p, qty: clampQty(m[2] ? parseInt(m[2], 10) : 1) });
  }
  return normalise(lines);
}

export const totalAnimals = (lines: FamilyLine[]) => lines.reduce((n, l) => n + l.qty, 0);

/** "3 animals, 2 sizes". */
export function summaryText(lines: FamilyLine[]): string {
  const n = totalAnimals(lines);
  const sizes = new Set(lines.map((l) => l.size)).size;
  if (n === 0) return "No animals yet";
  return `${n} ${n === 1 ? "animal" : "animals"}, ${sizes} ${sizes === 1 ? "size" : "sizes"}`;
}

/** The first colourway and size of this animal that is not already a line. Same colour, another size comes first, then another colour. */
export function freeCombo(lines: FamilyLine[], a: HelperAnimal, from?: { colourKey: string; size: SizeKey }): { colourKey: string; size: SizeKey } | null {
  const used = new Set(lines.filter((l) => l.slug === a.slug).map((l) => `${l.colourKey}|${l.size}`));
  const colours = a.colourAsk ? [a.colours[0]] : [...a.colours].sort((x, y) => (x.key === from?.colourKey ? -1 : y.key === from?.colourKey ? 1 : 0));
  for (const c of colours) {
    for (const s of ORDER) {
      if (a.sizes.includes(s) && !used.has(`${c.key}|${s}`)) return { colourKey: c.key, size: s };
    }
  }
  return null;
}

/** Adds one more line of the same animal in another size or colourway. Returns the lines unchanged when every combination is taken or the family is full. */
export function duplicateLine(lines: FamilyLine[], index: number, animals: HelperAnimal[]): { lines: FamilyLine[]; ok: boolean } {
  const src = lines[index];
  const a = animals.find((x) => x.slug === src?.slug);
  if (!src || !a || lines.length >= FAMILY_MAX_LINES) return { lines, ok: false };
  const combo = freeCombo(lines, a, src);
  if (!combo) return { lines, ok: false };
  const next = [...lines.slice(0, index + 1), { slug: a.slug, ...combo, qty: 1 }, ...lines.slice(index + 1)];
  return { lines: next, ok: true };
}

export function addAnimal(lines: FamilyLine[], a: HelperAnimal): { lines: FamilyLine[]; full: boolean } {
  // Tapping an animal again adds a separate line in a new size or colourway, so one animal can appear several times.
  const combo = freeCombo(lines, a) ?? { colourKey: a.colours[0].key, size: (a.sizes.includes("M") ? "M" : a.sizes[0]) as SizeKey };
  const base: FamilyLine = { slug: a.slug, ...combo, qty: 1 };
  const before = normalise(lines);
  const next = normalise([...before, base]);
  return { lines: next, full: next.length === before.length && !before.some((l) => skuFor(l) === skuFor(base)) };
}

/** Changes colour or size of one line. If that produces an existing sku the two lines merge. */
export function updateLine(lines: FamilyLine[], index: number, patch: Partial<FamilyLine>): FamilyLine[] {
  const next = lines.map((l, i) => (i === index ? { ...l, ...patch } : l));
  return normalise(next);
}
