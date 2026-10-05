// Full width audit. Usage: node scripts/mobile-qa/width.mjs [baseUrl] [--widths 1920,1440] [--only /a,/b] [--sample] [--shots dir]
// For every sitemap route and width it measures the union of the visible content in <main> against the site container,
// flags left aligned content with an empty right side, narrow sections, and horizontal overflow. Prints a table, exits 1 on failures.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const SCRATCH = '/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules';
const require = createRequire(SCRATCH + '/');
const { chromium } = require('playwright-core');
const args = process.argv.slice(2);
const base = (args.find(a => /^https?:/.test(a)) || 'http://localhost:3451').replace(/\/$/, '');
const argOf = (n) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };
const WIDTHS = (argOf('widths') || '1920,1440,1280,1024,768,390').split(','); // 'W' or 'WxH' (844x390 is phone landscape)
const HEIGHT = { 1920: 1080, 1440: 900, 1280: 800, 1024: 768, 768: 1024, 390: 844 };
const ONLY = argOf('only') ? argOf('only').split(',') : null;
const SHOTS = argOf('shots');
const JSON_OUT = argOf('json');
const TAG = argOf('tag');
const NO_REPORT = args.includes('--no-report');
const EXE = process.env.CHROME || (process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome');

async function routes() {
  const xml = await (await fetch(base + '/sitemap.xml')).text();
  let urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname.replace(/\/$/, '') || '/'))];
  urls = [...new Set([...urls, '/cart', '/order/sent', '/custom/studio/sent', '/this-page-does-not-exist'])];
  if (ONLY) return ONLY;
  if (args.includes('--sample')) {
    const pick = (pre, n) => urls.filter(u => u.startsWith(pre) && u.split('/').length > 2).filter((_, i, a) => i % Math.max(1, Math.floor(a.length / n)) === 0).slice(0, n);
    const keep = urls.filter(u => !u.startsWith('/journal/') && !u.startsWith('/shop/'));
    return [...keep, ...pick('/journal/', 6), ...pick('/shop/', 6)];
  }
  return urls;
}
const tmpl = (p) => p.startsWith('/journal/') ? '/journal/[slug]' : p.startsWith('/shop/') && p.split('/').length === 3 ? '/shop/[slug]' : p.startsWith('/projects/') ? '/projects/[slug]' : p;

