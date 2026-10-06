"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { lineSku, useCart } from "@/lib/cart";
import { suggestFamily } from "@/lib/suggest";
import { ASK_COLOUR_KEY, ASK_COLOUR_LABEL } from "@/lib/site";
import { CardGrid, PhotoCard } from "../card";
import { useCatalogue } from "../CatalogueContext";
import { sizeWord } from "@/lib/sizes";
import { formatKes } from "@/lib/pricing";

/** Complete the family: real catalogue animals that are not in the list yet, in the same uniform cards. Deterministic, no "popular" claims. */
export function FamilySuggestions() {
  const { products } = useCatalogue();
  const { lines, addLine } = useCart();
  const [open, setOpen] = useState(true);
  const picks = useMemo(() => suggestFamily(products, lines, 3), [products, lines]);
  if (!picks.length || lines.length === 0 || lines.length > 12) return null;
  return (
    <section aria-labelledby="fam-h" className="grid gap-1.5">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 id="fam-h" className="text-[.9375rem]">Complete the family</h2>
          <p className="text-[.8125rem] text-stone">Animals that sit well with what you chose.</p>
        </div>
        <button type="button" className="ck-tbtn md:hidden" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Show"}</button>
      </div>
      <div className={open ? "" : "hidden md:block"}>
        <CardGrid kind="shop" label="Animals to add">
          {picks.map((s) => {
            const colour = s.product.colourAsk ? ASK_COLOUR_LABEL : s.colour.label;
            return (
              <PhotoCard key={s.product.slug} cardType="suggestion" tone={s.product.group === "safari" ? "amber" : s.product.group === "pets" ? "terracotta" : "olive"}
                href={`/shop/${s.product.slug}`} title={s.product.name} meta={`${sizeWord(s.size)}, ${formatKes(s.product.sizePrices?.[s.size] ?? 0)}`}
                image={{ src: s.colour.src, alt: s.colour.alt, focal: s.colour.focal, fit: "cover", multiply: s.colour.multiply }}
                sizes="(min-width:1024px) 190px, 30vw"
                button={{
                  label: "Add",
                  onClick: () => {
                    const key = s.product.colourAsk ? ASK_COLOUR_KEY : s.colour.key;
                    const sku = lineSku(s.product.slug, key, s.size);
                    addLine({ sku, slug: s.product.slug, name: s.product.name, colourKey: key, colourLabel: colour, size: s.size, image: s.colour.src, qty: 1, category: s.product.category }, { listName: "cart_family" });
                  },
                }} />
            );
          })}
        </CardGrid>
        <p className="mt-1"><Link prefetch={false} href="/build-a-family?src=cart" data-track="cart_family" className="ck-tbtn -ml-2 !justify-start">Open the family builder</Link></p>
      </div>
    </section>
  );
}
