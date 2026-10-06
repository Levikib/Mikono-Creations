import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { AnimalPhoto } from "./AnimalPhoto";
import { sizeWord } from "@/data/studio/labels";
import { formatKes, unitPriceKes } from "@/lib/pricing";
import type { GiftPick } from "@/lib/helpers/types";

/**
 * A recommended animal. Photo, name, the colourway and size we matched, up to three facts, then one main action
 * (add to the order list) with two quiet links under it. Every card in a row has the same height.
 */
export function ResultCard({ pick, rank, askHref, customHref, onAdd, onAsk, onCustom, eager }: {
  pick: GiftPick; rank: number; askHref: string | null; customHref: string; onAdd: () => void; onAsk: () => void; onCustom: () => void; eager?: boolean;
}) {
  const { animal, colour, size, reasons } = pick;
  return (
    <article className="mkh-card mkh-rise flex h-full flex-col gap-3 p-3 md:p-3.5" data-card="helper-result" style={{ animationDelay: `${rank * 70}ms` }}>
      <div className="grid grid-cols-[6.5rem_1fr] items-start gap-3 md:grid-cols-1">
        <AnimalPhoto image={colour.image} sizes="(min-width:1024px) 300px, (min-width:768px) 30vw, 104px" eager={eager} alt={`${animal.name}, ${colour.label}`} className="md:!aspect-[5/4]" />
        <div className="min-w-0">
          <p className="mkh-eyebrow">Pick {rank + 1}</p>
          <h3 className="mt-0.5 text-[1.125rem] leading-tight md:text-[1.125rem]">
            <Link href={`/shop/${animal.slug}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{animal.name}</Link>
          </h3>
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="mkh-pill">{colour.label}</span>
            <span className="mkh-pill">{sizeWord(size)}</span>
            {unitPriceKes(animal.slug, size) !== null ? <span className="mkh-pill price" data-testid="result-price">{formatKes(unitPriceKes(animal.slug, size) as number)}</span> : null}
          </p>
        </div>
      </div>
      <ul className="mkh-muted flex-1 space-y-1.5 text-[.9375rem] leading-snug">
        {reasons.map((r) => (
          <li key={r} className="flex gap-2"><Icon name="check" size={16} className="mt-[3px] shrink-0 text-[var(--h-accent)]" /><span>{r}</span></li>
        ))}
      </ul>
      <button type="button" onClick={onAdd} className={buttonClass("primary", "compact", "w-full")}>
        <Icon name="cart" size={20} />Add to order list<span className="sr-only">: {animal.name}, {colour.label}, {sizeWord(size).toLowerCase()}</span>
      </button>
      <div className="grid grid-cols-2 gap-2">
        <a href={askHref ?? "/contact"} onClick={onAsk} {...(askHref ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mkh-btn-text">
          <Icon name="whatsapp" size={18} />Ask on WhatsApp<span className="sr-only">: {animal.name}</span>
        </a>
        <Link href={customHref} onClick={onCustom} className="mkh-btn-text">
          <Icon name="sparkle" size={18} />Make it custom<span className="sr-only">: {animal.name}</span>
        </Link>
      </div>
    </article>
  );
}
