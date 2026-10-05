// Mobile layout and device matrix gate.
// Usage: node scripts/mobile-qa/layout.mjs [baseUrl] [--pages all|quick] [--only /,/shop] [--devices 390x844,320x568] [--no-nav] [--tag name]
//   --only     restrict to these paths (dry runs); --devices restrict the device matrix; --no-nav skips the 1024 to 1440 nav pill pass.
//   --tag      suffix for report names and screenshot folder (layout-DATE-TAG.md, screens/mobile-layout-TAG/) so concurrent runs never collide.
// Safe to run in parallel with the other gates: no ports, no shared temp files, own report and screenshot names, own Chromium.
// Note: parallel runs do not matter for this gate (layout is not timing sensitive).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const SCRATCH = '/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules';
const require = createRequire(SCRATCH + '/');
const { chromium } = require('playwright-core');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const base = (args.find(a => /^https?:/.test(a)) || 'https://mikono-creations.vercel.app').replace(/\/$/, '');
const pi = args.indexOf('--pages');
const mode = pi >= 0 ? args[pi + 1] : 'all';
const date = new Date().toISOString().slice(0, 10);
const argOf = (n) => { const i = args.indexOf('--' + n); if (i >= 0) return args[i + 1]; const e = args.find(a => a.startsWith('--' + n + '=')); return e ? e.split('=')[1] : null; };
const TAG = argOf('tag') || process.env.MQA_TAG || ''; const TSFX = TAG ? '-' + TAG : '';
const ONLY = argOf('only') ? argOf('only').split(',') : null;
const ONLY_DEV = argOf('devices') ? argOf('devices').split(',') : null;
const NO_NAV = args.includes('--no-nav');
const SHOT_REL = 'strategy/gates/screens/mobile-layout' + TSFX;
const SHOTS = path.join(ROOT, SHOT_REL);
const OUT = path.join(ROOT, 'strategy/gates/mobile');
fs.mkdirSync(SHOTS, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });

const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const AND = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const D = (w, h, dpr, ua, mobile = true) => ({ name: `${w}x${h}`, viewport: { width: w, height: h }, deviceScaleFactor: dpr, userAgent: ua, isMobile: mobile, hasTouch: true });
const ALL_DEVICES = [D(320,568,2,IOS), D(360,640,3,AND), D(360,740,3,AND), D(375,667,2,IOS), D(390,844,3,IOS), D(412,915,2.625,AND), D(430,932,3,IOS), D(768,1024,2,IPAD), D(1024,768,2,IPAD), D(844,390,3,IOS), D(667,375,2,IOS)];
const DEVICES = ONLY_DEV ? ALL_DEVICES.filter(d => ONLY_DEV.includes(d.name)) : ALL_DEVICES;
const KEY_SHOT_DEVICES = ['320x568', '360x740', '390x844'];

async function routes() {
  const xml = await (await fetch(base + '/sitemap.xml')).text();
  let urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
  urls = [...new Set([...urls, '/cart', '/order', '/order/sent', '/custom'])];
  const products = urls.filter(u => /^\/shop\/[^/]+$/.test(u) && !/(safari-animals|domestic-animals|more-animals|wall-art|dolls)$/.test(u));
  const rest = urls.filter(u => !products.includes(u));
  if (ONLY) return ONLY;
  const n = mode === 'quick' ? 4 : 12;
  const step = products.length / n;
  const sample = Array.from({ length: Math.min(n, products.length) }, (_, i) => products[Math.floor(i * step)]);
  let list = [...rest, ...sample];
  if (mode === 'quick') {
    const keep = ['/', '/shop', '/gifts', '/cart', '/order', '/order/sent', '/custom', '/stockists', '/journal', '/contact', '/story', '/faq'];
    list = [...rest.filter(u => keep.includes(u) || u === '/journal/what-mikono-means'), ...sample];
  }
  return [...new Set(list)];
}

