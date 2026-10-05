// Types for the choreography files in data/living/*.json. One file per page template.
// Characters are referenced by sprite id (components/fx/manifest.generated.ts), so a typo fails the type check or scripts/check-living.mjs.
import type { PropName, SpriteId } from "@/components/fx/manifest.generated";

export type Habitat = "savanna" | "grove" | "nursery" | "pet" | "workshop" | "market" | "skyline" | "pond" | "cart";

/** How a resident shows up in its band. rise: grows out of the ground line. perch: settles in on a prop. float: drifts (butterfly, bee). walk: a slow pass along the ground. */
export type Role = "rise" | "perch" | "float" | "walk";

export interface Resident {
  sprite: SpriteId;
  role: Role;
  /** Horizontal position along the band, 0 to 100 (percent of the content width). */
  at: number;
  /** Box size in px: [phone, from 900px]. */
  size: [number, number];
  /** 1 to 5. A higher number wins a live (animated) slot when the budget is full. */
  prio: number;
  /** Inline SVG so the parts (eyes, tail, ears) can move. At most 3 per page; the rest are <img>. */
  inline?: boolean;
  flip?: boolean;
  /** Id of a hidden find (see data/living/game.json). Makes this resident a button. */
  find?: string;
  /** Free standing style for the 404 and order sent pages. */
  anim?: "lost" | "celebrate";
  /** Hide on phones ("md") or in the lite tier ("lite"). */
  min?: "md" | "lite";
}

export interface BandProp { sprite: PropName; at: number; size: [number, number]; flip?: boolean }

export interface BandDef {
  habitat: Habitat;
  /** The band carries a knot on the thread. */
  knot?: boolean;
  /** Band height in px: [phone, from 900px]. Default 52 and 72. */
  h?: [number, number];
  props?: BandProp[];
  /** No idle motion in this band (used near forms and Add buttons). Animals still rise once. */
  calm?: boolean;
  residents: Resident[];
}

export type ThreadMode = "on" | "static" | "off";

export interface PageDef {
  template: string;
  thread: ThreadMode;
  /** Hover and touch peek-a-boo on cards in grids marked data-peek. */
  peek?: boolean;
  bands: Record<string, BandDef>;
}

export interface FindDef { id: string; sprite: SpriteId; name: string; where: string }
export interface GameDef { total: number; finds: FindDef[] }

/** Seasonal variants are not built yet. The shape is reserved so a later release can add them without a schema change. */
export interface SeasonsDef { enabled: false; variants: Record<string, { from: string; to: string; swap: Record<string, string> }> }
