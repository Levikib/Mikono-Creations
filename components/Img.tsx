/* eslint-disable @next/next/no-img-element -- decorative sprites and static variants: plain <img> keeps the client free of an image runtime */
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import imageLoader from "@/lib/imageLoader";

/**
 * Drop-in for the parts of next/image this site uses, with no client runtime: it renders a plain <img> with a srcset built from the
 * static variants (lib/imageLoader.ts). Using it keeps next/image's client code (about 5 KB gzip) out of routes that do not need it.
 * Supports: src, alt, fill, width, height, sizes, priority or preload, loading, fetchPriority, placeholder="blur" with blurDataURL,
 * className, style, draggable. Server rendered. Used from a client component it also pulls the loader map into that route.
 */
const WIDTHS = [160, 240, 320, 400, 480, 560, 640, 800, 960, 1280, 1600];

export interface ImgProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  preload?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  quality?: number;
}

function srcSetFor(src: string, widths: number[], mult = 1) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of widths) {
    const url = imageLoader({ src, width: Math.round(w * mult) });
    const key = url;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(`${url} ${w}w`);
  }
  return out.join(", ");
}

export default function Img({ src, alt, fill, width, height, sizes, priority, preload: pre, loading, fetchPriority, placeholder, blurDataURL, className, style, draggable }: ImgProps) {
  const isLocal = src.startsWith("/media/") || src.startsWith("/logo");
  const eager = priority || pre || loading === "eager";
  const fp = fetchPriority ?? (priority || pre ? "high" : undefined);
  let srcSet: string | undefined;
  let finalSrc = src;
  if (isLocal) {
    if (fill || sizes) {
      srcSet = srcSetFor(src, WIDTHS);
      finalSrc = imageLoader({ src, width: 640 });
    } else if (width) {
      // fixed size: 1x and 2x
      const one = imageLoader({ src, width });
      const two = imageLoader({ src, width: width * 2 });
      finalSrc = one;
      srcSet = one === two ? undefined : `${one} 1x, ${two} 2x`;
    }
  }
  if (priority || pre) {
    try { preload(finalSrc, { as: "image", imageSrcSet: srcSet, imageSizes: srcSet ? sizes : undefined, fetchPriority: "high" }); } catch { /* not in a render scope */ }
  }
  const base: CSSProperties = fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent" } : { color: "transparent" };
  if (placeholder === "blur" && blurDataURL) {
    Object.assign(base, { backgroundSize: "cover", backgroundPosition: "50% 50%", backgroundRepeat: "no-repeat", backgroundImage: `url("${blurDataURL}")` });
  }
  return <img src={finalSrc} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} width={fill ? undefined : width} height={fill ? undefined : height}
    loading={eager ? "eager" : "lazy"} fetchPriority={fp} decoding="async" draggable={draggable} className={className} style={{ ...base, ...style }} />;
}
