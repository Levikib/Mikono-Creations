import { Sprite, E, R, Pa, C, dark, lite, f } from '../lib.mjs';
export const sprites = {};

// ---------------------------------------------------------------- buffalo
sprites['buffalo-stand'] = () => {
  const s = new Sprite('bf'); const B = '#6A5246', Dk = '#3F3029', H = '#D5C6A6', N = '#9B8173';
  let o = '';
  o += s.g('fx-tail', 46, 106, s.limb('M46 108C34 126 34 148 40 160', 5, dark(B, 0.2)) + s.part(E(41, 164, 6, 9, 8), Dk));
  o += s.leg('fx-leg-bf', 62, 140, 21, 42, dark(B, 0.2), Dk) + s.leg('fx-leg-ff', 112, 140, 21, 42, dark(B, 0.2), Dk);
  o += s.g('fx-body', 90, 140, s.part(Pa('M36 124C36 96 62 84 92 86C110 84 124 92 138 104C146 114 146 134 140 146C120 158 60 160 40 146Z'), B) + s.part(E(88, 148, 34, 8), lite(B, 0.12), { tex: 'pat' }));
  o += s.leg('fx-leg-bn', 44, 142, 21, 40, B, Dk) + s.leg('fx-leg-fn', 98, 142, 21, 40, B, Dk);
  const head = s.part(E(140, 134, 22, 22, 20), B) +
    s.g('fx-ear', 142, 136, s.part(E(138, 140, 14, 7, 28), dark(B, 0.1))) +
    s.part(E(158, 144, 20, 18, 28), B) + s.part(E(172, 156, 12, 10, 28), N) + s.plain(E(176, 157, 2.4, 1.8), Dk) +
    s.limb('M146 118C124 112 108 126 116 148', 8, '#A8987A') + s.plain(C(116, 148, 3.6), Dk) +
    s.part(E(150, 118, 13, 7, 8), H) +
    s.g('fx-eyes', 160, 136, s.eye(162, 135, 3.8, true)) + s.blush(156, 150, 5, 3);
  o += s.g('fx-head', 140, 126, head);
  return s.svg(o);
};
sprites['buffalo-peek'] = () => {
  const s = new Sprite('bp'); const B = '#6A5246', Dk = '#3F3029', H = '#D5C6A6', N = '#9B8173';
  let o = '';
  o += s.g('fx-body', 100, 200, s.part(E(100, 206, 64, 36), dark(B, 0.1)));
  o += s.limb('M64 102C40 98 26 114 30 136', 12, H) + s.limb('M136 102C160 98 174 114 170 136', 12, H);
  o += s.limb('M30 136C28 128 30 122 34 118', 9, dark(H, 0.35)) + s.limb('M170 136C172 128 170 122 166 118', 9, dark(H, 0.35));
  o += s.g('fx-ear', 100, 128, s.part(E(52, 130, 17, 9, 24), dark(B, 0.12)) + s.part(E(148, 130, 17, 9, -24), dark(B, 0.12)));
  o += s.g('fx-head', 100, 140, s.part(E(100, 130, 38, 36), B) + s.part(E(100, 98, 42, 13), '#C4B692') + s.part(E(100, 156, 24, 21), N) +
    s.plain(E(91, 158, 4, 3), Dk) + s.plain(E(109, 158, 4, 3), Dk) + s.line('M92 170q8 5 16 0', Dk, 1.4) +
    s.line('M86 108q4-8 8 0m4 0q4-8 8 0m4 0q4-8 8 0', dark(B, 0.45), 1.6) +
    s.g('fx-eyes', 100, 124, s.eye(80, 122, 4.2, true) + s.eye(120, 122, 4.2, true)) + s.blush(72, 140, 6, 3.6) + s.blush(128, 140, 6, 3.6));
  return s.svg(o);
};

