"use client";
import type { ReactNode } from "react";
import { PAYMENT_METHODS_NOTE, PAYMENT_METHODS_TITLE, PAYMENT_NOTE, paymentMethods, paymentTiming } from "@/data/studio/payment";
import { type PayPref } from "@/lib/enquiryForm";
import { ACCESS_HINT, ACCESS_QUESTION, CONTACT_ROLES, LANGUAGE_NOTE, MAX_CONTACTS, MAX_OUTLETS, MAX_PRODUCTS, OTHER_LABEL, OTHER_TEXT_MAX, QTY_BANDS, REACH_CHANNELS, REACH_LANGUAGES, REACH_TIMES, emptyContact, emptyOutlet, emptyProduct, reachHasValue, type ExtraContact, type Outlet, type ProductInterest, type Reach } from "@/lib/enquiryForm";
import { sizeWord } from "@/lib/sizes";
import { Button } from "../Button";
import { ErrorText, SelectField, TextareaField, TextField } from "../Form";
import { Tick } from "../Tick";
import { useCatalogue } from "../CatalogueContext";
import { cx } from "@/lib/cx";

/** Several choices at once: checkboxes with an optional help line. The wrapper has the id so an error link can focus it. */
export function CheckList({ id, legend, hint, error, values, onChange, options, compact }: {
  id: string; legend: string; hint?: string; error?: string; values: string[]; onChange: (v: string[]) => void;
  options: ReadonlyArray<{ value: string; label: string; help?: string }>; compact?: boolean;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">{legend}</legend>
      <p className="mb-1 text-[.8125rem] text-stone">{hint ?? "Choose all that apply."}</p>
      <div id={id} tabIndex={-1} className={cx("focus:outline-none", compact ? "flex flex-wrap gap-1.5" : "grid gap-1.5")}>
        {options.map((o) => {
          const on = values.includes(o.value);
          return (
            <label key={o.value} className={cx("flex min-h-11 cursor-pointer gap-2 rounded-[var(--radius-input)] border-[1.5px] px-2.5 py-1.5", compact ? "items-center" : "items-start",
              on ? "border-terracotta-deep bg-terracotta-tint" : error ? "border-brick bg-paper" : "border-line bg-paper",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta")}>
              <Tick type="checkbox" name={id} value={o.value} checked={on} onChange={(e) => onChange(e.target.checked ? [...values, o.value] : values.filter((x) => x !== o.value))} />
              <span><span className="block text-sm font-semibold text-charcoal">{o.label}</span>{o.help ? <span className="block text-[.8125rem] text-stone">{o.help}</span> : null}</span>
            </label>
          );
        })}
      </div>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </fieldset>
  );
}

/** Shown in place of the add button when a list has reached its safety limit. */
const FullNote = ({ what }: { what: string }) => <p className="text-[.8125rem] text-stone">That is a lot of {what}. For more, send a second request or tell us on WhatsApp.</p>;

function ListFrame({ title, hint, children, add }: { title: string; hint?: string; children: ReactNode; add: ReactNode }) {
  return (
    <fieldset className="grid min-w-0 gap-2 border-0 p-0">
      <legend className="mb-0 text-[.8125rem] font-semibold text-baobab">{title}</legend>
      {hint ? <p className="-mt-1 text-[.8125rem] text-stone">{hint}</p> : null}
      {children}
      <div>{add}</div>
    </fieldset>
  );
}

/** Pick several animals from the real catalogue, each with a quantity band and, if asked, a size. */
export function ProductPicker({ idBase = "prod", title = "Animals you are interested in", hint = "Add as many as you like. A rough quantity is fine.", rows, onChange, withSize }: {
  idBase?: string; title?: string; hint?: string; rows: ProductInterest[]; onChange: (r: ProductInterest[]) => void; withSize?: boolean;
}) {
  const { products } = useCatalogue();
  const put = (i: number, p: Partial<ProductInterest>) => onChange(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));
  const names = products.map((p) => p.name);
  return (
    <ListFrame title={title} hint={hint} add={rows.length < MAX_PRODUCTS ? <Button variant="secondary" size="compact" onClick={() => onChange([...rows, emptyProduct()])}>{rows.length ? "Add another animal" : "Add an animal"}</Button> : <FullNote what="animals" />}>
      {rows.map((r, i) => (
        <div key={i} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 rounded-[var(--radius-input)] bg-paper p-2.5" data-row="product">
          <div className="flex items-center justify-between"><p className="text-[.8125rem] font-semibold">Animal {i + 1}</p>
            <button type="button" className="ck-tbtn" onClick={() => onChange(rows.filter((_, k) => k !== i))} aria-label={`Remove animal ${i + 1}`}>Remove</button></div>
          <SelectField id={`${idBase}${i}_animal`} label="Animal" value={r.name} onChange={(v) => { const p = products.find((x) => x.name === v); put(i, { slug: p?.slug ?? "", name: v }); }} options={names} placeholder="Choose an animal" />
          <div className={withSize ? "grid grid-cols-2 gap-2" : ""}>
            {withSize ? <SelectField id={`${idBase}${i}_size`} label="Size" optional value={r.size ? sizeWord(r.size) : ""} onChange={(v) => put(i, { size: ({ Small: "S", Medium: "M", Large: "L", "Extra large": "XL" } as Record<string, string>)[v] ?? "" })} options={["Small", "Medium", "Large", "Extra large"]} placeholder="Any size" /> : null}
            <SelectField id={`${idBase}${i}_band`} label="How many" optional value={r.band} onChange={(v) => put(i, { band: v })} options={QTY_BANDS} placeholder="A rough number" />
          </div>
        </div>
      ))}
    </ListFrame>
  );
}

/** Several shops, lodges or locations. */
export function OutletList({ title = "Your locations", hint = "If you have more than one shop or place, add each one.", rows, onChange, errors = {} }: {
  title?: string; hint?: string; rows: Outlet[]; onChange: (r: Outlet[]) => void; errors?: Record<string, string>;
}) {
  const put = (i: number, p: Partial<Outlet>) => onChange(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));
  return (
    <ListFrame title={title} hint={hint} add={rows.length < MAX_OUTLETS ? <Button variant="secondary" size="compact" onClick={() => onChange([...rows, emptyOutlet()])}>{rows.length ? "Add another location" : "Add a location"}</Button> : <FullNote what="locations" />}>
      {rows.map((r, i) => (
        <div key={i} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 rounded-[var(--radius-input)] bg-paper p-2.5" data-row="outlet">
          <div className="flex items-center justify-between"><p className="text-[.8125rem] font-semibold">Location {i + 1}</p>
            <button type="button" className="ck-tbtn" onClick={() => onChange(rows.filter((_, k) => k !== i))} aria-label={`Remove location ${i + 1}`}>Remove</button></div>
          <TextField id={`outlet${i}_name`} label="Name of the shop or place" optional autoComplete="off" value={r.name} onChange={(v) => put(i, { name: v })} />
          <TextField id={`outlet${i}_place`} label="Town or area" autoComplete="off" value={r.place} onChange={(v) => put(i, { place: v })} error={errors[`outlet${i}_place`]} />
        </div>
      ))}
    </ListFrame>
  );
}

