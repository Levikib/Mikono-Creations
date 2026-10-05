// Quantity bands. Each piece in a brief carries its own band and an optional exact number.
import type { Opt } from "./option";
import { QUOTE_THRESHOLD_UNITS } from "../../lib/site";

export interface QtyBand extends Opt { min: number; max: number | null; /** Triggers the bulk wording and the business questions. */ bulk: boolean }

const q = (id: string, label: string, min: number, max: number | null, bulk: boolean, help: string): QtyBand =>
  ({ id, label, help, min, max, bulk, impactsQuote: bulk ? "high" : "medium" });

/** Bulk starts at BULK_FROM pieces (owner answer). It matches QUOTE_THRESHOLD_UNITS in lib/site.ts. No minimum for a single custom piece. */
export const BULK_FROM = QUOTE_THRESHOLD_UNITS;
export const qtyBands: QtyBand[] = [
  q("1", "1", 1, 1, false, "A single piece"),
  q("2-5", "2 to 5", 2, 5, false, "A small set"),
  q("6-19", "6 to 19", 6, 19, false, "A set or a small group"),
  q("20-49", "20 to 49", 20, 49, true, "Bulk starts here"),
  q("50-99", "50 to 99", 50, 99, true, "A big order"),
  q("100+", "100 plus", 100, null, true, "A very big order"),
];
/** Old band ids kept in saved drafts. */
export const bandAliases: Record<string, string> = { "6-20": "6-19", "21-50": "20-49", "51-100": "50-99" };

export const qtyModes: Opt[] = [
  { id: "single", label: "A single piece", help: "One of one", impactsQuote: "medium" },
  { id: "set", label: "A small set", help: "Two to a handful", impactsQuote: "medium" },
  { id: "bulk", label: "In bulk", help: "Many of the same or a mix", impactsQuote: "high" },
];

export const MAX_PIECES = 30;
export const MAX_EXACT = 99999;
export const BULK_NOTICE = "Bulk orders start at 20 pieces. Smaller branded runs: ask us. We prepare a quote on WhatsApp with a person, and you can still continue here.";
export const MIXED_HINT = "Mixed sizes or several designs? Add a piece for each design and give each its own count.";

export const bandById = (id: string) => qtyBands.find((b) => b.id === id);
/** The band an exact number falls in. */
export const bandForCount = (n: number): string => (qtyBands.find((b) => n >= b.min && (b.max === null || n <= b.max)) ?? qtyBands[0]).id;
export const bandLabel = (id: string) => bandById(id)?.label ?? "";
