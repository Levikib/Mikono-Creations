import type { Metadata } from "next";
import Image from "@/components/Img";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { HeroStage } from "@/components/HeroStage";
import { HerdDeck, type DeckItem } from "@/components/HerdDeck";
import { Icon, type IconName } from "@/components/Icon";
import { CardGrid, FeatureCard, LinkCard, PromoBand, TierCard } from "@/components/card/Card";
import type { Tone } from "@/lib/cardTone";
import { MomentsGallery } from "@/components/MomentsGallery";
import { CategoryCircles } from "@/components/CategoryCircles";
import { Section, SectionHeader } from "@/components/Section";
import { Container } from "@/components/Container";
import { homePhotos, moments } from "@/data/home";
import { allProducts, bySlug, categories, categoryByKey, heroImage, type CategoryKey } from "@/lib/catalogue";
import { sizeRange } from "@/components/ProductCard";
import { outlets, site } from "@/lib/site";
import { blurFor } from "@/lib/imageBlur";
import { pageMetadata } from "@/lib/pageMeta";
import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { WelcomeLane } from "@/components/fx/WelcomeLane";
import "./home.css";

// Each product photo appears once on this page (npm run qa:media). The hero cutouts are made from the lion, rabbit and giraffe
// photos, so those three stay out of the circles and the deck.
const circleProduct: Record<CategoryKey, string> = {
  safari: "rhino", domestic: "cat", more: "turtle", "wall-art": "unicorn-wall-head", dolls: "dress-doll",
};
const herd = ["elephant", "zebra", "hippo", "monkey", "octopus", "dog"];

const ways: { tone: Tone; icon: IconName; tag: string; num: string; title: string; text: string; facts: string[]; cta: string; href: string; feat?: boolean }[] = [
  { tone: "amber", icon: "giraffe", tag: "Shop", num: "01", title: "Ready to go", text: "Pick an animal and a size from the shop, then ask for the price on WhatsApp.", facts: ["Small to Extra large", "Made in Nairobi"], cta: "Shop the animals", href: "/shop" },
  { tone: "terracotta", icon: "hook", tag: "Custom", num: "02", title: "Make it yours", text: "Tell us the animal, colours and size you have in mind. A person replies on WhatsApp.", facts: ["Your colours", "Your size"], cta: "Start a custom order", href: "/custom", feat: true },
  { tone: "olive", icon: "people", tag: "Trade", num: "03", title: "For many", text: "Lodges, shops, schools and organisations can ask for a price list or a quote.", facts: ["Price list", "Sample pack"], cta: "Wholesale and groups", href: "/wholesale" },
];

const facts: { tone: Tone; icon: IconName; tag: string; title: string; text: string; href: string; cta: string }[] = [
  { tone: "slate", icon: "recycle", tag: "Yarn", title: "Recycled acrylic yarn", text: "Made from yarn that already exists.", href: "/safety", cta: "Materials" },
  { tone: "slate", icon: "shield", tag: "Build", title: "Nothing detachable", text: "On our plain animals.", href: "/safety", cta: "Safety" },
  { tone: "baobab", icon: "pin", tag: "Place", title: "Made in Nairobi", text: "Handmade in Kenya.", href: "/story", cta: "Our story" },
  { tone: "baobab", icon: "heart", tag: "People", title: "25+ women supported", text: "Through this work.", href: "/impact", cta: "Our impact" },
];

const homeTitle = `${site.name} | ${site.tagline}`;
export const metadata: Metadata = {
  ...pageMetadata({ title: homeTitle, description: site.description, path: "/", ogTitle: homeTitle }),
  title: { absolute: homeTitle },
};

