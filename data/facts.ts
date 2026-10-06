// Business facts the build can switch on later. A value stays empty or off until the client supplies the real one (R7, D9, D11).

/**
 * R12 (2026-10-05): the client sent retail prices by size and said they apply to every product,
 * wall art and dolls included, and to wholesale too unless we agree something else with the buyer on WhatsApp.
 * The flag is on, and a price is looked up per size with unitPriceKes() in lib/pricing.ts.
 */
export const pricesConfirmed = true;

/** Sizes are relative classes only (R5). No centimetre values. */
export const sizeClasses = ["S", "M", "L", "XL"] as const;
export type SizeClass = (typeof sizeClasses)[number];

/** Retail price in KES for one piece, by size. Whole shillings. One ladder for every product. */
export const sizePricesKes: Record<SizeClass, number> = { S: 1500, M: 2000, L: 3500, XL: 5000 };

/** Wall art (owner, 2026-10-06): one fixed price, one size, larger than Extra large. Used by every wall art head. */
export const WALL_ART_PRICE_KES = 8000;
/** The single size code of wall art. Shown as "Wall size" (lib/sizes.ts). */
export const WALL_SIZE = "WALL";
/** Wall art slugs all end in -wall-head. Slug rule only, so client code needs no catalogue. */
export const isWallArtSlug = (slug: string) => slug.endsWith("-wall-head");

/** One sentence for wholesale, partner, supply and stockist pages. */
export const WHOLESALE_PRICE_NOTE = "These prices apply to wholesale too, unless we agree something else with you on WhatsApp.";

export type Availability = "ready" | "made_to_order" | "limited" | "ask" | "unavailable";

/** D9: availability defaults to "ask" for every variant. */
export const defaultAvailability: Availability = "ask";

export const availabilityLabel: Record<Availability, string> = {
  ready: "Ready to send",
  made_to_order: "Made to order",
  limited: "Limited availability",
  ask: "Ask us about availability",
  unavailable: "Not available right now",
};

/* ---------- Checkout switches (stage 1). Each stays off or empty until the owner confirms the real value. ---------- */

/** Promo code field in the cart. Hidden until a promo scheme exists and is switched on here. */
export const promoEnabled = false;

/** Zone letters (A or B) in data/deliveryAreas.ts are placeholders. They are not shown until the owner confirms the zones. */
export const zonesConfirmed = false;

/** Usual working days between confirming an order and sending it. null means unknown: the site says "we confirm timing on WhatsApp". */
export const leadTimeDays: number | null = null;

/** Marketing messages a month for the WhatsApp tier and the newsletter, as text such as "2". null until the owner decides. */
export const marketingFrequency: string | null = null;
