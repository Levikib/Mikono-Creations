import { Sprite, E, R, Pa, C, dark, lite, f } from '../lib.mjs';
export const sprites = {};
const hex = (cx, cy, r) => { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.2832 + 0.5236; d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * r) + ' ' + f(cy + Math.sin(a) * r * 0.86); } return d + 'Z'; };

// ---------------------------------------------------------------- crocodile (small, friendly)
sprites['crocodile-stand'] = () => {
  const s = new Sprite('cr'); const G = '#92A460', Gd = '#6E7F47', Cr = '#E6E0B8', T = '#F6EEDB';
  let o = '';
  o += s.g('fx-tail', 56, 146, s.part(Pa('M58 134C40 134 22 146 6 162C24 162 42 162 62 158Z'), G));
  o += s.leg('fx-leg-bf', 70, 150, 15, 32, dark(G, 0.18), null) + s.leg('fx-leg-ff', 112, 150, 15, 32, dark(G, 0.18), null);
  o += s.g('fx-body', 90, 150, s.part(E(88, 142, 42, 19), G) + s.part(E(90, 154, 34, 6), Cr, { tex: 'pat' }) +
    s.part(Pa('M52 128L58 118L64 129L72 117L78 128L86 116L92 128L100 116L106 128L114 118L118 130Z'), Gd, { tex: 'pat' }));
  o += s.leg('fx-leg-bn', 56, 152, 15, 30, G, null) + s.leg('fx-leg-fn', 124, 152, 15, 30, G, null);
  const head = s.part(Pa('M118 130C128 120 152 122 168 128C184 130 194 138 192 148C190 156 172 156 156 156C142 158 126 156 118 152Z'), G) +
    s.part(Pa('M122 150C140 154 166 156 188 152C186 158 170 160 152 160C138 160 128 158 122 150Z'), Cr, { tex: 'pat' }) +
    s.line('M126 146C148 150 170 148 190 146', Gd, 1.6) +
    s.plain(Pa('M156 147l3-5 3 5zM170 147l3-5 3 5zM144 146l3-4 3 4z'), T) +
    s.plain(C(186, 133, 2.4), Gd) + s.plain(C(176, 131, 2), Gd) +
    s.part(C(138, 123, 10), G) +
    s.g('fx-eyes', 138, 122, s.eye(140, 122, 4.8, true)) + s.blush(150, 140, 5, 3.2);
  o += s.g('fx-head', 120, 144, head);
  return s.svg(o);
};
sprites['crocodile-float'] = () => {
  const s = new Sprite('cf'); const G = '#92A460', Gd = '#6E7F47', Cr = '#E6E0B8', W = '#AAC2CC', T = '#F6EEDB';
  let o = '';
  o += s.g('fx-tail', 176, 150, s.part(Pa('M150 150C160 140 172 138 190 146C176 146 164 150 156 156Z'), G, { tex: 'pat' }) + s.part(Pa('M168 144l4-8 4 9z'), Gd, { tex: 'none' }));
  o += s.part(Pa('M16 150C16 140 40 138 70 142C84 144 116 144 130 142C160 138 184 142 184 152Z'), G, { tex: 'pat' }) + s.part(Pa('M30 142l4-9 4 9zM46 142l4-9 4 9zM62 142l4-9 4 9z'), Gd, { tex: 'none' });
  o += s.g('fx-head', 100, 150, s.part(E(100, 136, 38, 24), G) + s.part(E(100, 144, 24, 15), lite(G, 0.18), { tex: 'pat' }) +
    s.plain(E(91, 140, 2.8, 2), Gd) + s.plain(E(109, 140, 2.8, 2), Gd) + s.line('M82 152q18 12 36 0', Gd, 1.8) + s.plain(Pa('M90 154l2.5 5 2.5-4zM106 154l2.5 5 2.5-4z'), T) +
    s.part(C(76, 120, 11), G) + s.part(C(124, 120, 11), G) +
    s.g('fx-eyes', 100, 120, s.eye(77, 120, 4.8, true) + s.eye(123, 120, 4.8, true)) + s.blush(72, 140, 5, 3.2) + s.blush(128, 140, 5, 3.2));
  o += s.part(Pa('M4 162C30 154 40 170 66 162C92 154 106 170 132 162C158 154 172 170 196 160L196 198L4 198Z'), W, { tex: 'full' });
  o += s.g('fx-ripple', 100, 168, `<ellipse cx="100" cy="170" rx="60" ry="7" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-dasharray="6 5"/><ellipse cx="100" cy="170" rx="86" ry="11" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="6 5"/>`);
  return s.svg(o);
};

