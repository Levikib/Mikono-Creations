import type { ReactNode } from "react";

const RE = /(\[[A-Z0-9][A-Z0-9 /,'()+:.]*\])/g;

/** Text with [PLACEHOLDERS] shown as a muted highlight, so the owner can see what is still to be filled in. */
export function Marked({ text }: { text: string }): ReactNode {
  return text.split(RE).map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="legal-ph" title="To be completed by the business">{part}</mark> : part,
  );
}

/** Box listing the placeholders a document still has. */
export function PlaceholderCallout({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside aria-label="To be completed by the business" className="legal-callout">
      <details>
        <summary><b>To be completed by the business</b> <span>({items.length} {items.length === 1 ? "item" : "items"})</span></summary>
        <p>These details are not decided yet. They are highlighted in the text below.</p>
        <ul>{items.map((p) => <li key={p}><mark className="legal-ph">{p}</mark></li>)}</ul>
      </details>
    </aside>
  );
}
