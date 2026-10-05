// Plain text pieces shared by the Brief Card, the review step and the WhatsApp message.
import {
  MONTHS, bandLabel, customerTypes, deliveryMethods, eyeStyles, expressions, finishes, genericBaseById, labelOf, markings, meterLevels,
  moods, noseStyles, occasions, packaging, postures, sizeLabel, stitched, summaryFields, textures, typeById, wearables, wrappingStyles,
  AREA_PICKUP, budgetBands, BUDGET_SUGGEST, labelOfO, labelsOfO, OTHER_ID,
} from "../../data/studio";
import { OTHER_AREA } from "../../data/deliveryAreas";
import { pieceCount, totalCount } from "./flow";
import type { Address, Brief, Contact, Piece, StepId } from "./types";

const lc = (x: string) => (x.startsWith("Other") ? x : x.toLowerCase());
export const slugToName = (slug: string): string => {
  const s = slug.replace(/-/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const baseName = (baseId: string): string => (baseId ? genericBaseById(baseId)?.label ?? slugToName(baseId) : "");
export const typeLabels = (b: Brief): string[] => b.types.map((id) => (id === OTHER_ID ? labelOfO([], id, b.others.types) : typeById(id)?.label ?? "")).filter(Boolean);
export const customerLabel = (b: Brief) => b.customerTypes.map((id) => (id === OTHER_ID ? labelOfO([], id, b.others.customerTypes) : customerTypes.find((c) => c.id === id)?.label ?? "")).filter(Boolean).join(", ");

export function sizeText(p: Piece): string {
  if (p.size === "other") return p.sizeOther.trim() ? `Other size: ${p.sizeOther.trim()}` : "Other size";
  return sizeLabel(p.size);
}

export function qtyText(p: Piece): string {
  const n = parseInt(p.qtyExact, 10);
  if (Number.isFinite(n) && n > 0) return String(n);
  return bandLabel(p.qtyBand);
}

export function baseText(p: Piece): string {
  const n = baseName(p.baseId);
  const g = genericBaseById(p.baseId);
  return g && p.baseNote.trim() ? `${n}: ${p.baseNote.trim()}` : p.baseNote.trim() && n ? `${n} (${p.baseNote.trim()})` : n;
}

export function coloursText(p: Piece): string {
  const refs = p.colourRefs.length ? `references: ${p.colourRefs.join(", ")}` : "";
  if (p.colourSource === "surprise") return ["Surprise me with the colours", p.colours.map((c) => c.label).join(", "), p.colourNote.trim(), refs].filter(Boolean).join(". ");
  if (p.colourSource === "photo") return ["Match the colours in my photo", p.colourNote.trim(), refs].filter(Boolean).join(". ");
  if (p.colourSource === "brand") return ["Brand colours", p.colours.map((c) => c.label).join(", "), p.colourNote.trim(), refs].filter(Boolean).join(". ");
  const list = p.colours.map((c) => c.label).join(", ");
  return [list, p.colourNote.trim(), refs].filter(Boolean).join(". ");
}

export function featureLines(p: Piece): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const add = (label: string, value: string) => { if (value) out.push({ label, value }); };
  const ot = p.others ?? {};
  add("Markings", [...labelsOfO(markings, p.markings, ot.markings), p.markingsNote.trim()].filter(Boolean).join(", "));
  add("Eyes", labelOfO(eyeStyles, p.eyes, ot.eyes));
  add("Nose", labelOfO(noseStyles, p.nose, ot.nose));
  add("Expression", labelOfO(expressions, p.expression, ot.expression));
  add("Texture", labelsOfO(textures, p.textures, ot.textures).join(", "));
  add("Posture", labelOfO(postures, p.posture, ot.posture));
  add("Hanging loop", p.loop === "yes" ? "yes" : p.loop === "no" ? "no" : "");
  add("Unique features", p.unique.trim());
  return out;
}

export function personalLines(p: Piece): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  for (const s of stitched) {
    if (!p.stitch.includes(s.id)) continue;
    const v = (p.stitchText[s.id] ?? "").trim();
    out.push({ label: `Stitched ${s.label.toLowerCase()}`, value: v ? `"${v}"` : "(text to follow)" });
  }
  const ot = p.others ?? {};
  if (p.stitch.includes(OTHER_ID)) out.push({ label: "Stitched", value: ot.stitch?.trim() ? `Other: "${ot.stitch.trim()}"` : "Other (to follow)" });
  if (p.wear.length) out.push({ label: "Wears", value: labelsOfO(wearables, p.wear, ot.wear).map(lc).join(", ") });
  if (p.finish.length) out.push({ label: "Finish", value: labelsOfO(finishes, p.finish, ot.finish).map(lc).join(", ") });
  return out;
}

export const hasPersonal = (p: Piece) => p.stitch.length + p.wear.length + p.finish.length > 0;

