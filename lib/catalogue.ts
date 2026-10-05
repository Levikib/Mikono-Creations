// Typed accessors over data/catalogue.generated.json (built by scripts/build-catalogue.py).
import raw from "@/data/catalogue.generated.json";
import { defaultAvailability, prices, pricesConfirmed, sizeClasses, type Availability } from "@/data/facts";
import { familyOf, familyRank, type ColourFamilyKey } from "@/data/colours";

export type Size = (typeof sizeClasses)[number];
export type CategoryKey = "safari" | "domestic" | "more" | "wall-art" | "dolls";
/** "group": the photo shows this animal together with others (a crop with neighbours at its edges, or the whole group photo). */
export type ImageRole = "hero" | "gallery" | "lifestyle" | "size_ladder" | "group";
export type ImageBg = "neutral" | "white" | "coloured" | "busy";
export type Quality = "good" | "ok" | "low";

export type MediaRef = {
  role: ImageRole;
  bg: ImageBg;
  /** Focal point, 0 to 1. */
  focal: [number, number];
  shownSize: string | null;
  width: number;
  height: number;
  quality: Quality;
  alt: string;
  sourceId: string;
  src: string;
  /** Square card version of a small source: the photo at its own size on a sand panel. Only set when the short side is under NATIVE_PX. */
  cardSrc?: string;
  /** Note for the owner: what a better photo would show. */
  clientReview?: string;
};

export type Colourway = {
  key: string;
  label: string;
  family: ColourFamilyKey;
  /** "Grey Elephant" or "Rabbit, brown with a blue vest" (D8). */
  title: string;
  images: MediaRef[];
};

export type Variant = {
  /** {slug}-{colourKey}-{size}, lowercase (D4, D5). */
  sku: string;
  colourKey: string;
  colourLabel: string;
  size: Size;
  availability: Availability;
};

export type Product = {
  slug: string;
  species: string;
  /** Animal name used for the H1 and cards, no colour (D8). */
  name: string;
  category: CategoryKey;
  colourways: Colourway[];
  /** Range photos that show this animal with others. Never used as a colourway image. */
  range: MediaRef[];
  sizes: readonly Size[];
  priceKes: number | null;
  /** True when only group photos exist: no colour selector, colour is confirmed on WhatsApp. */
  colourAsk: boolean;
};



export type Category = { key: CategoryKey; slug: string; label: string; blurb: string };

