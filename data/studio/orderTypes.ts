// Order types. An order can have several (a baby shower that is also a gift), so the Studio lets people tick more than one.
// Nothing here carries a price, lead time or promise. The owner takes every kind of work listed here.
import type { Opt } from "./option";

export type TypeGroup = "personal" | "gift" | "event" | "business" | "community" | "special";

export interface OrderTypeDef extends Opt {
  group: TypeGroup;
  /** Leans to bulk work: opens the quantity bands, the business section and several delivery addresses. */
  bulk?: boolean;
  /** Business or organisation work: opens business details. */
  business?: boolean;
  /** Reference photos or a drawing are the main input. */
  reference?: "pet" | "drawing" | "photo";
  /** Gentle copy, a phone call offered, no upsell. */
  gentle?: boolean;
  /** A logo or brand mark is likely: asks for proof of rights. */
  logo?: boolean;
  /** Suggested base form ids (see baseForms.ts). */
  suggestBase?: string[];
  /** Suggested customer type id (see customer.ts). */
  suggestCustomer?: string;
}

export const typeGroups: { id: TypeGroup; label: string }[] = [
  { id: "personal", label: "For me or someone I know" },
  { id: "gift", label: "Gifts and keepsakes" },
  { id: "event", label: "Events and celebrations" },
  { id: "business", label: "For a business" },
  { id: "community", label: "Schools, charities and causes" },
  { id: "special", label: "Special formats" },
];

const t = (id: string, label: string, help: string, group: TypeGroup, icon: Opt["icon"], extra: Partial<OrderTypeDef> = {}): OrderTypeDef =>
  ({ id, label, help, group, icon, impactsQuote: "medium", ...extra });

/** 29 types. The owner removes any she will not take. */
export const orderTypes: OrderTypeDef[] = [
  t("keepsake", "A personal keepsake", "A piece to keep for yourself", "personal", "heart"),
  t("gift", "A gift for someone", "For a person you know", "gift", "gift"),
  t("birthday", "A birthday piece", "Made for a birthday", "gift", "gift"),
  t("matching-set", "Matching sets and families", "Pairs, families or a group that belong together", "personal", "people", { impactsQuote: "high" }),
  t("pet-lookalike", "A pet lookalike", "Made from photos of a pet", "personal", "rabbit", { reference: "pet", suggestBase: ["pet"] }),
  t("drawing", "A drawing turned into an animal", "An adult sends the drawing. No child name or age", "personal", "camera", { reference: "drawing", suggestBase: ["describe"] }),
  t("memorial", "A remembrance piece", "To remember a person or a pet", "gift", "heart", { gentle: true, reference: "photo" }),
  t("baby-shower", "Baby shower sets", "Matching pieces for a shower", "event", "gift", { bulk: true }),
  t("wedding", "Wedding favours and gifts", "Small pieces for guests or the couple", "event", "gift", { bulk: true }),
  t("event-favours", "Event favours in bulk", "For a party, church or community event", "event", "package", { bulk: true, impactsQuote: "high" }),
  t("mascot", "A mascot for a business or school", "A character that stands for you", "business", "lion", { business: true, logo: true, suggestBase: ["character"], suggestCustomer: "business" }),
  t("corporate-gift", "Branded corporate gifts", "For staff or clients", "business", "hands", { business: true, bulk: true, logo: true, impactsQuote: "high", suggestCustomer: "business" }),
  t("hotel-lodge", "Hotel and lodge amenities", "For guest rooms and gift shops", "business", "store", { business: true, bulk: true, suggestCustomer: "lodge_hotel" }),
  t("shop-exclusive", "Shop exclusive designs", "A design only your shop sells", "business", "store", { business: true, bulk: true, logo: true, suggestCustomer: "wholesale" }),
  t("school-classroom", "School or ECD classroom sets", "Sets for a classroom or a centre", "community", "people", { business: true, bulk: true, suggestCustomer: "school" }),
  t("ngo-campaign", "NGO and charity campaign pieces", "Pieces that carry a cause", "community", "hands", { business: true, bulk: true, logo: true, suggestCustomer: "ngo" }),
  t("fundraising", "Fundraising items", "Pieces to raise money for a cause", "community", "heart", { business: true, bulk: true, suggestCustomer: "ngo" }),
  t("collector", "Collector or display pieces", "A piece to show off", "special", "sparkle"),
  t("wall-piece", "Wall pieces", "Wall heads and hangings", "special", "giraffe", { suggestBase: ["wall-head"] }),
  t("accessory", "Bags, keyrings and accessories", "Something to carry or clip", "special", "bag", { suggestBase: ["accessory"] }),
  t("outfit", "Outfits and costumes for an animal", "Clothes for an animal you already have", "special", "hook"),
  t("repair", "Repair or refresh of a Mikono piece", "A piece we made, mended or freshened", "special", "yarn", { impactsQuote: "low" }),
  t("baby-gift", "A new baby gift", "A welcome gift for a new arrival", "gift", "gift"),
  t("ceremony", "A ceremony or tradition", "For a naming, dowry, graduation or another ceremony", "event", "gift", { bulk: true }),
  t("faith-group", "A church or faith group", "Pieces for a congregation, class or event", "community", "hands", { business: true, bulk: true, suggestCustomer: "faith" }),
  t("diaspora-gift", "A gift for family in Kenya or abroad", "Sent to someone in another town or country", "gift", "package"),
  t("window-display", "Display and decor pieces", "For a shop window, a room or a stage", "business", "store", { business: true }),
  t("sympathy", "A sympathy or get well piece", "A gentle gift for someone who needs care", "gift", "heart", { gentle: true }),
  t("other", "Other, tell us", "Another kind of order, in your own words", "special", "info", { impactsQuote: "medium" }),
];

/** Old ids used by links on other pages and in old drafts. */
export const typeAliases: Record<string, string> = {
  base_variation: "gift", new_animal: "collector", pet_or_character: "pet-lookalike", child_drawing: "drawing",
  keepsake: "keepsake", wedding_shower: "wedding", event_favours: "event-favours", branded_mascot: "mascot",
  corporate_gift: "corporate-gift", hotel_lodge_shop: "hotel-lodge", school_ngo_project: "school-classroom", wall_or_special: "wall-piece",
};

export const MAX_TYPES = 40; // every kind may be ticked; the cap only guards stored drafts
export const typeById = (id: string) => orderTypes.find((o) => o.id === id);
export const normaliseType = (id: string): string => (typeById(id) ? id : typeAliases[id] && typeById(typeAliases[id]) ? typeAliases[id] : "");
