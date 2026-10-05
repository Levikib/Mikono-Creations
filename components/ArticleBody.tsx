import Image from "@/components/Img";
import type { JournalPost, PostImage } from "@/content/journal";
import { cx } from "@/lib/cx";

const focal = (i: PostImage) => `${i.focal[0] * 100}% ${i.focal[1] * 100}%`;

export const headingId = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

/** Renders a journal post body: headings, lists, notes and the three in-body images with their captions. */
export function ArticleBody({ post }: { post: JournalPost }) {
  const img = (slot: string) => post.images.find((i) => i.slot === slot);
  return (
    <div className="post-body max-w-[75ch] text-[.9375rem] leading-[1.7] text-charcoal">
      {post.blocks.map((b, i) => {
        if (b.t === "p") return <p key={i} className="mt-4 first:mt-0">{b.text}</p>;
        if (b.t === "h") return <h2 key={i} id={headingId(b.text)} className="mt-6 scroll-mt-24 text-display-md">{b.text}</h2>;
        if (b.t === "ul") return <ul key={i} className="mt-4 grid list-disc gap-2 pl-6 marker:text-terracotta-deep">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
        if (b.t === "ol") return <ol key={i} className="mt-4 grid list-decimal gap-2 pl-6 marker:font-semibold marker:text-terracotta-deep">{b.items.map((it) => <li key={it}>{it}</li>)}</ol>;
        if (b.t === "note") return <p key={i} className="mt-4 rounded-[var(--radius-card)] bg-ochre-tint p-3 text-base text-charcoal">{b.text}</p>;
        const im = img(b.slot);
        if (!im) return null;
        const wide = im.w >= im.h;
        return (
          <figure key={i} className={cx("my-5", !wide && "mx-auto max-w-[360px]")}>
            <div className={cx("relative overflow-hidden rounded-[var(--radius-photo)] bg-sand", wide ? "aspect-[3/2]" : "aspect-[4/5]")}>
              <Image src={im.src} alt={im.alt} fill sizes={wide ? "(min-width:1024px) 780px, (min-width:768px) 680px, 94vw" : "(min-width:768px) 360px, 80vw"} className="object-cover" style={{ objectPosition: focal(im) }} />
            </div>
            {im.caption ? <figcaption className="mt-2 text-[.8125rem] leading-snug text-stone">{im.caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}

const host = (u: string) => { try { const x = new URL(u); const t = `${x.hostname.replace(/^www\./, "")}${x.pathname === "/" ? "" : x.pathname}`; return t.length > 60 ? `${t.slice(0, 57)}...` : t; } catch { return u; } };

/** Pages behind the facts in a post. */
export function SourceList({ sources }: { sources: string[] }) {
  if (!sources.length) return null;
  return (
    <section aria-labelledby="sources" className="mt-6 max-w-[75ch]">
      <h2 id="sources" className="text-[.9375rem]">Sources</h2>
      <ul className="mt-1 grid gap-0.5 text-[.8125rem] text-stone">
        {sources.map((s) => (
          <li key={s}><a href={s} target="_blank" rel="noopener noreferrer" className="hit-y inline-flex min-h-8 items-center break-all text-terracotta-deep underline underline-offset-4">{host(s)}<span className="sr-only"> (opens in a new tab)</span></a></li>
        ))}
      </ul>
    </section>
  );
}

/** One small line per photo source: photographer, site and licence. Mikono photos are grouped. */
export function PhotoCredits({ images }: { images: PostImage[] }) {
  const own = images.some((i) => !i.creditUrl);
  const other = [...new Map(images.filter((i) => i.creditUrl).map((i) => [i.creditUrl, i])).values()];
  return (
    <p className="mt-4 max-w-[75ch] text-[.75rem] leading-snug text-stone">
      <span className="font-semibold">Photo credits: </span>
      {own ? <>Mikono Creations{other.length ? "; " : ""}</> : null}
      {other.map((i, k) => (
        <span key={i.creditUrl}>{k ? "; " : ""}<a href={i.creditUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{i.credit.replace(/^Photo: /, "")}</a></span>
      ))}.
    </p>
  );
}
