import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { sizeWord } from "@/lib/sizes";

/** Solid paper chip: never translucent over photos (AA). Mono label look. */
export function Chip({ children, tone = "sand", className }: { children: ReactNode; tone?: "sand" | "oat" | "outline"; className?: string }) {
  const t = {
    sand: "bg-sand text-charcoal",
    oat: "bg-paper text-charcoal shadow-[inset_0_1px_1px_#fff,0_2px_6px_rgb(59_42_34/.18)]",
    outline: "ring-1 ring-baobab/40 text-baobab",
  }[tone];
  return <span className={cx("inline-flex h-8 items-center rounded-full px-3 text-[.8125rem] font-semibold", t, className)}>{children}</span>;
}

/** Display only chip used on listing cards. Selection happens on the product page. */
export function SizeChip({ size, selected, as: Tag = "span" }: { size: string; selected?: boolean; as?: "span" | "li" }) {
  return (
    <Tag className={cx(
      "hit-area inline-flex h-8 min-w-9 items-center justify-center rounded-full px-2.5 text-[.8125rem] font-semibold @max-[200px]:min-w-8 @max-[200px]:px-2",
      selected ? "bg-baobab text-bone" : "bg-sand text-charcoal",
    )}>
      {sizeWord(size)}
    </Tag>
  );
}
