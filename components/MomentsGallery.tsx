import { MomentCard } from "./card/Card";
import type { Moment } from "@/data/home";

/** Captured moments: the unified photo card, 3 across on phones (first six) and 4 across from 1024. Captions show from 640 px. */
export function MomentsGallery({ items }: { items: readonly Moment[] }) {
  return (
    <ul data-card-group aria-label="Captured moments" className="mk-grid mk-grid--p3">
      {items.map((m, i) => (
        <li key={m.src} className={i >= 6 ? "max-md:hidden" : undefined}>
          <MomentCard image={{ src: m.src, alt: m.alt, focal: m.focal }} caption={m.caption} sizes="(min-width:1280px) 200px, (min-width:768px) 22vw, 32vw" />
        </li>
      ))}
    </ul>
  );
}
