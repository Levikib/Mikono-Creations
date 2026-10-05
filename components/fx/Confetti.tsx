import type { CSSProperties } from "react";

const COLOURS = ["#B0654A", "#C9A05A", "#6A7049", "#C79B7D", "#8A4630", "#AAC2CC"];

/** Thread confetti for the order sent page. Place inside a position:relative parent, beside a celebrating Character. Plays once, in CSS. */
export function Confetti({ count = 16 }: { count?: number }) {
  return (
    <span className="fx-confetti" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + (i % 2) * 0.2;
        const d = 70 + ((i * 37) % 60);
        const style = {
          "--x": `${Math.round(Math.cos(a) * d)}px`,
          "--y": `${Math.round(Math.sin(a) * d - 30)}px`,
          "--r": `${(i % 2 ? 1 : -1) * (160 + ((i * 53) % 200))}deg`,
          "--c": COLOURS[i % COLOURS.length],
          "--dl": `${((i * 0.045) % 0.4).toFixed(2)}s`,
        } as CSSProperties;
        return <i key={i} style={style} />;
      })}
    </span>
  );
}
