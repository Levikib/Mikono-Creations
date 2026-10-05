"use client";
import { Tick } from "../Tick";
import type { Opt } from "./ChipGroup";
import "./filters.css";

/** The same group as big tap rows with a checkbox, for lists inside the filter sheet and sidebar. 44px rows, count on the right. */
export function RowGroup({ legend, hideLegend, options, value, onToggle }: { legend: string; hideLegend?: boolean; options: Opt[]; value: string[]; onToggle: (v: string) => void }) {
  return (
    <fieldset className="mf-group">
      <legend className={hideLegend ? "sr-only" : "mf-legend"}>{legend}</legend>
      <div className="mf-rows">
        {options.map((o) => {
          const off = o.count === 0 && !value.includes(o.value);
          return (
            <label key={o.value} className={`mf-row${off ? " is-zero" : ""}`}>
              <Tick type="checkbox" checked={value.includes(o.value)} disabled={off} onChange={() => onToggle(o.value)} />
              <span>{o.label}</span>
              {o.count != null ? <span className="mf-n">{o.count}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
