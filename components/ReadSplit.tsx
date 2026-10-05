import type { ReactNode } from "react";
import Link from "next/link";
import { WhatsAppLink } from "@/components/Scrap";

/**
 * Text page layout: a reading column (about 70 characters) plus a sidebar that uses the rest of the container.
 * The sidebar stacks under the text below 1024 px. Pass your own aside content, or links for a default "Keep reading" card.
 */
export function ReadSplit({ children, aside, links, ask = "Hello Mikono Creations, I have a question." }: {
  children: ReactNode; aside?: ReactNode; links?: { href: string; label: string }[]; ask?: string;
}) {
  return (
    <div className="read-split">
      <div className="read-main">{children}</div>
      <aside className="read-aside" aria-label="Related">
        {aside}
        {links?.length ? (
          <div className="read-card">
            <p className="eyebrow">Keep reading</p>
            <ul>
              {links.map((l) => <li key={l.href}><Link href={l.href} className="hit-y">{l.label}</Link></li>)}
            </ul>
          </div>
        ) : null}
        <div className="read-card">
          <p className="eyebrow">A question?</p>
          <p>A person replies on WhatsApp.</p>
          <div className="mt-2"><WhatsAppLink text={ask} label="Ask on WhatsApp" variant="ghost" size="compact" /></div>
        </div>
      </aside>
    </div>
  );
}
