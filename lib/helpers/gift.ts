// Gift finder recommender. Pure functions: answers in, three real animals out. Every reason is a fact read from the catalogue.
import { KINDS, MOODS } from "@/data/helpers";
import { sizeWord } from "../../data/studio/labels";
import type { GiftAnswers, GroupKey, HelperAnimal, HelperColour, GiftPick, Many, SizeKey } from "./types";

const SIZES: SizeKey[] = ["S", "M", "L", "XL"];
export const asSize = (v: string | undefined): SizeKey | null => (SIZES as string[]).includes(v ?? "") ? (v as SizeKey) : null;

/** Answers may hold one value or several. Always a clean list. */
export const many = (v: Many | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);

const kindLabel = (k: string) => KINDS.find((x) => x.value === k)?.label ?? "";
const moodLabel = (m: string) => MOODS.find((x) => x.value === m)?.label ?? "";
const kindGroup: Record<string, GroupKey> = { safari: "safari", pets: "pets", sea: "sea", air: "air", wall: "wall", dolls: "dolls", more: "other" };

/** Names of the animals in a group, for hints such as "Elephant, giraffe, lion". */
export function groupNames(animals: HelperAnimal[], kind: string, max = 4): string {
  const g = kindGroup[kind];
  const list = animals.filter((a) => (g ? a.group === g : true)).map((a) => a.name);
  const shown = list.slice(0, max).join(", ");
  return list.length > max ? `${shown} and more` : shown;
}

/** Moods that match at least one animal colourway. "any" is always offered. */
export function availableMoods(animals: HelperAnimal[]) {
  return MOODS.filter((m) => m.value === "any" || m.value === "other" || animals.some((a) => !a.colourAsk && a.colours.some((c) => c.family === m.value)));
}

type Scored = { animal: HelperAnimal; colour: HelperColour; matches: HelperColour[]; kindHit: boolean; score: number; order: number };

export function recommend(animals: HelperAnimal[], answers: GiftAnswers, count = 3): GiftPick[] {
  const wanted = many(answers.size).map(asSize).filter((s): s is SizeKey => !!s);
  const groups = many(answers.kind).map((k) => kindGroup[k]).filter(Boolean);
  const moods = many(answers.mood).filter((m) => m !== "any" && m !== "other");
  const collector = many(answers.who).includes("collector");
  const sizeOf = (a: HelperAnimal): SizeKey | null => (wanted.length ? wanted.find((s) => a.sizes.includes(s)) ?? null : a.sizes.includes("M") ? "M" : null);

  const scored: Scored[] = animals.map((animal, order) => {
    const real = animal.colourAsk ? [] : animal.colours;
    const matches = moods.length ? real.filter((c) => moods.includes(c.family)) : [];
    const kindHit = groups.length ? groups.includes(animal.group) : false;
    let score = 0;
    if (kindHit) score += 5;
    if (matches.length) score += 4 + Math.min(matches.length, 3) * 0.3;
    if (collector && real.length >= 3) score += 1.5 + real.length * 0.1;
    score -= order * 0.001;
    return { animal, colour: matches[0] ?? animal.colours[0], matches, kindHit, score, order };
  }).filter((s) => sizeOf(s.animal) !== null);

  scored.sort((a, b) => b.score - a.score);

  // At most two from one group when the user did not narrow by kind, so a surprise is varied.
  const out: Scored[] = [];
  const perGroup = new Map<GroupKey, number>();
  for (const s of scored) {
    if (out.length >= count) break;
    const used = perGroup.get(s.animal.group) ?? 0;
    if (!groups.length && used >= 2) continue;
    out.push(s);
    perGroup.set(s.animal.group, used + 1);
  }
  for (const s of scored) {
    if (out.length >= count) break;
    if (!out.includes(s)) out.push(s);
  }

  return out.map((s) => {
    const reasons: string[] = [];
    const size = sizeOf(s.animal) ?? "M";
    if (s.matches.length) reasons.push(`In your colour mood, ${moods.map((m) => moodLabel(m).toLowerCase()).join(" or ")}: ${s.matches.slice(0, 2).map((c) => c.label).join(" and ")}`);
    if (s.kindHit) reasons.push(`Matches your pick: ${many(answers.kind).map((k) => kindLabel(k).toLowerCase()).filter(Boolean).join(" or ")}`);
    if (wanted.length) reasons.push(`Comes in ${sizeWord(size).toLowerCase()}, one of four sizes from Small to Extra large`);
    const real = s.animal.colourAsk ? 0 : s.animal.colours.length;
    if (real > 1 && (reasons.length < 2 || collector)) reasons.push(`The ${s.animal.name.toLowerCase()} comes in ${real} colourways in our shop`);
    if (s.animal.colourAsk) reasons.push("Colour is confirmed with you on WhatsApp");
    if (reasons.length === 0) reasons.push(`From our ${s.animal.categoryLabel.toLowerCase()} range`);
    return { animal: s.animal, colour: s.colour, size, reasons: reasons.slice(0, 3), score: s.score };
  });
}
