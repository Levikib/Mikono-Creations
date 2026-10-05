import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

const sizes = [
  { label: "Small", h: 72, note: "Smallest" },
  { label: "Medium", h: 104, note: "" },
  { label: "Large", h: 136, note: "" },
  { label: "Extra large", h: 168, note: "Largest" },
] as const;

/** One animal shape in four relative heights. Illustration only: no measurements are shown (R5). */
export function SizeLadder({ className }: { className?: string }) {
  return (
    <figure className={cx("m-0 min-w-0", className)}>
      <div className="clay flex items-end justify-around gap-2 !rounded-[var(--radius-panel)] px-3 pb-4 pt-3 md:px-8">
        {sizes.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-3">
            <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="aspect-square h-[var(--h)] w-auto text-clay xl:h-[var(--hd)]"
              style={{ "--h": `min(${Math.round(s.h * 0.6)}px, ${(s.h * 0.14).toFixed(1)}vw)`, "--hd": `${Math.round(s.h * 0.9)}px` } as CSSProperties}>
              <circle cx="27" cy="22" r="13" fill="currentColor" />
              <circle cx="73" cy="22" r="13" fill="currentColor" />
              <ellipse cx="50" cy="66" rx="30" ry="29" fill="currentColor" />
              <circle cx="50" cy="38" r="24" fill="currentColor" />
              <circle cx="42" cy="35" r="3" fill="var(--color-baobab-deep)" />
              <circle cx="58" cy="35" r="3" fill="var(--color-baobab-deep)" />
              <ellipse cx="50" cy="45" rx="7" ry="5" fill="var(--color-oat)" />
            </svg>
            <span className="flex min-h-8 items-center justify-center rounded-full bg-baobab px-2.5 text-[.8125rem] font-semibold text-bone">{s.label}</span>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">Four animals of the same shape in rising sizes: Small, Medium, Large and Extra large. The picture shows relative size only.</figcaption>
    </figure>
  );
}
