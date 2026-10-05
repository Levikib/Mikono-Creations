/* Living lab shared runtime. Sprites come from public/fx/cast (existing 12). */
const SP = window.__SPRITES; let __u = 0;
function sprite(name, o = {}) {
  const { size = 96, flip = false, cls = '', anim = 'idle', style = {} } = o;
  const u = 'u' + (__u++) + '-';
  const s = SP[name].replace(/id="([^"]+)"/g, `id="${u}$1"`).replace(/href="#([^"]+)"/g, `href="#${u}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${u}$1)`);
  const el = document.createElement('span');
  el.className = 'fx-char ' + cls; el.dataset.anim = anim; el.dataset.name = name;
  if (flip) el.dataset.flip = 'true';
  el.style.setProperty('--fx-s', size + 'px');
  el.style.setProperty('--fx-d', (Math.random() * 3).toFixed(2) + 's');
  el.style.setProperty('--fx-b', (4 + Math.random() * 2).toFixed(2) + 's');
  for (const k in style) el.style.setProperty(k, style[k]);
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = s; return el;
}
function mountToggle(host) {
  let on = true; try { on = localStorage.getItem('mk-animals') !== 'off'; } catch (e) {}
  const b = document.createElement('button'); b.className = 'fx-toggle'; b.type = 'button';
  const set = (v) => { on = v; b.setAttribute('aria-pressed', v); b.innerHTML = `Animals: ${v ? 'on' : 'off'} <i></i>`; document.documentElement.dataset.fx = v ? 'full' : 'off'; try { localStorage.setItem('mk-animals', v ? 'on' : 'off'); } catch (e) {} };
  b.onclick = () => set(!on); set(on); host.appendChild(b); return b;
}
const lerp = (a, b, t) => a + (b - a) * t;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);
