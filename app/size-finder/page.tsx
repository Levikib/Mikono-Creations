import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/Container";
import { HelperHeader } from "@/components/helpers/HelperHeader";
import { SizeFinder } from "@/components/helpers/SizeFinder";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Size finder",
  description: "Our crocheted animals come in Small, Medium, Large and Extra large. See the steps side by side and compare more than one use at once.",
  path: "/size-finder",
});

export default function SizeFinderPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Size finder", path: "/size-finder" }])} />
      <HelperHeader crumbs={[{ label: "Home", href: "/" }, { label: "Size finder" }]}
        eyebrow="Size finder" title="Which size is right?"
        lede="Our animals come in Small, Medium, Large and Extra large. See the steps side by side, then tell us what it is for. You can pick more than one use." />
      <Container className="py-5 md:py-4">
        <SizeFinder />
      </Container>
    </>
  );
}
