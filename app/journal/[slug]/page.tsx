import { SubNav } from "@/components/filters/SubNav";
import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import type { Metadata } from "next";
import Image from "@/components/Img";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { ArticleBody, PhotoCredits, SourceList, headingId } from "@/components/ArticleBody";
import { ContentGrid } from "@/components/ContentCard";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WhatsAppLink } from "@/components/Scrap";
import { ButtonLink } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { allProducts, type Product } from "@/lib/catalogue";
import { neighbours, pillarLabel, postBySlug, posts, relatedPosts, type JournalPost } from "@/content/journal";
import { postCard } from "@/lib/contentCards";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";
import { siteBaseUrl } from "@/lib/env";
import { site } from "@/lib/site";

/** Animals named in the post text, most mentioned first. Plain animals only (no wall heads, dolls or bags). */
function animalsIn(post: JournalPost): Product[] {
  const text = [post.title, post.description, ...post.blocks.flatMap((b) => ("text" in b ? [b.text] : "items" in b ? b.items : []))].join(" ").toLowerCase();
  return allProducts()
    .filter((p) => p.category !== "wall-art" && p.category !== "dolls" && /^[a-z]+$/.test(p.slug))
    .map((p) => ({ p, n: (text.match(new RegExp(`\\b${p.slug}(?:s|es)?\\b`, "g")) ?? []).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 4)
    .map((x) => x.p);
}

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  const md = pageMetadata({ title: post.title, description: post.description, path: `/journal/${post.slug}`, og: `journal-${post.slug}`, ogAlt: post.images[0].alt, type: "article" });
  // The layout adds " | Mikono Creations". Long titles go out alone so the page title stays within 60 characters.
  return post.title.length + 19 > 60 ? { ...md, title: { absolute: post.title } } : md;
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function PostPage({ params }: Props) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();
  const hero = post.images[0];
  const related = relatedPosts(post);
  const { newer, older } = neighbours(post);
  const base = siteBaseUrl();
  const animals = animalsIn(post);
  const toc = post.blocks.flatMap((b) => (b.t === "h" ? [{ id: headingId(b.text), text: b.text }] : []));
  const extra = post.links.filter((l) => !l.href.startsWith("/shop/"));
  const ctaLabel = post.cta.href ? post.links.find((l) => l.href === post.cta.href)?.label ?? "Learn more" : "";
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: [`${base}${hero.src}`],
    mainEntityOfPage: `${base}/journal/${post.slug}`,
    articleSection: pillarLabel(post.pillar),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
  return (
    <HandScope>
      <FxPage t="post">
      <JsonLd data={article} />
      <JsonLd data={breadcrumbLd([{ name: "Blog", path: "/journal" }, { name: post.title, path: `/journal/${post.slug}` }])} />
      <div className="paper-grain">
        <Container className="pb-3 pt-4 md:pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/journal" }, { label: post.title }]} />
          <div className="post-head mt-3">
            <div>
              <p className="eyebrow"><Link href={`/journal?topic=${post.pillar}`} className="hover:underline">{pillarLabel(post.pillar)}</Link></p>
              <h1 className="mt-1 max-w-[28ch] text-display-lg">{post.title}</h1>
            </div>
            <div>
              <p className="max-w-[60ch] text-[.9375rem] leading-[1.55]">{post.description}</p>
              <p className="mt-2 text-base text-stone"><time dateTime={post.date}>{fmt(post.date)}</time>, {post.readTime}</p>
            </div>
          </div>
          <figure className="mt-3">
            <div className="post-hero relative overflow-hidden rounded-[var(--radius-photo)] bg-sand">
              <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width:1280px) 1232px, 94vw" className="object-cover" style={{ objectPosition: `${hero.focal[0] * 100}% ${hero.focal[1] * 100}%` }} />
            </div>
          </figure>
        </Container>
      </div>
      <Container className="py-4 md:py-3">
        <div className="post-grid">
          <div className="post-main">
            {toc.length > 1 ? <SubNav only="m" title="In this post" items={toc.map((t) => ({ id: t.id, label: t.text }))} className="mb-3" /> : null}
            <ArticleBody post={post} />
            <Band t="post" id="end" nested />
            <div className="mt-4 flex flex-col items-start gap-3 rounded-[var(--radius-panel)] bg-oat p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[.9375rem]">{post.cta.text}</p>
              <div className="flex flex-wrap gap-2">
                {post.cta.href ? <ButtonLink size="compact" href={post.cta.href} variant="ghost">{ctaLabel}</ButtonLink> : null}
                <WhatsAppLink text={post.cta.message} />
              </div>
            </div>
            <SourceList sources={post.sources} />
            <PhotoCredits images={post.images} />
          </div>
          <aside className="post-aside" aria-label="More about this post">
            {toc.length > 1 ? <SubNav only="d" title="In this post" items={toc.map((t) => ({ id: t.id, label: t.text }))} className="rounded-[var(--radius-panel)] bg-oat p-3" /> : null}
            {animals.length ? (
              <section aria-labelledby="story-animals" className="rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm md:p-4">
                <h2 id="story-animals" className="text-[.9375rem]">Shop the animals in this post</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {animals.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/shop/${a.slug}`} data-track="journal_animal" className="inline-flex min-h-11 items-center gap-1 rounded-full bg-bone px-4 font-semibold text-baobab shadow-clay-sm">
                        {a.name}<Icon name="arrow" size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <section aria-labelledby="share-post" className="rounded-[var(--radius-panel)] bg-oat p-3 md:p-4">
              <h2 id="share-post" className="text-[.9375rem]">Share this post</h2>
              <div className="mt-2"><WhatsAppLink text={`${post.title} ${base}/journal/${post.slug}`} label="Send on WhatsApp" variant="ghost" size="compact" /></div>
            </section>
            {extra.length ? (
              <section aria-labelledby="keep-going" className="text-[.9375rem]">
                <h2 id="keep-going" className="text-[.9375rem]">Helpful pages</h2>
                <ul className="mt-1 flex flex-wrap gap-x-4">
                  {extra.map((l) => <li key={l.href}><Link href={l.href} className="hit-y inline-flex min-h-9 items-center text-terracotta-deep underline underline-offset-4">{l.label}</Link></li>)}
                </ul>
              </section>
            ) : null}
            <CtaBand eyebrow="Make it yours" title="Make an animal like this one"
              text="Plan a custom animal in the Studio. A person replies on WhatsApp with what is possible."
              primary={{ label: "Start your brief", href: "/custom/studio?src=journal", track: "journal_studio" }} />
          </aside>
        </div>
        {related.length ? (
          <section aria-labelledby="more" className="mt-7">
            <h2 id="more" className="mb-3 text-display-md">More in {pillarLabel(post.pillar)}</h2>
            <ContentGrid items={related.map(postCard)} />
          </section>
        ) : null}
        <nav aria-label="Next and previous posts" className="mt-5 grid gap-2 sm:grid-cols-2">
          {older ? <Link href={`/journal/${older.slug}`} rel="prev" className="hit-y rounded-[var(--radius-card)] bg-sand p-3 text-[.9375rem]"><span className="eyebrow block">Previous post</span><span className="font-semibold text-baobab">{older.title}</span></Link> : <span />}
          {newer ? <Link href={`/journal/${newer.slug}`} rel="next" className="hit-y rounded-[var(--radius-card)] bg-sand p-3 text-[.9375rem] sm:text-right"><span className="eyebrow block">Next post</span><span className="font-semibold text-baobab">{newer.title}</span></Link> : <span />}
        </nav>
        <div className="mt-3"><ButtonLink href="/journal" variant="ghost">All posts</ButtonLink></div>
      </Container>
      </FxPage>
    </HandScope>
  );
}
