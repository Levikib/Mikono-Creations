"use client";
import Image from "@/components/Img";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export type DeckItem = {
  href: string;
  title: string;
  category: string;
  meta: string;
  image: { src: string; alt: string; focal?: [number, number] };
};

const SHOWN = 4; // cards visible in the fan, front card included
const COMMIT = 56; // px of drag that turns a card over

/**
 * Meet the herd: a fanned deck of animals. One card sits in front; the others peek out behind it.
 * Swipe or drag the front card sideways, tap the arrows or the dots, or use the left and right arrow keys.
 * Vertical gestures are left to the browser (touch-action: pan-y), so the page always scrolls.
 */
export function HerdDeck({ items }: { items: readonly DeckItem[] }) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null);
  const suppress = useRef(false);

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + n) % n), [n]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.moved) {
      if (Math.abs(dx) < 6) return;
      // A mostly vertical gesture belongs to the page.
      if (Math.abs(dy) > Math.abs(dx)) { start.current = null; return; }
      s.moved = true;
      setDragging(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    setDrag(dx);
  };
  const end = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    start.current = null;
    if (s.moved) {
      suppress.current = true;
      window.setTimeout(() => { suppress.current = false; }, 80);
      if (Math.abs(drag) > COMMIT) go(drag < 0 ? 1 : -1);
    }
    setDragging(false);
    setDrag(0);
  };

  // Arrow keys move the deck while focus is inside it.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  // Keep the live region quiet on first render.
  const [announce, setAnnounce] = useState("");
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setAnnounce(`${items[index].title}, ${index + 1} of ${n}`);
  }, [index, items, n]);

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Meet the herd" onKeyDown={onKey} className="herd">
      <div className="herd-stage" style={{ touchAction: "pan-y pinch-zoom" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={end} onPointerCancel={end}
        onClickCapture={(e) => { if (suppress.current) { e.preventDefault(); e.stopPropagation(); } }}>
        {items.map((it, i) => {
          const d = (i - index + n) % n;
          const front = d === 0;
          const dd = Math.min(d, SHOWN - 1); // cards past the fan wait right behind the last one, invisible
          const side = dd % 2 === 0 ? 1 : -1;
          const style = front
            ? { transform: `translate3d(${drag}px,0,0) rotate(${drag / 18}deg)`, transition: dragging ? "none" : undefined, zIndex: n }
            : { transform: `translate3d(${side * dd * 9}px,${dd * 10}px,0) rotate(${side * dd * 2.6}deg) scale(${1 - dd * 0.045})`, zIndex: n - d, opacity: d < SHOWN ? 1 : 0 };
          return (
            <article key={it.href} className="herd-card" data-front={front ? "true" : "false"} style={style}
              aria-roledescription="slide" aria-label={`${i + 1} of ${n}`} aria-hidden={front ? undefined : true}>
              <div className="herd-photo">
                <Image src={it.image.src} alt={it.image.alt} fill sizes="(min-width:768px) 320px, 80vw" draggable={false}
                  className="object-cover" style={it.image.focal ? { objectPosition: `${it.image.focal[0] * 100}% ${it.image.focal[1] * 100}%` } : undefined} />
                <span className="herd-chip">{it.category}</span>
              </div>
              <div className="herd-body yarn">
                <h3 className="min-w-0 font-display text-[1rem] font-bold leading-[1.1] tracking-[-.035em] text-baobab">{it.title}</h3>
                <Link href={it.href} draggable={false} tabIndex={front ? undefined : -1} className="herd-link" aria-label={`Meet the ${it.title.toLowerCase()}`}>View<Icon name="arrow" size={18} /></Link>
              </div>
            </article>
          );
        })}
      </div>
      <div className="herd-ctl">
        <button type="button" className="iconbtn" aria-label="Previous animal" onClick={() => go(-1)}><Icon name="chevron" size={18} className="rotate-90" /></button>
        <ul className="herd-dots" aria-label="Choose an animal">
          {items.map((it, i) => (
            <li key={it.href}>
              <button type="button" aria-label={`Show ${it.title}`} aria-current={i === index ? "true" : undefined} onClick={() => setIndex(i)}><i /></button>
            </li>
          ))}
        </ul>
        <button type="button" className="iconbtn" aria-label="Next animal" onClick={() => go(1)}><Icon name="chevron" size={18} className="-rotate-90" /></button>
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
