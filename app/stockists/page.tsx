import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { Container } from "@/components/Container";
import { PriceLadderNote } from "@/components/PriceLadderNote";
import { PlainHero, Taped } from "@/components/Scrap";
import { CardGrid, LinkCard } from "@/components/card/Card";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { whatsappUrl } from "@/lib/env";
import { outlets } from "@/lib/site";
import { business } from "@/content/business";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";
import { PolaroidCard } from "@/components/Scrap";

export const metadata = pageMetadata({
  title: "Stockists",
  description: "Where to find Mikono Creations animals in and around Nairobi: seven outlets from Village Market Mall to the Giraffe Centre in Karen.",
  path: "/stockists",
});

export default function StockistsPage() {
  const wa = (o: { name: string; place: string }) => whatsappUrl(`Hello Mikono Creations, I would like to know about your animals at ${o.name}, ${o.place}.`);
  return (
    <FxPage t="stockists">
      <JsonLd data={breadcrumbLd([{ name: "Stockists", path: "/stockists" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Stockists" }]} title="Where to find us" lede={`Our animals are sold through ${outlets.length} outlets in and around Nairobi, from Village Market Mall to the Giraffe Centre in Karen. Find the one nearest you below.`} />
      <Band t="stockists" id="stall" />
      <Container className="py-4 md:py-6">
        <CardGrid kind="link">
          {outlets.map((o) => (
            <LinkCard key={o.name} tone="olive" icon="pin" title={o.name} text={o.place} cardType="outlet"
              cta={{ label: "Ask on WhatsApp", href: wa(o) ?? "/contact", external: !!wa(o) }} />
          ))}
          {/* An eighth card closes the grid in rows of two and four. */}
          <LinkCard tone="olive" icon="hand" title="Become a stockist" text="Partner with us" cardType="outlet" cta={{ label: "Partner with us", href: "/partners" }} />
        </CardGrid>
        <h2 className="mb-1 mt-7 text-display-md">How our animals look on display</h2>
        <p className="mb-3 max-w-[60ch] text-[.9375rem]">Stalls and shelves where our animals are shown for sale. These photos come from markets and shops and are not tied to one outlet above.</p>
        <ul data-card-group aria-label="Stalls and shelves" className="mk-grid">
          {(["canopyStall", "beachStall", "elephantsRhinosRows", "zebrasBunnies"] as const).map((id) => (
            <li key={id}><PolaroidCard id={id} /></li>
          ))}
        </ul>
        <div className="mt-7 grid items-center gap-4 md:grid-cols-[1fr_1fr]">
          <div className="grid gap-4">
            <h2 className="text-display-md">Run a shop and want to stock us?</h2>
            <p className="text-[.9375rem] leading-[1.7]">Send a short wholesale request and a person replies on WhatsApp. You can also call or message {business.phoneDisplay}, our official business number.</p>
            <PriceLadderNote className="text-[.9375rem] leading-[1.7]" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/wholesale" variant="primary">Wholesale request</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">Contact</ButtonLink>
            </div>
          </div>
          <Taped id="shelfReady" ratio="aspect-[4/3]" tilt={2} caption sizes="(min-width:768px) 420px, 90vw" className="mx-auto w-full max-w-[420px]" />
        </div>
      </Container>
      <Band t="stockists" id="end" />
    </FxPage>
  );
}
