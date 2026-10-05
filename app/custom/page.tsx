import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { CatalogueProvider } from "@/components/CatalogueContext";
import { cartCatalogue } from "@/lib/cartCatalogue";
import { CardGrid, FeatureCard } from "@/components/card/Card";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { PlainHero, Taped } from "@/components/Scrap";
import { TradeEnquiryForm } from "@/components/TradeEnquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Custom orders",
  description: "Design your own crocheted animal in the Custom Studio, or send a short message. A person at Mikono Creations replies on WhatsApp.",
  path: "/custom",
});

const steps = ["Tell us the animal, colours, size and who it is for.", "WhatsApp opens with your brief ready. You press send.", "A person at Mikono replies on WhatsApp."];

const starts: { icon: IconName; title: string; text: string; href: string; track: string }[] = [
  { icon: "giraffe", title: "Change an animal we make", text: "Pick one from the shop and tell us what to change.", href: "/custom/studio?type=base_variation&src=custom", track: "custom_base" },
  { icon: "heart", title: "A pet or a character", text: "Share a photo or a drawing to work from.", href: "/custom/studio?type=pet_or_character&src=custom", track: "custom_pet" },
  { icon: "people", title: "For a shop, school or event", text: "Branded, favours or a group order.", href: "/custom/studio?type=branded_mascot&src=custom", track: "custom_group" },
];

export default function Page() {
  return (
    <>
      <FxPage t="custom">
      <JsonLd data={breadcrumbLd([{ name: "Custom orders", path: "/custom" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Custom orders" }]} title="Make it yours" lede="Plan an animal in the Custom Studio, step by step. A person replies on WhatsApp with what is possible." />
      <Container className="grid gap-3 py-4 md:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink prefetch={false} href="/custom/studio?src=custom" data-track="custom_studio" size="large"><Icon name="hook" size={22} />Open the Studio</ButtonLink>
          <p className="text-base text-stone">No account and nothing is charged. Your draft stays on this device.</p>
        </div>
        <CardGrid kind="three">
          {starts.map((s) => (
            <FeatureCard key={s.title} tone="terracotta" icon={s.icon} tag="Custom" title={s.title} text={s.text} cardType="pointer"
              cta={{ label: "Start", href: s.href, track: s.track }} />
          ))}
        </CardGrid>
      </Container>
      <Band t="custom" id="bench" />
      <Container className="grid gap-5 pb-4 pt-4 md:pb-14 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          <h2 className="mb-2 text-display-md">Prefer to just message us?</h2>
          <p className="mb-3 text-base text-stone">Send a short note and we reply on WhatsApp. The Studio is only the longer way in.</p>
          <CatalogueProvider products={cartCatalogue()}><TradeEnquiryForm kind="custom" /></CatalogueProvider>
        </div>
        <aside aria-labelledby="how" className="side-sticky grid gap-3">
          <div className="rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm">
            <h2 id="how" className="text-[1.125rem]">How it works</h2>
            <ol className="mt-3 grid gap-3 text-[.9375rem]">
              {steps.map((s, i) => <li key={s}>{i + 1}. {s}</li>)}
            </ol>
            <p className="mt-4 text-base text-stone">Custom pieces depend on the quantity and design and usually take from 3 days to 1 week. The exact time and the price are confirmed in your quote. We usually reply within a few minutes to a couple of hours during working hours.</p>
          </div>
          <Taped id="zebrasBunnies" ratio="aspect-[4/3]" tilt={1.5} sizes="380px" className="mx-auto w-full max-w-[340px]" />
        </aside>
      </Container>
      <Band t="custom" id="end" />
      </FxPage>
    </>
  );
}
