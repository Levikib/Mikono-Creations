import { Sprite, E, R, Pa, C, dark, lite, f, lobes } from '../lib.mjs';
export const sprites = {};

// ---------------------------------------------------------------- flamingo
function flamingo(k, pose) {
  const s = new Sprite(k); const P = '#E6A599', Pd = '#D48C82', Dk = '#5B4638', Cr = '#F1E2C6';
  const one = pose === 'one';
  let o = '';
  const legs = one
    ? s.g('fx-leg-b', 108, 124, s.limb('M108 124L124 142L104 148', 4.5, Pd) + s.part(E(101, 149, 6, 3, -10), Pd, { tex: 'none' })) +
      s.g('fx-leg-a', 98, 124, s.limb('M98 124L99 156L96 182', 4.5, P) + s.part(E(96, 184, 10, 3.6), P, { tex: 'none' }))
    : s.g('fx-leg-b', 110, 124, s.limb('M110 124L112 154L120 182', 4.5, Pd) + s.part(E(122, 184, 10, 3.6), Pd, { tex: 'none' })) +
      s.g('fx-leg-a', 96, 124, s.limb('M96 124L98 156L92 182', 4.5, P) + s.part(E(90, 184, 10, 3.6), P, { tex: 'none' }));
  o += legs;
  const body = s.part(Pa('M46 110C58 84 96 74 118 86C134 96 126 122 104 126C84 130 60 126 46 110Z'), P, { tex: 'full' }) +
    s.part(E(84, 102, 30, 17, -8), lite(P, 0.2), { tex: 'pat' }) + s.part(Pa('M52 112C48 104 56 100 66 100L82 112C70 118 58 118 52 112Z'), Dk, { tex: 'pat' }) +
    s.line('M70 96q10 6 20 4m-12 8q10 4 20 0', Pd, 1.4);
  o += s.g('fx-body', 86, 112, body);
  const nd = one ? 'M118 90C146 86 150 58 126 52C106 48 100 30 114 22' : 'M118 90C144 82 146 58 128 50C110 42 112 26 130 25';
  const hx = one ? 114 : 131, hy = one ? 22 : 25, d = one ? -1 : 1;
  const head = s.part(C(hx, hy, 9), P, { tex: 'pat' }) +
    s.part(Pa(`M${hx + 5 * d} ${hy - 6}C${hx + 22 * d} ${hy - 8} ${hx + 32 * d} ${hy + 2} ${hx + 29 * d} ${hy + 18}C${hx + 22 * d} ${hy + 9} ${hx + 13 * d} ${hy + 8} ${hx + 5 * d} ${hy + 8}Z`), Cr, { tex: 'pat' }) +
    s.plain(Pa(`M${hx + 22 * d} ${hy - 4}C${hx + 29 * d} ${hy} ${hx + 32 * d} ${hy + 8} ${hx + 29 * d} ${hy + 18}C${hx + 26 * d} ${hy + 12} ${hx + 23 * d} ${hy + 8} ${hx + 19 * d} ${hy + 6}Z`), Dk) +
    s.g('fx-eyes', hx, hy, s.eye(hx + 1.5 * d, hy - 1, 3.2, true)) + s.blush(hx - 2 * d, hy + 5, 3.4, 2.4);
  o += s.g('fx-neck', 118, 92, s.limb(nd, 11, P) + s.g('fx-head', hx, hy, head));
  return s.svg(o);
}
sprites['flamingo-stand'] = () => flamingo('fa', 'stand');
sprites['flamingo-one-leg'] = () => flamingo('fb', 'one');

