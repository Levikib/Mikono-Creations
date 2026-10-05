// Order and enquiry messages for WhatsApp. Pure functions, no browser access except copyText.
import { sizeWord } from "./sizes";

export type Level = "full" | "compact" | "short";
/** pickup: a pickup point. collect: someone else collects. courier: a courier or bus parcel service the customer chooses. abroad: outside Kenya (an enquiry). other: in their own words. */
export type Fulfilment = "pickup" | "nairobi" | "town" | "courier" | "collect" | "abroad" | "other";

export interface MsgLine { sku: string; name: string; colourLabel: string; size: string; qty: number; note?: string }

export interface BusinessMsg {
  businessName?: string; businessType?: string; outletLocation?: string; volumeBand?: string; invoiceName?: string;
  /** Goes into the message to Mikono only. Never stored on the device, never in drafts, never in analytics. */
  kraPin?: string; poNumber?: string;
}
export interface ConsentSummary {
  whatsapp: boolean; email: boolean; occasion: boolean; terms: boolean;
  /** For example "Christmas, 20 December". Only used when occasion is true. */
  occasionText?: string;
  /** Version id of the consent texts the customer saw. */
  version: string;
  /** Version id of the terms acceptance text. */
  termsVersion?: string;
  /** Ready made line such as "Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT". */
  acceptedLine?: string;
}

/** One place in a split delivery, with the animals sent there. */
export interface DropMsg {
  label: string;
  fulfilment: Fulfilment;
  area?: string; areaOther?: string; county?: string; town?: string; landmark?: string; mapsPin?: string; other?: string;
  recipientName?: string; recipientPhone?: string; giftNote?: string;
  items: Array<{ sku: string; name: string; colourLabel: string; size: string; qty: number }>;
}

export interface OrderMsg {
  ref: string;
  lines: MsgLine[];
  /** Label such as "A shop or retailer". */
  customerType: string;
  name: string;
  phone: string;
  email?: string;
  /** Labels such as "WhatsApp" and "Afternoon". */
  contactChannel?: string;
  contactHours?: string;
  language?: string;
  business?: BusinessMsg;
  fulfilment: Fulfilment;
  area?: string;
  areaOther?: string;
  landmark?: string;
  county?: string;
  town?: string;
  /** The Other way to receive it, or the country and city when sending abroad. */
  other?: string;
  mapsPin?: string;
  deliveryNotes?: string;
  dateWish?: string;
  timeWindow?: string;
  callOnArrival?: boolean;
  /** An adult who receives the order. Never a child. */
  recipientName?: string;
  recipientPhone?: string;
  /** Present when the order goes to more than one place. */
  drops?: DropMsg[];
  giftNote?: string;
  anonymous?: boolean;
  sendDirect?: boolean;
  paymentNote?: string;
  /** Label such as "Pay a deposit now and the balance later". */
  paymentTiming?: string;
  /** Labels of the ways the customer may pay. Each is to be confirmed. */
  paymentMethods?: string[];
  notes?: string;
  /** "Anything that would make this easier for you?" Only in the message, never saved. */
  access?: string;
  about?: { occasions?: string[]; interests?: string[]; heardFrom?: string };
  consent: ConsentSummary;
  /** Pre-formatted attribution such as "instagram / paid / xmas-2026". Omitted when empty. */
  source?: string;
  siteUrl?: string;
}

export const URL_BUDGET = 2000;
export const PRICES_SENTENCE = "Prices are confirmed on WhatsApp.";
export const PRICES_DELIVERY_SENTENCE = "Prices and delivery are confirmed on WhatsApp.";

const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0, O, 1, I, L

