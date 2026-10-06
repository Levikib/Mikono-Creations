// Size labels for the Studio only: words, never initials (Small, Medium, Large, Extra large).
// The size codes S, M, L, XL are internal (they match the catalogue). A later sweep will move these labels to a shared helper.
export type SizeCode = "S" | "M" | "L" | "XL";

export const SIZE_CODES: readonly SizeCode[] = ["S", "M", "L", "XL"];

export const sizeLabels: Record<SizeCode, string> = { S: "Small", M: "Medium", L: "Large", XL: "Extra large" };

export const sizeLabel = (code: string): string => {
  if (code in sizeLabels) return sizeLabels[code as SizeCode];
  if (code === "advise") return "Not sure, help me choose";
  if (code === "other") return "Other size";
  return "";
};

/** Size codes in the catalogue data become words. Anything else is returned unchanged. */
export const sizeWord = (code: string): string => sizeLabels[code as SizeCode] ?? (code === "WALL" ? "Wall size" : code);