// ---------------------------------------------------------------- ostrich
function ostrichHead(s, hx, hy, K, bk) {
  return s.part(E(hx, hy, 15, 11), K) + s.part(E(hx + 14, hy + 2, 8, 4.4), bk) +
    s.line(`M${hx - 3} ${hy - 11}l-2-7m6 7l1-8m5 9l4-6`, dark(K, 0.4), 1.6) +
    s.g('fx-eyes', hx - 1, hy - 3, s.eye(hx, hy - 3, 4.8, true) + s.line(`M${hx - 4} ${hy - 9}l-2-3m5 2l0-4m4 4l3-3`, '#231a16', 1.3)) + s.blush(hx - 4, hy + 4, 4, 2.6);
}
sprites['ostrich-stand'] = () => {
  const s = new Sprite('os'); const Bk = '#4D423B', Cr = '#F1E6D0', K = '#DDBFAE', Bk2 = '#E8C3B0';
  let o = '';
  o += s.g('fx-leg-b', 112, 140, s.limb('M112 140L118 182', 12, dark(K, 0.1)) + s.part(E(124, 184, 13, 4.6), dark(K, 0.1), { tex: 'none' }));
  o += s.g('fx-leg-a', 94, 140, s.limb('M94 140L92 182', 12, K) + s.part(E(98, 184, 13, 4.6), K, { tex: 'none' }));
  o += s.g('fx-tail', 54, 108, s.part(Pa(lobes(50, 102, 16, 20, 7, 1.25)), Cr));
  o += s.g('fx-body', 92, 120, s.part(Pa(lobes(94, 112, 40, 32, 10, 1.14)), Bk, { tex: 'full' }) + s.g('fx-wing', 86, 100, s.part(Pa(lobes(88, 114, 26, 18, 8, 1.2, 0.2)), Cr)));
  o += s.g('fx-neck', 124, 96, s.limb('M122 98C136 82 126 62 134 46', 13, K) + s.part(E(124, 100, 12, 8, -20), Cr, { tex: 'pat' }) + s.g('fx-head', 136, 38, ostrichHead(s, 138, 36, K, Bk2)));
  return s.svg(o);
};
sprites['ostrich-peek'] = () => {
  const s = new Sprite('op'); const Bk = '#4D423B', Cr = '#F1E6D0', K = '#DDBFAE', Bk2 = '#E8C3B0';
  let o = '';
  o += s.g('fx-neck', 100, 180, s.limb('M102 200C112 150 90 124 104 84', 18, K) + s.g('fx-head', 112, 70, ostrichHead(s, 114, 68, K, Bk2).replace(/ry="11"/, 'ry="11"')));
  o += s.g('fx-body', 100, 190, s.part(Pa(lobes(100, 208, 64, 40, 11, 1.14)), Bk, { tex: 'full' }) + s.part(Pa(lobes(84, 206, 28, 20, 8, 1.2)), Cr));
  return s.svg(o);
};

// ---------------------------------------------------------------- secretary bird
function secHead(s, hx, hy) {
  const G = '#D8D4C8', Dk = '#3F3A38';
  const quill = [[-18, -4], [-20, -14], [-14, -22], [-6, -26]];
  return quill.map(([dx, dy]) => s.line(`M${hx - 6} ${hy - 4}L${hx + dx} ${hy + dy}`, '#6B6660', 3) + s.plain(C(hx + dx, hy + dy, 2.6), Dk)).join('') +
    s.part(C(hx, hy, 13), G) + s.part(E(hx + 6, hy + 3, 9, 8), '#CB7C52') +
    s.part(Pa(`M${hx + 12} ${hy - 1}q10 0 11 9q-6-3-11-3Z`), '#7B746C', { tex: 'pat' }) +
    s.g('fx-eyes', hx + 2, hy - 3, s.eye(hx + 3, hy - 2, 3.6, true) + s.line(`M${hx} ${hy - 7}l-2-3m4 2l0-4m4 4l2-3`, '#231a16', 1.2)) + s.blush(hx - 2, hy + 5, 3.4, 2.4);
}
function secretary(k, wings) {
  const s = new Sprite(k); const G = '#CBC8BD', Gd = '#9A978E', Dk = '#3F3A38', L = '#E1BC9E';
  let o = '';
  o += s.g('fx-tail', 70, 92, s.part(Pa('M72 88C54 96 38 116 22 150L30 154C46 130 60 114 80 104Z'), G, { tex: 'pat' }) + s.plain(Pa('M22 150L30 154L34 142Z'), Dk) +
    s.part(Pa('M76 94C62 106 54 124 44 152L52 154C60 134 70 118 84 108Z'), dark(G, 0.1), { tex: 'pat' }) + s.plain(Pa('M44 152L52 154L54 142Z'), Dk));
  o += s.g('fx-leg-b', 110, 122, s.limb('M110 122L113 152L119 180', 6.5, dark(L, 0.1)) + s.part(E(122, 183, 9, 3.4), Dk, { tex: 'none' }));
  o += s.g('fx-leg-a', 96, 122, s.limb('M96 122L99 152L94 180', 6.5, L) + s.part(E(94, 183, 9, 3.4), Dk, { tex: 'none' }));
  if (wings) o += s.g('fx-wing fx-wing-b', 90, 80, s.part(Pa('M92 80C76 56 54 40 30 42C38 52 40 58 34 64C44 66 48 72 44 78C56 80 74 86 90 98Z'), Gd, { tex: 'pat' }) + s.plain(E(40, 48, 5, 12, 40), Dk) + s.plain(E(34, 58, 5, 12, 62), Dk));
  o += s.g('fx-body', 96, 110, s.part(E(96, 94, 28, 27, -14), G, { tex: 'full' }) +
    (wings ? '' : s.part(E(88, 98, 21, 22, -10), Gd) + s.plain(E(76, 116, 9, 15, 24), Dk)) +
    s.part(Pa('M82 116C80 140 86 146 98 146C112 146 116 134 112 116C104 108 90 108 82 116Z'), Dk, { tex: 'pat' }));
  if (wings) o += s.g('fx-wing fx-wing-a', 100, 90, s.part(Pa('M100 92C86 68 62 50 36 52C46 62 48 68 42 76C54 76 58 84 52 90C66 92 84 98 100 108Z'), lite(G, 0.05), { tex: 'full' }) + s.plain(E(34, 56, 5, 13, 40), Dk) + s.plain(E(31, 66, 5, 13, 62), Dk) + s.plain(E(37, 76, 5, 12, 78), Dk) + s.plain(E(48, 84, 5, 10, 88), Dk) + s.line('M90 90C74 74 62 66 52 64', Gd, 1.6));
  o += s.g('fx-neck', 112, 80, s.limb('M110 78C120 68 116 56 120 46', 12, '#DAD7CC') + s.g('fx-head', 124, 42, secHead(s, 124, 40)));
  return s.svg(o);
}
sprites['secretary-bird-stand'] = () => secretary('sb', false);
sprites['secretary-bird-wings'] = () => secretary('sw', true);

