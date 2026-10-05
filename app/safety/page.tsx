import { Container } from "@/components/Container";
import { PlainHero, PendingNote } from "@/components/Scrap";
import { Bullets, Prose, Sec } from "@/components/Prose";
import { TrustStrip } from "@/components/TrustStrip";
import { ReadSplit } from "@/components/ReadSplit";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Materials and safety",
  description: "Recycled acrylic yarn, and zero plastic and nothing detachable on our plain crocheted animals. What we claim, and what we do not.",
  path: "/safety",
});

export default function SafetyPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Materials and safety", path: "/safety" }])} />
      <PlainHero crumbs={[{ label: "Home", href: "/" }, { label: "Materials and safety" }]} title="Materials and safety" lede="We say what we know and nothing more. These are the claims we make about our animals." />
      <Container className="py-4 md:py-6">
        <TrustStrip />
        <div className="mt-6">
          <ReadSplit links={[{ href: "/care", label: "Care guide" }, { href: "/size-guide", label: "Size guide" }, { href: "/impact", label: "Our impact" }]} ask="Hello Mikono Creations, I have a question about materials and safety."
            aside={<PendingNote title="Not published yet">The filling, test results and age guidance. When we can state them plainly, they will be added here.</PendingNote>}>
          <Prose>
            <Sec id="made" title="How they are made">
              <p>Our animals are crocheted by hand in Nairobi from recycled acrylic yarn. Our plain crocheted animals have zero plastic, and nothing on them is detachable.</p>
              <p>Some animals wear a vest or a dress or carry a bag, and we also make dolls, bags and wall heads. We have not confirmed those claims for them, so we do not make them. Ask us on WhatsApp and we will tell you what we know.</p>
            </Sec>
            <Sec id="not" title="What we do not claim">
              <p>We do not describe our animals as tested, certified or safe for any age group, because we have no test papers or certificates to show. If you are choosing for a baby or a very young child, ask us and decide with all the facts.</p>
            </Sec>
            <Sec id="pending" title="What we have not published yet">
              <Bullets items={["The filling inside the animals.", "Test results or certificates.", "Age guidance."]} />
            </Sec>
          </Prose>
          </ReadSplit>
        </div>
      </Container>
    </>
  );
}
