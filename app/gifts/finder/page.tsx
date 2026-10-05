import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { HelperHeader } from "@/components/helpers/HelperHeader";
import { GiftFinder } from "@/components/helpers/GiftFinder";
import { helperAnimals } from "@/lib/helpers/data";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Gift finder",
  description: "Five quick questions and we pick three crocheted animals from the shop. Add them to your order list or ask us on WhatsApp.",
  path: "/gifts/finder",
});

export default function GiftFinderPage() {
  const animals = helperAnimals();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Gifts", path: "/gifts" }, { name: "Gift finder", path: "/gifts/finder" }])} />
      <HelperHeader crumbs={[{ label: "Home", href: "/" }, { label: "Gifts", href: "/gifts" }, { label: "Gift finder" }]}
        eyebrow="Gift finder" title="Not sure which animal to give?"
        lede="Answer five quick questions and we will pick three from the shop. Order on WhatsApp when you are ready." />
      <Container className="py-5 md:py-4">
        <GiftFinder animals={animals} />
      </Container>
    </>
  );
}
