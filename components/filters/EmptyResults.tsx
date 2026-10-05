"use client";
import type { ReactNode } from "react";
import type { ActiveItem } from "./ActiveFilters";
import "./filters.css";

/** Nothing matches: say plainly why, then offer one tap fixes ("Remove Colour: Blue", "Show everything"). */
export function EmptyResults({ title, text, items, onClear, clearLabel = "Show everything", extra }: {
  title: string; text: string; items: ActiveItem[]; onClear: () => void; clearLabel?: string; extra?: ReactNode;
}) {
  return (
    <div className="mf-empty">
      <h2>{title}</h2>
      <p>{text}</p>
      {items.length ? (
        <ul className="mf-chips">
          {items.map((a) => <li key={a.key}><button type="button" className="mf-chip mf-chip--x" onClick={a.onRemove}>Remove {a.label}</button></li>)}
        </ul>
      ) : null}
      <button type="button" className="mf-btn btn-primary" onClick={onClear}>{clearLabel}</button>
      {extra}
    </div>
  );
}
