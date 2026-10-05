/** Card tone is a property of meaning, set by the destination, never by position or taste (strategy/14 section 3). */
export type Tone = "amber" | "terracotta" | "olive" | "baobab" | "slate";
export const tones: readonly Tone[] = ["amber", "terracotta", "olive", "baobab", "slate"];

const map: [string, Tone][] = [
  ["/custom", "terracotta"], ["/build-a-family", "terracotta"],
  ["/wholesale", "olive"], ["/partners", "olive"], ["/supply", "olive"], ["/stockists", "olive"],
  ["/story", "baobab"], ["/makers", "baobab"], ["/impact", "baobab"], ["/projects", "baobab"], ["/gallery", "baobab"],
  ["/journal", "slate"], ["/care", "slate"], ["/safety", "slate"], ["/faq", "slate"], ["/delivery", "slate"], ["/size-guide", "slate"],
  ["/shop", "amber"], ["/gifts", "amber"], ["/cart", "amber"], ["/order", "amber"], ["/size-finder", "amber"],
];

/** Tone for a destination path. Defaults to amber (shop and animals). */
export function toneForPath(path: string): Tone {
  const p = path.split(/[?#]/)[0];
  for (const [prefix, tone] of map) if (p === prefix || p.startsWith(`${prefix}/`)) return tone;
  return "amber";
}
