import { Unbounded, Instrument_Sans, DM_Mono } from "next/font/google";

// Loader variables carry a "-loaded" suffix so the @theme font tokens in
// globals.css can reference them without a self referencing cycle.
// Latin subset only. Weights are limited to the ones the design system uses.

/** Display: headings, card titles, big numbers. Weights 600 to 800. */
export const display = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-loaded",
  // "optional", preloaded: the hero headline used to render in the fallback and then swap to Unbounded, which is much
  // wider, shifting the whole hero (PageSpeed CLS 0.8, Nov 2026). Now the font is used if it arrives within the short
  // block period (preloaded, so usually yes), otherwise the fallback stays for that page view with no shift.
  display: "optional",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
});

/** Body and UI text. Weights 400 to 700. */
export const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-loaded",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/** Short labels, eyebrows, meta lines. One weight, loaded lazily. */
export const mono = DM_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono-loaded",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});
