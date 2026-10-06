"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { pricesConfirmed } from "@/data/facts";
import { useCart, type CartLine } from "@/lib/cart";
import { feeFor, useDelivery } from "@/lib/delivery";
import { computeTotals, formatKes } from "@/lib/pricing";
import { countAnimals, countLines } from "@/lib/plural";
import { track } from "@/lib/track";
import { trackItem } from "@/lib/trackCart";
import { useKeyboardOpen } from "@/lib/useKeyboard";
import { ButtonLink } from "./Button";
import { CartLineItem, CartNotice, QuotePrompt, UndoNotice } from "./CartLines";
import { useCatalogue } from "./CatalogueContext";
import { CartTrust } from "./cart/CartTrust";
import { DeliveryEstimate } from "./cart/DeliveryEstimate";
import { EmptyCart } from "./cart/EmptyCart";
import { FamilySuggestions } from "./cart/FamilySuggestions";
import { BulkQuantities } from "./cart/BulkQuantities";
import { LineEditSheet } from "./cart/LineEditSheet";
import { PriceBlock, PromoField } from "./cart/PriceBlock";
import { SavedForLater } from "./cart/SavedForLater";
import { ShareButtons, SharedListBanner } from "./cart/ShareList";
import "./cart/checkout.css";

export function CartView({ emptyArt }: { emptyArt?: ReactNode }) {
  const { hydrated } = useCart();
  if (!hydrated) return <p className="min-h-[45dvh] py-3 text-center text-stone" aria-live="polite">Loading your order list</p>;
  return <Loaded emptyArt={emptyArt} />;
}

function Loaded({ emptyArt }: { emptyArt?: ReactNode }) {
  const { lines, count, saveForLater } = useCart();
  const { priceFor, resolve, bySlug } = useCatalogue();
  const d = useDelivery();
  const kb = useKeyboardOpen();
  const [editSku, setEditSku] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [bulk, setBulk] = useState(false);

  const totals = useMemo(() => computeTotals({
    lines: lines.map((l) => ({ sku: l.sku, slug: l.slug, size: l.size, qty: l.qty })), priceFor, pricesConfirmed,
    fulfilment: d.fulfilment, deliveryFeeKes: feeFor(d),
  }), [lines, priceFor, d]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    track("view_cart", {
      items: lines.map((l) => trackItem({ ...l, priceKes: priceFor(l.slug, l.size), category: l.category ?? bySlug(l.slug)?.category })),
      item_count: count, price_mode: pricesConfirmed ? "confirmed" : "ask",
    });
    // once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editing: CartLine | undefined = editSku ? lines.find((l) => l.sku === editSku) : undefined;
  const editingProduct = editing ? bySlug(editing.slug) : undefined;

  return (
    <div data-kb={kb ? "1" : "0"} className="grid gap-3">
      <CartNotice />
      <UndoNotice />
      <SharedListBanner />
      {lines.length === 0 ? (
        <EmptyCart art={emptyArt} />
      ) : (
        <>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-labelledby="cart-items" className="min-w-0 lg:col-start-1">
              <h2 id="cart-items" className="sr-only">Items in your order list</h2>
              <ul className="grid gap-1.5">
                {lines.map((l) => {
                  const known = resolve(l);
                  const t = totals.lines.find((x) => x.sku === l.sku);
                  return (
                    <CartLineItem key={l.sku} line={l} edit={{
                      stale: !known,
                      onEdit: () => { setMode("edit"); setEditSku(l.sku); },
                      onAnother: () => { setMode("add"); setEditSku(l.sku); },
                      onSave: () => saveForLater(l.sku),
                      price: pricesConfirmed ? { unitKes: t?.unitKes ?? null, totalKes: t?.totalKes ?? null } : { unitKes: null, totalKes: null },
                    }} />
                  );
                })}
              </ul>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3">
                <p className="text-[.75rem] text-stone">Kept on this device for 30 days, and nowhere else.</p>
                {lines.length > 1 ? <button type="button" className="ck-tbtn" onClick={() => setBulk(true)}>Edit all quantities</button> : null}
              </div>
            </section>

            <div className="min-w-0 lg:col-start-1"><SavedForLater /></div>

            <aside aria-labelledby="cart-summary" className="grid gap-2.5 rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:row-span-4">
              <h2 id="cart-summary" className="text-[.9375rem]">Order summary</h2>
              <p className="text-[.875rem]" data-testid="cart-count">{countAnimals(count)} in {countLines(lines.length)}</p>
              <PriceBlock totals={totals} pickup={d.fulfilment === "pickup"} />
              <DeliveryEstimate />
              <QuotePrompt count={count} />
              <PromoField />
              <ShareButtons lines={lines} animals={count} />
              <div className="hidden gap-2 lg:grid">
                <ButtonLink href="/order" size="large">Continue to order form</ButtonLink>
                <ButtonLink href="/shop" variant="ghost">Keep shopping</ButtonLink>
              </div>
              <div className="grid justify-items-start border-t border-sand pt-1.5">
                <Link prefetch={false} href="/custom/studio?src=cart" data-track="cart_studio" className="ck-tbtn -ml-2 !justify-start">Want a custom piece too? Start a brief</Link>
                <Link href="/shop" className="ck-tbtn -ml-2 !justify-start lg:hidden">Keep shopping</Link>
              </div>
            </aside>

            <div className="min-w-0 lg:col-start-1"><FamilySuggestions /></div>
            <div className="min-w-0 lg:col-start-1"><CartTrust /></div>
          </div>

          <div className="ck-bar ck-bar--cart">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
              <p className="min-w-0 text-[.8125rem] leading-tight">
                <span className="block font-semibold">{countAnimals(count)}</span>
                <span data-testid="cart-bar-total" className="block truncate text-stone">{totals.totalKes !== null ? `Total ${formatKes(totals.totalKes)}` : totals.subtotalKes !== null ? `Items total ${formatKes(totals.subtotalKes)}` : "Prices on WhatsApp"}</span>
              </p>
              <ButtonLink href="/order" size="large" className="shrink-0">Continue to order form</ButtonLink>
            </div>
          </div>
        </>
      )}
      {bulk ? <BulkQuantities onClose={() => setBulk(false)} /> : null}
      {editing && editingProduct ? <LineEditSheet key={`${mode}-${editing.sku}`} line={editing} product={editingProduct} mode={mode} onClose={() => setEditSku(null)} /> : null}
    </div>
  );
}
