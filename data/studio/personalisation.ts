// Personalisation. The owner offers every extra here. The cost is confirmed in the quote.
/** Shown wherever extras, features or colours are chosen. */
export const EXACT_LINE = "If we cannot do something exactly, we tell you before we start.";
import type { Opt } from "./option";

const o = (id: string, label: string, help: string, impactsQuote: Opt["impactsQuote"] = "low", icon?: Opt["icon"], extra: Partial<Opt> = {}): Opt =>
  ({ id, label, help, icon, impactsQuote, ...extra });

export const NAME_MAX = 20;
export const DATE_TEXT_MAX = 20;
export const MESSAGE_MAX = 40;
export const NAME_HINT = "A first name or a short word an adult chooses, in any script. Long names or special characters may need us to confirm. Never a full name, school or age.";

/** Things stitched or embroidered on the piece. Each opens its own short text field. */
export const stitched: (Opt & { field: "name" | "initials" | "date" | "message"; max: number; label2: string })[] = [
  { ...o("name", "A name or word", NAME_HINT, "low", "hook"), field: "name", max: NAME_MAX, label2: "The word or name" },
  { ...o("initials", "Initials", "One to three letters", "low", "hook"), field: "initials", max: 3, label2: "The initials" },
  { ...o("date", "A date", "A day, month or year to remember. Day and month are enough", "low", "hook"), field: "date", max: DATE_TEXT_MAX, label2: "The date" },
  { ...o("message", "A short message", "A few words, for example Welcome", "medium", "hook"), field: "message", max: MESSAGE_MAX, label2: "The message" },
];

/** Clothing and wearable extras. */
export const wearables: Opt[] = [
  o("outfit", "An outfit", "A full outfit for the animal", "medium", "hook"),
  o("scarf", "A scarf", "A crocheted scarf", "low"),
  o("vest", "A vest", "A small vest", "low"),
  o("dress", "A dress", "A crocheted dress", "medium"),
  o("hat", "A hat", "A small hat", "low"),
  o("bag", "A bag", "A tiny bag to carry", "low", "bag"),
  o("accessory", "Another accessory", "Glasses, a bow or a small extra", "low"),
  o("headwrap", "A headwrap or kanga", "A small wrap in a fabric or yarn", "low"),
  o("traditional", "A traditional outfit", "Tell us the style in the notes", "medium"),
  o("badge", "A badge or sash", "A small badge or sash with a short word", "low"),
  o("ribbon", "A ribbon", "A ribbon bow or sash", "low"),
];

/** Branding finishes for businesses. Logos need proof of rights (see inspiration.ts). */
export const finishes: (Opt & { logo?: boolean })[] = [
  { ...o("branded-tag", "A branded tag", "A tag with your brand name", "medium", "package"), logo: true },
  { ...o("logo", "Logo included", "A logo as a patch or stitching idea", "high", "store"), logo: true },
  o("hang-tag", "A hang tag", "A plain tag with a short line", "low", "package"),
  o("care-tag", "A care card", "A small card on how to look after it", "low", "package"),
];

/** Order level packaging and wrapping. */
export const packaging: Opt[] = [
  o("plain", "Plain packaging", "Simple and ready to carry", "none", "package"),
  o("gift-wrap", "Gift wrap", "Wrapped as a gift", "low", "gift"),
  o("gift-box", "Gift box", "A box for each piece", "medium", "package"),
  o("gift-card", "A gift card with a note", "A card with a short message", "low", "gift"),
  o("branded-pack", "Branded packaging", "Packaging with your brand", "high", "package"),
  o("bulk-pack", "Packed in bulk", "Many pieces in one box or bag", "low", "package"),
  o("individual-bag", "Each piece in its own bag", "A clear or cloth bag for each", "low", "package"),
];

export const wrappingStyles: Opt[] = [
  o("natural", "Natural paper and string", "Plain and earthy", "none"),
  o("colour", "In my colours", "Wrapping in colours you choose", "low"),
  o("event", "Matched to my event", "To go with a theme", "low"),
];

export const GIFT_CARD_MAX = 120;
export const GIFT_CARD_HINT = "A few words for the card. Please do not include a child's name, age or school.";
