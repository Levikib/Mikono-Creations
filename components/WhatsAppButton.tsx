"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

/** Routes with their own sticky action bar (the Studio and the helpers). The float would sit on top of Next, so it stays away. */
const READING = /^\/(journal\/|story|care|safety|delivery|faq|size-guide|impact|returns|terms|privacy|cookies|legal|accessibility|complaints|data-request|projects\/|partners|supply)/;
const BAR_ROUTES = ["/custom/studio", "/gifts/finder", "/size-finder", "/build-a-family"];

/**
 * Floating chat link (D34). Hides on /cart, /order and the routes with a sticky action bar. On the home page it waits until the
 * hero has scrolled away, so it never sits on the hero panel. It sits above the consent control (the --dock-h variable)
 * and inside the safe area, so it never covers it and is never covered by it.
 */
export function WhatsAppButton({ href }: { href: string }) {
  const path = usePathname();
  const late = path === "/";
  const [past, setPast] = useState(false);
  useEffect(() => {
    if (!late) return;
    const on = () => setPast(window.scrollY > window.innerHeight * 0.75);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [late]);
  // Listing and product pages have their own WhatsApp action on every card or buy box, and the float sat on top of the right column.
  const own = path.startsWith("/shop");
  // Anywhere else it hides while it would cover a card action or link.
  const [covering, setCovering] = useState(false);
  // Reading pages (articles, long guides, legal): the float is smaller, and it steps aside while you scroll down and returns when you scroll up,
  // so it never sits on a line of text. It also steps aside over the footer.
  const reading = READING.test(path);
  const [away, setAway] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const foot = document.querySelector("footer");
    let inFoot = false;
    const io = foot && typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([e]) => { inFoot = e.isIntersecting; setAway(inFoot || (reading && window.scrollY > 160 && window.scrollY >= last)); }, { threshold: 0.05 }) : null;
    io?.observe(foot!);
    const on = () => {
      const y = window.scrollY;
      const down = y > last + 4, up = y < last - 4;
      if (down || up) setAway(inFoot || (reading && y > 160 && down));
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); io?.disconnect(); };
  }, [path, reading]);
  useEffect(() => {
    // Runs once the scroll settles (not every frame): the check reads the rect of every card action, which forces a layout.
    let t = 0;
    const run = () => {
      const f = document.querySelector<HTMLElement>(".wa-float");
      if (!f) return;
      const r = f.getBoundingClientRect();
      const hit = [...document.querySelectorAll<HTMLElement>("[data-cta], .mk-cta, .mk-link, .mk-foot svg")].some((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.right > r.left && b.left < r.right && b.bottom > r.top && b.top < r.bottom;
      });
      setCovering(hit);
    };
    const check = () => { window.clearTimeout(t); t = window.setTimeout(run, 90); };
    run();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.clearTimeout(t); window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [path]);
  if (own || path === "/cart" || path.startsWith("/order") || BAR_ROUTES.some((r) => path.startsWith(r))) return null;
  const external = href.startsWith("http");
  return (
    <a href={href} aria-label="Chat with us on WhatsApp" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-late={covering || away || (late && !past) ? "out" : late ? "in" : undefined} data-reading={reading ? "" : undefined}
      className="wa-float btn-whatsapp on-dark group fixed z-30 inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3">
      <Icon name="whatsapp" size={24} />
      <span className="hidden text-sm font-semibold group-hover:inline group-focus-visible:inline">Chat</span>
    </a>
  );
}