function measure(opts) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const de = document.documentElement;
  const sel = (el) => {
    if (!el || !el.tagName) return '';
    let s = el.tagName.toLowerCase();
    if (el.id) return s + '#' + el.id;
    const cl = [...el.classList].filter(c => !/^(\d|\[)/.test(c)).slice(0, 3).join('.');
    if (cl) s += '.' + cl;
    const dc = el.getAttribute('data-card'); if (dc) s += `[data-card=${dc}]`;
    const p = el.parentElement;
    if (p && p !== document.body) { let ps = p.tagName.toLowerCase(); const pc = [...p.classList].slice(0, 2).join('.'); if (pc) ps += '.' + pc; s = ps + ' > ' + s; }
    return s.slice(0, 140);
  };
  const cs = (el) => getComputedStyle(el);
  const visible = (el) => {
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    const s = cs(el); if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) === 0) return false;
    // Closed <details> panels (footer accordions) keep a layout box under content-visibility:hidden; they are not rendered, so they are not on screen.
    if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })) return false;
    if (s.clip && s.clip !== 'auto' && /rect\(0(px)?, 0(px)?, 0(px)?, 0(px)?\)/.test(s.clip)) return false;
    if (r.width <= 1 || r.height <= 1) return false;
    return true;
  };
  const clippedByAncestor = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = cs(p); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= vw + 1 && pr.left >= -1) return true; }
    }
    return false;
  };
  const res = {};
  const all = [...document.body.querySelectorAll('*')];
  res.docOverflow = { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, bodyScrollWidth: document.body.scrollWidth };
  res.overflowing = [];
  for (const el of all) {
    if (['SCRIPT', 'STYLE', 'PATH', 'svg'].includes(el.tagName)) continue;
    const s = cs(el); if (s.position === 'fixed' && !visible(el)) continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    if ((r.right > vw + 1 || r.left < -1) && visible(el) && !clippedByAncestor(el)) res.overflowing.push({ sel: sel(el), right: Math.round(r.right), left: Math.round(r.left), w: Math.round(r.width) });
  }
  res.overflowing = res.overflowing.slice(0, 40);
  // fonts
  res.minFont = 99; res.smallText = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (tw.nextNode()) {
    const n = tw.currentNode; if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el) || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue; seen.add(el);
    if (!visible(el)) continue;
    const fs = parseFloat(cs(el).fontSize);
    if (fs < res.minFont) res.minFont = fs;
    if (fs < 16) res.smallText.push({ sel: sel(el), fs: Math.round(fs * 10) / 10, text: n.textContent.trim().slice(0, 30) });
  }
  res.smallText.sort((a, b) => a.fs - b.fs); res.smallTextCount = res.smallText.length; res.smallText = res.smallText.slice(0, 8);
  // tap targets
  res.tap = [];
  const ctl = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], label[for]')];
  for (const el of ctl) {
    if (!visible(el)) continue;
    if (el.closest('[aria-hidden=true]') && cs(el).pointerEvents === 'none') continue;
    let r = el.getBoundingClientRect();
    if (el.tagName === 'INPUT' && /(checkbox|radio)/.test(el.type)) { const lb = el.closest('label') || (el.id && document.querySelector(`label[for="${el.id}"]`)); if (lb) { const lr = lb.getBoundingClientRect(); if (lr.width >= 44 && lr.height >= 44) continue; } }
    if (r.right < 0 || r.left > vw) continue;
    // The compact density system keeps controls visually small (32 to 40px) and extends the hit area with ::after (.hit-y, .hit-area, .iconbtn, .ck-btn). Count that extension.
    let ew = r.width, eh = r.height;
    try { const a = getComputedStyle(el, '::after'); if (a.content !== 'none' && a.position === 'absolute') { const aw = parseFloat(a.width), ah = parseFloat(a.height); if (aw > 0) ew = Math.max(ew, aw); if (ah > 0) eh = Math.max(eh, ah); } } catch { }
    if (ew < 43.5 || eh < 43.5) {
      const inline = el.tagName === 'A' && cs(el).display === 'inline';
      res.tap.push({ sel: sel(el), w: Math.round(ew), h: Math.round(eh), kind: inline ? 'inline' : (el.tagName === 'A' ? 'link' : el.tagName.toLowerCase()), text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 24) });
    }
  }
  res.tapCount = res.tap.length; res.tapNonInline = res.tap.filter(t => t.kind !== 'inline').length;
  res.tap = res.tap.slice(0, 40);
  // clipping and overlap
  res.clipped = [];
  const txt = [...document.querySelectorAll('h1,h2,h3,h4,button,a.btn,[class*=btn],[class*=button],label,th,td,li > a')].filter(visible).slice(0, 400);
  for (const el of txt) {
    const s = cs(el);
    if (el.scrollWidth > el.clientWidth + 1 && /(hidden|clip)/.test(s.overflowX)) res.clipped.push({ sel: sel(el), kind: 'width', sw: el.scrollWidth, cw: el.clientWidth, text: el.innerText.trim().slice(0, 30) });
    else if (s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) res.clipped.push({ sel: sel(el), kind: 'ellipsis', text: el.innerText.trim().slice(0, 30) });
    else if (/(hidden|clip)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0 && !/^(IMG|SVG)$/i.test(el.tagName)) res.clipped.push({ sel: sel(el), kind: 'height', sh: el.scrollHeight, ch: el.clientHeight, text: el.innerText.trim().slice(0, 30) });
  }
  res.overlaps = [];
  const inFixed = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) { const ps = cs(p).position; if (ps === 'fixed' || ps === 'sticky') return true; } return false; };
  const boxes = txt.filter(el => el.innerText && el.innerText.trim() && !inFixed(el)).map(el => ({ el, r: el.getBoundingClientRect() }));
  for (let i = 0; i < boxes.length && res.overlaps.length < 8; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j]; if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (ix > 4 && iy > 4 && ix * iy > 40) { res.overlaps.push({ a: sel(a.el), b: sel(b.el), area: Math.round(ix * iy), at: Math.round(a.r.top + scrollY) }); if (res.overlaps.length >= 8) break; }
  }
  // images
  res.brokenImgs = []; res.distorted = [];
  for (const im of document.images) {
    const r = im.getBoundingClientRect(); const rendered = r.width > 1 && r.height > 1 && cs(im).visibility !== 'hidden' && cs(im).display !== 'none';
    if (!rendered && !(im.complete && im.naturalWidth === 0 && im.currentSrc)) continue;
    if (im.currentSrc && (!im.complete || im.naturalWidth === 0) && rendered) { res.brokenImgs.push({ sel: sel(im), src: (im.currentSrc || '').slice(-70), complete: im.complete }); continue; }
    if (!rendered || im.naturalWidth === 0) continue;
    const of = cs(im).objectFit; if (of !== 'fill' && of !== '') continue;
    if (r.width < 24 || r.height < 24) continue;
    const nr = im.naturalWidth / im.naturalHeight, rr = (im.offsetWidth && im.offsetHeight) ? im.offsetWidth / im.offsetHeight : r.width / r.height; // offset sizes ignore transforms (rotating sprites inflate the bounding box)
    if (Math.abs(rr / nr - 1) > 0.02) res.distorted.push({ sel: sel(im), rendered: +rr.toFixed(3), natural: +nr.toFixed(3), src: (im.currentSrc || '').slice(-50) });
  }
  res.imgCount = document.images.length;
  // card grids
  res.gridIssues = []; res.gridGroups = 0;
  const groups = new Map();
  for (const c of document.querySelectorAll('[data-card]')) { if (!visible(c)) continue; const key = c.parentElement; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [par, cards] of groups) {
    if (cards.length < 2) continue; res.gridGroups++;
    const types = new Set(cards.map(c => c.getAttribute('data-card')));
    const hs = cards.map(c => c.getBoundingClientRect().height);
    const ctaB = cards.map(c => { const ct = [...c.querySelectorAll('a,button')].filter(visible).pop(); return ct ? ct.getBoundingClientRect().bottom - c.getBoundingClientRect().top : null; }).filter(v => v != null);
    const ratios = cards.map(c => { const im = c.querySelector('img'); if (!im) return null; const r = im.parentElement.getBoundingClientRect(); return r.width / r.height; }).filter(v => v != null);
    const hs2 = Math.max(...hs) - Math.min(...hs), cs2 = ctaB.length ? Math.max(...ctaB) - Math.min(...ctaB) : 0;
    const rs = ratios.length ? Math.max(...ratios) - Math.min(...ratios) : 0;
    const type = [...types].join('/');
    const tag = type === 'category' || type === 'bento' ? 'bento' : '';
    if (hs2 > 2 || cs2 > 2 || rs > 0.03) res.gridIssues.push({ parent: sel(par), type, n: cards.length, heightSpread: Math.round(hs2), ctaBottomSpread: Math.round(cs2), ratioSpread: +rs.toFixed(3), bento: !!tag });
  }
  // filters (components/filters): the bar fits, no chip row scrolls sideways, no chip or tab is cut off, the sheet (when open) fits
  res.filterIssues = [];
  for (const row of document.querySelectorAll('.mf-chips, .mf-tabs')) { if (!visible(row)) continue; if (row.scrollWidth > row.clientWidth + 1) res.filterIssues.push('chip row scrolls sideways: ' + sel(row)); for (const c of row.querySelectorAll('.mf-chip')) { if (!visible(c)) continue; const b = c.getBoundingClientRect(); if (b.right > vw + .5 || b.left < -.5) res.filterIssues.push('chip cut off: ' + c.textContent.trim().slice(0, 24)); } }
  for (const bar of document.querySelectorAll('.mf-bar')) { if (!visible(bar)) continue; for (const k of bar.querySelectorAll('.mf-search,.mf-filter-btn,.mf-count,.mf-sort')) { if (!visible(k)) continue; const b = k.getBoundingClientRect(); if (b.right > vw + .5 || b.left < -.5) res.filterIssues.push('filter bar control cut off: ' + k.className.split(' ')[0]); } const h = bar.getBoundingClientRect().height; if (h > vh * 0.2) res.filterIssues.push('filter bar is ' + Math.round(h) + 'px tall (over 20% of the screen)'); }
  // fixed and sticky
  const fx = [];
  for (const el of all) { const s = cs(el); if ((s.position === 'fixed' || s.position === 'sticky') && visible(el)) { const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh && r.width > 20 && r.height > 10) fx.push({ el, r, pos: s.position }); } }
  res.fixed = fx.map(f => ({ sel: sel(f.el), pos: f.pos, top: Math.round(f.r.top), bottom: Math.round(f.r.bottom), h: Math.round(f.r.height), w: Math.round(f.r.width) }));
  res.fixedOverlap = [];
  for (let i = 0; i < fx.length; i++) for (let j = i + 1; j < fx.length; j++) {
    const a = fx[i], b = fx[j]; if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (ix > 4 && iy > 4) res.fixedOverlap.push({ a: sel(a.el), b: sel(b.el), area: Math.round(ix * iy) });
  }
  let covered = 0; const fxOnly = fx.filter(f => f.pos === 'fixed' || f.pos === 'sticky');
  const bands = fxOnly.map(f => [Math.max(0, f.r.top), Math.min(vh, f.r.bottom), f.r.width / vw]).filter(b => b[2] > 0.5).sort((a, b) => a[0] - b[0]);
  let cur = -1, lastEnd = -1; for (const [s, e] of bands) { if (s > lastEnd) { covered += e - s; lastEnd = e; } else if (e > lastEnd) { covered += e - lastEnd; lastEnd = e; } }
  res.fixedCoverPct = Math.round(covered / vh * 100);
  // hero CTA
  const cta = [...document.querySelectorAll('main a[href], main button')].filter(visible).find(el => { const r = el.getBoundingClientRect(); return r.height >= 30 && r.width >= 60; });
  res.heroCta = null;
  if (cta) {
    const r = cta.getBoundingClientRect(); let coveredBy = null;
    for (const f of fx) { if (f.el.contains(cta)) continue; const ix = Math.min(r.right, f.r.right) - Math.max(r.left, f.r.left), iy = Math.min(r.bottom, f.r.bottom) - Math.max(r.top, f.r.top); if (ix > 4 && iy > 4 && ix * iy > 0.2 * r.width * r.height) coveredBy = sel(f.el); }
    res.heroCta = { sel: sel(cta), text: (cta.innerText || '').trim().slice(0, 24), top: Math.round(r.top), bottom: Math.round(r.bottom), aboveFold: r.bottom <= vh, coveredBy };
  }
  // viewport meta
  const vm = document.querySelector('meta[name=viewport]');
  res.viewportMeta = vm ? vm.content : null;
  res.zoomBlocked = !!vm && (/user-scalable\s*=\s*(no|0)/i.test(vm.content) || /maximum-scale\s*=\s*(0?\.?\d|1(\.0*)?)(?![\d.])/i.test(vm.content));
  // safe area css
  let css = ''; for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) css += r.cssText; } catch { } }
  res.safeAreaCss = /env\(\s*safe-area-inset-bottom/.test(css);
  res.viewportFitCover = !!vm && /viewport-fit\s*=\s*cover/.test(vm.content);
  res.fixedBottom = fx.filter(f => f.pos === 'fixed' && f.r.bottom >= vh - 4).map(f => sel(f.el));
  res.pageHeight = de.scrollHeight;
  return res;
}