export function occasionsText(b: Brief): string {
  const list = labelsOfO(occasions, b.occasions, b.others.occasions);
  const dm = b.occasionDayMonth;
  const dmText = /^\d{2}-\d{2}$/.test(dm) ? `${parseInt(dm.slice(3), 10)} ${MONTHS[parseInt(dm.slice(0, 2), 10) - 1] ?? ""}`.trim() : "";
  return [list.join(", "), dmText].filter(Boolean).join(", ");
}

export function deadlineText(b: Brief): string {
  if (b.deadlineType === "asap") return "As soon as possible";
  if (b.deadlineType === "flexible") return "Flexible (any date is fine)";
  if (b.deadlineType === "unsure") return "Not sure yet";
  if (b.deadlineType === "hard") return b.deadlineDate ? `${b.deadlineDate} (firm date)` : "Firm date";
  return "";
}

export function budgetText(b: Brief): string {
  const band = budgetBands.find((x) => x.id === b.budgetBand)?.label ?? "";
  const per = b.budgetPer === "each" ? " (for each piece)" : b.budgetPer === "total" ? " (for the whole order)" : "";
  const txt = b.budgetBand === "suggest" ? BUDGET_SUGGEST : b.budgetBand === "unsure" ? "Not sure yet" : b.budgetBand === "skip" ? "Prefer not to say" : [band, b.budgetText.trim()].filter(Boolean).join(", ");
  return txt ? `${txt}${per}` : "";
}

export function addressText(a: Address, c?: Contact): string {
  const m = labelOf(deliveryMethods, a.method);
  if (!a.method) return "";
  const place =
    a.method === "pickup" ? AREA_PICKUP
    : a.method === "someone-collects" ? ""
    : a.method === "nairobi" || a.method === "gift-direct" ? (a.area === OTHER_AREA ? a.areaOther.trim() : a.area) && `Nairobi, ${a.area === OTHER_AREA ? a.areaOther.trim() : a.area}`
    : [a.areaOther.trim(), a.county ? `${a.county} County` : ""].filter(Boolean).join(", ");
  const head = a.method === "pickup" ? "Collect from a pickup point" : place ? `${m}: ${place}` : m;
  const rec = c?.recipients[a.id];
  const parts = [a.label.trim() ? `${a.label.trim()}, ${head}` : head, a.share.trim() ? `for ${a.share.trim()}` : "", rec && rec.name.trim() ? `receiving adult ${rec.name.trim()}${rec.phone.trim() ? ` ${rec.phone.trim()}` : ""}` : ""];
  return parts.filter(Boolean).join(", ");
}

export function inspirationText(b: Brief): string {
  const likes = b.picks.filter((p) => p.pref === "like").map((p) => slugToName(p.slug));
  const avoids = b.picks.filter((p) => p.pref === "avoid").map((p) => slugToName(p.slug));
  const parts: string[] = [];
  if (likes.length) parts.push(`like ${likes.join(", ")}`);
  if (avoids.length) parts.push(`not like ${avoids.join(", ")}`);
  if (b.links.length) parts.push(`${b.links.length} ${b.links.length === 1 ? "link" : "links"}`);
  if (b.photoCount) parts.push(`${b.photoCount} ${b.photoCount === 1 ? "photo" : "photos"} to attach`);
  if (b.moods.length) parts.push(labelsOfO(moods, b.moods, b.others.moods).join(", ").toLowerCase());
  const nn = b.notes.filter((x) => x.trim()).length;
  if (nn) parts.push(nn === 1 ? "a note" : `${nn} notes`);
  const refs = b.pieces.reduce((s, p) => s + p.colourRefs.length, 0);
  if (refs) parts.push(`${refs} colour ${refs === 1 ? "reference" : "references"}`);
  return parts.join("; ");
}

export const packagingText = (b: Brief) => [...labelsOfO(packaging, b.packaging, b.others.packaging), ...labelsOfO(wrappingStyles, b.wrapping, b.others.wrapping).map((w) => `wrapping: ${w.toLowerCase()}`)].join(", ");

export function pieceTitle(p: Piece, i: number): string {
  const n = baseName(p.baseId);
  return p.label.trim() ? p.label.trim() : n ? `${i + 1}. ${n}` : `Piece ${i + 1}`;
}

export function pieceLine(p: Piece): string {
  const q = qtyText(p);
  return [baseText(p), sizeText(p), q === "1" ? "1 piece" : `x ${q}`].filter(Boolean).join(", ");
}

export interface BriefRow { key: string; label: string; value: string; step: StepId }

