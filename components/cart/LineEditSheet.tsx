"use client";
import Image from "@/components/Img";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { lineName, lineSku, useCart, type CartLine } from "@/lib/cart";
import type { CartProduct } from "@/lib/cartCatalogue";
import { sizeWord } from "@/lib/sizes";
import { ASK_COLOUR_KEY, ASK_COLOUR_LABEL } from "@/lib/site";
import { cx } from "@/lib/cx";
import { Button } from "../Button";
import { Icon } from "../Icon";

/**
 * Edit size and colour of one line, or (mode "add") add another size or colour of the same animal as a separate line.
 * Native dialog: focus trap, Escape and focus return come from the browser.
 */
export function LineEditSheet({ line, product, mode = "edit", onClose }: { line: CartLine; product: CartProduct; mode?: "edit" | "add"; onClose: () => void }) {
  const { updateLine, addLine, lines } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const [colourKey, setColourKey] = useState(line.colourKey);
  const [size, setSize] = useState(line.size);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) { d.showModal(); headRef.current?.focus(); }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const colour = product.colours.find((c) => c.key === colourKey);
  const adding = mode === "add";
  const changed = colourKey !== line.colourKey || size !== line.size;
  const targetSku = lineSku(line.slug, product.colourAsk ? ASK_COLOUR_KEY : colourKey, size);
  const exists = adding && lines.some((l) => l.sku === targetSku);
  const save = () => {
    const key = product.colourAsk ? ASK_COLOUR_KEY : colourKey;
    const label = product.colourAsk ? ASK_COLOUR_LABEL : colour?.label ?? line.colourLabel;
    if (adding) {
      addLine({ sku: targetSku, slug: line.slug, name: line.name, colourKey: key, colourLabel: label, size, image: colour?.src ?? line.image, qty: 1, category: line.category });
    } else if (changed) {
      const patch = product.colourAsk ? { size } : { size, colourKey, colourLabel: label, image: colour?.src ?? line.image };
      const r = updateLine(line.sku, patch);
      // The row is rebuilt under a new key, so focus goes to the new row's name once it exists.
      requestAnimationFrame(() => document.getElementById(`line-${r.sku}`)?.querySelector<HTMLElement>("a:not([aria-hidden])")?.focus());
    }
    onClose();
  };

  return (
    <dialog ref={ref} aria-labelledby="edit-title" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} className="ck-sheet">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-sand px-4">
        <h2 id="edit-title" ref={headRef} tabIndex={-1} className="text-[.9375rem] focus:outline-none">{adding ? `Add another ${product.name}` : `Edit ${product.name}`}</h2>
        <button type="button" aria-label="Close without saving" onClick={onClose} className="hit-area inline-flex size-9 items-center justify-center rounded-full text-baobab"><Icon name="close" size={22} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {adding ? <p className="mb-2 text-[.8125rem] text-stone">Pick a different size or colour. It is added as its own line, and the one you have stays.</p> : null}
        {product.colourAsk ? (
          <p className="rounded-[var(--radius-input)] bg-oat px-3 py-2 text-[.8125rem]">{ASK_COLOUR_LABEL}. We confirm the colours with you on WhatsApp.</p>
        ) : (
          <fieldset className="min-w-0 border-0 p-0">
            <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">Colour: <span className="font-normal">{colour?.label ?? ""}</span></legend>
            <div className="grid grid-cols-3 gap-1.5 min-[420px]:grid-cols-4">
              {product.colours.map((c) => (
                <label key={c.key} className="relative cursor-pointer">
                  <input type="radio" name="edit-colour" value={c.key} checked={colourKey === c.key} onChange={() => setColourKey(c.key)} className="peer sr-only" />
                  <span className={cx("flex h-full flex-col items-center gap-0.5 rounded-[12px] bg-oat p-1 text-center text-[.75rem] font-semibold leading-tight text-charcoal ring-2 ring-transparent",
                    "peer-checked:bg-bone peer-checked:ring-baobab peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus")}>
                    <span className="relative block aspect-square w-full overflow-hidden rounded-[9px] bg-sand">
                      <Image src={c.src} alt="" fill sizes="96px" className={cx("object-cover", c.multiply && "mix-blend-multiply")} style={{ objectPosition: `${c.focal[0] * 100}% ${c.focal[1] * 100}%` }} />
                    </span>
                    <span className="line-clamp-2 min-h-[2.2em]">{c.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset className="mt-3 min-w-0 border-0 p-0">
          <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">Size: <span className="font-normal">{sizeWord(size)}</span></legend>
          <div className="ck-seg">
            {product.sizes.map((s) => (
              <label key={s}><input type="radio" name="edit-size" value={s} checked={size === s} onChange={() => setSize(s)} /><span>{sizeWord(s)}</span></label>
            ))}
          </div>
          <p className="mt-1.5 text-[.8125rem] text-stone">
            Small is the smallest and Extra large the largest. We do not list centimetres.{" "}
            <Link href="/size-guide" className="hit font-semibold text-terracotta-deep underline underline-offset-4">Size guide</Link>
            {" "}<Link prefetch={false} href="/size-finder?src=cart" className="hit font-semibold text-terracotta-deep underline underline-offset-4">Find the right size</Link>
          </p>
        </fieldset>
        <p className="mt-2 text-[.8125rem] text-stone" aria-live="polite">
          {exists ? "You already have this one. Adding it raises its quantity by one."
            : changed ? `${adding ? "You will add" : "You will have"} ${lineName({ ...line, colourKey, colourLabel: colour?.label ?? line.colourLabel })}, ${sizeWord(size)}.`
            : adding ? "Choose a different size or colour." : "Nothing changed yet."}
        </p>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-sand bg-bone p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <Button variant="ghost" size="large" onClick={onClose}>Cancel</Button>
        <Button size="large" onClick={save} disabled={!changed} aria-disabled={!changed}>{adding ? "Add to my list" : "Save changes"}</Button>
      </div>
    </dialog>
  );
}