// ---------------------------------------------------------------- warthog
sprites['warthog-stand'] = () => {
  const s = new Sprite('wh'); const B = '#A38D75', Dk = '#5E4C3E', P = '#CBA697', Cr = '#F1E6CC';
  let o = '';
  o += s.g('fx-tail', 48, 110, s.limb('M50 112C42 98 50 88 46 76', 4, dark(B, 0.2)) + s.part(Pa('M40 78L46 62L52 78Z'), Dk, { tex: 'none' }));
  o += s.leg('fx-leg-bf', 62, 146, 13, 36, dark(B, 0.18), Dk) + s.leg('fx-leg-ff', 108, 146, 13, 36, dark(B, 0.18), Dk);
  o += s.g('fx-body', 88, 140, s.part(E(88, 128, 44, 27), B) + s.part(E(90, 146, 28, 8), lite(B, 0.2), { tex: 'pat' }) +
    s.part(Pa('M52 116L56 98L63 112L70 94L77 109L85 92L92 107L100 91L107 107L116 93L121 110L130 100L130 116Z'), Dk, { tex: 'pat' }));
  o += s.leg('fx-leg-bn', 46, 146, 13, 36, B, Dk) + s.leg('fx-leg-fn', 120, 146, 13, 36, B, Dk);
  const head = s.part(Pa('M116 104C136 90 164 98 176 118C184 132 178 148 164 150C150 152 132 146 120 134Z'), B) +
    s.part(Pa('M132 100L136 80L148 96Z'), dark(B, 0.1)) + s.plain(Pa('M136 98L138 86L144 96Z'), P) +
    s.part(E(177, 130, 8, 11), P) + s.plain(E(179, 127, 1.8, 2.6), Dk) + s.plain(E(179, 135, 1.8, 2.6), Dk) +
    s.part(Pa('M156 152C180 156 196 138 190 108C184 128 172 138 154 140Z'), Cr) +
    s.plain(E(147, 134, 4.4, 3.6), lite(B, 0.3)) + s.plain(E(141, 112, 4, 3.4), lite(B, 0.3)) +
    s.line('M158 152l-2 6m6-6l1 6', Cr, 2) +
    s.g('fx-eyes', 152, 116, s.eye(153, 116, 3.8, true)) + s.blush(148, 128, 4, 2.8);
  o += s.g('fx-head', 128, 124, head);
  return s.svg(o);
};
sprites['warthog-peek'] = () => {
  const s = new Sprite('wp'); const B = '#A38D75', Dk = '#5E4C3E', P = '#CBA697', Cr = '#F1E6CC';
  let o = '';
  o += s.g('fx-body', 100, 200, s.part(E(100, 208, 60, 34), dark(B, 0.08)));
  o += s.part(Pa('M62 112L58 84L68 100L74 72L82 98L92 66L100 94L108 66L118 98L126 72L132 100L142 84L138 112Z'), Dk, { tex: 'pat' });
  o += s.g('fx-ear', 100, 108, s.part(Pa('M52 124L44 92L72 112Z'), dark(B, 0.1)) + s.plain(Pa('M54 118L50 100L66 112Z'), P) + s.part(Pa('M148 124L156 92L128 112Z'), dark(B, 0.1)) + s.plain(Pa('M146 118L150 100L134 112Z'), P));
  o += s.g('fx-head', 100, 140, s.part(E(100, 134, 46, 38), B) +
    s.part(Pa('M76 158C58 152 52 130 60 114C66 130 74 142 84 150Z'), Cr) + s.part(Pa('M124 158C142 152 148 130 140 114C134 130 126 142 116 150Z'), Cr) +
    s.part(E(100, 152, 25, 19), P) + s.plain(E(91, 154, 4.4, 5.4), Dk) + s.plain(E(109, 154, 4.4, 5.4), Dk) +
    s.part(E(66, 138, 5, 4), lite(B, 0.25), { tex: 'none' }) + s.part(E(134, 138, 5, 4), lite(B, 0.25), { tex: 'none' }) +
    s.g('fx-eyes', 100, 122, s.eye(80, 122, 4, true) + s.eye(120, 122, 4, true)) + s.blush(72, 148, 5, 3) + s.blush(128, 148, 5, 3));
  return s.svg(o);
};

