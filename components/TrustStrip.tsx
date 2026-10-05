import { FeatureCard, CardGrid } from "./card/Card";
import type { IconName } from "./Icon";
import type { Tone } from "@/lib/cardTone";
import { trustClaims } from "@/data/copy";

// Exactly four items (D27): the three approved claims and the women supported fact.
const items: { icon: IconName; title: string; text: string; tone: Tone; tag: string }[] = [
  { ...trustClaims[0], tone: "slate", tag: "Material" },
  { ...trustClaims[1], tone: "slate", tag: "Build" },
  { ...trustClaims[2], tone: "slate", tag: "Yarn" },
  { icon: "heart", title: "25+ women supported", text: "Made by hand in Nairobi.", tone: "baobab", tag: "People" },
];

/** Four equal feature cards: 2 across on phones, one row from 640 px. The note states what the claims cover. */
export function TrustStrip({ onDark }: { onDark?: boolean }) {
  return (
    <div>
      <CardGrid kind="four">
        {items.map((it) => <FeatureCard key={it.title} tone={it.tone} icon={it.icon} tag={it.tag} title={it.title} text={it.text} cardType="trust" />)}
      </CardGrid>
      <p className={onDark ? "mt-2 max-w-[62ch] text-[.8125rem] text-dusk-soft" : "mt-2 max-w-[62ch] text-[.8125rem] text-stone"}>
        Zero plastic and nothing detachable describe our plain crocheted animals. Ask us about animals in clothes, dolls, bags and wall heads.
      </p>
    </div>
  );
}
