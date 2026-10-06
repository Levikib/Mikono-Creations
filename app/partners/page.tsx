import { Container } from "@/components/Container";
import { PriceLadderNote } from "@/components/PriceLadderNote";
import { CatalogueProvider } from "@/components/CatalogueContext";
import { cartCatalogue } from "@/lib/cartCatalogue";
import { PlainHero, Taped } from "@/components/Scrap";
import { TradeEnquiryForm } from "@/components/TradeEnquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Partners",
  description: "Partner with Mikono Creations: schools, NGOs, brands, hotels and lodges. Send a short enquiry and we reply on WhatsApp.",
  path: "/partners",
});

const steps = ['Tell us who you are and what you have in mind.', 'WhatsApp opens with your enquiry ready. You press send.', 'A person at Mikono replies on WhatsApp.'];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Partners", path: "/partners" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Partners" }]} title="Partners" lede="Schools, organisations, brands, hotels and lodges are welcome to work with us. Tell us what you have in mind and we answer on WhatsApp." />
      <Container className="grid gap-5 py-4 md:py-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          <h2 className="mb-3 text-display-md">Your enquiry</h2>
          <CatalogueProvider products={cartCatalogue()}><TradeEnquiryForm kind="partner" /></CatalogueProvider>
        </div>
        <aside aria-labelledby="how" className="side-sticky grid gap-3">
          <div className="rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm">
            <h2 id="how" className="text-[1.125rem]">How it works</h2>
            <ol className="mt-3 grid gap-3 text-[.9375rem]">
              {steps.map((s, i) => <li key={s}>{i + 1}. {s}</li>)}
            </ol>
            <p className="mt-4 text-base text-stone">Partner names and logos are not shown on this site yet.</p>
            <PriceLadderNote className="mt-2 text-base text-stone" />
          </div>
          <Taped id="lionsGiraffes" ratio="aspect-[4/3]" tilt={1.5} sizes="380px" className="mx-auto w-full max-w-[340px]" />
        </aside>
      </Container>
    </>
  );
}
