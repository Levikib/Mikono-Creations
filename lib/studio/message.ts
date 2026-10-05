// The WhatsApp brief message. Pure functions. Reference CU-YYMMDD-XXXX comes from generateRef (D24).
// Every captured field appears in a fixed, scannable order. Empty lines are omitted.
import { buildWaUrl, clean, generateRef, URL_BUDGET, type Level, type SendPlan } from "../whatsapp";
import {
  BUDGET_SUGGEST, CUSTOM_TERMS_VERSION, PRIVACY_VERSION, STUDIO_CONSENT_VERSION, SUSTAIN_LINE, TERMS_OF_SALE_VERSION, contactChannels, contactHours,
  DEPOSIT_WORDING, PAYMENT_NOTE, paymentMethods, paymentTiming, languages, labelOf, labelsOfO, labelOfO, moods, packaging, rightsOptions, businessTypes, wrappingStyles,
} from "../../data/studio";
import { totalCount } from "./flow";
import { roughGuide } from "./estimate";
import {
  addressText, baseText, budgetText, coloursText, customerLabel, deadlineText, featureLines, occasionsText, personalLines, qtyText, sizeText,
  slugToName, typeLabels,
} from "./summary";
import type { Brief, Contact, Piece } from "./types";

export const PRICES_LINE = "Prices, time and what is possible: please confirm on WhatsApp.";
export const BRIEF_INTRO = "Hello Mikono Creations, custom order brief.";
export const TBC = "(to be confirmed)";

export const newBriefRef = (now?: Date, rnd?: (n: number) => Uint8Array) => generateRef("CU", now, rnd);

export interface BriefMsg {
  ref: string;
  brief: Brief;
  contact: Contact;
  /** Normalised +254 number, or the raw text when it could not be normalised. */
  phone: string;
  source?: string;
  siteUrl?: string;
  /** Hide the KRA PIN, for the copy kept on the device. */
  hidePin?: boolean;
}

const row = (label: string, value: string | undefined, max = 300): string => {
  const v = clean(value, max).replace(/\n+/g, " ");
  return v ? `${label}: ${v}` : "";
};

/** Photo line. Always present, so the maker knows whether to expect photos. */
export function photoLine(count: number): string {
  if (count > 0) return `Photos: I will attach ${count} ${count === 1 ? "photo" : "photos"} in this chat after this message.`;
  return "Photos: none yet. I can send some in this chat after this message.";
}

function pieceBlock(p: Piece, i: number, n: number, compact: boolean): string[] {
  const head = n > 1 ? `PIECE ${i + 1} of ${n}${p.label.trim() ? `: ${clean(p.label, 40)}` : ""}` : "PIECE";
  if (compact) {
    const feats = featureLines(p).map((x) => `${x.label.toLowerCase()} ${x.value}`).join("; ").slice(0, 120);
    const parts = [baseText(p), sizeText(p), `count ${qtyText(p)}`, coloursText(p), feats, personalLines(p).map((x) => `${x.label} ${x.value}`).join("; ")].filter(Boolean);
    return [`${head}: ${clean(parts.join(" | "), 340)}`];
  }
  const out = [head];
  const add = (l: string) => { if (l) out.push(l); };
  add(row("Shape", baseText(p), 200));
  add(row("Size", sizeText(p), 140));
  add(row("Count", qtyText(p)));
  add(row("Colours", coloursText(p), 260));
  const feats = featureLines(p);
  if (feats.length) {
    out.push("Features:");
    for (const f of feats) out.push(`  ${row(f.label, f.value, 200)}`);
  }
  const pers = personalLines(p);
  if (pers.length) {
    out.push("Personal touches:");
    for (const f of pers) out.push(`  ${row(f.label, f.value, 160)}`);
  }
  return out;
}

