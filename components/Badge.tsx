import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "./Icon";

const tones = {
  new: "bg-terracotta-tint text-baobab",
  info: "bg-ochre-tint text-ochre-deep",
  success: "bg-olive-tint text-olive-deep",
  error: "bg-terracotta-tint text-brick",
} as const;

export function Badge({ tone = "info", icon, children }: { tone?: keyof typeof tones; icon?: IconName; children: ReactNode }) {
  return (
    <span className={cx("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[.8125rem] font-semibold", tones[tone])}>
      {icon ? <Icon name={icon} size={16} /> : null}{children}
    </span>
  );
}
