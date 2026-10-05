import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function EmptyState({ icon = "hand", title, text, action, level = 2, art }: { art?: ReactNode; icon?: IconName; title: string; text: string; action?: ReactNode; level?: 1 | 2 }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2 rounded-[var(--radius-panel)] bg-oat p-4 text-center sm:p-4 shadow-clay-sm">
      {art ?? <Icon name={icon} size={36} className="text-baobab" />}
      {level === 1 ? <h1 className="text-[1.125rem]">{title}</h1> : <h2 className="text-[1.125rem]">{title}</h2>}
      <p className="text-stone">{text}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
