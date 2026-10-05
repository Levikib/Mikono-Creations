import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { pageMetadata } from "@/lib/pageMeta";
import { CatalogueProvider } from "@/components/CatalogueContext";
import { cartCatalogue } from "@/lib/cartCatalogue";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Suspense } from "react";
import { CtaBand } from "@/components/CtaBand";
import { WholesaleForm, WholesaleFormFromLink } from "@/components/WholesaleForm";

export const metadata = pageMetadata({
  title: "Wholesale",
  description: "Ask for a price list, a quote or a reorder. We reply on WhatsApp.",
  path: "/wholesale",
});

const steps = [
  "Tell us who you are and what you need.",
  "WhatsApp opens with your request ready. You press send.",
  "A person at Mikono replies on WhatsApp with the price list or a quote.",
];

export default function WholesalePage() {
  return (
    <FxPage t="wholesale">
      <div className="bg-oat">
        <Container className="py-4 md:py-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wholesale" }]} />
          <h1 className="mt-4 text-display-lg">Wholesale</h1>
          <p className="mt-4 max-w-[56ch] text-[.9375rem]">
            For shops, lodges, schools and organisations that would like to stock our crocheted animals. Send one short request and we answer on WhatsApp.
          </p>
        </Container>
      </div>
      <Band t="wholesale" id="path" />
      <Container className="grid gap-5 py-4 md:py-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div id="request" className="scroll-mt-28">
          <h2 className="mb-3 text-display-md">Your request</h2>
          <CatalogueProvider products={cartCatalogue()}><Suspense fallback={<WholesaleForm />}><WholesaleFormFromLink /></Suspense></CatalogueProvider>
        </div>
        <aside aria-labelledby="how" className="side-sticky rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm">
          <h2 id="how" className="text-[1.125rem]">How it works</h2>
          <ol className="mt-3 grid gap-3 text-[.9375rem]">
            {steps.map((s, i) => <li key={s}>{i + 1}. {s}</li>)}
          </ol>
          <p className="mt-4 text-base text-stone">We do not show wholesale prices on the website. A person sends them to you on WhatsApp.</p>
        </aside>
      </Container>
      <Container className="pb-5 md:pb-8">
        <CtaBand eyebrow="Branded and corporate gifts" title="Need a branded or mascot animal?"
          text="Plan a custom animal for your lodge, shop, school or company. A person replies on WhatsApp."
          primary={{ label: "Start a custom brief", href: "/custom/studio?type=branded_mascot&src=wholesale", track: "wholesale_studio" }} />
      </Container>
    </FxPage>
  );
}
