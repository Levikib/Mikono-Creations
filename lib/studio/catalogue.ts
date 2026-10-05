// Server side: turns the real catalogue into the small serialisable lists the Studio needs.
// Client files import only the types from here, so the catalogue JSON never ships in the Studio bundle.
import { allProducts, categoryByKey, heroImage, productCardImage, type CategoryKey, type ImageBg, type Quality } from "../catalogue";
import { colourFamilies, type ColourFamilyKey } from "../../data/colours";

export interface StudioPhoto { src: string; alt: string; focal: [number, number]; width: number; height: number }
export interface StudioAnimal { slug: string; name: string; category: CategoryKey; categoryLabel: string; photo: StudioPhoto | null }
export interface StudioColour { id: string; label: string; family: ColourFamilyKey; from: string; photo: StudioPhoto }
export interface StudioData {
  animals: StudioAnimal[];
  categories: { key: CategoryKey; label: string }[];
  colours: StudioColour[];
  families: { key: ColourFamilyKey; label: string }[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const bgRank: Record<ImageBg, number> = { neutral: 0, white: 0, coloured: 1, busy: 2 };
const qRank: Record<Quality, number> = { good: 0, ok: 1, low: 2 };

export function buildStudioData(): StudioData {
  const products = allProducts();
  const animals: StudioAnimal[] = products.map((p) => {
    const h = productCardImage(p);
    const cat = categoryByKey(p.category);
    return {
      slug: p.slug, name: p.name, category: p.category, categoryLabel: cat.label,
      photo: h ? { src: h.image.src, alt: h.image.alt, focal: h.image.focal, width: h.image.width, height: h.image.height } : null,
    };
  });
  const cats = [...new Set(products.map((p) => p.category))].map((k) => ({ key: k, label: categoryByKey(k).label }));

  // One swatch per printed colour name, from the cleanest real photo of that colourway. Never a clamped or filtered colour.
  const seen = new Map<string, StudioColour & { score: number[] }>();
  for (const p of products) {
    if (p.colourAsk) continue;
    for (const cw of p.colourways) {
      const image = heroImage(p, cw.key)?.image ?? cw.images[0];
      if (!image) continue;
      const id = slugify(cw.label);
      const score = [bgRank[image.bg], qRank[image.quality]];
      const prev = seen.get(id);
      if (prev && (prev.score[0] < score[0] || (prev.score[0] === score[0] && prev.score[1] <= score[1]))) continue;
      seen.set(id, {
        id, label: cw.label, family: cw.family, from: p.name, score,
        photo: { src: image.src, alt: image.alt, focal: image.focal, width: image.width, height: image.height },
      });
    }
  }
  const familyRank = new Map(colourFamilies.map((f, i) => [f.key, i]));
  const colours = [...seen.values()]
    .sort((a, b) => (familyRank.get(a.family)! - familyRank.get(b.family)!) || a.label.localeCompare(b.label))
    .map(({ score: _s, ...c }) => { void _s; return c; });
  const families = colourFamilies.filter((f) => colours.some((c) => c.family === f.key));
  return { animals, categories: cats, colours, families };
}
