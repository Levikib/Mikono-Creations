import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";

/** Compact page head shared by the three helpers: breadcrumb, eyebrow, title and one plain sentence. */
export function HelperHeader({ crumbs, eyebrow, title, lede, children }: {
  crumbs: { label: string; href?: string }[]; eyebrow: string; title: string; lede: string; children?: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--hairline,rgb(90_63_50/.14))]">
      <Container className="pb-5 pt-1 md:pb-8 md:pt-3">
        <Breadcrumb items={crumbs} />
        <p className="mkh-eyebrow mt-1">{eyebrow}</p>
        <h1 className="mt-1.5 text-display-lg">{title}</h1>
        <p className="mkh-muted mt-2 max-w-[58ch] text-[1rem] leading-[1.5] md:text-[.9375rem]">{lede}</p>
        {children}
      </Container>
    </div>
  );
}
