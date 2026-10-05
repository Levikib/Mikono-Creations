import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { StudioApp } from "@/components/studio/StudioApp";
import { pageMetadata } from "@/lib/pageMeta";
import { buildStudioData } from "@/lib/studio/catalogue";

export const metadata = pageMetadata({
  title: "Design your own animal",
  description: "Plan a custom crocheted animal with Mikono Creations. Choose a shape, size, colours and details, then send your brief on WhatsApp for a quote.",
  path: "/custom/studio",
});

export default function Page() {
  const data = buildStudioData();
  return (
    <Container className="pb-6 pt-3 md:pt-4">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Custom orders", href: "/custom" }, { label: "Design your own" }]} />
      <header className="mb-3 mt-4 max-w-[75ch] md:mb-6">
        <p className="eyebrow">Custom studio</p>
        <h1 className="text-display-lg mt-1">Design your own animal</h1>
        <p className="mt-2 text-[.9375rem] text-ink-soft">Share your idea in a few taps. Every piece is crocheted by hand, so it will be a handmade cousin of your idea. We usually reply on WhatsApp within a few minutes to a couple of hours during working hours, with a quote before anything is made. Custom pieces usually take from 3 days to 1 week, and the exact time is confirmed in your quote.</p>
      </header>
      <StudioApp data={data} />
    </Container>
  );
}
