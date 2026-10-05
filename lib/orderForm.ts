// Order wizard model v2: form shape, steps, validation, draft and order summary storage (D14 to D17, strategy/16 section 2).
import { daysInMonth, isB2b, customerTypes, customerTypesLabel, contactChannels, contactHoursOptions, languages, timeWindows, MAX_OCCASIONS, OCCASION_OTHER, INTEREST_OTHER, HEARD_OTHER, BUSINESS_OTHER, OTHER_TEXT_MAX, type ContactChannel, type ContactHours, type CustomerType, type Language, type TimeWindow } from "@/data/checkout";
import type { ConsentPurpose } from "@/data/consent";
import { DEPOSIT_WORDING, paymentMethods, paymentTiming } from "@/data/studio/payment";
import { OTHER_AREA } from "@/data/deliveryAreas";
import { monthNames } from "@/data/checkout";
import { normalisePhone } from "./phone";
import { KEYS, RETENTION } from "./storageKeys";
import type { Fulfilment, OrderMsg, MsgLine } from "./whatsapp";
import { PROFILE_FIELDS, type Profile } from "./profile";
import { stripKraLines } from "./sentMessage";
import { dropItems, dropLabel, syncAlloc, validateSplit, type Drop, type SplitLine } from "./split";

/** other holds what the person typed when the type is Other. Day and month only, never a year. */
export interface Occasion { type: string; day: string; month: string; other?: string }
export const emptyOccasion = (): Occasion => ({ type: "", day: "", month: "", other: "" });

export interface Form {
  /** More than one can apply, for example a gift and a company. */
  customerTypes: CustomerType[];
  /** What the person typed for "Other, tell us". Short free text. */
  customerOther: string;
  name: string; phone: string; email: string;
  contactChannels: ContactChannel[]; contactHours: ContactHours; language: Language;
  channelOther: string; langOther: string;
  fulfilment: "" | Fulfilment;
  /** How they would like it to reach them, for Other, or the country and city when sending abroad. */
  fulfilmentOther: string;
  area: string; areaOther: string; landmark: string; deliveryNotes: string; county: string; town: string; mapsPin: string;
  recipientDifferent: boolean; recipientName: string; recipientPhone: string;
  dateWish: string; /** "asap" or "flexible" instead of a date. */ dateFlex: "" | "date" | "asap" | "flexible"; timeWindow: TimeWindow; callOnArrival: boolean;
  giftNote: string; anonymous: boolean; sendDirect: boolean;
  businessName: string; businessType: string; businessTypeOther: string; outletLocation: string; volumeBand: string; invoiceName: string; poNumber: string;
  /** Soft optional. Held in React state and put in the WhatsApp message only. Never written to the draft, the profile or any event. */
  kraPin: string;
  occasions: Occasion[]; interests: string[]; interestOther: string; heardFrom: string[]; heardOther: string;
  /** Send to more than one place. Then drops holds every place and the delivery fields above are not used. */
  split: boolean; drops: Drop[];
  paymentNote: string; notes: string;
  /** full, deposit, pod, pickup or suggest (data/studio/payment.ts). */
  payTiming: string; payMethods: string[]; payOther: string;
  /** "Anything that would make this easier for you?" Goes only into the WhatsApp message. Never written to the draft or the profile. */
  access: string;
}

export const emptyForm: Form = {
  customerTypes: [], customerOther: "", name: "", phone: "", email: "", contactChannels: ["whatsapp"], contactHours: "anytime", language: "en", channelOther: "", langOther: "",
  fulfilment: "", fulfilmentOther: "", area: "", areaOther: "", landmark: "", deliveryNotes: "", county: "", town: "", mapsPin: "",
  recipientDifferent: false, recipientName: "", recipientPhone: "",
  dateWish: "", dateFlex: "", timeWindow: "anytime", callOnArrival: false,
  giftNote: "", anonymous: false, sendDirect: false,
  businessName: "", businessType: "", businessTypeOther: "", outletLocation: "", volumeBand: "", invoiceName: "", poNumber: "", kraPin: "",
  occasions: [], interests: [], interestOther: "", heardFrom: [], heardOther: "",
  split: false, drops: [],
  paymentNote: "", notes: "", access: "", payTiming: "", payMethods: [], payOther: "",
};

