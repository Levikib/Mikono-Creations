// Contact and customer type, communication preferences, business details.
import type { Opt } from "./option";

const o = (id: string, label: string, help: string, extra: Partial<Opt> = {}): Opt => ({ id, label, help, impactsQuote: "none", ...extra });

export const customerTypes: (Opt & { business: boolean })[] = [
  { ...o("private", "An individual", "Ordering for myself", { icon: "heart" }), business: false },
  { ...o("gift-buyer", "Gift buyer", "Ordering for someone else", { icon: "gift" }), business: false },
  { ...o("family", "Family or carer", "Ordering for the people I look after or live with", { icon: "people" }), business: false },
  { ...o("diaspora", "Buying from outside Kenya", "Ordering from abroad, for here or for there", { icon: "pin" }), business: false },
  { ...o("collector", "Collector", "I collect handmade pieces", { icon: "sparkle" }), business: false },
  { ...o("teacher", "Teacher or educator", "For a class or a lesson", { icon: "book" }), business: false },
  { ...o("school", "School or ECD centre", "A school, nursery or learning centre", { icon: "people" }), business: true },
  { ...o("health", "Hospital or clinic", "A health centre or care home", { icon: "heart" }), business: true },
  { ...o("faith", "Church or faith group", "A congregation, mosque, temple or similar", { icon: "hands" }), business: true },
  { ...o("community", "Community group", "A chama, youth group, club or association", { icon: "people" }), business: true },
  { ...o("ngo", "NGO or charity", "A non-profit or a cause", { icon: "hands" }), business: true },
  { ...o("lodge_hotel", "Lodge or hotel", "Hospitality", { icon: "store" }), business: true },
  { ...o("restaurant", "Restaurant or cafe", "Food and drink", { icon: "store" }), business: true },
  { ...o("retailer", "Shop or boutique", "A shop that sells to the public", { icon: "store" }), business: true },
  { ...o("wholesale", "Wholesaler or stockist", "A business that sells to other shops", { icon: "store" }), business: true },
  { ...o("event-planner", "Event planner", "Ordering for a client's event", { icon: "people" }), business: true },
  { ...o("business", "Company or corporate", "A company or brand", { icon: "store" }), business: true },
  { ...o("government", "Government or public office", "A county, ministry or public body", { icon: "hands" }), business: true },
  { ...o("other", "Other, tell us", "Tell us in your own words", { icon: "info" }), business: false },
];

export const contactChannels: Opt[] = [
  o("whatsapp", "WhatsApp", "Message me on WhatsApp", { icon: "whatsapp" }),
  o("call", "Phone call", "Call me", { icon: "phone" }),
  o("sms", "SMS", "Send me a text message", { icon: "phone" }),
  o("email", "Email", "Write to me by email", { icon: "info" }),
  o("other", "Other, tell us", "Another way to reach you", { icon: "info" }),
];

export const contactHours: Opt[] = [
  o("morning", "Morning", "Before noon"),
  o("afternoon", "Afternoon", "Noon to 5pm"),
  o("evening", "Evening", "After 5pm"),
  o("weekend", "Weekends", "Saturday or Sunday"),
  o("any", "Any time", "Whenever suits you"),
  o("other", "Other, tell us", "Another time that suits you"),
];

export const languages: Opt[] = [
  o("english", "English", "English"),
  o("kiswahili", "Kiswahili", "Kiswahili"),
  o("other", "Other, tell us", "Another language"),
];
export const LANGUAGE_NOTE = "We reply in the language you write in, where we can.";

export const businessTypes: Opt[] = [
  o("company", "Company", "A registered company"),
  o("shop", "Shop or boutique", "A retail shop"),
  o("wholesale", "Wholesaler or distributor", "Sells to other shops"),
  o("lodge", "Lodge, hotel or restaurant", "Hospitality"),
  o("school", "School or ECD centre", "Education"),
  o("health", "Hospital or clinic", "Health"),
  o("faith", "Church or faith group", "A congregation"),
  o("ngo", "NGO or charity", "A non-profit"),
  o("planner", "Event planner", "Events"),
  o("club", "Club, chama or association", "A club or community group"),
  o("government", "Government or public body", "A public office"),
  o("other", "Other, tell us", "Another kind of organisation"),
];

/** Business detail fields. KRA PIN is optional, goes only into the WhatsApp message, and is never stored on the device or sent to analytics. */
export const businessFields = {
  name: { label: "Business or organisation name", max: 80 },
  role: { label: "Your role", max: 60, hint: "For example Procurement, Manager, Teacher" },
  invoiceName: { label: "Name for the invoice", max: 120, hint: "If different from the name above" },
  po: { label: "PO or reference number", max: 40 },
  kraPin: { label: "KRA PIN", max: 20, hint: "Optional. It goes only into your WhatsApp message. We never store it." },
} as const;

export const KRA_PIN_RE = /^[A-Za-z]\d{9}[A-Za-z]$/;
