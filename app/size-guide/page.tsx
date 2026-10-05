import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { CardGrid, StatCard } from "@/components/card/Card";
import { Container } from "@/components/Container";
import { PlainHero, PendingNote, Taped, WhatsAppLink } from "@/components/Scrap";
import { Bullets, Prose, Sec } from "@/components/Prose";
import { SizeLadder } from "@/components/SizeLadder";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Size guide",
  description: "Our animals come in four sizes, Small, Medium, Large and Extra large. See them compared in a row of lions.",
  path: "/size-guide",
});

const sizes = [
  { s: "Small", text: "The smallest size in the range." },
  { s: "Medium", text: "One step up from Small." },
  { s: "Large", text: "One step up from Medium." },
  { s: "Extra large", text: "The largest size in the range." },
];

export default function SizeGuidePage() {
  return (
    <FxPage t="size-guide">
      <JsonLd data={breadcrumbLd([{ name: "Size guide", path: "/size-guide" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Size guide" }]} title="Size guide" lede="Our animals come in four sizes: Small, Medium, Large and Extra large. Each size is a step up from the one before. We compare them by eye, because we have not published centimetre measurements." />
      <Band t="size-guide" id="ruler" />
      <Container className="pt-3">
        <ButtonLink prefetch={false} href="/size-finder?src=size_guide" data-track="size_guide_finder" variant="secondary">Not sure? Use the size finder</ButtonLink>
      </Container>
      <Container className="py-4 md:py-6">
        <CardGrid kind="four">
          {sizes.map((z) => <StatCard key={z.s} tone="slate" big={z.s} title={`Size ${z.s}`} text={z.text} />)}
        </CardGrid>
        <div className="mt-6 grid items-center gap-5 md:grid-cols-2">
          <div className="grid gap-4">
            <h2 className="text-display-md">Four lions, side by side</h2>
            <p className="text-[.9375rem] leading-[1.7]">Four crocheted lions with brown manes stand in a row on a black table, from the largest on the left to the smallest on the right. Each lion is one step up from the next, which is how Small, Medium, Large and Extra large relate. The photo carries no labels, so compare the lions by eye.</p>
          </div>
          <Taped id="ladder" ratio="aspect-[716/470]" tilt={-1.5} caption sizes="(min-width:768px) 480px, 90vw" className="mx-auto w-full max-w-[520px]" />
        </div>
        <div className="mt-6 grid items-center gap-5 md:grid-cols-2">
          <SizeLadder className="order-2 md:order-1" />
          <div className="order-1 grid gap-4 md:order-2">
            <h2 className="text-display-md">The same steps, as a picture</h2>
            <p className="text-[.9375rem] leading-[1.7]">The drawing shows the relative steps only. It is not to scale and shows no measurements.</p>
          </div>
        </div>
        <div className="mt-6">
          <Prose>
            <Sec id="choose" title="How to choose">
              <Bullets items={["Pick a smaller size to carry about or place on a shelf.", "Pick a larger size for a sofa, a bed or a gift that should stand out.", "Not sure? Tell us who it is for or send a photo of the space and we will suggest a size."]} />
            </Sec>
          </Prose>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PendingNote>Centimetre measurements and age guidance are not published yet. We will add measurements when we have them checked.</PendingNote>
          <div className="flex flex-col items-start justify-center gap-3 sm:flex-row sm:items-center">
            <WhatsAppLink text="Hello Mikono Creations, can you help me choose a size?" label="Ask us about sizes" />
            <ButtonLink href="/shop" variant="ghost">See the animals</ButtonLink>
          </div>
        </div>
      </Container>
    </FxPage>
  );
}
