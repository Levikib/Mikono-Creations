import Image from "@/components/Img";
import Link from "next/link";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { FooterActions } from "./FooterActions";
import { Band } from "./fx/Band";
import { AnimalsBar } from "./fx/AnimalsBar";
import { gameDef } from "@/data/living";
import { CONTACT_EMAIL, CONTACT_EMAIL_LINK, PHONE_DISPLAY, PHONE_TEL, footerGroups, legalLinks, site } from "@/lib/site";

const link = "hit-y inline-flex min-h-8 items-center text-[.8125rem] text-dusk-ink/90 hover:text-amber hover:underline underline-offset-4";

/** Dusk band: the dark amber-lit footer. Link groups are an accordion on phones and open columns from 768 px. */
export function Footer() {
  return (
    <footer className="dusk on-dark mt-auto">
      {/* The water hole. Shown only on pages that carry animals (footer-fx.css); legal, cart and order pages stay calm. */}
      <div className="fx-pond"><Band t="footer" id="pond" /></div>
      <Container className="grid gap-3 pb-3 pt-5 md:grid-cols-[1.3fr_repeat(4,1fr)] md:gap-3 md:pt-8">
        <div className="max-w-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-paper shadow-clay-dark"><Image src="/logo-mark.png" alt="" width={44} height={46} className="h-5 w-auto" /></span>
            <span className="font-display text-base font-bold tracking-[-.04em] text-dusk-ink">{site.name}</span>
          </div>
          <p className="mt-2 text-[.8125rem] text-dusk-soft">Crocheted animals, handmade in Nairobi from recycled acrylic yarn.</p>
          <p className="mt-1">
            <a href={PHONE_TEL} className="hit-y inline-flex min-h-8 items-center gap-2 text-[.8125rem] font-semibold text-dusk-ink underline underline-offset-4 hover:text-amber">
              <Icon name="phone" size={16} /><span className="sr-only">Call us on </span>{PHONE_DISPLAY}
            </a>
          </p>
          <p>
            <a href={CONTACT_EMAIL_LINK} className="hit-y inline-flex min-h-8 items-center text-[.8125rem] font-semibold text-dusk-ink underline underline-offset-4 hover:text-amber">
              <span className="sr-only">Email us at </span>{CONTACT_EMAIL}
            </a>
          </p>
          <div className="mt-1 flex gap-3">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Mikono Creations on Facebook" className="hit-area inline-flex size-9 items-center justify-center rounded-full bg-dusk-2 text-dusk-ink shadow-clay-dark hover:text-amber"><Icon name="facebook" size={18} /></a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Mikono Creations on Instagram" className="hit-area inline-flex size-9 items-center justify-center rounded-full bg-dusk-2 text-dusk-ink shadow-clay-dark hover:text-amber"><Icon name="instagram" size={18} /></a>
          </div>
        </div>

        {/* Phones: one accordion row per group. */}
        <div className="md:hidden">
          {footerGroups.map((g) => (
            <details key={g.title} className="group border-t border-dusk-ink/15 last:border-b">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-display text-[.9375rem] font-bold tracking-[-.02em] text-dusk-ink [&::-webkit-details-marker]:hidden">
                {g.title}<Icon name="chevron" size={16} className="text-amber transition-transform group-open:rotate-180" />
              </summary>
              <ul className="pb-1">
                {g.links.map((l) => <li key={l.href}><Link href={l.href} prefetch={false} className={link}>{l.label}</Link></li>)}
              </ul>
            </details>
          ))}
        </div>
        {/* From 768 px: open columns. */}
        {footerGroups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="hidden md:block">
            <h2 className="eyebrow">{g.title}</h2>
            <ul className="mt-1">
              {g.links.map((l) => <li key={l.href}><Link href={l.href} prefetch={false} className={link}>{l.label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-dusk-ink/15">
        <Container className="pt-1"><AnimalsBar total={gameDef.total} /></Container>
        <Container className="flex flex-col gap-0 py-1.5 md:flex-row md:items-center md:justify-between">
          <p className="text-[.8125rem] text-dusk-soft">&copy; {new Date().getFullYear()} {site.name}. Nairobi, Kenya.</p>
          <div className="flex flex-wrap items-center gap-x-3">
            {legalLinks.map((l) => <Link key={l.href} href={l.href} prefetch={false} className={link}>{l.label}</Link>)}
            <FooterActions />
          </div>
        </Container>
      </div>
    </footer>
  );
}