export function buildBriefMessage(m: BriefMsg, level: Level = "full"): string {
  const { brief: b, contact: c } = m;
  const compact = level === "compact";
  const head = [BRIEF_INTRO, `Ref: ${m.ref}`];
  if (m.source) head.push(`Source: ${m.source}`);
  const total = totalCount(b);

  if (level === "short") {
    return [...head, "", `Name: ${clean(c.name, 80)}`, `Phone: ${m.phone}`,
      b.pieces.length > 1 ? `Pieces in the brief: ${b.pieces.length}` : "",
      "My brief is long, so I will paste it here next."].filter((x) => x !== "").join("\n");
  }

  const out: string[] = [...head, "", "ORDER"];
  const add = (l: string) => { if (l) out.push(l); };
  add(row("Customer type", customerLabel(b)));
  add(row("Kind of order", typeLabels(b).join(", "), 240));
  add(row("Occasion", occasionsText(b)));
  add(row("Event", [b.eventLabel.trim(), b.eventDate].filter(Boolean).join(", "), 100));
  add(row("Deadline", deadlineText(b)));
  if (b.rush === "yes") add(`Faster option: I would like to ask ${TBC}`);
  if (total > 0) add(`Total pieces: ${total}${b.pieces.length > 1 ? ` across ${b.pieces.length} designs` : ""}`);

  b.pieces.forEach((p, i) => { out.push("", ...pieceBlock(p, i, b.pieces.length, compact)); });

  const picks = b.picks.map((p) => `${slugToName(p.slug)} ${p.pref === "like" ? "(like)" : "(not like)"}`).join(", ");
  const insp: string[] = [];
  const pushI = (l: string) => { if (l) insp.push(l); };
  pushI(row("Animals from your shop", picks, 300));
  if (!compact) pushI(row("Mood", labelsOfO(moods, b.moods, b.others.moods).join(", ")));
  const links = b.links.slice(0, compact ? 2 : 5);
  if (links.length) insp.push(`Links: ${links.join(" ")}`);
  b.notes.filter((x) => x.trim()).forEach((n, i, all) => pushI(row(all.length > 1 ? `Note ${i + 1}` : "Description", n, compact ? 160 : 600)));
  if (b.rights) pushI(row("Logo or character rights", labelOf(rightsOptions, b.rights)));
  if (insp.length) out.push("", "INSPIRATION", ...insp);

  out.push("", "DELIVERY");
  b.addresses.forEach((a, i) => { const t = addressText(a, c); if (t) out.push(`${b.addresses.length > 1 ? `${i + 1}. ` : ""}${clean(t, 200)}${a.note.trim() && !compact ? ` | Note: ${clean(a.note, 100)}` : ""}`); });
  if (b.addresses.some((a) => a.method && a.method !== "pickup" && a.method !== "someone-collects")) out.push("Delivery cost depends on where it is going and is confirmed in your quote.");
  if (b.addresses.some((a) => a.method === "international")) out.push(`Outside Kenya ${TBC}`);

  const bud = budgetText(b);
  if (bud || b.budgetBand === "suggest") out.push("", `BUDGET (rough guide, not a price): ${clean(bud || BUDGET_SUGGEST, 120)}`);
  const guide = roughGuide(b);
  if (guide) out.push(guide.messageLine);

  const prod: string[] = [];
  const pk = labelsOfO(packaging, b.packaging, b.others.packaging).concat(labelsOfO(wrappingStyles, b.wrapping, b.others.wrapping).map((w) => `wrapping ${w.toLowerCase()}`));
  if (pk.length) prod.push(`Packaging: ${pk.join(", ")}`);
  if (b.packaging.includes("gift-card") && b.giftCardText.trim()) prod.push(`Gift card text: "${clean(b.giftCardText, 120)}"`);
  if (b.giftNote.trim()) prod.push(`Note for the packaging: ${clean(b.giftNote, compact ? 100 : 200)}`);
  if (!compact || b.sustainInfo) prod.push(`Yarn: ${SUSTAIN_LINE.replace(/\.$/, "")}${b.sustainInfo ? ". Please tell me more about the yarn" : ""}`);
  if (prod.length) out.push("", "MAKING", ...prod);

  const pay: string[] = [];
  if (b.payTiming) pay.push(`Timing: ${labelOf(paymentTiming, b.payTiming)}${b.payTiming === "deposit" ? ` (${DEPOSIT_WORDING})` : ""}`);
  if (b.payMethods.length) pay.push(`Ways I may pay ${TBC}: ${labelsOfO(paymentMethods, b.payMethods, b.others.payMethods).join(", ")}`);
  if (c.payNote.trim()) pay.push(row("Payment note", c.payNote, compact ? 120 : 200));
  if (pay.length) out.push("", "PAYMENT", ...pay, PAYMENT_NOTE);

  if (c.bizName.trim() || c.bizType || c.role.trim() || c.invoiceName.trim() || c.po.trim() || c.kraPin.trim()) {
    out.push("", "BUSINESS");
    add(row("Business", `${clean(c.bizName, 80)}${c.bizType ? ` (${labelOfO(businessTypes, c.bizType, b.others.bizType)})` : ""}`, 140));
    add(row("Role", c.role, 60));
    add(row("Invoice name", c.invoiceName, 120));
    add(row("PO number", c.po, 40));
    if (c.kraPin.trim()) out.push(m.hidePin ? "KRA PIN: supplied (not shown or saved)" : `KRA PIN: ${clean(c.kraPin, 20)}`);
  }

  out.push("", PRICES_LINE, photoLine(b.photoCount), "", `CONTACT: ${clean(c.name, 80)}, ${m.phone}`);
  if (c.email.trim()) out.push(`Email: ${clean(c.email, 120)}`);
  const via = labelsOfO(contactChannels, b.contactChannels, b.others.contactChannels);
  if (via.length) out.push(`Reach me by: ${via.join(", ")}`);
  const hrs = labelsOfO(contactHours, b.contactHours, b.others.contactHours);
  if (hrs.length) out.push(`Best times: ${hrs.join(", ")}`);
  const lang = labelsOfO(languages, b.languages, b.others.languages);
  if (lang.length) out.push(`Language: ${lang.join(", ")}`);
  if (c.access.trim()) out.push(row("What would make this easier for me", c.access, compact ? 160 : 300));

  out.push("", "CONSENT",
    `Terms accepted: Custom Order Terms (${CUSTOM_TERMS_VERSION}), Terms of Sale (${TERMS_OF_SALE_VERSION}), Privacy Policy (${PRIVACY_VERSION}): ${c.termsOk ? "yes" : "no"}`);
  if (b.photoCount > 0) out.push(`Photo rights confirmed: ${c.photoOk ? "yes, for making my quote and my animal" : "no"}`);
  out.push(`Marketing messages: WhatsApp ${c.marketingWhatsapp ? "yes" : "no"}, email ${c.marketingEmail ? "yes" : "no"}`, `Consent text version: ${STUDIO_CONSENT_VERSION}`);
  if (m.siteUrl && !compact) out.push(`Sent from ${m.siteUrl.replace(/^https?:\/\//, "")}`);
  // The compact level drops blank lines to save room.
  return (compact ? out.filter((l) => l !== "") : out).join("\n");
}


