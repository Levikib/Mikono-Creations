/* eslint-disable @next/next/no-img-element -- decorative sprites and static variants: plain <img> keeps the client free of an image runtime */
import type { CSSProperties } from "react";
import { living, gameDef, type Template } from "@/data/living";
import { SPRITES } from "./manifest.generated";
import { Character } from "./Character";

/**
 * A strip of ground between two sections where animals live: a stitched ground line, a few props, and one to three animals
 * that rise when the thread reaches the band. It is in the page flow with a fixed height, so it never covers text, never moves
 * the layout and never overlaps a tap target. What is in it comes from data/living/<template>.json.
 */
export function Band({ t, id, className, nested, live }: { t: Template; id: string; className?: string; nested?: boolean; live?: boolean }) {
  const def = living(t).bands[id];
  if (!def) return null;
  const [h, hl] = def.h ?? [52, 72];
  const key = `${t}.${id}`;
  return (
    <div className={`fx-band${nested ? " fx-band--nested" : ""}${className ? ` ${className}` : ""}`} data-fx-band={key} data-habitat={def.habitat} data-knot={def.knot ? "" : undefined}
      style={{ "--bh": `${h}px`, "--bhl": `${hl}px` } as CSSProperties}>
      <div className="fx-band-in">
        {def.props?.map((p, i) => (
          <span key={`p${i}`} className="fx-prop" data-flip={p.flip ? "" : undefined} aria-hidden="true"
            style={{ "--at": p.at, "--s": `${p.size[0]}px`, "--sl": `${p.size[1]}px` } as CSSProperties}>
                        <img src={SPRITES[p.sprite].url} alt="" width={p.size[0]} height={p.size[0]} loading="lazy" decoding="async" draggable={false} />
          </span>
        ))}
        {def.residents.map((r, i) => {
          const f = r.find ? gameDef.finds.find((x) => x.id === r.find) : undefined;
          return (
            <Character key={`${r.sprite}${i}`} sprite={r.sprite} role={r.role} at={r.at} size={r.size} prio={r.prio} inline={r.inline} flip={r.flip}
              seed={`${key}${i}`} calm={def.calm} live={live} anim={r.anim} min={r.min} find={f ? { id: f.id, name: f.name } : undefined} />
          );
        })}
      </div>
      <span className="fx-ground" aria-hidden="true" />
    </div>
  );
}
