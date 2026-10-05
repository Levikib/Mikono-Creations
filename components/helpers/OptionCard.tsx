import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";

/**
 * One choice. A real radio input sits inside the label, hidden but focusable, so arrow keys, screen readers and
 * form semantics all work. Selection is drawn by the label (see helpers.css).
 */
export function OptionCard({ name, value, label, hint, checked, onChange, media, labelClassName, multi }: {
  multi?: boolean; name: string; value: string; label: string; hint?: string; checked: boolean; onChange: (value: string) => void;
  media?: ReactNode; labelClassName?: string;
}) {
  return (
    <label className={`mkh-option ${labelClassName ?? ""}`}>
      <input type={multi ? "checkbox" : "radio"} name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {media}
      <span className="min-w-0 flex-1">
        <span className="block text-[1rem] font-semibold leading-tight">{label}</span>
        {hint ? <span className="mkh-muted mt-0.5 block text-[.9375rem] leading-snug">{hint}</span> : null}
      </span>
      <span className="mkh-tick" aria-hidden="true"><Icon name="check" size={14} /></span>
    </label>
  );
}
