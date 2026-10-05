import Link from "next/link";
import { Container } from "@/components/Container";
import { PlainHero, PendingNote, WhatsAppLink } from "@/components/Scrap";
import { Accordion } from "@/components/Accordion";
import { FaqFilter } from "@/components/FaqFilter";
import { JsonLd } from "@/components/JsonLd";
import { faqGroups, faqLd } from "@/content/faq";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Answers about our crocheted animals, ordering on WhatsApp, wholesale and the people behind Mikono Creations.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd()} />
      <JsonLd data={breadcrumbLd([{ name: "FAQ", path: "/faq" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]} title="Questions and answers" lede="Only questions we can answer today are here. For anything else, message us on WhatsApp." />
      <Container className="grid gap-6 py-4 md:py-6">
        <FaqFilter index={faqGroups.map((g) => ({ id: g.id, title: g.title, text: g.items.map((it) => `${it.q} ${it.a}`.toLowerCase()) }))}
          whatsapp={<WhatsAppLink text="Hello Mikono Creations, I have a question." label="Ask on WhatsApp" />}>
          <div id="faq-list" className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-2">
            {faqGroups.map((g) => (
              <section key={g.id} id={`faq-${g.id}`} aria-labelledby={g.id} className="min-w-0">
                <h2 id={g.id} className="mb-3 text-display-md">{g.title}</h2>
                <Accordion items={g.items.map((it, i) => ({
                  id: `${g.id}-${i}`,
                  title: it.q,
                  content: (
                    <>
                      <p>{it.a}</p>
                      {it.link ? <p className="mt-2"><Link href={it.link.href} className="inline-flex min-h-11 items-center font-semibold text-terracotta-deep underline underline-offset-4">{it.link.label}</Link></p> : null}
                    </>
                  ),
                }))} />
              </section>
            ))}
          </div>
        </FaqFilter>
        <div className="grid gap-3 md:grid-cols-2">
          <PendingNote title="Not answered yet">Delivery fees and times, returns, filling and age guidance are still being confirmed, so they are not in this list.</PendingNote>
          <div className="flex flex-col items-start justify-center gap-3">
            <p className="text-[.9375rem]">Did not find your question?</p>
            <WhatsAppLink text="Hello Mikono Creations, I have a question." label="Ask on WhatsApp" />
          </div>
        </div>
      </Container>
    </>
  );
}
