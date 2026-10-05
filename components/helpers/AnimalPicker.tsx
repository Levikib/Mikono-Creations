"use client";
import { useState } from "react";
import { AnimalPhoto } from "./AnimalPhoto";
import type { GroupKey, HelperAnimal } from "@/lib/helpers/types";

const TABS: { key: string; label: string; groups: GroupKey[] }[] = [
  { key: "safari", label: "Safari", groups: ["safari"] },
  { key: "pets", label: "Farm and pets", groups: ["pets"] },
  { key: "more", label: "Sea, birds and more", groups: ["sea", "air", "other"] },
  { key: "wall", label: "Wall art", groups: ["wall"] },
  { key: "dolls", label: "Dolls", groups: ["dolls"] },
];

/**
 * Grid of real animals. One tap adds one to the family. Cards are equal: square photo, one name line, one add control.
 * counts maps an animal slug to how many are already in the family.
 */
export function AnimalPicker({ animals, counts, onAdd }: { animals: HelperAnimal[]; counts: Record<string, number>; onAdd: (a: HelperAnimal) => void }) {
  const [tab, setTab] = useState("safari");
  const groups = TABS.find((t) => t.key === tab)!.groups;
  const shown = animals.filter((a) => groups.includes(a.group));
  return (
    <section aria-labelledby="mkh-pick-title" className="min-w-0">
      <h2 id="mkh-pick-title" className="text-display-md">Pick your animals</h2>
      <p className="mkh-muted mt-1 text-[.9375rem] leading-snug">Tap an animal to add it. Tap it again to add the same animal in another size or colour. You can change colour, size and number in your family.</p>
      <div role="group" aria-label="Animal group" className="mt-3 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} type="button" aria-pressed={tab === t.key} onClick={() => setTab(t.key)}
            className="mkh-btn-text aria-pressed:!bg-[var(--h-ink)] aria-pressed:!text-[var(--h-bone)] aria-pressed:!shadow-none">
            {t.label}
          </button>
        ))}
      </div>
      <ul data-card-group className="mt-3 grid grid-cols-2 gap-2.5 [grid-auto-rows:1fr] sm:grid-cols-3 md:gap-3 xl:grid-cols-3">
        {shown.map((a, i) => {
          const n = counts[a.slug] ?? 0;
          return (
            <li key={a.slug} className="flex">
              <button type="button" onClick={() => onAdd(a)} data-card="helper-animal"
                aria-label={`Add ${a.name} to your family${n ? `, ${n} already in your family` : ""}`}
                className="mkh-card group relative flex w-full flex-col gap-2 p-1.5 text-left transition-transform duration-200 active:scale-[.97]">
                <AnimalPhoto image={a.colours[0].image} alt="" sizes="(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw" eager={i < 4} />
                {n ? <span className="mkh-pop absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[.875rem] font-bold" style={{ background: "var(--h-accent)", color: "var(--h-bone)" }} aria-hidden="true">{n}</span> : null}
                <span className="flex min-h-11 items-center justify-between gap-2 px-1.5 pb-0.5">
                  <span className="min-w-0 truncate font-display text-[.9375rem] font-bold leading-tight md:text-base">{a.name}</span>
                  <span className="flex size-9 flex-none items-center justify-center rounded-full" style={{ background: "var(--h-ink)", color: "var(--h-bone)" }} aria-hidden="true"><span className="text-[1.125rem] leading-none">+</span></span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
