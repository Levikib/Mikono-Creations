/** Sprite ids are tokenised with a section sign by scripts/build-cast.mjs; give every inlined instance its own prefix. */
export function scopeSvg(svg: string, prefix: string): string {
  return svg.replaceAll('§', prefix);
}

/** Small deterministic hash so server renders are stable (no Math.random in server components). */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const safeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '');
