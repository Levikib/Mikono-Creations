import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Container } from "./Container";

type Tone = "bone" | "oat" | "sand" | "dark" | "kitenge" | "olive";

/** Retired decorative divider. Kept so older pages still compile; it draws nothing. */
export function PatternBand(_props: { className?: string; kind?: "kitenge" | "bead" }) {
  void _props;
  return null;
}

// Bone sections sit on the page; oat and sand are a quiet band with hairline edges. Dark tones are retired:
// the dusk look is for the splash and the footer only, so they fall back to the oat band.
const tones: Record<Tone, string> = {
  bone: "",
  oat: "border-y border-[var(--hairline)] bg-oat/60",
  sand: "border-y border-[var(--hairline)] bg-oat/60",
  dark: "border-y border-[var(--hairline)] bg-oat/60",
  kitenge: "border-y border-[var(--hairline)] bg-oat/60",
  olive: "border-y border-[var(--hairline)] bg-oat/60",
};

/** Retired soft shapes. Draws nothing. */
export function ClayShapes(_props: { variant?: "a" | "b" }) {
  void _props;
  return null;
}

export function Section({ tone = "bone", className, id, labelledBy, compact, children }: {
  tone?: Tone; className?: string; id?: string; labelledBy?: string; shapes?: "a" | "b"; compact?: boolean; children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx("cv-section overflow-x-clip", compact ? "py-3 md:py-5" : "py-4 md:py-6", tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({ id, title, lede, action, align = "left", eyebrow, ledeFrom }: {
  id?: string; title: string; lede?: string; action?: ReactNode; align?: "left" | "center"; dark?: boolean; eyebrow?: string; ledeFrom?: "md";
}) {
  return (
    <div className={cx("mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-0.5 md:mb-4", align === "center" && "justify-center text-center")}>
      <div className={cx("max-w-[62ch]", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
        <h2 id={id} className="text-display-md">{title}</h2>
        {lede ? <p className={cx("mt-1 text-base text-stone", ledeFrom === "md" && "max-md:hidden")}>{lede}</p> : null}
      </div>
      {action}
    </div>
  );
}
