// Reorder a previous list from mk.orders.v1 (ref and item summary only). Each sku is resolved against the catalogue.
import type { AddInput } from "./cart";
import type { CartProduct } from "./cartCatalogue";
import type { OrderSummary } from "./orderForm";
import { ASK_COLOUR_KEY, ASK_COLOUR_LABEL } from "./site";

export function reorderLast(order: OrderSummary, products: readonly CartProduct[]): { items: Array<AddInput & { qty: number }>; missing: number } {
  const items: Array<AddInput & { qty: number }> = [];
  let missing = 0;
  const bySku = new Map<string, { p: CartProduct; key: string; size: string }>();
  for (const p of products) for (const c of p.colours) for (const s of p.sizes) bySku.set(`${p.slug}-${p.colourAsk ? ASK_COLOUR_KEY : c.key}-${s}`.toLowerCase(), { p, key: p.colourAsk ? ASK_COLOUR_KEY : c.key, size: s });
  for (const it of order.items) {
    const hit = bySku.get(String(it.sku).toLowerCase());
    if (!hit) { missing += 1; continue; }
    const colour = hit.key === ASK_COLOUR_KEY ? hit.p.colours[0] : hit.p.colours.find((c) => c.key === hit.key) ?? hit.p.colours[0];
    items.push({
      sku: String(it.sku).toLowerCase(), slug: hit.p.slug, name: hit.p.name, colourKey: hit.key,
      colourLabel: hit.key === ASK_COLOUR_KEY ? ASK_COLOUR_LABEL : colour.label, size: hit.size, image: colour.src, qty: Math.max(1, Math.min(20, Math.floor(Number(it.qty) || 1))), category: hit.p.category,
    });
  }
  return { items, missing };
}
