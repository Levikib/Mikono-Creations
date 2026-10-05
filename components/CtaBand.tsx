import type { ReactNode } from "react";
import { PromoBand } from "./card/Card";
import { toneForPath, type Tone } from "@/lib/cardTone";
import { cx } from "@/lib/cx";

type Cta = { label: string; href: string; track: string };

/**
 * The unified PromoBand: tone gradient, pattern, one primary action and an optional quiet second link.
 * Tone follows the destination of the primary action. Links carry data-track so the delegated listener in Deferred.tsx reports cta_click.
 */
export function CtaBand({ eyebrow, title, text, primary, secondary, tone, className }: {
  eyebrow?: string; title: string; text?: string; primary: Cta; secondary?: Cta; icon?: unknown; className?: string; tone?: Tone; children?: ReactNode;
}) {
  return (
    <div className={cx(className)}>
      <PromoBand tone={tone ?? toneForPath(primary.href)} tag={eyebrow} title={title} text={text ?? ""} primary={primary} secondary={secondary} />
    </div>
  );
}
