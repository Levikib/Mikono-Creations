import { StoryCard, CardGrid } from "./card/Card";
import type { PhotoSrc } from "./Polaroid";
import type { Tone } from "@/lib/cardTone";

export type ContentCardData = {
  href: string;
  title: string;
  excerpt: string;
  /** Date and read time, or place for a project. One line. */
  meta: string;
  kind: "journal" | "project";
  image?: PhotoSrc;
  tag?: string;
};

/** Journal tone is slate (reading and learning), projects are baobab (people and craft). */
const toneOf = (k: ContentCardData["kind"]): Tone => (k === "journal" ? "slate" : "baobab");

/** Journal and project cards are the unified StoryCard: 16:10 photo with a lower title scrim, a one line foot. Rows on phones. */
export function ContentCard({ item, num }: { item: ContentCardData; num?: string }) {
  return (
    <StoryCard tone={toneOf(item.kind)} href={item.href} title={item.title} excerpt={item.excerpt} meta={item.meta} image={item.image}
      tag={item.tag} num={num} kind={item.kind} cta={item.kind === "journal" ? "Read" : "Open"} />
  );
}

export function ContentGrid({ items }: { items: readonly ContentCardData[] }) {
  return (
    <CardGrid rowMobile className={items.length === 2 ? "mk-fill-2" : items.length === 3 ? "mk-fill-3" : undefined}>
      {items.map((it, i) => <ContentCard key={it.href} item={it} num={String(i + 1).padStart(2, "0")} />)}
    </CardGrid>
  );
}
