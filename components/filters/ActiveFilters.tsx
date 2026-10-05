"use client";
import { Cross } from "./glyphs";
import "./filters.css";

export type ActiveItem = { key: string; label: string; onRemove: () => void };

/** Every active filter as a removable chip ("Colour: Yellow x"). "Clear all" only appears when something is active. Renders nothing otherwise. sidebar: the page has a desktop sidebar that already carries Clear all, so it is hidden here from 1024px. */
export function ActiveFilters({ items, onClear, sidebar, className }: { items: ActiveItem[]; onClear: () => void; sidebar?: boolean; className?: string }) {
  if (!items.length) return null;
  return (
    <ul aria-label="Filters you chose" className={`mf-active${className ? ` ${className}` : ""}`}>
      {items.map((it) => (
        <li key={it.key}>
          <button type="button" className="mf-chip mf-chip--x" aria-label={`Remove ${it.label}`} onClick={it.onRemove}>
            {it.label}<Cross size={14} />
          </button>
        </li>
      ))}
      <li className={sidebar ? "mf-clear-m" : undefined}><button type="button" className="mf-text-btn" onClick={onClear}>Clear all</button></li>
    </ul>
  );
}