/** Reference like MK-261001-7KQ2. Date is Africa/Nairobi (UTC+3, no daylight saving). */
export function generateRef(prefix = "MK", now: Date = new Date(), randomBytes?: (n: number) => Uint8Array): string {
  const t = new Date(now.getTime() + 3 * 3600 * 1000);
  const yy = String(t.getUTCFullYear()).slice(2);
  const mm = String(t.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(t.getUTCDate()).padStart(2, "0");
  const rnd = randomBytes ?? ((n: number) => globalThis.crypto.getRandomValues(new Uint8Array(n)));
  let out = "";
  while (out.length < 4) {
    for (const b of rnd(8)) {
      if (b < 248 && out.length < 4) out += REF_ALPHABET[b % 31]; // 248 = 31 * 8, avoids modulo bias
    }
  }
  return `${prefix}-${yy}${mm}${dd}-${out}`;
}

/** Removes control characters, collapses blank lines, trims, caps length. */
export function clean(text: string | undefined, max = 500): string {
  if (!text) return "";
  const s = text.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n").trim();
  return s.length > max ? s.slice(0, max).trimEnd() : s;
}

export function sourceFromAttribution(a: Record<string, string> | null | undefined): string {
  if (!a) return "";
  return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
}

function line(l: MsgLine, i: number, level: Level): string {
  // The SKU already names the animal, colour and size, so the compact line is just quantity and SKU.
  if (level === "compact") return `${i + 1}. ${l.qty}x ${l.sku}`;
  return `${i + 1}. ${l.qty} x ${l.name}, ${l.colourLabel}, ${sizeWord(l.size)}, SKU ${l.sku}`;
}

/** "WhatsApp updates, Newsletter by email" or "none". */
export function optInList(c: ConsentSummary): string {
  const list = [c.whatsapp ? "WhatsApp updates" : "", c.email ? "Newsletter by email" : "", c.occasion ? "Occasion reminder" : ""].filter(Boolean);
  return list.length ? list.join(", ") : "none";
}

const pushKv = (out: string[], label: string, value: string | undefined) => { if (value) out.push(`${label}: ${value}`); };

export function buildOrderMessage(o: OrderMsg, level: Level = "full"): string {
  const compact = level === "compact";
  const head = ["Hello Mikono Creations, I would like to order.", `Order ref: ${o.ref}`];
  if (o.source) head.push(`Source: ${o.source}`);

  if (level === "short") {
    return [
      ...head, "",
      `Name: ${clean(o.name, 80)}`,
      `Phone: ${o.phone}`,
      `Marketing opt-ins: ${optInList(o.consent)}`,
      "My full order is long, so I will paste it here next.",
    ].join("\n");
  }

  const out: string[] = [...head, "", "ITEMS"];
  o.lines.forEach((l, i) => {
    out.push(line(l, i, level));
    if (l.note && !compact) out.push(`   Note: ${clean(l.note, 120)}`);
  });
  if (compact) {
    const notes = o.lines.map((l, i) => (l.note ? `${i + 1}) ${clean(l.note, 60)}` : "")).filter(Boolean);
    if (notes.length) out.push(`Item notes: ${notes.join("; ").slice(0, 200)}`);
  }
  out.push(PRICES_DELIVERY_SENTENCE, "", "CUSTOMER");
  pushKv(out, "Type", o.customerType);
  out.push(`Name: ${clean(o.name, 80)}`, `Phone: ${o.phone}`);
  pushKv(out, "Email", o.email ? clean(o.email, 120) : "");
  if (o.contactChannel) out.push(`Reach me by: ${o.contactChannel}${o.contactHours && o.contactHours !== "Any time" ? `, ${o.contactHours.toLowerCase()}` : ""}`);
  if (!compact || (o.language && o.language !== "English")) pushKv(out, "Language", o.language);
  pushKv(out, "What would make this easier for me", o.access ? clean(o.access, compact ? 200 : 400) : "");

  const b = o.business;
  if (b && (b.businessName || b.businessType || b.outletLocation || b.volumeBand || b.invoiceName || b.kraPin || b.poNumber)) {
    out.push("", "BUSINESS");
    if (b.businessName) out.push(`Business: ${clean(b.businessName, 120)}${b.businessType ? ` (${b.businessType})` : ""}`);
    else pushKv(out, "Business type", b.businessType);
    pushKv(out, "Outlet", b.outletLocation ? clean(b.outletLocation, 120) : "");
    pushKv(out, "Volume", b.volumeBand);
    pushKv(out, "Invoice name", b.invoiceName ? clean(b.invoiceName, 120) : "");
    pushKv(out, "KRA PIN", b.kraPin ? clean(b.kraPin, 20) : "");
    pushKv(out, "PO number", b.poNumber ? clean(b.poNumber, 40) : "");
  }

  const place = (d: { fulfilment: Fulfilment; area?: string; areaOther?: string; town?: string; county?: string; landmark?: string; mapsPin?: string; other?: string }, into: string[]) => {
    if (d.fulfilment === "pickup") {
      into.push("Method: Pickup", "Pickup point: confirmed on WhatsApp");
    } else if (d.fulfilment === "collect") {
      into.push("Method: Someone else will collect it", "Who collects and where: confirmed on WhatsApp");
    } else if (d.fulfilment === "abroad") {
      into.push("Method: Send abroad (to be confirmed)");
      pushKv(into, "Country and city", d.other ? clean(d.other, 120) : "");
    } else if (d.fulfilment === "other") {
      into.push("Method: Other, in my own words");
      pushKv(into, "How", d.other ? clean(d.other, 200) : "");
    } else if (d.fulfilment === "courier") {
      into.push("Method: A courier or bus parcel service of my choice");
      into.push(`Town: ${clean(d.town, 80)}${d.county ? `, ${d.county} county` : ""}`);
      pushKv(into, "Parcel service or office", d.landmark ? clean(d.landmark, compact ? 120 : 200) : "");
    } else if (d.fulfilment === "nairobi") {
      into.push("Method: Delivery in Nairobi");
      into.push(`Area: ${d.area === "Other Nairobi area" && d.areaOther ? clean(d.areaOther, 80) : d.area ?? ""}`);
      pushKv(into, "Landmark", d.landmark ? clean(d.landmark, compact ? 120 : 200) : "");
    } else {
      into.push("Method: Delivery to another Kenyan town");
      into.push(`Town: ${clean(d.town, 80)}${d.county ? `, ${d.county} county` : ""}`);
      pushKv(into, "Landmark", d.landmark ? clean(d.landmark, compact ? 120 : 200) : "");
    }
    if (!compact) pushKv(into, "Map pin", d.mapsPin);
  };
  const common = (into: string[]) => {
    pushKv(into, "Notes", o.deliveryNotes ? clean(o.deliveryNotes, compact ? 100 : 300) : "");
    if (o.dateWish) into.push(`Date wish: ${o.dateWish}${o.timeWindow && o.timeWindow !== "Any time" ? `, ${o.timeWindow.toLowerCase()}` : ""}`);
    else if (o.timeWindow && o.timeWindow !== "Any time") into.push(`Time window: ${o.timeWindow.toLowerCase()}`);
    if (o.callOnArrival) into.push("Call me on arrival: yes");
  };
  if (o.drops && o.drops.length) {
    out.push("", `DELIVERY: ${o.drops.length} places`);
    common(out);
    out.push("Delivery fee: to be confirmed for each place");
    o.drops.forEach((d, i) => {
      out.push("", `PLACE ${i + 1} OF ${o.drops!.length}`);
      place(d, out);
      if (d.recipientName) out.push(`Receiving adult: ${clean(d.recipientName, 80)}${d.recipientPhone ? `, ${d.recipientPhone}` : ""}`);
      if (d.giftNote) out.push(`Gift note: "${clean(d.giftNote, compact ? 120 : 240)}"`);
      out.push("Items for this place:");
      d.items.forEach((it) => out.push(compact ? `- ${it.qty}x ${it.sku}` : `- ${it.qty} x ${it.name}, ${it.colourLabel}, ${sizeWord(it.size)}, SKU ${it.sku}`));
    });
  } else {
    out.push("", "DELIVERY");
    place(o, out);
    common(out);
    if (o.fulfilment !== "pickup" && o.fulfilment !== "collect") out.push("Delivery fee: to be confirmed");
    if (o.recipientName) out.push(`Receiving adult: ${clean(o.recipientName, 80)}${o.recipientPhone ? `, ${o.recipientPhone}` : ""}`);
  }

  if (o.giftNote || o.anonymous || o.sendDirect) {
    out.push("", "GIFT");
    if (o.giftNote) out.push(`Note: "${clean(o.giftNote, 240)}"`);
    if (o.anonymous) out.push("Do not say who it is from: yes");
    if (o.sendDirect) out.push("Deliver direct to the person receiving it: yes");
  }

  out.push("", "PAYMENT", "We arrange payment with you on WhatsApp.");
  pushKv(out, "When I would like to pay", o.paymentTiming);
  if (o.paymentMethods?.length) out.push(`Ways I may pay (to be confirmed): ${o.paymentMethods.join(", ")}`);
  if (o.paymentTiming || o.paymentMethods?.length) out.push("Payment details and the deposit amount are confirmed on WhatsApp.");
  if (o.paymentNote) out.push(`Payment note: ${clean(o.paymentNote, compact ? 120 : 300)}`);
  if (o.notes) out.push("", "NOTES", clean(o.notes, compact ? 200 : 500));

  const a = o.about;
  if (a && (a.occasions?.length || a.interests?.length || a.heardFrom)) {
    out.push("", "ABOUT ME");
    const suggest = [a.occasions?.length ? a.occasions.map((x) => x.split(",")[0]).filter((v, i, arr) => arr.indexOf(v) === i).join(", ") : "", a.interests?.length ? `likes ${a.interests.join(", ")}` : ""].filter(Boolean).join("; ");
    pushKv(out, "Help us suggest", suggest);
    pushKv(out, "Heard about us", a.heardFrom);
  }

  out.push("", "CONSENT", `Marketing opt-ins: ${optInList(o.consent)}`);
  if (o.consent.occasion && o.consent.occasionText) out.push(`Occasion: ${o.consent.occasionText}`);
  out.push(o.consent.terms && o.consent.acceptedLine ? o.consent.acceptedLine : `Terms of Sale and Privacy Policy accepted: ${o.consent.terms ? "yes" : "no"}${o.consent.termsVersion ? ` (${o.consent.termsVersion})` : ""}`, `Consent text version: ${o.consent.version}`);
  if (o.siteUrl && !compact) out.push(`Sent from ${o.siteUrl.replace(/^https?:\/\//, "")}`);
  return out.join("\n");
}

export interface EnquiryMsg {
  intro: string;
  ref: string;
  fields: Array<[label: string, value: string | readonly string[] | undefined]>;
  consentMarketing: boolean;
  source?: string;
  siteUrl?: string;
}

export function buildEnquiryMessage(e: EnquiryMsg): string {
  const out = [e.intro, `Ref: ${e.ref}`];
  if (e.source) out.push(`Source: ${e.source}`);
  out.push("");
  for (const [label, value] of e.fields) {
    if (Array.isArray(value) || (value && typeof value !== "string")) {
      const items = (value as readonly string[]).map((x) => clean(x, 160)).filter(Boolean);
      if (items.length === 1 && label !== "Contacts" && label !== "Animals of interest") out.push(`${label}: ${items[0]}`);
      else if (items.length) out.push(`${label}:`, ...items.map((x) => `- ${x}`));
      continue;
    }
    const v = clean(value as string | undefined, 800);
    if (v) out.push(`${label}: ${v}`);
  }
  out.push("", `Marketing messages: ${e.consentMarketing ? "Yes, I agree to news and offers" : "No"}`);
  if (e.siteUrl) out.push(`Sent from ${e.siteUrl.replace(/^https?:\/\//, "")}`);
  return out.join("\n");
}

/** Digits only. Returns "" when the number is unset. */
export function digitsOnly(n: string | undefined): string {
  return (n ?? "").replace(/\D/g, "");
}

export function buildWaUrl(number: string | undefined, text: string): string | null {
  const d = digitsOnly(number);
  if (!d) return null;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

export interface SendPlan { level: Level; text: string; fullText: string; url: string | null; tooLong: boolean; /** True when the text in the link is shorter than the full message, so the customer pastes the rest. */ pasteRest?: boolean }

/** Picks the longest level whose encoded URL fits the budget. fullText is always the full message for copying. */
export function planOrderSend(number: string | undefined, o: OrderMsg): SendPlan {
  const fullText = buildOrderMessage(o, "full");
  const levels: Level[] = ["full", "compact", "short"];
  let last: SendPlan | null = null;
  for (const level of levels) {
    const text = level === "full" ? fullText : buildOrderMessage(o, level);
    const url = buildWaUrl(number, text);
    last = { level, text, fullText, url, tooLong: false, pasteRest: level !== "full" };
    if (!url || url.length <= URL_BUDGET) return last;
  }
  return { ...(last as SendPlan), tooLong: true };
}

/** Same guard for enquiries: full text, else a short ref-only message with the full text copied. */
export function planEnquirySend(number: string | undefined, intro: string, ref: string, fullText: string): SendPlan {
  const url = buildWaUrl(number, fullText);
  if (!url || url.length <= URL_BUDGET) return { level: "full", text: fullText, fullText, url, tooLong: false, pasteRest: false };
  const short = `${intro}\nRef: ${ref}\nMy message is long, so I will paste it here next.`;
  return { level: "short", text: short, fullText, url: buildWaUrl(number, short), tooLong: false, pasteRest: true };
}

/** Clipboard write with a textarea fallback. Resolves true on success. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the textarea route */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
