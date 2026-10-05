import type { ContentCardData } from "@/components/ContentCard";
import { pillarLabel, type JournalPost } from "@/content/journal";
import type { Project } from "@/content/projects";
import { photos } from "@/content/photos";

export const postCard = (p: JournalPost): ContentCardData => {
  const h = p.images[0];
  return {
    href: `/journal/${p.slug}`, title: p.title, excerpt: p.description, tag: pillarLabel(p.pillar), kind: "journal",
    meta: p.readTime, image: { src: h.src, alt: h.alt, focal: h.focal },
  };
};

export const projectCard = (p: Project): ContentCardData => {
  const ph = photos[p.cover];
  return {
    href: `/projects/${p.slug}`, title: p.title, excerpt: p.summary, tag: p.kind, kind: "project",
    meta: "Photo story", image: { src: ph.src, alt: ph.alt, focal: ph.focal },
  };
};
