// Builds GA4 style item entries from cart lines. SKU is the item id. No personal data, no free text.
export interface ItemSource {
  sku: string; name: string; colourKey: string; size: string; qty: number; category?: string; priceKes?: number | null;
}
export interface TrackItem {
  item_id: string; item_name: string; item_category?: string; item_variant: string; quantity: number; price?: number;
}

export function trackItem(l: ItemSource): TrackItem {
  const it: TrackItem = { item_id: l.sku, item_name: l.name, item_variant: `${l.colourKey}-${l.size}`.toLowerCase(), quantity: l.qty };
  if (l.category) it.item_category = l.category;
  if (typeof l.priceKes === "number") it.price = l.priceKes;
  return it;
}
export const trackItems = (lines: ItemSource[]): TrackItem[] => lines.map(trackItem);
