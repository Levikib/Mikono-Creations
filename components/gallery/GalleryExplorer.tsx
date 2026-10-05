"use client";
import Image from "@/components/Img";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { ResultCount } from "@/components/filters/ResultCount";
import { Tabs, panelId, tabId } from "@/components/filters/Tabs";
import { cx } from "@/lib/cx";
import type { GalleryPhoto, GalleryTab, GalleryTabKey, GalleryVideo } from "@/content/gallery";

type TabKey = GalleryTabKey | "all";
type Entry =
  | ({ kind: "photo" } & GalleryPhoto)
  | ({ kind: "video" } & GalleryVideo);

const sizes = "(min-width:1280px) 200px, (min-width:768px) 22vw, 34vw";

/**
 * Every photo, grouped by topic. Tabs (with counts, plus All) switch the topic, a tile opens the lightbox.
 * Lightbox keys: Escape closes, Left and Right (or Up and Down) move, Home and End jump, Tab stays inside.
 * A photo is never shown larger than its own width, so small sources stay crisp on a sand panel.
 */
export function GalleryExplorer({ tabs, photos, video }: { tabs: GalleryTab[]; photos: GalleryPhoto[]; video: GalleryVideo }) {
  const uid = useId();
  const [active, setActive] = useState<TabKey>(tabs[0].key);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const entriesFor = useCallback((key: TabKey): Entry[] => {
    const all: Entry[] = [{ kind: "video", ...video }, ...photos.map((p): Entry => ({ kind: "photo", ...p }))];
    return key === "all" ? all : all.filter((e) => e.tab === key);
  }, [photos, video]);
  const entries = entriesFor(active);
  const total = photos.length + 1;
  const allTabs = [...tabs.map((t) => ({ key: t.key as TabKey, label: t.label, blurb: t.blurb })), { key: "all" as TabKey, label: "All", blurb: "Every photo and the video, together." }];

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "") as TabKey;
      if (h === "all" || tabs.some((t) => t.key === h)) setActive(h);
    };
    const t = window.setTimeout(read, 0);
    window.addEventListener("hashchange", read);
    return () => { window.clearTimeout(t); window.removeEventListener("hashchange", read); };
  }, [tabs]);

  const choose = (key: string) => {
    setActive(key as TabKey);
    try { window.history.replaceState(null, "", `#${key}`); } catch { /* ignore */ }
  };

  return (
    <div>
      <Tabs label="Gallery topics" prefix={uid} value={active} onChange={choose} tabs={allTabs.map((t) => ({ key: t.key, label: t.label, count: entriesFor(t.key).length }))} />

      {allTabs.map((t) => (
        <section key={t.key} role="tabpanel" id={panelId(uid, t.key)} aria-labelledby={tabId(uid, t.key)} hidden={t.key !== active} className="mt-2">
          {t.key === active ? (
            <>
              <p className="mb-1 text-[.875rem] text-stone">{t.blurb}</p>
              <ResultCount shown={entries.length} total={total} one="photo or video" many="photos and videos" className="mb-2" />
              <ul data-card-group aria-label={t.label} className="mk-grid">
                {entries.map((e, i) => (
                  <li key={e.id}>
                    <article data-card="polaroid" data-ratio="1/1" data-tone="baobab" className="mk-card mk-card--photo mk-card--moment">
                      <div data-media className="mk-head">
                        <div className="mk-photo">
                          <Image src={e.kind === "video" ? e.poster : e.cardSrc ?? e.src} alt={e.alt} fill sizes={sizes}
                            loading={i < 4 ? "eager" : undefined} className="object-cover" />
                          {e.kind === "video" ? (
                            <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] grid place-items-center">
                              <span className="grid size-11 place-items-center rounded-full bg-baobab/85 text-bone shadow-clay-sm">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M9 6.5v11l9-5.5z" /></svg>
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="mk-foot">
                        <p className="mk-title">
                          <button type="button" className="mk-stretch cursor-pointer text-left"
                            aria-label={e.kind === "video" ? `Play video: ${e.caption}` : `Open photo: ${e.caption}`}
                            onClick={(ev) => { opener.current = ev.currentTarget; setOpen(i); }}>{e.caption}</button>
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ))}

      {open !== null && entries[open] ? (
        <Lightbox entries={entries} index={open} onIndex={setOpen} onClose={() => { setOpen(null); opener.current?.focus(); }} />
      ) : null}
    </div>
  );
}

function Lightbox({ entries, index, onIndex, onClose }: { entries: Entry[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const n = entries.length;
  const e = entries[index];
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") { ev.preventDefault(); onClose(); return; }
      const inVideo = (ev.target as HTMLElement | null)?.tagName === "VIDEO";
      if (ev.key === "ArrowRight" || (ev.key === "ArrowDown" && !inVideo)) { ev.preventDefault(); go(1); }
      else if (ev.key === "ArrowLeft" || (ev.key === "ArrowUp" && !inVideo)) { ev.preventDefault(); go(-1); }
      else if (ev.key === "Home" && !inVideo) { ev.preventDefault(); onIndex(0); }
      else if (ev.key === "End" && !inVideo) { ev.preventDefault(); onIndex(n - 1); }
      else if (ev.key === "Tab") {
        const f = Array.from(root.current?.querySelectorAll<HTMLElement>("button, video[controls]") ?? []);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, n, onClose, onIndex]);

  const btn = "hit-area grid size-10 place-items-center rounded-full bg-bone/90 text-baobab shadow-clay-sm focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus";
  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label={`${e.caption}, ${index + 1} of ${n}`} data-lightbox
      className="fixed inset-0 z-[90] flex flex-col bg-charcoal/95 text-bone" onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}>
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <p className="font-mono text-[.75rem] uppercase tracking-wide text-bone/80" aria-hidden="true">{index + 1} / {n}</p>
        <button type="button" data-close onClick={onClose} aria-label="Close" className={btn}><Icon name="close" size={20} /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-16" onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}>
        {n > 1 ? (
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={cx(btn, "absolute left-2 top-1/2 z-[2] -translate-y-1/2")}>
            <Icon name="chevron" size={20} className="rotate-90" />
          </button>
        ) : null}
        <figure className="m-0 flex max-h-full max-w-full flex-col items-center">
          {e.kind === "video" ? (
            <video key={e.src} src={e.src} poster={e.poster} controls autoPlay playsInline preload="metadata" aria-label={e.alt}
              className="max-h-[72vh] max-w-full rounded-[var(--radius-photo)] bg-black" />
          ) : (
            <div className="rounded-[var(--radius-photo)] bg-sand p-0">
              <Image key={e.src} src={e.src} alt={e.alt} width={e.w} height={e.h} sizes={`${e.w}px`}
                className="block rounded-[var(--radius-photo)] object-contain"
                style={{ width: `min(100vw - 1.5rem, ${e.w}px)`, maxWidth: "100%", maxHeight: "72vh", height: "auto" }} />
            </div>
          )}
          <figcaption className="mt-2 max-w-[60ch] text-center text-[.875rem] text-bone">{e.caption}</figcaption>
        </figure>
        {n > 1 ? (
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={cx(btn, "absolute right-2 top-1/2 z-[2] -translate-y-1/2")}>
            <Icon name="chevron" size={20} className="-rotate-90" />
          </button>
        ) : null}
      </div>
      <p className="px-3 pb-3 pt-1 text-center text-[.75rem] text-bone/70">Use the arrow keys to move and Escape to close.</p>
    </div>
  );
}
