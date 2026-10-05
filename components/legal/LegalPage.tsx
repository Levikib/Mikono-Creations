import type { ReactNode } from "react";
import "@/app/legal.css";
import Link from "next/link";
import { publicDocuments, type LegalDoc } from "@/content/legal";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SubNav } from "@/components/filters/SubNav";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/pageMeta";
import { Marked, PlaceholderCallout } from "./Placeholders";

const isPlaceholder = (v: string) => /^\[[A-Z0-9][A-Z0-9 /,'()+:.]*\]$/.test(v);
const shown = (v: string) => (isPlaceholder(v) || /draft/i.test(v) ? "Draft" : v);

/**
 * One layout for every legal document: a table of contents (sticky on large screens, collapsible on phones), section anchors,
 * version and effective date, and the placeholders highlighted. advocateNotes are never rendered.
 */
export function LegalPage({ doc, before, after, hide = [], extraNav = [] }: {
  doc: LegalDoc; before?: ReactNode; after?: ReactNode; hide?: string[]; extraNav?: { id: string; label: string }[];
}) {
  const sections = doc.sections.filter((s) => !hide.includes(s.id));
  const toc = [...sections.map((s) => ({ id: s.id, label: s.heading })), ...extraNav];
  const path = doc.route ?? "/legal";
  return (
    <div className="legal-doc">
      <JsonLd data={breadcrumbLd([{ name: "Legal", path: "/legal" }, { name: doc.title, path }])} />
      <Container className="pb-8 pt-4 md:pt-5">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Legal", href: "/legal" }, { label: doc.title }]} />
        <div className="legal-head mt-3">
          <h1 className="text-display-lg">{doc.title}</h1>
          <p className="mt-1 text-[.9375rem] leading-[1.55]"><Marked text={doc.summary} /></p>
          <p className="legal-meta">Version: {shown(doc.version)} <span aria-hidden="true">|</span> Effective date: {shown(doc.effectiveDate)}</p>
          <p className="legal-banner">Draft. This text is being reviewed by an advocate and is not final.</p>
        </div>
        <div className="legal-grid">
          <aside className="legal-toc" aria-label="Contents">
            <SubNav items={toc} />
          </aside>
          <article className="legal-body">
            <PlaceholderCallout items={doc.placeholders} />
            {before}
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>{s.heading}</h2>
                {s.paragraphs.map((p, i) => <p key={i}><Marked text={p} /></p>)}
                {s.list ? <ul>{s.list.map((l, i) => <li key={i}><Marked text={l} /></li>)}</ul> : null}
                {s.note ? <p className="legal-note"><Marked text={s.note} /></p> : null}
              </section>
            ))}
            {after}
            <p className="legal-foot"><a href="/legal">All legal documents</a></p>
          </article>
          <aside className="legal-side" aria-label="Other documents">
            <div className="legal-side-card">
              <p className="eyebrow">Other documents</p>
              <ul>
                {publicDocuments.filter((d) => (d.route ?? "/legal") !== path).map((d) => (
                  <li key={d.slug}><Link href={d.route ?? "/legal"} className="hit-y">{d.title}</Link></li>
                ))}
              </ul>
            </div>
            <div className="legal-side-card">
              <p className="eyebrow">Questions about this page</p>
              <p>Message us on WhatsApp and a person will reply.</p>
              <p><Link href="/contact" className="hit-y font-semibold text-terracotta-deep underline underline-offset-4">Contact us</Link></p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
