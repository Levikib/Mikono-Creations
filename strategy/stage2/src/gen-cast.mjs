// Generator for the 12 yarn-cast SVG sprites. Output: public/fx/cast/<name>.svg
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../../public/fx/cast');

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
function mix(hex, t, to = 0) { // t>0 toward `to` (0 black,255 white)
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => clamp(v + (to - v) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
const dark = (h, t = 0.3) => mix(h, t, 0);
const lite = (h, t = 0.3) => mix(h, t, 255);
const f = (n) => +n.toFixed(1);

const E = (cx, cy, rx, ry, rot) => ['ellipse', `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"` + (rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : '')];
const R = (x, y, w, h, r = 6, rot) => ['rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"` + (rot ? ` transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"` : '')];
const Pa = (d) => ['path', `d="${d}"`];
const C = (cx, cy, r) => ['circle', `cx="${cx}" cy="${cy}" r="${r}"`];

class Sprite {
  constructor(k, shade = 1) { this.k = k; this.n = 0; this.out = []; this.shade = shade; this.extraDefs = ''; }
  // a crocheted part: fill, dashed stitch outline, soft clay shading, V-stitch texture
  part(shape, fill, o = {}) {
    const id = this.k + (this.n++).toString(36);
    const [tag, attrs] = shape;
    const stroke = o.stroke || dark(fill, 0.32);
    let s = `<${tag} id="${id}" ${attrs} fill="${fill}" stroke="${stroke}"/>`;
    if (!o.flat) s += `<use href="#${id}" fill="url(#${this.k}g)" stroke="none"/>`;
    s += `<use href="#${id}" fill="url(#${this.k}p)" stroke="none"/>`;
    return s;
  }
  plain(shape, fill, extra = '') { return `<${shape[0]} ${shape[1]} fill="${fill}" ${extra}/>`; }
  eye(cx, cy, r = 4.2, white = false) {
    let s = '';
    if (white) s += `<circle cx="${cx}" cy="${cy}" r="${r + 1.8}" fill="#F6EEDD"/>`;
    return s + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#231a16"/><circle cx="${f(cx - r * 0.35)}" cy="${f(cy - r * 0.4)}" r="${f(r * 0.38)}" fill="#fff"/>`;
  }
  blush(cx, cy, rx = 6, ry = 4) { return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#E0765F" opacity=".38"/>`; }
  g(cls, ox, oy, inner) { return `<g class="${cls}" style="transform-origin:${ox}px ${oy}px">${inner}</g>`; }
  svg(inner, extra = '') {
    const k = this.k;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="${k}g" cx=".35" cy=".25" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a1608" stop-opacity=".3"/></radialGradient><pattern id="${k}p" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 1.2l1.25 2 1.25-2M2.5 3.7l1.25 2 1.25-2" fill="none" stroke="#2a1608" stroke-opacity=".2" stroke-width=".9"/><path d="M0 2.1l1.25 2 1.25-2M2.5 4.6l1.25 2 1.25-2" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/></pattern>${this.extraDefs}</defs><g stroke-width="1.5" stroke-dasharray="3.2 2.6" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }
}

const cast = {};

// ---------- 1 giraffe
cast.giraffe = () => {
  const s = new Sprite('gi'); const Y = '#E3B04B', B = '#8A5A3C', M = '#FBF4E4';
  const far = dark(Y, 0.12);
  let o = '';
  o += s.g('fx-tail', 52, 128, s.part(E(44, 140, 4.5, 15, 12), Y) + s.part(C(42, 156, 6), B));
  const NECK_PLACEHOLDER = '@@NECK@@';
  o += s.part(R(64, 150, 17, 32, 8), far) + s.part(R(112, 150, 17, 32, 8), far);
  o += NECK_PLACEHOLDER;
  o += s.part(E(92, 136, 48, 31), Y);
  o += s.part(C(70, 128, 7), B) + s.part(C(94, 118, 6), B) + s.part(C(112, 138, 8), B) + s.part(C(80, 148, 6), B);
  o += s.part(R(48, 150, 18, 32, 8), Y) + s.part(R(98, 150, 18, 32, 8), Y);
  const head =
    s.g('fx-ear', 134, 44, s.part(E(131, 42, 6.5, 11, -35), Y) + s.plain(E(131, 43, 3.2, 6.5, -35), '#C98F4A')) +
    s.part(R(141, 24, 6, 15, 3), B) + s.part(R(153, 22, 6, 15, 3), B) + s.part(C(144, 24, 4.6), B) + s.part(C(156, 22, 4.6), B) +
    s.part(E(150, 50, 24, 18, -8), Y) + s.part(E(170, 57, 14, 11, -8), M) +
    s.plain(E(177, 55, 2.4, 1.8), '#8A6A58') +
    s.g('fx-eyes', 154, 44, s.eye(154, 44, 4.2)) + s.blush(158, 56, 5, 3.4);
  const neck = s.part(Pa('M96 150C100 118 108 92 118 70C122 62 128 58 134 58L160 62C152 84 140 112 136 150Z'), Y) +
    s.part(C(120, 100, 6.5), B) + s.part(C(136, 124, 6), B) + s.part(C(134, 80, 5.2), B);
  o = o.replace('@@NECK@@', s.g('fx-neck', 124, 140, neck + s.g('fx-head', 138, 66, head)));
  return s.svg(o);
};

// ---------- 2 elephant
cast.elephant = () => {
  const s = new Sprite('el'); const G = '#8E979D', D = '#6C757B';
  let o = '';
  o += s.g('fx-tail', 46, 118, s.part(E(42, 130, 4, 13, 10), D) + s.part(C(41, 144, 5.5), '#4F5559'));
  o += s.part(R(58, 148, 24, 34, 11), D) + s.part(R(112, 148, 24, 34, 11), D);
  o += s.part(E(98, 126, 58, 38), G);
  o += s.part(R(42, 148, 24, 34, 11), G) + s.part(R(98, 148, 24, 34, 11), G);
  const head =
    s.g('fx-trunk', 172, 126, s.part(Pa('M168 112C196 112 198 142 192 166C190 174 178 174 178 166C181 148 180 134 164 134Z'), G)) +
    s.part(E(158, 108, 30, 28), G) +
    s.part(E(176, 140, 4, 9, 20), '#F6EBD0') +
    s.g('fx-eyes', 170, 102, s.eye(171, 101, 4.6)) + s.blush(172, 116, 6, 4) +
    s.g('fx-ear', 144, 92, s.part(E(142, 112, 22, 30, 8), lite(G, 0.06)) + s.plain(E(144, 114, 14, 22, 8), '#C4A9A3', 'opacity=".5"'));
  o += s.g('fx-head', 140, 120, head);
  return s.svg(o);
};

// ---------- 3 lion
cast.lion = () => {
  const s = new Sprite('li'); const T = '#D6B287', M = '#8A5A3C', Dk = '#6B4128';
  const lobes = (cx, cy, r, n) => { let d = ''; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, b = ((i + 0.5) / n) * Math.PI * 2, c = ((i + 1) / n) * Math.PI * 2; const P = (ang, rr) => `${f(cx + Math.cos(ang) * rr)} ${f(cy + Math.sin(ang) * rr)}`; if (i === 0) d += 'M' + P(a, r); d += `Q${P(b, r * 1.22)} ${P(c, r)}`; } return d + 'Z'; };
  let o = '';
  o += s.g('fx-tail', 52, 134, s.part(E(40, 146, 4, 17, 14), T) + s.part(E(36, 164, 7, 8), M));
  o += s.part(R(62, 152, 18, 30, 9), dark(T, 0.12)) + s.part(R(112, 152, 18, 30, 9), dark(T, 0.12));
  o += s.part(E(90, 142, 46, 28), T);
  o += s.part(R(46, 152, 18, 30, 9), T) + s.part(R(98, 152, 18, 30, 9), T);
  const head =
    s.part(Pa(lobes(144, 110, 38, 11)), M) + s.part(Pa(lobes(144, 112, 29, 9)), lite(M, 0.12)) +
    s.part(C(124, 80, 9), T) + s.plain(C(124, 81, 4.6), '#B98A68') + s.part(C(164, 80, 9), T) + s.plain(C(164, 81, 4.6), '#B98A68') +
    s.part(C(144, 108, 24), T) + s.part(E(146, 122, 15, 11), '#F3E4C8') +
    s.plain(Pa('M139 114h14l-7 8z'), Dk) + s.plain(Pa('M146 122v5m0 0c-3 3-6 3-8 1m8-1c3 3 6 3 8 1'), 'none', 'stroke="#6B4128" stroke-width="1.4" stroke-dasharray="0"') +
    s.g('fx-eyes', 144, 102, s.eye(133, 102, 4) + s.eye(156, 102, 4)) + s.blush(129, 114) + s.blush(160, 114);
  o += s.g('fx-head', 144, 130, head);
  return s.svg(o);
};

// ---------- 4 rhino
cast.rhino = () => {
  const s = new Sprite('rh'); const B = '#A3C6D6', D = dark(B, 0.14), H = '#F6EBD0';
  let o = '';
  o += s.g('fx-tail', 46, 126, s.part(E(41, 138, 3.8, 12, 10), D) + s.part(C(40, 150, 4.6), dark(B, 0.35)));
  o += s.part(R(62, 150, 21, 32, 9), D) + s.part(R(112, 150, 21, 32, 9), D);
  o += s.part(E(94, 132, 52, 34), B);
  o += s.part(R(46, 150, 21, 32, 9), B) + s.part(R(98, 150, 21, 32, 9), B);
  const head =
    s.g('fx-ear', 142, 100, s.part(E(142, 100, 7, 11, -10), B) + s.plain(E(142, 101, 3.4, 6.5, -10), '#E0A9A0')) +
    s.part(E(152, 124, 28, 24, 6), B) +
    s.part(E(166, 100, 6, 9, 14), H) + s.part(E(181, 112, 8, 14, 38), H) +
    s.plain(E(172, 128, 2.4, 1.8), dark(B, 0.5)) +
    s.g('fx-eyes', 158, 114, s.eye(158, 114, 4)) + s.blush(160, 128, 6, 4);
  o += s.g('fx-head', 134, 130, head);
  return s.svg(o);
};

// ---------- 5 zebra
cast.zebra = () => {
  const s = new Sprite('ze'); const K = '#312A27', Cr = '#F4EEDF';
  const body = E(92, 132, 50, 32);
  let o = '';
  s.extraDefs = '<clipPath id="zec"><ellipse cx="92" cy="132" rx="50" ry="32"/></clipPath>';
  o += s.g('fx-tail', 46, 124, s.part(E(41, 138, 4, 14, 10), K) + s.part(E(40, 152, 5, 7), Cr));
  const leg = (x, c) => s.part(R(x, 148, 17, 34, 8), c) + `<rect x="${x}" y="164" width="17" height="4" fill="${Cr}" opacity=".9"/><rect x="${x}" y="173" width="17" height="4" fill="${Cr}" opacity=".9"/>`;
  o += leg(66, dark(K, 0)) + leg(114, K);
  o += s.part(body, K);
  let st = ''; for (let x = 52; x < 140; x += 11) st += `<path d="M${x} 100q${x % 2 ? 4 : -4} 32 0 64" stroke="${Cr}" stroke-width="4.2" fill="none" stroke-dasharray="0"/>`;
  o += `<g clip-path="url(#zec)">${st}</g>`;
  o += leg(50, K) + leg(100, K);
  const head =
    s.g('fx-ear', 148, 98, s.part(E(142, 92, 6, 12, -14), K, { stroke: Cr }) + s.plain(E(142, 93, 2.6, 7, -14), '#C99A8E') + s.part(E(160, 90, 6, 12, 14), K, { stroke: Cr }) + s.plain(E(160, 91, 2.6, 7, 14), '#C99A8E')) +
    s.part(E(156, 118, 26, 22, 8), K) + s.part(E(174, 126, 14, 12, 8), '#6A5A52') +
    `<path d="M140 104q8 3 18-2M138 112q10 4 22-2" stroke="${Cr}" stroke-width="3.2" fill="none" stroke-dasharray="0"/>` +
    s.plain(E(178, 126, 2.2, 1.6), '#231a16') +
    s.g('fx-eyes', 162, 110, s.eye(162, 110, 3.6, true)) + s.blush(165, 124, 5, 3.4);
  o += s.g('fx-head', 138, 124, head);
  return s.svg(o);
};

// ---------- 6 hippo
cast.hippo = () => {
  const s = new Sprite('hi'); const B = '#8F97AE', D = dark(B, 0.16), P = '#E3A7B0';
  let o = '';
  o += s.g('fx-tail', 44, 130, s.part(E(41, 138, 4, 8, 8), D));
  o += s.part(R(62, 154, 22, 28, 10), D) + s.part(R(114, 154, 22, 28, 10), D);
  o += s.part(E(92, 138, 54, 36), B);
  o += s.part(R(46, 154, 22, 28, 10), B) + s.part(R(100, 154, 22, 28, 10), B);
  const head =
    s.g('fx-ear', 144, 100, s.part(C(142, 102, 9), B) + s.plain(C(142, 103, 4.6), P) + s.part(C(166, 100, 9), B) + s.plain(C(166, 101, 4.6), P)) +
    s.part(E(156, 128, 32, 28), B) + s.part(E(166, 142, 24, 17), lite(B, 0.3)) +
    s.plain(E(158, 140, 2.6, 2), dark(B, 0.5)) + s.plain(E(172, 140, 2.6, 2), dark(B, 0.5)) +
    s.g('fx-eyes', 156, 116, s.part(C(146, 116, 8), B, { flat: 1 }) + s.eye(146, 116, 4) + s.part(C(166, 116, 8), B, { flat: 1 }) + s.eye(166, 116, 4)) +
    s.blush(142, 136, 6, 4) + s.blush(172, 128, 5, 3.4);
  o += s.g('fx-head', 140, 140, head);
  return s.svg(o);
};

// ---------- 7 monkey
cast.monkey = () => {
  const s = new Sprite('mo'); const T = '#B98F63', F = '#EBD2C4';
  let o = '';
  o += s.g('fx-tail', 118, 140, `<path d="M118 150c30 4 44-16 34-36c-4-8-14-8-12 2" fill="none" stroke="${dark(T, 0.32)}" stroke-width="12" stroke-linecap="round" stroke-dasharray="0"/><path d="M118 150c30 4 44-16 34-36c-4-8-14-8-12 2" fill="none" stroke="${T}" stroke-width="9" stroke-linecap="round" stroke-dasharray="0"/><path d="M118 150c30 4 44-16 34-36c-4-8-14-8-12 2" fill="none" stroke="url(#mop)" stroke-width="9" stroke-linecap="round" stroke-dasharray="0"/>`);
  o += s.part(R(82, 144, 15, 42, 7.5), dark(T, 0.1)) + s.part(R(103, 144, 15, 42, 7.5), dark(T, 0.1));
  o += s.part(R(76, 82, 48, 70, 24), T) + s.part(E(100, 124, 17, 20), lite(F, 0), { stroke: dark(F, 0.2) });
  o += s.g('fx-arm-l', 80, 92, s.part(Pa('M82 92C58 96 54 130 62 168C63 176 77 176 76 168C72 140 76 118 88 112Z'), T) + s.part(C(69, 172, 7.5), F));
  o += s.g('fx-arm-r', 120, 92, s.part(Pa('M118 92C142 96 146 130 138 168C137 176 123 176 124 168C128 140 124 118 112 112Z'), T) + s.part(C(131, 172, 7.5), F));
  const head =
    s.g('fx-ear', 100, 54, s.part(C(70, 52, 13), T) + s.plain(C(70, 52, 7), F) + s.part(C(130, 52, 13), T) + s.plain(C(130, 52, 7), F)) +
    s.part(C(100, 54, 29), T) + s.part(Pa('M100 46c-8-8-24-4-24 10c0 14 14 24 24 24s24-10 24-24c0-14-16-18-24-10z'), F, { stroke: dark(F, 0.22) }) +
    s.plain(Pa('M96 66h8l-4 4z'), '#8a6a58') +
    `<path d="M92 74q8 6 16 0" stroke="#8a6a58" stroke-width="1.5" fill="none" stroke-dasharray="0"/>` +
    s.g('fx-eyes', 100, 56, s.eye(89, 56, 3.8) + s.eye(111, 56, 3.8)) + s.blush(84, 68) + s.blush(116, 68);
  o += s.g('fx-head', 100, 80, head);
  const sv = s.svg(o);
  return sv.replace('</defs>', '</defs>');
};

// ---------- 8 rabbit
cast.rabbit = () => {
  const s = new Sprite('ra'); const T = '#BB8B52', Cr = '#F1E2C6', V = '#8FBBCB';
  let o = '';
  o += s.g('fx-tail', 138, 160, s.part(C(142, 164, 9), Cr));
  o += s.part(E(78, 180, 17, 9), T) + s.part(E(122, 180, 17, 9), T);
  o += s.part(E(100, 140, 40, 40), T) + s.part(E(100, 150, 22, 26), Cr);
  o += s.part(Pa('M64 120C70 108 130 108 136 120L138 160C120 174 80 174 62 160Z'), V) +
    s.part(Pa('M100 112v62'), Cr, { flat: 1, stroke: Cr }) +
    `<path d="M66 162c20 10 48 10 68 0" stroke="${Cr}" stroke-width="3.5" fill="none"/>` + s.part(C(97, 128, 2.6), Cr, { flat: 1 }) + s.part(C(97, 146, 2.6), Cr, { flat: 1 });
  o += s.g('fx-arm-l', 64, 124, s.part(E(60, 140, 9, 20, 14), T)) + s.g('fx-arm-r', 136, 124, s.part(E(140, 140, 9, 20, -14), T));
  const head =
    s.g('fx-ear', 100, 66, s.g('fx-ear-l', 86, 66, s.part(E(80, 34, 10, 34, -8), T) + s.plain(E(80, 36, 4.6, 24, -8), '#D99C8E')) + s.g('fx-ear-r', 114, 66, s.part(E(120, 34, 10, 34, 8), T) + s.plain(E(120, 36, 4.6, 24, 8), '#D99C8E'))) +
    s.part(E(100, 84, 31, 27), T) + s.part(E(100, 94, 15, 11), Cr) +
    s.plain(E(100, 88, 3.6, 2.6), '#C77E70') +
    `<path d="M100 91v4M94 97q6 4 6-2M106 97q-6 4-6-2" stroke="#6b4a36" stroke-width="1.3" fill="none" stroke-dasharray="0"/>` +
    s.g('fx-eyes', 100, 80, s.eye(86, 80, 4) + s.eye(114, 80, 4)) + s.blush(80, 92) + s.blush(120, 92);
  o += s.g('fx-head', 100, 108, head);
  return s.svg(o);
};

// ---------- 9 octopus
cast.octopus = () => {
  const s = new Sprite('oc'); const Cr = '#F6E7D0';
  const cols = ['#F2A6A0', '#9FC7D4', '#E8CB79', '#B6D1A0', '#C9A7D6', '#F2A6A0', '#9FC7D4'];
  let o = '';
  const tent = [[60, 'M66 112C48 124 40 142 50 158C56 168 40 176 36 166', 0], [80, 'M82 118C70 138 82 156 72 174C70 180 62 180 62 172', 0], [100, 'M100 120C96 142 108 158 100 178C98 184 90 184 90 176', 0], [120, 'M118 118C130 138 118 156 128 174C130 180 138 180 138 172', 0], [140, 'M134 112C152 124 160 142 150 158C144 168 160 176 164 166', 0]];
  let tt = '';
  tent.forEach(([x, d], i) => {
    const c = cols[i];
    tt += s.g('fx-arm fx-arm' + (i + 1), x, 118, `<path d="${d}" fill="none" stroke="${dark(c, 0.3)}" stroke-width="17" stroke-linecap="round" stroke-dasharray="0"/><path d="${d}" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-dasharray="0"/><path d="${d}" fill="none" stroke="url(#ocp)" stroke-width="14" stroke-linecap="round" stroke-dasharray="0"/>`);
  });
  o += tt;
  const head =
    s.part(E(100, 78, 50, 46), Cr) +
    s.part(C(68, 62, 9), '#F2A6A0', { flat: 1 }) + s.part(C(122, 48, 8), '#9FC7D4', { flat: 1 }) + s.part(C(138, 80, 10), '#E8CB79', { flat: 1 }) + s.part(C(96, 38, 6), '#B6D1A0', { flat: 1 }) + s.part(C(62, 92, 7), '#C9A7D6', { flat: 1 }) +
    `<path d="M90 98q10 8 20 0" stroke="#8a5a4c" stroke-width="1.6" fill="none" stroke-dasharray="0"/>` +
    s.g('fx-eyes', 100, 82, s.eye(80, 82, 5) + s.eye(120, 82, 5)) + s.blush(70, 96, 7, 4.4) + s.blush(130, 96, 7, 4.4);
  o += s.g('fx-head', 100, 120, head);
  return s.svg(o);
};

// ---------- 10 turtle
cast.turtle = () => {
  const s = new Sprite('tu'); const Sh = '#8FA37E', Mi = '#C9D6BC', Cr = '#F4EAD2';
  let o = '';
  o += s.g('fx-tail', 40, 150, s.part(Pa('M44 150l-14 8 14 4z'), Cr));
  o += s.part(E(70, 170, 15, 10), Cr) + s.part(E(122, 170, 15, 10), Cr);
  o += s.part(Pa('M32 156C32 100 70 70 106 70C142 70 168 108 168 156Z'), Sh);
  let sp = ''; [[38, 30], [28, 21], [18, 13], [9, 6]].forEach(([rx, ry], i) => { sp += `<ellipse cx="102" cy="154" rx="${rx * 1.9 - 4}" ry="${ry * 3.4 - 8}" fill="none" stroke="${i % 2 ? Mi : Cr}" stroke-width="5" stroke-dasharray="4 3" stroke-linecap="round" opacity=".95"/>`; });
  s.extraDefs = '<clipPath id="tuc"><path d="M34 154C34 102 70 72 106 72C142 72 166 108 166 154Z"/></clipPath>';
  o += `<g clip-path="url(#tuc)">${sp}</g>`;
  o += s.part(R(32, 152, 138, 14, 7), Cr);
  o += s.part(E(80, 170, 15, 10), Mi) + s.part(E(130, 172, 15, 10), Mi);
  const head = s.part(Pa('M156 146C158 120 190 114 192 140C193 156 176 164 160 160Z'), Mi) + s.part(C(176, 138, 20), Mi) +
    s.g('fx-eyes', 182, 134, s.eye(183, 133, 3.8)) + s.blush(176, 146, 5, 3.4) +
    `<path d="M178 148q5 4 10 0" stroke="#6a7a5c" stroke-width="1.4" fill="none" stroke-dasharray="0"/>`;
  o += s.g('fx-head', 160, 150, head);
  return s.svg(o);
};

// ---------- 11 butterfly
cast.butterfly = () => {
  const s = new Sprite('bu'); const Sk = '#AAC2CC', Oc = '#D8AE62', Ol = '#849D57';
  const mir = (d) => d.replace(/([ML]|C|Q)?(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, c, x, y) => `${c || ''}${f(200 - x)} ${y}`);
  const up = 'M100 96C84 48 40 36 28 64C20 86 54 110 100 108Z';
  const lo = 'M100 112C70 112 40 124 44 152C48 176 86 170 100 130Z';
  let o = '';
  const wing = (side) => {
    const m = side === 'l' ? (d) => d : mir; const sx = (x) => (side === 'l' ? x : 200 - x);
    return s.g('fx-wing fx-wing-' + side, 100, 110,
      s.part(Pa(m(lo)), Ol) + s.part(Pa(m(up)), Sk) +
      s.part(C(sx(52), 70, 9), Oc, { flat: 1 }) + s.part(C(sx(70), 90, 6), '#F4EAD2', { flat: 1 }) + s.part(C(sx(62), 148, 8), Oc, { flat: 1 }) + s.part(C(sx(76), 130, 5), '#F4EAD2', { flat: 1 }));
  };
  o += wing('l') + wing('r');
  o += s.part(R(92, 76, 16, 76, 8), '#5B4638') + s.part(C(100, 72, 12), '#5B4638');
  o += `<path d="M95 62C88 42 76 38 70 44M105 62C112 42 124 38 130 44" stroke="#5B4638" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="0"/><circle cx="70" cy="44" r="3" fill="${Oc}"/><circle cx="130" cy="44" r="3" fill="${Oc}"/>`;
  o += s.g('fx-eyes', 100, 72, `<circle cx="95" cy="72" r="3" fill="#F6EEDD"/><circle cx="105" cy="72" r="3" fill="#F6EEDD"/><circle cx="95.4" cy="72.3" r="1.6" fill="#231a16"/><circle cx="105.4" cy="72.3" r="1.6" fill="#231a16"/>`);
  return s.svg(o);
};

// ---------- 12 yarn ball
cast.yarn = () => {
  const s = new Sprite('ya'); const T = '#B8694C', Th = '#D9AC8C';
  let o = '';
  o += `<ellipse cx="96" cy="178" rx="46" ry="6" fill="#2a1608" opacity=".14" stroke="none"/>`;
  o += s.part(C(96, 112, 56), T);
  const wrap = (d) => `<path d="${d}" fill="none" stroke="${Th}" stroke-width="3.2" stroke-dasharray="5 3" stroke-linecap="round" opacity=".85"/>`;
  s.extraDefs = '<clipPath id="yac"><circle cx="96" cy="112" r="55"/></clipPath>';
  o += `<g clip-path="url(#yac)">${wrap('M40 96C70 126 120 126 152 92')}${wrap('M42 120C74 150 124 150 154 114')}${wrap('M60 62C84 96 120 100 150 74')}${wrap('M58 150C86 168 124 164 148 140')}${wrap('M70 60C56 84 56 124 74 158')}${wrap('M122 60C138 84 138 124 120 158')}</g>`;
  o += s.part(Pa('M70 100h52a8 8 0 0 1 0 0v0z'), T, { flat: 1 }).replace(/.*/, '');
  o += s.g('fx-eyes', 96, 106, s.eye(78, 106, 5) + s.eye(114, 106, 5)) + s.blush(68, 120, 7, 4.4) + s.blush(124, 120, 7, 4.4);
  o += `<path d="M88 122q8 7 16 0" stroke="#4a2616" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="0"/>`;
  o += s.g('fx-tail fx-thread', 140, 150, `<path d="M138 152C160 160 166 176 150 182C132 188 160 192 190 180" fill="none" stroke="${dark(Th, 0.3)}" stroke-width="5.6" stroke-linecap="round" stroke-dasharray="0"/><path d="M138 152C160 160 166 176 150 182C132 188 160 192 190 180" fill="none" stroke="${Th}" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="0"/><path d="M138 152C160 160 166 176 150 182C132 188 160 192 190 180" fill="none" stroke="url(#yap)" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="0"/>`);
  return s.svg(o);
};

for (const [name, fn] of Object.entries(cast)) {
  let svg = fn().replace(/\s+/g, ' ').replace(/> </g, '><');
  writeFileSync(join(OUT, name + '.svg'), svg);
  console.log(name, svg.length);
}
