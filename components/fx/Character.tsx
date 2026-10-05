/* eslint-disable @next/next/no-img-element -- decorative sprites and static variants: plain <img> keeps the client free of an image runtime */
import { useId, type CSSProperties } from "react";
import "./fx.css";
import type { Role } from "@/data/living/types";
import { SVG } from "./cast.generated";
import { SPRITES, type SpriteId } from "./manifest.generated";
import { hash, safeId, scopeSvg } from "./svgIds";

export interface CharacterProps {
  /** Sprite id from the manifest, for example "giraffe" or "cheetah-stand". */
  sprite: SpriteId;
  /** Box size in px, or [phone, from 900px]. */
  size?: number | [number, number];
  /** Position along a band, 0 to 100 (percent). Not used with `free`. */
  at?: number;
  role?: Role;
  /** 1 to 5. Higher wins a live slot. */
  prio?: number;
  /** Inline SVG so eyes, tail and ears can move. Otherwise a lazy <img>. */
  inline?: boolean;
  flip?: boolean;
  /** Makes the character one of the hidden finds: a button with an accessible name. */
  find?: { id: string; name: string };
  /** No idle motion (near forms). */
  calm?: boolean;
  /** Animated from the server, without the engine (404, cart, order sent). The page must keep to the animal budget by itself. */
  live?: boolean;
  /** Hide on phones ("md") or in the lite tier ("lite"), to keep a small parade within the budget. */
  min?: "md" | "lite";
  /** Standing on its own in the page flow (404, cart, order sent) instead of inside a band. */
  free?: boolean;
  /** Free standing idle style. */
  anim?: "lost" | "celebrate";
  seed?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * One animal. Server rendered, still, complete. Decorative: aria-hidden and no pointer events, except a hidden find,
 * which is a real button (see components/fx/engine/game.ts). Blink period and start delay come from a deterministic hash
 * so server and browser agree and two animals never blink together.
 */
export function Character({ sprite, size = 64, at = 50, role = "rise", prio = 2, inline, flip, find, free, calm, live, min, anim, seed = "", className, style }: CharacterProps) {
  const uid = safeId(useId());
  const meta = SPRITES[sprite];
  const h = hash(`${sprite}:${seed}:${uid}`);
  const [s, sl] = Array.isArray(size) ? size : [size, size];
  const vars = {
    "--s": `${s}px`,
    "--sl": `${sl}px`,
    "--at": at,
    "--fx-d": `${((h % 4000) / 1000).toFixed(2)}s`,
    "--fx-b": `${(4 + ((h >> 8) % 2000) / 1000).toFixed(2)}s`,
    "--fx-t": role === "walk" ? `${22 + ((h >> 4) % 10)}s` : `${8 + ((h >> 4) % 5)}s`,
    ...style,
  } as CSSProperties;
  const cls = `fx-char${find ? " fx-find" : ""}${className ? ` ${className}` : ""}`;
  const kind = inline ? "svg" : "img";
  const common = {
    className: cls,
    style: vars,
    "data-sp": sprite,
    "data-role": role,
    "data-prio": prio,
    "data-kind": kind,
    "data-flip": flip ? "" : undefined,
    "data-free": free ? "" : undefined,
    "data-anim": anim,
    "data-calm": calm ? "" : undefined,
    "data-live": live ? "1" : undefined,
    "data-min": min,
  };
  const body = inline
    ? { dangerouslySetInnerHTML: { __html: scopeSvg(SVG[sprite], `c${uid}-`) } }
    : { children: <img src={meta.url} alt="" width={s} height={s} loading="lazy" decoding="async" draggable={false} /> };
  if (find) {
    return <button type="button" {...common} data-find={find.id} data-name={find.name} aria-label="Hidden animal: tap to find it" {...body} />;
  }
  return <span {...common} aria-hidden="true" {...body} />;
}
