// Shared drawing kit for the cast2 sprites. Same look as strategy/stage2/src/gen-cast.mjs:
// dashed stitched outline, soft clay gradient, V-stitch texture, bead eyes. 200x200 viewBox.
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
export function mix(hex, t, to = 0) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => clamp(v + (to - v) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
export const dark = (h, t = 0.3) => mix(h, t, 0);
export const lite = (h, t = 0.3) => mix(h, t, 255);
export const f = (n) => +n.toFixed(1);
export const E = (cx, cy, rx, ry, rot) => ['ellipse', `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"` + (rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : '')];
export const R = (x, y, w, h, r = 6, rot) => ['rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"` + (rot ? ` transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"` : '')];
export const Pa = (d, tf) => ['path', `d="${d}"` + (tf ? ` transform="${tf}"` : '')];
export const C = (cx, cy, r) => ['circle', `cx="${cx}" cy="${cy}" r="${r}"`];
// scalloped blob (fluffy outline) around an ellipse
export function lobes(cx, cy, rx, ry, n, bulge = 1.18, rot = 0) {
  let d = '';
  const P = (a, k) => `${f(cx + Math.cos(a + rot) * rx * k)} ${f(cy + Math.sin(a + rot) * ry * k)}`;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.2832, b = ((i + 0.5) / n) * 6.2832, c = ((i + 1) / n) * 6.2832;
    if (i === 0) d += 'M' + P(a, 1);
    d += `Q${P(b, bulge)} ${P(c, 1)}`;
  }
  return d + 'Z';
}

export class Sprite {
  constructor(k) { this.k = k; this.n = 0; this.extraDefs = ''; }
  // tex: 'full' gradient+stitch, 'pat' stitch only, 'none' flat
  part(shape, fill, o = {}) {
    const id = this.k + (this.n++).toString(36);
    const [tag, attrs] = shape;
    const stroke = o.stroke || dark(fill, 0.32);
    let tex = o.flat ? 'none' : o.tex;
    if (!tex) {
      const a = (n) => { const m = attrs.match(new RegExp('\\b' + n + '="([\\d.]+)"')); return m ? +m[1] : 0; };
      const big = tag === 'ellipse' ? a('rx') * a('ry') > 190 : tag === 'circle' ? a('r') >= 10 : tag === 'rect' ? a('width') * a('height') > 500 : false;
      tex = big ? 'full' : 'pat';
    }
    let s = `<${tag} id="${id}" ${attrs} fill="${fill}" stroke="${stroke}"/>`;
    if (tex === 'full') s += `<use href="#${id}" fill="url(#${this.k}g)" stroke="none"/>`;
    if (tex !== 'none') s += `<use href="#${id}" fill="url(#${this.k}p)" stroke="none"/>`;
    return s;
  }
  plain(shape, fill, extra = '') { return `<${shape[0]} ${shape[1]} fill="${fill}" stroke="none" ${extra}/>`; }
  // thick stitched stroke (necks, tails, thin limbs)
  limb(d, w, fill, o = {}) {
    const st = o.stroke || dark(fill, 0.32);
    return `<g fill="none" stroke-dasharray="0"><path d="${d}" stroke="${st}" stroke-width="${w + 3}"/><path d="${d}" stroke="${fill}" stroke-width="${w}"/>` +
      (o.tex === 'none' ? '' : `<path d="${d}" stroke="url(#${this.k}p)" stroke-width="${w}"/>`) + '</g>';
  }
  // line detail (no dash)
  line(d, c, w = 1.6, dash = '0') { return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${dash}"/>`; }
  // many little filled dots as one path
  dots(pts, r, c, ring = false) {
    const d = pts.map(([x, y, rr]) => { const q = rr || r; return `M${f(x - q)} ${y}a${q} ${q} 0 1 0 ${f(2 * q)} 0a${q} ${q} 0 1 0 ${f(-2 * q)} 0`; }).join('');
    return ring ? `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="0"/>` : `<path d="${d}" fill="${c}" stroke="none"/>`;
  }
  eye(cx, cy, r = 4.2, white = false) {
    let s = '';
    if (white) s += `<circle cx="${cx}" cy="${cy}" r="${f(r + 1.8)}" fill="#F6EEDD"/>`;
    return s + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#231a16"/><circle cx="${f(cx - r * 0.35)}" cy="${f(cy - r * 0.4)}" r="${f(r * 0.38)}" fill="#fff"/>`;
  }
  shut(cx, cy, w = 5) { return this.line(`M${cx - w} ${cy}q${w} ${w * 0.9} ${w * 2} 0`, '#231a16', 1.8); }
  blush(cx, cy, rx = 6, ry = 4) { return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#E0765F" opacity=".38"/>`; }
  g(cls, ox, oy, inner) { return `<g class="${cls}" style="transform-origin:${ox}px ${oy}px">${inner}</g>`; }
  // vertical rounded leg with optional hoof cap, own animation group, pivot at the hip
  leg(cls, x, y, w, h, fill, hoof, o = {}) {
    let s = this.part(R(x, y, w, h, w / 2), fill, o);
    if (hoof) s += this.part(R(x - 0.4, y + h - 5.5, w + 0.8, 6, 2.6), hoof, { tex: 'none' });
    return this.g(cls, x + w / 2, y + 5, s);
  }
  svg(inner) {
    const k = this.k;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="${k}g" cx=".35" cy=".25" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a1608" stop-opacity=".3"/></radialGradient><pattern id="${k}p" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 1.2l1.25 2 1.25-2M2.5 3.7l1.25 2 1.25-2" fill="none" stroke="#2a1608" stroke-opacity=".2" stroke-width=".9"/><path d="M0 2.1l1.25 2 1.25-2M2.5 4.6l1.25 2 1.25-2" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/></pattern>${this.extraDefs}</defs><g stroke-width="1.5" stroke-dasharray="3.2 2.6" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }
}
export const SHADOW = '<ellipse cx="100" cy="186" rx="52" ry="5" fill="#2a1608" opacity=".12" stroke="none"/>';
