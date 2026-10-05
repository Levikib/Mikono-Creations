import { Sprite, E, R, Pa, C, dark, lite, f } from '../lib.mjs';
export const sprites = {};

// ---------------------------------------------------------------- cheetah
function cheetahHead(s, Y, D, Cr, hx, hy, sleepy = false) {
  return s.part(E(hx - 11, hy - 14, 6.5, 7), dark(Y, 0.1)) + s.plain(C(hx - 11, hy - 13, 3), D) +
    s.part(C(hx, hy, 17), Y) + s.part(E(hx + 12, hy + 7, 10, 7.5), Cr) +
    s.part(C(hx + 7, hy - 16, 6.5), Y) + s.plain(C(hx + 7, hy - 15, 3), D) +
    s.plain(E(hx + 19, hy + 3, 3.2, 2.4), D) +
    s.line(`M${hx + 19} ${hy + 5}q0 4-3 5m3-5q1 4 4 4`, D, 1.3) +
    s.line(`M${hx + 5} ${hy + 3}q4 3 4 11`, D, 3) +
    s.g('fx-eyes', hx + 4, hy - 2, s.eye(hx + 4, hy - 2, 3.8)) + s.blush(hx - 2, hy + 8, 5, 3.2);
}
sprites['cheetah-stand'] = () => {
  const s = new Sprite('ch'); const Y = '#DDB46E', D = '#5A3D2A', Cr = '#F4E6C8';
  const spots = [[56, 118], [66, 108], [78, 112], [90, 106], [102, 110], [112, 118], [60, 134], [72, 126], [86, 124], [98, 128], [108, 134], [48, 126], [120, 100], [128, 92], [70, 140], [92, 138]];
  let o = '';
  o += s.g('fx-tail', 50, 118, s.limb('M48 120C26 114 18 92 30 76', 8, Y) + `<path d="M48 120C26 114 18 92 30 76" fill="none" stroke="${D}" stroke-width="8" stroke-dasharray="3 6" stroke-linecap="butt"/>` + s.part(C(30, 76, 5.5), Cr));
  o += s.leg('fx-leg-bf', 63, 134, 11, 48, dark(Y, 0.14), D) + s.leg('fx-leg-ff', 106, 134, 11, 48, dark(Y, 0.14), D);
  o += s.g('fx-body', 88, 140, s.part(E(88, 124, 44, 21), Y) + s.part(E(90, 140, 28, 7), Cr, { tex: 'pat' }) + s.part(E(64, 128, 17, 19), lite(Y, 0.06), { tex: 'pat' }) + s.dots(spots, 2.3, D));
  o += s.leg('fx-leg-bn', 48, 136, 11, 46, Y, D) + s.leg('fx-leg-fn', 118, 136, 11, 46, Y, D);
  o += s.g('fx-neck', 118, 124, s.part(E(126, 102, 12, 23, 32), Y) + s.dots([[122, 108], [130, 98]], 2.2, D) + s.g('fx-head', 140, 100, cheetahHead(s, Y, D, Cr, 142, 88)));
  return s.svg(o);
};
sprites['cheetah-sprint'] = () => {
  const s = new Sprite('cs'); const Y = '#DDB46E', D = '#5A3D2A', Cr = '#F4E6C8';
  const spots = [[60, 112], [72, 106], [86, 104], [100, 106], [112, 112], [66, 124], [80, 122], [96, 120], [108, 124]];
  const paw = (x, y, c) => s.part(E(x, y, 8, 6, 20), c);
  let o = '<ellipse cx="96" cy="182" rx="46" ry="4" fill="#2a1608" opacity=".1" stroke="none"/>';
  o += s.g('fx-tail', 54, 112, s.limb('M54 114C34 100 20 108 8 92', 8, Y) + `<path d="M54 114C34 100 20 108 8 92" fill="none" stroke="${D}" stroke-width="8" stroke-dasharray="3 6" stroke-linecap="butt"/>` + s.part(C(8, 92, 5.5), Cr));
  o += s.g('fx-leg-bf', 78, 124, s.limb('M78 124L52 148', 11, dark(Y, 0.14)) + paw(46, 152, dark(Y, 0.2)));
  o += s.g('fx-leg-ff', 112, 124, s.limb('M112 124L142 144', 11, dark(Y, 0.14)) + paw(147, 148, dark(Y, 0.2)));
  o += s.g('fx-body', 90, 116, s.part(E(90, 116, 46, 19, -4), Y) + s.part(E(92, 128, 30, 6, -4), Cr, { tex: 'pat' }) + s.dots(spots, 2.3, D));
  o += s.g('fx-leg-bn', 66, 122, s.limb('M66 122L34 140', 12, Y) + paw(28, 144, Y));
  o += s.g('fx-leg-fn', 120, 120, s.limb('M120 120L156 130', 12, Y) + paw(162, 133, Y));
  o += s.g('fx-neck', 124, 112, s.limb('M122 112L140 102', 22, Y) + s.g('fx-head', 150, 98, cheetahHead(s, Y, D, Cr, 152, 96)));
  return s.svg(o);
};

