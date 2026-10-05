"use client";
import Image from "@/components/Img";
import { lineColour, lineName, useCart } from "@/lib/cart";
import { removeSaved, useSaved } from "@/lib/saved";
import { Icon } from "../Icon";
import { sizeWord } from "@/lib/sizes";

/** Items put aside on this device (30 days). Moving one back merges it with the same animal if it is already in the list. */
export function SavedForLater() {
  const items = useSaved();
  const { moveToCart } = useCart();
  if (!items.length) return null;
  return (
    <section aria-labelledby="saved-h" className="grid gap-1.5">
      <h2 id="saved-h" className="text-[.9375rem]">Saved for later ({items.length})</h2>
      <ul className="grid gap-1.5">
        {items.map((it) => (
          <li key={it.sku} className="flex items-center gap-2 rounded-[var(--radius-card)] bg-paper p-2 shadow-clay-sm">
            <span className="ck-thumb size-11">{it.image ? <Image src={it.image} alt="" fill sizes="44px" className="object-cover" /> : null}</span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-display text-[.875rem] font-semibold text-baobab">{it.name}</p>
              <p className="line-clamp-1 text-[.8125rem] text-stone">{lineColour(it)}, {sizeWord(it.size)}, {it.qty}</p>
            </div>
            <button type="button" className="ck-tbtn" onClick={() => moveToCart(it)} aria-label={`Move ${lineName(it)}, ${sizeWord(it.size)} to the order list`}><Icon name="cart" size={14} />Move to list</button>
            <button type="button" className="ck-tbtn" onClick={() => removeSaved(it.sku)} aria-label={`Remove saved ${lineName(it)}, ${sizeWord(it.size)}`}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