// ---------------------------------------------------------------- dik-dik
sprites['dik-dik-stand'] = () => {
  const s = new Sprite('dd'); const B = '#BCA27E', Dk = '#6B5440', Cr = '#F1E6CE';
  let o = '';
  o += s.g('fx-tail', 60, 114, s.part(E(58, 114, 5, 3.4, -20), Cr));
  o += s.leg('fx-leg-bf', 70, 136, 7, 46, dark(B, 0.2), Dk) + s.leg('fx-leg-ff', 106, 136, 7, 46, dark(B, 0.2), Dk);
  o += s.g('fx-body', 92, 136, s.part(E(92, 124, 32, 21), B) + s.part(E(94, 138, 22, 7), Cr, { tex: 'pat' }) + s.plain(E(86, 112, 20, 7, -4), Dk, 'opacity=".22"'));
  o += s.leg('fx-leg-bn', 60, 138, 7, 44, B, Dk) + s.leg('fx-leg-fn', 116, 138, 7, 44, B, Dk);
  const head = s.g('fx-ear', 124, 82, s.part(E(120, 82, 7.5, 15, -34), B) + s.plain(E(120, 83, 3.6, 10, -34), '#D99C8E')) +
    s.part(Pa('M126 78L130 66L134 78L138 68L140 80Z'), Dk, { tex: 'none' }) +
    s.part(C(130, 96, 16), B) + s.part(E(147, 104, 12, 7.5, 14), Cr) + s.plain(E(157, 107, 3.4, 2.6), Dk) +
    s.line('M146 109q4 3 8 0', Dk, 1.2) +
    s.plain(C(134, 92, 8), Cr, 'opacity=".7"') +
    s.g('fx-eyes', 134, 92, s.eye(135, 92, 4.6)) + s.blush(126, 104, 4.4, 3);
  o += s.g('fx-neck', 114, 116, s.part(E(116, 108, 10, 19, 26), B) + s.g('fx-head', 130, 96, head));
  return s.svg(o);
};
sprites['dik-dik-peek'] = () => {
  const s = new Sprite('dp'); const B = '#BCA27E', Dk = '#6B5440', Cr = '#F1E6CE';
  let o = '';
  o += s.g('fx-ear', 100, 112, s.part(E(60, 104, 13, 24, -48), B) + s.plain(E(60, 105, 6.4, 17, -48), '#D99C8E') + s.part(E(140, 104, 13, 24, 48), B) + s.plain(E(140, 105, 6.4, 17, 48), '#D99C8E'));
  o += s.g('fx-head', 100, 150, s.part(Pa('M92 86L96 66L100 82L104 62L108 86Z'), Dk, { tex: 'none' }) +
    s.part(Pa('M72 130C70 100 130 100 128 130C128 150 116 162 112 174C108 184 92 184 88 174C84 162 72 150 72 130Z'), B, { tex: 'full' }) +
    s.part(E(100, 162, 12, 15), Cr, { tex: 'pat' }) + s.plain(E(100, 174, 5.4, 4), Dk) + s.line('M96 180q4 3 8 0', Dk, 1.2) +
    s.plain(C(86, 124, 10), Cr, 'opacity=".75"') + s.plain(C(114, 124, 10), Cr, 'opacity=".75"') +
    s.g('fx-eyes', 100, 124, s.eye(86, 124, 5.2) + s.eye(114, 124, 5.2)) + s.blush(80, 148, 5, 3.2) + s.blush(120, 148, 5, 3.2));
  o += s.part(E(80, 198, 11, 8), Dk) + s.part(E(120, 198, 11, 8), Dk);
  return s.svg(o);
};

