import type { CSSProperties } from "react";

const SCALE: Record<string, number> = { S: 0.52, M: 0.68, L: 0.84, XL: 1, any: 0.76, other: 0.76 };

/** Small animal silhouette whose height steps up with the size class. Relative only, no measurements. */
export function SizeMark({ size, className }: { size: string; className?: string }) {
  const k = SCALE[size] ?? 0.76;
  return (
    <span aria-hidden="true" className={`flex size-11 flex-none items-end justify-center ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" focusable="false" style={{ height: `${k * 100}%`, width: "auto", color: "var(--h-ochre)" } as CSSProperties}>
        <circle cx="27" cy="22" r="13" fill="currentColor" />
        <circle cx="73" cy="22" r="13" fill="currentColor" />
        <ellipse cx="50" cy="66" rx="30" ry="29" fill="currentColor" />
        <circle cx="50" cy="38" r="24" fill="currentColor" />
        <circle cx="42" cy="35" r="3" fill="var(--h-ink)" />
        <circle cx="58" cy="35" r="3" fill="var(--h-ink)" />
      </svg>
    </span>
  );
}
