"use client";
import type { ReactNode } from "react";
import { Chev, Sliders } from "./glyphs";
import "./filters.css";

export type SortOpt = { value: string; label: string };

/** Sort: a visible "Sort: A to Z" label with the real native select laid over it (44px touch area, native picker on every phone). */
export function SortSelect({ value, options, onChange }: { value: string; options: SortOpt[]; onChange: (v: string) => void }) {
  const cur = options.find((o) => o.value === value) ?? options[0];
  return (
    <span className="mf-sort">
      <span className="mf-sortv" aria-hidden="true">Sort: <b>{cur.label}</b><Chev size={16} /></span>
      <select aria-label="Sort" value={cur.value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </span>
  );
}

/**
 * The slim bar above a list. Row one: the search box and, on phones and tablets, a big Filters button with a badge for how many are on.
 * Row two: the result count and Sort. It sticks under the header on phones and tablets. On desktop the groups live in the sidebar, so there is no Filters button.
 */
export function FilterBar({ search, count, sort, activeCount, onOpen }: { search: ReactNode; count: ReactNode; sort?: ReactNode; activeCount?: number; onOpen?: () => void }) {
  return (
    <div className="mf-bar mf-sticky">
      <div className="mf-bar-row">
        {search}
        {onOpen ? (
          <button type="button" className="mf-btn mf-filter-btn mf-only-m btn-primary" aria-haspopup="dialog" onClick={onOpen}>
            <Sliders />Filters
            {activeCount ? <span className="mf-badge" aria-label={`${activeCount} on`}>{activeCount}</span> : null}
          </button>
        ) : null}
      </div>
      <div className="mf-bar-row mf-bar-row2">{count}{sort}</div>
    </div>
  );
}
