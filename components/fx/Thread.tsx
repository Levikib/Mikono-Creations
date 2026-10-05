/* eslint-disable @next/next/no-img-element -- decorative sprites and static variants: plain <img> keeps the client free of an image runtime */
import { living, type Template } from "@/data/living";
import { SPRITES } from "./manifest.generated";

/**
 * The thread: a progress rail down the edge of the page. Dashed ahead of you, a filled habitat coloured line behind you, a yarn ball
 * riding the head, and a knot on each band. Drawn with a CSS scroll() timeline where the browser has one (components/fx/fx.css);
 * the engine measures the page, lights the knots and drives the same transforms by hand where the timeline is missing.
 * Without any script it is a fully drawn line. aria-hidden, no pointer events, no layout.
 */
export function Thread({ t, mode }: { t: Template; mode: "on" | "static" }) {
  const knots = Object.entries(living(t).bands).filter(([, b]) => b.knot);
  return (
    <div className="fx-thread" data-mode={mode} aria-hidden="true">
      <div className="fx-t-line">
        <div className="fx-t-fill"><div className="fx-t-grad" /></div>
        <div className="fx-t-ahead">
          <span className="fx-ball">
                        <img src={SPRITES.yarn.url} alt="" width="24" height="24" decoding="async" draggable={false} />
          </span>
        </div>
      </div>
      {knots.map(([id, b]) => <i key={id} className="fx-knot" data-for={`${t}.${id}`} data-habitat={b.habitat} />)}
    </div>
  );
}