// ---------------------------------------------------------------- tortoise (high domed shell, plates, stumpy legs)
function shell(s, Sh, Pl, Dk, rim) {
  s.extraDefs = '';
  let o = s.part(Pa('M30 160C28 100 64 60 106 60C150 60 178 100 174 160Z'), Sh, { tex: 'full' });
  const pl = (cx, cy, r) => `<path d="${hex(cx, cy, r)}" fill="${Pl}" stroke="${Dk}" stroke-width="2.2" stroke-dasharray="0" stroke-linejoin="round"/>`;
  o += pl(106, 96, 20) + pl(68, 118, 17) + pl(144, 118, 17) + pl(106, 136, 16) + pl(52, 148, 11) + pl(160, 146, 11) + pl(84, 152, 9) + pl(128, 152, 9);
  o += s.line('M106 76V60M126 90L138 82M86 90L74 82M52 130L36 128M160 130L172 126', Dk, 2);
  o += s.part(R(26, 154, 152, 15, 7.5), rim, { tex: 'pat' });
  return o;
}
sprites['tortoise-stand'] = () => {
  const s = new Sprite('tg'); const Sh = '#A68856', Pl = '#C7AC78', Dk = '#6E5636', Sk = '#BFAC86', Rim = '#DCCBA2';
  let o = '';
  o += s.g('fx-tail', 36, 168, s.part(Pa('M36 164L22 172L38 176Z'), Sk, { tex: 'pat' }));
  const lg = (cls, x, c) => s.g(cls, x + 12, 164, s.part(R(x, 156, 22, 28, 10), c));
  o += lg('fx-leg-bf', 60, dark(Sk, 0.14)) + lg('fx-leg-ff', 120, dark(Sk, 0.14));
  o += s.g('fx-neck', 160, 150, s.limb('M158 156C172 150 180 140 184 134', 18, Sk) + s.g('fx-head', 184, 134, s.part(E(184, 134, 20, 16), Sk) + s.line('M188 143q5 3 10-1', Dk, 1.4) + s.plain(E(197, 131, 2, 1.6), Dk) + s.g('fx-eyes', 186, 128, s.eye(187, 128, 4.2)) + s.blush(179, 140, 4, 2.8)));
  o += s.g('fx-body', 100, 150, shell(s, Sh, Pl, Dk, Rim));
  o += lg('fx-leg-bn', 44, Sk) + lg('fx-leg-fn', 134, Sk);
  return s.svg(`<g transform="translate(9 18) scale(.9)">${o}</g>`);
};
sprites['tortoise-hide'] = () => {
  const s = new Sprite('th'); const Sh = '#A68856', Pl = '#C7AC78', Dk = '#6E5636', Sk = '#BFAC86', Rim = '#DCCBA2';
  let o = '<ellipse cx="100" cy="186" rx="76" ry="5" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-body', 100, 160, s.part(Pa('M26 178C24 104 62 62 104 62C148 62 180 100 178 178Z'), Sh, { tex: 'full' }));
  const pl = (cx, cy, r) => `<path d="${hex(cx, cy, r)}" fill="${Pl}" stroke="${Dk}" stroke-width="2.2" stroke-dasharray="0" stroke-linejoin="round"/>`;
  o += pl(104, 100, 21) + pl(64, 122, 17) + pl(144, 122, 17) + pl(104, 142, 15) + pl(48, 152, 10) + pl(160, 150, 10) + s.line('M104 79V62M124 92L138 84M84 92L70 84', Dk, 2);
  o += s.part(R(24, 168, 156, 12, 6), Rim, { tex: 'pat' });
  o += s.g('fx-head', 150, 178, '<path d="M120 180C120 156 180 156 180 180Z" fill="#3E2F24" stroke="none"/>' + s.part(E(150, 176, 17, 11), Sk) + s.g('fx-eyes', 150, 172, s.eye(143, 171, 3.8) + s.eye(157, 171, 3.8)) + s.plain(E(150, 177, 2, 1.4), Dk) + s.blush(138, 178, 3.4, 2.2) + s.blush(162, 178, 3.4, 2.2));
  return s.svg(o);
};