export default function Home() {
  const count = allProducts().length;
  const deck: DeckItem[] = herd.flatMap((slug) => {
    const p = bySlug(slug);
    const h = p ? heroImage(p) : null;
    if (!p || !h) return [];
    return [{
      href: `/shop/${p.slug}`, title: p.name, category: categoryByKey(p.category).label,
      meta: `${p.colourways.length} ${p.colourways.length === 1 ? "colour" : "colours"} · ${sizeRange(p.sizes)}`,
      image: { src: h.image.src, alt: h.image.alt, focal: h.image.focal },
    }];
  });

  return (
    <FxPage t="home">
      {/* ---- Hero ---- */}
      <section aria-labelledby="hero" className="overflow-x-clip pb-3 pt-1 md:pb-6 md:pt-2">
        <Container className="grid items-center gap-3 md:grid-cols-[1.05fr_1fr] md:gap-8">
          <div className="flex flex-col gap-2 md:gap-3">
            <p className="eyebrow">Mikono Creations</p>
            <h1 id="hero" className="text-display-xl">Crocheted animals, made by hand in Nairobi</h1>
            <p className="max-w-[46ch] text-base text-stone">
              Safari and domestic animals crocheted from recycled acrylic yarn. Pick one, then ask for the price on WhatsApp.
            </p>
            <div className="mt-1 grid grid-cols-2 gap-2 sm:flex">
              <ButtonLink href="/shop" size="large" className="!px-3 sm:!px-6">Shop the animals</ButtonLink>
              <ButtonLink href="/custom" variant="secondary" size="large" className="!px-3 sm:!px-6">Make it yours</ButtonLink>
            </div>
            <WelcomeLane />
          </div>
          <div className="hero-wrap">
            <HeroStage className="hero-stage">
              <div className="hero-orb" aria-hidden="true" />
              {/* Sticker cutouts of three real animals (public/cutouts), already carrying their white edge. */}
              {/* eslint-disable @next/next/no-img-element */}
              <div className="hero-clip">
                <img className="cut cut-giraffe" src="/cutouts/giraffe.webp" width="294" height="630" alt="Crocheted yellow giraffe with brown spots, head and neck" decoding="async" />
                <img className="cut cut-rabbit" src="/cutouts/rabbit.webp" width="340" height="564" alt="Brown crocheted rabbit in a red and teal vest" decoding="async" />
                <img className="cut cut-lion" src="/cutouts/lion.webp" width="470" height="610" alt="Crocheted lion with a long brown yarn mane" fetchPriority="high" />
              </div>
              {/* eslint-enable @next/next/no-img-element */}
            </HeroStage>
            {/* Phones: a row below the stage so nothing covers the lion. From 1024 px the chips float in the top corners, clear of the animals. */}
            <div className="hero-chips">
              <div className="hero-chip hero-chip-a"><span className="ico"><Icon name="hands" size={20} duo /></span><span><small>Made by</small><b>25+ women, Nairobi</b></span></div>
              <div className="hero-chip hero-chip-b"><span className="ico"><Icon name="yarn" size={20} duo /></span><span><small>Yarn</small><b>Recycled yarn</b></span></div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- Categories ---- */}
      <Section compact labelledBy="cats" className="!pt-1">
        <SectionHeader id="cats" title="Shop by kind of animal" ledeFrom="md" lede={`${count} crocheted pieces: safari, domestic and more animals, plus wall art and dolls.`} />
        <CategoryCircles items={categories.map((c) => {
          const h = heroImage(bySlug(circleProduct[c.key])!);
          return { label: c.label, href: `/shop/${c.slug}`, image: h ? { src: h.image.src, alt: "" } : undefined };
        })} />
      </Section>

      {/* ---- Not sure where to start ---- */}
      <section aria-labelledby="unsure" className="pb-3 md:pb-5">
        <Container>
          <div className="clay-sm flex flex-col gap-1 p-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <div>
              <h2 id="unsure" className="font-display text-[.9375rem] font-bold leading-tight tracking-[-.03em] text-baobab md:text-base">Not sure which one?</h2>
              <p className="text-base text-stone">Find a gift in 5 questions, or check which size suits.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
              <ButtonLink prefetch={false} href="/gifts/finder?src=home" data-track="home_gift_finder" size="compact">Find a gift</ButtonLink>
              <Link prefetch={false} href="/size-finder?src=home" data-track="home_size_finder" className="hit-y inline-flex min-h-8 items-center px-1 font-semibold text-terracotta-deep underline underline-offset-4">Find your size</Link>
              <Link prefetch={false} href="/build-a-family?src=home" data-track="home_family" className="hit-y inline-flex min-h-8 items-center px-1 font-semibold text-terracotta-deep underline underline-offset-4">Build a safari family</Link>
            </div>
          </div>
        </Container>
      </section>

      <Band t="home" id="grove" />

      {/* ---- The herd ---- */}
      <Section tone="oat" compact labelledBy="herd">
        <SectionHeader id="herd" title="Meet the herd"
          action={<Link href="/shop" className="hit-y inline-flex min-h-8 items-center gap-1 font-semibold text-terracotta-deep">All animals<Icon name="arrow" size={16} /></Link>} />
        <HerdDeck items={deck} />
      </Section>

      <Band t="home" id="savanna" />

      {/* ---- Three ways ---- */}
      <Section compact labelledBy="ways">
        <SectionHeader id="ways" title="Three ways to take one home" />
        <CardGrid kind="tiers">
          {ways.map((w) => (
            <TierCard key={w.title} tone={w.tone} icon={w.icon} tag={w.tag} num={w.num} title={w.title} text={w.text} facts={w.facts}
              cta={{ label: w.cta, href: w.href }} feat={w.feat} />
          ))}
        </CardGrid>
      </Section>

      {/* ---- What goes into every animal ---- */}
      <Section tone="oat" compact labelledBy="goes">
        <SectionHeader id="goes" eyebrow="Materials and people" title="What goes into every animal" />
        <CardGrid kind="four">
          {facts.map((f) => (
            <FeatureCard key={f.title} tone={f.tone} icon={f.icon} tag={f.tag} title={f.title} text={f.text} cta={{ label: f.cta, href: f.href }} />
          ))}
        </CardGrid>
      </Section>

      <Band t="home" id="pets" />

      {/* ---- Makers and story ---- */}
      <Section compact labelledBy="story">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_1.05fr] md:gap-6">
          <figure className="clay-sm relative m-0 p-1.5 md:order-2 md:max-w-[460px] md:justify-self-end">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-photo)] bg-sand md:aspect-[16/10]">
              <Image src={homePhotos.maker.src} alt={homePhotos.maker.alt} fill sizes="(min-width:768px) 460px, 92vw" placeholder={blurFor(homePhotos.maker.src) ? "blur" : "empty"} blurDataURL={blurFor(homePhotos.maker.src)} className="object-cover" />
            </div>
          </figure>
          <div className="max-w-[56ch]">
            <p className="eyebrow">The makers</p>
            <h2 id="story" className="mt-1 text-display-lg">Mikono means hands</h2>
            <p className="mt-1 text-base text-stone">Mikono is the Swahili word for hands. Mikono Creations was founded in {site.founded} in Nairobi by {site.founder}, and is built on craft and on work for women.</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3">
              <ButtonLink href="/story" variant="secondary" size="compact">Read our story</ButtonLink>
              <Link href="/makers" className="hit-y inline-flex min-h-8 items-center gap-1 font-semibold text-terracotta-deep">Meet the makers<Icon name="arrow" size={16} /></Link>
            </div>
          </div>
        </div>
      </Section>

      <Band t="home" id="workshop" />

      {/* ---- Moments ---- */}
      <Section tone="oat" compact labelledBy="moments">
        <SectionHeader id="moments" title="Captured moments" ledeFrom="md" lede="Markets, workshops and shelves where our animals have been."
          action={<Link href="/gallery" className="hit-y inline-flex min-h-8 items-center gap-1 font-semibold text-terracotta-deep">Open the gallery<Icon name="arrow" size={16} /></Link>} />
        <MomentsGallery items={moments} />
      </Section>

      {/* ---- Outlets ---- */}
      <Section compact labelledBy="outlets">
        <SectionHeader id="outlets" title="Where to buy in Nairobi" lede="Find our crocheted animals at these seven outlets, or ask to stock them in yours." />
        <CardGrid kind="link">
          {outlets.map((o) => (
            <LinkCard key={o.name} tone="olive" icon="pin" title={o.name} text={o.place} cardType="outlet"
              cta={{ label: `Ask about ${o.name}`, href: `/stockists` }} />
          ))}
          <LinkCard tone="olive" icon="store" title="Stock our animals" text="Wholesale enquiries" cardType="outlet" cta={{ label: "Wholesale enquiries", href: "/wholesale" }} />
        </CardGrid>
      </Section>

      <Band t="home" id="market" />

      {/* ---- Closing band ---- */}
      <section aria-labelledby="idea" className="pb-4 md:pb-8">
        <Container>
          <PromoBand id="idea" tone="terracotta" tag="Custom orders" title="Got an idea that fits here?"
            text="A colour, an animal or a tag you have in mind? Plan it in the Studio and a person replies on WhatsApp with what is possible."
            primary={{ label: "Start your brief", href: "/custom/studio?src=home", track: "home_studio" }} />
        </Container>
      </section>
    </FxPage>
  );
}
