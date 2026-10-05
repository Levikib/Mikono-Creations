import widthMap from "@/data/imageLoaderMap.generated.json";

/**
 * Custom next/image loader for the static responsive pipeline (scripts/build-images.mjs).
 * Maps a /media/... source and a requested width to the smallest pre-built WebP variant that is at least that wide,
 * or the widest one when the request is bigger than anything we have. Anything not in the map (SVG, remote) is
 * returned untouched. No runtime optimiser is involved, so there is nothing to meter or bill.
 *
 * Lite mode (Save-Data on, or a 2g/3g connection) caps the choice at 640 px. The flag is set by components/DataSaver.tsx
 * after hydration, so server and first client render always agree.
 */
const LITE_MAX = 640;
const widths = widthMap as Record<string, number[]>;

export const variantPath = (src: string, w: number) => {
  const rel = src.startsWith("/media/") ? src.slice("/media/".length) : "_root" + src;
  return `/media-opt/${rel.replace(/\.[^./]+$/, "")}-${w}.webp`;
};

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const have = widths[src];
  if (!have || have.length === 0) return src;
  const lite = typeof globalThis !== "undefined" && (globalThis as { __mkLite?: boolean }).__mkLite === true;
  const want = lite ? Math.min(width, LITE_MAX) : width;
  const w = have.find((x) => x >= want) ?? have[have.length - 1];
  return variantPath(src, w);
}
