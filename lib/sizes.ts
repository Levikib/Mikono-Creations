// Sizes are written as words in the interface. The codes S, M, L and XL stay inside SKUs and data (R5: relative classes only).
export const SIZE_WORDS: Record<string, string> = { S: "Small", M: "Medium", L: "Large", XL: "Extra large" };
export const sizeWord = (s: string): string => SIZE_WORDS[String(s).toUpperCase()] ?? s;

/** "Small to Extra large" for a list of size codes, or the single size word. */
export const sizeRangeLabel = (sizes: readonly string[]): string =>
  sizes.length > 1 ? `${sizeWord(sizes[0])} to ${sizeWord(sizes[sizes.length - 1]).toLowerCase()}` : sizes[0] ? sizeWord(sizes[0]) : "";

/** The four classes in one phrase, for body copy. */
export const SIZES_PHRASE = "Small, Medium, Large and Extra large";
