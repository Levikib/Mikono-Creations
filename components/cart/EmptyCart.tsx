"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { readOrders } from "@/lib/orderForm";
import { reorderLast } from "@/lib/reorder";
import { whatsappUrl } from "@/lib/env";
import { track } from "@/lib/track";
import { countAnimals } from "@/lib/plural";
import { CardGrid, PhotoCard } from "../card";
import { useCatalogue } from "../CatalogueContext";
import { Button, ButtonLink } from "../Button";
import { showToast } from "@/lib/toast";
import { SavedForLater } from "./SavedForLater";
import { Icon } from "../Icon";

/** Empty list rescue (strategy/16 section 1.9): saved items, order again, three ways in, and a human option. No timers, no offers. */
export function EmptyCart({ art }: { art?: ReactNode }) {
  const { rescue, products } = useCatalogue();
  const { addMany } = useCart();
  const [last] = useState(() => readOrders()[0] ?? null);
  const wa = whatsappUrl("Hello Mikono Creations, I need help choosing crocheted animals.") ?? "/contact";
  return (
    <div className="grid gap-3">
      <section className="flex flex-col items-center gap-1 rounded-[var(--radius-panel)] bg-oat p-3 text-center shadow-clay-sm">
        {art}
        <h2 className="text-[1.0625rem]">Your order list is empty</h2>
        <p className="max-w-[44ch] text-[.875rem] text-stone">Add an animal, choose a colour and a size, and it appears here. Nothing is charged on this site.</p>
        {last ? (
          <div className="mt-1">
            <Button size="compact" onClick={() => {
              const r = reorderLast(last, products);
              track("reorder_start", { source: "cart", item_count: last.items.reduce((n, i) => n + i.qty, 0) });
              const res = addMany(r.items);
              showToast(res.added + res.merged ? `Added ${countAnimals(r.items.reduce((n, i) => n + i.qty, 0))} from your last order.${r.missing ? ` ${r.missing} no longer listed.` : ""}` : "Nothing from your last order is listed now.", res.added + res.merged ? "success" : "info");
            }}>Reorder my last list ({last.items.reduce((n, i) => n + i.qty, 0)})</Button>
          </div>
        ) : null}
      </section>
      <SavedForLater />
      {rescue.length ? (
        <section aria-labelledby="ways-h" className="grid gap-1.5">
          <h2 id="ways-h" className="text-[.9375rem]">Start with a favourite</h2>
          <CardGrid kind="shop" label="Ways in">
            {rescue.map((c) => (
              <PhotoCard key={c.href} cardType="rescue" tone="amber" href={c.href} title={c.label} meta={c.blurb} image={{ src: c.src, alt: c.alt, focal: c.focal, fit: "cover" }} sizes="(min-width:640px) 30vw, 90vw" />
            ))}
          </CardGrid>
        </section>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-3">
        <Link prefetch={false} href="/gifts/finder?src=cart" data-track="cart_gift_finder" className="ck-tbtn -ml-2">Not sure what to pick? Gift finder</Link>
        <Link prefetch={false} href="/custom/studio?src=cart" data-track="cart_studio" className="ck-tbtn">Make a custom piece</Link>
        <a href={wa} target={wa.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" onClick={() => track("whatsapp_click", { context: "empty_cart" })} className="ck-tbtn"><Icon name="whatsapp" size={16} />Ask us on WhatsApp</a>
      </div>
      <ButtonLink href="/shop" size="large">See the animals</ButtonLink>
    </div>
  );
}
