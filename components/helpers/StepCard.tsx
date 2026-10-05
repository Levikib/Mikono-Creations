import type { ReactNode, Ref } from "react";
import { buttonClass } from "@/components/Button";
import { Icon } from "@/components/Icon";

/**
 * One question. The heading takes focus when the step changes (headingRef). The action bar is sticky at the end of the
 * card, above the safe area and the consent dock, and it sits in the flow so it never covers the options above it.
 */
export function StepCard({ step, total, title, help, headingRef, children, onBack, onNext, onSkip, canNext, nextLabel = "Next" }: {
  step: number; total: number; title: string; help?: string; headingRef?: Ref<HTMLHeadingElement>; children: ReactNode;
  onBack?: () => void; onNext: () => void; onSkip?: () => void; canNext: boolean; nextLabel?: string;
}) {
  return (
    <section aria-labelledby="mkh-step-title" className="mkh-card mkh-rise p-3.5 md:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="mkh-eyebrow">Question {step} of {total}</p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className="h-1.5 w-6 rounded-full md:w-8" style={{ background: i < step ? "var(--h-accent)" : "var(--h-sand)" }} />
          ))}
        </div>
      </div>
      <h2 id="mkh-step-title" ref={headingRef} tabIndex={-1} className="mt-2 text-display-md outline-none">{title}</h2>
      {help ? <p className="mkh-muted mt-1 text-[.9375rem] leading-snug md:text-base">{help}</p> : null}
      <div className="mt-3.5">{children}</div>
      {onSkip ? (
        <div className="mt-1 flex justify-end">
          <button type="button" onClick={onSkip} className="mkh-btn-text !bg-transparent !shadow-none">Skip this question</button>
        </div>
      ) : null}
      <div className="mkh-bar">
        {onBack ? (
          <button type="button" onClick={onBack} className="mkh-btn-text min-w-11 !px-3 max-[399px]:!px-0" aria-label="Back to the previous question">
            <Icon name="back" size={18} /><span className="max-[399px]:sr-only">Back</span>
          </button>
        ) : <span className="w-2" />}
        <button type="button" onClick={onNext} aria-disabled={!canNext}
          className={buttonClass("primary", "compact", "ml-auto min-w-[7rem] whitespace-nowrap aria-disabled:opacity-55")}>
          {nextLabel}<Icon name="arrow" size={18} />
        </button>
      </div>
    </section>
  );
}
