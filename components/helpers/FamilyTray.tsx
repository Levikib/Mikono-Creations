"use client";
import { Icon } from "@/components/Icon";
import { AnimalPhoto } from "./AnimalPhoto";
import { FAMILY_MAX_QTY } from "@/data/helpers";
import { sizeWord } from "@/data/studio/labels";
import { freeCombo, skuFor } from "@/lib/helpers/family";
import type { FamilyLine, HelperAnimal, SizeKey } from "@/lib/helpers/types";

const SIZES: SizeKey[] = ["S", "M", "L", "XL"];
const STEP: Record<SizeKey, number> = { S: 52, M: 64, L: 76, XL: 88 };

/** Live preview: each chosen animal's real photo, taller for bigger sizes. A relative picture, not to scale. */
export function FamilyPreview({ lines, animals }: { lines: FamilyLine[]; animals: HelperAnimal[] }) {
  return (
    <ul aria-label="Your family, in photos" className="mkh-well flex max-w-full min-h-[6.5rem] items-end gap-2 overflow-x-auto px-3 pb-3 pt-3">
      {lines.length === 0 ? <li className="mkh-muted self-center text-[.9375rem]">Your animals will line up here.</li> : null}
      {lines.map((l) => {
        const a = animals.find((x) => x.slug === l.slug);
        const c = a?.colours.find((x) => x.key === l.colourKey);
        if (!a || !c) return null;
        return (
          <li key={skuFor(l)} className="mkh-pop relative flex-none" style={{ width: STEP[l.size] }}>
            <AnimalPhoto image={c.image} sizes="90px" alt={`${l.qty} ${a.name}, ${c.label}, ${sizeWord(l.size).toLowerCase()}`} className="!rounded-[14px]" />
            {l.qty > 1 ? <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[.8125rem] font-bold" style={{ background: "var(--h-accent)", color: "var(--h-bone)" }} aria-hidden="true">{l.qty}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const b = "flex size-11 items-center justify-center rounded-full text-[1.125rem] font-semibold disabled:opacity-45";
  return (
    <div role="group" aria-label={label} className="mkh-well inline-flex items-center gap-0.5 !rounded-full p-0.5">
      <button type="button" className={b} aria-label="One fewer" disabled={value <= 1} onClick={() => onChange(value - 1)}><span aria-hidden="true">&minus;</span></button>
      <span aria-live="polite" className="min-w-8 text-center text-[.9375rem] font-semibold tabular-nums">{value}</span>
      <button type="button" className={b} aria-label="One more" disabled={value >= FAMILY_MAX_QTY} onClick={() => onChange(value + 1)}><span aria-hidden="true">+</span></button>
    </div>
  );
}

/** One tray line per animal, colourway and size. Colour comes from the real colourways. Sizes are the four classes. */
export function FamilyTray({ lines, animals, onPatch, onRemove, onDuplicate, full }: {
  lines: FamilyLine[]; animals: HelperAnimal[]; onPatch: (i: number, patch: Partial<FamilyLine>) => void; onRemove: (i: number) => void; onDuplicate: (i: number) => void; full?: boolean;
}) {
  if (!lines.length) {
    return (
      <div className="mkh-well flex min-h-28 flex-col items-center justify-center gap-1 px-4 py-3 text-center">
        <p className="font-display text-[.9375rem] font-bold">No animals yet</p>
        <p className="mkh-muted text-[.9375rem]">Tap an animal in the list to start your family.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-2.5">
      {lines.map((l, i) => {
        const a = animals.find((x) => x.slug === l.slug);
        const c = a?.colours.find((x) => x.key === l.colourKey);
        if (!a || !c) return null;
        const id = `mkh-line-${i}`;
        return (
          <li key={`${l.slug}-${i}`} className="mkh-card p-2.5" data-card="family-line">
            <div className="flex items-center gap-2.5">
              <div className="w-14 flex-none"><AnimalPhoto image={c.image} sizes="56px" alt="" className="!rounded-[12px]" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[1rem] font-bold leading-tight">{a.name}</p>
                <p className="mkh-muted truncate text-[.9375rem]">{c.label}, {sizeWord(l.size).toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => onRemove(i)} aria-label={`Remove ${a.name}, ${c.label}, ${sizeWord(l.size).toLowerCase()}`}
                className="flex size-11 flex-none items-center justify-center rounded-full" style={{ color: "var(--h-soft)" }}>
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="mt-2 grid gap-2">
              {a.colourAsk ? (
                <p className="mkh-muted text-[.9375rem]">Colour is confirmed with you on WhatsApp.</p>
              ) : (
                <div>
                  <label htmlFor={`${id}-c`} className="sr-only">Colour for {a.name}</label>
                  <select id={`${id}-c`} value={l.colourKey} onChange={(e) => onPatch(i, { colourKey: e.target.value })}>
                    {a.colours.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
                  </select>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <div role="group" aria-label={`Size for ${a.name}`} className="mkh-well mkh-seg min-w-0 flex-1 basis-full sm:basis-[14rem]">
                  {SIZES.filter((s) => a.sizes.includes(s)).map((s) => (
                    <button key={s} type="button" aria-pressed={l.size === s} aria-label={`Size ${sizeWord(s).toLowerCase()}`} onClick={() => onPatch(i, { size: s })}>{sizeWord(s)}</button>
                  ))}
                </div>
                <Stepper value={l.qty} label={`Quantity for ${a.name}`} onChange={(n) => onPatch(i, { qty: n })} />
              </div>
              {!full && freeCombo(lines, a, l) ? (
                <button type="button" onClick={() => onDuplicate(i)} className="mkh-btn-text justify-self-start" aria-label={`Add another ${a.name} in a different size or colour`}>
                  <Icon name="sparkle" size={16} />Add another size or colour
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