/** Tightest message that still names every piece. Used when even the compact level is too long for the link. */
export function buildTightMessage(m: BriefMsg): string {
  const { brief: b, contact: c } = m;
  const out = [BRIEF_INTRO, `Ref: ${m.ref}`, `Kind: ${typeLabels(b).join(", ")}`];
  b.pieces.forEach((p, i) => {
    out.push(`PIECE ${i + 1} of ${b.pieces.length}: ${[baseText(p), sizeText(p), `count ${qtyText(p)}`, p.colours.slice(0, 2).map((x) => x.label).join("/")].filter(Boolean).join(" | ").slice(0, 110)}`);
  });
  const dl = deadlineText(b);
  if (dl) out.push(`Deadline: ${dl}`);
  const dest = b.addresses.map((a) => addressText(a)).filter(Boolean);
  if (dest.length) out.push(`Delivery (${dest.length}): ${clean(dest[0], 70)}${dest.length > 1 ? " and more" : ""}`);
  out.push(`CONTACT: ${clean(c.name, 60)}, ${m.phone}`,
    `Terms accepted (${CUSTOM_TERMS_VERSION}, ${TERMS_OF_SALE_VERSION}, ${PRIVACY_VERSION}): ${c.termsOk ? "yes" : "no"}`,
    "The full brief follows, I will paste it here next.");
  return out.join("\n");
}

export interface BriefPlan extends SendPlan {
  /** The full message with the KRA PIN hidden. This is the only copy kept on the device. */
  storedText: string;
}

/** Longest level whose encoded URL fits the budget. fullText is always the full message for copying. */
export function planBriefSend(number: string | undefined, m: BriefMsg): BriefPlan {
  const fullText = buildBriefMessage(m, "full");
  const storedText = buildBriefMessage({ ...m, hidePin: true }, "full");
  let last: BriefPlan | null = null;
  // full, then compact, then tight (every piece in one line each), then short (name and phone only).
  for (const step of ["full", "compact", "tight", "short"] as const) {
    const level: Level = step === "tight" ? "compact" : step;
    const text = step === "full" ? fullText : step === "tight" ? buildTightMessage(m) : buildBriefMessage(m, level);
    const url = buildWaUrl(number, text);
    last = { level, text, fullText, url, tooLong: false, pasteRest: step !== "full", storedText };
    if (!url || url.length <= URL_BUDGET) return last;
  }
  return { ...(last as BriefPlan), tooLong: true };
}