/** More people to speak to: for example an ordering contact and a billing contact. */
export function ContactList({ rows, onChange, errors = {} }: { rows: ExtraContact[]; onChange: (r: ExtraContact[]) => void; errors?: Record<string, string> }) {
  const put = (i: number, p: Partial<ExtraContact>) => onChange(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));
  return (
    <ListFrame title="Other people we should speak to" hint="For example a billing contact. Optional."
      add={rows.length < MAX_CONTACTS ? <Button variant="secondary" size="compact" onClick={() => onChange([...rows, emptyContact(rows.length ? CONTACT_ROLES[4] : CONTACT_ROLES[1])])}>{rows.length ? "Add another contact" : "Add a billing or other contact"}</Button> : <FullNote what="contacts" />}>
      {rows.map((r, i) => (
        <div key={i} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 rounded-[var(--radius-input)] bg-paper p-2.5" data-row="contact">
          <div className="flex items-center justify-between"><p className="text-[.8125rem] font-semibold">Contact {i + 2}</p>
            <button type="button" className="ck-tbtn" onClick={() => onChange(rows.filter((_, k) => k !== i))} aria-label={`Remove contact ${i + 2}`}>Remove</button></div>
          <SelectField id={`contact${i}_role`} label="Role" value={r.role} onChange={(v) => put(i, { role: v })} options={CONTACT_ROLES} placeholder="Choose a role" />
          <TextField id={`contact${i}_name`} label="Full name" autoComplete="off" value={r.name} onChange={(v) => put(i, { name: v })} error={errors[`contact${i}_name`]} />
          <TextField id={`contact${i}_phone`} label="Phone" hint="Kenyan, or with the country code for a number abroad." type="tel" inputMode="tel" autoComplete="off" value={r.phone} onChange={(v) => put(i, { phone: v })} error={errors[`contact${i}_phone`]} />
          <TextField id={`contact${i}_email`} label="Email" optional type="email" inputMode="email" autoComplete="off" value={r.email} onChange={(v) => put(i, { email: v })} error={errors[`contact${i}_email`]} />
        </div>
      ))}
    </ListFrame>
  );
}

