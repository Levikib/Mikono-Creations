import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Icon, type IconName } from "@/components/Icon";
import { CardGrid, FeatureCard, LinkCard } from "@/components/card/Card";
import { JsonLd } from "@/components/JsonLd";
import { ProductPurchase, type GalleryItem } from "@/components/ProductPurchase";
import { ProductRail } from "@/components/ProductRail";
import { Section, SectionHeader } from "@/components/Section";
import { availabilityLabel, defaultAvailability, pricesConfirmed } from "@/data/facts";
import { claimsFor, copyFor } from "@/data/copy";
import { siteBaseUrl } from "@/lib/env";
import { formatKes } from "@/lib/pricing";
import { pageMetadata } from "@/lib/pageMeta";
import { toCard } from "@/lib/cards";
import {
  allProducts, bySlug, categoryByKey, galleryImages, heroImage, isNative, variantsOf, type MediaRef, type Product,
} from "@/lib/catalogue";
import { site } from "@/lib/site";
import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { hopSprite } from "@/lib/fx/species";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return allProducts().map((p) => ({ slug: p.slug }));
}

const metaTitle = (name: string) => (name.length <= 24 ? `${name}, crocheted by hand` : name);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  const copy = copyFor(p.slug);
  const hero = heroImage(p);
  return pageMetadata({
    title: metaTitle(p.name),
    description: `${copy.lead} From ${formatKes(p.priceKes ?? 0)}, by size. ${copy.claims === "none" ? "Handmade in Nairobi." : "Handmade in Nairobi from recycled acrylic yarn."}`,
    path: `/shop/${p.slug}`, og: `product-${p.slug}`, ogAlt: hero?.image.alt, ogTitle: `${p.name} | ${site.name}`,
  });
}

const toGallery = (i: MediaRef, kind: GalleryItem["kind"]): GalleryItem => ({
  src: i.src, alt: i.alt, width: i.width, height: i.height, focal: i.focal,
  multiply: i.bg === "white", lowRes: isNative(i), kind: kind === "colourway" && i.role === "group" ? "group" : kind,
});

const womenRow: { icon: IconName; title: string; text: string } = { icon: "heart", title: "25+ women supported", text: "Made by hand in Nairobi." };

const schemaAvailability: Partial<Record<string, string>> = {
  ready: "https://schema.org/InStock", limited: "https://schema.org/LimitedAvailability", unavailable: "https://schema.org/OutOfStock",
};

function productJsonLd(p: Product, lead: string) {
  const base = siteBaseUrl();
  const abs = (src: string) => `${base}${src}`;
  const hero = heroImage(p);
  const variants = variantsOf(p).map((v) => {
    const cw = p.colourways.find((c) => c.key === v.colourKey)!;
    const img = heroImage(p, v.colourKey);
    // One Offer per size, at that size's retail price (R12). Products without a price carry no offer.
    const unit = pricesConfirmed ? p.sizePrices?.[v.size] : undefined;
    const offer = typeof unit === "number"
      ? { offers: { "@type": "Offer", price: unit, priceCurrency: "KES", url: `${base}/shop/${p.slug}`,
          ...(schemaAvailability[v.availability] ? { availability: schemaAvailability[v.availability] } : {}) } }
      : {};
    return {
      "@type": "Product", sku: v.sku, name: `${cw.title}, size ${v.size}`, color: v.colourLabel, size: v.size,
      ...(img ? { image: abs(img.image.src) } : {}), ...offer,
    };
  });
  // No offers when a product has no price, and no ratings (R7, D11, R12).
  return {
    "@context": "https://schema.org", "@type": "ProductGroup", name: p.name, description: lead,
    url: `${base}/shop/${p.slug}`, productGroupID: p.slug, brand: { "@type": "Brand", name: site.name },
    variesBy: ["https://schema.org/color", "https://schema.org/size"],
    ...(hero ? { image: abs(hero.image.src) } : {}), hasVariant: variants,
  };
}

