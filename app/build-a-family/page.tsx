import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { HelperHeader } from "@/components/helpers/HelperHeader";
import { FamilyBuilder } from "@/components/helpers/FamilyBuilder";
import { helperAnimals } from "@/lib/helpers/data";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Build a Safari Family",
  description: "Tap crocheted animals into a family, choose colours and sizes, add the same animal in several sizes or colours, then send the whole set on WhatsApp or share it with a link.",
  path: "/build-a-family",
});

export default function BuildAFamilyPage() {
  const animals = helperAnimals();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Build a Safari Family", path: "/build-a-family" }])} />
      <HelperHeader crumbs={[{ label: "Home", href: "/" }, { label: "Build a Safari Family" }]}
        eyebrow="Set builder" title="Build a Safari Family"
        lede="Tap the animals you want, pick a colour and size for each (the same animal can appear in several sizes or colours), then send the whole family in one WhatsApp message." />
      <Container className="py-5 md:py-4">
        <FamilyBuilder animals={animals} />
      </Container>
    </>
  );
}
