"use client";
import { useEffect, type ReactNode } from "react";
import { ActiveFilters, type ActiveItem } from "./filters/ActiveFilters";
import { ChipGroup } from "./filters/ChipGroup";
import { EmptyResults } from "./filters/EmptyResults";
import { ResultCount } from "./filters/ResultCount";
import { SearchBox } from "./filters/SearchBox";
import { only, useQueryString, writeQuery } from "./filters/url";

/** Per group: its id, its title and the lower case question and answer text of each item (for search). */
export type FaqIndex = { id: string; title: string; text: string[] };

/**
 * FAQ filter: a search box ("Find a question"), topic chips with counts, a result count and removable chips.
 * The questions are rendered once by the server (children, so search engines and people without script see them all);
 * this part only hides and shows them, so the page ships no list code to the phone.
 */
export function FaqFilter({ index, whatsapp, children }: { index: FaqIndex[]; whatsapp: ReactNode; children: ReactNode }) {
  const search = useQueryString();
  const sp = new URLSearchParams(search);
  const cat = only([sp.get("topic") ?? "all"], index.map((g) => g.id))[0] ?? "all";
  const q = sp.get("q") ?? "";
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (t: string) => words.every((w) => t.includes(w));
  const per = index.map((g) => g.text.filter(hit).length);
  const total = index.reduce((n, g) => n + g.text.length, 0);
  const shown = index.reduce((n, g, i) => n + (cat === "all" || g.id === cat ? per[i] : 0), 0);
  const save = (t: string, text: string) => writeQuery({ topic: t === "all" ? "" : t, q: text });
  const catLabel = index.find((g) => g.id === cat)?.title ?? "";
  const active: ActiveItem[] = [
    ...(q.trim() ? [{ key: "q", label: `Search: ${q.trim()}`, onRemove: () => save(cat, "") }] : []),
    ...(cat !== "all" ? [{ key: "t", label: `Topic: ${catLabel}`, onRemove: () => save("all", q) }] : []),
  ];

  useEffect(() => {
    index.forEach((g, gi) => {
      const sec = document.getElementById(`faq-${g.id}`);
      if (!sec) return;
      const ds = sec.querySelectorAll<HTMLElement>("details");
      let n = 0;
      ds.forEach((d, i) => { const ok = hit(g.text[i] ?? ""); d.hidden = !ok; if (ok) n++; });
      sec.hidden = (cat !== "all" && g.id !== cat) || n === 0 || per[gi] === 0;
    });
    const list = document.getElementById("faq-list");
    if (list) list.hidden = shown === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <SearchBox label="Find a question" value={q} onChange={(v) => save(cat, v)} />
        <ChipGroup legend="Topic" value={[cat]} onToggle={(v) => save(v === cat ? "all" : v, q)}
          options={[{ value: "all", label: "All questions", count: per.reduce((a, b) => a + b, 0) }, ...index.map((g, i) => ({ value: g.id, label: g.title, count: per[i] }))]} />
        <ActiveFilters items={active} onClear={() => save("all", "")} />
        <ResultCount shown={shown} total={total} one="question" many="questions" />
      </div>
      {shown === 0 ? <EmptyResults title="No questions match" text={`No answer mentions "${q.trim()}". Take it off, or ask us directly.`} items={active} onClear={() => save("all", "")} extra={<div>{whatsapp}</div>} /> : null}
      {children}
    </div>
  );
}