export default async function ProductPage({ params }: Props) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const copy = copyFor(p.slug);
  const cat = categoryByKey(p.category);
  const base = siteBaseUrl();
  // Claims come from data/copy.ts: dolls, bags and wall heads carry none (R9, D26).
  const claims = claimsFor(p.slug);
  const trust: { icon: IconName; title: string; text: string }[] = copy.claims === "plain" ? [...claims, womenRow] : [...claims];

  const galleries: Record<string, GalleryItem[]> = {};
  for (const c of p.colourways) galleries[c.key] = galleryImages(p, c.key).map((g) => toGallery(g.image, g.kind));
  const colours = p.colourways.map((c) => {
    const h = heroImage(p, c.key);
    return { key: c.key, label: c.label, title: c.title, thumb: h ? toGallery(h.image, "colourway") : null };
  });
  const skuFor: Record<string, string> = {};
  for (const v of variantsOf(p)) skuFor[`${v.colourKey}|${v.size}`] = v.sku;

  const open = heroImage(p)?.colourway.key ?? p.colourways[0].key;
  const sameCat = allProducts().filter((x) => x.slug !== p.slug && x.category === p.category);
  const others = allProducts().filter((x) => x.slug !== p.slug && x.category !== p.category);
  const related = [...sameCat, ...others].slice(0, 8).map((x) => toCard(x));

  const crumbs = [
    { label: "Home", href: "/" }, { label: "Shop", href: "/shop" },
    { label: cat.label, href: `/shop/${cat.slug}` }, { label: p.name },
  ];
  const crumbLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${base}${c.href === "/" ? "" : c.href}` } : { item: `${base}/shop/${p.slug}` }),
    })),
  };

  return (
    <FxPage t="product">
      <JsonLd data={productJsonLd(p, copy.lead)} />
      <JsonLd data={crumbLd} />
      <Container className="py-3 md:py-5">
        <Breadcrumb items={crumbs} />
        <div className="mt-4">
          <ProductPurchase
            slug={p.slug} name={p.name} colours={colours} galleries={galleries} openOn={open} sizes={p.sizes}
            sizePrices={pricesConfirmed ? p.sizePrices : null}
            availability={availabilityLabel[defaultAvailability]} skuFor={skuFor}
            colourAsk={p.colourAsk} noun={copy.noun} category={cat.label} hopSprite={hopSprite(p.species, p.category)}
            below={
              <CardGrid kind="three">
                {[
                  { href: "/care", title: "Care guide", text: "Easy to clean", icon: "hands" as IconName },
                  { href: "/size-guide", title: "Size guide", text: "Small to Extra large compared", icon: "ruler" as IconName },
                  { href: "/safety", title: "Materials and safety", text: "How it is made", icon: "shield" as IconName },
                ].map((l) => (
                  <LinkCard key={l.href} tone="slate" icon={l.icon} title={l.title} text={l.text} cardType="pointer" cta={{ label: l.title, href: l.href }} />
                ))}
              </CardGrid>
            }
          />
        </div>
      </Container>

      <Section tone="oat" labelledBy="about">
        <div className="grid gap-4 md:grid-cols-2 md:gap-3">
          <div className="max-w-[62ch]">
            <h2 id="about" className="text-display-md">About this {copy.noun}</h2>
            <p className="mt-4">{copy.lead}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {copy.details.map((d) => (
                <li key={d} className="flex items-start gap-3"><Icon name="check" size={22} className="mt-1 shrink-0 text-olive-deep" />{d}</li>
              ))}
            </ul>
          </div>
          {trust.length ? (
            <CardGrid kind="two">
              {trust.map((t) => <FeatureCard key={t.title} tone={t.title.startsWith("25") ? "baobab" : "slate"} icon={t.icon} title={t.title} text={t.text} cardType="trust" />)}
            </CardGrid>
          ) : null}
        </div>
      </Section>

      <Band t="product" id="end" />

      <Section labelledBy="related">
        <SectionHeader id="related" title={copy.noun === "animal" ? "More crocheted animals" : "More from the shop"} action={<Link href="/shop" className="inline-flex min-h-10 items-center font-semibold text-terracotta-deep underline underline-offset-4">Shop all animals</Link>} />
        <ProductRail items={related} label={copy.noun === "animal" ? "More crocheted animals" : "More from the shop"} />
      </Section>
    </FxPage>
  );
}
