import manifest from "@/data/imageManifest.generated.json";

/** Tiny base64 WebP placeholder for a source image, or undefined when the manifest has none. Server components only: it pulls in the full manifest. */
export function blurFor(src: string): string | undefined {
  return (manifest as Record<string, { blur?: string }>)[src]?.blur;
}
