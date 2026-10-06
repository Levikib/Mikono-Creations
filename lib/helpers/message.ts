// WhatsApp messages for the helpers. Reuses the exported pieces of lib/whatsapp.ts (generateRef, clean, buildWaUrl,
// PRICES_SENTENCE, URL_BUDGET). buildOrderMessage itself is not reused because it needs the customer and delivery
// details the order form collects, and these tools do not ask for them. The ITEMS block uses the same line format.
import { PRICES_SENTENCE, URL_BUDGET, buildWaUrl, clean } from "@/lib/whatsapp";
import { formatKes, unitPriceKes } from "@/lib/pricing";
import { sizeWord } from "../../data/studio/labels";
import { skuFor } from "./family";
import type { FamilyLine, HelperAnimal, GiftPick } from "./types";

export type FamilyMsgLine = { sku: string; name: string; colourLabel: string; size: string; qty: number };

export function familyMsgLines(lines: FamilyLine[], animals: HelperAnimal[]): FamilyMsgLine[] {
  const out: FamilyMsgLine[] = [];
  for (const l of lines) {
    const a = animals.find((x) => x.slug === l.slug);
    const c = a?.colours.find((x) => x.key === l.colourKey);
    if (a && c) out.push({ sku: skuFor(l), name: a.name, colourLabel: c.label, size: l.size, qty: l.qty });
  }
  return out;
}

const itemLine = (l: FamilyMsgLine, i: number, compact: boolean) =>
  compact ? `${i + 1}. ${l.qty}x ${l.name} ${l.colourLabel} ${sizeWord(l.size)} (${l.sku})` : `${i + 1}. ${l.qty} x ${l.name}, ${l.colourLabel}, size ${sizeWord(l.size).toLowerCase()}, SKU ${l.sku}`;

export type FamilyMsgInput = { ref: string; lines: FamilyMsgLine[]; summary: string; shareUrl?: string; source?: string; siteUrl?: string };

/** Same shape as the order message: greeting, ref, ITEMS, price sentence. Then the family summary and a note about the next step. */
export function buildFamilyMessage(m: FamilyMsgInput, compact = false): string {
  const out = ["Hello Mikono Creations, I would like to order.", `Order ref: ${m.ref}`];
  if (m.source) out.push(`Source: ${clean(m.source, 80)}`);
  out.push("", "ITEMS");
  m.lines.forEach((l, i) => out.push(itemLine(l, i, compact)));
  out.push(PRICES_SENTENCE, "", "FAMILY", `Built with the Safari Family builder: ${m.summary}.`);
  if (m.shareUrl && !compact) out.push(`My family: ${m.shareUrl}`);
  out.push("", "I will send my name, phone and delivery details here next.");
  if (m.siteUrl) out.push(`Sent from ${m.siteUrl.replace(/^https?:\/\//, "")}`);
  return out.join("\n");
}

export type FamilyPlan = { text: string; url: string | null; level: "full" | "compact" | "short"; /** Always the whole list, one line per animal, for copying. */ fullText: string; /** True when the link carries less than the whole list, so the person pastes the rest. */ pasteRest: boolean };

/** Full message when its link fits the URL budget, then the compact one without the share link, then a short one
 * that names the ref and the count. The full text is always kept so the copy fallback never loses an animal. */
export function planFamilySend(number: string | undefined, m: FamilyMsgInput): FamilyPlan {
  const full = buildFamilyMessage(m, false);
  const fullUrl = buildWaUrl(number, full);
  if (!fullUrl || fullUrl.length <= URL_BUDGET) return { text: full, url: fullUrl, level: "full", fullText: full, pasteRest: false };
  const compact = buildFamilyMessage(m, true);
  const compactUrl = buildWaUrl(number, compact);
  if (!compactUrl || compactUrl.length <= URL_BUDGET) return { text: compact, url: compactUrl, level: "compact", fullText: full, pasteRest: false };
  const short = ["Hello Mikono Creations, I would like to order.", `Order ref: ${m.ref}`, `${m.lines.length} lines: ${m.summary}.`, "My list is long, so I will paste it here next."].join("\n");
  return { text: short, url: buildWaUrl(number, short), level: "short", fullText: full, pasteRest: true };
}

/** Message that goes with a shared family link. */
export function buildShareMessage(shareUrl: string, summary: string): string {
  return `Here is the family I put together at Mikono Creations (${summary}). Have a look: ${shareUrl}`;
}

/** Question about one animal. No quiz answers are included. */
export function buildAskMessage(name: string, colourLabel: string, size: string): string {
  return `Hello Mikono Creations, I am interested in the ${name.toLowerCase()} (${colourLabel.toLowerCase()}, size ${sizeWord(size).toLowerCase()}). The price is ${formatKes(unitPriceKes("", size) ?? 0)} on the site. Can you confirm availability and the delivery cost?`;
}

const occ = (v?: string) => (v ?? "").replace(/-/g, " ");
const list = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);

type PicksAnswers = { who?: string | string[]; occasion?: string | string[]; kind?: string | string[]; size?: string | string[]; mood?: string | string[]; other?: { who?: string; occasion?: string; kind?: string; size?: string; mood?: string } };
export type PicksGroup = { picks: GiftPick[]; answers: PicksAnswers; who?: string[] };

/** Only built when the person taps "Share my picks". Contains broad answers and the animals for each person, no names. */
export function buildPicksMessage(picks: GiftPick[], answers: PicksAnswers & { who?: string | string[] }): string {
  return buildGroupsMessage([{ picks, answers, who: list(answers.who) }]);
}

/** One block per person ("Person 1", "Person 2"), each with their occasions and three picks. */
export function buildGroupsMessage(groups: PicksGroup[]): string {
  const head = [groups.length > 1 ? `Hello Mikono Creations, I used the gift finder for ${groups.length} people and these are my picks.` : "Hello Mikono Creations, I used the gift finder and these are my picks."];
  const out = [...head];
  groups.forEach((g, gi) => {
    const bits: string[] = [];
    const ot = g.answers.other ?? {};
    const occs = list(g.answers.occasion).map((v) => (v === "other" ? (ot.occasion?.trim() ? `other: ${clean(ot.occasion, 80)}` : "other") : occ(v)));
    if (occs.length) bits.push(`Occasion: ${occs.join(" and ")}`);
    if (g.who?.length) bits.push(`For: ${g.who.join(" and ")}`);
    const wants = [ot.kind?.trim() && `kind of animal ${clean(ot.kind, 80)}`, ot.size?.trim() && `size ${clean(ot.size, 80)}`, ot.mood?.trim() && `colours ${clean(ot.mood, 80)}`].filter(Boolean);
    if (wants.length) bits.push(`Also looking for: ${wants.join(", ")}`);
    out.push("");
    if (groups.length > 1) out.push(`PERSON ${gi + 1}`);
    if (bits.length) out.push(bits.join(". ") + ".");
    g.picks.forEach((p, i) => out.push(`${i + 1}. ${p.animal.name}, ${p.colour.label}, size ${sizeWord(p.size).toLowerCase()}`));
  });
  out.push("", "Prices are on the site by size. Can you confirm availability and the delivery cost?");
  return out.join("\n");
}
