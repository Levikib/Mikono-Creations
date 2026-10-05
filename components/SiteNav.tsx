/* eslint-disable @next/next/no-img-element -- static variant URLs are resolved on the server, so the nav carries no image runtime */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { MenuLink, MenuPanel } from "@/lib/menu";
import { site } from "@/lib/site";
import { CartButton } from "./CartButton";
import { Icon } from "./Icon";
import { MobileMenu } from "./MobileMenu";

const HOVER_OPEN_MS = 120;
const HOVER_CLOSE_MS = 220;

function NavLink({ link, onNavigate }: { link: MenuLink; onNavigate: () => void }) {
  const inner = (
    <>
      {link.thumb ? <span className="nav-thumb"><img src={link.thumb.src} srcSet={link.thumb.srcSet} sizes="56px" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /></span> : link.icon ? <Icon name={link.icon} size={24} duo className="nav-ico" /> : <span className="nav-ico" />}
      <span className="nav-row-text">
        <b>{link.label}</b>
        {link.caption ? <small>{link.caption}</small> : null}
      </span>
      <Icon name="arrow" size={18} className="nav-arrow" />
    </>
  );
  if (link.external) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className="nav-row">{inner}</a>;
  }
  if (link.href.startsWith("tel:")) return <a href={link.href} onClick={onNavigate} className="nav-row">{inner}</a>;
  return <Link href={link.href} onClick={onNavigate} className="nav-row">{inner}</Link>;
}

function Panel({ panel, open, onNavigate }: { panel: MenuPanel; open: boolean; onNavigate: () => void }) {
  // The panel body is only rendered while it is open, so closed menus add no DOM and no hydration work.
  return (
    <div id={`mega-${panel.id}`} className="nav-panel" data-open={open ? "true" : "false"}>
      {open ? <div className="nav-panel-grid" data-panel={panel.id}>
        <div className="nav-photo">
          
          <img src={panel.photo.src} srcSet={panel.photo.srcSet} sizes="320px" alt={panel.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: `${panel.photo.focal[0] * 100}% ${panel.photo.focal[1] * 100}%` }} />
          <span className="nav-chip">{panel.chip}</span>
        </div>
        <div className="nav-mid">
          <p className="eyebrow">{panel.label}</p>
          <p className="nav-heading">{panel.heading}</p>
          <p className="nav-blurb">{panel.blurb}</p>
          <Link href={panel.href} onClick={onNavigate} className="nav-overview">
            <span>{panel.overview}</span>
            <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="nav-lists">
          {panel.groups.map((g, i) => (
            <div key={g.title ?? i} className="nav-group">
              {g.title ? <p className="nav-group-title">{g.title}</p> : null}
              <ul>{g.links.map((l) => <li key={l.label}><NavLink link={l} onNavigate={onNavigate} /></li>)}</ul>
            </div>
          ))}
        </div>
      </div> : null}
    </div>
  );
}

export function SiteNav({ panels, whatsappHref }: { panels: MenuPanel[]; whatsappHref: string }) {
  const pathname = usePathname();
  // The open panel is stored with the route it was opened on, so a navigation closes it without an effect.
  const [openState, setOpenState] = useState<{ id: string | null; path: string }>({ id: null, path: "" });
  const open = openState.path === pathname ? openState.id : null;
  const [scrolled, setScrolled] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pinned = useRef(false);
  const openRef = useRef<string | null>(null);

  const set = (id: string | null) => { openRef.current = id; setOpenState({ id, path: pathname }); };
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = undefined; };
  const close = () => { clear(); pinned.current = false; set(null); };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (zone.current && !zone.current.contains(e.target as Node)) close(); };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const id = openRef.current;
      const inside = zone.current?.contains(document.activeElement);
      close();
      if (inside && id) document.getElementById(`nav-btn-${id}`)?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
    // close only touches refs and the state setter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isMouse = (e: React.PointerEvent) => e.pointerType === "mouse" || e.pointerType === "pen";
  const enter = (id: string) => (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    clear();
    if (openRef.current === id) return;
    if (openRef.current) { pinned.current = false; set(id); return; }
    timer.current = setTimeout(() => { pinned.current = false; set(id); }, HOVER_OPEN_MS);
  };
  const leave = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    clear();
    if (pinned.current) return;
    timer.current = setTimeout(() => set(null), HOVER_CLOSE_MS);
  };

  const buttons = () => Array.from(zone.current?.querySelectorAll<HTMLButtonElement>(".nav-top") ?? []);
  const onTopKey = (id: string) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const list = buttons();
    const i = list.findIndex((b) => b.id === `nav-btn-${id}`);
    const go = (n: number) => {
      const b = list[(n + list.length) % list.length];
      b.focus();
      if (openRef.current) set(b.id.replace("nav-btn-", ""));
    };
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(list.length - 1); }
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      clear(); pinned.current = true; set(id);
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`#mega-${id} a`)?.focus());
    }
  };
  const onPanelKey = (id: string) => (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(document.querySelectorAll<HTMLElement>(`#mega-${id} a`));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === "ArrowUp" && i === 0) { document.getElementById(`nav-btn-${id}`)?.focus(); return; }
    links[(i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus();
  };
  const onClickTop = (id: string) => {
    clear();
    if (openRef.current === id) {
      if (pinned.current) close(); else pinned.current = true;
      return;
    }
    pinned.current = true;
    set(id);
  };

  const current = (p: MenuPanel) => p.match.length > 0 && p.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <div ref={zone} className="nav-zone" data-scrolled={scrolled ? "true" : "false"} data-open={open ? "true" : "false"}>
      <div className="nav-pill glass">
        <Link href="/" prefetch={false} aria-label={`${site.name} home`} className="nav-logo">
          <span className="nav-mark"><img src="/logo-mark.png" alt="" width={44} height={46} /></span>
          <span className="nav-word" aria-hidden="true">Mikono<span className="nav-word-rest"> Creations</span></span>
        </Link>

        <nav aria-label="Main" className="nav-main">
          <ul>
            {panels.map((p) => p.plain ? (
              <li key={p.id}>
                <Link id={`nav-btn-${p.id}`} href={p.href} prefetch={false} className="nav-top" aria-current={pathname === "/" ? "page" : undefined}>
                  <span>{p.label}</span>
                </Link>
              </li>
            ) : (
              <li key={p.id} onPointerEnter={enter(p.id)} onPointerLeave={leave}
                onBlur={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (openRef.current === p.id && next && !e.currentTarget.contains(next)) close();
                }}>
                <button id={`nav-btn-${p.id}`} type="button" className="nav-top" aria-expanded={open === p.id} aria-controls={`mega-${p.id}`}
                  aria-current={current(p) ? "true" : undefined} onClick={() => onClickTop(p.id)} onKeyDown={onTopKey(p.id)}>
                  <span>{p.label}</span>
                  <Icon name="chevron" size={14} className="nav-chev" />
                </button>
                <div onKeyDown={onPanelKey(p.id)}>
                  <Panel panel={p} open={open === p.id} onNavigate={close} />
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-util">
          <CartButton variant="pill" />
          <a href={whatsappHref} aria-label="Chat on WhatsApp" className="nav-cta btn-primary"
            {...(whatsappHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <Icon name="whatsapp" size={18} />
            <span className="nav-cta-short">WhatsApp</span><span className="nav-cta-long">Chat on WhatsApp</span>
          </a>
          <MobileMenu panels={panels} whatsappHref={whatsappHref} />
        </div>
      </div>
    </div>
  );
}
