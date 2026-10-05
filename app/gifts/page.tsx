import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { Container } from "@/components/Container";
import { PlainHero, PendingNote, WhatsAppLink } from "@/components/Scrap";
import { InfoGrid } from "@/components/InfoCard";
import { Bullets, Prose, Sec } from "@/components/Prose";
import { ButtonLink } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Gifts",
  description: "Choosing a crocheted animal as a gift: pick by animal and size, add a gift note, and order on WhatsApp.",
  path: "/gifts",
});

export default function GiftsPage() {
  return (
    <FxPage t="gifts">
      <JsonLd data={breadcrumbLd([{ name: "Gifts", path: "/gifts" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Gifts" }]} title="Gifts" lede="A crocheted animal made by hand in Nairobi. Pick the animal and the size, and the order form handles the gift note." />
      <Band t="gifts" id="shelf" />
      <Container className="pt-3 md:pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink prefetch={false} href="/gifts/finder?src=gifts" data-track="gifts_finder" size="large">Find the right gift</ButtonLink>
          <ButtonLink prefetch={false} href="/build-a-family?src=gifts" data-track="gifts_family" variant="secondary" size="large">Build a safari family</ButtonLink>
        </div>
      </Container>
      <Container className="py-4 md:py-6">
        <h2 className="mb-3 text-display-md">Choose by animal</h2>
        <InfoGrid items={[
          { eyebrow: "Shop", title: "Safari animals", text: "Elephants, giraffes, lions, rhinos, zebras, hippos and monkeys.", image: "lionsGiraffes", cta: { label: "See safari animals", href: "/shop/safari-animals" } },
          { eyebrow: "Shop", title: "Domestic animals", text: "Rabbits, cats and dogs.", image: "rabbits", cta: { label: "See domestic animals", href: "/shop/domestic-animals" } },
          { eyebrow: "Shop", title: "More animals", text: "Octopuses, sharks, turtles, a goose, a bear and more.", image: "octopuses", cta: { label: "See more animals", href: "/shop/more-animals" } },
        ]} />
        <div className="mt-7">
          <Prose>
            <Sec id="size" title="Choose by size">
              <p>Animals come in Small, Medium, Large and Extra large. A smaller one is easy to hand over in a bag, and a larger one makes a bigger gesture. The size guide compares them side by side.</p>
              <div><ButtonLink href="/size-guide" variant="ghost">See the size guide</ButtonLink></div>
            </Sec>
            <Sec id="order" title="In the order form">
              <Bullets items={["A gift note, with a hint not to include a child's surname, school or age.", "An option to ask us to arrange delivery to the person receiving it, using an adult's name and phone number. We confirm it with you on WhatsApp."]} />
              <p>Prices and delivery are confirmed on WhatsApp, so you see them before you agree to anything.</p>
            </Sec>
          </Prose>
        </div>
        <CtaBand className="mt-6" eyebrow="Make it yours" title="A gift that is just right"
          text="Want a name, colours or an animal that is not on the shelf? Plan it in the Studio and a person replies on WhatsApp."
          primary={{ label: "Design your own animal", href: "/custom/studio?type=wedding_shower&src=gifts", track: "gifts_studio" }} />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PendingNote>Gift ideas by occasion, delivery times for gifts and age suggestions are not published yet.</PendingNote>
          <div className="flex flex-col items-start justify-center gap-3 sm:flex-row sm:items-center">
            <WhatsAppLink text="Hello Mikono Creations, I am looking for a gift and would like help choosing." label="Ask for help with a gift" />
          </div>
        </div>
      </Container>
      <Band t="gifts" id="end" />
    </FxPage>
  );
}
