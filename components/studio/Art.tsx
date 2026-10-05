import { cx } from "@/lib/cx";

/** One animal silhouette in a fixed box. scale is relative height. A dotted XL outline shows the comparison. Illustration only, no measurements (R5). */
export function Silhouette({ scale, ghost = true, className }: { scale: number; ghost?: boolean; className?: string }) {
  const shape = (
    <>
      <circle cx="27" cy="22" r="13" /><circle cx="73" cy="22" r="13" />
      <ellipse cx="50" cy="66" rx="30" ry="29" /><circle cx="50" cy="38" r="24" />
    </>
  );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cx("block h-[84px] w-[84px]", className)}>
      {ghost ? <line x1="8" x2="92" y1="7" y2="7" stroke="var(--st-line, #8B7D6F)" strokeWidth="1.5" strokeDasharray="3 4" opacity=".7" /> : null}
      <g transform={`translate(50 98) scale(${scale}) translate(-50 -98)`} fill="var(--color-clay, #C79B7D)">
        {shape}
        <circle cx="42" cy="35" r="3" fill="var(--st-ink, #2A2420)" /><circle cx="58" cy="35" r="3" fill="var(--st-ink, #2A2420)" />
        <ellipse cx="50" cy="45" rx="7" ry="5" fill="var(--st-oat, #EBE2D3)" />
      </g>
    </svg>
  );
}

/** The three drawn steps for attaching photos in WhatsApp. Static, no motion cost. */
export function PaperclipSteps({ className }: { className?: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const steps = [
    {
      n: "1", label: "Tap the paperclip",
      art: (
        <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false" className="text-[var(--st-action)]">
          <rect x="6" y="40" width="52" height="16" rx="8" fill="var(--st-oat)" stroke="none" />
          <g className="st-clip"><path {...stroke} d="M40 30 28 42a6 6 0 0 1-9-9L33 19a4 4 0 0 1 6 6L26 38a2 2 0 0 1-3-3l10-10" transform="translate(4 -6)" /></g>
        </svg>
      ),
    },
    {
      n: "2", label: "Choose Gallery",
      art: (
        <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false" className="text-[var(--st-action)]">
          <rect x="10" y="12" width="44" height="40" rx="8" fill="var(--st-oat)" stroke="none" />
          <rect x="10" y="12" width="44" height="40" rx="8" {...stroke} />
          <circle cx="24" cy="26" r="4" {...stroke} /><path {...stroke} d="m12 46 12-11 9 8 8-7 11 10" />
        </svg>
      ),
    },
    {
      n: "3", label: "Pick your photos and send",
      art: (
        <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false" className="text-[var(--st-action)]">
          <circle cx="32" cy="32" r="22" fill="var(--st-oat)" stroke="none" />
          <path {...stroke} d="M20 33 44 21l-7 22-6-8z" /><path {...stroke} d="m31 35 13-14" />
        </svg>
      ),
    },
  ];
  return (
    <ol className={cx("grid grid-cols-3 gap-2", className)}>
      {steps.map((s) => (
        <li key={s.n} className="flex flex-col items-center gap-1.5 text-center">
          <span className="st-ico !h-12 !w-16 !rounded-[20px]">{s.art}</span>
          <span className="text-base font-semibold leading-tight"><span className="st-soft">{s.n}. </span>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}
