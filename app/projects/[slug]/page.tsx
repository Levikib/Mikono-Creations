import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { ContentGrid } from "@/components/ContentCard";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PolaroidCard, Taped, WaveDividerBone, WhatsAppLink, tilts } from "@/components/Scrap";
import { ButtonLink } from "@/components/Button";
import { projectBySlug, projects } from "@/content/projects";
import { freshScenes, photos } from "@/content/photos";
import { projectCard } from "@/lib/contentCards";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pr = projectBySlug((await params).slug);
  if (!pr) return {};
  const ph = photos[pr.cover];
  return pageMetadata({ title: pr.title, description: pr.summary, path: `/projects/${pr.slug}`, og: `project-${pr.slug}`, ogAlt: ph.alt });
}

export default async function ProjectPage({ params }: Props) {
  const pr = projectBySlug((await params).slug);
  if (!pr) notFound();
  const cover = photos[pr.cover];
  const wide = cover.w / cover.h > 2;
  const others = projects.filter((p) => p.slug !== pr.slug).slice(0, 3);
  // No photo twice on one page: the gallery skips the cover and the covers of the cards below.
  const gallery = freshScenes(pr.gallery, [pr.cover, ...others.map((o) => o.cover)]);
  return (
    <HandScope>
      <JsonLd data={breadcrumbLd([{ name: "Projects", path: "/projects" }, { name: pr.title, path: `/projects/${pr.slug}` }])} />
      <div className="paper-grain">
        <Container className="grid items-center gap-4 pb-4 pt-4 md:grid-cols-[1fr_1fr] md:py-5">
          <div>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: pr.title }]} />
            <p className="mt-4 eyebrow">{pr.kind}</p>
            <h1 className="mt-1 text-display-lg">{pr.title}</h1>
            <p className="mt-4 max-w-[52ch] text-[.9375rem] leading-[1.55]">{pr.summary}</p>
          </div>
          <Taped id={pr.cover} ratio={wide ? "aspect-[16/7]" : "aspect-[4/3]"} tilt={2} priority sizes="(min-width:768px) 460px, 90vw"
            className={`mx-auto w-full ${Math.min(cover.w, cover.h) < 700 && !wide ? "max-w-[340px]" : "max-w-[460px]"}`} />
        </Container>
        <WaveDividerBone />
      </div>
      <Container className="grid gap-6 py-4 md:py-6 lg:grid-cols-[1fr_320px]">
        <div className="grid max-w-[720px] gap-5 text-[.9375rem] leading-[1.7]">
          <section aria-labelledby="did">
            <h2 id="did" className="text-display-md">What the photos show</h2>
            <div className="mt-3 grid gap-3">{pr.did.map((t) => <p key={t}>{t}</p>)}</div>
          </section>
          <section aria-labelledby="see">
            <h2 id="see" className="text-display-md">Look closer</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-6 marker:text-terracotta-deep">{pr.see.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
          <section aria-labelledby="join">
            <h2 id="join" className="text-display-md">How to join or ask</h2>
            <p className="mt-3">{pr.ask}</p>
            <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink text={`Hello Mikono Creations, a question about your project "${pr.title}".`} />
              <ButtonLink href="/partners" variant="ghost">Partner with us</ButtonLink>
            </div>
          </section>
        </div>
        <aside aria-labelledby="facts" className="h-fit rounded-[var(--radius-card)] bg-oat p-3 shadow-clay-sm">
          <h2 id="facts" className="text-[1.125rem]">At a glance</h2>
          <dl className="mt-3 grid gap-3 text-base">
            <div><dt className="font-semibold text-baobab">Type</dt><dd>{pr.kind}</dd></div>
            <div><dt className="font-semibold text-baobab">Animals</dt><dd>{pr.animals}</dd></div>
            <div><dt className="font-semibold text-baobab">Photos</dt><dd>{1 + gallery.length} on this page</dd></div>
            {pr.note ? <div><dt className="font-semibold text-baobab">Not confirmed yet</dt><dd>{pr.note}</dd></div> : null}
          </dl>
        </aside>
      </Container>
      {gallery.length ? <section aria-labelledby="photos" className="bg-oat py-5 md:py-8">
        <Container>
          <h2 id="photos" className="mb-4 text-display-md">Photos</h2>
          <ul data-card-group className="mk-grid">
            {gallery.map((id, i) => (
              <li key={id}><PolaroidCard id={id} tilt={tilts[i % tilts.length]} /></li>
            ))}
          </ul>
        </Container>
      </section> : null}
      <Container className="py-5 md:py-8">
        <h2 className="mb-3 text-display-md">More projects</h2>
        <ContentGrid items={others.map(projectCard)} />
      </Container>
    </HandScope>
  );
}
