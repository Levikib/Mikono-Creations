import Link from "next/link";
import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { Container } from "@/components/Container";
import { HandScope } from "@/components/HandScope";
import { PolaroidCard, ScrapHero, Taped, PendingNote, tilts } from "@/components/Scrap";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { site, outlets } from "@/lib/site";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";
import type { PhotoId } from "@/content/photos";
import { VideoPlayer } from "@/components/gallery/VideoPlayer";
import { galleryVideo } from "@/content/gallery";

export const metadata = pageMetadata({
  title: "Our story",
  description: "Mikono Creations was founded in 2019 in Nairobi by Leah Maina. Mikono means hands. We crochet animals by hand from recycled acrylic yarn.",
  path: "/story",
});

const strip: PhotoId[] = ["handsGiraffe", "makerCrocheting", "finishingGiraffe", "sewingBear"];

export default function StoryPage() {
  return (
    <HandScope>
      <FxPage t="story">
      <JsonLd data={breadcrumbLd([{ name: "Our story", path: "/story" }])} />
      <ScrapHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Our story" }]}
        eyebrow="Karibu"
        title="Made by hand"
        kinetic
        accent={2}
        lede="Mikono means hands. We crochet animals by hand in Nairobi from recycled acrylic yarn."
        collage={{ a: "lionHug", b: "giraffeFamily", c: "marketTable" }}
      />
      <Band t="story" id="intro" />
      <Container className="grid gap-6 py-4 md:py-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid max-w-[720px] gap-5 text-[.9375rem] leading-[1.7]">
          <section aria-labelledby="start">
            <h2 id="start" className="text-display-md">How it started</h2>
            <p className="mt-3">Mikono Creations was founded in {site.founded} in Nairobi by {site.founder}.</p>
            <p className="mt-3">The longer story, in her own words, is not on this page yet. We would rather wait for the real version than guess at it.</p>
          </section>
          <section aria-labelledby="name">
            <h2 id="name" className="text-display-md">The name</h2>
            <p className="mt-3">Mikono is the Swahili word for hands. Every animal is crocheted by hand, one loop at a time, so the name says what we do.</p>
          </section>
          <section aria-labelledby="make">
            <h2 id="make" className="text-display-md">What we make</h2>
            <p className="mt-3">Crocheted animals such as lions, giraffes, rabbits and octopuses. They come in four sizes, Small to Extra large, and in many colours.</p>
            <ul className="mt-4 grid list-disc gap-2 pl-6 marker:text-terracotta-deep">
              <li>Crocheted from recycled acrylic yarn.</li>
              <li>Zero plastic and nothing detachable, on our plain crocheted animals.</li>
              <li>Easy to clean.</li>
            </ul>
          </section>
          <section aria-labelledby="women">
            <h2 id="women" className="text-display-md">The women behind it</h2>
            <p className="mt-3">Through this work we support 25+ women. The makers page shows them at work.</p>
            <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/makers" variant="primary">Meet the makers</ButtonLink>
              <ButtonLink href="/shop" variant="ghost">See the animals</ButtonLink>
            </div>
          </section>
          <section aria-labelledby="find">
            <h2 id="find" className="text-display-md">Where to find us</h2>
            <p className="mt-3">Our animals are sold through {outlets.length} outlets in and around Nairobi, and on this site through WhatsApp. We are on Instagram and Facebook as {site.handle}.</p>
            <div className="mt-2.5"><ButtonLink href="/stockists" variant="ghost">See the outlets</ButtonLink></div>
          </section>
        </div>
        <aside className="side-sticky grid h-fit gap-3" aria-label="Notes">
          <div className="relative rounded bg-ochre-tint p-3 pt-3 shadow-[0_10px_18px_-8px_rgb(59_42_34/.28)]" style={{ rotate: "1.5deg" }}>
            <span className="tape" aria-hidden="true" />
            <p className="eyebrow">Founded in {site.founded}. Nairobi.</p>
          </div>
          <Taped id="stallMaker" ratio="aspect-[16/9]" tilt={-2} caption sizes="340px" />
          <PendingNote title="Not on this page yet">The full story in Leah Maina&apos;s own words, and any dates after {site.founded}, will be added once we have them.</PendingNote>
        </aside>
      </Container>
      <Band t="story" id="table" />
      <section aria-labelledby="hands" className="paper-grain py-5 md:py-8">
        <Container>
          <h2 id="hands" className="mb-4 text-display-md">Hands at work</h2>
          <ul data-card-group className="mk-grid">
            {strip.map((id, i) => (
              <li key={id}><PolaroidCard id={id} tilt={tilts[i % tilts.length]} /></li>
            ))}
          </ul>
        </Container>
      </section>
      <Container className="py-5 md:py-8">
        <h2 className="mb-3 text-display-md">A market stall in motion</h2>
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,560px)_1fr]">
          <VideoPlayer src={galleryVideo.src} poster={galleryVideo.poster} alt={galleryVideo.alt} caption="Press play to watch. The video loads only when you do." />
          <p className="max-w-[48ch] text-[.9375rem] leading-[1.7]">A short video from a market stall: crocheted giraffes, elephants and a lion on a table with an orange striped cloth. More photos are in the <Link href="/gallery#market" className="font-semibold text-terracotta-deep underline underline-offset-4">gallery</Link>.</p>
        </div>
      </Container>
      <Band t="story" id="end" />
      </FxPage>
    </HandScope>
  );
}
