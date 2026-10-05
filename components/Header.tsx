import { whatsappUrl } from "@/lib/env";
import { buildMenu } from "@/lib/menu";
import { SiteNav } from "./SiteNav";

/**
 * Floating pill bar with mega panels (desktop) and a full screen sheet (mobile).
 * The wrapper keeps the bar's space in the page flow, so the bar itself can be fixed and shrink on scroll without moving content.
 */
export function Header() {
  const wa = whatsappUrl() ?? "/contact";
  return (
    <header className="nav-spacer">
      <SiteNav panels={buildMenu()} whatsappHref={wa} />
    </header>
  );
}
