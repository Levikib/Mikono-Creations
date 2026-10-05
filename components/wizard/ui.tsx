"use client";
import type { ReactNode } from "react";
import { control, ErrorText, Label } from "../Form";
import { cx } from "@/lib/cx";

/** Radio chips: 36px tall, 44px hit area. */
export function Segmented({ id, legend, value, onChange, options, error, hint }: {
  id: string; legend: string; value: string; onChange: (v: string) => void; options: ReadonlyArray<{ value: string; label: string }>; error?: string; hint?: string;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0" aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">{legend}</legend>
      {hint ? <p className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <div id={id} tabIndex={-1} className="ck-seg focus:outline-none">
        {options.map((o) => (
          <label key={o.value}>
            <input type="radio" name={id} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </fieldset>
  );
}

/** Checkbox chips for a few optional picks. */
export function ChipChecks({ legend, name, values, options, onChange, hint, labels }: {
  legend: string; name: string; values: string[]; options: readonly string[]; onChange: (v: string[]) => void; hint?: string; labels?: Record<string, string>;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">{legend}</legend>
      {hint ? <p className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <div className="ck-seg">
        {options.map((o) => (
          <label key={o}>
            <input type="checkbox" name={name} value={o} checked={values.includes(o)}
              onChange={(e) => onChange(e.target.checked ? [...values, o] : values.filter((x) => x !== o))} />
            <span>{labels?.[o] ?? o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Select with separate value and label. */
export function ValueSelect({ id, label, value, onChange, options, placeholder, hint, error, optional, autoComplete, className }: {
  id: string; label: string; value: string; onChange: (v: string) => void; options: ReadonlyArray<{ value: string; label: string }>;
  placeholder: string; hint?: string; error?: string; optional?: boolean; autoComplete?: string; className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>{label}</Label>
      {hint ? <p id={`${id}-hint`} className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete}
        aria-invalid={error ? true : undefined} aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined}
        className={cx(control(!!error), "h-9 py-1")}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

export function Note({ children, tone = "ochre" }: { children: ReactNode; tone?: "ochre" | "sand" }) {
  return <div role="note" className={cx("rounded-[var(--radius-input)] p-3 text-[.8125rem]", tone === "ochre" ? "bg-ochre-tint" : "bg-sand")}>{children}</div>;
}
