import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { Container } from "@/components/Container";
import { Section, SectionHeader } from "@/components/Section";
import { Button, ButtonLink } from "@/components/Button";
import { Chip, SizeChip } from "@/components/Chip";
import { ColourSwatch } from "@/components/ColourSwatch";
import { Badge } from "@/components/Badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Accordion } from "@/components/Accordion";
import { Icon, iconNames } from "@/components/Icon";
import { ProductGrid, type ProductCardData } from "@/components/ProductCard";
import { ContentGrid, type ContentCardData } from "@/components/ContentCard";
import { TrustStrip } from "@/components/TrustStrip";
import { StatsBand } from "@/components/StatsBand";
import { CategoryCircles } from "@/components/CategoryCircles";
import { Polaroid, TapedPhoto } from "@/components/Polaroid";
import { KineticHeading } from "@/components/KineticHeading";
import { WaveDivider } from "@/components/WaveDivider";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { Toast } from "@/components/Toast";
import { Bento, BentoTile } from "@/components/Bento";
import { categories } from "@/lib/site";
import { tokens } from "./tokens";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

// Deliberately unequal titles and size chip counts to prove uniform cards.
const products: ProductCardData[] = [
  { href: "#a", title: "Elephant", meta: "Elephant, grey", sizes: ["S"] },
  { href: "#b", title: "Giraffe with a very long name that keeps going across several lines of the card", meta: "Giraffe, ochre and a second colour name that is long", sizes: ["S", "M", "L", "XL"] },
  { href: "#c", title: "Lion", meta: "Lion, sand", sizes: ["M", "L"] },
  { href: "#d", title: "Zebra in charcoal and bone stripes", meta: "Zebra", sizes: ["S", "M", "L"] },
  { href: "#e", title: "Rhino", meta: "Rhino, grey", sizes: ["XL"], tag: "New" },
  { href: "#f", title: "Hippo with a wide smile and soft ears for small hands to hold", meta: "Hippo, oat", sizes: ["S", "M", "L", "XL"] },
  { href: "#g", title: "Dog", meta: "Dog, brown", sizes: [] },
  { href: "#h", title: "Monkey", meta: "Monkey, terracotta", sizes: ["M", "XL"] },
];

const stories: ContentCardData[] = [
  { href: "#j1", kind: "journal", tag: "Care", title: "A short title", excerpt: "One short line.", meta: "Placeholder date" },
  { href: "#j2", kind: "journal", tag: "Play and learning", title: "A much longer journal title that will need two lines and then more than two lines to prove the clamp", excerpt: "A much longer excerpt that runs on for many words so that it has to be clamped to three lines no matter how long the writer makes it, and the card must not grow.", meta: "Placeholder date" },
  { href: "#p1", kind: "project", tag: "Project", title: "Project title", excerpt: "Short summary.", meta: "Place" },
  { href: "#p2", kind: "project", tag: "Project with a longer tag name that truncates", title: "A longer project title that wraps onto a second line and keeps going past it", excerpt: "A long summary that continues for several lines so the clamp has to cut it off cleanly at three lines.", meta: "A long place name that truncates" },
];

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Section id={id} labelledBy={`${id}-h`} className="border-b border-sand">
      <SectionHeader id={`${id}-h`} title={title} />
      {children}
    </Section>
  );
}

