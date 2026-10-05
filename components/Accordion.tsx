import type { ReactNode } from "react";
import { Icon } from "./Icon";

/** Native details and summary: keyboard and screen reader behaviour comes from the browser. */
export function Accordion({ items }: { items: { id: string; title: string; content: ReactNode }[] }) {
  return (
    <div className="divide-y divide-sand overflow-hidden rounded-[var(--radius-card)] bg-oat shadow-clay-sm">
      {items.map((it) => (
        <details key={it.id} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-[.9375rem] font-semibold text-baobab [&::-webkit-details-marker]:hidden">
            {it.title}
            <Icon name="chevron" size={22} className="shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5 text-body text-charcoal">{it.content}</div>
        </details>
      ))}
    </div>
  );
}