// ---------------------------------------------------------------- chameleon
function chameleon(k, zap) {
  const s = new Sprite(k); const G = '#9DAF62', Gd = '#738848', Oc = '#D8AE62', Tc = '#C46A52', Br = '#8A6A4A';
  let o = s.limb('M2 156L198 146', 11, Br) + s.line('M24 152l8-1M80 150l9-1M150 148l8-1', dark(Br, 0.35), 1.6);
  o += s.part(E(14, 140, 16, 7, -14), '#849D57') + s.part(E(184, 134, 14, 6, 14), '#849D57');
  let c = '';
  c += s.g('fx-tail', 70, 124, s.limb('M72 126C44 124 30 140 38 154C44 164 62 158 60 148C58 140 48 142 50 148', 9, Gd));
  c += s.g('fx-leg-b', 82, 130, s.limb('M84 130L78 150', 8, dark(G, 0.2)) + s.part(E(77, 152, 8, 5), dark(G, 0.2), { tex: 'none' }));
  c += s.g('fx-body', 100, 120, s.part(E(100, 116, 36, 27, -4), G, { tex: 'full' }) + s.part(E(102, 132, 24, 7), lite(G, 0.4), { tex: 'pat' }) +
    s.part(Pa('M66 104L70 92L76 102L82 90L88 100L96 88L102 98L110 88L116 100L124 92L128 104Z'), Gd, { tex: 'pat' }) +
    s.dots([[78, 118, 4.2], [96, 124, 3.4], [112, 112, 4.2], [124, 124, 3.2]], 3.5, Oc) + s.dots([[88, 110, 2.8], [106, 128, 2.8]], 2.6, Tc));
  c += s.g('fx-leg-f', 122, 130, s.limb('M120 132L126 152', 8, G) + s.part(E(127, 153, 8, 5), G, { tex: 'none' }));
  const mouth = zap ? s.part(Pa('M140 118C150 112 164 110 172 114C172 124 160 126 148 126Z'), '#B65B4A', { tex: 'none' }) : '';
  c += s.g('fx-head', 134, 108, s.part(Pa('M128 98C132 78 152 74 160 86C170 100 168 116 156 122C146 126 134 120 128 108Z'), G, { tex: 'full' }) +
    s.part(Pa('M130 94L124 80L142 80Z'), Gd, { tex: 'pat' }) +
    s.part(E(162, 112, 12, 8, 12), lite(G, 0.15), { tex: 'pat' }) + mouth +
    s.line(zap ? 'M150 124C158 128 168 124 172 118' : 'M150 118C158 122 166 118 172 112', dark(G, 0.55), 1.6) + s.plain(C(171, 108, 1.8), Gd) +
    s.part(C(146, 96, 11), lite(G, 0.1), { tex: 'pat' }) + s.plain(C(146, 96, 7.6), '#F1E6C8') +
    s.g('fx-eyes', 147, 96, s.eye(148, 96, 4.4)) + s.blush(142, 112, 4, 2.8));
  o += zap ? `<g transform="translate(-22 0)">${c}</g>` : c;
  if (zap) {
    o += s.g('fx-tongue', 150, 124, `<path d="M148 126C168 124 184 118 196 108" fill="none" stroke="#9A4538" stroke-width="7" stroke-dasharray="0"/><path d="M148 126C168 124 184 118 196 108" fill="none" stroke="#D98A80" stroke-width="4.6" stroke-dasharray="0"/>` + s.part(C(196, 107, 6.4), Tc));
  }
  return s.svg(o);
}
sprites['chameleon-perch'] = () => chameleon('ma', false);
sprites['chameleon-zap'] = () => chameleon('mb', true);

