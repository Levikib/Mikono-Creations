"use client";
import { useEffect, useRef } from "react";
import { pricesConfirmed } from "@/data/facts";
import { useCart } from "@/lib/cart";
import { formatKes, unitPriceKes } from "@/lib/pricing";
import { track } from "@/lib/track";
import { trackItem } from "@/lib/trackCart";
import { countAnimals } from "@/lib/plural";
import { ButtonLink } from "./Button";
import { Icon } from "./Icon";
import { CartLineItem, QuotePrompt, UndoNotice } from "./CartLines";

/** Native dialog: focus trap, Escape and focus return come from the browser. Right sheet at md, bottom sheet below. */
export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, count } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prices = pricesConfirmed ? lines.map((l) => unitPriceKes(l.slug, l.size)) : [];
  const itemsKes = prices.length && prices.every((p) => p !== null) ? lines.reduce((n, l, i) => n + (prices[i] as number) * l.qty, 0) : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (drawerOpen && !d.open) {
      d.showModal();
      headingRef.current?.focus();
      track("view_cart", { items: lines.map((l) => trackItem({ ...l, priceKes: unitPriceKes(l.slug, l.size) })), item_count: count, price_mode: pricesConfirmed ? "confirmed" : "ask", surface: "drawer" });
    }
    if (!drawerOpen && d.open) d.close();
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
    // lines and count are read only when the drawer opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <dialog ref={ref} aria-labelledby="cart-drawer-title" onClose={closeDrawer}
      onClick={(e) => { if (e.target === ref.current) closeDrawer(); }}
      className="sheet fixed m-0 mt-auto max-h-[88dvh] w-full max-w-none rounded-t-[24px] bg-bone p-0 text-charcoal md:ml-auto md:mt-0 md:h-dvh md:max-h-none md:w-[400px] md:rounded-none md:rounded-l-[24px]">
      <div className="flex max-h-[88dvh] min-h-[40dvh] flex-col md:h-full md:max-h-none">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-sand px-3">
          <h2 id="cart-drawer-title" ref={headingRef} tabIndex={-1} className="text-[.9375rem] focus:outline-none">
            Your order list <span className="font-sans text-[.8125rem] font-normal text-stone">({countAnimals(count)})</span>
          </h2>
          <button type="button" aria-label="Close order list" onClick={closeDrawer} className="hit-area inline-flex size-9 items-center justify-center rounded-full text-baobab">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
          <UndoNotice />
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-5 text-center">
              <Icon name="hand" size={40} className="text-baobab" />
              <p className="text-[.9375rem]">Your order list is empty.</p>
              <ButtonLink href="/shop" onClick={closeDrawer}>See the animals</ButtonLink>
            </div>
          ) : (
            <ul className="grid gap-1.5">
              {lines.map((l) => {
                const unit = pricesConfirmed ? unitPriceKes(l.slug, l.size) : null;
                return <CartLineItem key={l.sku} line={l} variant="drawer" onNavigate={closeDrawer} edit={{ price: { unitKes: unit, totalKes: unit === null ? null : unit * l.qty } }} />;
              })}
            </ul>
          )}
          <QuotePrompt count={count} onNavigate={closeDrawer} className="my-2" />
        </div>
        {lines.length > 0 ? (
          <div className="shrink-0 border-t border-sand bg-bone p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
            {itemsKes !== null ? (
              <p data-testid="drawer-items-total" className="mb-1 flex items-baseline justify-between gap-2 text-[.875rem] font-semibold">
                <span>Items total <span className="text-[.8125rem] font-normal text-stone">(delivery not included)</span></span>
                <span className="price tabular-nums">{formatKes(itemsKes)}</span>
              </p>
            ) : null}
            <p className="mb-2 text-[.8125rem] text-stone">
              {pricesConfirmed ? "Items total is on the order list page. Delivery is not included and is confirmed on WhatsApp." : "Delivery is confirmed with you on WhatsApp."} Nothing is charged here.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink href="/cart" variant="secondary" onClick={closeDrawer}>View order list</ButtonLink>
              <ButtonLink href="/order" onClick={closeDrawer}>Continue to order form</ButtonLink>
            </div>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
