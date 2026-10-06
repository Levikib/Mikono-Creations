// Price states for the cart, drawer and order form (strategy/16 section 1.6). Pure functions.
// Four states, from the one flag pricesConfirmed and the fees:
//   P0  prices not confirmed: no price is shown. This only happens if the flag in data/facts.ts is switched off.
//   P1  prices confirmed, but some lines have no price: known line totals only, no subtotal.
//   P2  every line priced, delivery cost not known yet: lines and subtotal, total reads "plus delivery".
//   P3  every line priced and delivery known (or pickup): lines, subtotal, delivery, total.
// A total is never shown, and never estimated, before P3.

import { pricesConfirmed as PRICES_ON, sizePricesKes, sizeClasses, isWallArtSlug, WALL_ART_PRICE_KES } from "../data/facts";
import { sizeWord } from "./sizes";

export type PriceState = "P0" | "P1" | "P2" | "P3";

/** Retail price of one piece in one size (wall art: always the fixed wall art price), or null for an unknown size. */
export function unitPriceKes(slug: string, size: string): number | null {
  if (!PRICES_ON) return null;
  // Wall art is one fixed price, whatever the size code says.
  if (isWallArtSlug(slug)) return WALL_ART_PRICE_KES;
  return (sizeClasses as readonly string[]).includes(size) ? sizePricesKes[size as keyof typeof sizePricesKes] : null;
}

/** The lowest price a piece is sold at ("From KES 1,500"), or null when prices are off. */
export function fromPriceKes(slug: string): number | null {
  const all = sizeClasses.map((s) => unitPriceKes(slug, s)).filter((n): n is number => n !== null);
  return all.length ? Math.min(...all) : null;
}

export interface PriceLineInput { sku: string; slug: string; size: string; qty: number }
export interface PricingInput {
  lines: PriceLineInput[];
  /** Price of one animal by slug and size. Defaults to the retail ladder in data/facts.ts. Null means "no price". */
  priceFor?: (slug: string, size: string) => number | null | undefined;
  pricesConfirmed: boolean;
  fulfilment: "" | "pickup" | "nairobi" | "town";
  /** Fee for the chosen delivery area, or null when unknown. */
  deliveryFeeKes: number | null;
  discountKes?: number;
}
export interface Totals {
  state: PriceState;
  lines: Array<{ sku: string; unitKes: number | null; totalKes: number | null }>;
  subtotalKes: number | null;
  deliveryFeeKes: number | null;
  discountKes: number;
  /** Null unless the state is P3. */
  totalKes: number | null;
  /** True when a number for the whole order may be sent to analytics as value. */
  valueKnown: boolean;
}

const whole = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0 && Number.isInteger(n);

export function computeTotals(input: PricingInput): Totals {
  const discountKes = whole(input.discountKes) ? input.discountKes : 0;
  const lines = input.lines.map((l) => {
    const unit = input.pricesConfirmed ? (input.priceFor ?? unitPriceKes)(l.slug, l.size) : null;
    const unitKes = whole(unit) ? unit : null;
    return { sku: l.sku, unitKes, totalKes: unitKes === null ? null : unitKes * l.qty };
  });
  if (!input.pricesConfirmed) {
    return { state: "P0", lines, subtotalKes: null, deliveryFeeKes: null, discountKes, totalKes: null, valueKnown: false };
  }
  const allPriced = lines.length > 0 && lines.every((l) => l.totalKes !== null);
  if (!allPriced) {
    return { state: "P1", lines, subtotalKes: null, deliveryFeeKes: null, discountKes, totalKes: null, valueKnown: false };
  }
  const subtotalKes = lines.reduce((n, l) => n + (l.totalKes ?? 0), 0);
  const pickup = input.fulfilment === "pickup";
  const fee = pickup ? 0 : whole(input.deliveryFeeKes) ? input.deliveryFeeKes : null;
  const feeKnown = pickup || (input.fulfilment !== "" && fee !== null);
  if (!feeKnown) {
    return { state: "P2", lines, subtotalKes, deliveryFeeKes: null, discountKes, totalKes: null, valueKnown: false };
  }
  const totalKes = Math.max(0, subtotalKes + (fee ?? 0) - discountKes);
  return { state: "P3", lines, subtotalKes, deliveryFeeKes: fee, discountKes, totalKes, valueKnown: true };
}

const kes = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });
export const formatKes = (n: number) => `KES ${kes.format(n)}`;

/** "Small KES 1,500, Medium KES 2,000, Large KES 3,500 and Extra large KES 5,000. Wall art: KES 8,000". Built from data/facts.ts. */
export function priceLadderText(): string {
  const parts = sizeClasses.map((s) => `${sizeWord(s)} ${formatKes(sizePricesKes[s])}`);
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}. Wall art: ${formatKes(WALL_ART_PRICE_KES)}`;
}
