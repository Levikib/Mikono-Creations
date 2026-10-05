/* eslint-disable @next/next/no-img-element -- static variant URLs are resolved on the server, so the nav carries no image runtime */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MenuLink, MenuPanel } from "@/lib/menu";
import { PHONE_DISPLAY, PHONE_TEL, site } from "@/lib/site";
import { Icon } from "./Icon";

/**
 * Full screen menu sheet on a native dialog: focus trap, Escape and focus return come from the browser.
 * The same content map as the desktop panels, as an accordion. Section content is only rendered while its row is open.
 * Sticky WhatsApp and call footer, safe area padding on every edge.
 */
export function MobileSheet({ panels, whatsappHref, open: openProp, onClose }: { panels: MenuPanel[]; whatsappHref: string; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [startPath] = useState(pathname);
  const [exp, setExp] = useState<string | null>(null);
  // A navigation closes the sheet: it is only open for the route it was opened on.
  const open = openProp && startPath === pathname;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Widening the header past the collapse point (the burger disappears) closes the sheet.
  useEffect(() => {
    const check = () => {
      const burger = document.querySelector<HTMLElement>(".nav-burger");
      if (burger && getComputedStyle(burger).display === "none") onClose();
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [onClose]);

  const external = whatsappHref.startsWith("http");

  const row = (l: MenuLink) => {
    const inner = (
      <>
        {l.thumb ? <span className="nav-thumb"><img src={l.thumb.src} srcSet={l.thumb.srcSet} sizes="56px" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /></span> : l.icon ? <Icon name={l.icon} size={22} duo className="mnav-ico" /> : null}
        <span className="mnav-row-text"><b>{l.label}</b>{l.caption ? <small>{l.caption}</small> : null}</span>
        <Icon name="arrow" size={18} />
      </>
    );
    if (l.external) return <a href={l.href} target="_blank" rel="noopener noreferrer" onClick={onClose} className="mnav-row">{inner}</a>;
    if (l.href.startsWith("tel:")) return <a href={l.href} onClick={onClose} className="mnav-row">{inner}</a>;
    return <Link href={l.href} onClick={onClose} className="mnav-row">{inner}</Link>;
  };

  return (
    <dialog ref={ref} aria-label="Menu" onClose={onClose} className="mnav" onKeyDown={(e) => {
      // Keep Tab inside the sheet: from the last control it wraps to the first, and Shift+Tab the other way.
      if (e.key !== "Tab") return;
      const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }}>
      <div className="mnav-body">
        <div className="mnav-head">
          <span className="mnav-title"><span className="nav-mark"><img src="/logo-mark.png" alt="" width={44} height={46} /></span>{site.name}</span>
          <button type="button" aria-label="Close menu" onClick={onClose} className="mnav-close iconbtn"><Icon name="close" size={20} /></button>
        </div>
        <nav aria-label="Mobile" className="mnav-scroll">
          <ul>
            {panels.map((p) => {
              const isOpen = exp === p.id;
              if (p.plain) return (
                <li key={p.id}>
                  <Link href={p.href} onClick={onClose} className="mnav-top" aria-current={pathname === "/" ? "page" : undefined}><span>{p.label}</span></Link>
                </li>
              );
              return (
                <li key={p.id}>
                  <button type="button" id={`mnav-btn-${p.id}`} aria-expanded={isOpen} aria-controls={`mnav-${p.id}`} className="mnav-top"
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      setExp(isOpen ? null : p.id);
                      // Keep the row under the finger: the previous section collapses above it.
                      if (!isOpen) requestAnimationFrame(() => btn.scrollIntoView({ block: "start", behavior: "instant" }));
                    }}>
                    <span>{p.label}</span>
                    <Icon name="chevron" size={18} className="mnav-chev" />
                  </button>
                  <div id={`mnav-${p.id}`} role="region" aria-labelledby={`mnav-btn-${p.id}`} hidden={!isOpen} className="mnav-section">
                    {isOpen ? (
                      <>
                        <Link href={p.href} onClick={onClose} className="mnav-overview"><span>{p.overview}</span><Icon name="arrow" size={18} /></Link>
                        {p.groups.map((g, i) => (
                          <div key={g.title ?? i}>
                            {g.title ? <p className="mnav-group">{g.title}</p> : null}
                            <ul>{g.links.map((l) => <li key={l.label}>{row(l)}</li>)}</ul>
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mnav-foot">
          <a href={whatsappHref} className="mnav-cta btn-primary" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <Icon name="whatsapp" size={18} /><span>Chat on WhatsApp</span>
          </a>
          <a href={PHONE_TEL} className="mnav-call btn-secondary" aria-label={`Call ${PHONE_DISPLAY}`}>
            <Icon name="phone" size={18} /><span>Call</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
