import { Container } from "@/components/Container";
import { PlainHero, PendingNote, Taped, WhatsAppLink } from "@/components/Scrap";
import { Bullets, Prose, Sec } from "@/components/Prose";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Care guide",
  description: "Our crocheted animals are easy to clean. General gentle cleaning tips, and what we have not published yet.",
  path: "/care",
});

export default function CarePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Care guide", path: "/care" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Care guide" }]} title="Care guide" lede="Our animals are easy to clean. Here are gentle, general tips, and a plain note on what we have not published yet." />
      <Container className="grid items-start gap-6 py-4 md:py-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_300px]">
        <Prose>
          <Sec id="easy" title="Easy to clean">
            <p>Easy to clean is what we can say about our animals. Our animals are crocheted from recycled acrylic yarn.</p>
          </Sec>
          <Sec id="tips" title="Gentle cleaning, step by step">
            <p>These are general tips for crocheted items, not a tested Mikono method.</p>
            <ol className="grid list-decimal gap-2 pl-6 marker:font-semibold marker:text-terracotta-deep">
              <li>Brush off dust with a soft, dry brush or your hand.</li>
              <li>Wipe marks with a clean cloth dampened in cool water.</li>
              <li>If a mark stays, add a tiny amount of mild soap to the cloth and dab. Do not scrub.</li>
              <li>Let the animal dry in the air in a shaded, airy place, away from direct heat.</li>
            </ol>
          </Sec>
          <Sec id="avoid" title="Better to avoid">
            <Bullets items={["Scrubbing hard, which can rough up the yarn.", "Direct heat, which can change how yarn feels."]} />
          </Sec>
          <Sec id="stain" title="A stain or a spill">
            <p>Message us on WhatsApp with a photo of the mark and we will tell you what we know.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink text="Hello Mikono Creations, I need help cleaning my animal." label="Ask about a stain" />
              <ButtonLink href="/journal/how-to-clean-a-crocheted-animal" variant="ghost">Read the journal post</ButtonLink>
            </div>
          </Sec>
        </Prose>
        <aside className="grid gap-3">
          <Taped id="giraffePortrait" ratio="aspect-[4/5]" tilt={2} sizes="300px" className="mx-auto w-full max-w-[260px]" />
          <PendingNote>A tested wash method, including machine washing and water temperature, is not published yet. We will not guess. Ask us before washing in a machine.</PendingNote>
        </aside>
      </Container>
    </>
  );
}