const zoomMeasure = () => {
  const vw = window.innerWidth; const de = document.documentElement;
  de.style.fontSize = '200%';
  return new Promise(res => setTimeout(() => {
    const off = []; for (const el of document.body.querySelectorAll('*')) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed') { let clipped = false; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { if (/(hidden|auto|scroll|clip)/.test(getComputedStyle(p).overflowX) && p.getBoundingClientRect().right <= vw + 1) { clipped = true; break; } } if (!clipped) off.push((el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.')).slice(0, 90)); } }
    const o = { overflow: de.scrollWidth > de.clientWidth + 1, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders: off.slice(0, 5) };
    de.style.fontSize = ''; res(o);
  }, 250));
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); }
    window.scrollTo(0, h()); await new Promise(r => setTimeout(r, 200));
    const t0 = Date.now();
    while (Date.now() - t0 < 4000 && [...document.images].some(i => i.currentSrc && !i.complete)) await new Promise(r => setTimeout(r, 150));
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 200));
  });
}


// ---- Living layer checks (animals, thread rail, WhatsApp float, cookie dock) ----
// Samples the page at up to 14 scroll positions. Compares bounding boxes of animal elements (.fx-char, [data-sp], [data-fx*]), the thread rail
// (.fx-thread, .fx-knot, .fx-ball) against rendered text line boxes and interactive elements, and the fixed WhatsApp float (.wa-float) and cookie dock (.ck)
// against content. Text/animal pairs inside the same decorative band or the welcome lane are reported separately as "in-band" (designed composition).
async function fxScan() {
  const vw = innerWidth, vh = innerHeight;
  // The site uses CSS smooth scrolling; force instant jumps so sampled positions are the real ones.
  const prevSB = document.documentElement.style.scrollBehavior; document.documentElement.style.scrollBehavior = 'auto';
  const cs = (e) => getComputedStyle(e);
  const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.id) return s + '#' + el.id; const sp = el.getAttribute('data-sp'); const fd = el.getAttribute('data-find'); const cl = [...el.classList].slice(0, 2).join('.'); if (cl) s += '.' + cl; if (sp) s += `[data-sp=${sp}]`; if (fd) s += `[data-find=${fd}]`; return s.slice(0, 90); };
  const visible = (el) => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const s = cs(el); if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) === 0) return false; if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })) return false; return true; };
  const isFx = (el) => !!el.closest('.fx-char,[data-sp],.fx-thread,.fx-band,.fx-lane,[data-fx-band],.fx-host,.fx-pond,.fx-ground');
  const inter = (a, b) => { const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left), iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return ix > 0 && iy > 0 ? { ix, iy, area: ix * iy } : null; };
  const out = { fxText: [], fxTap: [], threadText: [], threadTap: [], waDock: [], waCovers: [], dockCovers: [], bottomCovered: [], inBand: 0, samples: 0, fxSeen: 0, threadSeen: 0 };
  const seenKey = new Set();
  const push = (arr, key, o) => { if (seenKey.has(key)) return; seenKey.add(key); arr.push(o); };
  const H = document.documentElement.scrollHeight;
  const ys = []; for (let y = 0; y < H - vh + 1; y += Math.round(vh * 0.7)) ys.push(y); ys.push(Math.max(0, H - vh));
  const positions = ys.slice(0, 14);
  const wa = document.querySelector('.wa-float');
  for (const y of positions) {
    scrollTo(0, y); await new Promise(r => setTimeout(r, 140));
    out.samples++;
    const fxEls = [...document.querySelectorAll('.fx-char, [data-sp], [data-fx-sprite], [data-fx]')].filter(e => e !== document.documentElement && visible(e));
    // The .fx-thread box itself spans the full page width (pointer-events none); the drawn rail is .fx-t-line (14px), the knots and the yarn ball.
    const thr = [...document.querySelectorAll('.fx-thread .fx-t-line, .fx-thread .fx-knot, .fx-thread .fx-ball')].filter(visible);
    out.fxSeen = Math.max(out.fxSeen, fxEls.length); out.threadSeen = Math.max(out.threadSeen, thr.length);
    // text line boxes
    const lines = [];
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) {
      const n = tw.currentNode; if (!n.textContent.trim()) continue;
      const el = n.parentElement; if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(el.tagName)) continue;
      if (el.closest('[aria-hidden=true]') || el.closest('#sp') || !visible(el)) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) if (r.width > 3 && r.height > 5 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) lines.push({ el, r });
    }
    const ctl = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button]')].filter(e => visible(e) && !isFx(e) || (e.matches('.fx-find') && visible(e))).map(e => ({ el: e, r: e.getBoundingClientRect() })).filter(c => c.r.bottom > 0 && c.r.top < vh && c.r.right > 0 && c.r.left < vw);
    const fixedBars = (e) => { for (let p = e; p && p !== document.body; p = p.parentElement) { const ps = cs(p).position; if (ps === 'fixed') return true; } return false; };
    const bandOf = (e) => e.closest('.fx-band,.fx-lane,[data-fx-band]');
    const check = (list, kind) => {
      for (const f of list) {
        const fr = f.getBoundingClientRect(); if (fr.bottom < 0 || fr.top > vh) continue;
        const fe = f.closest('.fx-char') || f;
        const blocks = cs(fe).pointerEvents !== 'none';
        for (const t of lines) {
          if (f.contains(t.el) || fixedBars(t.el)) continue;
          const i = inter(fr, t.r); if (!i) continue;
          if (i.ix < 5 || i.iy < 5 || i.area < 0.25 * t.r.width * t.r.height) continue;
          const sameBand = bandOf(f) && bandOf(f) === bandOf(t.el);
          if (sameBand) { out.inBand++; continue; }
          push(kind === 'fx' ? out.fxText : out.threadText, `${sel(f)}|${sel(t.el)}`, { a: sel(f), b: sel(t.el), text: t.el.innerText.trim().slice(0, 28), y: Math.round(y + fr.top), area: Math.round(i.area), pct: Math.round(100 * i.area / (t.r.width * t.r.height)), blocks, w: Math.round(fr.width) });
        }
        for (const c of ctl) {
          if (f.contains(c.el) || c.el.contains(f) || fixedBars(c.el)) continue;
          const i = inter(fr, c.r); if (!i) continue;
          if (i.ix < 5 || i.iy < 5 || i.area < 0.1 * c.r.width * c.r.height) continue;
          const sameBand = bandOf(f) && bandOf(f) === bandOf(c.el);
          push(kind === 'fx' ? out.fxTap : out.threadTap, `${sel(f)}|${sel(c.el)}`, { a: sel(f), b: sel(c.el), text: (c.el.innerText || c.el.getAttribute('aria-label') || '').trim().slice(0, 24), y: Math.round(y + fr.top), pct: Math.round(100 * i.area / (c.r.width * c.r.height)), blocks, sameBand: !!sameBand });
        }
      }
    };
    check(fxEls, 'fx'); check(thr, 'thread');
    // fixed WhatsApp float and cookie dock
    const dock = document.querySelector('.ck'); const bars = [];
    if (wa && visible(wa)) bars.push({ n: 'wa-float', e: wa }); if (dock && visible(dock) && cs(dock).position === 'fixed') bars.push({ n: 'cookie-dock', e: dock });
    if (bars.length === 2) { const i = inter(bars[0].e.getBoundingClientRect(), bars[1].e.getBoundingClientRect()); if (i && i.ix > 3 && i.iy > 3) push(out.waDock, 'wadock', { a: 'wa-float', b: 'cookie-dock .ck', area: Math.round(i.area), y }); }
    for (const b of bars) {
      const br = b.e.getBoundingClientRect();
      for (const c of ctl) { if (b.e.contains(c.el) || fixedBars(c.el)) continue; const i = inter(br, c.r); if (!i) continue; const pct = Math.round(100 * i.area / (c.r.width * c.r.height)); if (pct >= 40 && c.r.top > 0 && c.r.bottom < vh) push(b.n === 'wa-float' ? out.waCovers : out.dockCovers, `${b.n}|${sel(c.el)}`, { bar: b.n, target: sel(c.el), text: (c.el.innerText || c.el.getAttribute('aria-label') || '').trim().slice(0, 24), pct, y: Math.round(y + c.r.top), atBottom: y >= H - vh - 2 }); }
    }
  }
  // Bottom of page: the last visible content must clear the fixed bars.
  scrollTo(0, H); await new Promise(r => setTimeout(r, 250));
  const barEls = [wa, document.querySelector('.ck')].filter(e => e && visible(e) && cs(e).position === 'fixed');
  const last = [...document.querySelectorAll('footer a[href], footer button, footer p, footer li')].filter(e => visible(e) && !e.closest('.fx-band,.fx-host,[aria-hidden=true]') && !e.closest('.ck') && !e.closest('.wa-float'));
  for (const e of last) { const r = e.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= vh) continue; for (const b of barEls) { const i = inter(r, b.getBoundingClientRect()); if (i && i.ix > 6 && i.iy > 6 && i.area > 0.4 * r.width * r.height) push(out.bottomCovered, `${sel(e)}|${b.className.toString().slice(0, 12)}`, { target: sel(e), text: (e.innerText || '').trim().slice(0, 28), bar: b.matches('.wa-float') ? 'wa-float' : 'cookie-dock', pct: Math.round(100 * i.area / (r.width * r.height)) }); } }
  scrollTo(0, 0); document.documentElement.style.scrollBehavior = prevSB;
  return out;
}