// ---------------------------------------------------------------- bush baby
function bbHead(s, B, Mk, Ear, closed) {
  return s.g('fx-ear', 100, 66, s.part(E(64, 60, 16, 25, -24), Ear) + s.plain(E(65, 61, 8, 16, -24), '#D7B6A0') + s.line('M60 48q-4 10 0 20m8-18q-2 10 2 18', dark(Ear, 0.3), 1) +
    s.part(E(136, 60, 16, 25, 24), Ear) + s.plain(E(135, 61, 8, 16, 24), '#D7B6A0') + s.line('M140 48q4 10 0 20m-8-18q2 10-2 18', dark(Ear, 0.3), 1)) +
    s.part(E(100, 82, 33, 28), B, { tex: 'full' }) + s.plain(C(83, 82, 14), Mk, 'opacity=".85"') + s.plain(C(117, 82, 14), Mk, 'opacity=".85"') +
    s.part(E(100, 95, 10, 8), '#EAD9C0', { tex: 'pat' }) + s.plain(E(100, 91, 4.4, 3.2), '#8A5A4C') + s.line('M94 99q6 5 12 0', '#6b4a36', 1.4) +
    (closed ? s.shut(83, 82, 6) + s.shut(117, 82, 6) : s.g('fx-eyes', 100, 82, s.eye(83, 82, 8.6) + s.eye(117, 82, 8.6))) + s.blush(72, 98, 5.5, 3.4) + s.blush(128, 98, 5.5, 3.4);
}
sprites['bush-baby-sit'] = () => {
  const s = new Sprite('bb'); const B = '#BCA88F', Mk = '#6E5A4A', Ear = '#A8957C', Cr = '#EADCC4';
  let o = '';
  o += s.g('fx-tail', 124, 170, s.limb('M122 176C158 182 172 150 160 120', 13, dark(B, 0.06)) + s.part(E(160, 118, 8, 12, 12), Mk));
  o += s.part(E(84, 184, 15, 6), dark(B, 0.1)) + s.part(E(116, 184, 15, 6), dark(B, 0.1));
  o += s.g('fx-body', 100, 150, s.part(E(100, 142, 29, 38), B, { tex: 'full' }) + s.part(E(100, 148, 17, 28), Cr, { tex: 'pat' }));
  o += s.g('fx-arm', 100, 120, s.limb('M78 124C80 138 88 148 94 150', 8, B) + s.limb('M122 124C120 138 112 148 106 150', 8, B) + s.part(E(98, 152, 6, 5), dark(B, 0.1), { tex: 'none' }) + s.part(E(102, 152, 6, 5), dark(B, 0.1), { tex: 'none' }));
  o += s.g('fx-head', 100, 100, bbHead(s, B, Mk, Ear, false));
  return s.svg(o);
};
sprites['bush-baby-sleep'] = () => {
  const s = new Sprite('bz'); const B = '#BCA88F', Mk = '#6E5A4A', Ear = '#A8957C', Cr = '#EADCC4';
  let o = '<ellipse cx="100" cy="186" rx="62" ry="5" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-body', 100, 150, s.part(E(104, 148, 52, 38), B, { tex: 'full' }) + s.part(E(110, 166, 34, 12), Cr, { tex: 'pat' }));
  o += s.g('fx-head', 80, 130, s.part(E(60, 112, 10, 15, -30), Ear) + s.part(E(98, 108, 10, 15, 30), Ear) +
    s.part(E(80, 128, 31, 25), B, { tex: 'full' }) + s.plain(C(66, 128, 12), Mk, 'opacity=".85"') + s.plain(C(94, 128, 12), Mk, 'opacity=".85"') +
    s.shut(66, 128, 6) + s.shut(94, 128, 6) + s.plain(E(80, 140, 4, 3), '#8A5A4C') + s.line('M75 145q5 4 10 0', '#6b4a36', 1.3) + s.blush(58, 140, 5, 3) + s.blush(102, 140, 5, 3));
  o += s.g('fx-tail', 150, 170, s.limb('M150 172C130 190 80 190 62 168', 13, dark(B, 0.06)) + s.part(E(60, 166, 8, 10, -30), Mk));
  o += s.part(E(100, 158, 8, 6), dark(B, 0.1), { tex: 'none' });
  return s.svg(o);
};