// ---------------------------------------------------------------- leopard
function leopardHead(s, Y, D, Cr, hx, hy) {
  return s.part(C(hx - 11, hy - 17, 7.5), Y) + s.plain(C(hx - 11, hy - 16, 3.6), D) +
    s.part(C(hx + 11, hy - 17, 7.5), Y) + s.plain(C(hx + 11, hy - 16, 3.6), D) +
    s.part(C(hx, hy, 21), Y) + s.part(E(hx + 11, hy + 8, 12, 9), Cr) +
    s.plain(E(hx + 21, hy + 4, 3.6, 2.7), D) + s.line(`M${hx + 21} ${hy + 6}q0 4-3 6m3-6q2 4 5 4`, D, 1.3) +
    s.line(`M${hx + 14} ${hy + 8}l12-2m-12 4l12 2`, lite(D, 0.4), 1) +
    s.dots([[hx - 4, hy - 10], [hx + 6, hy - 12], [hx - 12, hy], [hx - 8, hy + 8], [hx - 14, hy + 10]], 1.8, D) +
    s.g('fx-eyes', hx + 6, hy - 3, s.eye(hx + 7, hy - 3, 4.2)) + s.blush(hx - 2, hy + 9, 5.5, 3.4);
}
const rosettes = (s, pts, D) => s.dots(pts, 4, D, true) + s.dots(pts.map(([x, y]) => [x + 1, y + 1, 1.2]), 1.2, D);
sprites['leopard-stand'] = () => {
  const s = new Sprite('le'); const Y = '#D6A45E', D = '#5A3D2A', Cr = '#F2E4C6';
  let o = '';
  o += s.g('fx-tail', 50, 128, s.limb('M48 130C24 128 16 104 30 92', 11, Y) + s.part(E(30, 90, 8, 6, -30), dark(Y, 0.3)));
  o += s.leg('fx-leg-bf', 62, 140, 16, 42, dark(Y, 0.14), D) + s.leg('fx-leg-ff', 108, 140, 16, 42, dark(Y, 0.14), D);
  o += s.g('fx-body', 90, 140, s.part(E(88, 130, 48, 26), Y) + s.part(E(90, 148, 30, 8), Cr, { tex: 'pat' }) + s.part(E(62, 136, 18, 20), lite(Y, 0.05), { tex: 'pat' }) +
    rosettes(s, [[58, 122], [74, 114], [92, 112], [108, 118], [66, 138], [84, 130], [100, 134], [120, 122], [48, 134]], D));
  o += s.leg('fx-leg-bn', 46, 142, 16, 40, Y, D) + s.leg('fx-leg-fn', 120, 142, 16, 40, Y, D);
  o += s.g('fx-neck', 120, 128, s.part(E(128, 112, 18, 24, 28), Y) + s.g('fx-head', 142, 104, leopardHead(s, Y, D, Cr, 144, 98)));
  return s.svg(o);
};
sprites['leopard-branch'] = () => {
  const s = new Sprite('lb'); const Y = '#D6A45E', D = '#5A3D2A', Cr = '#F2E4C6', Br = '#8A6A4A';
  let o = s.limb('M2 138L198 130', 18, Br) + s.line('M20 134l8-1M60 135l9-1M120 133l9-1M170 131l8-1', dark(Br, 0.35), 1.6);
  o += s.part(E(14, 122, 18, 8, -20), '#849D57', { tex: 'pat' }) + s.part(E(184, 120, 14, 7, 18), '#849D57', { tex: 'pat' });
  o += s.g('fx-tail', 50, 120, s.limb('M52 120C32 124 26 150 38 170', 10, Y) + s.part(E(39, 172, 8, 6, 30), dark(Y, 0.3)));
  o += s.g('fx-leg-bn', 66, 124, s.limb('M66 122L62 156', 15, Y) + s.part(E(61, 160, 10, 7), Y));
  o += s.g('fx-body', 98, 118, s.part(E(98, 114, 52, 19), Y) + s.part(E(98, 128, 34, 5), Cr, { tex: 'pat' }) + rosettes(s, [[66, 108], [84, 104], [104, 106], [122, 110], [78, 118], [98, 118], [114, 120]], D));
  o += s.g('fx-leg-fn', 130, 124, s.limb('M132 122L138 156', 15, Y) + s.part(E(139, 160, 10, 7), Y));
  o += s.g('fx-neck', 134, 108, s.part(E(142, 100, 16, 20, 25), Y) + s.g('fx-head', 152, 90, leopardHead(s, Y, D, Cr, 154, 88)));
  return s.svg(o);
};