/** Consent choices and the terms tick. React state only: never in the draft, never in the profile. */
export type Ticks = Record<ConsentPurpose, boolean>;
export const noTicks: Ticks = { whatsapp_updates: false, email_newsletter: false, occasion_reminders: false, terms_acknowledged: false };

export type StepId = "who" | "details" | "delivery" | "gift" | "business" | "about" | "review";
export const stepTitles: Record<StepId, string> = {
  who: "Who is ordering", details: "Your details", delivery: "Delivery or pickup", gift: "Gift options",
  business: "Business details", about: "About you", review: "Review and send",
};
/** Steps in order. Gift and About can be skipped, Business appears for shops, lodges, schools and companies. */
export function stepList(o: { skipGift: boolean; skipAbout: boolean; b2b: boolean }): StepId[] {
  const l: StepId[] = ["who", "details", "delivery"];
  if (!o.skipGift) l.push("gift");
  if (o.b2b) l.push("business");
  if (!o.skipAbout) l.push("about");
  l.push("review");
  return l;
}

export type Errors = Record<string, string>;
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** Tomorrow in Africa/Nairobi as YYYY-MM-DD. */
export function tomorrowISO(now: Date = new Date()): string {
  return new Date(now.getTime() + 27 * 3600 * 1000).toISOString().slice(0, 10);
}
/** A year from today in Africa/Nairobi. */
export function maxDateISO(now: Date = new Date()): string {
  return new Date(now.getTime() + (365 * 24 + 3) * 3600 * 1000).toISOString().slice(0, 10);
}

/** Google Maps links only: maps.app.goo.gl, goo.gl/maps and google.com/maps, https. */
export function validMapsUrl(s: string): boolean {
  const v = s.trim();
  if (!v || v.length > 300) return false;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:") return false;
    const h = u.hostname.toLowerCase();
    if (h === "maps.app.goo.gl") return u.pathname.length > 1;
    if (h === "goo.gl") return u.pathname.startsWith("/maps");
    if (h === "google.com" || h === "www.google.com" || h === "maps.google.com") return u.pathname.startsWith("/maps");
    return false;
  } catch { return false; }
}

/** Soft check for a KRA PIN: a letter, nine digits and a letter. A mismatch is a warning only, never a block. */
export const kraLooksValid = (s: string) => /^[AP]\d{9}[A-Z]$/i.test(s.trim());

export function occasionDone(o: Occasion): boolean {
  const m = Number(o.month), d = Number(o.day);
  return Boolean(o.type) && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth[m - 1];
}
/** The occasions that are fully filled in (type, day and month). */
export const completeOccasions = (f: Form): Occasion[] => f.occasions.filter(occasionDone).slice(0, MAX_OCCASIONS);
export const occasionComplete = (f: Form): boolean => completeOccasions(f).length > 0;
export const occasionLine = (o: Occasion): string => `${o.type === OCCASION_OTHER ? ((o.other ?? "").trim() ? `Other: ${(o.other ?? "").trim().slice(0, OTHER_TEXT_MAX)}` : "Other") : o.type}, ${Number(o.day)} ${monthNames[Number(o.month) - 1]}`;
export const occasionText = (f: Form): string => completeOccasions(f).map(occasionLine).join("; ");

export interface Ctx { minDate: string; maxDate: string; lines?: SplitLine[] }