// ---------------------------------------------------------------- hornbill
function hornHead(s, hx, hy, open) {
  const Bi = '#BC5E44', Cr = '#EBD7A8';
  return s.part(C(hx, hy, 15), '#F1E8D4') +
    s.part(Pa(`M${hx + 8} ${hy - 12}C${hx + 30} ${hy - 20} ${hx + 52} ${hy - 8} ${hx + 58} ${hy + 16}C${hx + 44} ${hy + 6} ${hx + 28} ${hy + 2} ${hx + 8} ${hy + 2}Z`), Bi) +
    s.part(Pa(`M${hx + 10} ${hy + 4}C${hx + 26} ${hy + 5} ${hx + 42} ${hy + 10} ${hx + 52} ${hy + 22}C${hx + 38} ${hy + 18} ${hx + 24} ${hy + 14} ${hx + 10} ${hy + 14}Z`), Cr, { tex: 'pat' }) +
    s.line(`M${hx + 14} ${hy - 12}C${hx + 24} ${hy - 20} ${hx + 36} ${hy - 20} ${hx + 44} ${hy - 12}`, dark(Bi, 0.3), 1.6) +
    s.g('fx-eyes', hx + 2, hy - 4, s.eye(hx + 3, hy - 3, 4, true) + s.line(`M${hx - 2} ${hy - 9}l-3-3m5 2l-1-4m5 4l2-4`, '#231a16', 1.3)) + s.blush(hx - 6, hy + 6, 4.4, 3);
}
sprites['hornbill-perch'] = () => {
  const s = new Sprite('hp'); const Dk = '#4B403A', Cr = '#F1E8D4', Br = '#8A6A4A';
  let o = s.limb('M10 166L192 160', 11, Br) + s.part(E(30, 154, 16, 6, -16), '#849D57') + s.part(E(176, 152, 12, 5, 14), '#849D57');
  o += s.g('fx-tail', 80, 140, s.part(Pa('M76 128L52 176L68 182L96 142Z'), Dk) + s.plain(Pa('M52 176L68 182L66 170Z'), Cr));
  o += s.limb('M96 148L96 160', 4, '#B5836A') + s.limb('M112 148L112 160', 4, '#B5836A');
  o += s.g('fx-body', 100, 120, s.part(E(100, 112, 27, 40, -10), Dk, { tex: 'full' }) + s.part(E(108, 124, 17, 26, -10), Cr, { tex: 'pat' }) +
    s.g('fx-wing', 90, 96, s.part(E(86, 114, 16, 30, -12), lite(Dk, 0.12)) + s.plain(E(84, 122, 7, 12, -12), Cr)));
  o += s.g('fx-neck', 114, 90, s.g('fx-head', 122, 72, hornHead(s, 122, 70)));
  return s.svg(o);
};
sprites['hornbill-fly'] = () => {
  const s = new Sprite('hf'); const Dk = '#4B403A', Cr = '#F1E8D4';
  let o = '';
  o += s.g('fx-wing fx-wing-b', 98, 104, s.part(Pa('M98 104C84 70 64 44 38 36C40 62 54 92 78 112Z'), lite(Dk, 0.08)) + s.plain(E(62, 70, 7, 12, 34), Cr, 'opacity=".8"'));
  o += s.g('fx-tail', 72, 118, s.part(Pa('M76 112L24 120L26 136L82 128Z'), Dk) + s.plain(Pa('M24 120L26 136L40 130Z'), Cr));
  o += s.g('fx-body', 98, 118, s.part(E(98, 118, 32, 22, -4), Dk, { tex: 'full' }) + s.part(E(104, 128, 22, 11, -4), Cr, { tex: 'pat' }));
  o += s.g('fx-wing fx-wing-a', 104, 106, s.part(Pa('M104 106C118 66 146 44 176 40C174 70 154 100 126 114Z'), Dk) + s.plain(E(146, 70, 8, 14, 38), Cr) + s.line('M120 96q18-24 40-40', lite(Dk, 0.3), 1.6));
  o += s.g('fx-head', 130, 112, hornHead(s, 134, 110).replace(/<g class="fx-eyes"/, '<g class="fx-eyes"'));
  return s.svg(o);
};

