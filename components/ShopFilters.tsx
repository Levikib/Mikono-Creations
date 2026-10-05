"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ActiveFilters, type ActiveItem } from "./filters/ActiveFilters";
import { EmptyResults } from "./filters/EmptyResults";
import { ChipGroup, type Opt } from "./filters/ChipGroup";
import { RowGroup } from "./filters/RowGroup";
import { FilterBar, SortSelect } from "./filters/FilterBar";
import { FilterSection } from "./filters/FilterSection";
import { FilterSheet } from "./filters/FilterSheet";
import { ResultCount } from "./filters/ResultCount";
import { SearchBox } from "./filters/SearchBox";
import { only, useQueryString, writeQuery } from "./filters/url";
import "./filters/filters.css";

/** What the client needs to filter: no photos or card copy, only the facets of each item in grid order. */
export type FilterItem = { name: string; species: string; colours: string[]; sizes: string[]; several: boolean };
export type FilterData = {
  base: string; unitPieces: boolean;
  species: { key: string; label: string }[]; colours: { key: string; label: string }[]; sizes: { key: string; label: string }[]; sizesDiffer: boolean;
  items: FilterItem[];
};
type Facets = { animal: string[]; colour: string[]; size: string[]; several: boolean; q: string; sort: string };
const SORTS = [{ value: "featured", label: "Featured" }, { value: "az", label: "A to Z" }];
const EMPTY: Facets = { animal: [], colour: [], size: [], several: false, q: "", sort: "featured" };

const matches = (it: FilterItem, f: Facets) => {
  const hay = it.name.toLowerCase();
  return (!f.animal.length || f.animal.includes(it.species))
    && (!f.colour.length || it.colours.some((c) => f.colour.includes(c)))
    && (!f.size.length || f.size.some((s) => it.sizes.includes(s)))
    && (!f.several || it.several)
    && f.q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
};
const save = (f: Facets) => writeQuery({ animal: f.animal, colour: f.colour, size: f.size, several: f.several ? "1" : "", q: f.q, sort: f.sort === "az" ? "az" : "" });

/**
 * The shop filter: search, sort, a sticky slim bar, a bottom sheet on phones and a sticky sidebar on desktop, all fed by the same groups.
 * It filters the grid the server already rendered (children): it hides, shows and reorders the list items that are in the page, so the first view
 * is never re-rendered and a filtered address never reaches a function. State is in the address bar.
 */
