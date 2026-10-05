"use client";
import { useRef } from "react";
import "./filters.css";

export type TabItem = { key: string; label: string; count?: number };
/** Ids that link a tab to its panel. Put these on your panel: id and aria-labelledby. */
export const tabId = (prefix: string, key: string) => `${prefix}-tab-${key}`;
export const panelId = (prefix: string, key: string) => `${prefix}-panel-${key}`;

/**
 * A real tab bar: role tablist, arrow keys, Home and End, one tab stop. The tabs wrap onto lines, so none is ever cut off at the screen edge.
 * Each tab shows how many items it holds. The consumer renders the tabpanel with the ids above.
 */
export function Tabs({ label, prefix, tabs, value, onChange }: { label: string; prefix: string; tabs: TabItem[]; value: string; onChange: (key: string) => void }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = tabs.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    onChange(tabs[to].key);
    refs.current[tabs[to].key]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="mf-tabs">
      {tabs.map((t, i) => (
        <button key={t.key} ref={(el) => { refs.current[t.key] = el; }} type="button" role="tab" id={tabId(prefix, t.key)} className="mf-chip"
          aria-selected={t.key === value} aria-controls={panelId(prefix, t.key)} tabIndex={t.key === value ? 0 : -1} onClick={() => onChange(t.key)} onKeyDown={(e) => onKey(e, i)}>
          {t.label}{t.count != null ? <span className="mf-n">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
