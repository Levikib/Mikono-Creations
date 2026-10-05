// Enquiry forms (wholesale, partners, supply, custom, contact): shared model, validation and message fields.
// Pure functions. Several request types, several animals with a quantity band each, several locations and several contacts.
import { normalisePhone } from "./phone";
import { sizeWord } from "./sizes";
import { DEPOSIT_WORDING, PAYMENT_NOTE, paymentMethods, paymentTiming } from "../data/studio/payment";

export const QTY_BANDS = ["1 to 5", "6 to 19", "20 to 49", "50 to 99", "100 to 499", "500 or more", "Not sure yet"] as const;
/** Guards for the lists. The forms add rows as long as someone needs them and only say so when a limit is reached. */
export const MAX_PRODUCTS = 40;
export const MAX_OUTLETS = 40;
export const MAX_CONTACTS = 20;
export const OTHER_LABEL = "Other, tell us";
export const OTHER_TEXT_MAX = 120;

export const CONTACT_ROLES = ["Ordering contact", "Billing contact", "Delivery contact", "Decision maker", "Other contact"] as const;

export interface ProductInterest { slug: string; name: string; band: string; size: string }
export interface Outlet { name: string; place: string }
export interface ExtraContact { role: string; name: string; phone: string; email: string }

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export const emptyProduct = (): ProductInterest => ({ slug: "", name: "", band: "", size: "" });
export const emptyOutlet = (): Outlet => ({ name: "", place: "" });
export const emptyContact = (role: string = CONTACT_ROLES[1]): ExtraContact => ({ role, name: "", phone: "", email: "" });

/** Rows left blank are ignored. A row with an animal needs nothing else. */
export const filledProducts = (l: readonly ProductInterest[]) => l.filter((p) => p.slug);
export const filledOutlets = (l: readonly Outlet[]) => l.filter((o) => o.name.trim() || o.place.trim());
export const filledContacts = (l: readonly ExtraContact[]) => l.filter((c) => c.name.trim() || c.phone.trim() || c.email.trim());

export function validateExtras(o: { outlets?: readonly Outlet[]; contacts?: readonly ExtraContact[]; products?: readonly ProductInterest[] }): Record<string, string> {
  const e: Record<string, string> = {};
  (o.outlets ?? []).forEach((x, i) => {
    if ((x.name.trim() || x.place.trim()) && x.place.trim().length < 2) e[`outlet${i}_place`] = "Please add the town or area of this location.";
  });
  (o.contacts ?? []).forEach((c, i) => {
    if (!(c.name.trim() || c.phone.trim() || c.email.trim())) return;
    if (c.name.trim().length < 2) e[`contact${i}_name`] = "Please add this person's name.";
    if (!normalisePhone(c.phone).ok) e[`contact${i}_phone`] = "Please add a phone number, like 0712 345 678, or with the country code for a number abroad.";
    if (c.email.trim() && !emailOk(c.email)) e[`contact${i}_email`] = "That email does not look right yet. Check it, or leave it empty.";
  });
  return e;
}

/** Message lines. Lists become "- item" lines under their label. */
export const productLines = (l: readonly ProductInterest[]): string[] =>
  filledProducts(l).map((p) => `${p.name}${p.size ? `, ${sizeWord(p.size)}` : ""}${p.band ? ` (${p.band})` : ""}`);
export const outletLines = (l: readonly Outlet[]): string[] => filledOutlets(l).map((o) => [o.name.trim(), o.place.trim()].filter(Boolean).join(", "));
export const contactLines = (main: { role: string; name: string; phone: string; email: string }, extra: readonly ExtraContact[]): string[] => {
  const one = (c: { role: string; name: string; phone: string; email: string }) => {
    const ph = normalisePhone(c.phone);
    return `${c.role}: ${c.name.trim()}, ${ph.ok ? ph.e164 : c.phone.trim()}${c.email.trim() ? `, ${c.email.trim()}` : ""}`;
  };
  return [one(main), ...filledContacts(extra).map(one)];
};

export type Field = [label: string, value: string | readonly string[] | undefined];

/** Payment preference for trade enquiries: one timing choice, optional ways to pay (each to be confirmed). */
export interface PayPref { timing: string; methods: string[]; other: string }
export const emptyPay = (): PayPref => ({ timing: "", methods: [], other: "" });
export const validatePay = (p: PayPref): Record<string, string> => (p.methods.includes("other") && p.other.trim().length < 2 ? { payOther: "Tell us the other way you would like to pay, or untick Other." } : {});
export const payFields = (p: PayPref): Field[] => [
  ["When I would like to pay", paymentTiming.find((x) => x.id === p.timing) ? `${paymentTiming.find((x) => x.id === p.timing)!.label}${p.timing === "deposit" ? ` (${DEPOSIT_WORDING})` : ""}` : ""],
  ["Ways I may pay (to be confirmed)", p.methods.map((id) => (id === "other" ? (p.other.trim() ? `Other: ${p.other.trim()}` : "Other") : paymentMethods.find((m) => m.id === id)?.label ?? "")).filter(Boolean)],
  ...(p.timing || p.methods.length ? ([["Payment", PAYMENT_NOTE]] as Field[]) : []),
];

