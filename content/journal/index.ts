// The journal: 47 posts from four sources, normalised into one model.
//   legacy.ts            the first ten posts
//   ../journal-batch/*   part A (12), part B (12), part C (13)
// Images come from images.generated.json (scripts/build-blog-images.py reads picks.mjs). Every post has four: hero and inline-1 to inline-3.
import type { Block as LegacyBlock, Post as LegacyPost } from "./legacy";
import { posts as legacy } from "./legacy";
import { partA } from "../journal-batch/part-a";
import { postsPartB } from "../journal-batch/part-b";
import { postsC } from "../journal-batch/part-c";
import { photos } from "../photos";
import generated from "./images.generated.json";

export type Block = LegacyBlock;
export type Post = LegacyPost;

export type PillarId = "animals" | "play" | "sustainability" | "craft" | "makers" | "gifting" | "business";
export const pillars: { id: PillarId; label: string }[] = [
  { id: "animals", label: "Animals of Kenya" },
  { id: "play", label: "Parenting and play" },
  { id: "sustainability", label: "Sustainability" },
  { id: "craft", label: "Craft and process" },
  { id: "makers", label: "Makers and impact" },
  { id: "gifting", label: "Gifting and occasions" },
  { id: "business", label: "Business and partners" },
];
export const pillarLabel = (id: PillarId) => pillars.find((p) => p.id === id)?.label ?? id;

export type PostImage = {
  slot: "hero" | "inline-1" | "inline-2" | "inline-3";
  src: string; w: number; h: number; alt: string; caption: string;
  /** Focal point, 0 to 1, for frames that crop. */
  focal: [number, number];
  credit: string; creditUrl: string;
};

export type PostBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string }
  | { t: "image"; slot: "inline-1" | "inline-2" | "inline-3" };

export type JournalPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  minutes: number;
  tags: string[];
  pillar: PillarId;
  blocks: PostBlock[];
  images: PostImage[];
  links: { label: string; href: string }[];
  cta: { text: string; message: string; href?: string };
  sources: string[];
  related: string[];
};

const LEGACY_PILLAR: Record<string, PillarId> = {
  "what-mikono-means": "makers", "what-is-recycled-acrylic-yarn": "sustainability", "how-to-choose-a-size": "gifting",
  "how-to-clean-a-crocheted-animal": "craft", "the-safari-animals-we-make": "animals", "making-a-lion-mane": "craft",
  "from-yarn-to-giraffe": "craft", "how-ordering-on-whatsapp-works": "business", "why-wholesale": "business",
  "why-colours-differ-slightly": "craft",
};
const PART_PILLAR: Record<string, PillarId> = { A: "animals", B: "play", C: "sustainability", D: "craft", E: "makers" };
const C_PILLAR = (tag: string): PillarId => (tag === "Business" ? "business" : tag === "Custom orders" ? "business" : "gifting");

const focalOf = (src: string): [number, number] => {
  const ph = Object.values(photos).find((p) => p.src === src);
  return ph ? ph.focal : [0.5, 0.5];
};

const imagesOf = (slug: string): PostImage[] =>
  ((generated as Record<string, Omit<PostImage, "focal">[]>)[slug] ?? []).map((i) => ({
    slot: i.slot, src: i.src, w: i.w, h: i.h, alt: i.alt, caption: i.caption, credit: i.credit, creditUrl: i.creditUrl, focal: focalOf(i.src),
  }));

const INLINE = ["inline-1", "inline-2", "inline-3"] as const;

