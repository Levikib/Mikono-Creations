// Size choices. Relative comparisons only (R5): no centimetres until the client supplies them.
// Every comparison sentence is a placeholder for owner approval (strategy/09 open question 4).
import type { SizeCode } from "./labels";

export interface SizeDef {
  /** Internal code, matches the catalogue. */
  value: SizeCode;
  /** The word shown to people. */
  label: string;
  /** Relative comparison. Placeholder until the owner approves the wording. */
  line: string;
  placeholder: true;
  pending: true;
  impactsQuote: "high";
}

export const sizeOptions: SizeDef[] = [
  { value: "S", label: "Small", line: "The smallest we make. Fits in a hand", placeholder: true, pending: true, impactsQuote: "high" },
  { value: "M", label: "Medium", line: "A little bigger than Small", placeholder: true, pending: true, impactsQuote: "high" },
  { value: "L", label: "Large", line: "Big enough for a good hug", placeholder: true, pending: true, impactsQuote: "high" },
  { value: "XL", label: "Extra large", line: "The biggest we make. A statement piece", placeholder: true, pending: true, impactsQuote: "high" },
];

export const SIZE_ADVISE = { id: "advise", label: "Not sure, help me choose", help: "Tell us what it is for and we will suggest a size.", impactsQuote: "high" as const };
export const SIZE_OTHER = { id: "other", label: "Other size, tell us", help: "Describe the size you have in mind, for example next to something familiar.", pending: true, impactsQuote: "high" as const };
export const SIZE_OTHER_MAX = 120;
export const SIZE_NOTE = "Sizes are compared with each other. We tell you which sizes are possible for your animal.";
