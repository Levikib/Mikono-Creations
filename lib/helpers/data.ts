// Server side: reads the real catalogue and returns plain objects for the client helpers. Nothing here is invented.
import { allProducts, categoryByKey, heroImage, type Product } from "@/lib/catalogue";
import { ASK_COLOUR_LABEL } from "@/lib/site";
import { GROUP_BY_SLUG, NOT_IN_HELPERS } from "@/data/helpers";
import type { GroupKey, HelperAnimal, HelperColour, SizeKey } from "./types";

function toColour(p: Product, key: string): HelperColour | null {
  const h = heroImage(p, key);
  const cw = p.colourways.find((c) => c.key === key);
  if (!h || !cw) return null;
  const i = h.image;
  return {
    key: cw.key, label: p.colourAsk ? ASK_COLOUR_LABEL : cw.label, family: cw.family,
    image: { src: i.src, alt: i.alt, focal: i.focal, w: i.width, h: i.height, multiply: i.bg === "white" },
  };
}

export function toHelperAnimal(p: Product): HelperAnimal | null {
  const colours = p.colourways.map((c) => toColour(p, c.key)).filter((c): c is HelperColour => c !== null);
  if (!colours.length) return null;
  return {
    slug: p.slug, name: p.name, categoryLabel: categoryByKey(p.category).label,
    group: (GROUP_BY_SLUG[p.slug] ?? "other") as GroupKey,
    colourAsk: p.colourAsk, colours, sizes: [...p.sizes] as SizeKey[],
  };
}

/** Every catalogue product, wall art and dolls included. Safari first, then catalogue order. */
export function helperAnimals(): HelperAnimal[] {
  const list = allProducts()
    .filter((p) => !NOT_IN_HELPERS.has(p.slug))
    .map(toHelperAnimal)
    .filter((a): a is HelperAnimal => a !== null);
  return list;
}