async function navPass(browser, base, shotDir, relDir) {
  const widths = [1024, 1100, 1180, 1280, 1366, 1440];
  const res = []; const defects = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'en-KE' });
  const page = await ctx.newPage();
  for (const u of ['/', '/shop']) {
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(base + u, { waitUntil: 'load', timeout: 45000 });
      await page.waitForFunction(() => { const e = document.getElementById('sp'); return !e || getComputedStyle(e).display === 'none'; }, null, { timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(500);
      const m = await page.evaluate(() => {
        const vw = innerWidth; const pill = document.querySelector('.nav-pill'); const nav = document.querySelector('nav.nav-main');
        if (!pill) return { missing: true };
        const pr = pill.getBoundingClientRect();
        const items = [...pill.querySelectorAll('.nav-top, a[href]')].filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.visibility !== 'hidden' && s.display !== 'none'; }).map(e => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 18), r: e.getBoundingClientRect() }));
        const tops = items.map(i => Math.round(i.r.top)); const rows = new Set(tops.map(t => Math.round(t / 12)));
        const over = items.filter(i => i.r.right > pr.right + 1 || i.r.left < pr.left - 1 || i.r.right > vw + 1).map(i => i.t);
        let overlap = []; for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) { const A = items[a].r, B = items[b].r; const ix = Math.min(A.right, B.right) - Math.max(A.left, B.left), iy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top); if (ix > 2 && iy > 2) overlap.push(items[a].t + ' X ' + items[b].t); }
        const labels = items.filter(i => /home|shop|gifts|wholesale|our story|blog|help/i.test(i.t)).map(i => i.t);
        return { pill: { l: Math.round(pr.left), r: Math.round(pr.right), w: Math.round(pr.width), h: Math.round(pr.height) }, vw, sw: pill.scrollWidth, cw: pill.clientWidth, docOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, rows: rows.size, over, overlap, labels, wrapped: items.some(i => i.r.height > 40), burgerVisible: !!document.querySelector('.nav-burger') && getComputedStyle(document.querySelector('.nav-burger')).display !== 'none' };
      });
      const bad = m.missing || m.sw > m.cw + 1 || m.docOverflow || m.pill?.r > m.vw + 1 || m.rows > 1 || m.over?.length || m.overlap?.length;
      let shot = null;
      if (bad || (u === '/' && (w === 1024 || w === 1440))) { shot = `${relDir}/nav-pill__${w}__${u === '/' ? 'home' : 'shop'}.png`; await page.screenshot({ path: path.join(ROOT, shot), clip: { x: 0, y: 0, width: w, height: 160 } }).catch(() => { shot = null; }); }
      res.push({ page: u, width: w, ...m, bad: !!bad, screenshot: shot });
      if (bad) defects.push({ sev: 'high', type: 'nav-pill-overflow', selector: '.nav-pill', page: u, device: `${w}x800`, detail: JSON.stringify({ sw: m.sw, cw: m.cw, pillRight: m.pill?.r, vw: m.vw, rows: m.rows, over: m.over, overlap: m.overlap, docOverflow: m.docOverflow, missing: m.missing }).slice(0, 220), screenshot: shot, fix: 'Reduce pill item padding/gap between 1024 and 1280 or switch to the burger below the width where the 7 items no longer fit.' });
    }
  }
  await ctx.close();
  return { res, defects };
}

