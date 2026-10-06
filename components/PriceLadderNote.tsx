import { WHOLESALE_PRICE_NOTE } from "@/data/facts";
import { priceLadderText } from "@/lib/pricing";

/** Our prices by size, plus the wholesale sentence. For the wholesale, partners, supply and stockists pages. */
export function PriceLadderNote({ className }: { className?: string }) {
  return (
    <p data-testid="wholesale-price-note" className={className ?? "text-base text-stone"}>
      Our prices are by size: {priceLadderText()}. {WHOLESALE_PRICE_NOTE}
    </p>
  );
}
