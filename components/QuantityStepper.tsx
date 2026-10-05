"use client";
import { useId, useState } from "react";

/** Pill stepper, 40px tall with 32px buttons and 44px hit areas (R11). Value is clamped on blur and on every button press. */
export function QuantityStepper({ value, onChange, min = 1, max = 20, label = "Quantity" }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? Math.floor(n) : min));
  const commit = (raw: string) => {
    onChange(clamp(parseInt(raw, 10)));
    setDraft(null);
  };
  const btn = "hit-area inline-flex size-8 items-center justify-center rounded-full bg-oat text-[.9375rem] font-semibold text-baobab shadow-clay-sm transition-transform duration-150 ease-[var(--ease-squish)] active:scale-[.94] disabled:opacity-55";
  return (
    <div role="group" aria-labelledby={id} className="inline-flex flex-col gap-1">
      <span id={id} className="text-[.8125rem] font-semibold text-baobab">{label}</span>
      <div className="clay-well inline-flex h-10 items-center gap-2 rounded-full p-1">
        <button type="button" aria-label="One fewer" disabled={value <= min} onClick={() => onChange(clamp(value - 1))} className={btn}>
          <span aria-hidden="true">&minus;</span>
        </button>
        <input
          inputMode="numeric" pattern="[0-9]*" aria-labelledby={id}
          value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 2))}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit((e.target as HTMLInputElement).value); } }}
          className="h-8 w-9 bg-transparent text-center text-[1rem] md:text-sm font-semibold tabular-nums text-charcoal"
        />
        <button type="button" aria-label="One more" disabled={value >= max} onClick={() => onChange(clamp(value + 1))} className={btn}>
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">{`${label} ${value}`}</span>
    </div>
  );
}
