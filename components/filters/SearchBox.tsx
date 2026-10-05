"use client";
import { useId } from "react";
import { Cross } from "./glyphs";
import "./filters.css";

/** Instant client side search. The label is read aloud and shown as the placeholder. 16px text so phones do not zoom in. */
export function SearchBox({ label, value, onChange, className }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  const id = useId();
  return (
    <div role="search" className={`mf-search${className ? ` ${className}` : ""}`}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
      <input id={id} type="search" value={value} placeholder={label} autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="search" onChange={(e) => onChange(e.target.value)} />
      {value ? <button type="button" className="mf-x" aria-label="Clear search" onClick={() => onChange("")}><Cross /></button> : null}
    </div>
  );
}
