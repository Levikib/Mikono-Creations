import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Bento({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("bento", className)}>{children}</div>;
}

/** Sizes: 1x1, 2x1, 2x2 only so rows always close. */
export function BentoTile({ size = "1x1", children, className }: { size?: "1x1" | "2x1" | "2x2"; children: ReactNode; className?: string }) {
  return <div className={cx("clay relative flex flex-col p-3 !rounded-[var(--radius-panel)]", `b-${size}`, className)}>{children}</div>;
}
