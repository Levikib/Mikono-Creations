"use client";
import { useRef } from "react";
import { ProductCard, type ProductCardData } from "./ProductCard";
import { Icon } from "./Icon";

/** Horizontal rail of the same uniform card (design system 5.6 rule 8), with arrow buttons and a keyboard focusable scroller. */
export function ProductRail({ items, label }: { items: readonly ProductCardData[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.8), behavior: reduce ? "auto" : "smooth" });
  };
  const arrow = "iconbtn";
  return (
    <div>
      <div className="mb-2 flex justify-end gap-2 max-md:hidden">
        <button type="button" className={arrow} onClick={() => go(-1)} aria-label={`Scroll ${label} back`}><Icon name="chevron" size={22} className="rotate-90" /></button>
        <button type="button" className={arrow} onClick={() => go(1)} aria-label={`Scroll ${label} forward`}><Icon name="chevron" size={22} className="-rotate-90" /></button>
      </div>
      <div ref={ref} role="region" aria-label={`${label}, scrolls sideways`} tabIndex={0}
        className="scroller -mx-3 snap-x overflow-x-auto scroll-px-3 px-3 md:-mx-4 md:scroll-px-4 md:px-4 xl:mx-0 xl:px-0">
        <ul data-scroller data-card-group className="flex w-max items-stretch gap-2 pb-2 pt-1.5 md:gap-3">
          {items.map((it) => (
            <li key={it.href} className="flex w-[132px] shrink-0 snap-start md:w-[188px] xl:w-[210px]">
              <ProductCard item={it} sizes="(min-width:1280px) 210px, (min-width:768px) 188px, 132px" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
