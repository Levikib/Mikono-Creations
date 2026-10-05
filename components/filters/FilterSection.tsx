"use client";
import { useId, useState, type ReactNode } from "react";
import { Chev } from "./glyphs";
import "./filters.css";

/**
 * A collapsible filter group. The group title is the button (aria-expanded, aria-controls) with a clear chevron.
 * While closed it says the current choice in words ("Safari animals, Domestic"), so nothing is hidden. A badge shows how many are chosen.
 */
export function FilterSection({ title, summary, chosen, defaultOpen = false, children }: { title: string; summary: string; chosen: number; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="mf-sec">
      <h3 className="mf-sec-h">
        <button type="button" className="mf-sec-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span className="mf-sec-t">{title}</span>
          <span className="mf-sec-s">{open ? "" : summary}</span>
          {chosen ? <span className="mf-badge" aria-label={`${chosen} chosen`}>{chosen}</span> : null}
          <Chev />
        </button>
      </h3>
      <div id={id} hidden={!open} className="mf-sec-body">{children}</div>
    </section>
  );
}
