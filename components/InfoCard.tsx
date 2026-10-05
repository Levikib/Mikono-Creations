import type { ReactNode } from "react";
import { FeatureCard, StoryCard, CardGrid } from "./card/Card";
import type { IconName } from "./Icon";
import { photos, type PhotoId } from "@/content/photos";
import { toneForPath, type Tone } from "@/lib/cardTone";

export type InfoCardData = {
  title: string;
  /** One short tag. */
  eyebrow?: string;
  text: string;
  cta: { label: string; href: string; external?: boolean };
  image?: PhotoId;
  icon?: IconName;
  tone?: Tone;
};

/** Info card: a StoryCard when it has a photo, a FeatureCard otherwise. Tone follows the destination. */
export function InfoCard({ item }: { item: InfoCardData; level?: 2 | 3; tint?: number }) {
  const tone = item.tone ?? toneForPath(item.cta.href);
  if (item.image) {
    const ph = photos[item.image];
    return <StoryCard tone={tone} href={item.cta.href} title={item.title} excerpt={item.text} meta={item.eyebrow ?? ""} image={{ src: ph.src, alt: ph.alt, focal: ph.focal }} kind="info" cta={item.cta.label} />;
  }
  return <FeatureCard tone={tone} icon={item.icon ?? "hand"} tag={item.eyebrow} title={item.title} text={item.text} cta={item.cta} cardType="info" />;
}

export function InfoGrid({ items, children }: { items?: readonly InfoCardData[]; children?: ReactNode; level?: 2 | 3; cols?: 3 | 4 }) {
  return (
    <CardGrid kind="three" rowMobile>
      {items?.map((it) => <InfoCard key={it.title} item={it} />)}
      {children}
    </CardGrid>
  );
}
