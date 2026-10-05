"use client";
import { useId, useState } from "react";
import "./filters.css";

export type Opt = { value: string; label: string; count?: number };

/**
 * One filter group of chips. A fieldset with a legend, so a screen reader names the group.
 * Chips are buttons that wrap onto lines (never a sideways scroll), aria-pressed, with a tick mark when on so state is never colour only.
 * Every option shows its count. An option with no matches and not chosen is disabled.
 * limit: a long list shows the first few and a "Show all 27" button.
 */
export function ChipGroup({ legend, hideLegend, options, value, onToggle, limit, className }: {
  legend: string; hideLegend?: boolean; options: Opt[]; value: string[]; onToggle: (v: string) => void; limit?: number; className?: string;
}) {
  const [all, setAll] = useState(false);
  const id = useId();
  const long = limit != null && options.length > limit + 2;
  const shown = long && !all ? options.filter((o, i) => i < limit || value.includes(o.value)) : options;
  return (
    <fieldset className={`mf-group${className ? ` ${className}` : ""}`}>
      <legend className={hideLegend ? "sr-only" : "mf-legend"}>{legend}</legend>
      <div id={id} className="mf-chips">
        {shown.map((o) => (
          <button key={o.value} type="button" className="mf-chip" aria-pressed={value.includes(o.value)} disabled={o.count === 0 && !value.includes(o.value)} onClick={() => onToggle(o.value)}>
            {o.label}{o.count != null ? <span className="mf-n">{o.count}</span> : null}
          </button>
        ))}
      </div>
      {long ? <button type="button" className="mf-text-btn" aria-expanded={all} aria-controls={id} onClick={() => setAll(!all)}>{all ? "Show fewer" : `Show all ${options.length}`}</button> : null}
    </fieldset>
  );
}
