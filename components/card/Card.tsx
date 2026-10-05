import Image from "@/components/Img";
import Link from "next/link";
import { Children, type ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import { ImagePlaceholder, type PhotoSrc } from "../Polaroid";
import { cx } from "@/lib/cx";
import type { Tone } from "@/lib/cardTone";

/*
 * One Mikono card (strategy/14). Anatomy: head (gradient, pattern, photo or numeral), body (title and text), foot (one action,
 * pinned to the bottom). Variants swap the head only. Product and story photos are never tinted: only the frame around them is gradient.
 * Equal heights come from CardGrid (grid-auto-rows: 1fr) plus clamped text and fixed head heights.
 */

export type CardAction = { label: string; href: string; external?: boolean; track?: string };
export type CardPhoto = PhotoSrc & { fit?: "cover" | "contain"; multiply?: boolean };

export type GridKind = "default" | "shop" | "three" | "tiers" | "one" | "two" | "four" | "p3" | "link";

/** ul[data-card-group] with equal-height rows. Each child becomes an li. */
export function CardGrid({ children, kind = "default", rowMobile, className, label }: {
  children: ReactNode; kind?: GridKind; rowMobile?: boolean; className?: string; label?: string;
}) {
  const k = { default: "", shop: "mk-grid--shop", three: "mk-grid--3", tiers: "mk-grid--3 mk-grid--tiers", one: "mk-grid--1", two: "mk-grid--2", four: "mk-grid--4", p3: "mk-grid--p3", link: "mk-grid--link" }[kind];
  return (
    <ul data-card-group aria-label={label} className={cx("mk-grid", k, rowMobile && "mk-rowmobile", className)}>
      {Children.toArray(children).map((c, i) => <li key={i}>{c}</li>)}
    </ul>
  );
}

function ActionLink({ a, className, children }: { a: CardAction; className: string; children: ReactNode }) {
  const ext = a.external || /^(https?:|mailto:|tel:)/.test(a.href);
  const p = { "data-cta": true, "data-track": a.track, className } as const;
  return ext
    ? <a href={a.href} target="_blank" rel="noopener noreferrer" {...p}>{children}</a>
    : <Link href={a.href} prefetch={false} {...p}>{children}</Link>;
}

function Tag({ children, num }: { children: ReactNode; num?: string }) {
  return <span className="mk-tag">{num ? <i>{num}</i> : null}{children}</span>;
}

const Gem = ({ icon }: { icon: IconName }) => <span className="mk-gem"><Icon name={icon} size={20} /></span>;

const stretch = "mk-title";

/* ---------- PhotoCard: product ---------- */
export function PhotoCard({ tone = "amber", href, title, meta, tag, image, action, price, button, eager, sizes, cardType = "product", peek }: {
  peek?: { src: string; cy: number };
  tone?: Tone; href: string; title: string; meta?: string; tag?: string; image?: CardPhoto;
  /** One action. Shown as an icon chip when the card is narrow and as a labelled button when wide. */
  action?: CardAction; price?: string; eager?: boolean; sizes?: string; cardType?: string;
  /** A button instead of a link, for on-page actions such as adding to the order list. Narrow cards show a plus chip. */
  button?: { label: string; onClick: () => void; track?: string };
}) {
  const ext = action ? (action.external || /^https?:/.test(action.href)) : false;
  return (
    <article data-card={cardType} data-ratio="1/1" data-tone={tone} className="mk-card mk-card--photo" data-peek-src={peek?.src} data-peek-cy={peek?.cy}>
      <div data-media className="mk-head">
        <div className="mk-photo">
          {image ? (
            <Image src={image.src} alt={image.alt} fill sizes={sizes ?? "(min-width:1280px) 190px, (min-width:768px) 20vw, 29vw"}
              loading={eager ? "eager" : undefined} fetchPriority={eager ? "high" : undefined}
              className={cx(image.fit === "contain" ? "object-contain" : "object-cover", image.multiply && "mix-blend-multiply")}
              style={image.focal && image.fit !== "contain" ? { objectPosition: `${image.focal[0] * 100}% ${image.focal[1] * 100}%` } : undefined} />
          ) : <ImagePlaceholder />}
        </div>
        {tag ? <Tag>{tag}</Tag> : null}
      </div>
      <div className="mk-foot">
        <h3 className={stretch}><Link href={href} className="mk-stretch">{title}</Link></h3>
        <span className="mk-meta">{meta}</span>
        {price ? (
          <span data-cta data-price className="mk-cta price">{price}</span>
        ) : button ? (
          <button type="button" data-cta data-price data-track={button.track} onClick={button.onClick} className="mk-cta mk-cta--icon" aria-label={`${button.label}: ${title}`}>
            <span className="mk-cta__plus" aria-hidden="true">+</span><span className="mk-cta__t">{button.label}</span>
          </button>
        ) : action ? (
          <a data-cta data-price data-wa-track="card" data-item={href.replace("/shop/", "")} href={action.href}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mk-cta mk-cta--icon" aria-label={`${action.label}: ${title}`}>
            <Icon name="whatsapp" size={16} /><span className="mk-cta__t">{action.label}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

/* ---------- FeatureCard ---------- */
export function FeatureCard({ tone = "amber", icon, tag, num, title, text, cta, cardType = "feature" }: {
  tone?: Tone; icon: IconName; tag?: string; num?: string; title: string; text: string; cta?: CardAction; cardType?: string;
}) {
  return (
    <article data-card={cardType} data-tone={tone} className="mk-card mk-card--feature">
      <div className="mk-head">{tag ? <Tag>{tag}</Tag> : null}<Gem icon={icon} />{num ? <span className="mk-num" aria-hidden="true">{num}</span> : null}</div>
      <div className="mk-body"><h3 className="mk-title">{title}</h3><p className="mk-text">{text}</p></div>
      {cta ? (
        <div className="mk-foot">
          <ActionLink a={cta} className="mk-link">{cta.label}<Icon name="arrow" size={14} /></ActionLink>
        </div>
      ) : null}
    </article>
  );
}

/* ---------- TierCard: Three ways ---------- */
export function TierCard({ tone, icon, tag, num, title, text, facts, cta, feat }: {
  tone: Tone; icon: IconName; tag: string; num: string; title: string; text: string; facts?: string[]; cta: CardAction; feat?: boolean;
}) {
  return (
    <article data-card="tier" data-tone={tone} className={cx("mk-card mk-card--tier", feat && "is-feat")}>
      <div className="mk-head"><Tag>{tag}</Tag><span className="mk-num" aria-hidden="true">{num}</span><Gem icon={icon} /></div>
      <div className="mk-body">
        <h3 className="mk-title">{title}</h3>
        <p className="mk-text">{text}</p>
        {facts?.length ? <ul className="mk-facts">{facts.map((f) => <li key={f}>{f}</li>)}</ul> : null}
      </div>
      <div className="mk-foot">
        <ActionLink a={cta} className="mk-cta">{cta.label}<Icon name="arrow" size={14} /></ActionLink>
      </div>
    </article>
  );
}

/* ---------- StatCard: confirmed facts only ---------- */
export function StatCard({ tone = "baobab", tag, big, title, text, cta }: {
  tone?: Tone; tag?: string; big: string; title: string; text?: string; cta?: CardAction;
}) {
  return (
    <article data-card="stat" data-tone={tone} className="mk-card mk-card--stat">
      <div className="mk-head">{tag ? <Tag>{tag}</Tag> : null}<span className="mk-big">{big}</span><span className="mk-bead" /></div>
      <div className="mk-body"><h3 className="mk-title">{title}</h3>{text ? <p className="mk-text">{text}</p> : null}</div>
      {cta ? (
        <div className="mk-foot">
          <ActionLink a={cta} className="mk-link">{cta.label}<Icon name="arrow" size={14} /></ActionLink>
        </div>
      ) : null}
    </article>
  );
}

/* ---------- StoryCard: journal, projects ---------- */
export function StoryCard({ tone, href, title, excerpt, meta, image, tag, num, cta, kind }: {
  tone: Tone; href: string; title: string; excerpt: string; meta: string; image?: PhotoSrc; tag?: string; num?: string; cta: string; kind: "journal" | "project" | "info";
}) {
  return (
    <article data-card={kind} data-ratio="16/10" data-tone={tone} className="mk-card mk-card--story">
      <div data-media className="mk-head">
        <div className="mk-photo">
          {image ? (
            <Image src={image.src} alt={image.alt} fill sizes="(min-width:1280px) 300px, (min-width:640px) 30vw, 104px"
              className="object-cover" style={image.focal ? { objectPosition: `${image.focal[0] * 100}% ${image.focal[1] * 100}%` } : undefined} />
          ) : <ImagePlaceholder />}
        </div>
        <span className="mk-scrim" />
        {tag ? <Tag num={num}>{tag}</Tag> : null}
        <h3 className="mk-over"><Link href={href} className="mk-stretch">{title}</Link></h3>
      </div>
      <div className="mk-body" data-title={title}><p className="mk-text">{excerpt}</p></div>
      <div className="mk-foot"><span className="mk-meta">{meta}</span><span data-cta className="mk-link" aria-hidden="true">{cta}<Icon name="arrow" size={14} /></span></div>
      {/* Pointer target for the whole card (image, text, foot label). Last child, so it sits above everything; the titled link above is the one assistive tech reads. */}
      <Link href={href} prefetch={false} className="mk-hit" tabIndex={-1} aria-hidden="true" />
    </article>
  );
}

/* ---------- LinkCard: outlets, menu entries ---------- */
export function LinkCard({ tone = "olive", icon = "pin", title, text, cta, cardType = "link" }: {
  tone?: Tone; icon?: IconName; title: string; text: string; cta: CardAction; cardType?: string;
}) {
  return (
    <article data-card={cardType} data-tone={tone} className="mk-card mk-card--link">
      <div className="mk-head"><Gem icon={icon} /></div>
      <div className="mk-body">
        <h3 className="mk-title"><ActionLink a={cta} className="mk-stretch">{title}<span className="sr-only">: {cta.label}</span></ActionLink></h3>
        <p className="mk-text">{text}</p>
      </div>
      <div className="mk-foot" aria-hidden="true"><Icon name="arrow" size={16} /></div>
    </article>
  );
}

/* ---------- PromoBand ---------- */
export function PromoBand({ tone, tag, title, text, primary, secondary, id }: {
  tone: Tone; tag?: string; title: string; text: string; primary: CardAction; secondary?: CardAction; id?: string;
}) {
  return (
    <section aria-labelledby={id} data-card="band" data-tone={tone} className="mk-band">
      <div>
        {tag ? <Tag>{tag}</Tag> : null}
        <h2 id={id}>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="mk-acts">
        <ActionLink a={primary} className="mk-cta">{primary.label}<Icon name="arrow" size={14} /></ActionLink>
        {secondary ? <ActionLink a={secondary} className="mk-cta mk-cta--outline">{secondary.label}</ActionLink> : null}
      </div>
    </section>
  );
}

/* ---------- MomentCard: a real photo with a short caption and no action (gallery, makers, story) ---------- */
export function MomentCard({ tone = "baobab", image, caption, eager, sizes }: { tone?: Tone; image: PhotoSrc; caption: string; eager?: boolean; sizes?: string }) {
  return (
    <article data-card="polaroid" data-ratio="1/1" data-tone={tone} className="mk-card mk-card--photo mk-card--moment">
      <div data-media className="mk-head">
        <div className="mk-photo">
          <Image src={image.src} alt={image.alt} fill sizes={sizes ?? "(min-width:1280px) 190px, (min-width:768px) 20vw, 29vw"} loading={eager ? "eager" : undefined}
            className="object-cover" style={image.focal ? { objectPosition: `${image.focal[0] * 100}% ${image.focal[1] * 100}%` } : undefined} />
        </div>
      </div>
      <div className="mk-foot"><p className="mk-title">{caption}</p></div>
    </article>
  );
}