const slug = (u) => (u === '/' ? 'home' : u.slice(1).replace(/\//g, '_'));
const FX_WIDTHS = [320, 360, 390, 412, 768];
// Whole-card tap target (owner ruling 2026-10-04): on every card grid, the centre, the text and the foot label of each card resolve to the card's own link, and a desktop pointer shows the pointer cursor.
const CARD_PAGES = new Set(['/journal', '/projects', '/shop', '/shop/safari-animals', '/shop/domestic-animals', '/shop/more-animals', '/shop/wall-art', '/shop/dolls', '/gifts', '/stockists', '/makers']);
function cardHits() {
  const bad = []; let n = 0;
  for (const c of document.querySelectorAll('.mk-card')) {
    if (!c.offsetParent || c.querySelector('button[data-cta]') || c.matches('.mk-card--moment,.mk-card--tier,.mk-card--feature,.mk-card--stat')) continue;
    const links = [...c.querySelectorAll('a[href]')]; if (!links.length) continue; n++;
    c.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = c.getBoundingClientRect(); const pts = [['centre', r.left + r.width / 2, r.top + r.height / 2]];
    const foot = c.querySelector('.mk-foot'); if (foot) { const q = foot.getBoundingClientRect(); pts.push(['foot', q.left + q.width * .15, q.top + q.height / 2]); }
    const tx = c.querySelector('.mk-text,.mk-title'); if (tx) { const q = tx.getBoundingClientRect(); pts.push(['text', q.left + q.width / 2, q.top + q.height / 2]); }
    for (const [name, x, y] of pts) { const e = document.elementFromPoint(x, y); if (e && e.closest('.ck,.wa-float,.nav-zone')) continue; /* fixed chrome over the point is covered by the fixed-overlap checks */ const a = e && e.closest('a[href],button'); if (!a || !c.contains(a)) bad.push(name + ' [at ' + (e ? e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 24) : 'null') + '] of "' + (c.querySelector('.mk-title,.mk-over')?.textContent || '').trim().slice(0, 30) + '"'); }
    if (matchMedia('(hover:hover)').matches) { const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); const a = e && e.closest('a[href]'); if (a && getComputedStyle(a).cursor !== 'pointer') bad.push('cursor not pointer on "' + (c.querySelector('.mk-title,.mk-over')?.textContent || '').trim().slice(0, 30) + '"'); }
  }
  return { n, bad };
}
const KEY = new Set(['/', '/shop', '/cart', '/order', '/custom', '/stockists', '/journal/what-mikono-means']);

