"use client";
import { useState } from "react";
import { CardGrid } from "./card/Card";
import { ContentCard } from "./ContentCard";
import type { ContentCardData } from "./ContentCard";
import { ActiveFilters, type ActiveItem } from "./filters/ActiveFilters";
import { ChipGroup } from "./filters/ChipGroup";
import { EmptyResults } from "./filters/EmptyResults";
import { ResultCount } from "./filters/ResultCount";
import { SearchBox } from "./filters/SearchBox";
import { only, useQueryString, writeQuery } from "./filters/url";

export type IndexPost = { slug: string; pillar: string; card: ContentCardData };
const PAGE = 12;

/** Blog index: a search box ("Find a post"), topic chips with counts, a result count, removable chips and "Show more". State is in the address bar (?topic= and ?q=). */
export function JournalIndex({ posts, pillars }: { posts: IndexPost[]; pillars: { id: string; label: string }[] }) {
  const search = useQueryString();
  const sp = new URLSearchParams(search);
  const topic = only([sp.get("topic") ?? "all"], pillars.map((p) => p.id))[0] ?? "all";
  const q = sp.get("q") ?? "";
  const [more, setMore] = useState({ key: "", n: PAGE });
  const key = `${topic}|${q}`;
  const shown = more.key === key ? more.n : PAGE;

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = posts.filter((p) => { const hay = `${p.card.title} ${p.card.excerpt} ${p.card.tag ?? ""}`.toLowerCase(); return words.every((w) => hay.includes(w)); });
  const list = topic === "all" ? hits : hits.filter((p) => p.pillar === topic);
  const visible = Math.min(shown, list.length);
  const save = (t: string, text: string) => writeQuery({ topic: t === "all" ? "" : t, q: text });
  const topicLabel = pillars.find((p) => p.id === topic)?.label ?? "";
  const active: ActiveItem[] = [
    ...(q.trim() ? [{ key: "q", label: `Search: ${q.trim()}`, onRemove: () => save(topic, "") }] : []),
    ...(topic !== "all" ? [{ key: "t", label: `Topic: ${topicLabel}`, onRemove: () => save("all", q) }] : []),
  ];
  const options = [{ id: "all", label: "All posts" }, ...pillars].map((p) => ({ value: p.id, label: p.label, count: p.id === "all" ? hits.length : hits.filter((x) => x.pillar === p.id).length }));

  return (
    <>
      <div className="mb-3 grid gap-2">
        <SearchBox label="Find a post" value={q} onChange={(v) => save(topic, v)} />
        <ChipGroup legend="Topic" options={options} value={[topic]} onToggle={(v) => save(v === topic ? "all" : v, q)} />
        <ActiveFilters items={active} onClear={() => save("all", "")} />
      </div>
      <h2 className="mb-1 text-display-md">{topic === "all" ? "All posts" : topicLabel}</h2>
      <ResultCount shown={visible} total={list.length} one="post" many="posts" className="mb-2" />
      {list.length === 0 ? (
        <EmptyResults title="No posts match" text={q.trim() ? `No post mentions "${q.trim()}"${topic !== "all" ? ` in ${topicLabel}` : ""}. Take one off, or start again.` : "There are no posts in this topic yet."} items={active} onClear={() => save("all", "")} />
      ) : (
        <CardGrid rowMobile>
          {list.slice(0, shown).map((p, i) => <ContentCard key={p.slug} item={p.card} num={String(i + 1).padStart(2, "0")} />)}
        </CardGrid>
      )}
      {shown < list.length ? (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => setMore({ key, n: shown + PAGE })} className="btn-secondary hit-y inline-flex min-h-10 items-center rounded-full px-5 text-sm font-semibold">
            Show more posts ({list.length - shown} left)
          </button>
        </div>
      ) : null}
    </>
  );
}