// ---------------------------------------------------------------- bee
function beeStripes(s, cx, cy, rx, ry, rot, Y, Dk, id) {
  s.extraDefs += `<clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/></clipPath>`;
  let bands = '';
  for (let i = -1; i < 4; i++) bands += `<rect x="${cx - rx + 18 + i * 22}" y="${cy - ry - 4}" width="11" height="${ry * 2 + 8}" fill="${Dk}" stroke="none"/>`;
  return s.part(E(cx, cy, rx, ry, rot), Y, { tex: 'full' }) + `<g clip-path="url(#${id})" transform="${rot ? `rotate(${rot} ${cx} ${cy})` : ''}">${bands}</g>`;
}
sprites['bee-fly'] = () => {
  const s = new Sprite('be'); const Y = '#E8B84E', Dk = '#4A3A30', Fc = '#F0CF77', W = '#D8E6EA';
  let o = '<ellipse cx="100" cy="184" rx="30" ry="3.4" fill="#2a1608" opacity=".09" stroke="none"/>';
  o += s.g('fx-wing fx-wing-b', 96, 84, s.part(E(86, 62, 13, 30, -24), W, { tex: 'none', stroke: '#9DB3BC' }) + s.plain(E(86, 62, 13, 30, -24), '#fff', 'opacity=".4"'));
  o += s.plain(Pa('M62 116L48 112L52 124Z'), Dk);
  o += s.line('M92 138l-4 12m14-10l-1 12m14-12l3 12', Dk, 2.4);
  o += s.g('fx-body', 96, 116, beeStripes(s, 96, 114, 36, 29, -6, Y, Dk, 'bec'));
  o += s.g('fx-wing fx-wing-a', 104, 86, s.part(E(110, 60, 13, 32, 14), W, { tex: 'none', stroke: '#9DB3BC' }) + s.plain(E(110, 60, 13, 32, 14), '#fff', 'opacity=".4"'));
  o += s.g('fx-head', 134, 108, s.line('M138 88C140 72 150 66 158 70', Dk, 2.2) + s.line('M130 90C128 74 120 68 114 70', Dk, 2.2) + s.plain(C(158, 70, 3), Dk) + s.plain(C(114, 70, 3), Dk) +
    s.part(C(134, 104, 22), Fc, { tex: 'full' }) + s.line('M130 118q8 6 16-2', '#6b4a36', 1.6) +
    s.g('fx-eyes', 138, 100, s.eye(130, 100, 5.4) + s.eye(148, 100, 5.4)) + s.blush(124, 112, 4.4, 3) + s.blush(152, 112, 4.4, 3));
  return s.svg(o);
};
sprites['bee-wave'] = () => {
  const s = new Sprite('bw'); const Y = '#E8B84E', Dk = '#4A3A30', Fc = '#F0CF77', W = '#D8E6EA';
  let o = '<ellipse cx="100" cy="186" rx="38" ry="4" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-wing fx-wing-b', 90, 100, s.part(E(60, 92, 12, 28, -30), W, { tex: 'none', stroke: '#9DB3BC' }));
  o += s.g('fx-wing fx-wing-a', 110, 100, s.part(E(140, 92, 12, 28, 30), W, { tex: 'none', stroke: '#9DB3BC' }));
  o += s.part(E(84, 182, 11, 5), Dk, { tex: 'none' }) + s.part(E(116, 182, 11, 5), Dk, { tex: 'none' });
  o += s.plain(Pa('M100 176L94 190L106 190Z'), Dk);
  o += s.g('fx-body', 100, 140, beeStripes(s, 100, 140, 33, 38, 0, Y, Dk, 'bwc').replace(/x="(\d+)" y="(\d+\.?\d*)" width="11" height="([\d.]+)"/g, (m, x, y, h) => `x="${60}" y="${+y + 22 * ((x - 67) / 22)}" width="80" height="9"`));
  o += s.g('fx-arm fx-arm-l', 70, 124, s.limb('M72 128C58 136 54 150 60 158', 7, Dk));
  o += s.g('fx-arm fx-arm-r', 130, 124, s.limb('M128 126C146 118 152 100 146 86', 7, Dk));
  o += s.g('fx-head', 100, 100, s.line('M88 62C84 48 74 44 68 48', Dk, 2.2) + s.line('M112 62C116 48 126 44 132 48', Dk, 2.2) + s.plain(C(68, 48, 3), Dk) + s.plain(C(132, 48, 3), Dk) +
    s.part(C(100, 84, 26), Fc, { tex: 'full' }) + s.line('M92 94q8 7 16 0', '#6b4a36', 1.8) +
    s.g('fx-eyes', 100, 80, s.eye(88, 80, 5.6) + s.eye(112, 80, 5.6)) + s.blush(79, 92, 5, 3.2) + s.blush(121, 92, 5, 3.2));
  return s.svg(o);
};

