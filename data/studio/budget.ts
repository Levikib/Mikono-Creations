// Budget. Bands are a ROUGH guide the owner authorised, to be refined by the client (see estimates.ts).
// They are never a price. The section says so, and the quote confirms the real price.
export interface BudgetBand { id: string; label: string; help?: string; /** Lower and upper end in KES, null for open ended. Used only to compare with the rough estimate. */ fromKes: number | null; toKes: number | null; estimate: true }

export const budgetBands: BudgetBand[] = [
  { id: "u2", label: "Under KES 2,000", fromKes: 0, toKes: 2000, estimate: true },
  { id: "2-5", label: "KES 2,000 to 5,000", fromKes: 2000, toKes: 5000, estimate: true },
  { id: "5-10", label: "KES 5,000 to 10,000", fromKes: 5000, toKes: 10000, estimate: true },
  { id: "10-25", label: "KES 10,000 to 25,000", fromKes: 10000, toKes: 25000, estimate: true },
  { id: "25-50", label: "KES 25,000 to 50,000", fromKes: 25000, toKes: 50000, estimate: true },
  { id: "50+", label: "KES 50,000 and above", fromKes: 50000, toKes: null, estimate: true },
];

export const BUDGET_SUGGEST = "I would rather you suggest";
/** Always offered after the bands. */
export const BUDGET_CHOICES = [
  { id: "unsure", label: "Not sure yet" },
  { id: "skip", label: "Prefer not to say" },
  { id: "suggest", label: BUDGET_SUGGEST },
] as const;
export const BUDGET_PER = [
  { id: "total", label: "For the whole order" },
  { id: "each", label: "For each piece" },
] as const;
export const BUDGET_TEXT_MAX = 80;
export const BUDGET_TITLE = "Rough budget guide (an estimate, we confirm the price in your quote)";
export const BUDGET_HINT = "These bands are a rough guide, not prices. A range helps us suggest what fits. It does not commit you to anything. You can leave this empty.";
