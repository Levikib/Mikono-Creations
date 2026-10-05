import { Icon } from "../Icon";
import { stepShort, stepTitles } from "@/data/studio";
import type { StepId } from "@/lib/studio/types";

/** Computed progress strip over the active steps. On wide screens the steps are buttons you can return to once reached. */
export function Stepper({ steps, step, reached, onJump }: { steps: StepId[]; step: StepId; reached: StepId[]; onJump: (s: StepId) => void }) {
  const idx = Math.max(0, steps.indexOf(step));
  const total = steps.length;
  const pct = Math.round(((idx + 1) / total) * 100);
  return (
    <nav aria-label="Brief progress" className="mb-2">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="st-eyebrow" aria-hidden="true">Step {idx + 1} of {total}</p>
        <p className="text-[.8125rem] font-semibold st-soft" aria-hidden="true">{stepShort[step]}</p>
      </div>
      <div className="st-track" role="progressbar" aria-label="Brief progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={idx + 1}
        aria-valuetext={`Step ${idx + 1} of ${total}, ${stepTitles[step]}`}>
        <div className="st-fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-2 hidden flex-wrap gap-1 lg:flex">
        {steps.map((s, i) => (
          <li key={s}>
            <button type="button" className="st-step-btn" data-done={i < idx} aria-current={s === step ? "step" : undefined}
              disabled={s === step || !(reached.includes(s) || i < idx)} onClick={() => onJump(s)}>
              <span className="st-step-n">{i < idx ? <Icon name="check" size={12} /> : i + 1}</span>{stepShort[s]}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
