// "Complete the family": pure and deterministic. Real catalogue animals that are not in the order list yet.
// Same group as the animal with the most pieces in the list first, then catalogue order. No randomness, no popularity claims.
import type { CartProduct } from "./cartCatalogue";

export interface SuggestLine { slug: string; size: string; qty: number }
export interface Suggestion { product: CartProduct; colour: CartProduct["colours"][number]; size: string }

export function suggestFamily(products: readonly CartProduct[], lines: readonly SuggestLine[], max = 4): Suggestion[] {
  const inList = new Set(lines.map((l) => l.slug));
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  // Group of the animal with the highest quantity (first one wins a tie, so the result never flips).
  let topGroup: string | null = null;
  let top = 0;
  for (const l of lines) {
    const g = bySlug.get(l.slug)?.group;
    if (g && l.qty > top) { top = l.qty; topGroup = g; }
  }
  // Most used size in the list, else M.
  const sizeCount: Record<string, number> = {};
  for (const l of lines) sizeCount[l.size] = (sizeCount[l.size] ?? 0) + l.qty;
  const usual = Object.entries(sizeCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "M";

  const pool = products.filter((p) => p.suggestable && !inList.has(p.slug));
  const ordered = [...pool.filter((p) => p.group === topGroup), ...pool.filter((p) => p.group !== topGroup)];
  return ordered.slice(0, max).map((product) => ({
    product,
    colour: product.colours[0],
    size: product.sizes.includes(usual) ? usual : product.sizes.includes("M") ? "M" : product.sizes[0],
  }));
}
