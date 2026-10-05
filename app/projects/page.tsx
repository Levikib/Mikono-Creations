import Link from "next/link";
import { ContentGrid } from "@/components/ContentCard";
import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { ScrapHero, Taped, WhatsAppLink } from "@/components/Scrap";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/content/projects";
import { projectCard } from "@/lib/contentCards";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Photo stories from Mikono Creations: making giraffes, finishing a lion mane, market tables and shop shelves.",
  path: "/projects",
});

export default function ProjectsPage() {
  const [first, ...rest] = projects;
  return (
    <HandScope>
      <JsonLd data={breadcrumbLd([{ name: "Projects", path: "/projects" }])} />
      <ScrapHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        eyebrow="Photo stories"
        title="Projects"
        lede="Each project is a set of real photos with a plain note on what you can see. We have not added dates, partner names or results yet, and we say so on each page."
      />
      <Container className="py-4 md:py-6">
        <section aria-labelledby="featured" className="mb-4 grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3 md:mb-6 md:grid-cols-[.8fr_1.2fr] md:gap-6">
          <Taped id={first.cover} ratio="aspect-square md:aspect-[4/3]" tilt={-1.5} sizes="(min-width:768px) 320px, 112px" className="w-full max-w-[112px] md:mx-auto md:max-w-[360px]" />
          <div>
            <p className="eyebrow">{first.kind}</p>
            <h2 id="featured" className="mt-1 text-display-md"><Link href={`/projects/${first.slug}`} className="hit hover:underline">{first.title}</Link></h2>
            <p className="mt-1 line-clamp-3 max-w-[52ch] text-base md:line-clamp-none">{first.summary}</p>
            <div className="mt-1.5"><ButtonLink size="compact" href={`/projects/${first.slug}`} variant="primary">Read project</ButtonLink></div>
          </div>
        </section>
        <h2 className="mb-3 text-display-md">More projects</h2>
        <ContentGrid items={rest.map(projectCard)} />
        <div className="mt-6 flex flex-col items-start gap-3 rounded-[var(--radius-panel)] bg-oat p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-[.9375rem]">Have an idea for a project together? Tell us what you have in mind.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/partners" variant="ghost">Partner with us</ButtonLink>
            <WhatsAppLink text="Hello Mikono Creations, I have an idea for a project." />
          </div>
        </div>
      </Container>
    </HandScope>
  );
}
