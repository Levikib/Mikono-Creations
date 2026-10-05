import Link from "next/link";
import Image from "@/components/Img";
import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { ScrapHero, WhatsAppLink } from "@/components/Scrap";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { JournalIndex } from "@/components/JournalIndex";
import { pillarLabel, pillars, posts } from "@/content/journal";
import { postCard } from "@/lib/contentCards";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Notes on Kenyan animals, play at home, yarn and craft, our makers, gifts and working with us. Plain words from Mikono Creations.",
  path: "/journal",
});

export default function JournalPage() {
  const [first] = posts;
  const list = posts.map((p) => ({ slug: p.slug, pillar: p.pillar, card: postCard(p) }));
  const hero = first.images[0];
  const pil = pillars.map((p) => ({ id: p.id, label: p.label }));
  return (
    <HandScope>
      <FxPage t="journal">
      <JsonLd data={breadcrumbLd([{ name: "Blog", path: "/journal" }])} />
      <ScrapHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        eyebrow="From the workroom"
        title="Blog"
        lede={`${posts.length} short posts about Kenyan animals, play at home, yarn and craft, our makers, gifts and working with us.`}
      />
      <Band t="journal" id="top" />
      <Container className="py-4 md:py-6">
        <section aria-labelledby="featured" className="mb-5 grid items-center gap-3 md:grid-cols-[1.1fr_.9fr] md:gap-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-photo)] bg-sand">
            <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width:768px) 600px, 94vw" className="object-cover" style={{ objectPosition: `${hero.focal[0] * 100}% ${hero.focal[1] * 100}%` }} />
          </div>
          <div>
            <p className="eyebrow">Latest post, {pillarLabel(first.pillar)}</p>
            <h2 id="featured" className="mt-1 text-display-md"><Link href={`/journal/${first.slug}`} className="hit hover:underline">{first.title}</Link></h2>
            <p className="mt-1 line-clamp-3 max-w-[52ch] text-base">{first.description}</p>
            <div className="mt-1.5"><ButtonLink size="compact" href={`/journal/${first.slug}`} variant="primary">Read the post</ButtonLink></div>
          </div>
        </section>
        <Band t="journal" id="mid" nested />
        <JournalIndex posts={list} pillars={pil} />
        <div className="mt-6 flex flex-col items-start gap-3 rounded-[var(--radius-panel)] bg-oat p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-[.9375rem]">Something you would like us to write about? Tell us on WhatsApp.</p>
          <WhatsAppLink text="Hello Mikono Creations, I would like to read a post about " label="Suggest a topic" />
        </div>
      </Container>
      </FxPage>
    </HandScope>
  );
}
