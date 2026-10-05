// One colour taxonomy (D7). Families group the printed colourway names for
// filtering. Swatches are photo crops or text chips, never a clamped hex (D30).

export type ColourFamilyKey = "neutral" | "brown" | "yellow" | "red" | "green" | "blue" | "multi";

/** Display order: neutrals first (Photo Colour Rule). */
export const colourFamilies: { key: ColourFamilyKey; label: string }[] = [
  { key: "neutral", label: "Neutrals" },
  { key: "brown", label: "Browns and tans" },
  { key: "yellow", label: "Yellows and oranges" },
  { key: "red", label: "Reds and pinks" },
  { key: "green", label: "Greens" },
  { key: "blue", label: "Blues and purples" },
  { key: "multi", label: "Multicolour" },
];

export const familyRank: Record<ColourFamilyKey, number> = Object.fromEntries(
  colourFamilies.map((f, i) => [f.key, i]),
) as Record<ColourFamilyKey, number>;

const byKey: Record<string, ColourFamilyKey> = {
  grey: "neutral", "charcoal-grey": "neutral", "dark-grey": "neutral", "black-and-white": "neutral",
  "black-white": "neutral", white: "neutral", cream: "neutral", "cream-blue-bag": "neutral",
  "cream-red-bag": "neutral", "cream-rainbow-top": "neutral", "cream-brown-spots": "neutral",
  "white-pale-yellow": "neutral", "blue-grey": "neutral",
  brown: "brown", "caramel-brown": "brown", "caramel-tan": "brown", tan: "brown", "tan-brown-mane": "brown",
  "tan-yellow-face": "brown", "brown-blue-vest": "brown", "brown-cream-face": "brown",
  "brown-green-yellow-purple-vest": "brown", "brown-pale-blue-lilac-vest": "brown", "brown-pink-vest": "brown",
  "brown-red-teal-vest": "brown", "brown-yellow-face": "brown", "brown-yellow-turquoise-vest": "brown",
  yellow: "yellow", "yellow-brown-spots": "yellow", orange: "yellow", peach: "yellow",
  red: "red", pink: "red", "coral-pink": "red", "cream-pink": "red", "white-pink": "red",
  green: "green", "mint-cream": "green", "mint-green": "green",
  blue: "blue", "light-blue": "blue", navy: "blue", "slate-blue": "blue", turquoise: "blue", lavender: "blue",
  "dusty-purple": "blue", purple: "blue", "purple-grey": "blue", "blue-purple": "blue",
  "blue-striped-top": "blue", "purple-blue-face": "blue", "purple-pink-face": "blue",
  multicolour: "multi", "lime-multicolour": "multi", "mint-yellow": "multi", assorted: "multi",
  "pink-lilac-turquoise": "multi",
  "slim-red": "red", "slim-purple": "blue", "slim-sky-blue": "blue", "slim-pale-yellow": "yellow", "slim-royal-blue": "blue",
  // Group-photo products (colour key "ask") have no colour of their own. The shop filters skip them.
  ask: "multi",
};

/** Throws at build time on an unmapped key so a new colourway is never silently unfiltered. */
export function familyOf(key: string): ColourFamilyKey {
  const f = byKey[key];
  if (!f) throw new Error(`colour key "${key}" has no family in data/colours.ts`);
  return f;
}

export const familyLabel = (k: ColourFamilyKey) => colourFamilies.find((f) => f.key === k)!.label;