function classify(page, dev, m, zoom, shot, fxr) {
  const D = [];
  const add = (sev, type, selr, detail, fix) => D.push({ sev, type, selector: selr, page, device: dev, detail, screenshot: shot, fix });
  const phone = dev.split('x')[0] <= 430 || +dev.split('x')[0] === 844 || +dev.split('x')[0] === 667;
  if (m.docOverflow.scrollWidth > m.docOverflow.clientWidth + 1) {
    const o = m.overflowing[0]; add('critical', 'horizontal-overflow', o ? o.sel : 'html', `scrollWidth ${m.docOverflow.scrollWidth} > clientWidth ${m.docOverflow.clientWidth}`, 'Constrain the offending element (max-width:100%, min-width:0, wrap), or fix the parent grid/flex.');
  }
  for (const o of m.overflowing.slice(0, 3)) if (/fx-/.test(o.sel)) add('low', 'thread-ball-clipped-at-edge', o.sel, `right ${o.right}, left ${o.left}, width ${o.w} (thread rail sits on the viewport edge, bounding box includes rotation)`, 'Inset the thread 4px from the edge so the yarn ball is never cut off.'); else if (!(m.docOverflow.scrollWidth > m.docOverflow.clientWidth + 1 && o === m.overflowing[0])) add('high', 'element-wider-than-viewport', o.sel, `right ${o.right}, left ${o.left}, width ${o.w}`, 'Clamp width to viewport or wrap in an overflow container intentionally.');
  for (const b of m.brokenImgs.slice(0, 3)) add('critical', 'image-not-rendered', b.sel, b.src, 'Check src/path, next/image config and format; provide fallback.');
  for (const d of m.distorted.slice(0, 3)) add('high', 'image-distortion', d.sel, `rendered ${d.rendered} vs natural ${d.natural}`, 'Use object-cover with a fixed aspect-ratio box, never width and height both fixed.');
  if (m.zoomBlocked) add('high', 'zoom-blocked', 'meta[name=viewport]', m.viewportMeta, 'Remove user-scalable=no / maximum-scale=1.');
  if (!m.viewportMeta) add('critical', 'viewport-meta-missing', 'head', '', 'Add viewport meta.');
  if (m.heroCta && m.heroCta.coveredBy && /cookie/.test(m.heroCta.coveredBy)) add('low', 'cta-under-cookie-dock-at-load', m.heroCta.sel, `first CTA sits under ${m.heroCta.coveredBy} at scroll 0 on first visit; one scroll or choosing clears it`, 'Acceptable if dock is dismissable; otherwise keep first CTA above the dock line.'); else if (m.heroCta && m.heroCta.coveredBy) add('critical', 'cta-covered-by-fixed', m.heroCta.sel, `covered by ${m.heroCta.coveredBy}`, 'Reserve space (padding) or shrink the fixed element at scroll 0 on small screens.');
  if (phone && m.fixedCoverPct > 35) add('high', 'fixed-elements-eat-viewport', m.fixed.map(f => f.sel).join(' + ').slice(0, 140), `${m.fixedCoverPct}% of viewport covered at scroll 0`, 'Collapse cookie bar to a compact strip; hide sticky bars on landscape phones.');
  else if (phone && m.fixedCoverPct > 20) add('medium', 'fixed-elements-heavy', m.fixed.map(f => f.sel).join(' + ').slice(0, 140), `${m.fixedCoverPct}% of viewport covered at scroll 0`, 'Reduce fixed chrome height.');
  for (const f of m.fixedOverlap.slice(0, 2)) add(/sticky/.test(f.a + f.b) ? 'low' : 'high', 'fixed-overlap', f.a + '  X  ' + f.b, `overlap ${f.area}px2`, 'Stack with a shared offset variable (e.g. --bar-h) so WhatsApp float sits above cookie bar.');
  if (m.heroCta && !m.heroCta.aboveFold && phone) add('low', 'primary-cta-below-fold', m.heroCta.sel, `bottom ${m.heroCta.bottom}`, 'Tighten hero height so first CTA shows above the fold.');
  if (m.fixedBottom.length && !m.safeAreaCss) add('medium', 'safe-area-missing', m.fixedBottom.join(', ').slice(0, 120), 'fixed bottom element, no env(safe-area-inset-bottom) in CSS', 'Add padding-bottom: env(safe-area-inset-bottom) and viewport-fit=cover.');
  for (const t of m.tap.filter(t => t.kind !== 'inline').slice(0, 6)) add(t.kind === 'link' || t.kind === 'button' ? 'high' : 'high', 'tap-target-small', t.sel, `${t.w}x${t.h} "${t.text}"`, 'min-height/min-width 44px (padding or ::after hit area).');
  const inl = m.tap.filter(t => t.kind === 'inline'); if (inl.length) add('low', 'tap-target-inline', inl[0].sel, `${inl.length} inline links under 44px, e.g. ${inl[0].w}x${inl[0].h} "${inl[0].text}"`, 'Add vertical padding/line-height to inline links in dense lists.');
  if (m.minFont < 12) add('high', 'font-too-small', (m.smallText[0] || {}).sel || '', `min ${m.minFont}px, ${m.smallTextCount} elements under 16px`, 'Raise to 16px minimum per charter.');
  else if (m.smallTextCount) add('medium', 'font-under-16', m.smallText[0].sel, `${m.smallTextCount} elements under 16px, min ${m.minFont}px: "${m.smallText[0].text}"`, 'Raise to 16px minimum per charter R-rule.');
  for (const c of m.clipped.slice(0, 3)) add(c.kind === 'ellipsis' ? 'low' : 'high', 'text-clipped', c.sel, `${c.kind} "${c.text}"`, 'Allow wrapping (white-space:normal), remove fixed height, or reduce letter-spacing.');
  for (const o of m.overlaps.slice(0, 2)) add('high', 'text-overlap', o.a + '  X  ' + o.b, `${o.area}px2 at y=${o.at}`, 'Fix wrapping or spacing so boxes do not intersect.');
  for (const g of m.gridIssues.slice(0, 3)) add(g.bento ? 'low' : 'high', 'card-grid-nonuniform', g.parent, `${g.type} x${g.n}: height spread ${g.heightSpread}px, CTA bottom spread ${g.ctaBottomSpread}px, image ratio spread ${g.ratioSpread}`, 'Equal heights: grid auto-rows:1fr, card flex-col with mt-auto on CTA, line-clamp titles, fixed aspect ratio.');
  for (const f of (m.filterIssues || []).slice(0, 3)) add('high', 'filter-bar-cut-off', '.mf-bar', f, 'Chips and tabs wrap (flex-wrap); the slim bar controls fit the width.');
  if (m.cardHits && m.cardHits.bad.length) add('high', 'card-not-fully-clickable', 'a.mk-card', `${m.cardHits.bad.length} of ${m.cardHits.n} cards: ${m.cardHits.bad.slice(0, 3).join('; ')}`, 'One link per card whose hit area covers the whole card (.mk-hit or stretched ::after on the card), cursor:pointer.');
  if (zoom && zoom.overflow) add('high', 'zoom200-overflow', (zoom.offenders[0] || 'html'), `scrollWidth ${zoom.scrollWidth} > ${zoom.clientWidth}; ${zoom.offenders.slice(0, 3).join(' | ')}`, 'Use rem for widths/paddings, allow wrap, avoid fixed px widths on text containers.');
  if (fxr && !fxr.error) {
    for (const o of fxr.fxText.slice(0, 4)) add(o.blocks ? 'high' : 'medium', 'fx-overlaps-text', o.a + '  X  ' + o.b, `animal box covers ${o.pct}% of text line "${o.text}" at y=${o.y}${o.blocks ? ' (captures taps)' : ' (decorative, pointer-events none)'}`, 'Keep animals in their own band lane or add margin; sprites must not sit over body copy.');
    for (const o of fxr.fxTap.slice(0, 4)) add(o.blocks || o.pct >= 50 ? 'high' : 'medium', 'fx-overlaps-tap-target', o.a + '  X  ' + o.b, `animal box covers ${o.pct}% of "${o.text}" at y=${o.y}${o.blocks ? ' (captures taps)' : ''}`, 'Move the animal off the control or confirm pointer-events:none and z-index below the control.');
    for (const o of fxr.threadText.slice(0, 3)) add('high', 'thread-overlaps-text', o.a + '  X  ' + o.b, `thread covers ${o.pct}% of "${o.text}" at y=${o.y}`, 'Reserve a gutter for the thread rail or hide it when the content width is under the safe measure.');
    for (const o of fxr.threadTap.slice(0, 3)) add(o.pct >= 50 ? 'high' : 'medium', 'thread-overlaps-tap-target', o.a + '  X  ' + o.b, `thread covers ${o.pct}% of "${o.text}" at y=${o.y}`, 'Keep the thread within the page gutter, away from controls.');
    for (const o of fxr.waDock.slice(0, 1)) add('high', 'wa-dock-overlap', 'wa-float  X  .ck', `overlap ${o.area}px2 at scrollY ${o.y}`, 'Offset the WhatsApp float by --dock-h while the dock is open.');
    for (const o of fxr.waCovers.slice(0, 3)) add(o.atBottom ? 'high' : 'low', 'wa-float-covers-content', o.bar + '  X  ' + o.target, `float covers ${o.pct}% of "${o.text}" at scrollY with target ${o.y}${o.atBottom ? ' (page bottom, cannot scroll away)' : ' (transient, scroll clears it)'}`, 'Add bottom padding or move the float away from CTAs; at page end nothing may stay covered.');
    for (const o of fxr.dockCovers.slice(0, 3)) add(o.atBottom ? 'high' : 'low', 'cookie-dock-covers-content', o.bar + '  X  ' + o.target, `dock covers ${o.pct}% of "${o.text}"${o.atBottom ? ' at page bottom' : ' (transient)'}`, 'Use --dock-h as body padding-bottom so the page can scroll content clear of the dock.');
    for (const o of fxr.bottomCovered.slice(0, 3)) add('high', 'bottom-content-covered', o.bar + '  X  ' + o.target, `at page bottom "${o.text}" is ${o.pct}% covered by ${o.bar}`, 'Add padding-bottom equal to the fixed bar height (and safe area) to the footer.');
  }
  return D;
}