export function validateStep(step: StepId, f: Form, ctx: Ctx): Errors {
  const e: Errors = {};
  if (step === "who") {
    if (!f.customerTypes.length) e.customerType = "Please choose at least one answer that fits you. Other, tell us is always there.";
    else if (f.customerTypes.length === 1 && f.customerTypes[0] === "other" && f.customerOther.trim().length < 2) e.customerOther = "Please tell us in a few words who is ordering, or choose another answer.";
  }
  if (step === "details") {
    if (f.name.trim().length < 2) e.name = "Please add your name so we know who to reply to. One name is enough.";
    if (!normalisePhone(f.phone).ok) e.phone = "Please add a phone number we can reach on WhatsApp. For example 0712 345 678, or with the country code, like +44 7911 123456.";
    if (f.email.trim() && !emailOk(f.email)) e.email = "That email does not look right yet. Check it, or leave it empty.";
    else if (f.contactChannels.includes("email") && !f.email.trim()) e.email = "You chose email as a way to reach you, so please add your email.";
    if (!f.contactChannels.length) e.contactChannel = "Please choose at least one way to reach you.";
    else if (f.contactChannels.includes("other") && f.channelOther.trim().length < 2) e.channelOther = "Tell us the other way to reach you, or untick Other.";
    if (f.language === "other" && f.langOther.trim().length < 2) e.langOther = "Tell us which language, or choose English or Kiswahili.";
  }
  if (step === "delivery") {
    if (f.split) {
      Object.assign(e, validateSplit(ctx.lines ?? [], f.drops, validMapsUrl));
    } else {
      if (!f.fulfilment) e.fulfilment = "Please choose how you would like to get it. Other, tell us is always there.";
      if (f.fulfilment === "nairobi") {
        if (!f.area) e.area = "Please choose your area. If it is not listed, choose Other Nairobi area.";
        else if (f.area === OTHER_AREA && f.areaOther.trim().length < 2) e.areaOther = "Please tell us the area.";
        if (f.landmark.trim().length < 3) e.landmark = "Please add an estate, street, building or landmark.";
      }
      if (f.fulfilment === "town" || f.fulfilment === "courier") {
        if (!f.county) e.county = "Please choose the county.";
        if (f.town.trim().length < 2) e.town = "Please add the town.";
      }
      if (f.fulfilment === "abroad" && f.fulfilmentOther.trim().length < 2) e.fulfilmentOther = "Please tell us the country and city.";
      if (f.fulfilment === "other" && f.fulfilmentOther.trim().length < 2) e.fulfilmentOther = "Please tell us how you would like it to reach you.";
      if (f.mapsPin.trim() && !validMapsUrl(f.mapsPin)) e.mapsPin = "That does not look like a Google Maps link. Leave it empty if you prefer.";
      if (f.recipientDifferent) {
        if (f.recipientName.trim().length < 2) e.recipientName = "Please add the name of the adult who will receive it.";
        if (!normalisePhone(f.recipientPhone).ok) e.recipientPhone = "Please add that adult's phone number, like 0712 345 678.";
      }
    }
    if (f.dateFlex === "asap" || f.dateFlex === "flexible") { /* a flexible or urgent wish needs no date */ }
    else if (f.dateWish && f.dateWish < ctx.minDate) e.dateWish = "Please pick a day from tomorrow on, or leave it empty.";
    else if (f.dateWish && f.dateWish > ctx.maxDate) e.dateWish = "Please pick a day within the next year, or leave it empty.";
  }
  if (step === "gift" && f.sendDirect && !f.split) {
    if (f.recipientName.trim().length < 2) e.recipientName = "Please add the name of the adult who will receive it.";
    if (!normalisePhone(f.recipientPhone).ok) e.recipientPhone = "Please add that adult's phone number, like 0712 345 678.";
  }
  if (step === "business") {
    if (f.businessName.trim().length < 2) e.businessName = "Please add the name of your business or organisation.";
    if (f.businessType === BUSINESS_OTHER && f.businessTypeOther.trim().length < 2) e.businessTypeOther = "Tell us the kind of business, or choose another.";
  }
  if (step === "about") {
    f.occasions.forEach((o, i) => {
      if ((o.type || o.day || o.month) && !occasionDone(o)) e[`occasion${i}_type`] = "To use an occasion, choose the type, the day and the month. Or remove it.";
      else if (o.type === OCCASION_OTHER && (o.other ?? "").trim().length < 2) e[`occasion${i}_other`] = "Tell us the occasion in a few words, or choose one from the list.";
    });
  }
  return e;
}

