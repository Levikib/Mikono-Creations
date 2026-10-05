"use client";
import { useEffect, useRef, type ElementType } from "react";
import { cx } from "@/lib/cx";

/** Per word entrance and one gentle bounce on the accent word. Six words or fewer, one per page. */
export function KineticHeading({ text, accentIndex, as: Tag = "h2", className }: {
  text: string; accentIndex?: number; as?: ElementType; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("is-in"); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={cx("kinetic", className)}>
      {words.map((w, i) => (
        <span key={i}>
          <span className={cx("w", i === accentIndex && "accent")} style={{ "--i": i } as React.CSSProperties}>{w}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
