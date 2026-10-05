"use client";
import { useEffect, useId, useState } from "react";
import { Chev } from "./glyphs";
import "./filters.css";

export type SubItem = { id: string; label: string };

/**
 * In-page navigation ("On this page"). The section you are reading is highlighted (aria-current="location").
 * On phones and tablets it is one closed button that names itself and the section you are in; on desktop it is a plain sticky list.
 * only="m" renders the phone version alone, only="d" the desktop list alone, so a page can place each where it fits.
 */
export function SubNav({ items, title = "On this page", only, className }: { items: SubItem[]; title?: string; only?: "m" | "d"; className?: string }) {
  const [cur, setCur] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const uid = useId();
  const paneId = `${uid}-pane`;

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Set<string>();
    // A section counts as current while its top is in the upper part of the screen.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id); }
      const first = els.find((el) => seen.has(el.id));
      if (first) setCur(first.id);
    }, { rootMargin: "-90px 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const here = items.find((i) => i.id === cur)?.label ?? "";
  return (
    <nav aria-label={title} className={`mf-sub${only ? ` mf-sub--${only}` : ""}${className ? ` ${className}` : ""}`}>
      <p className="mf-label mf-sub-t">{title}</p>
      <button type="button" className="mf-sub-btn" aria-expanded={open} aria-controls={paneId} onClick={() => setOpen(!open)}>
        <span>{title}</span><small>{open ? "" : here}</small><Chev />
      </button>
      <div id={paneId} className="mf-sub-pane" data-open={open}>
        <ol className="mf-sub-list">
          {items.map((i) => (
            <li key={i.id}><a href={`#${i.id}`} aria-current={i.id === cur ? "location" : undefined} onClick={() => { setCur(i.id); setOpen(false); }}>{i.label}</a></li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
