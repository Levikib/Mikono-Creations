import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Container({ as: Tag = "div", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag data-c="" className={cx("mx-auto w-full max-w-[1280px] px-3 md:px-4 xl:px-6", className)}>{children}</Tag>;
}
