/* Thread prototype. Real build: fill via CSS animation-timeline: scroll(root) (linear in scrollY, see doc),
   JS only for ball rotation, knot state and animal pops. This lab uses JS for all of it so it also works without scroll-driven CSS. */
function Thread(o) {
  const NS = 'http://www.w3.org/2000/svg';
  const maxW = o.maxW || 1200;
  const host = document.createElement('div'); host.className = 'thread'; host.setAttribute('aria-hidden', 'true'); document.body.prepend(host);
  const mk = (t, a = {}, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const svg = mk('svg', {}, host);
  const defs = mk('defs'); const grad = mk('linearGradient', { id: 'tg', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0 }, defs);
  const base = mk('path', { class: 't-base' }); const fill = mk('path', { class: 't-fill' }); const ply = mk('path', { class: 't-ply' });
  const g = mk('g'); const ballEl = document.createElement('div'); ballEl.className = 'ball';
  ballEl.innerHTML = `<svg viewBox="0 0 40 40"><defs><radialGradient id="bg" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#d98a6c"/><stop offset=".6" stop-color="#b0654a"/><stop offset="1" stop-color="#8a4630"/></radialGradient></defs><g class="roll"><circle cx="20" cy="20" r="18" fill="url(#bg)"/><g fill="none" stroke="#f3d3bd" stroke-width="1.5" stroke-linecap="round" opacity=".75"><path d="M5 17c10 6 20 6 30 -2"/><path d="M6 27c9 -5 19 -5 28 2"/><path d="M14 4c-6 10 -5 22 4 33"/><path d="M27 4c5 9 4 21 -3 33"/></g></g></svg><span class="shadow"></span>`;
  host.appendChild(ballEl);
  let S = null, H = 0, lastSy = scrollY, lastT = performance.now(), v = 0, raf = 0;
  const knots = o.knots.map(k => ({ ...k, on: false }));
  function layout() {
    H = Math.max(document.documentElement.scrollHeight, innerHeight); host.style.height = H + 'px';
    svg.setAttribute('width', innerWidth); svg.setAttribute('height', H);
    const vw = innerWidth, gut = (vw - maxW) / 2, wide = gut >= 80;
    const xL = wide ? Math.max(30, gut * .30) : 7, xR = wide ? Math.min(gut - 40, gut * .62) : 7;
    document.documentElement.style.setProperty('--bs', wide ? '38px' : '24px');
    g.innerHTML = '';
    const start = { y: o.startY ?? 70 };
    const pts = [{ x: xL, y: start.y }];
    knots.forEach((k, i) => { const r = k.el.getBoundingClientRect(); k.y = r.top + scrollY - (k.lift ?? 10); k.x = wide ? (i % 2 ? xL : xR) : 7; pts.push({ x: k.x, y: k.y }); });
    const endY = o.endEl ? o.endEl.getBoundingClientRect().top + scrollY + (o.endDy ?? 0) : H - 40;
    pts.push({ x: wide ? xR : 7, y: endY });
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], m = (a.y + b.y) / 2; d += wide ? ` C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}` : ` L${b.x} ${b.y}`; }
    [base, fill, ply].forEach(p => p.setAttribute('d', d));
    const L = base.getTotalLength(); S = { L, pts: [] };
    for (let i = 0; i <= 400; i++) { const p = base.getPointAtLength(L * i / 400); S.pts.push({ len: L * i / 400, x: p.x, y: p.y }); }
    [fill, ply].forEach(p => { p.style.strokeDasharray = p === fill ? `${L} ${L}` : ''; });
    // gradient: habitat colours along the page
    grad.innerHTML = ''; grad.setAttribute('y1', start.y); grad.setAttribute('y2', endY);
    const cols = o.colors || ['#C9A05A', '#B0654A', '#6A7049', '#587783'];
    const span = endY - start.y;
    const stopAt = (f, c) => { const s = mk('stop', { offset: Math.min(1, Math.max(0, f)), 'stop-color': c }, grad); };
    stopAt(0, cols[0]);
    knots.forEach((k, i) => stopAt((k.y - start.y) / span, k.color || cols[Math.min(i + 1, cols.length - 1)]));
    stopAt(1, cols[cols.length - 1]);
    // knots + branches
    knots.forEach((k, i) => {
      const left = wide ? gut + 24 : 16, right = vw - (wide ? gut + 24 : 16);
      const br = mk('path', { class: 't-branch', d: `M${k.x} ${k.y} L${wide ? k.x + 18 : k.x} ${k.y} L${right} ${k.y}` }, g);
      const bf = mk('path', { class: 't-branch-fill', d: br.getAttribute('d'), stroke: k.color || cols[Math.min(i + 1, cols.length - 1)], pathLength: 1 }, g);
      bf.style.strokeDasharray = '1 1'; bf.style.strokeDashoffset = 1;
      k.brEl = bf; k.kn = mk('circle', { class: 't-knot', cx: k.x, cy: k.y, r: wide ? 8 : 6 }, g);
      k.on = false; k.right = right; k.left = left;
      if (k.pop) { if (k.popEl) k.popEl.remove(); const size = k.pop.size ?? 72; const pe = sprite(k.pop.name, { size, flip: k.pop.flip, anim: 'idle' }); const w = document.createElement('div'); w.className = 'mk-pop lab-fx'; w.style.cssText = `left:${(k.pop.at === 'left' ? left + 6 : right - size - (k.pop.dx ?? 6))}px;top:${k.y - size * .915 + 1}px;width:${size}px;height:${size}px`; w.appendChild(pe); if (k.pop.walk) { w.classList.add('walk'); const dist = (k.right - size - 8) - (k.left + 6); w.style.setProperty('--wd', dist + 'px'); w.style.left = (k.left + 6) + 'px'; } host.appendChild(w); k.popEl = w; }
    });
    update(true);
  }
  function lenAtY(y) { const a = S.pts; if (y <= a[0].y) return 0; if (y >= a[a.length - 1].y) return S.L; let lo = 0, hi = a.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; (a[m].y < y ? (lo = m) : (hi = m)); } const t = (y - a[lo].y) / (a[hi].y - a[lo].y || 1); return lerp(a[lo].len, a[hi].len, t); }
  function pointAt(len) { const a = S.pts; const f = len / S.L * 400; const i = Math.min(399, Math.floor(f)); const t = f - i; return { x: lerp(a[i].x, a[i + 1].x, t), y: lerp(a[i].y, a[i + 1].y, t) }; }
  function update(force) {
    if (!S) return; const sy = scrollY, vh = innerHeight, max = Math.max(1, H - vh), p = Math.min(1, Math.max(0, sy / max));
    const headY = sy + vh * (.3 + .7 * p); const len = lenAtY(headY);
    fill.style.strokeDashoffset = S.L - len; ply.style.strokeDasharray = '1.2 5.6'; // ply is clipped by the same length via mask below
    plyMask(len);
    const pt = pointAt(len); const now = performance.now(), dt = Math.max(16, now - lastT);
    v = lerp(v, (sy - lastSy) / dt * 1000, .25); lastSy = sy; lastT = now;
    const sq = reduced ? 0 : Math.min(Math.abs(v) / 5000, .16);
    ballEl.style.transform = `translate(${pt.x}px,${pt.y}px) scale(${1 + sq},${1 - sq * .8}) rotate(${Math.max(-8, Math.min(8, v / 260))}deg)`;
    ballEl.querySelector('.roll').style.transform = `rotate(${len * 2.2}deg)`;
    knots.forEach(k => { if (!k.on && headY >= k.y) { k.on = true; k.kn.classList.add('on'); k.kn.style.fill = k.color || '#B0654A'; k.brEl.style.strokeDashoffset = 0; if (k.popEl) setTimeout(() => k.popEl.classList.add('in'), 450); k.onReach && k.onReach(k); } else if (k.on && headY < k.y - 60) { /* keep lit once reached: thread remembers */ } });
    if (!force && Math.abs(v) < 5) { clearTimeout(idleT); idleT = setTimeout(() => ballEl.style.transform += '', 100); }
  }
  let idleT;
  // ply highlight clipped to filled length: dasharray trick with a mask
  const maskId = 'pm'; const mask = mk('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: -50, y: 0, width: 4000, height: 99999 }, defs); const mp = mk('path', { stroke: '#fff', fill: 'none', 'stroke-width': 12 }, mask);
  ply.setAttribute('mask', `url(#${maskId})`);
  function plyMask(len) { mp.setAttribute('d', base.getAttribute('d')); mp.style.strokeDasharray = `${S.L} ${S.L}`; mp.style.strokeDashoffset = S.L - len; }
  function onScroll() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { knots.forEach(k => k.on = false); layout(); });
  document.fonts && document.fonts.ready.then(layout);
  setTimeout(layout, 50); setTimeout(layout, 600); layout();
  return { layout, update, knots };
}