(async () => {
  const urls = await routes();
  console.log(`Base ${base}; ${urls.length} pages x ${DEVICES.length} devices (${mode})`);
  const launch = () => chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
  let browser;
  const results = []; const defects = [];
  let homeHeight390 = null; const fxStats = [];
  for (const dev of DEVICES) {
    let ctx; const queue = [...urls];
    for (let attempt = 0; attempt < 3; attempt++) { try { if (!browser || !browser.isConnected()) browser = await launch(); ctx = await browser.newContext({ ...dev, locale: 'en-KE' }); break; } catch (e) { try { await browser?.close(); } catch {} browser = null; } }
    if (!ctx) { console.log('skip device', dev.name); continue; }
    const worker = async () => {
      let page = await ctx.newPage();
      while (queue.length) {
        const u = queue.shift();
        const rec = { page: u, device: dev.name, status: null };
        try {
          const resp = await page.goto(base + u, { waitUntil: 'load', timeout: 45000 });
          rec.status = resp ? resp.status() : 0;
          // The intro (#sp) is a deliberate 1.9 s overlay on every full load; the layout gate measures the page once it has left. The intro itself is covered by interactions S1.
          await page.waitForFunction(() => { const e = document.getElementById('sp'); return !e || getComputedStyle(e).display === 'none'; }, null, { timeout: 6000 }).catch(() => {});
          await page.waitForTimeout(600);
          const fold = await page.evaluate(measure, {});            // scroll 0 state incl. fixed bars
          await autoScroll(page);
          const m = await page.evaluate(measure, {});
          m.fixed = fold.fixed; m.fixedOverlap = fold.fixedOverlap; m.fixedCoverPct = fold.fixedCoverPct; m.heroCta = fold.heroCta; m.fixedBottom = fold.fixedBottom;
          if (CARD_PAGES.has(u)) { const ch = await page.evaluate(cardHits); m.cardHits = ch; }
          const zoom = await page.evaluate(zoomMeasure);
          let fxr = null;
          if (FX_WIDTHS.includes(dev.viewport.width) && dev.isMobile) { try { fxr = await page.evaluate(fxScan); } catch (e) { fxr = { error: String(e).slice(0, 120) }; } }
          const base0 = `${slug(u)}__${dev.name}`;
          let shot = null;
          const preDefects = classify(u, dev.name, m, zoom, null, null);
          const serious = preDefects.some(d => d.sev === 'critical' || d.sev === 'high');
          if (KEY.has(u) && KEY_SHOT_DEVICES.includes(dev.name)) { shot = `${SHOT_REL}/${base0}-full.png`; await page.screenshot({ path: path.join(ROOT, shot), fullPage: true, animations: 'disabled' }).catch(() => { shot = null; }); }
          else if (serious && ['320x568', '360x740', '390x844', '844x390', '768x1024'].includes(dev.name)) { shot = `${SHOT_REL}/${base0}-fold.png`; await page.screenshot({ path: path.join(ROOT, shot) }).catch(() => { shot = null; }); }
          if (KEY.has(u) && ['320x568', '360x740', '390x844'].includes(dev.name)) { await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: path.join(ROOT, `${SHOT_REL}/${base0}-fold.png`) }).catch(() => { }); }
          const ds = classify(u, dev.name, m, zoom, shot, fxr);
          if (fxr) { fxStats.push({ page: u, device: dev.name, ...(fxr.error ? { error: fxr.error } : { samples: fxr.samples, fxSeen: fxr.fxSeen, threadSeen: fxr.threadSeen, inBand: fxr.inBand, fxText: fxr.fxText.length, fxTap: fxr.fxTap.length, threadText: fxr.threadText.length, threadTap: fxr.threadTap.length, waDock: fxr.waDock.length, bottomCovered: fxr.bottomCovered.length }) }); if (!fxr.error && (fxr.fxText.length || fxr.fxTap.length || fxr.threadText.length || fxr.threadTap.length) && !shot) { const sh = `${SHOT_REL}/${base0}-fx.png`; await page.evaluate((y) => scrollTo(0, y), Math.max(0, ((fxr.fxText[0] || fxr.fxTap[0] || fxr.threadText[0] || fxr.threadTap[0]).y || 0) - 200)); await page.waitForTimeout(150); await page.screenshot({ path: path.join(ROOT, sh) }).catch(() => {}); ds.forEach(d => { if (/^(fx|thread)-/.test(d.type) && !d.screenshot) d.screenshot = sh; }); } }
          if (u === '/' && dev.name === '390x844') homeHeight390 = m.pageHeight;
          if (rec.status >= 400) ds.push({ sev: 'critical', type: 'http-error', selector: u, page: u, device: dev.name, detail: 'HTTP ' + rec.status, screenshot: shot, fix: 'Fix route or sitemap entry.' });
          Object.assign(rec, { pageHeight: m.pageHeight, minFont: m.minFont, tapCount: m.tapCount, tapNonInline: m.tapNonInline, fixedCoverPct: m.fixedCoverPct, zoomOverflow: zoom.overflow, defects: ds.length, worst: ds.some(d => d.sev === 'critical') ? 'critical' : ds.some(d => d.sev === 'high') ? 'high' : ds.length ? 'medium' : 'none', metrics: { docOverflow: m.docOverflow, viewportMeta: m.viewportMeta, safeAreaCss: m.safeAreaCss, viewportFitCover: m.viewportFitCover, fixed: m.fixed, gridGroups: m.gridGroups, imgCount: m.imgCount } });
          defects.push(...ds);
        } catch (e) { if (page.isClosed() || !browser.isConnected()) { queue.push(u); await new Promise(r => setTimeout(r, 500)); if (!browser.isConnected()) break; page = await ctx.newPage(); continue; } rec.error = String(e).slice(0, 200); defects.push({ sev: 'critical', type: 'load-error', selector: u, page: u, device: dev.name, detail: rec.error, screenshot: null, fix: 'Investigate navigation failure.' }); rec.worst = 'critical'; }
        results.push(rec);
      }
      await page.close();
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    try { await ctx.close(); } catch {}
    console.log('done device', dev.name);
  }
  let navRes = null;
  if (!NO_NAV) try { navRes = await navPass(browser, base, null, SHOT_REL); defects.push(...navRes.defects); } catch (e) { console.log('nav pass failed', String(e).slice(0, 200)); }
  try { await browser.close(); } catch {}

  // aggregate
  const sevRank = { critical: 0, high: 1, medium: 2, low: 3 };
  const agg = new Map();
  for (const d of defects) {
    const k = d.type + '|' + d.selector.replace(/\d+/g, '#');
    if (!agg.has(k)) agg.set(k, { ...d, pages: new Set(), devices: new Set(), count: 0 });
    const a = agg.get(k); a.pages.add(d.page); a.devices.add(d.device); a.count++;
    if (!a.screenshot && d.screenshot) { a.screenshot = d.screenshot; a.device = d.device; a.page = d.page; a.detail = d.detail; }
    if (sevRank[d.sev] < sevRank[a.sev]) a.sev = d.sev;
  }
  const ranked = [...agg.values()].map(a => ({ ...a, pages: [...a.pages], devices: [...a.devices] }))
    .sort((a, b) => sevRank[a.sev] - sevRank[b.sev] || b.pages.length - a.pages.length || b.devices.length - a.devices.length);
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }; ranked.forEach(r => counts[r.sev]++);
  const pageStatus = urls.map(u => {
    const rs = results.filter(r => r.page === u); const worst = ['critical', 'high', 'medium', 'none'].find(w => rs.some(r => r.worst === w)) || 'none';
    const failDev = rs.filter(r => r.worst === 'critical' || r.worst === 'high').map(r => r.device);
    return { page: u, result: worst === 'critical' || worst === 'high' ? 'FAIL' : 'PASS', worst, failingDevices: failDev };
  });
  const overall = pageStatus.every(p => p.result === 'PASS') ? 'PASS' : 'FAIL';
  const json = { date, base, mode, overall, counts, homeHeight390, pageStatus, ranked, fxStats, navPill: navRes && navRes.res, results };
  const jf = path.join(OUT, `layout-${date}${TSFX}.json`); fs.writeFileSync(jf, JSON.stringify(json, null, 1));
  let md = `# Mobile layout gate ${date}\n\nBase: ${base}  Mode: ${mode}  Overall: **${overall}**\n\nDefect clusters: critical ${counts.critical}, high ${counts.high}, medium ${counts.medium}, low ${counts.low}\n\nHome page height at 390x844: ${homeHeight390}px\n\nRe-run: \`node scripts/mobile-qa/layout.mjs ${base} --pages ${mode}\`\n\n## Per page\n\n| Page | Result | Worst | Failing devices |\n|---|---|---|---|\n`;
  for (const p of pageStatus) md += `| ${p.page} | ${p.result} | ${p.worst} | ${p.failingDevices.join(', ') || '-'} |\n`;
  md += `\n## Ranked defects\n\n| # | Sev | Type | Selector | Pages | Devices | Example (page, device) | Detail | Screenshot | Suggested fix |\n|---|---|---|---|---|---|---|---|---|---|\n`;
  ranked.slice(0, 120).forEach((r, i) => { md += `| ${i + 1} | ${r.sev} | ${r.type} | \`${r.selector.replace(/\|/g, '/')}\` | ${r.pages.length} | ${r.devices.length} | ${r.page}, ${r.device} | ${String(r.detail).replace(/\|/g, '/').slice(0, 120)} | ${r.screenshot || '-'} | ${r.fix} |\n`; });
  md += `\n## Nav pill 1024 to 1440\n\n| Page | Width | Pill right | Rows | scrollWidth/clientWidth | Result |\n|---|---|---|---|---|---|\n`;
  for (const n of (navRes ? navRes.res : [])) md += `| ${n.page} | ${n.width} | ${n.pill ? n.pill.r : '-'} | ${n.rows ?? '-'} | ${n.sw ?? '-'}/${n.cw ?? '-'} | ${n.bad ? 'FAIL' : 'PASS'} |\n`;
  const fxTot = fxStats.reduce((a, f) => { for (const k of ['fxText', 'fxTap', 'threadText', 'threadTap', 'waDock', 'bottomCovered']) a[k] = (a[k] || 0) + (f[k] || 0); return a; }, {});
  md += `\n## Living layer overlap sampling (320, 360, 390, 412, 768)\n\nPage x device scans: ${fxStats.length}. Totals: ${JSON.stringify(fxTot)}\n`;
  md = md.replace(/[\u2013\u2014]/g, '-');
  fs.writeFileSync(path.join(OUT, `layout-${date}${TSFX}.md`), md);
  console.log(`OVERALL ${overall}  ${JSON.stringify(counts)}  report: strategy/gates/mobile/layout-${date}${TSFX}.md`);
})();
