"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "../Icon";
import { ErrorText, TextField } from "../Form";
import { OTHER_ID, OTHER_TEXT_MAX, type Opt } from "@/data/studio/option";

/** Large visual choice card: a label around a hidden radio or checkbox. Selected state also shows a tick and an outline. */
export function OptionCard({ name, value, checked, onChange, type = "radio", children, className, ariaLabel, disabled }: {
  name: string; value: string; checked: boolean; onChange: () => void; type?: "radio" | "checkbox"; children: ReactNode; className?: string; ariaLabel?: string; disabled?: boolean;
}) {
  return (
    <label className={cx("st-opt", className)}>
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} aria-label={ariaLabel} disabled={disabled} />
      {children}
      <span className="st-tick" aria-hidden="true"><Icon name="check" size={16} /></span>
    </label>
  );
}

/** Small toggle chip. Pass allowClear to let a second tap on the chosen chip unselect it. */
export function Pill({ name, value, checked, onChange, type = "radio", children, className }: {
  name: string; value: string; checked: boolean; onChange: (checked: boolean) => void; type?: "radio" | "checkbox"; children: ReactNode; className?: string;
}) {
  return (
    <label className={cx("st-pill", className)}>
      <input type={type} name={name} value={value} checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onClick={type === "radio" && checked ? () => onChange(false) : undefined} />
      {children}
    </label>
  );
}

export function Group({ id, legend, hint, error, children, className, optional, tbc }: {
  id: string; legend: string; hint?: string; error?: string; children: ReactNode; className?: string; optional?: boolean; tbc?: boolean;
}) {
  return (
    <fieldset className={cx("min-w-0", className)} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="mb-1 text-[.9375rem] font-semibold">
        {legend}{optional ? <span className="font-normal st-soft"> (optional)</span> : null}{tbc ? <> <TbcBadge /></> : null}
      </legend>
      {hint ? <p id={`${id}-hint`} className="mb-2 text-base st-soft">{hint}</p> : null}
      <div id={id} tabIndex={-1} className="focus:outline-none">{children}</div>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </fieldset>
  );
}

export const TbcBadge = () => <span className="st-tbc">To be confirmed</span>;

/** A tiny line of helper copy with an icon. */
export function Note({ children, icon = "info", className }: { children: ReactNode; icon?: "info" | "sparkle" | "heart"; className?: string }) {
  return (
    <p className={cx("flex items-start gap-2 rounded-[var(--st-r-photo,18px)] bg-[var(--st-ochre-tint)] px-3 py-2.5 text-base text-[var(--st-ink)]", className)}>
      <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-[var(--st-action)]" />
      <span>{children}</span>
    </p>
  );
}

/** Chips from an option list. Multi: any number can be on. Single: one, and a second tap clears it. */
export function Chips({ name, list, value, multi, onToggle, className }: {
  name: string; list: readonly Opt[]; value: readonly string[]; multi?: boolean; onToggle: (id: string, on: boolean) => void; className?: string;
}) {
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={name} className={cx("flex flex-wrap gap-1.5", className)}>
      {list.map((o) => (
        <Pill key={o.id} type={multi ? "checkbox" : "radio"} name={name} value={o.id} checked={value.includes(o.id)} onChange={(on) => onToggle(o.id, on)}>
          {o.label}{o.pending ? <span className="sr-only">, to be confirmed</span> : null}
        </Pill>
      ))}
    </div>
  );
}

/** Cards from an option list, with an icon, a label and a short description. */
export function OptCards({ name, list, value, multi, onToggle, cols = "grid-cols-2 sm:grid-cols-3", className }: {
  name: string; list: readonly Opt[]; value: readonly string[]; multi?: boolean; onToggle: (id: string, on: boolean) => void; cols?: string; className?: string;
}) {
  return (
    <div className={cx("grid gap-2", cols, className)}>
      {list.map((o) => (
        <OptionCard key={o.id} name={name} value={o.id} type={multi ? "checkbox" : "radio"} checked={value.includes(o.id)}
          onChange={() => onToggle(o.id, !value.includes(o.id))} className="min-h-[76px] items-start p-2.5">
          <span className="flex w-full flex-col items-start gap-1 pr-5">
            {o.icon ? <span className="st-ico"><Icon name={o.icon} size={20} duo /></span> : null}
            <span className="text-[.8125rem] font-semibold leading-tight">{o.label}{o.pending ? <span className="sr-only">, to be confirmed</span> : null}</span>
            <span className="text-[.75rem] leading-snug st-soft">{o.help}</span>
          </span>
        </OptionCard>
      ))}
    </div>
  );
}

/** Progressive disclosure: a native details block. Open by default when asked or when something inside is chosen. */
export function More({ title, count, open, children, className }: { title: string; count?: number; open?: boolean; children: ReactNode; className?: string }) {
  return (
    <details open={open} className={cx("st-more rounded-[var(--st-r-card)] bg-[var(--st-paper)] shadow-[var(--st-sh)]", className)}>
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 px-3 text-[.8125rem] font-semibold">
        <span>{title}{count ? <span className="ml-1.5 rounded-full bg-[var(--st-ink)] px-1.5 py-0.5 text-[.6875rem] text-[var(--st-paper)]">{count}</span> : null}</span>
        <Icon name="chevron" size={16} className="st-more-chev shrink-0" />
      </summary>
      <div className="grid gap-2.5 px-3 pb-3">{children}</div>
    </details>
  );
}

/** The free text that opens when an "Other, tell us" choice is on. A real label, never a placeholder. */
export function OtherText({ id, label, value, onChange, error, hint, optional = true, className }: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; optional?: boolean; className?: string;
}) {
  return <TextField id={id} className={cx("st-rise", className)} label={label} optional={optional} value={value} maxLength={OTHER_TEXT_MAX} autoComplete="off" enterKeyHint="next" onChange={onChange} error={error} hint={hint} />;
}
export const hasOther = (ids: readonly string[]) => ids.includes(OTHER_ID);