// ---------------------------------------------------------------- dog
function dogHead(s, T, Dk, Cr, hx, hy, tongue = true) {
  return s.part(C(hx, hy, 20), T) + s.part(E(hx + 13, hy + 8, 13, 10), Cr) +
    s.plain(E(hx + 24, hy + 4, 4.4, 3.4), '#2a1c16') + s.line(`M${hx + 22} ${hy + 8}q4 5 10 0`, '#5a3d2a', 1.4) +
    (tongue ? s.part(E(hx + 22, hy + 14, 4.6, 6.4, -10), '#E39A91', { tex: 'pat' }) : '') +
    s.plain(C(hx + 5, hy - 4, 8.5), Dk, 'opacity=".8"') +
    s.g('fx-eyes', hx + 5, hy - 4, s.eye(hx + 5, hy - 4, 3.9, false)) +
    s.g('fx-ear', hx - 12, hy - 12, s.part(E(hx - 14, hy + 4, 8, 15, 8), Dk)) + s.blush(hx - 1, hy + 9, 5, 3.3);
}
const collar = (s, d) => s.line(d, '#B0654A', 4.5);
sprites['dog-stand'] = () => {
  const s = new Sprite('dg'); const T = '#CB9C64', Dk = '#8A5A3C', Cr = '#F4E6CE';
  const sock = (x, y, w) => s.part(R(x - 0.3, y, w + 0.6, 12, 5), Cr, { tex: 'pat' });
  let o = '';
  o += s.g('fx-tail', 48, 118, s.limb('M48 120C30 112 28 92 42 84', 9, T) + s.part(C(43, 83, 5.5), Cr));
  o += s.leg('fx-leg-bf', 62, 138, 14, 44, dark(T, 0.14), null) + s.leg('fx-leg-ff', 108, 138, 14, 44, dark(T, 0.14), null);
  o += s.g('fx-body', 90, 140, s.part(E(90, 128, 46, 26), T) + s.part(E(118, 138, 15, 17), Cr, { tex: 'pat' }) + s.plain(E(76, 116, 20, 9, -6), Dk, 'opacity=".28"'));
  o += s.leg('fx-leg-bn', 46, 140, 14, 42, T, null) + s.leg('fx-leg-fn', 120, 140, 14, 42, T, null);
  o += sock(46, 170, 14) + sock(120, 170, 14);
  o += s.g('fx-neck', 120, 124, s.part(E(128, 112, 16, 20, 26), T) + collar(s, 'M118 112q14 10 26 2') + s.g('fx-head', 144, 106, dogHead(s, T, Dk, Cr, 146, 98)));
  return s.svg(o);
};
sprites['dog-sit'] = () => {
  const s = new Sprite('ds'); const T = '#CB9C64', Dk = '#8A5A3C', Cr = '#F4E6CE';
  let o = '';
  o += s.g('fx-tail', 64, 172, s.limb('M62 172C46 178 34 172 28 158', 9, T) + s.part(C(28, 157, 5.5), Cr));
  o += s.g('fx-body', 96, 150, s.part(E(100, 124, 28, 50, 14), T) + s.part(E(118, 132, 12, 28, 14), Cr, { tex: 'pat' }) + s.part(E(78, 154, 24, 26), dark(T, 0.04)));
  o += s.part(E(98, 178, 22, 6), Cr, { tex: 'pat' }) + s.part(E(76, 178, 14, 5), T, { tex: 'none' });
  o += s.g('fx-leg-fn', 118, 108, s.part(R(114, 118, 14, 62, 7), T) + s.part(R(113.6, 166, 14.8, 14, 6), Cr, { tex: 'pat' }));
  o += s.g('fx-neck', 114, 84, s.part(E(116, 82, 15, 20, 12), T) + collar(s, 'M104 82q12 12 26 4') + s.g('fx-head', 124, 62, dogHead(s, T, Dk, Cr, 122, 58)));
  return s.svg(o);
};

