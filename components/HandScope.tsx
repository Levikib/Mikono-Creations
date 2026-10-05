import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/** The hand lettering font is retired; this wrapper stays so scrapbook pages need no edits. */
export function HandScope({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("hand-scope", className)}>{children}</div>;
}