/** Turns photo and image markers into image blocks in slot order. Slots with no marker are placed after paragraphs, spread through the post. */
function placeImages(blocks: (PostBlock | { t: "photo" })[]): PostBlock[] {
  let n = 0;
  const out: PostBlock[] = [];
  for (const b of blocks) {
    if (b.t === "photo") { if (n < 3) out.push({ t: "image", slot: INLINE[n++] }); continue; }
    if (b.t === "image") { out.push(b); n++; continue; }
    out.push(b);
  }
  const placed = new Set(out.filter((b) => b.t === "image").map((b) => (b as { slot: string }).slot));
  const missing = INLINE.filter((s) => !placed.has(s));
  missing.forEach((slot, k) => {
    let at = Math.round(((k + 1) * out.length) / (missing.length + 1));
    while (at < out.length && out[at - 1]?.t !== "p") at++;
    out.splice(Math.min(at, out.length), 0, { t: "image", slot });
  });
  // Keep slot numbers in reading order so inline-1 always comes first.
  const order = out.filter((b) => b.t === "image") as { t: "image"; slot: (typeof INLINE)[number] }[];
  order.forEach((b, i) => { b.slot = INLINE[i]; });
  return out;
}

const textOf = (b: PostBlock): string => (b.t === "p" || b.t === "h" || b.t === "note" ? b.text : b.t === "ul" || b.t === "ol" ? b.items.join(" ") : "");
const minutesOf = (blocks: PostBlock[]) => Math.max(1, Math.round(blocks.map(textOf).join(" ").split(/\s+/).filter(Boolean).length / 200));

function norm(p: {
  slug: string; title: string; description: string; date: string; tags: string[]; pillar: PillarId; blocks: (PostBlock | { t: "photo" })[];
  links?: { label: string; href: string }[]; cta: JournalPost["cta"]; sources?: string[]; related?: string[];
}): JournalPost {
  const blocks = placeImages(p.blocks);
  const minutes = minutesOf(blocks);
  return {
    slug: p.slug, title: p.title, description: p.description, date: p.date, minutes, readTime: `${minutes} min read`, tags: p.tags, pillar: p.pillar,
    blocks, images: imagesOf(p.slug), links: p.links ?? [], cta: p.cta, sources: p.sources ?? [], related: p.related ?? [],
  };
}

const fromLegacy = legacy.map((p) => norm({ ...p, description: p.excerpt, tags: [p.tag], pillar: LEGACY_PILLAR[p.slug] ?? "craft", blocks: p.blocks as (PostBlock | { t: "photo" })[] }));
const fromA = partA.map((p) => norm({ ...p, pillar: PART_PILLAR[p.pillar] }));
const fromB = postsPartB.map((p) => norm({ ...p, description: p.description || p.excerpt, pillar: PART_PILLAR[p.pillar] }));
const fromC = postsC.map((p) => norm({ ...p, description: p.description || p.excerpt, pillar: C_PILLAR(p.tag) }));

/** All posts, newest first. */
export const posts: JournalPost[] = [...fromLegacy, ...fromA, ...fromB, ...fromC]
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const readMinutes = (p: JournalPost) => p.minutes;
export const wordCount = (p: JournalPost) => p.blocks.map(textOf).join(" ").split(/\s+/).filter(Boolean).length;
export const heroOf = (p: JournalPost) => p.images[0];

/** Three posts for the end of a post: same pillar first, then the nearest in date. */
export function relatedPosts(p: JournalPost, n = 3): JournalPost[] {
  const others = posts.filter((x) => x.slug !== p.slug);
  const same = others.filter((x) => x.pillar === p.pillar);
  const explicit = p.related.map((s) => others.find((x) => x.slug === s)).filter((x): x is JournalPost => !!x && x.pillar === p.pillar);
  const pool = [...new Map([...explicit, ...same, ...others].map((x) => [x.slug, x])).values()];
  return pool.slice(0, n);
}

/** Older and newer neighbours in date order. */
export function neighbours(p: JournalPost): { newer?: JournalPost; older?: JournalPost } {
  const i = posts.findIndex((x) => x.slug === p.slug);
  return { newer: i > 0 ? posts[i - 1] : undefined, older: i < posts.length - 1 ? posts[i + 1] : undefined };
}
