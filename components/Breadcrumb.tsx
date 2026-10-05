import Link from "next/link";
import { Icon } from "./Icon";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-0.5 text-[.8125rem] text-stone">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label} className="flex items-center gap-1">
              {it.href && !last ? (
                <Link href={it.href} className="hit-y inline-flex min-h-8 items-center justify-center px-1 text-terracotta-deep underline-offset-4 hover:underline">{it.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="inline-flex min-h-8 items-center px-1 font-semibold text-baobab">{it.label}</span>
              )}
              {!last ? <Icon name="chevron" size={14} className="-rotate-90 text-stone" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
