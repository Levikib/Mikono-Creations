"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import { buttonClass } from "./Button";
import { Icon } from "./Icon";

export type AddToOrderProps = {
  slug: string;
  /** Animal name, no colour. The cart message adds colour and size. */
  name: string;
  colour: { key: string; label: string } | null;
  size: string | null;
  qty: number;
  /** Photo of the chosen colour. */
  image: string;
  sku: string | null;
  /** Category label for analytics, such as "Safari animals". */
  category?: string;
  /** Sprite URL of the animal that hops to the basket. */
  hopSprite?: string;
  /** Called when the button is pressed without a colour or size. */
  onIncomplete: () => void;
  describedBy?: string;
};

/** Adds one line to the order list through the cart store. Disabled until colour and size are chosen. */
export function AddToOrder({ slug, name, colour, size, qty, image, sku, category, hopSprite, onIncomplete, describedBy }: AddToOrderProps) {
  const { addLine } = useCart();
  const ready = Boolean(colour && size && sku);
  const [added, setAdded] = useState(false);
  return (
    <>
    <button
      type="button" aria-disabled={!ready} aria-describedby={describedBy} data-add-to-order
      onClick={(e) => {
        if (!ready || !colour || !size || !sku) return onIncomplete();
        // The animal hops into the header order list button (components/fx/engine). Does nothing when motion is off.
        const r = e.currentTarget.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent("mikono:cart-add", { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, sprite: hopSprite } }));
        addLine({ sku, slug, name, colourKey: colour.key, colourLabel: colour.label, size, image, qty, category });
        setAdded(true);
      }}
      className={buttonClass("primary", "large", "w-full aria-disabled:pointer-events-auto! aria-disabled:cursor-not-allowed")}
    >
      <Icon name="cart" size={22} />Add to order list
    </button>
    {added ? (
      <p role="status" className="text-[.8125rem] text-olive-deep">
        Added {name} to your order list. Want it in another size or colour? Choose it above and press Add again, and it becomes its own line.{" "}
        <Link href="/cart" className="hit font-semibold text-terracotta-deep underline underline-offset-4">View order list</Link>
      </p>
    ) : null}
    </>
  );
}
