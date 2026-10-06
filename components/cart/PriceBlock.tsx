"use client";
import { promoEnabled } from "@/data/facts";
import { formatKes, type Totals } from "@/lib/pricing";

/** Price summary for the four states (lib/pricing.ts). Before every price and the delivery cost are known, no total is ever shown. */
export function PriceBlock({ totals, pickup }: { totals: Totals; pickup: boolean }) {
  if (totals.state === "P0") {
    return (
      <div data-testid="prices-on-whatsapp" data-price-state="P0" className="rounded-[var(--radius-input)] bg-ochre-tint px-3 py-2">
        <h3 className="text-[.875rem]">No prices to show</h3>
        <p className="mt-0.5 text-[.8125rem] text-charcoal">We confirm the price of each animal, the delivery cost and how to pay on WhatsApp. Nothing is charged on this site.</p>
      </div>
    );
  }
  if (totals.state === "P1") {
    return (
      <div data-testid="prices-partly" data-price-state="P1" className="rounded-[var(--radius-input)] bg-ochre-tint px-3 py-2">
        <h3 className="text-[.875rem]">Some items have no price</h3>
        <p className="mt-0.5 text-[.8125rem] text-charcoal">Priced lines show their total. We confirm the rest, the delivery cost and how to pay on WhatsApp. Nothing is charged on this site.</p>
      </div>
    );
  }
  const row = "flex items-baseline justify-between gap-3 text-[.875rem]";
  return (
    <div data-testid="price-totals" data-price-state={totals.state} className="grid gap-1 rounded-[var(--radius-input)] bg-paper px-3 py-2 shadow-clay-sm">
      <p className={row}><span>Items total <span className="text-[.8125rem] text-stone">(delivery not included)</span></span><span data-testid="items-total" className="price tabular-nums">{formatKes(totals.subtotalKes ?? 0)}</span></p>
      <p className={row}><span>Delivery</span><span className="tabular-nums">{pickup ? "None if you collect it" : totals.deliveryFeeKes === null ? "To be confirmed" : formatKes(totals.deliveryFeeKes)}</span></p>
      {totals.discountKes > 0 ? <p className={row}><span>Discount</span><span className="tabular-nums">&minus;{formatKes(totals.discountKes)}</span></p> : null}
      {totals.state === "P3" ? (
        <p className={`${row} border-t border-sand pt-1 font-semibold`}>
          <span>Total</span><span className="price tabular-nums">{formatKes(totals.totalKes ?? 0)}</span>
        </p>
      ) : null}
      <p className="text-[.8125rem] text-stone">{totals.state === "P3" ? "" : "Delivery to be confirmed. "}We confirm the final amount and how to pay on WhatsApp. Nothing is charged on this site.</p>
    </div>
  );
}

/** Promo code field. Not rendered at all unless data/facts.ts promoEnabled is true. */
export function PromoField() {
  if (!promoEnabled) return null;
  return (
    <form className="flex items-end gap-2" onSubmit={(e) => e.preventDefault()}>
      <div className="min-w-0 flex-1">
        <label htmlFor="promo" className="block text-[.8125rem] font-semibold text-baobab">Promo code</label>
        <input id="promo" autoComplete="off" className="block h-9 w-full rounded-[var(--radius-input)] border-[1.5px] border-line bg-paper px-3 text-[1rem] md:text-sm" />
      </div>
      <button type="submit" className="ck-tbtn">Apply</button>
    </form>
  );
}
