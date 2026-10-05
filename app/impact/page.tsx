import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { ScrapHero, Taped, PendingNote } from "@/components/Scrap";
import { TrustStrip } from "@/components/TrustStrip";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Our impact",
  description: "Recycled acrylic yarn, 25+ women supported and zero plastic on our plain animals. What we can state today, and what we have not published yet.",
  path: "/impact",
});

export default function ImpactPage() {
  return (
    <HandScope>
      <JsonLd data={breadcrumbLd([{ name: "Our impact", path: "/impact" }])} />
      <ScrapHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Our impact" }]}
        eyebrow="What we can say today"
        title="Yarn finds a new life"
        kinetic
        accent={3}
        lede="Our animals are crocheted by hand in Nairobi from recycled acrylic yarn. Here is what that means, stated plainly."
        collage={{ a: "lionMane", b: "elephantsInMaking" }}
      />
      <Container className="py-4 md:py-6">
        <div className="grid max-w-[720px] gap-5 text-[.9375rem] leading-[1.7]">
          <section aria-labelledby="yarn">
            <h2 id="yarn" className="text-display-md">Recycled yarn</h2>
            <p className="mt-3">Every animal is crocheted from recycled acrylic yarn, which is yarn that is used again instead of new yarn being made. We have not published where the yarn comes from or how much we use.</p>
          </section>
          <section aria-labelledby="plastic">
            <h2 id="plastic" className="text-display-md">Zero plastic, nothing detachable</h2>
            <p className="mt-3">We describe our plain crocheted animals as zero plastic, with nothing detachable. We do not make that claim for animals in clothes or with a bag, or for dolls, bags and wall heads.</p>
          </section>
          <section aria-labelledby="women">
            <h2 id="women" className="text-display-md">25+ women supported</h2>
            <p className="mt-3">The work at Mikono supports 25+ women. We have not written up what the work provides for them, and we will not guess. If you would like to ask, message us.</p>
          </section>
        </div>
        <div className="mt-6 grid items-start gap-4 md:grid-cols-[1fr_320px]">
          <PendingNote title="Figures and stories">We do not publish yarn volumes, income figures or quotes yet. When they are confirmed and the people involved agree, they will be added here.</PendingNote>
          <Taped id="handsStitching" ratio="aspect-[4/5]" tilt={2} caption sizes="320px" className="mx-auto w-full max-w-[280px]" />
        </div>
      </Container>
      <Container className="pb-5 md:pb-8">
        <TrustStrip />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/makers" variant="primary">Meet the makers</ButtonLink>
          <ButtonLink href="/safety" variant="ghost">Materials and safety</ButtonLink>
          <ButtonLink prefetch={false} href="/custom/studio?type=school_ngo_project&src=impact" data-track="impact_studio" variant="ghost">Plan an animal for your school or project</ButtonLink>
        </div>
      </Container>
    </HandScope>
  );
}
