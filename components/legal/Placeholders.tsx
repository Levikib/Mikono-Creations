import type { ReactNode } from "react";
import { CONTACT_EMAIL, CONTACT_EMAIL_LINK } from "@/lib/site";

const RE = /(\[[A-Z0-9][A-Z0-9 /,'()+:.]*\])/g;

/** Text with [PLACEHOLDERS] shown as a muted highlight, so the owner can see what is still to be filled in. */
export function Marked({ text }: { text: string }): ReactNode {
  return text.split(RE).map((part, i) => {
    if (i % 2 === 1) return <mark key={i} className="legal-ph" title="To be completed by the business">{part}</mark>;
    // The business email becomes a working mail link (the link is lower case, the text stays as the client wrote it).
    if (!part.includes(CONTACT_EMAIL)) return part;
    const bits = part.split(CONTACT_EMAIL);
    return bits.flatMap((b, j) => (j < bits.length - 1 ? [b, <a key={`${i}-${j}`} href={CONTACT_EMAIL_LINK}>{CONTACT_EMAIL}</a>] : [b]));
  });
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
