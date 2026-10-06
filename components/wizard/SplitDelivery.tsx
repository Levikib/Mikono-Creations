"use client";
import { useMemo } from "react";
import { counties } from "@/data/counties";
import { OTHER_AREA, sortedAreaNames } from "@/data/deliveryAreas";
import type { Errors, Form } from "@/lib/orderForm";
import { sizeWord } from "@/lib/sizes";
import { allToFirst, allocated, dropUnits, MAX_DROPS, newDrop, setAlloc, type Drop, type SplitLine } from "@/lib/split";
import { MAX_QTY_PER_LINE } from "@/lib/site";
import { Button } from "../Button";
import { SelectField, TextField, TextareaField } from "../Form";
import { Segmented } from "./ui";

function AllocStepper({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  const btn = "hit-area inline-flex size-8 items-center justify-center rounded-full bg-oat text-[1.0625rem] font-semibold text-baobab shadow-clay-sm disabled:opacity-40";
  return (
    <div role="group" aria-label={label} className="clay-well inline-flex shrink-0 items-center rounded-full p-1">
      <button type="button" className={btn} aria-label={`One less: ${label}`} disabled={value <= 0} onClick={() => onChange(value - 1)}><span aria-hidden="true">&minus;</span></button>
      <span className="w-7 text-center text-[1rem] font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={btn} aria-label={`One more: ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}><span aria-hidden="true">+</span></button>
    </div>
  );
}

/**
 * Send to more than one place. One cart, one order reference. Every animal is shared out by quantity across the places,
 * each place has an adult who receives it and an optional gift note. Works at 320px: one column, steppers per animal.
 */
export function SplitDelivery({ form, set, errors, lines }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void; errors: Errors; lines: SplitLine[] }) {
  const areaNames = useMemo(() => [...sortedAreaNames(), OTHER_AREA], []);
  const drops = form.drops;
  const setDrops = (next: Drop[]) => set("drops", next);
  const patch = (i: number, p: Partial<Drop>) => setDrops(drops.map((d, k) => (k === i ? { ...d, ...p } : d)));
  const open = lines.filter((l) => allocated(drops, l.sku) < l.qty);
  const over = lines.filter((l) => allocated(drops, l.sku) > l.qty);
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2.5" data-testid="split">
      <div id="alloc" tabIndex={-1} className="rounded-[var(--radius-input)] bg-oat p-3 focus:outline-none" aria-live="polite">
        <p className="text-[.875rem] font-semibold">{drops.length} places, {lines.reduce((n, l) => n + l.qty, 0)} animals to share out</p>
        {open.length === 0 && over.length === 0 ? (
          <p className="text-[.8125rem] text-olive-deep">Every animal has a place.</p>
        ) : (
          <ul className="mt-0.5 text-[.8125rem]">
            {open.slice(0, 4).map((l) => <li key={l.sku}>{l.name}, {l.colourLabel}, {sizeWord(l.size)}: {l.qty - allocated(drops, l.sku)} still to place</li>)}
            {open.length > 4 ? <li>and {open.length - 4} more lines still to place</li> : null}
            {over.slice(0, 4).map((l) => <li key={l.sku} className="text-brick">{l.name}, {sizeWord(l.size)}: too many placed</li>)}
            {over.length > 4 ? <li className="text-brick">and {over.length - 4} more with too many placed</li> : null}
          </ul>
        )}
        {errors.alloc ? <p className="mt-1 text-[.8125rem] font-bold text-brick">{errors.alloc}</p> : null}
        <div className="mt-1.5 flex flex-wrap gap-x-2">
          <Button variant="secondary" size="compact" onClick={() => setDrops(allToFirst(lines, drops))}>All to place 1</Button>
          {drops.length < MAX_DROPS ? <Button variant="secondary" size="compact" onClick={() => setDrops([...drops, newDrop(Number(drops[drops.length - 1]?.id.slice(1) ?? drops.length) + 1)])}>Add another place</Button> : <p className="text-[.8125rem] text-stone">That is {MAX_DROPS} places. For more, send us a second order or tell us on WhatsApp.</p>}
        </div>
      </div>

      {drops.map((d, i) => {
        const k = (f: string) => `drop${i}_${f}`;
        const units = dropUnits(d);
        return (
          <section key={d.id} aria-labelledby={`${d.id}-h`} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 rounded-[var(--radius-card)] bg-paper p-3 shadow-clay-sm" data-drop={i}>
            <div className="flex items-center justify-between gap-2">
              <h3 id={`${d.id}-h`} className="text-[.9375rem]">Place {i + 1} <span className="font-sans text-[.8125rem] font-normal text-stone">({units} {units === 1 ? "animal" : "animals"})</span></h3>
              {drops.length > 2 ? <button type="button" className="ck-tbtn" onClick={() => setDrops(drops.filter((_, x) => x !== i))} aria-label={`Remove place ${i + 1}`}>Remove place</button> : null}
            </div>
            {errors[k("units")] ? <p id={k("units")} tabIndex={-1} className="text-[.8125rem] font-bold text-brick">{errors[k("units")]}</p> : null}
            <Segmented id={k("fulfilment")} legend="How should this place get it?" value={d.fulfilment} onChange={(v) => patch(i, { fulfilment: v as Drop["fulfilment"] })}
              options={[{ value: "nairobi", label: "Nairobi" }, { value: "town", label: "Other Kenyan town" }, { value: "courier", label: "Courier or bus service" }, { value: "pickup", label: "Meet and collect" },
                { value: "collect", label: "Someone collects" }, { value: "abroad", label: "Outside Kenya (ask us)" }, { value: "other", label: "Other, tell us" }]} />
            {d.fulfilment === "pickup" || d.fulfilment === "collect" ? (
              <p className="text-[.8125rem] text-stone">{d.fulfilment === "pickup" ? "We have no shop, so we agree a meeting place and time on WhatsApp." : "We confirm who collects it, and where, on WhatsApp."}</p>
            ) : d.fulfilment === "abroad" ? (
              <TextField id={k("other")} label="Which country and city?" autoComplete="off" maxLength={80} value={d.other} onChange={(v) => patch(i, { other: v })} error={errors[k("other")]}
                hint="We say what is possible." />
            ) : d.fulfilment === "other" ? (
              <TextareaField id={k("other")} label="How should this place get it?" rows={2} maxLength={200} value={d.other} onChange={(v) => patch(i, { other: v })} error={errors[k("other")]} />
            ) : d.fulfilment === "nairobi" ? (
              <>
                <SelectField id={k("area")} label="Area" value={d.area} onChange={(v) => patch(i, { area: v })} options={areaNames} placeholder="Choose the area" error={errors[k("area")]} />
                {d.area === OTHER_AREA ? <TextField id={k("areaOther")} label="Which area?" value={d.areaOther} onChange={(v) => patch(i, { areaOther: v })} error={errors[k("areaOther")]} /> : null}
                <TextField id={k("landmark")} label="Estate, street, building or landmark" autoComplete="off" value={d.landmark} onChange={(v) => patch(i, { landmark: v })} error={errors[k("landmark")]} />
              </>
            ) : (
              <>
                <SelectField id={k("county")} label="County" value={d.county} onChange={(v) => patch(i, { county: v })} options={counties} placeholder="Choose the county" error={errors[k("county")]} />
                <TextField id={k("town")} label="Town or area" autoComplete="off" value={d.town} onChange={(v) => patch(i, { town: v })} error={errors[k("town")]} />
                <TextField id={k("landmark")} label={d.fulfilment === "courier" ? "Courier or bus service, and the office" : "Landmark or parcel office"} optional autoComplete="off" value={d.landmark} onChange={(v) => patch(i, { landmark: v })} />
              </>
            )}
            <TextField id={k("mapsPin")} label="Google Maps pin link" optional type="url" inputMode="url" autoComplete="off" maxLength={300} value={d.mapsPin} onChange={(v) => patch(i, { mapsPin: v })} error={errors[k("mapsPin")]} />
            <TextField id={k("recipientName")} label="Adult receiving it" autoComplete="off" value={d.recipientName} onChange={(v) => patch(i, { recipientName: v })} error={errors[k("recipientName")]}
              hint="An adult we can call. Please do not add a child's name or age." />
            <TextField id={k("recipientPhone")} label="Their phone number" type="tel" inputMode="tel" autoComplete="off" hint="Kenyan or international, with the country code." value={d.recipientPhone} onChange={(v) => patch(i, { recipientPhone: v })} error={errors[k("recipientPhone")]} />
            <TextareaField id={k("giftNote")} label="Gift note for this place" optional rows={2} maxLength={240} counter value={d.giftNote} onChange={(v) => patch(i, { giftNote: v })}
              hint="Please do not include a child's name, surname, school or age." />
            <fieldset className="min-w-0 border-0 p-0">
              <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">Animals for place {i + 1}</legend>
              <ul className="grid max-h-[22rem] grid-cols-[minmax(0,1fr)] gap-1.5 overflow-y-auto overscroll-contain pr-1" tabIndex={lines.length > 6 ? 0 : undefined} aria-label={lines.length > 6 ? `Animals for place ${i + 1}, scrolls` : undefined}>
                {lines.map((l) => {
                  const here = d.alloc[l.sku] ?? 0;
                  const left = l.qty - allocated(drops, l.sku);
                  return (
                    <li key={l.sku} className="flex min-w-0 items-center justify-between gap-2">
                      <span className="min-w-0 text-[.8125rem] leading-tight">
                        <span className="block truncate font-semibold">{l.name}</span>
                        <span className="block truncate text-stone">{l.colourLabel}, {sizeWord(l.size)} (of {l.qty})</span>
                      </span>
                      <AllocStepper label={`${l.name}, ${sizeWord(l.size)}, for place ${i + 1}`} value={here} max={Math.min(MAX_QTY_PER_LINE, here + Math.max(left, 0))}
                        onChange={(n) => setDrops(setAlloc(drops, i, l.sku, n))} />
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </section>
        );
      })}
    </div>
  );
}