// ---------------------------------------------------------------- chick
sprites['chick-stand'] = () => {
  const s = new Sprite('ck'); const Y = '#EBCB74', Yd = '#D6AE52', Or = '#DC8F4E';
  let o = '<ellipse cx="100" cy="184" rx="44" ry="4" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-leg-b', 112, 160, s.limb('M112 160L112 180', 4.5, Or) + s.limb('M104 183L120 183', 4.5, Or));
  o += s.g('fx-leg-a', 88, 160, s.limb('M88 160L88 180', 4.5, Or) + s.limb('M80 183L96 183', 4.5, Or));
  o += s.g('fx-tail', 62, 140, s.part(Pa('M62 134L40 124L48 144L62 152Z'), Yd));
  o += s.g('fx-body', 100, 130, s.part(E(100, 122, 46, 44), Y, { tex: 'full' }) + s.part(E(98, 142, 28, 14), lite(Y, 0.35), { tex: 'pat' }) +
    s.g('fx-wing', 78, 128, s.part(E(78, 130, 12, 20, 18), Yd)));
  o += s.g('fx-head', 120, 100, s.line('M106 80C104 66 110 58 116 68C118 58 126 56 126 72', dark(Y, 0.4), 3) +
    s.part(Pa('M140 108L158 114L140 122Z'), Or, { tex: 'pat' }) + s.line('M142 115h12', dark(Or, 0.3), 1.2) +
    s.g('fx-eyes', 124, 102, s.eye(124, 102, 4.8)) + s.blush(118, 118, 6, 4) + s.blush(138, 120, 0.1, 0.1));
  return s.svg(o);
};
sprites['chick-hatch'] = () => {
  const s = new Sprite('ch'); const Y = '#EBCB74', Yd = '#D6AE52', Or = '#DC8F4E', Cr = '#F2E8D4';
  let o = '<ellipse cx="100" cy="188" rx="58" ry="4" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-body', 100, 120, s.part(C(100, 114, 38), Y, { tex: 'full' }) +
    s.g('fx-wing fx-wing-l', 66, 120, s.part(E(60, 112, 9, 17, 30), Yd)) + s.g('fx-wing fx-wing-r', 134, 120, s.part(E(140, 112, 9, 17, -30), Yd)));
  o += s.g('fx-head', 100, 110, s.part(Pa('M100 108L116 114L100 122Z'), Or, { tex: 'pat' }) + s.line('M101 115h10', dark(Or, 0.3), 1.2) +
    s.g('fx-eyes', 100, 100, s.eye(88, 100, 4.6) + s.eye(112, 98, 4.6)) + s.blush(80, 112, 5, 3.4) + s.blush(122, 110, 5, 3.4) +
    s.part(Pa('M66 90L76 80L86 92L98 76L110 92L122 80L132 90C132 56 66 56 66 90Z'), Cr, { tex: 'pat' }));
  o += s.part(Pa('M40 144L52 126L66 144L78 124L90 146L102 126L114 146L126 124L138 144L150 126L162 144C162 176 134 192 100 192C66 192 40 176 40 144Z'), Cr, { tex: 'full' }) +
    s.line('M64 160l8 6-6 8m58-20l-8 8 8 6', dark(Cr, 0.3), 1.4);
  return s.svg(o);
};