/** The review step: the terms tick is required, a ticked reminder or newsletter needs what it uses. */
export function validateReview(f: Form, t: Ticks): Errors {
  const e: Errors = {};
  if (!t.terms_acknowledged) e.terms_acknowledged = "Please tick to confirm you have read and accept the terms.";
  if (t.email_newsletter && !emailOk(f.email)) e.email_newsletter = "To send the newsletter we need your email. Add it under Your details, or untick this.";
  if (f.payMethods.includes("other") && f.payOther.trim().length < 2) e.payOther = "Tell us the other way you would like to pay, or untick Other.";
  if (t.occasion_reminders && !occasionComplete(f)) e.occasion_reminders = "Add at least one occasion with its day and month in About you, or untick this.";
  return e;
}

export function validateAll(list: StepId[], f: Form, ctx: Ctx, t: Ticks): { step: StepId; errors: Errors } | null {
  for (const s of list) {
    if (s === "review") {
      const errors = validateReview(f, t);
      if (Object.keys(errors).length) return { step: s, errors };
      continue;
    }
    const errors = validateStep(s, f, ctx);
    if (Object.keys(errors).length) return { step: s, errors };
  }
  return null;
}

const label = <T extends { value: string; label: string }>(list: T[], v: string) => list.find((x) => x.value === v)?.label ?? "";

export function toOrderMsg(f: Form, lines: MsgLine[], ref: string, t: Ticks, source: string, siteUrl: string, consentVersion: string, termsVersion = "", acceptedLine = ""): OrderMsg {
  const ph = normalisePhone(f.phone);
  const rp = normalisePhone(f.recipientPhone);
  const b2b = isB2b(f.customerTypes);
  const receiving = !f.split && (f.recipientDifferent || f.sendDirect);
  const biz = b2b ? {
    businessName: f.businessName.trim() || undefined, businessType: f.businessType === BUSINESS_OTHER ? (f.businessTypeOther.trim() ? `Other: ${f.businessTypeOther.trim()}` : "Other") : f.businessType || undefined, outletLocation: f.outletLocation.trim() || undefined,
    volumeBand: f.volumeBand || undefined, invoiceName: f.invoiceName.trim() || undefined, kraPin: f.kraPin.trim().toUpperCase() || undefined, poNumber: f.poNumber.trim() || undefined,
  } : undefined;
  const occ = completeOccasions(f);
  const hasAbout = occ.length || f.interests.length || f.heardFrom.length;
  const splitLines: SplitLine[] = lines;
  const drops = f.split ? syncAlloc(splitLines, f.drops).map((d, i) => ({
    label: dropLabel(d, i).replace(/^Place \d+:? ?/, ""),
    fulfilment: d.fulfilment as Fulfilment, area: d.area || undefined, areaOther: d.areaOther || undefined, county: d.county || undefined, town: d.town || undefined, other: d.other.trim() || undefined,
    landmark: d.landmark || undefined, mapsPin: d.mapsPin.trim() && validMapsUrl(d.mapsPin) ? d.mapsPin.trim() : undefined,
    recipientName: d.recipientName.trim() || undefined, recipientPhone: normalisePhone(d.recipientPhone).ok ? (normalisePhone(d.recipientPhone) as { e164: string }).e164 : undefined,
    giftNote: d.giftNote.trim() || undefined,
    items: dropItems(splitLines, d).map((l) => ({ sku: l.sku, name: l.name, colourLabel: l.colourLabel, size: l.size, qty: l.qty })),
  })) : undefined;
  return {
    ref, lines,
    customerType: customerTypesLabel(f.customerTypes, f.customerOther),
    name: f.name, phone: ph.ok ? ph.e164 : f.phone.trim(), email: f.email.trim() || undefined,
    contactChannel: f.contactChannels.map((c) => (c === "other" ? (f.channelOther.trim() ? `Other: ${f.channelOther.trim()}` : "Other") : label(contactChannels, c))).filter(Boolean).join(", ") || undefined,
    contactHours: f.contactChannels.includes("call") ? label(contactHoursOptions, f.contactHours) || undefined : undefined,
    language: f.language === "other" ? (f.langOther.trim() ? `Other: ${f.langOther.trim()}` : "Other") : label(languages, f.language) || undefined,
    business: biz,
    fulfilment: (f.fulfilment || (drops ? "nairobi" : "pickup")) as Fulfilment,
    area: f.area || undefined, areaOther: f.areaOther || undefined, landmark: f.landmark || undefined,
    county: f.county || undefined, town: f.town || undefined, other: f.fulfilmentOther.trim() || undefined,
    mapsPin: f.mapsPin.trim() && validMapsUrl(f.mapsPin) ? f.mapsPin.trim() : undefined,
    deliveryNotes: f.deliveryNotes || undefined, dateWish: f.dateFlex === "asap" ? "As soon as possible" : f.dateFlex === "flexible" ? "Flexible, any date is fine" : f.dateWish || undefined,
    timeWindow: ((f.fulfilment !== "pickup" && f.fulfilment !== "collect") || drops) ? label(timeWindows, f.timeWindow) || undefined : undefined,
    callOnArrival: ((f.fulfilment !== "pickup" && f.fulfilment !== "collect") || drops) ? f.callOnArrival : undefined,
    recipientName: receiving ? f.recipientName.trim() || undefined : undefined,
    recipientPhone: receiving && rp.ok ? rp.e164 : undefined,
    drops,
    giftNote: f.split ? undefined : f.giftNote || undefined, anonymous: f.anonymous || undefined, sendDirect: !f.split && f.sendDirect ? true : undefined,
    paymentNote: f.paymentNote.trim() || undefined,
    paymentTiming: paymentTiming.find((x) => x.id === f.payTiming) ? `${paymentTiming.find((x) => x.id === f.payTiming)!.label}${f.payTiming === "deposit" ? ` (${DEPOSIT_WORDING})` : ""}` : undefined,
    paymentMethods: f.payMethods.length ? f.payMethods.map((id) => (id === "other" ? (f.payOther.trim() ? `Other: ${f.payOther.trim()}` : "Other") : paymentMethods.find((m) => m.id === id)?.label ?? "")).filter(Boolean) : undefined, notes: f.notes || undefined, access: f.access.trim() || undefined,
    about: hasAbout ? {
      occasions: occ.length ? occ.map(occasionLine) : undefined,
      interests: f.interests.length ? f.interests.map((x) => (x === INTEREST_OTHER ? (f.interestOther.trim() ? `Other: ${f.interestOther.trim()}` : "Other") : x)) : undefined,
      heardFrom: f.heardFrom.length ? f.heardFrom.map((x) => (x === HEARD_OTHER ? (f.heardOther.trim() ? `Other: ${f.heardOther.trim()}` : "Other") : x)).join(", ") : undefined,
    } : undefined,
    consent: {
      whatsapp: t.whatsapp_updates, email: t.email_newsletter, occasion: t.occasion_reminders && occ.length > 0,
      terms: t.terms_acknowledged, termsVersion: termsVersion || undefined, acceptedLine: acceptedLine || undefined, occasionText: t.occasion_reminders && occ.length ? occasionText(f) : undefined, version: consentVersion,
    },
    source: source || undefined, siteUrl: siteUrl || undefined,
  };
}

