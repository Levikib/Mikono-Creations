import { Sprite, E, R, Pa, C, dark, lite, f } from '../lib.mjs';
export const sprites = {};

sprites['prop-acacia-branch'] = () => {
  const s = new Sprite('pa'); const Br = '#7A5A3C', L = '#849D57', Ld = '#667E43', T = '#F1E6CC';
  const canopy = (cx, cy, rx) => s.part(E(cx, cy, rx, rx * 0.34), L, { tex: 'full' }) + s.part(E(cx - rx * 0.4, cy + rx * 0.22, rx * 0.6, rx * 0.22), Ld, { tex: 'pat' }) + s.part(E(cx + rx * 0.5, cy + rx * 0.2, rx * 0.5, rx * 0.2), lite(L, 0.1), { tex: 'pat' });
  let o = s.g('fx-branch', 4, 150,
    s.limb('M2 156C40 150 80 158 112 128C130 110 160 104 198 96', 11, Br) + s.limb('M108 132C104 108 92 92 72 80', 7, Br) + s.limb('M150 108C156 90 168 78 184 70', 6, dark(Br, 0.08)) +
    s.line('M20 154l9-1M54 156l8-2M122 124l8-4M168 104l8-3', dark(Br, 0.4), 1.6) +
    canopy(66, 70, 34) + canopy(166, 58, 30) + canopy(34, 134, 22) +
    s.plain(Pa('M60 154l3-9 3 9zM92 148l3-9 3 9z'), T) + s.plain(Pa('M136 114l2-9 5 8zM176 98l2-9 4 9z'), T));
  return s.svg(o);
};
sprites['prop-rock'] = () => {
  const s = new Sprite('pr'); const G = '#A99985', Gd = '#8A7B69';
  let o = '<ellipse cx="100" cy="184" rx="78" ry="5" fill="#2a1608" opacity=".13" stroke="none"/>';
  o += s.part(E(168, 176, 16, 8, -6), lite(G, 0.1), { tex: 'full' });
  o += s.part(Pa('M18 178C10 144 36 108 78 102C124 96 172 116 180 160C184 172 176 182 166 182H30C24 182 19 180 18 178Z'), G, { tex: 'full' });
  o += s.part(Pa('M46 112C56 98 76 92 96 94C86 100 70 106 58 120Z'), lite(G, 0.22), { tex: 'pat' });
  o += s.part(E(112, 100, 22, 7, 8), '#849D57', { tex: 'pat' }) + s.part(E(138, 108, 12, 5, 16), '#9DB36A', { tex: 'pat' });
  o += s.line('M96 126q10 16 4 34M62 150q12-4 20 6', Gd, 2);
  return s.svg(o);
};
sprites['prop-grass-tuft'] = () => {
  const s = new Sprite('pg'); const cols = ['#849D57', '#9DB36A', '#6F8847', '#8AA45C'];
  const blade = (x0, x1, h, w, i) => s.part(Pa(`M${x0} 184C${x0 - 2} ${184 - h * 0.5} ${x1 - w} ${184 - h * 0.8} ${x1} ${184 - h}C${x1 + 4} ${184 - h * 0.6} ${x0 + w + 4} ${184 - h * 0.4} ${x0 + w + 6} 184Z`), cols[i % 4], { tex: 'pat' });
  let o = '<ellipse cx="100" cy="185" rx="48" ry="4" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-blades', 100, 184, blade(70, 36, 96, 6, 2) + blade(120, 166, 100, 6, 3) + blade(86, 62, 130, 7, 0) + blade(108, 142, 126, 7, 1) + blade(96, 94, 160, 8, 0) + blade(84, 112, 92, 7, 3));
  return s.svg(o);
};
sprites['prop-flower'] = () => {
  const s = new Sprite('pf'); const Pt = '#E6A599', Ct = '#E1B75C', St = '#7C9650';
  let o = '<ellipse cx="100" cy="185" rx="26" ry="3.6" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.limb('M100 184C98 160 104 130 100 96', 7, St) + s.part(E(76, 150, 20, 8, -28), '#8AA45C', { tex: 'pat' }) + s.part(E(126, 130, 18, 7, 28), '#6F8847', { tex: 'pat' });
  let pet = '';
  for (let i = 0; i < 7; i++) { const a = (i / 7) * 360; pet += s.part(E(100, 56, 13, 22, a).map((v, j) => j ? v.replace(/transform="rotate\(\S+ \S+ \S+\)"/, '') + ` transform="rotate(${f(a)} 100 78)"` : v), i % 2 ? lite(Pt, 0.12) : Pt, { tex: 'pat' }); }
  o += s.g('fx-bloom', 100, 78, pet + s.part(C(100, 78, 16), Ct, { tex: 'full' }) + s.dots([[95, 74], [105, 74], [100, 83]], 1.6, '#8A5A3C') +
    s.g('fx-eyes', 100, 78, ''));
  return s.svg(o);
};
sprites['prop-thread-loop'] = () => {
  const s = new Sprite('pt'); const T = '#B8694C', Td = '#D9AC8C';
  let o = s.g('fx-thread', 100, 100, s.limb('M100 48C132 48 154 70 154 100C154 132 128 152 100 152C70 152 48 130 48 100C48 70 70 48 100 48', 7, T) +
    s.limb('M100 152C118 168 150 176 190 168', 6, T) + s.limb('M60 130C46 152 28 164 8 164', 6, Td) +
    s.line('M70 56C90 50 110 50 130 56M58 124C70 142 88 150 108 150', Td, 2, '5 4') +
    s.part(C(100, 49, 7.5), Td) + s.part(C(190, 168, 4.4), Td) + s.part(C(8, 164, 4.4), T));
  return s.svg(o);
};
sprites['prop-pond-ripple'] = () => {
  const s = new Sprite('pw'); const W = '#AAC2CC';
  let o = s.part(Pa('M14 120C14 92 56 80 104 82C152 80 188 94 186 124C184 154 144 170 98 168C52 170 14 150 14 120Z'), W, { tex: 'full' });
  o += s.g('fx-ripple fx-ripple-a', 100, 124, `<ellipse cx="100" cy="124" rx="30" ry="10" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.4" stroke-dasharray="6 5"/>`);
  o += s.g('fx-ripple fx-ripple-b', 100, 124, `<ellipse cx="100" cy="124" rx="54" ry="19" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-dasharray="6 5"/>`);
  o += s.g('fx-ripple fx-ripple-c', 100, 124, `<ellipse cx="100" cy="124" rx="76" ry="28" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2" stroke-dasharray="6 5"/>`);
  o += s.g('fx-pad', 150, 108, s.part(E(152, 108, 14, 6), '#849D57', { tex: 'pat' }) + s.plain(Pa('M152 108l8-4v4z'), W));
  o += s.part(C(52, 132, 3.4), lite(W, 0.5), { tex: 'none' }) + s.part(C(60, 124, 2.4), lite(W, 0.5), { tex: 'none' });
  return s.svg(o);
};
sprites['prop-basket'] = () => {
  const s = new Sprite('pb'); const Sj = '#D4B27A', Sd = '#B4905A', Lt = '#8A5A3C', Tc = '#B0654A', Ol = '#849D57';
  let o = '<ellipse cx="100" cy="186" rx="64" ry="5" fill="#2a1608" opacity=".13" stroke="none"/>';
  o += s.g('fx-handle', 100, 70, s.limb('M52 100C46 40 154 40 148 100', 8, Lt));
  o += s.part(C(78, 96, 22), Tc, { tex: 'full' }) + s.line('M62 90q16 12 32 2M64 104q14 8 28-2', lite(Tc, 0.45), 2, '4 3') +
    s.part(C(122, 98, 20), Ol, { tex: 'full' }) + s.line('M108 92q14 10 28 0M108 106q14 6 26-2', lite(Ol, 0.4), 2, '4 3') +
    s.part(C(100, 88, 17), '#E1B75C', { tex: 'full' });
  o += s.part(Pa('M34 106H166C168 146 156 176 130 180H70C44 176 32 146 34 106Z'), Sj, { tex: 'full' });
  let w = ''; for (let i = 0; i < 6; i++) w += `M${38 + i * 1.2} ${116 + i * 11}H${162 - i * 1.2}`;
  o += s.line(w, Sd, 1.6) + `<path d="M50 112v66M70 112v68M90 112v68M110 112v68M130 112v68M150 112v66" stroke="${Sd}" stroke-width="1.2" stroke-opacity=".6" fill="none" stroke-dasharray="0"/>`;
  o += s.part(Pa('M36 140H164L162 154H38Z'), Tc, { tex: 'pat' }) + s.plain(Pa('M50 140l8 14h-16zM82 140l8 14h-16zM114 140l8 14h-16zM146 140l8 14h-16z'), '#F1E6CC');
  o += s.part(R(30, 100, 140, 13, 6.5), Lt, { tex: 'pat' });
  return s.svg(o);
};
