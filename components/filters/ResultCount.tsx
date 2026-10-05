import "./filters.css";

/** Says in words what you are looking at. Polite live region, so a screen reader announces "Showing 12 of 30 animals" when it changes. */
export function ResultCount({ shown, total, one, many, className }: { shown: number; total: number; one: string; many: string; className?: string }) {
  const noun = total === 1 ? one : many;
  return (
    <p role="status" aria-live="polite" aria-atomic="true" className={`mf-count${className ? ` ${className}` : ""}`}>
      {shown === 0 && total === 0 ? `No ${many} match` : shown === total ? (total === 1 ? `Showing 1 ${noun}` : `Showing all ${total} ${noun}`) : `Showing ${shown} of ${total} ${noun}`}
    </p>
  );
}