/** Rows for the live Brief Card and the review step. Empty value means a soft prompt, never an error. */
export function briefRows(b: Brief, c: Contact): BriefRow[] {
  const multi = b.pieces.length > 1;
  const rows: BriefRow[] = [
    { key: "type", label: "Kind of order", value: [typeLabels(b).join(", "), customerLabel(b)].filter(Boolean).join(". "), step: "who" },
  ];
  if (multi) {
    rows.push({ key: "pieces", label: `Pieces (${b.pieces.length})`, value: b.pieces.map((p, i) => `${i + 1}. ${pieceLine(p) || "not set yet"}`).join("\n"), step: "pieces" });
  } else {
    const p = b.pieces[0];
    rows.push(
      { key: "base", label: "Shape", value: baseText(p), step: "pieces" },
      { key: "size", label: "Size and count", value: [sizeText(p), p.size || p.qtyExact ? qtyText(p) && `${qtyText(p)} ${qtyText(p) === "1" ? "piece" : "pieces"}` : ""].filter(Boolean).join(", "), step: "pieces" },
    );
  }
  rows.push({ key: "colours", label: "Colours", value: multi ? b.pieces.map((p, i) => coloursText(p) && `${i + 1}. ${coloursText(p)}`).filter(Boolean).join("\n") : coloursText(b.pieces[0]), step: "look" });
  const feat = b.pieces.flatMap((p, i) => { const f = featureLines(p).map((x) => `${x.label} ${x.value}`).join("; "); return f ? [multi ? `${i + 1}. ${f}` : f] : []; });
  rows.push({ key: "features", label: "Features", value: feat.join("\n"), step: "look" });
  const per = b.pieces.flatMap((p, i) => { const f = personalLines(p).map((x) => `${x.label} ${x.value}`).join("; "); return f ? [multi ? `${i + 1}. ${f}` : f] : []; });
  rows.push({ key: "personal", label: "Personal touches", value: per.join("\n"), step: "personal" });
  rows.push(
    { key: "ideas", label: "Inspiration", value: inspirationText(b), step: "ideas" },
    { key: "when", label: "Occasion and date", value: [occasionsText(b), deadlineText(b)].filter(Boolean).join(". "), step: "timing" },
    { key: "where", label: "Delivery", value: b.addresses.map((a) => addressText(a, c)).filter(Boolean).join("\n"), step: "delivery" },
  );
  const bud = budgetText(b);
  if (bud) rows.push({ key: "budget", label: "Budget", value: bud, step: "production" });
  return rows;
}

/** One line for the collapsed mobile bar, for example "Giraffe, Large, 2 colours". */
export function shortLine(b: Brief): string {
  const parts: string[] = [];
  if (b.pieces.length > 1) {
    parts.push(`${b.pieces.length} pieces`);
    const names = [...new Set(b.pieces.map((p) => baseName(p.baseId)).filter(Boolean))];
    if (names.length) parts.push(names.slice(0, 2).join(", ") + (names.length > 2 ? "..." : ""));
  } else {
    const p = b.pieces[0];
    const n = baseName(p.baseId);
    if (n) parts.push(n);
    if (p.size) parts.push(sizeLabel(p.size));
    if (p.colours.length) parts.push(`${p.colours.length} ${p.colours.length === 1 ? "colour" : "colours"}`);
  }
  if (parts.length === 0 && b.types.length) parts.push(typeLabels(b)[0]);
  return parts.join(", ") || "Nothing chosen yet";
}

export const countLine = (b: Brief) => {
  const n = totalCount(b);
  return n > 0 ? `${n} ${n === 1 ? "piece" : "pieces"} in total` : "";
};

/* ---------- completeness meter ---------- */

export interface Meter { percent: number; label: string; missing: string[]; suggestion: string }

function done(id: string, b: Brief): boolean {
  const ps = b.pieces;
  switch (id) {
    case "type": return b.types.length > 0;
    case "base": return ps.every((p) => !!p.baseId);
    case "size": return ps.every((p) => !!p.size);
    case "qty": return ps.every((p) => pieceCount(p) > 0);
    case "colours": return ps.every((p) => p.colours.length > 0 || p.colourSource !== "swatches" || p.colourNote.trim().length > 1 || p.colourRefs.length > 0);
    case "features": return ps.some((p) => featureLines(p).length > 0);
    case "personal": return ps.some(hasPersonal);
    case "inspiration": return b.picks.length + b.links.length + b.photoCount > 0 || b.notes.some((x) => x.trim().length > 2) || b.pieces.some((p) => p.colourRefs.length > 0);
    case "timing": return !!b.deadlineType;
    case "delivery": return b.addresses.some((a) => !!a.method);
    case "budget": return !!(b.budgetBand || b.budgetText.trim());
    case "extras": return !!(b.payTiming || b.packaging.length || b.contactChannels.length);
    default: return false;
  }
}

/** How detailed the brief is. It never blocks sending. It names one gentle next detail, the most useful missing one. */
export function briefMeter(b: Brief): Meter {
  let got = 0;
  const missing: SummaryFieldLite[] = [];
  for (const f of summaryFields) {
    if (done(f.id, b)) got += f.weight; else missing.push(f);
  }
  const percent = Math.min(100, Math.round(got));
  const label = [...meterLevels].reverse().find((l) => percent >= l.min)?.label ?? meterLevels[0].label;
  const next = [...missing].sort((a, c) => c.weight - a.weight)[0];
  return { percent, label, missing: missing.map((m) => m.id), suggestion: next?.suggest ?? "" };
}
type SummaryFieldLite = (typeof summaryFields)[number];
