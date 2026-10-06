// ROUGH ESTIMATES for custom pieces, set by the lead on the owner's instruction, to be refined by the client; not published as prices.
// Every figure here is an estimate (estimate: true). Nothing in this file may reach the shop catalogue or a product page:
// shop prices come only from the retail ladder in data/facts.ts (R12). The low end of each size is that retail price, because
// a plain custom piece never costs less than the same animal in the shop. It is used in two places only:
//  (a) a gentle note on the Brief Card, shown only when sizes and quantities are chosen, always with the word "rough" or "estimate";
//  (b) one line in the WhatsApp message: "Rough guide shown on the site: ...".
import { sizePricesKes } from "../facts";
import { BULK_FROM } from "./quantity";

export interface RoughRange { lowKes: number; highKes: number; estimate: true }

/** Rough range for ONE plain custom piece, by size class. */
export const ROUGH_PER_PIECE: Record<"S" | "M" | "L" | "XL", RoughRange> = {
  S: { lowKes: sizePricesKes.S, highKes: 2500, estimate: true },
  M: { lowKes: sizePricesKes.M, highKes: 5000, estimate: true },
  L: { lowKes: sizePricesKes.L, highKes: 9000, estimate: true },
  XL: { lowKes: sizePricesKes.XL, highKes: 18000, estimate: true },
};
/** Custom complexity (new shapes, many colours, outfits, logos) adds roughly this much on top. */
export const ROUGH_COMPLEXITY = { lowPercent: 20, highPercent: 60, estimate: true } as const;
/** Bulk from BULK_FROM pieces may bring a rough reduction per piece. */
export const ROUGH_BULK = { fromPieces: BULK_FROM, lowPercent: 5, highPercent: 20, estimate: true } as const;

export const ESTIMATE_WORD = "rough";
export const ESTIMATE_CONFIRM = "We confirm the exact price in your quote.";
export const ESTIMATE_MESSAGE_LABEL = "Rough guide shown on the site";

/** Whole shillings, with a thousands comma. */
export const fmtKes = (n: number) => `KES ${Math.round(n).toLocaleString("en-US")}`;
