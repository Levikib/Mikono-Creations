import type { ReactNode } from "react";
import { Container } from "./Container";
import { WaveDivider } from "./WaveDivider";
import { PatternBand } from "./Section";

export function PageHero({ eyebrow, title, lede, actions, media, children, actionsClassName }: {
  eyebrow?: string; title: string; lede?: string; actions?: ReactNode; media?: ReactNode; children?: ReactNode; actionsClassName?: string;
}) {
  return (
    <div className="overflow-x-clip bg-oat">
      <PatternBand kind="kitenge" className="border-0" />
      <Container className="grid items-center gap-3 py-4 md:gap-4 md:grid-cols-[1.1fr_.9fr] md:py-6 xl:grid-cols-[6fr_5fr] xl:gap-6">
        <div>
          {eyebrow ? <p className="mb-3 text-base font-semibold text-ochre-deep">{eyebrow}</p> : null}
          <h1 className="text-[1.5rem] leading-[1.1] sm:text-display-lg">{title}</h1>
          {lede ? <p className="mt-3 max-w-[52ch] text-[.9375rem] leading-[1.5] sm:mt-4 sm:text-[.9375rem] sm:leading-[1.55] text-charcoal">{lede}</p> : null}
          {actions ? <div className={actionsClassName ?? "mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row"}>{actions}</div> : null}
          {children}
        </div>
        {media ? (
          <div className="relative order-first mx-auto w-full max-w-[150px] sm:max-w-[240px] md:order-none md:max-w-[520px]">
            <span aria-hidden="true" className="clay-shape blob-b -left-3 -top-2 size-[72%] bg-terracotta-tint md:-left-6 md:-top-4" />
            <span aria-hidden="true" className="clay-shape blob-c -bottom-2 -right-2 size-[58%] bg-olive-tint md:-bottom-5 md:-right-5" />
            <span aria-hidden="true" className="clay-shape right-3 top-0 hidden size-10 rounded-full bg-ochre-tint md:block" />
            <div className="relative">{media}</div>
          </div>
        ) : null}
      </Container>
      <WaveDivider variant="hills" className="-mb-px text-bone" />
    </div>
  );
}