// ---------------------------------------------------------------- impala
function impalaHead(s, hx, hy, B, Dk, Cr, rot) {
  return s.limb(`M${hx - 4} ${hy - 6}C${hx - 18} ${hy - 28} ${hx - 6} ${hy - 44} ${hx + 8} ${hy - 50}`, 4.4, '#5A4A3A') +
    s.limb(`M${hx + 2} ${hy - 6}C${hx - 6} ${hy - 26} ${hx + 8} ${hy - 40} ${hx + 20} ${hy - 44}`, 4.4, '#7A6A55') +
    s.g('fx-ear', hx - 4, hy - 4, s.part(E(hx - 10, hy - 6, 5.5, 12, -62), B) + s.plain(E(hx - 10, hy - 6, 2.6, 8, -62), '#D99C8E')) +
    `<g transform="rotate(${rot} ${hx} ${hy})">` + s.part(E(hx, hy, 16, 12), B) + s.part(E(hx + 12, hy + 5, 9.5, 7), Cr, { tex: 'pat' }) + s.plain(E(hx + 19, hy + 3, 3.2, 2.6), Dk) + `</g>` +
    s.g('fx-eyes', hx + 4, hy - 2, s.eye(hx + 4, hy - 2, 3.8, true)) + s.blush(hx - 2, hy + 7, 4, 2.8);
}
sprites['impala-stand'] = () => {
  const s = new Sprite('im'); const B = '#C98C58', Dk = '#3A2A22', Cr = '#F4E6CE';
  let o = '';
  o += s.g('fx-tail', 50, 106, s.part(E(48, 108, 4.6, 10, 24), Cr) + s.plain(E(47, 112, 1.8, 6, 24), Dk));
  o += s.leg('fx-leg-bf', 64, 138, 9, 44, dark(B, 0.2), Dk) + s.leg('fx-leg-ff', 108, 138, 9, 44, dark(B, 0.2), Dk);
  o += s.g('fx-body', 92, 140, s.part(E(90, 122, 42, 24), B) + s.part(E(92, 138, 30, 7), Cr, { tex: 'pat' }) + s.part(E(66, 122, 16, 18), lite(B, 0.05), { tex: 'pat' }) +
    s.line('M54 112q-2 12 2 24M60 108q-2 14 2 28', Dk, 2.4));
  o += s.leg('fx-leg-bn', 50, 138, 9, 44, B, Dk) + s.leg('fx-leg-fn', 118, 138, 9, 44, B, Dk);
  o += s.g('fx-neck', 120, 112, s.part(E(124, 96, 11, 28, 28), B) + s.g('fx-head', 146, 74, impalaHead(s, 146, 74, B, Dk, Cr, -18)));
  return s.svg(o);
};
sprites['impala-leap'] = () => {
  const s = new Sprite('il'); const B = '#C98C58', Dk = '#3A2A22', Cr = '#F4E6CE';
  let o = '<ellipse cx="96" cy="186" rx="34" ry="4" fill="#2a1608" opacity=".1" stroke="none"/>';
  o += s.g('fx-tail', 52, 108, s.part(E(48, 100, 4.6, 10, 50), Cr) + s.plain(E(47, 98, 1.8, 6, 50), Dk));
  o += s.g('fx-leg-bf', 70, 124, s.limb('M72 126L54 152L38 166', 8, dark(B, 0.2)) + s.part(E(36, 168, 5, 4, 30), Dk, { tex: 'none' }));
  o += s.g('fx-leg-ff', 112, 120, s.limb('M112 122L134 138L150 128', 8, dark(B, 0.2)) + s.part(E(152, 127, 5, 4, -30), Dk, { tex: 'none' }));
  o += s.g('fx-body', 92, 116, s.part(E(92, 114, 42, 23, -14), B) + s.part(E(94, 128, 28, 6, -14), Cr, { tex: 'pat' }) + s.line('M60 116q-4 12 0 24M66 112q-3 12 0 22', Dk, 2.4));
  o += s.g('fx-leg-bn', 66, 120, s.limb('M66 122L40 138L22 156', 9, B) + s.part(E(20, 158, 5, 4, 40), Dk, { tex: 'none' }));
  o += s.g('fx-leg-fn', 118, 116, s.limb('M118 118L142 130L158 118', 9, B) + s.part(E(160, 116, 5, 4, -40), Dk, { tex: 'none' }));
  o += s.g('fx-neck', 122, 92, s.part(E(126, 80, 11, 26, 36), B) + s.g('fx-head', 150, 56, impalaHead(s, 150, 56, B, Dk, Cr, -10)));
  return s.svg(o);
};