/** Wrapper so event handlers can read the clock. */
export const nowMs = () => Date.now();

/* ---------- storage ---------- */
export const DRAFT_KEY = KEYS.draft;
export const ORDERS_KEY = KEYS.orders;
const DRAFT_TTL = RETENTION.draftHours * 3600 * 1000;

export interface Sent { message: string; text: string; level: string; at: number; pasteRest?: boolean }
export interface Draft { v: 3; updatedAt: number; step: StepId; skipGift: boolean; skipAbout: boolean; form: Form; ref?: string; sent?: Sent }

const STEP_IDS: StepId[] = ["who", "details", "delivery", "gift", "business", "about", "review"];

/** The form as it is written to the draft: no KRA PIN and no accessibility note, ever. */
export function formForDraft(f: Form): Omit<Form, "kraPin" | "access"> {
  const { kraPin: _k, access: _a, ...rest } = f;
  void _k; void _a;
  return rest;
}

export function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (d?.v !== 3 || typeof d.updatedAt !== "number" || !d.form || typeof d.form !== "object") throw new Error("shape");
    if (Date.now() - d.updatedAt > DRAFT_TTL) { window.localStorage.removeItem(DRAFT_KEY); return null; }
    const step = STEP_IDS.includes(d.step) ? d.step : "who";
    const strs = (x: unknown): string[] => (Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : []);
    const form: Form = {
      ...emptyForm, ...d.form, kraPin: "", access: "",
      customerTypes: strs(d.form.customerTypes) as Form["customerTypes"], contactChannels: (strs(d.form.contactChannels).length ? strs(d.form.contactChannels) : ["whatsapp"]) as Form["contactChannels"],
      interests: strs(d.form.interests), heardFrom: strs(d.form.heardFrom), payMethods: strs(d.form.payMethods),
      occasions: Array.isArray(d.form.occasions) ? d.form.occasions.filter((o) => o && typeof o === "object").map((o) => ({ ...emptyOccasion(), ...o })).slice(0, MAX_OCCASIONS) : [],
      drops: Array.isArray(d.form.drops) ? d.form.drops.filter((o) => o && typeof o === "object") : [],
    };
    return { ...d, step, form, skipGift: Boolean(d.skipGift), skipAbout: Boolean(d.skipAbout) };
  } catch {
    try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    return null;
  }
}
export function writeDraft(d: Omit<Draft, "v" | "updatedAt" | "form"> & { form: Form }) {
  try {
    const sent = d.sent ? { ...d.sent, message: stripKraLines(d.sent.message), text: stripKraLines(d.sent.text) } : undefined;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: 3, updatedAt: Date.now(), ...d, form: formForDraft(d.form), sent }));
  } catch { /* storage blocked */ }
}
export function clearDraft() {
  try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}
