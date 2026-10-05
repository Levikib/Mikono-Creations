import { sizeRangeLabel } from "@/lib/sizes";
import { PhotoCard, CardGrid, type CardPhoto } from "./card/Card";
import type { Tone } from "@/lib/cardTone";

/** Photo plus how to place it. Never tinted or filtered (rule 4). */
export type { CardPhoto };

export type ProductCardData = {
  href: string;
  title: string;
  /** Colours count, for example "4 colours". */
  meta: string;
  sizes: readonly string[];
  /** KES, whole shillings. Null or undefined shows the "Ask for price" action. */
  priceKes?: number | null;
  /** WhatsApp link with the price question filled in. Falls back to the product page. */
  askHref?: string | null;
  image?: CardPhoto;
  /** The head that peeks over the card on hover or touch (see components/fx/engine). */
  peek?: { src: string; cy: number };
  tag?: string;
  /** Kept for older callers. The card shows exactly one action. */
  ctaLabel?: string;
  /** Kept for older callers. */
  tint?: string;
};

export function formatKes(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

/** "Small to Extra large", or the single size. */
export const sizeRange = sizeRangeLabel;

/** Product card: the unified PhotoCard in the amber (shop) tone. One action, pinned to the bottom of the card. */
export function ProductCard({ item, sizes, eager, tone = "amber" }: { item: ProductCardData; sizes?: string; eager?: boolean; tone?: Tone }) {
  return (
    <PhotoCard tone={tone} href={item.href} title={item.title} tag={item.tag} image={item.image} eager={eager} sizes={sizes} peek={item.peek}
      meta={sizeRange(item.sizes)}
      price={item.priceKes ? `From ${formatKes(item.priceKes)}` : undefined}
      action={item.priceKes ? undefined : { label: "Ask for price", href: item.askHref ?? item.href }} />
  );
}

export function ProductGrid({ items }: { items: readonly ProductCardData[]; withSidebar?: boolean }) {
  return (
    <CardGrid kind="shop">
      {items.map((it, i) => <ProductCard key={it.href + it.title} item={it} eager={i < 3} />)}
    </CardGrid>
  );
}
