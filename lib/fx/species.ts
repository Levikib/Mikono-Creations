// Which animal sprite stands in for a product species: the head that peeks over a card, and the one that hops into the basket.
// Server code only (it reads the sprite manifest). The browser gets plain URLs in data attributes.
import { SPRITES, type SpriteId } from "@/components/fx/manifest.generated";

/** Sprite and the fraction of the 200 box where the head starts (so a peeking crop can show head first). */
const PEEK: Record<string, [SpriteId, number]> = {
  giraffe: ["giraffe", 0.083], elephant: ["elephant", 0.395], lion: ["lion", 0.34], rabbit: ["rabbit", 0], hippo: ["hippo", 0.45],
  rhino: ["rhino", 0.44], zebra: ["zebra", 0.388], monkey: ["monkey", 0.12], octopus: ["octopus", 0.155], turtle: ["turtle", 0.345],
  cat: ["cat-walk", 0.335], dog: ["dog-sit", 0.185], chameleon: ["chameleon-perch", 0.393], "secretary bird": ["secretary-bird-stand", 0.055],
  warthog: ["warthog-peek", 0.325],
};

export function peekFor(species: string): { src: string; cy: number } | undefined {
  const e = PEEK[species];
  return e ? { src: SPRITES[e[0]].url, cy: e[1] } : undefined;
}

/** The animal that hops into the basket when a piece is added: the species where there is one, else by category. */
export function hopSprite(species: string, category: string): string {
  const own = PEEK[species];
  if (own && category !== "wall-art" && category !== "dolls") return SPRITES[own[0]].url;
  if (category === "wall-art" || category === "dolls") return SPRITES.rabbit.url;
  return SPRITES.yarn.url;
}
