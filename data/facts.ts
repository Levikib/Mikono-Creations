// Business facts the build can switch on later. Everything here is a placeholder
// until the client supplies the real value (R7, D9, D11).

/** R7: false at launch. Flip to true once `prices` is filled for every product. */
export const pricesConfirmed = false;

/** KES per product slug, whole shillings. Empty until the client supplies prices. */
export const prices: Record<string, number> = {};

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

/** Sizes are relative classes only (R5). No centimetre values. */
export const sizeClasses = ["S", "M", "L", "XL"] as const;

/* ---------- Checkout switches (stage 1). Each stays off or empty until the owner confirms the real value. ---------- */

/** Promo code field in the cart. Hidden until a promo scheme exists and is switched on here. */
export const promoEnabled = false;

/** Zone letters (A or B) in data/deliveryAreas.ts are placeholders. They are not shown until the owner confirms the zones. */
export const zonesConfirmed = false;

/** Usual working days between confirming an order and sending it. null means unknown: the site says "we confirm timing on WhatsApp". */
export const leadTimeDays: number | null = null;

/** Marketing messages a month for the WhatsApp tier and the newsletter, as text such as "2". null until the owner decides. */
export const marketingFrequency: string | null = null;
