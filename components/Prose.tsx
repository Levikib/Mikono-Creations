import type { ReactNode } from "react";

/** Reading column for help and legal pages. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="grid max-w-[720px] gap-4 text-[.9375rem] leading-[1.6] text-charcoal md:gap-5 md:text-base">{children}</div>;
}

export function Sec({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-display-md">{title}</h2>
      <div className="mt-2 grid gap-2">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return <ul className="grid list-disc gap-1 pl-5 marker:text-terracotta-deep">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}