export function ShopFilters({ data, children }: { data: FilterData; children: ReactNode }) {
  const search = useQueryString();
  const sp = new URLSearchParams(search);
  const f: Facets = {
    animal: only(sp.getAll("animal"), data.species.map((s) => s.key)),
    colour: only(sp.getAll("colour"), data.colours.map((c) => c.key)),
    size: only(sp.getAll("size"), data.sizes.map((s) => s.key)),
    several: sp.get("several") === "1",
    q: sp.get("q") ?? "",
    sort: sp.get("sort") === "az" ? "az" : "featured",
  };
  const [sheet, setSheet] = useState(false);
  const { items } = data;
  const total = items.length;
  const results = items.filter((it) => matches(it, f)).length;
  const unit = (n: number) => (data.unitPieces ? (n === 1 ? "piece" : "pieces") : (n === 1 ? "animal" : "animals"));
  const noun = [unit(1), unit(2)] as const;
  const count = (k: "animal" | "colour" | "size", v: string) => items.filter((it) => matches(it, { ...f, [k]: [v] })).length;
  const key = search;

  const label = { animal: (v: string) => data.species.find((s) => s.key === v)?.label ?? v, colour: (v: string) => data.colours.find((c) => c.key === v)?.label ?? v, size: (v: string) => data.sizes.find((s) => s.key === v)?.label ?? v };
  const active: ActiveItem[] = [
    ...(f.q.trim() ? [{ key: "q", label: `Search: ${f.q.trim()}`, onRemove: () => save({ ...f, q: "" }) }] : []),
    ...f.animal.map((v) => ({ key: `a-${v}`, label: `Type of animal: ${label.animal(v)}`, onRemove: () => save({ ...f, animal: f.animal.filter((x) => x !== v) }) })),
    ...f.colour.map((v) => ({ key: `c-${v}`, label: `Colour: ${label.colour(v)}`, onRemove: () => save({ ...f, colour: f.colour.filter((x) => x !== v) }) })),
    ...f.size.map((v) => ({ key: `s-${v}`, label: `Size: ${label.size(v)}`, onRemove: () => save({ ...f, size: f.size.filter((x) => x !== v) }) })),
    ...(f.several ? [{ key: "m", label: "Colour choice: several", onRemove: () => save({ ...f, several: false }) }] : []),
  ];
  const clearAll = () => save({ ...EMPTY, sort: f.sort });
  const flip = (k: "animal" | "colour" | "size", v: string) => save({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });

  // Apply the filter and the sort to the server rendered grid.
  useEffect(() => {
    const ul = document.querySelector<HTMLElement>("#products ul[data-card-group]");
    if (!ul) return;
    const lis = Array.from(ul.children) as HTMLElement[];
    lis.forEach((li, i) => { if (li.dataset.i === undefined) li.dataset.i = String(i); });
    const idx = (li: HTMLElement) => Number(li.dataset.i);
    const ordered = [...lis].sort((a, b) => (f.sort === "az" ? items[idx(a)].name.localeCompare(items[idx(b)].name) : 0) || idx(a) - idx(b));
    if (ordered.some((li, i) => li !== lis[i])) ul.append(...ordered);
    const fam = f.colour[0];
    lis.forEach((li) => {
      const it = items[idx(li)];
      if (!it) return;
      li.hidden = !matches(it, f);
      const img = li.querySelector<HTMLImageElement>("img");
      if (!img) return;
      if (img.dataset.o === undefined) { img.dataset.o = img.getAttribute("srcset") ?? ""; img.dataset.s = img.getAttribute("src") ?? ""; }
      const map = li.dataset.cimg ? (JSON.parse(li.dataset.cimg) as Record<string, string>) : null;
      const alt = fam && map ? map[fam] : undefined;
      if (alt) { img.removeAttribute("srcset"); img.src = alt; }
      else if (img.dataset.s) { if (img.dataset.o) img.setAttribute("srcset", img.dataset.o); img.src = img.dataset.s; }
    });
    const wrap = document.getElementById("shop-grid-wrap");
    if (wrap) wrap.hidden = results === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const list = (k: "animal" | "colour" | "size", src: { key: string; label: string }[]): Opt[] => src.map((s) => ({ value: s.key, label: s.label, count: count(k, s.key) }));
  const say = (k: "animal" | "colour" | "size") => (f[k].length ? f[k].map(label[k]).join(", ") : "Any");
  const groups = (inSheet: boolean) => (
    <>
      <FilterSection title="Type of animal" summary={say("animal")} chosen={f.animal.length} defaultOpen>
        <ChipGroup legend="Type of animal" hideLegend limit={8} options={list("animal", data.species)} value={f.animal} onToggle={(v) => flip("animal", v)} />
      </FilterSection>
      <FilterSection title="Colour" summary={say("colour")} chosen={f.colour.length} defaultOpen={!inSheet}>
        <RowGroup legend="Colour" hideLegend options={list("colour", data.colours)} value={f.colour} onToggle={(v) => flip("colour", v)} />
      </FilterSection>
      {data.sizesDiffer ? (
        <FilterSection title="Size" summary={say("size")} chosen={f.size.length} defaultOpen={!inSheet}>
          <ChipGroup legend="Size" hideLegend options={list("size", data.sizes)} value={f.size} onToggle={(v) => flip("size", v)} />
        </FilterSection>
      ) : null}
      <FilterSection title="Colour choice" summary={f.several ? "Several colours" : "Any"} chosen={f.several ? 1 : 0} defaultOpen={!inSheet}>
        <RowGroup legend="Colour choice" hideLegend options={[{ value: "several", label: "Comes in several colours", count: items.filter((it) => matches(it, { ...f, several: true })).length }]} value={f.several ? ["several"] : []} onToggle={() => save({ ...f, several: !f.several })} />
      </FilterSection>
    </>
  );

  return (
    <>
      <div className="mf-layout">
        <aside className="mf-side" aria-label="Filters">
          <div className="mf-side-head"><h2>Filters</h2>{active.length ? <button type="button" className="mf-text-btn" onClick={clearAll}>Clear all</button> : null}</div>
          {groups(false)}
        </aside>
        <div className="mf-main">
          <FilterBar
            activeCount={active.filter((a) => a.key !== "q").length} onOpen={() => setSheet(true)}
            search={<SearchBox label="Find an animal by name" value={f.q} onChange={(q) => save({ ...f, q })} />}
            count={<ResultCount shown={results} total={total} one={noun[0]} many={noun[1]} />}
            sort={<SortSelect value={f.sort} options={SORTS} onChange={(sort) => save({ ...f, sort })} />}
          />
          <ActiveFilters sidebar items={active} onClear={clearAll} />
          {results === 0 ? (
            <EmptyResults title={`No ${noun[1]} match`} onClear={clearAll} items={active}
              text={`${f.q.trim() && active.length === 1 ? `Nothing is named "${f.q.trim()}".` : `No ${unit(1)} fits all of your choices together.`} Take one off, or start again.`}
              extra={<p>Cannot find your animal? <Link prefetch={false} href="/custom/studio?type=new_animal&src=shop" className="mf-text-btn">Tell us about it</Link></p>} />
          ) : null}
          {children}
        </div>
      </div>
      <FilterSheet open={sheet} onClose={() => setSheet(false)} canClear={active.length > 0} onClear={clearAll}
        doneLabel={results ? `Show ${results} ${unit(results)}` : `No ${noun[1]} match yet`}>
        {groups(true)}
      </FilterSheet>
    </>
  );
}
