// Delivery. Fees are never shown: they read "to be confirmed" until the owner supplies them.
// All delivery options are offered. Abroad is an enquiry: we say what is possible.
import type { Opt } from "./option";

const o = (id: string, label: string, help: string, extra: Partial<Opt> = {}): Opt => ({ id, label, help, impactsQuote: "low", ...extra });

export const deliveryMethods: Opt[] = [
  o("pickup", "Collect from a pickup point", "The point and times are confirmed on WhatsApp", { icon: "pin", impactsQuote: "none" }),
  o("someone-collects", "Someone else will collect", "A person I name on WhatsApp will collect it", { icon: "people", impactsQuote: "none" }),
  o("nairobi", "Delivery in Nairobi", "To an area in Nairobi", { icon: "truck" }),
  o("town", "Another Kenyan town", "Sent to any county or town in Kenya", { icon: "truck", impactsQuote: "medium" }),
  o("courier", "A courier or bus parcel service of my choice", "I book the courier or bus, or you use yours", { icon: "package" }),
  o("gift-direct", "Straight to the person receiving it", "Delivered to an adult recipient. Not a child", { icon: "gift" }),
  o("international", "Send abroad (ask us)", "An enquiry for abroad or for family in the diaspora", { icon: "pin", impactsQuote: "high" }),
  o("other", "Other, tell us", "Another way you would like it to reach you", { icon: "info" }),
];

export const MAX_ADDRESSES = 20;
export const OTHER_DELIVERY_NOTE = "Tell us how you would like it to reach you. We confirm what is possible.";
export const COLLECT_NOTE = "Someone else can collect. Give us their name on WhatsApp when we confirm.";
export const AREA_TOWN_LABEL = "Another Kenyan town";
export const FEE_LINE = "Delivery cost depends on where it is going and is confirmed in your quote.";
export const INTERNATIONAL_NOTE = "We have not confirmed shipping abroad yet. Tell us the country and we will say what is possible.";
export const GIFT_DIRECT_NOTE = "Give the name and phone of the adult who will receive it. We never ask for a child's name.";
export const MULTI_NOTE = "Several addresses? Add each one. Say how many pieces go to each.";
export const SITE_LABEL_MAX = 60;