/** How and when to reply, in what language, and anything that would make this easier. Every part is optional and nothing here is saved. */
export function ReachFields({ idBase = "reach", value, onChange, errors = {}, emailId = "email" }: { idBase?: string; value: Reach; onChange: (r: Reach) => void; errors?: Record<string, string>; emailId?: string }) {
  const hasErr = !!(errors.channelOther || errors.languageOther);
  void emailId;
  return (
    <details open={reachHasValue(value) || hasErr || undefined} className="rounded-[var(--radius-card)] bg-oat px-3 pb-3" data-reach>
      <summary className="flex min-h-11 cursor-pointer items-center text-[.875rem] font-semibold text-baobab">How should we reply to you? (optional)</summary>
      <div className="grid gap-2.5">
        <CheckList compact id={`${idBase}-channels`} legend="Reach me by" values={value.channels} onChange={(v) => onChange({ ...value, channels: v })} options={REACH_CHANNELS.map((x) => ({ value: x, label: x }))} />
        {value.channels.includes(OTHER_LABEL) ? <TextField id="channelOther" label="Which other way to reach you?" value={value.channelOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => onChange({ ...value, channelOther: v })} error={errors.channelOther} /> : null}
        <CheckList compact id={`${idBase}-times`} legend="Best times" values={value.times} onChange={(v) => onChange({ ...value, times: v })} options={REACH_TIMES.map((x) => ({ value: x, label: x }))} />
        <CheckList compact id={`${idBase}-language`} legend="Language" hint={LANGUAGE_NOTE} values={value.languages} onChange={(v) => onChange({ ...value, languages: v })} options={REACH_LANGUAGES.map((x) => ({ value: x, label: x }))} />
        {value.languages.includes(OTHER_LABEL) ? <TextField id="languageOther" label="Which language?" value={value.languageOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => onChange({ ...value, languageOther: v })} error={errors.languageOther} /> : null}
        <TextareaField id={`${idBase}-access`} label={ACCESS_QUESTION} optional rows={2} maxLength={300} value={value.access} onChange={(v) => onChange({ ...value, access: v })} hint={ACCESS_HINT} />
      </div>
    </details>
  );
}

/** When and how to pay. Optional. Nothing is paid on the page, and the way to pay is to be confirmed. */
export function PayFields({ idBase = "pay", value, onChange, errors = {} }: { idBase?: string; value: PayPref; onChange: (p: PayPref) => void; errors?: Record<string, string> }) {
  return (
    <details open={!!(value.timing || value.methods.length) || !!errors.payOther || undefined} className="rounded-[var(--radius-card)] bg-oat px-3 pb-3" data-pay>
      <summary className="flex min-h-11 cursor-pointer items-center text-[.875rem] font-semibold text-baobab">How would you like to pay? (optional)</summary>
      <div className="grid gap-2.5">
        <CheckList compact id={`${idBase}-timing`} legend="When would you like to pay?" hint="Pick one. Nothing is paid on this page." values={value.timing ? [value.timing] : []}
          onChange={(v) => onChange({ ...value, timing: v.filter((x) => x !== value.timing)[0] ?? "" })} options={paymentTiming.map((x) => ({ value: x.id, label: x.label }))} />
        <CheckList compact id={`${idBase}-methods`} legend={`${PAYMENT_METHODS_TITLE} (optional)`} hint={PAYMENT_METHODS_NOTE} values={value.methods} onChange={(v) => onChange({ ...value, methods: v })} options={paymentMethods.map((x) => ({ value: x.id, label: x.label }))} />
        {value.methods.includes("other") ? <TextField id="payOther" label="Which other way to pay?" value={value.other} maxLength={120} autoComplete="off" onChange={(v) => onChange({ ...value, other: v })} error={errors.payOther} /> : null}
        <p className="text-[.8125rem] text-stone">{PAYMENT_NOTE}</p>
      </div>
    </details>
  );
}
