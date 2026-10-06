// Server side: the real catalogue as plain objects for the cart and the order form. Nothing here is invented.
// Cart pages validate shared lists, edit lines and suggest animals against this, never against stored labels.
import { allProducts, byCategory, categoryByKey, heroImage, type CategoryKey, type Product } from "./catalogue";
import { ASK_COLOUR_LABEL } from "./site";
import { GROUP_BY_SLUG, NOT_IN_HELPERS } from "@/data/helpers";

export interface CartColour { key: string; label: string; src: string; alt: string; focal: [number, number]; multiply: boolean }
export interface CartProduct {
  slug: string;
  name: string;
  category: string;
  group: "safari" | "pets" | "sea" | "air" | "wall" | "dolls" | "other";
  colourAsk: boolean;
  /** Whole animals only: wall art, dolls and the handbag are not suggested. */
  suggestable: boolean;
  sizes: string[];
  /** Lowest retail price in KES, or null when prices are off. */
  priceKes: number | null;
  /** Retail price per size in KES, or null when prices are off. */
  sizePrices: Record<string, number> | null;
  colours: CartColour[];
}

function toCartProduct(p: Product): CartProduct | null {
  const colours = p.colourways.map((c) => {
    const h = heroImage(p, c.key);
    if (!h) return null;
    return { key: c.key, label: p.colourAsk ? ASK_COLOUR_LABEL : c.label, src: h.image.src, alt: h.image.alt, focal: h.image.focal, multiply: h.image.bg === "white" };
  }).filter((c): c is CartColour => c !== null);
  if (!colours.length) return null;
  const whole = p.category === "safari" || p.category === "domestic" || p.category === "more";
  return {
    slug: p.slug, name: p.name, category: categoryByKey(p.category).label, group: GROUP_BY_SLUG[p.slug] ?? "other",
    colourAsk: p.colourAsk, suggestable: whole && !NOT_IN_HELPERS.has(p.slug), sizes: [...p.sizes], priceKes: p.priceKes, sizePrices: p.sizePrices, colours,
  };
}

export function cartCatalogue(): CartProduct[] {
  return allProducts().map(toCartProduct).filter((p): p is CartProduct => p !== null);
}

export interface RescueCard { label: string; href: string; src: string; alt: string; focal: [number, number]; blurb: string }
const rescueKeys: Array<{ key: CategoryKey; blurb: string }> = [
  { key: "safari", blurb: "Elephants, giraffes, lions and more" },
  { key: "domestic", blurb: "Rabbits, pigs, cows, dogs and more" },
  { key: "more", blurb: "Octopuses, sharks, turtles and more" },
];
/** Three entry cards for an empty order list, each with the lead photo of the first animal in the category. */
export function rescueCards(): RescueCard[] {
  return rescueKeys.flatMap(({ key, blurb }) => {
    const first = byCategory(key).map(toCartProduct).find((p) => p !== null);
    const cat = categoryByKey(key);
    if (!first) return [];
    const c = first.colours[0];
    return [{ label: cat.label, href: `/shop/${cat.slug}`, src: c.src, alt: c.alt, focal: c.focal, blurb }];
  });
}
