"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Cross } from "./glyphs";
import "./filters.css";

/**
 * Bottom sheet on a native dialog: the browser traps focus, closes on Escape and gives focus back to the button that opened it.
 * Full width and reachable by thumb, with a grabber, a close button, a Clear all text button (only when something is chosen),
 * and one big button that always says how many results you will see. The page behind does not scroll while it is open.
 * The body is only built while open, so the same groups can also live in the desktop sidebar without duplicate ids.
 */
export function FilterSheet({ open, onClose, title = "Filters", canClear, onClear, doneLabel, children }: {
  open: boolean; onClose: () => void; title?: string; canClear: boolean; onClear: () => void; doneLabel: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  // Keep Tab inside the sheet: from the last control it wraps to the first, and Shift+Tab the other way.
  const trap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select, a[href]") ?? []).filter((n) => n.offsetParent !== null || n.tagName === "INPUT");
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  return (
    <dialog ref={ref} aria-label={title} className="mf-sheet" onClose={onClose} onKeyDown={trap} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="mf-grab" aria-hidden="true" />
      <div className="mf-sheet-head">
        <h2>{title}</h2>
        {canClear ? <button type="button" className="mf-text-btn" onClick={onClear}>Clear all</button> : null}
        <button type="button" className="mf-close" aria-label="Close filters" onClick={onClose}><Cross size={22} /></button>
      </div>
      <div className="mf-sheet-body">{open ? children : null}</div>
      <div className="mf-sheet-foot">
        <button type="button" className="mf-btn btn-primary" onClick={onClose}>{doneLabel}</button>
      </div>
    </dialog>
  );
}
