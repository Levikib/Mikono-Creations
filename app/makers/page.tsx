import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { PolaroidCard, ScrapHero, PendingNote, tilts } from "@/components/Scrap";
import { StatsBand } from "@/components/StatsBand";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";
import type { PhotoId } from "@/content/photos";

export const metadata = pageMetadata({
  title: "Our makers",
  description: "Mikono means hands. See the women we support at work: crocheting, stitching, sewing faces and trimming manes.",
  path: "/makers",
});

// The hero collage uses handsGiraffe, makerCrocheting and finishingGiraffe, so the grid below does not repeat them.
const ids: PhotoId[] = ["sewingBear", "giraffeFamily", "handsStitching", "trimmingMane", "elephantsInMaking", "workroomPieces", "crochetingOrange", "giraffesSofa"];

export default function MakersPage() {
  return (
    <HandScope>
      <FxPage t="makers">
      <JsonLd data={breadcrumbLd([{ name: "Our makers", path: "/makers" }])} />
      <ScrapHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Our makers" }]}
        eyebrow="Mikono means hands"
        title="Hands at work"
        kinetic
        accent={0}
        lede="Behind every animal are the women we support. These photos show them crocheting, stitching, sewing faces and trimming manes."
        collage={{ a: "handsGiraffe", b: "makerCrocheting", c: "finishingGiraffe" }}
      />
      <Band t="makers" id="intro" />
      <Container className="py-4 md:py-6">
        <div className="grid max-w-[720px] gap-4 text-[.9375rem] leading-[1.7]">
          <p>Our team is the 25+ women supported through Mikono Creations. Each animal passes through several pairs of hands, from crocheting the parts to stitching them together and finishing the face or the mane.</p>
          <p>We are not listing names or profiles on this page. The photos speak for the work.</p>
        </div>
        <h2 className="mb-3 mt-6 text-display-md">In the workroom</h2>
        <ul data-card-group className="mk-grid">
          {ids.map((id, i) => (
            <li key={id}><PolaroidCard id={id} tilt={tilts[i % tilts.length]} /></li>
          ))}
        </ul>
      </Container>
      <Band t="makers" id="end" />
      <StatsBand stats={[{ value: "25+", label: "women supported" }]} />
      <Container className="grid gap-3 py-5 md:grid-cols-2 md:py-8">
        <PendingNote title="Meet the makers">Maker profiles with names and favourite animals are coming when the makers are ready to share them. Until then, our story page tells how Mikono began.</PendingNote>
        <div className="flex flex-col items-start justify-center gap-4">
          <p className="text-[.9375rem]">Want to know more about the people and the idea behind the name?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/shop" variant="primary">Shop the animals they make</ButtonLink>
            <ButtonLink href="/story" variant="ghost">Read our story</ButtonLink>
          </div>
        </div>
      </Container>
      </FxPage>
    </HandScope>
  );
}
