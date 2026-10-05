import { Unbounded, Instrument_Sans, DM_Mono } from "next/font/google";

// Loader variables carry a "-loaded" suffix so the @theme font tokens in
// globals.css can reference them without a self referencing cycle.
// Latin subset only. Weights are limited to the ones the design system uses.

/** Display: headings, card titles, big numbers. Weights 600 to 800. */
export const display = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-loaded",
  display: "swap",
  // Headings render in the metric adjusted fallback first, so the 50KB file does not compete with the stylesheet and the first photos on slow networks.
  preload: false,
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