// ---------------------------------------------------------------- ladybird
sprites['ladybird-crawl'] = () => {
  const s = new Sprite('lc'); const R1 = '#BA5340', Dk = '#3F3029', Cr = '#F4EAD2';
  let o = '<ellipse cx="100" cy="184" rx="66" ry="4" fill="#2a1608" opacity=".1" stroke="none"/>';
  o += s.g('fx-leg-b', 70, 156, s.limb('M70 156L62 178', 6, Dk)) + s.g('fx-leg-a', 104, 158, s.limb('M104 158L106 180', 6, Dk)) + s.g('fx-leg-c', 134, 156, s.limb('M134 156L144 178', 6, Dk));
  o += s.g('fx-body', 100, 150, s.part(R(40, 146, 124, 14, 7), Dk, { tex: 'pat' }) +
    s.part(Pa('M42 152C40 104 72 80 104 80C136 80 162 104 162 152Z'), R1, { tex: 'full' }) +
    s.line('M104 82V150', Dk, 2) + s.dots([[72, 120, 7], [128, 118, 7.4], [92, 100, 5], [114, 134, 6.4], [78, 140, 4.6], [144, 138, 4.4]], 6, Dk));
  o += s.g('fx-head', 164, 140, s.line('M170 124C174 108 184 104 190 108', Dk, 2.4) + s.line('M164 124C162 110 156 106 150 108', Dk, 2.4) + s.plain(C(190, 108, 3), Dk) + s.plain(C(150, 108, 3), Dk) +
    s.part(Pa('M154 156C150 130 160 120 174 122C190 124 194 146 190 156Z'), Dk, { tex: 'full' }) + s.plain(E(176, 134, 11, 9), Cr) +
    s.g('fx-eyes', 178, 132, s.eye(178, 132, 4.6)) + s.blush(168, 146, 4.4, 3));
  return s.svg(o);
};
sprites['ladybird-fly'] = () => {
  const s = new Sprite('lf'); const R1 = '#BA5340', Dk = '#3F3029', Cr = '#F4EAD2', W = '#E4D8BC';
  let o = '';
  o += s.g('fx-wing fx-wing-w', 92, 126, s.part(E(60, 86, 12, 44, -52), W, { tex: 'none', stroke: '#B8A98A' }));
  o += s.g('fx-body', 100, 140, s.part(E(100, 144, 44, 18), Dk, { tex: 'full' }));
  o += s.g('fx-wing fx-wing-b', 92, 128, `<g transform="rotate(-62 92 128)">` + s.part(Pa('M92 130C70 102 90 70 130 72C150 86 138 118 92 130Z'), dark(R1, 0.12), { tex: 'pat' }) + s.dots([[110, 94, 5]], 5, Dk) + '</g>');
  o += s.g('fx-wing fx-wing-a', 108, 128, `<g transform="rotate(-34 108 130)">` + s.part(Pa('M108 132C84 100 110 62 150 68C170 86 156 118 108 132Z'), R1, { tex: 'full' }) + s.dots([[132, 92, 6], [118, 110, 4.4]], 5, Dk) + s.line('M108 130C124 106 140 84 150 70', Dk, 1.6) + '</g>');
  o += s.line('M80 158l-8 10m26-8l-4 12m24-10l4 12', Dk, 3);
  o += s.g('fx-head', 144, 140, s.line('M148 124C150 112 158 108 164 110', Dk, 2.2) + s.part(C(146, 142, 17), Dk, { tex: 'full' }) + s.plain(E(150, 136, 8, 6), Cr) +
    s.g('fx-eyes', 151, 135, s.eye(151, 135, 4.2)) + s.blush(142, 148, 3.6, 2.6));
  return s.svg(o);
};
