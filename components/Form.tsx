import type { ReactNode } from "react";
import { Tick } from "./Tick";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";

/** Inputs sit in an inset clay well: 36px tall (R11), 12px radius, a 2px ochre ring plus an action outline on focus. Phones keep 16px text so iOS does not zoom. */
export const control = (invalid: boolean) => cx(
  "block w-full rounded-[var(--radius-input)] border-[1.5px] bg-paper px-3 text-[1rem] text-charcoal shadow-[inset_0_1.5px_3px_rgb(110_75_50/.12)] md:text-sm",
  "focus:border-terracotta-deep focus:outline-none focus:ring-2 focus:ring-ochre",
  invalid ? "border-brick" : "border-line",
);

/** Moves the error summary into view and puts focus on it. Call it after the errors have rendered. */
export function focusSummary(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ block: "start", behavior: "instant" });
  el.focus({ preventScroll: true });
}

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex min-h-9 items-end pb-1 text-[.8125rem] font-semibold text-baobab">
      {children}{optional ? <span className="font-normal text-stone"> (optional)</span> : null}
    </label>
  );
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-[.8125rem] font-bold text-brick">
      <Icon name="info" size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

const describe = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

interface Base { id: string; label: string; hint?: string; error?: string; optional?: boolean; className?: string }

export function TextField({ id, label, hint, error, optional, className, value, onChange, type = "text", autoComplete, inputMode, maxLength, min, max, placeholder, autoCapitalize, counter, enterKeyHint = "next" }: Base & {
  value: string; onChange: (v: string) => void; type?: string; autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "url"; maxLength?: number; min?: string; max?: string; placeholder?: string;
  autoCapitalize?: "off" | "words" | "sentences" | "characters"; counter?: boolean; enterKeyHint?: "next" | "done" | "send" | "go";
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>{label}</Label>
      {hint ? <p id={`${id}-hint`} className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <input id={id} name={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} inputMode={inputMode} enterKeyHint={enterKeyHint} maxLength={maxLength} min={min} max={max}
        placeholder={placeholder} autoCapitalize={autoCapitalize}
        aria-invalid={error ? true : undefined} aria-describedby={describe(id, hint, error)}
        className={cx(control(!!error), "h-9 py-1")} />
      {counter && maxLength ? <p className="mt-1 text-[.8125rem] text-stone">{maxLength - value.length} characters left</p> : null}
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

export function TextareaField({ id, label, hint, error, optional, className, value, onChange, maxLength, rows = 4, counter }: Base & {
  value: string; onChange: (v: string) => void; maxLength?: number; rows?: number; counter?: boolean;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>{label}</Label>
      {hint ? <p id={`${id}-hint`} className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <textarea id={id} name={id} value={value} rows={rows} maxLength={maxLength} onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined} aria-describedby={describe(id, hint, error)}
        className={cx(control(!!error), "min-h-[72px] py-2 leading-normal")} />
      {counter && maxLength ? <p className="mt-1 text-[.8125rem] text-stone">{maxLength - value.length} characters left</p> : null}
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

export function SelectField({ id, label, hint, error, optional, className, value, onChange, options, placeholder, autoComplete }: Base & {
  value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string; autoComplete?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>{label}</Label>
      {hint ? <p id={`${id}-hint`} className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete}
        aria-invalid={error ? true : undefined} aria-describedby={describe(id, hint, error)}
        className={cx(control(!!error), "h-9 py-1")}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

export interface RadioOption { value: string; label: string; help?: string }

/** Radio rows with 24px marks in rows of at least 56px. */
export function RadioGroup({ id, legend, hint, error, value, onChange, options, className }: {
  id: string; legend: string; hint?: string; error?: string; value: string; onChange: (v: string) => void;
  options: RadioOption[]; className?: string;
}) {
  return (
    <fieldset className={className} aria-describedby={describe(id, hint, error)} aria-invalid={error ? true : undefined}>
      <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">{legend}</legend>
      {hint ? <p id={`${id}-hint`} className="mb-1 text-[.8125rem] text-stone">{hint}</p> : null}
      <div id={id} tabIndex={-1} className="grid gap-1.5 focus:outline-none">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <label key={o.value} className={cx(
              "flex min-h-11 cursor-pointer items-start gap-2 rounded-[var(--radius-input)] border-[1.5px] px-2.5 py-1.5",
              on ? "border-terracotta-deep bg-terracotta-tint" : error ? "border-brick bg-paper" : "border-line bg-paper",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta",
            )}>
              <Tick type="radio" name={id} value={o.value} checked={on} onChange={() => onChange(o.value)} />
              <span>
                <span className="block text-sm font-semibold text-charcoal">{o.label}</span>
                {o.help ? <span className="block text-[.8125rem] text-stone">{o.help}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </fieldset>
  );
}

export function CheckboxField({ id, label, hint, checked, onChange, className, error, disabled }: {
  id: string; label: ReactNode; hint?: string; checked: boolean; onChange: (v: boolean) => void; className?: string; error?: string; disabled?: boolean;
}) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className={cx(
        "flex min-h-11 cursor-pointer items-start gap-2 rounded-[var(--radius-input)] border-[1.5px] bg-paper px-2.5 py-1.5",
        error ? "border-brick" : "border-line",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta",
      )}>
        <Tick id={id} name={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
        <span>
          <span className="block text-sm text-charcoal">{label}</span>
          {hint ? <span id={`${id}-hint`} className="block text-[.8125rem] text-stone">{hint}</span> : null}
        </span>
      </label>
      {error ? <ErrorText id={`${id}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

/** Polite summary for screen readers plus links that move focus to each field. */
export function ErrorSummary({ errors, headingRef }: { errors: Array<{ id: string; message: string }>; headingRef?: React.Ref<HTMLHeadingElement> }) {
  if (errors.length === 0) return <div aria-live="assertive" role="alert" className="sr-only" />;
  return (
    <div role="alert" aria-live="assertive" className="mb-3 rounded-[var(--radius-card)] border-2 border-brick bg-paper p-3">
      <h2 ref={headingRef} tabIndex={-1} className="scroll-mt-24 text-base">Please check {errors.length === 1 ? "one thing" : `${errors.length} things`}</h2>
      <ul className="mt-1 grid gap-0">
        {errors.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-brick underline underline-offset-4"
              onClick={(ev) => {
                ev.preventDefault();
                const el = document.getElementById(e.id);
                if (el) { el.scrollIntoView({ block: "center" }); (el.matches("input,select,textarea") ? el : el.querySelector<HTMLElement>("input"))?.focus(); }
              }}>
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