function measure() {
  const vw = document.documentElement.clientWidth;
  const main = document.querySelector('main');
  if (!main) return { err: 'no main' };
  const skip = (el) => {
    const dt = el.closest('details:not([open])'); if (dt && !el.closest('summary')) return true;
    for (let e = el; e && e !== main; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (e.getAttribute('aria-hidden') === 'true' || cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return true;
      if (e.matches('.fx-thread,.fx-find,.fx-ground,.fx-hopper,.fx-peeker,.fx-prop,.fx-lane,.fx-ball,.fx-confetti,.fx-knot,.fx-bit,[data-ambient]')) return true;
    }
    return false;
  };
  // Content leaves: text blocks, images, controls, inputs. Wide wrappers with backgrounds are ignored.
  const leaves = [...main.querySelectorAll('h1,h2,h3,h4,p,li,img,picture,figure,button,a,input,select,textarea,label,summary,dt,dd,th,td,svg,video,canvas')]
    .filter(el => !skip(el))
    .filter(el => !(el.matches('a,li,figure,label,td,th,dd,dt') && el.querySelector('p,h1,h2,h3,h4,img,li,button')))
    .map(el => ({ el, r: el.getBoundingClientRect() }))
    .filter(x => x.r.width > 8 && x.r.height > 8 && x.r.right > 0 && x.r.left < vw);
  if (!leaves.length) return { err: 'no content' };
  const cont = main.querySelector('[data-c]');
  const cr = cont ? cont.getBoundingClientRect() : { left: 0, right: vw };
  const L = Math.min(...leaves.map(x => x.r.left)), R = Math.max(...leaves.map(x => x.r.right));
  // Strip scan: every 100px slice of the page that holds content is measured against the container.
  // A run of slices (500px or more) whose content hugs the container's left edge and leaves more than 15% of the viewport empty on the right fails.
  const sy = scrollY, STRIP = 100;
  // A sticky sidebar stays in view while its column scrolls, so it counts for the whole height of its grid row.
  const rects = leaves.map(x => {
    let t = x.r.top + sy, b = x.r.bottom + sy;
    for (let e = x.el; e && e !== main; e = e.parentElement) {
      if (getComputedStyle(e).position === 'sticky' && e.parentElement) { const pr = e.parentElement.getBoundingClientRect(); b = Math.max(b, pr.bottom + sy); t = Math.min(t, e.getBoundingClientRect().top + sy); break; }
    }
    return { l: x.r.left, r: x.r.right, t, b };
  });
  const maxY = Math.max(...rects.map(x => x.b));
  const cLeft = cr.left, cRight = cr.right;
  const strips = [];
  for (let y = 0; y < maxY; y += STRIP) {
    const hit = rects.filter(x => x.t < y + STRIP && x.b > y);
    if (!hit.length) { strips.push(null); continue; }
    const l = Math.min(...hit.map(x => x.l)), r = Math.max(...hit.map(x => x.r));
    strips.push({ l, r, bad: (cRight - r) > vw * 0.15 && (l - cLeft) < vw * 0.04 });
  }
  const badSecs = [];
  let run = null;
  const closeRun = (end) => { if (run && (end - run.start) >= 500) badSecs.push({ cls: 'strip', who: rects.filter(x => x.t < end && x.b > run.start).slice(0, 6).map(x => `${Math.round(x.l)}-${Math.round(x.r)}@${Math.round(x.t)}-${Math.round(x.b)}`).join(' '), top: run.start, h: end - run.start, rightEmpty: Math.round(run.minEmpty), leftGap: 0 }); run = null; };
  strips.forEach((st, i) => {
    const y = i * STRIP;
    if (st === null) return;
    if (st.bad) { if (!run) run = { start: y, minEmpty: 1e9 }; run.minEmpty = Math.min(run.minEmpty, cRight - st.r); }
    else closeRun(y);
  });
  closeRun(strips.length * STRIP);
  const caps = [...main.querySelectorAll('*')].filter(e => !skip(e)).map(e => ({ e, mw: getComputedStyle(e).maxWidth })).filter(x => x.mw.endsWith('px') && parseFloat(x.mw) >= 560 && parseFloat(x.mw) < 1200 && x.e.getBoundingClientRect().width > 400)
    .map(x => x.mw).filter((v, i, a) => a.indexOf(v) === i);
  const leftSp = L, rightSp = vw - R;
  const centred = Math.abs(cr.left - (vw - cr.right)) <= 2;
  const pageFail = !centred;
  const overflow = document.documentElement.scrollWidth - vw;
  const ctrRight = cr.right;
  return { vw, L: Math.round(L), R: Math.round(R), leftPct: +(leftSp / vw * 100).toFixed(1), rightPct: +(rightSp / vw * 100).toFixed(1), cL: Math.round(cr.left), cR: Math.round(ctrRight), pageFail, badSecs, caps, overflow };
}

const br = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const rs = await routes();
const results = [];
const SHOT_SET = new Set((argOf('shot-paths') || '/journal/a-hippos-day-and-night').split(','));
// One browser context per width, all widths run in parallel (each walks the whole route list).
async function runWidth(wl) {
  const [w0, h0] = String(wl).split('x').map(Number); const w = wl;
  const ctx = await br.newContext({ viewport: { width: w0, height: h0 || HEIGHT[w0] || 900 }, reducedMotion: 'reduce', hasTouch: w0 <= 900, isMobile: w0 <= 480 });
  const page = await ctx.newPage();
  for (const p of rs) {
    try {
      let resp = null;
      for (let t = 0; t < 3 && !resp; t++) { try { resp = await page.goto(base + p, { waitUntil: 'load', timeout: 45000 }); } catch (e) { if (t === 2) throw e; await new Promise(r => setTimeout(r, 1500)); } }
      await page.waitForTimeout(150);
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 900) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(25); }
      await page.waitForTimeout(250);
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(100);
      const m = await page.evaluate(measure);
      const broken = await page.evaluate(async () => {
        const bad = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc && !i.currentSrc.endsWith('.svg'));
        const out = [];
        for (const i of bad) { try { const r = await fetch(i.currentSrc, { cache: 'reload' }); if (!r.ok) out.push(i.currentSrc.slice(-60)); } catch { out.push(i.currentSrc.slice(-60)); } }
        return out;
      });
      const fail = m.err ? !!(resp && resp.status() < 400) : (m.pageFail || m.badSecs.length > 0 || m.overflow > 0 || broken.length > 0);
      results.push({ w, path: p, tmpl: tmpl(p), status: resp && resp.status(), ...m, broken, fail });
      if (SHOTS && (process.env.SHOT_ALL || SHOT_SET.has(p))) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, `${p.replace(/\//g, '_') || '_home'}-${w}.png`), fullPage: true }); }
    } catch (e) { results.push({ w, path: p, tmpl: tmpl(p), err: String(e).replace(/\s+/g, " ").slice(0, 80), fail: true }); }
  }
  await ctx.close();
}
await Promise.all(WIDTHS.map(runWidth));
await br.close();
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(results, null, 1));
console.log('width  pages  failing');
for (const w of WIDTHS) { const rr = results.filter(r => r.w === w); console.log(String(w).padEnd(6), String(rr.length).padEnd(6), rr.filter(r => r.fail).length); }
const failing = results.filter(r => r.fail);
const byT = {};
for (const r of failing) (byT[r.tmpl] ||= []).push(r);
console.log('\nFailing templates (width: reason)');
for (const [t, arr] of Object.entries(byT)) {
  const why = arr.slice(0, 4).map(r => `${r.w}:${r.err ? r.err : [r.pageFail && `container not centred (L${r.cL} R${r.cR})`, r.badSecs?.length && `${r.badSecs.length} left aligned run at y${r.badSecs[0].top} h${r.badSecs[0].h} empty ${r.badSecs[0].rightEmpty}px`, r.overflow > 0 && `overflow ${r.overflow}`, r.broken?.length && 'broken img'].filter(Boolean).join(' ')}`).join(' | ');
  console.log(`${t} x${arr.length}  ${why}`);
}
console.log(`\nTOTAL failing: ${failing.length} of ${results.length}`);
if (!NO_REPORT && !ONLY) {
  // Gate report for scripts/mobile-qa/run-all.mjs (same folder and shape as the other gates).
  const outDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../strategy/gates/mobile');
  const date = new Date().toISOString().slice(0, 10), sfx = TAG ? '-' + TAG : '';
  fs.mkdirSync(outDir, { recursive: true });
  const overall = failing.length ? 'FAIL' : 'PASS';
  fs.writeFileSync(path.join(outDir, `width-${date}${sfx}.json`), JSON.stringify({ overall, base, counts: { failing: failing.length, pages: results.length }, failing: failing.map(r => ({ w: r.w, path: r.path, why: r.err || (r.badSecs && r.badSecs[0]) || (r.overflow > 0 && 'overflow') || (r.broken && r.broken[0]) || 'not centred' })) }, null, 1));
  fs.writeFileSync(path.join(outDir, `width-${date}${sfx}.md`), `# Width gate ${date}${sfx}\n\nBase: ${base}. Overall: **${overall}**. Failing: ${failing.length} of ${results.length} page and width runs.\n\n` + Object.entries(byT).map(([t, a]) => `- ${t}: ${a.length}`).join('\n') + '\n');
}
process.exit(failing.length ? 1 : 0);