/** How and when to reply, in what language, and anything that would make it easier. All optional. */
export const REACH_CHANNELS = ["WhatsApp", "Phone call", "SMS", "Email", OTHER_LABEL] as const;
export const REACH_TIMES = ["Morning", "Afternoon", "Evening", "Weekends", "Any time"] as const;
export const REACH_LANGUAGES = ["English", "Kiswahili", OTHER_LABEL] as const;
export const ACCESS_QUESTION = "Anything that would make this easier for you?";
export const ACCESS_HINT = "For example large print messages, a call instead of messages, or help filling this in. It goes only into your message to us. We never save it.";
export const LANGUAGE_NOTE = "We reply in the language you write in, where we can.";
export interface Reach { channels: string[]; channelOther: string; times: string[]; languages: string[]; languageOther: string; access: string }
export const emptyReach = (): Reach => ({ channels: [], channelOther: "", times: [], languages: [], languageOther: "", access: "" });
export const reachHasValue = (r: Reach) => r.channels.length + r.times.length + r.languages.length > 0 || !!r.access.trim();

/** An Other choice reads "Other: what they typed". */
const withOtherText = (picked: readonly string[], other: string): string[] => picked.map((x) => (x === OTHER_LABEL ? (other.trim() ? `Other: ${other.trim().slice(0, OTHER_TEXT_MAX)}` : "Other") : x));

export function validateReach(r: Reach, email: string): Record<string, string> {
  const e: Record<string, string> = {};
  if (r.channels.includes(OTHER_LABEL) && r.channelOther.trim().length < 2) e.channelOther = "Tell us the other way to reach you, or untick Other.";
  if (r.channels.includes("Email") && !email.trim()) e.email = "You chose email as a way to reach you, so please add your email.";
  if (r.languages.includes(OTHER_LABEL) && r.languageOther.trim().length < 2) e.languageOther = "Tell us which language, or untick Other.";
  return e;
}

/** Message lines for the reply preferences. Empty ones are left out. */
export const reachFields = (r: Reach): Field[] => [
  ["Reach me by", withOtherText(r.channels, r.channelOther)], ["Best times", r.times.map((t) => t.toLowerCase())], ["Language", withOtherText(r.languages, r.languageOther)],
  ["What would make this easier for me", r.access.trim()],
];

/** Joins several choices for a one line field. */
export const joinChoices = (picked: readonly string[], other?: string): string[] => [...picked, ...(other && other.trim() ? [other.trim()] : [])];

export function wholesaleFields(v: {
  requests: string[]; requestOther?: string; business: string; businessKind?: string; main: { role: string; name: string; phone: string; email: string }; contacts: ExtraContact[];
  outlets: Outlet[]; sells: string[]; sellsOther: string; products: ProductInterest[]; quantities: string; notes: string; reach?: Reach; heard?: string[]; heardOther?: string; pay?: PayPref;
}): Field[] {
  return [
    ["Requests", withOtherText(v.requests, v.requestOther ?? "")], ["Business", v.business], ["Contacts", contactLines(v.main, v.contacts)], ["Locations", outletLines(v.outlets)],
    ["What they sell", joinChoices(v.sells, v.sellsOther)], ["Animals of interest", productLines(v.products)], ["Rough quantities", v.quantities.trim()], ["Notes", v.notes],
    ...(v.heard?.length ? ([["Heard about us", withOtherText(v.heard, v.heardOther ?? "")]] as Field[]) : []),
    ...(v.pay ? payFields(v.pay) : []),
    ...(v.reach ? reachFields(v.reach) : []),
  ];
}

/** Lead type for analytics when several requests are made: the most specific one. */
export function leadTypeFor(requests: readonly string[]): "quote" | "sample_pack" | "price_list" | "wholesale" {
  if (requests.includes("quote")) return "quote";
  if (requests.includes("sample pack")) return "sample_pack";
  if (requests.includes("price list")) return "price_list";
  return "wholesale";
}

/** Partner, supply and custom enquiries. */
export function tradeFields(v: {
  kind: "partner" | "supply" | "custom"; types: string[]; typeOther: string; org: string;
  main: { role: string; name: string; phone: string; email: string }; contacts: ExtraContact[]; outlets: Outlet[]; products: ProductInterest[]; message: string; reach?: Reach;
}): Field[] {
  const typeLabel = v.kind === "partner" ? "Kinds of partner" : v.kind === "supply" ? "What they supply" : "What to change";
  return [
    [typeLabel, joinChoices(v.types, v.typeOther)], ["Organisation", v.org], ["Contacts", contactLines(v.main, v.contacts)], ["Locations", outletLines(v.outlets)],
    ["Animals of interest", productLines(v.products)], ["Message", v.message],
    ...(v.reach ? reachFields(v.reach) : []),
  ];
}

export function contactFields(v: { topics: string[]; topicOther?: string; name: string; phone: string; email?: string; products: ProductInterest[]; message: string; reach?: Reach }): Field[] {
  const ph = normalisePhone(v.phone);
  return [["About", withOtherText(v.topics, v.topicOther ?? "")], ["Name", v.name], ["Phone", ph.ok ? ph.e164 : ""], ["Email", v.email?.trim() ?? ""], ["Animals asked about", productLines(v.products)], ["Message", v.message],
    ...(v.reach ? reachFields(v.reach) : [])];
}