export default function StyleGuide() {
  if (env.siteEnv === "production") notFound();
  return (
    <div className="hand-scope">
      <Container className="py-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Style guide" }]} />
        <h1 className="mt-4 text-display-lg">Style guide</h1>
        <p className="mt-2 max-w-[62ch] text-stone">Preview only. Not indexed, not in the sitemap, and hidden when the site environment is production.</p>
      </Container>

      <Block id="palette" title="Palette">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
          {tokens.map((t) => (
            <li key={t.name} className="overflow-hidden rounded-2xl bg-bone shadow-clay-sm">
              <div className="h-11" style={{ backgroundColor: t.hex }} />
              <p className="px-3 pt-2 text-base font-semibold">{t.name}</p>
              <p className="px-3 pb-2 text-base text-stone">{t.hex}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="type" title="Type">
        <p className="text-display-xl font-display">Display XL</p>
        <p className="text-display-lg font-display">Display large</p>
        <p className="text-display-md font-display">Display medium</p>
        <p className="mt-3 text-[1.1875rem]">Lead text in Figtree at 19px.</p>
        <p>Body text in Figtree at 17px. KES prices use tabular numbers.</p>
        <p className="text-base text-stone">Small text at 16px, the minimum anywhere on the site.</p>
        <p className="font-hand text-[1.375rem] font-semibold">Hand lettering, story pages only</p>
      </Block>

      <Block id="buttons" title="Buttons, chips, badges">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="whatsapp"><Icon name="whatsapp" size={22} />WhatsApp</Button>
          <Button disabled>Disabled</Button>
          <ButtonLink href="#" size="compact">Compact link</ButtonLink>
          <ButtonLink href="#" size="large">Large link</ButtonLink>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Chip>Safari</Chip><Chip tone="oat">Domestic</Chip><Chip tone="outline">Outline</Chip>
          <SizeChip size="S" /><SizeChip size="M" selected /><SizeChip size="L" /><SizeChip size="XL" />
          <Badge tone="new">New</Badge><Badge tone="info" icon="info">Info</Badge>
          <Badge tone="success" icon="check">Ready</Badge><Badge tone="error" icon="info">Unavailable</Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <ColourSwatch name="Grey" hex="#8E8E8E" selected />
          <ColourSwatch name="Sage, sampled hex" hex="#8A9A6B" />
          <ColourSwatch name="No colour supplied" />
        </div>
      </Block>

      <Block id="nav" title="Breadcrumb and accordion">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Safari animals" }]} />
        <div className="mt-6 max-w-2xl">
          <Accordion items={[
            { id: "a1", title: "What is it made from?", content: "Recycled acrylic yarn, crocheted by hand in Nairobi." },
            { id: "a2", title: "Is there any plastic?", content: "Our plain crocheted animals have zero plastic and nothing detachable." },
          ]} />
        </div>
      </Block>

      <Block id="icons" title="Icons">
        <ul className="flex flex-wrap gap-4 text-baobab">
          {iconNames.map((n) => (
            <li key={n} className="flex w-24 flex-col items-center gap-1 text-center">
              <Icon name={n} size={32} /><span className="text-base">{n}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="surfaces" title="Surfaces and shapes">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="clay p-6">clay</div>
          <div className="clay-sm p-6">clay-sm</div>
          <div className="clay-dark rounded-[var(--radius-card)] p-6 text-bone">clay-dark</div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {["a", "b", "c", "d", "e"].map((b) => (
            <div key={b} className={`blob-${b} flex aspect-square items-center justify-center bg-sand`}>blob-{b}</div>
          ))}
        </div>
        <div className="mt-8 text-oat"><WaveDivider /></div>
        <div className="-mt-px text-sand"><WaveDivider variant="hills" /></div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="paper-grain torn-bottom p-6 pb-10">torn-bottom paper</div>
          <div className="paper-grain torn-top p-6 pt-10">torn-top paper</div>
          <div className="kitenge rounded-2xl p-6">kitenge pattern</div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3">
          <Polaroid caption="Polaroid" tilt={-2} />
          <Polaroid caption="Tilted" tilt={1.5} />
          <div className="col-span-2 md:col-span-1"><TapedPhoto /></div>
        </div>
      </Block>

      <Block id="kinetic" title="Kinetic heading">
        <KineticHeading text="Made by many hands" accentIndex={2} className="text-display-lg" />
      </Block>

      <Block id="bento" title="Bento grid">
        <Bento>
          <BentoTile size="2x2">2x2</BentoTile>
          <BentoTile>1x1</BentoTile>
          <BentoTile>1x1</BentoTile>
          <BentoTile size="2x1">2x1</BentoTile>
        </Bento>
      </Block>

      <Block id="trust" title="Trust strip">
        <TrustStrip />
      </Block>
      <StatsBand stats={[{ value: "25+", label: "women supported" }]} />

      <Block id="circles" title="Category circles">
        <CategoryCircles items={categories} />
      </Block>

      <Block id="products" title="Uniform product cards (8 cards, unequal content)">
        <ProductGrid items={products} />
      </Block>

      <Block id="content" title="Uniform content cards">
        <ContentGrid items={stories} />
      </Block>

      <Block id="feedback" title="Hero, empty state, toast">
        <div className="mb-8 overflow-hidden rounded-[var(--radius-panel)]">
          <PageHero eyebrow="Eyebrow" title="Page hero title" lede="One or two plain lines of support copy." actions={<ButtonLink href="#">Primary action</ButtonLink>} />
        </div>
        <EmptyState title="Nothing here yet" text="Plain, honest empty state." action={<ButtonLink href="#">Back to shop</ButtonLink>} />
        <div className="on-dark mt-6 grid max-w-md gap-3">
          <Toast message="Added to your order list." variant="success" />
          <Toast message="Please check your phone number." variant="error" />
          <Toast message="Delivery is confirmed on WhatsApp." />
        </div>
      </Block>
    </div>
  );
}