/** True when the person has typed something worth resuming. The default contact choices do not count. */
export function hasContent(f: Form): boolean {
  return (Object.keys(emptyForm) as Array<keyof Form>).some((k) => {
    const a = f[k], b = emptyForm[k];
    return Array.isArray(a) ? a.length > 0 : a !== b;
  });
}

const ENUMS: Record<string, string[]> = {
  customerTypes: customerTypes.map((c) => c.value),
  contactChannels: contactChannels.map((c) => c.value),
  contactHours: contactHoursOptions.map((c) => c.value),
  language: languages.map((c) => c.value),
  fulfilment: ["pickup", "nairobi", "town"],
};

/** Fills the form from the device profile. Only fields that are still empty are filled, so a draft always wins. */
export function applyProfile(f: Form, p: Profile): Form {
  const next = { ...f } as unknown as Record<string, unknown>;
  const cur = f as unknown as Record<string, unknown>;
  const def = emptyForm as unknown as Record<string, unknown>;
  for (const k of PROFILE_FIELDS) {
    const v = p[k] as unknown;
    const allowed = ENUMS[k];
    if (Array.isArray(v)) {
      const ok = v.filter((x) => typeof x === "string" && (!allowed || allowed.includes(x)));
      const c = cur[k] as unknown[];
      const d = def[k] as unknown[];
      if (ok.length && (c.length === 0 || JSON.stringify(c) === JSON.stringify(d))) next[k] = ok;
      continue;
    }
    if (typeof v !== "string" || !v) continue;
    if (allowed && !allowed.includes(v)) continue;
    if (cur[k] === "" || cur[k] === def[k]) next[k] = v;
  }
  return next as unknown as Form;
}

/** Last 10 orders: ref, time and item summary only. Never a name, phone or address (D16). */
export interface OrderSummary { ref: string; at: number; items: Array<{ sku: string; qty: number }> }
export function readOrders(): OrderSummary[] {
  try {
    const a = JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "[]");
    return Array.isArray(a) ? a.filter((o) => o && typeof o.ref === "string" && Array.isArray(o.items)) : [];
  } catch { return []; }
}
export function saveOrderSummary(ref: string, items: Array<{ sku: string; qty: number }>) {
  try {
    const rest = readOrders().filter((o) => o.ref !== ref);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([{ ref, at: Date.now(), items: items.map((i) => ({ sku: i.sku, qty: i.qty })) }, ...rest].slice(0, RETENTION.ordersMax)));
  } catch { /* ignore */ }
}