export const categories: Category[] = [
  { key: "safari", slug: "safari-animals", label: "Safari animals", blurb: "Elephants, giraffes, lions, rhinos, zebras, hippos and monkeys, crocheted by hand in Nairobi." },
  { key: "domestic", slug: "domestic-animals", label: "Domestic animals", blurb: "Rabbits, cats and dogs, crocheted by hand in Nairobi." },
  { key: "more", slug: "more-animals", label: "More animals", blurb: "Octopuses, sharks, turtles, a goose, a bear and more." },
  { key: "wall-art", slug: "wall-art", label: "Wall art", blurb: "Crocheted animal heads to hang on a wall." },
  { key: "dolls", slug: "dolls", label: "Dolls", blurb: "Crocheted dolls in hand finished dresses." },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const categoryByKey = (key: CategoryKey) => categories.find((c) => c.key === key)!;

/** Listing order: species order inside each category (Photo Colour Rule). */
const speciesOrder = [
  "elephant", "giraffe", "lion", "rhino", "zebra", "hippo", "monkey",
  "rabbit", "cat", "dog",
  "bear", "goose", "octopus", "shark", "turtle", "butterfly", "chameleon", "dinosaur", "lion-head-handbag",
  "lion-wall-head", "giraffe-wall-head", "elephant-wall-head", "rhino-wall-head", "hippo-wall-head",
  "zebra-wall-head", "warthog-wall-head", "unicorn-wall-head", "secretary-bird-wall-head",
  "doll", "dress-doll",
];
const categoryOrder: CategoryKey[] = ["safari", "domestic", "more", "wall-art", "dolls"];

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const nameFromSlug = (slug: string) => sentence(slug.replace(/-/g, " "));

function colourwayTitle(name: string, label: string): string {
  const complex = /\bwith\b|,/.test(label) || label.split(" ").length > 3;
  return complex ? `${name}, ${label.charAt(0).toLowerCase()}${label.slice(1)}` : `${label} ${name}`;
}

type RawImage = {
  role: string; bg: string; focal: number[]; shownSize?: string | null; width: number; height: number;
  quality: string; alt: string; source_id: string; src: string; cardSrc?: string; client_review?: string;
};
/** Where a crop should centre when the animal named by the colourway is not in the middle of the frame. */
const focalOverride: Record<string, [number, number]> = { "/media/products/rhino/rhino-brown-01.jpg": [0.18, 0.5] };

const toMedia = (i: RawImage): MediaRef => ({
  role: i.role as ImageRole, bg: i.bg as ImageBg, focal: focalOverride[i.src] ?? [i.focal?.[0] ?? 0.5, i.focal?.[1] ?? 0.45],
  shownSize: i.shownSize ?? null, width: i.width, height: i.height, quality: i.quality as Quality,
  alt: i.alt, sourceId: i.source_id, src: i.src, cardSrc: i.cardSrc, clientReview: i.client_review,
});

const speciesWord = (species: string) => species.toLowerCase().split(" ")[0];

const products: Product[] = (raw.products as unknown as {
  slug: string; species: string; category: string;
  colourways: { key: string; label: string; images: RawImage[] }[]; range: RawImage[];
  colourAsk?: boolean;
}[])
  // Nothing is hidden: every product with a photo is listed. Photos still wanted are tracked in data/photoWanted.json.
  .map((p) => {
    const name = nameFromSlug(p.slug);
    const colourways = p.colourways
      .map((c, idx) => ({ c, idx }))
      .map(({ c, idx }) => ({
        idx,
        cw: {
          key: c.key, label: c.label, family: familyOf(c.key),
          title: p.colourAsk ? name : colourwayTitle(name, c.label),
          images: c.images.map(toMedia),
        } as Colourway,
      }))
      .sort((a, b) => familyRank[a.cw.family] - familyRank[b.cw.family] || a.idx - b.idx)
      .map((x) => x.cw);
    // A range photo is only listed when its description names this animal.
    const word = speciesWord(p.species);
    const range = (p.range ?? []).map(toMedia).filter((i) => i.alt.toLowerCase().includes(word));
    return {
      slug: p.slug, species: p.species, name, category: p.category as CategoryKey, colourways, range,
      sizes: sizeClasses, priceKes: prices[p.slug] ?? null, colourAsk: Boolean(p.colourAsk),
    } satisfies Product;
  })
  .sort((a, b) => {
    const ca = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (ca) return ca;
    return speciesOrder.indexOf(a.slug) - speciesOrder.indexOf(b.slug);
  });

// R7: when prices are confirmed every product must have one.
if (pricesConfirmed) {
  const missing = products.filter((p) => p.priceKes == null).map((p) => p.slug);
  if (missing.length) throw new Error(`pricesConfirmed is true but no price for: ${missing.join(", ")}`);
}

export const allProducts = (): Product[] => products;
export const byCategory = (key: CategoryKey): Product[] => products.filter((p) => p.category === key);
export const bySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug);
export const colourwayOf = (p: Product, key: string) => p.colourways.find((c) => c.key === key);

export const skuOf = (slug: string, colourKey: string, size: Size) => `${slug}-${colourKey}-${size}`.toLowerCase();

export function variantsOf(p: Product): Variant[] {
  return p.colourways.flatMap((c) =>
    p.sizes.map((size) => ({
      sku: skuOf(p.slug, c.key, size), colourKey: c.key, colourLabel: c.label, size, availability: defaultAvailability,
    })),
  );
}

export const shortSide = (i: Pick<MediaRef, "width" | "height">) => Math.min(i.width, i.height);

/** Images under 700 px short side are never rendered wider than 280 CSS px. */
export const LOW_RES_PX = 700;
export const LOW_RES_MAX_WIDTH = 280;
export const isLowRes = (i: Pick<MediaRef, "width" | "height">) => shortSide(i) < LOW_RES_PX;

/** A source with a short side under this is never upscaled or blurred: it is shown at its own size on a sand panel. */
export const NATIVE_PX = 400;
export const isNative = (i: Pick<MediaRef, "width" | "height">) => shortSide(i) < NATIVE_PX;

