import Image from "@/components/Img";
import Link from "next/link";
import type { PhotoSrc } from "./Polaroid";

export type CategoryCircle = { label: string; href: string; image?: PhotoSrc; tint?: string };

/** Round category thumbnails in one row. Native sideways scroll on phones, an even row from 768 px. */
export function CategoryCircles({ items }: { items: readonly CategoryCircle[] }) {
  return (
    <ul data-scroller data-card-group className="scroller -mx-3 flex snap-x items-stretch gap-2 overflow-x-auto scroll-px-3 px-3 pb-1 pt-1 md:mx-0 md:justify-center md:gap-4 md:overflow-visible md:px-0">
      {items.map((it) => (
        <li key={it.href} className="w-[68px] shrink-0 snap-start md:w-[88px] xl:w-[96px]">
          <Link href={it.href} data-card="category" className="group flex h-full flex-col items-center gap-1 text-center">
            <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-sand shadow-clay-sm ring-[3px] ring-paper transition-transform duration-300 ease-[var(--ease-squish)] group-hover:-translate-y-0.5 group-active:scale-95">
              {it.image ? <Image src={it.image.src} alt="" fill sizes="(min-width:1280px) 96px, (min-width:768px) 88px, 68px" className="object-cover" /> : <span data-placeholder className="block size-full bg-sand" />}
            </span>
            <span className="min-h-[2.4em] text-[.8125rem] font-semibold leading-[1.2] text-baobab">{it.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
