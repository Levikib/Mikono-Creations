import Image from "@/components/Img";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "./Container";
import { Breadcrumb } from "./Breadcrumb";
import { KineticHeading } from "./KineticHeading";
import { ButtonLink } from "./Button";
import { Icon } from "./Icon";
import { MomentCard } from "./card/Card";
import { cx } from "@/lib/cx";
import { whatsappUrl } from "@/lib/env";
import { blurFor } from "@/lib/imageBlur";
import { isLow, photos, type Photo, type PhotoId } from "@/content/photos";

const pos = (ph: Photo): CSSProperties => ({ objectPosition: `${ph.focal[0] * 100}% ${ph.focal[1] * 100}%` });

/** A photo inside a box that already has an aspect ratio. Never changes pixels. */
export function Pic({ id, sizes, priority, eager, className }: { id: PhotoId; sizes: string; priority?: boolean; eager?: boolean; className?: string }) {
  const ph = photos[id];
  // priority is for the page's LCP image only: preload, fetchPriority high and a blur placeholder. eager is for other images in the first view.
  return priority
    ? <Image src={ph.src} alt={ph.alt} fill preload fetchPriority="high" placeholder={blurFor(ph.src) ? "blur" : "empty"} blurDataURL={blurFor(ph.src)} sizes={sizes} className={cx("object-cover", className)} style={pos(ph)} />
    : <Image src={ph.src} alt={ph.alt} fill loading={eager ? "eager" : undefined} sizes={sizes} className={cx("object-cover", className)} style={pos(ph)} />;
}

/** Photo in a plain paper frame (no tape, no tilt). Low resolution sources should only be used with small widths. */
export function Taped({ id, ratio = "aspect-[4/3]", sizes = "(min-width:1024px) 400px, 90vw", className, caption, priority, eager }: {
  id: PhotoId; ratio?: string; tilt?: number; sizes?: string; className?: string; caption?: boolean; priority?: boolean; eager?: boolean;
}) {
  const ph = photos[id];
  return (
    <figure className={cx("clay-sm relative m-0 p-1.5", className, isLow(ph) && "!max-w-[240px]")}>
      <div className={cx("relative overflow-hidden rounded-[var(--radius-photo)] bg-sand", ratio)}>
        <Pic id={id} sizes={sizes} priority={priority} eager={eager} />
      </div>
      {caption ? <figcaption className="px-1.5 pb-0.5 pt-1.5 text-[.8125rem] leading-snug text-stone">{ph.caption}</figcaption> : null}
    </figure>
  );
}

/** Uniform square photo card with a caption: the unified MomentCard in the baobab (people and craft) tone. */
export function PolaroidCard({ id, caption, eager, sizes = "(min-width:1280px) 200px, (min-width:768px) 22vw, 34vw" }: {
  id: PhotoId; tilt?: number; caption?: string; sizes?: string; eager?: boolean;
}) {
  const ph = photos[id];
  return <MomentCard image={{ src: ph.card ?? ph.src, alt: ph.alt, focal: ph.card ? [0.5, 0.5] : ph.focal }} caption={caption ?? ph.caption} sizes={sizes} eager={eager} />;
}

export const tilts = [0, 0, 0, 0, 0, 0];

/** Compact photo mosaic for page headers: a clay stage with up to three framed photos. */
export function Collage({ a, b, c }: { a: PhotoId; b: PhotoId; c?: PhotoId }) {
  return (
    <div className="yarn relative mx-auto w-full max-w-[360px] rounded-[var(--radius-stage)] bg-oat p-2 shadow-clay md:p-2.5">
      <div className={cx("grid gap-2", c ? "grid-cols-[1.1fr_1fr]" : "grid-cols-2")}>
        <div className={cx("relative overflow-hidden rounded-[var(--radius-photo)] bg-sand", c ? "row-span-2 aspect-[4/5]" : "aspect-[4/5]")}>
          <Pic id={a} sizes="(min-width:768px) 240px, 50vw" priority />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] bg-sand">
          <Pic id={b} sizes="(min-width:768px) 200px, 40vw" eager />
        </div>
        {c ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] bg-sand">
            <Pic id={c} sizes="(min-width:768px) 200px, 40vw" eager />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Page header with breadcrumb, heading (kinetic optional), lede and a photo mosaic. */
export function ScrapHero({ crumbs, eyebrow, title, kinetic, accent, lede, actions, collage }: {
  crumbs: { label: string; href?: string }[]; eyebrow?: string; title: string; kinetic?: boolean; accent?: number;
  lede?: string; actions?: ReactNode; collage?: { a: PhotoId; b: PhotoId; c?: PhotoId };
}) {
  return (
    <div className="border-b border-[var(--hairline)]">
      <Container className={cx("grid items-center gap-3 pb-4 pt-0 md:gap-6 md:py-6", collage && "md:grid-cols-[1.2fr_.8fr]")}>
        <div>
          <Breadcrumb items={crumbs} />
          {eyebrow ? <p className="eyebrow mt-1">{eyebrow}</p> : null}
          {kinetic ? (
            <KineticHeading as="h1" text={title} accentIndex={accent} className="mt-1 text-display-lg" />
          ) : (
            <h1 className="mt-1 text-display-lg">{title}</h1>
          )}
          {lede ? <p className="mt-1.5 max-w-[54ch] text-base leading-[1.5] text-stone">{lede}</p> : null}
          {actions ? <div className="mt-3 flex flex-col gap-2 sm:flex-row">{actions}</div> : null}
        </div>
        {collage ? <Collage {...collage} /> : null}
      </Container>
    </div>
  );
}

/** Plain header for help, trade and legal pages. */
export function PlainHero({ crumbs, title, lede, note }: { crumbs: { label: string; href?: string }[]; title: string; lede?: string; note?: string }) {
  return (
    <div className="border-b border-[var(--hairline)]">
      <Container className="pb-3 pt-0 md:py-6">
        <Breadcrumb items={crumbs} />
        <h1 className="mt-1 text-display-lg">{title}</h1>
        {note ? <p className="mt-1.5 text-base text-stone">{note}</p> : null}
        {lede ? <p className="mt-1.5 max-w-[58ch] text-base leading-[1.5] text-stone">{lede}</p> : null}
      </Container>
    </div>
  );
}

/** Link that opens WhatsApp with a ready message, or the contact page when no number is set. */
export function WhatsAppLink({ text, label = "Ask on WhatsApp", variant = "whatsapp", size }: { text?: string; label?: string; variant?: "whatsapp" | "ghost" | "primary"; size?: "compact" | "default" | "large" }) {
  const url = whatsappUrl(text);
  return (
    <ButtonLink href={url ?? "/contact"} external={!!url} variant={variant} size={size}>
      <Icon name="whatsapp" size={18} />{label}
    </ButtonLink>
  );
}

/** Short note box for facts still being confirmed. */
export function PendingNote({ children, title = "Still being confirmed" }: { children: ReactNode; title?: string }) {
  return (
    <aside className="clay-well rounded-[var(--radius-card)] p-3">
      <p className="eyebrow">{title}</p>
      <div className="mt-0.5 text-body text-charcoal">{children}</div>
    </aside>
  );
}

export { isLow };

/** Retired divider. Draws nothing. */
export function WaveDividerBone() {
  return null;
}