/** Near 4:5 or squarer images can be cropped to a 4:5 box without losing the animal. */
export const coverSafe = (i: Pick<MediaRef, "width" | "height">) => {
  const r = i.width / i.height;
  return r >= 0.7 && r <= 1.1;
};

const bgRank: Record<ImageBg, number> = { neutral: 0, white: 0, coloured: 1, busy: 2 };
const roleRank: Record<ImageRole, number> = { hero: 0, gallery: 1, lifestyle: 2, size_ladder: 3, group: 4 };
const qualityRank: Record<Quality, number> = { good: 0, ok: 1, low: 2 };

const animalWords = [...new Set(products.map((p) => speciesWord(p.species)))];

/** How many other animals the photo description names. Fewer is a cleaner lead image for one animal. */
function crowded(i: MediaRef, species: string): number {
  const alt = i.alt.toLowerCase();
  const own = speciesWord(species);
  return animalWords.filter((w) => w !== own && new RegExp(`\\b${w}s?\\b`).test(alt)).length;
}

/**
 * 0 for one animal, 1 for a pair, 2 for rows, groups or collages. Read from the photo description.
 * A single animal leads the gallery, groups and collages go to the end with the range photos.
 */
export function multiplicity(i: Pick<MediaRef, "alt">): 0 | 1 | 2 {
  const alt = i.alt.toLowerCase();
  if (/\b(rows?|group|lined up|stack|collage|pile|herd|family|several|many|three|four|five|six|seven|eight)\b/.test(alt)) return 2;
  if (/\b(two|pair|both|side by side|a large and a small)\b/.test(alt)) return 1;
  return 0;
}

function score(i: MediaRef, species: string): number[] {
  return [crowded(i, species), multiplicity(i), bgRank[i.bg], roleRank[i.role], qualityRank[i.quality], coverSafe(i) ? 0 : 1, -shortSide(i)];
}
function cmp(a: number[], b: number[]) {
  for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) return a[k] - b[k];
  return 0;
}

/** Neutral background, role hero, best quality; any image when nothing better exists. */
export function heroImage(p: Product, colourKey?: string): { image: MediaRef; colourway: Colourway } | null {
  const pool = (colourKey ? p.colourways.filter((c) => c.key === colourKey) : p.colourways)
    .flatMap((c) => c.images.map((image) => ({ image, colourway: c })));
  if (!pool.length) return null;
  // sort is stable, and colourways are already in neutral first order
  return [...pool].sort((a, b) => cmp(score(a.image, p.species), score(b.image, p.species)))[0];
}

/** Gallery for a colourway: its own photos first, then range photos naming this animal. */
export function galleryImages(p: Product, colourKey: string): { image: MediaRef; kind: "colourway" | "range" }[] {
  const cw = colourwayOf(p, colourKey);
  const own = (cw?.images ?? []).map((image) => ({ image, kind: "colourway" as const }));
  const hero = heroImage(p, colourKey)?.image;
  const first = hero ? own.filter((x) => x.image === hero) : [];
  const rest = own.filter((x) => x.image !== hero);
  // One animal photos first. Groups and collages follow the range photos at the end.
  const singles = rest.filter((x) => multiplicity(x.image) < 2);
  const groups = rest.filter((x) => multiplicity(x.image) === 2);
  const range = p.range.map((image) => ({ image, kind: "range" as const }));
  return [...first, ...singles, ...range, ...groups];
}

export type Facets = { animal: string[]; colour: ColourFamilyKey[]; size: Size[] };

export const speciesLabel = (species: string) => sentence(species);

export function filterProducts(list: Product[], f: Partial<Facets>): Product[] {
  return list.filter((p) =>
    (!f.animal?.length || f.animal.includes(p.species)) &&
    (!f.colour?.length || (!p.colourAsk && p.colourways.some((c) => f.colour!.includes(c.family)))) &&
    (!f.size?.length || f.size.some((s) => p.sizes.includes(s))),
  );
}

export function productCardImage(p: Product, colourKey?: string) {
  const h = heroImage(p, colourKey) ?? heroImage(p);
  return h;
}