// ---------------------------------------------------------------- cat
function catHead(s, T, D, Cr, hx, hy, shut = false) {
  const ear = (x, dir) => s.part(Pa(`M${x - 8 * dir} ${hy - 8}L${x} ${hy - 26}L${x + 9 * dir} ${hy - 11}Z`), T) + s.plain(Pa(`M${x - 3 * dir} ${hy - 11}L${x} ${hy - 20}L${x + 4 * dir} ${hy - 12}Z`), '#D99C8E');
  return s.g('fx-ear', hx, hy - 14, ear(hx - 9, 1) + ear(hx + 11, 1)) + s.part(C(hx, hy, 18), T) + s.part(E(hx + 8, hy + 8, 10, 7.5), Cr) +
    s.plain(Pa(`M${hx + 14} ${hy + 3}h6l-3 3.4z`), '#C77E70') + s.line(`M${hx + 17} ${hy + 6.4}v2m0 0q-3 3-6 0m6 0q3 3 6 0`, '#6b4a36', 1.2) +
    s.line(`M${hx + 14} ${hy + 8}l14-3m-14 4l14 3`, lite(D, 0.55), 1) +
    s.line(`M${hx - 6} ${hy - 16}l1 7m6-8v8m6-7l-1 7`, D, 2.2) +
    (shut ? s.shut(hx + 6, hy - 1, 5) : s.g('fx-eyes', hx + 6, hy - 2, s.eye(hx + 6, hy - 2, 3.9))) + s.blush(hx - 2, hy + 9, 5, 3.2);
}
sprites['cat-walk'] = () => {
  const s = new Sprite('ca'); const T = '#CF9660', D = '#6B4128', Cr = '#F4E6CE';
  const stripes = 'M58 112q5 8 3 18m12-22q5 9 3 20m12-24q5 9 3 22m12-22q5 9 3 20m12-18q4 8 2 16';
  let o = '';
  o += s.g('fx-tail', 50, 122, s.limb('M48 124C26 120 22 92 36 80C40 76 46 80 42 86', 8.5, T) + `<path d="M48 124C26 120 22 92 36 80" fill="none" stroke="${D}" stroke-width="8.5" stroke-dasharray="3 6" stroke-linecap="butt"/>`);
  o += s.leg('fx-leg-bf', 64, 138, 11, 44, dark(T, 0.14), Cr) + s.leg('fx-leg-ff', 110, 138, 11, 44, dark(T, 0.14), Cr);
  o += s.g('fx-body', 90, 140, s.part(E(90, 126, 44, 22), T) + s.part(E(90, 142, 28, 7), Cr, { tex: 'pat' }) + s.line(stripes, D, 3));
  o += s.leg('fx-leg-bn', 50, 138, 12, 44, T, Cr) + s.leg('fx-leg-fn', 120, 138, 12, 44, T, Cr);
  o += s.g('fx-neck', 120, 124, s.part(E(126, 110, 13, 19, 22), T) + s.g('fx-head', 140, 96, catHead(s, T, D, Cr, 142, 94)));
  return s.svg(o);
};
sprites['cat-sleep'] = () => {
  const s = new Sprite('cz'); const T = '#CF9660', D = '#6B4128', Cr = '#F4E6CE';
  let o = '<ellipse cx="100" cy="184" rx="66" ry="5" fill="#2a1608" opacity=".12" stroke="none"/>';
  o += s.g('fx-body', 100, 150, s.part(E(98, 146, 62, 36), T) + s.part(E(92, 168, 38, 10), Cr, { tex: 'pat' }) + s.line('M52 134q6-8 14-10m6 2q4-10 14-12m10 8q4-10 14-10m10 12q4-10 14-8', D, 3));
  o += s.g('fx-tail', 52, 170, s.limb('M46 160C60 186 130 188 154 166', 12, T) + `<path d="M46 160C60 186 130 188 154 166" fill="none" stroke="${D}" stroke-width="12" stroke-dasharray="3 7" stroke-linecap="butt"/>`);
  o += s.g('fx-head', 130, 160, catHead(s, T, D, Cr, 132, 146, true));
  o += s.part(E(142, 170, 11, 6.5), Cr);
  return s.svg(o);
};