// ---------------------------------------------------------------- goat
function goatHead(s, hx, hy, B, Pt, Cr, Hn) {
  return s.limb(`M${hx - 4} ${hy - 10}C${hx - 8} ${hy - 26} ${hx - 22} ${hy - 30} ${hx - 32} ${hy - 22}`, 5.4, Hn) +
    s.g('fx-ear', hx - 8, hy - 4, s.part(E(hx - 16, hy, 12, 5, 10), Pt)) +
    s.part(E(hx, hy, 16, 13, -8), B) + s.part(E(hx + 13, hy + 7, 10, 8), Cr, { tex: 'pat' }) + s.plain(E(hx + 20, hy + 5, 3.2, 2.6), '#2a1c16') +
    s.line(`M${hx + 14} ${hy + 10}q3 3 7 0`, '#6b4a36', 1.2) +
    s.part(Pa(`M${hx + 10} ${hy + 13}L${hx + 14} ${hy + 25}L${hx + 18} ${hy + 13}Z`), Pt, { tex: 'pat' }) +
    s.g('fx-eyes', hx + 5, hy - 3, s.eye(hx + 6, hy - 3, 3.8)) + s.blush(hx, hy + 8, 4.4, 3);
}
sprites['goat-stand'] = () => {
  const s = new Sprite('gt'); const B = '#EDE0C6', Pt = '#8F6444', Cr = '#F7EFDC', Hn = '#B5A68A';
  let o = '';
  o += s.g('fx-tail', 52, 112, s.part(Pa('M52 118L42 98L58 108Z'), B));
  o += s.leg('fx-leg-bf', 66, 140, 9, 42, dark(B, 0.14), '#4A3A30') + s.leg('fx-leg-ff', 110, 140, 9, 42, dark(B, 0.14), '#4A3A30');
  o += s.g('fx-body', 90, 140, s.part(E(90, 124, 40, 24), B) + s.part(E(78, 120, 17, 13, -10), Pt, { tex: 'pat' }) + s.part(E(92, 140, 26, 7), Cr, { tex: 'pat' }));
  o += s.leg('fx-leg-bn', 52, 140, 9, 42, B, '#4A3A30') + s.leg('fx-leg-fn', 120, 140, 9, 42, B, '#4A3A30');
  o += s.g('fx-neck', 118, 116, s.part(E(122, 104, 11, 21, 24), B) + s.g('fx-head', 138, 88, goatHead(s, 138, 88, B, Pt, Cr, Hn)));
  return s.svg(o);
};
sprites['goat-climb'] = () => {
  const s = new Sprite('gc'); const B = '#EDE0C6', Pt = '#8F6444', Cr = '#F7EFDC', Hn = '#B5A68A', Rk = '#A99985';
  let o = '';
  o += s.g('fx-tail', 44, 112, s.part(Pa('M46 118L34 100L52 108Z'), B));
  o += s.g('fx-leg-bf', 62, 130, s.leg('', 56, 130, 9, 52, dark(B, 0.14), '#4A3A30') );
  o += s.g('fx-body', 84, 126, s.part(E(84, 118, 40, 23, -16), B) + s.part(E(72, 118, 17, 12, -16), Pt, { tex: 'pat' }) + s.part(E(84, 132, 26, 6, -16), Cr, { tex: 'pat' }));
  o += s.g('fx-leg-bn', 70, 128, s.leg('', 70, 130, 9, 52, B, '#4A3A30'));
  o += s.part(Pa('M92 184C88 160 96 146 118 142C140 138 164 142 180 156C190 166 190 178 188 184Z'), Rk, { tex: 'full' }) + s.line('M110 160q8-4 14 0m24 8q6-4 12 2', dark(Rk, 0.3), 1.6);
  o += s.g('fx-leg-ff', 106, 118, s.limb('M108 116L128 142', 9, dark(B, 0.14)) + s.part(E(130, 144, 6, 4.4, 30), '#4A3A30', { tex: 'none' }));
  o += s.g('fx-leg-fn', 112, 118, s.limb('M114 114L138 140', 9, B) + s.part(E(141, 142, 6, 4.4, 30), '#4A3A30', { tex: 'none' }));
  o += s.g('fx-neck', 112, 106, s.part(E(116, 90, 11, 21, 12), B) + s.g('fx-head', 128, 64, goatHead(s, 128, 66, B, Pt, Cr, Hn)));
  return s.svg(o);
};
