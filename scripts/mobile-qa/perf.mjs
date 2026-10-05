#!/usr/bin/env node
// Mobile performance gate for Mikono Creations.
// Usage: node scripts/mobile-qa/perf.mjs [baseUrl] [--quick] [--only=/shop,/story] [--runs=3] [--tag=name]
//   --tag  suffix for report names (perf-DATE-TAG.md/json) so concurrent runs never collide.
// TIMING WARNING: this gate measures LCP, TBT, long tasks and scroll frame times under CPU and network throttling. Running it in parallel with
// other browser jobs (layout, interactions) steals CPU and INFLATES every timing number. Byte counts (JS, images, requests) are unaffected.
// Use run-all.mjs --perf-solo to run perf alone after the parallel gates, and trust timing only from a solo run. MQA_PARALLEL=1 marks a parallel run in the report.
// Output: strategy/gates/mobile/perf-<date>.md and .json
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const PW = process.env.PLAYWRIGHT_CORE ||
  "/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core";
const { chromium } = createRequire(import.meta.url)(PW);
const CHROME = process.env.CHROME_PATH || path.join(process.env.HOME, ".cache/ms-playwright/chromium-1243/chrome-linux64/chrome");

const args = process.argv.slice(2);
const flag = (n) => args.find((a) => a.startsWith(`--${n}`));
const BASE = (args.find((a) => /^https?:/.test(a)) || "https://mikono-creations.vercel.app").replace(/\/$/, "");
const QUICK = !!flag("quick");
const RUNS = Number((flag("runs") || "--runs=3").split("=")[1]);
const ONLY = flag("only") ? flag("only").split("=")[1].split(",") : null;
const DATE = new Date().toISOString().slice(0, 10);
const TAG = (flag("tag") || "--tag=").split("=")[1] || process.env.MQA_TAG || "";
const TSFX = TAG ? "-" + TAG : "";
const PARALLEL = process.env.MQA_PARALLEL === "1";
const OUT = path.join(root, "strategy/gates/mobile");
const ORIGIN_HOST = new URL(BASE).host;

const DPR = 2.625;
const VIEW = { width: 360, height: 740 };
const UA = "Mozilla/5.0 (Linux; Android 12; Infinix X669) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const NET = {
  slow4g: { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 },
  fast3g: { offline: false, latency: 562.5, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 },
  none: { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 },
};
const BUDGET = { lcp: 2500, cls: 0.1, tbt: 300, jsKb: 200, totalKb: 1500, heroKb: 120, frameP95: 33.4 };

const log = (...a) => console.error("[perf]", ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => { const s = a.filter((x) => x != null && !Number.isNaN(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
const kb = (b) => (b == null ? "n/a" : (b / 1024).toFixed(1) + " KB");

async function discoverPages() {
  let post = "/journal/what-mikono-means";
  try {
    const t = await (await fetch(BASE + "/sitemap.xml")).text();
    const m = t.match(/<loc>[^<]*?(\/journal\/[^<]+)<\/loc>/);
    if (m) post = m[1];
  } catch {}
  const all = ["/", "/shop", "/shop/safari-animals", "/shop/domestic-animals", "/shop/more-animals", "/shop/wall-art", "/shop/dolls", "/shop/giraffe", "/shop/lion", "/journal", "/gifts", "/stockists", "/makers", post, "/story", "/custom", "/cart", "/order", "/gallery"];
  return ONLY ? all.filter((p) => ONLY.includes(p)) : all;
}

const INIT = `(() => {
  const q = (window.__q = { lcp: null, cls: 0, lt: [], fcp: null, ev: [], raf: 0, rafOn: false, hydr: null, splashSeen: null, splashGone: null });
  const po = (type, cb, extra = {}) => { try { new PerformanceObserver((l) => l.getEntries().forEach(cb)).observe({ type, buffered: true, ...extra }); } catch {} };
  po('largest-contentful-paint', (e) => { q.lcp = { t: e.startTime, size: e.size, url: e.url, tag: e.element && e.element.tagName, cls: e.element && (e.element.className && e.element.className.toString().slice(0, 60)) }; });
  let win = 0, winStart = 0, last = 0, maxWin = 0;
  po('layout-shift', (e) => { if (e.hadRecentInput) return; if (e.startTime - last > 1000 || e.startTime - winStart > 5000) { win = 0; winStart = e.startTime; } win += e.value; last = e.startTime; if (win > maxWin) maxWin = win; q.cls = maxWin; });
  po('longtask', (e) => q.lt.push({ s: e.startTime, d: e.duration }));
  po('paint', (e) => { if (e.name === 'first-contentful-paint') q.fcp = e.startTime; });
  po('event', (e) => q.ev.push({ n: e.name, d: e.duration, s: e.startTime, i: e.processingStart - e.startTime }), { durationThreshold: 16 });
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { if (q.rafOn) q.raf++; return raf(cb); };
  const iv = setInterval(() => {
    const b = document.body; if (!b) return;
    if (q.hydr == null) { for (const el of b.querySelectorAll('button,a,input')) { if (Object.keys(el).some((k) => k.startsWith('__reactProps'))) { q.hydr = performance.now(); break; } } }
    const sp = document.getElementById("sp");
    const vis = sp && sp.getBoundingClientRect().width > 0 && getComputedStyle(sp).visibility !== 'hidden' && getComputedStyle(sp).opacity !== '0';
    if (vis && q.splashSeen == null) q.splashSeen = performance.now();
    if (!vis && q.splashSeen != null && q.splashGone == null) q.splashGone = performance.now();
  }, 50);
  setTimeout(() => clearInterval(iv), 20000);
})();`;

const LAUNCH = { executablePath: CHROME, args: ["--no-sandbox", "--enable-precise-memory-info", "--disable-dev-shm-usage"] };
async function newCtx(browser, opts = {}) {
  const root0 = browser; if (root0.__cur) browser = root0.__cur;
  if (!browser.isConnected()) { log("browser died, relaunching"); browser = await chromium.launch(LAUNCH); root0.__cur = browser; }
  const ctx = await browser.newContext({
    viewport: VIEW, deviceScaleFactor: DPR, isMobile: true, hasTouch: true, userAgent: UA,
    reducedMotion: opts.reducedMotion || "no-preference",
    extraHTTPHeaders: opts.saveData ? { "Save-Data": "on" } : undefined,
    serviceWorkers: "allow",
  });
  await ctx.addInitScript(INIT);
  if (opts.saveData) await ctx.addInitScript(`Object.defineProperty(navigator,'connection',{get:()=>({saveData:true,effectiveType:'3g',downlink:1.6,rtt:300,addEventListener(){},removeEventListener(){}})});`);
  return ctx;
}

async function setupPage(ctx, net, cpu) {
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Performance.enable");
  await cdp.send("Network.emulateNetworkConditions", NET[net]);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  const net_ = { reqs: new Map() };
  cdp.on("Network.requestWillBeSent", (e) => { if (e.request.url.startsWith("data:")) return; net_.reqs.set(e.requestId, { url: e.request.url, type: e.type, t0: e.timestamp, enc: 0, dec: 0, headers: {}, status: 0, cache: false }); });
  cdp.on("Network.responseReceived", (e) => { const r = net_.reqs.get(e.requestId); if (!r) return; r.type = e.type; r.status = e.response.status; r.headers = Object.fromEntries(Object.entries(e.response.headers).map(([k, v]) => [k.toLowerCase(), v])); r.cache = !!(e.response.fromDiskCache || e.response.fromPrefetchCache); r.mime = e.response.mimeType; });
  cdp.on("Network.dataReceived", (e) => { const r = net_.reqs.get(e.requestId); if (r) r.dec += e.dataLength; });
  cdp.on("Network.loadingFinished", (e) => { const r = net_.reqs.get(e.requestId); if (r) r.enc = e.encodedDataLength; });
  return { page, cdp, net: net_ };
}

const IMG_EVAL = `(() => {
  const dpr = devicePixelRatio, vh = innerHeight;
  return [...document.images].map((i) => {
    const r = i.getBoundingClientRect(); let w = null;
    try { w = +new URL(i.currentSrc).searchParams.get('w') || null; } catch {}
    return { src: i.currentSrc, cssW: r.width, cssH: r.height, w, nat: i.naturalWidth, loading: i.loading, fp: i.fetchPriority, top: r.top + scrollY, inView: r.top < vh && r.bottom > 0, srcset: !!i.srcset, complete: i.complete, dpr };
  });
})()`;

const PAGE_EVAL = `(() => {
  const q = window.__q; const nav = performance.getEntriesByType('navigation')[0] || {};
  const pre = [...document.querySelectorAll('link[rel=preload],link[rel=modulepreload]')].map((l) => ({ as: l.as, href: l.href, srcset: l.getAttribute('imagesrcset'), fp: l.getAttribute('fetchpriority') }));
  const anims = document.getAnimations();
  const vh = innerHeight, vw = innerWidth;
  const off = (a) => { const t = a.effect && a.effect.target; if (!t || !t.getBoundingClientRect) return false; const r = t.getBoundingClientRect(); return r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw || r.width === 0; };
  const running = anims.filter((a) => a.playState === 'running');
  const inf = running.filter((a) => { try { return a.effect.getComputedTiming().iterations === Infinity; } catch { return false; } });
  const htmlEl = document.documentElement;
  return {
    q: { lcp: q.lcp, cls: q.cls, lt: q.lt, fcp: q.fcp, ev: q.ev, hydr: q.hydr, splashSeen: q.splashSeen, splashGone: q.splashGone },
    nav: { ttfb: nav.responseStart, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd, transfer: nav.transferSize, decoded: nav.decodedBodySize, enc: nav.encodedBodySize },
    pre, anim: { total: anims.length, running: running.length, offscreenRunning: running.filter(off).length, infinite: inf.length, infiniteOffscreen: inf.filter(off).length },
    videos: [...document.querySelectorAll('video')].map((v) => ({ autoplay: v.autoplay, paused: v.paused, preload: v.preload })),
    htmlAttrs: { cls: htmlEl.className.slice(0, 120), data: Object.fromEntries([...htmlEl.attributes].filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value])) },
    nodes: document.getElementsByTagName('*').length,
    docH: document.documentElement.scrollHeight,
    scripts: [...document.scripts].filter((s) => s.src).length,
  };
})()`;

const group = (url) => {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/_next/image")) return "nextimage";
    if (u.pathname.startsWith("/_next/static")) return "nextstatic";
    if (u.pathname.startsWith("/media")) return "media";
  } catch {}
  return "other";
};
const innerUrl = (u) => { try { const x = new URL(u, BASE); return x.pathname.startsWith("/_next/image") ? x.searchParams.get("url") : x.pathname; } catch { return u; } };
const maxAge = (cc) => { const m = /(?:s-)?max-age=(\d+)/.exec(cc || ""); return m ? Number(m[1]) : 0; };

async function measure(page, cdp, net, url, { reload = false, scroll = false } = {}) {
  net.reqs.clear();
  const t3 = (async () => { await sleep(3000); return (await cdp.send("Performance.getMetrics")).metrics; })();
  const base0 = (await cdp.send("Performance.getMetrics")).metrics;
  const start = Date.now();
  let err = null;
  try {
    if (reload) await page.reload({ waitUntil: "load", timeout: 90000 });
    else await page.goto(url, { waitUntil: "load", timeout: 90000 });
  } catch (e) { err = String(e.message || e).slice(0, 160); }
  const m3 = await t3;
  await sleep(3500);
  // second 2 s idle window: count rAF callbacks while nothing is happening
  await page.evaluate(() => { window.__q.raf = 0; window.__q.rafOn = true; });
  await sleep(2000);
  const d = await page.evaluate(PAGE_EVAL);
  d.rafIdle = await page.evaluate(() => { window.__q.rafOn = false; return window.__q.raf; });
  d.imgs = await page.evaluate(IMG_EVAL);
  const mm = (arr) => Object.fromEntries(arr.map((x) => [x.name, x.value]));
  const a = mm(base0), b = mm(m3);
  d.main3s = { script: r1(((b.ScriptDuration || 0) - (a.ScriptDuration || 0)) * 1000), layout: r1(((b.LayoutDuration || 0) - (a.LayoutDuration || 0)) * 1000), style: r1(((b.RecalcStyleDuration || 0) - (a.RecalcStyleDuration || 0)) * 1000), task: r1(((b.TaskDuration || 0) - (a.TaskDuration || 0)) * 1000) };
  // network summary
  const rs = [...net.reqs.values()].filter((r) => r.status || r.enc);
  const sum = (f) => rs.filter(f).reduce((s, r) => s + r.enc, 0);
  d.net = {
    requests: rs.length, bytes: sum(() => true),
    js: sum((r) => r.type === "Script"), css: sum((r) => r.type === "Stylesheet"), img: sum((r) => r.type === "Image"), font: sum((r) => r.type === "Font"), doc: sum((r) => r.type === "Document"),
    thirdParty: rs.filter((r) => { try { return new URL(r.url).host !== ORIGIN_HOST; } catch { return false; } }).map((r) => r.url),
    top5: [...rs].sort((x, y) => y.enc - x.enc).slice(0, 5).map((r) => ({ url: r.url.replace(BASE, ""), type: r.type, kb: r1(r.enc / 1024), enc: r.headers["content-encoding"] || "none" })),
    htmlDecoded: rs.find((r) => r.type === "Document")?.dec ?? null,
    htmlEnc: rs.find((r) => r.type === "Document")?.enc ?? null,
    headers: rs.map((r) => ({ g: group(r.url), type: r.type, cc: r.headers["cache-control"] || "", ce: r.headers["content-encoding"] || "", url: r.url.replace(BASE, ""), enc: r.enc, fromCache: r.cache, mime: r.mime })),
    byUrl: Object.fromEntries(rs.map((r) => [r.url, r.enc])),
  };
  d.err = err; d.wall = Date.now() - start;
  // tap probe: tap the first visible button, record event timing
  try {
    const box = await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => { const r = x.getBoundingClientRect(); return r.width > 20 && r.top > 0 && r.bottom < innerHeight; }); if (!b) return null; const r = b.getBoundingClientRect(); window.__q.ev.length = 0; return { x: r.left + r.width / 2, y: r.top + r.height / 2, label: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 30) }; });
    if (box) {
      await page.touchscreen.tap(box.x, box.y); await sleep(700);
      const ev = await page.evaluate(() => window.__q.ev);
      d.tap = { label: box.label, maxEventMs: ev.length ? Math.max(...ev.map((e) => e.d)) : 0, events: ev.length };
    }
  } catch {}
  if (scroll) {
    await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
    d.scroll = await page.evaluate(() => new Promise((res) => {
      const dl = []; let last = performance.now(), y = 0; const max = Math.min(3000, document.documentElement.scrollHeight - innerHeight);
      const f = (t) => { dl.push(t - last); last = t; y += 25; window.scrollTo(0, y); if (y < max) requestAnimationFrame(f); else res({ dist: Math.round(y), frames: dl.length, dl }); };
      requestAnimationFrame(f);
    }));
    const dl = d.scroll.dl.slice(1); delete d.scroll.dl; dl.sort((a, b) => a - b);
    d.scroll = { dist: d.scroll.dist, avgFps: r1(1000 / (dl.reduce((s, x) => s + x, 0) / dl.length)), p95Ms: r1(dl[Math.floor(dl.length * 0.95)]), jankFrames: dl.filter((x) => x > 50).length, frames: dl.length };
  }
  return d;
}

function derive(d) {
  const fcp = d.q.fcp ?? 0;
  const lts = d.q.lt.filter((t) => t.s + t.d > fcp);
  const tbt = lts.reduce((s, t) => s + Math.max(0, t.d - 50), 0);
  const lcpUrl = d.q.lcp?.url || "";
  const lcpBytes = lcpUrl ? d.net.byUrl[lcpUrl] ?? null : null;
  const lcpInner = lcpUrl ? innerUrl(lcpUrl) : null;
  const preloaded = !!lcpUrl && (d.pre.some((p) => p.as === "image" && ((p.href && innerUrl(p.href) === lcpInner) || (p.srcset && p.srcset.includes(encodeURIComponent(lcpInner || "@@")))) ) || d.imgs.some((i) => i.src === lcpUrl && i.fp === "high"));
  const imgs = d.imgs.filter((i) => i.src && !i.src.startsWith("data:") && i.cssW > 0);
  const over = imgs.map((i) => { const sel = i.w || i.nat; const need = i.cssW * i.dpr; const ratio = need ? sel / need : 0; const bytes = d.net.byUrl[i.src] || 0; return { src: innerUrl(i.src), selW: sel, needW: Math.round(need), ratio: r1(ratio), bytes, wasteBytes: ratio > 1.5 ? Math.round(bytes * (1 - 1 / (ratio * ratio))) : 0 }; });
  const lazyBad = d.imgs.filter((i) => i.inView && i.loading === "lazy" && i.src !== lcpUrl).length + d.imgs.filter((i) => i.inView && i.loading === "lazy" && i.src === lcpUrl).length;
  const eagerBelow = d.imgs.filter((i) => i.loading !== "lazy" && i.top > 2 * 740 && i.cssW > 0).length;
  const hero = lcpBytes;
  const hydrGap = d.q.hydr != null && d.q.fcp != null ? d.q.hydr - d.q.fcp : null;
  const maxEv = Math.max(0, ...d.q.ev.map((e) => e.d));
  return {
    lcp: d.q.lcp?.t ?? null, lcpSize: d.q.lcp?.size ?? null, lcpEl: d.q.lcp ? `${d.q.lcp.tag}${lcpUrl ? " " + lcpInner : ""}` : null,
    cls: d.q.cls, fcp: d.q.fcp, ttfb: d.nav.ttfb, tbt: Math.round(tbt), longTasks: lts.length, maxLongTask: Math.round(Math.max(0, ...lts.map((t) => t.d))), inpProxy: Math.max(maxEv, d.tap?.maxEventMs || 0),
    bytes: d.net.bytes, requests: d.net.requests, js: d.net.js, css: d.net.css, img: d.net.img, font: d.net.font, htmlEnc: d.net.htmlEnc, htmlDecoded: d.net.htmlDecoded,
    thirdParty: d.net.thirdParty, heroBytes: hero, lcpPreloaded: preloaded, over, oversize: over.filter((o) => o.ratio > 1.5), lazyBad, eagerBelow,
    hydrGap, splash: d.q.splashSeen != null ? { seen: r1(d.q.splashSeen), gone: d.q.splashGone != null ? r1(d.q.splashGone) : null } : null,
    main3s: d.main3s, anim: d.anim, rafIdle: d.rafIdle, tap: d.tap || null, scroll: d.scroll || null, top5: d.net.top5, headers: d.net.headers, videos: d.videos, nodes: d.nodes, err: d.err,
  };
}

async function pageRuns(browser, p, net, cpu, runs, extra = {}) {
  const out = [];
  for (let i = 0; i < runs; i++) {
    const ctx = await newCtx(browser);
    const { page, cdp, net: n } = await setupPage(ctx, net, cpu);
    try { const d = await measure(page, cdp, n, BASE + p, { scroll: !!extra.scroll }); out.push(derive(d)); }
    catch (e) { out.push({ err: String(e.message).slice(0, 160) }); }
    await ctx.close();
  }
  return out;
}
const pick = (runs) => { const ok = runs.filter((r) => r.lcp != null); if (!ok.length) return runs[0] || {}; const m = median(ok.map((r) => r.lcp)); return ok.sort((a, b) => Math.abs(a.lcp - m) - Math.abs(b.lcp - m))[0]; };
const med = (runs, k) => median(runs.map((r) => r[k]));

function gradePage(p, rep, m) {
  const fails = [];
  if (m.lcp == null || m.lcp > BUDGET.lcp) fails.push(`LCP ${m.lcp == null ? "n/a" : Math.round(m.lcp)} ms`);
  if (m.cls > BUDGET.cls) fails.push(`CLS ${m.cls.toFixed(3)}`);
  if (m.tbt > BUDGET.tbt) fails.push(`TBT ${Math.round(m.tbt)} ms`);
  if (m.js > BUDGET.jsKb * 1024) fails.push(`JS ${kb(m.js)}`);
  if (m.bytes > BUDGET.totalKb * 1024) fails.push(`weight ${kb(m.bytes)}`);
  if (rep.heroBytes != null && rep.heroBytes > BUDGET.heroKb * 1024 && rep.lcpEl?.startsWith("IMG")) fails.push(`hero ${kb(rep.heroBytes)}`);
  if (m.scrollP95 != null && m.scrollP95 > BUDGET.frameP95) fails.push(`scroll frame p95 ${m.scrollP95} ms`);
  if (rep.thirdParty?.length) fails.push(`${rep.thirdParty.length} third-party req before consent`);
  return { pass: fails.length === 0, fails };
}

// ---------- special tests ----------
async function testReducedAndSaveData(browser) {
  const res = {};
  for (const [name, o] of [["normal", {}], ["reducedMotion", { reducedMotion: "reduce" }], ["saveData", { saveData: true }], ["both", { reducedMotion: "reduce", saveData: true }]]) {
    const ctx = await newCtx(browser, o); const { page, cdp, net } = await setupPage(ctx, "slow4g", 4);
    try { res[name] = derive(await measure(page, cdp, net, BASE + "/", {})); const raw = await page.evaluate(() => ({ attrs: { cls: document.documentElement.className.slice(0, 100), data: Object.fromEntries([...document.documentElement.attributes].filter((a) => a.name.startsWith("data-")).map((a) => [a.name, a.value])) }, mq: matchMedia("(prefers-reduced-motion: reduce)").matches })); res[name].raw = raw; } catch (e) { res[name] = { err: String(e.message) }; }
    await ctx.close();
  }
  return res;
}

async function testMemory(browser, seconds) {
  const ctx = await newCtx(browser); const { page, cdp } = await setupPage(ctx, "none", 4);
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 90000 }); await sleep(3000);
  const heap = async () => { await cdp.send("HeapProfiler.collectGarbage"); const h = await cdp.send("Runtime.getHeapUsage"); const m = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value])); return { mb: r1(h.usedSize / 1048576), nodes: m.Nodes, listeners: m.JSEventListeners }; };
  const samples = [{ t: 0, ...(await heap()) }];
  const routes = ["/shop", "/shop/giraffe", "/journal", "/story", "/gallery", "/"];
  const t0 = Date.now(); let i = 0, navs = 0, lastSample = t0;
  while (Date.now() - t0 < seconds * 1000) {
    await page.evaluate(async () => { for (let y = 0; y < 1500; y += 100) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
    const href = routes[i++ % routes.length];
    const ok = await page.evaluate((h) => { const a = [...document.querySelectorAll("a")].find((x) => x.getAttribute("href") === h); if (a) { a.click(); return true; } return false; }, href);
    if (!ok) { await page.goto(BASE + href, { waitUntil: "load", timeout: 60000 }).catch(() => {}); }
    navs++; await sleep(1200);
    if (Date.now() - lastSample > 10000) { samples.push({ t: Math.round((Date.now() - t0) / 1000), ...(await heap()) }); lastSample = Date.now(); }
  }
  samples.push({ t: Math.round((Date.now() - t0) / 1000), ...(await heap()) });
  await ctx.close();
  const a = samples[0], z = samples[samples.length - 1];
  return { navs, samples, growthMb: r1(z.mb - a.mb), nodeGrowth: z.nodes - a.nodes, listenerGrowth: z.listeners - a.listeners };
}

async function testOffline(browser) {
  const res = { steps: [] };
  const ctx = await newCtx(browser); const { page } = await setupPage(ctx, "none", 1);
  await page.goto(BASE + "/order", { waitUntil: "load", timeout: 60000 }); await sleep(2500);
  const sw = await page.evaluate(async () => (navigator.serviceWorker ? (await navigator.serviceWorker.getRegistrations()).length : -1));
  res.serviceWorkers = sw;
  const fields = await page.$$("input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea");
  let typed = null;
  for (const f of fields) { if (await f.isVisible()) { await f.fill("QA Draft Name"); typed = await f.evaluate((e) => e.name || e.id || e.type); break; } }
  await sleep(1500);
  const draft = () => page.evaluate(() => { const k = Object.keys(localStorage).filter((x) => x.startsWith("mk.")); return Object.fromEntries(k.map((x) => [x, (localStorage.getItem(x) || "").slice(0, 80)])); });
  res.fieldTyped = typed; res.storageBefore = await draft();
  await ctx.setOffline(true);
  // client side navigation while offline
  const clicked = await page.evaluate(() => { const a = [...document.querySelectorAll("a")].find((x) => x.getAttribute("href") === "/shop"); if (a) { a.click(); return true; } return false; });
  await sleep(2500);
  res.clientNavOffline = { clicked, url: page.url(), textLen: await page.evaluate(() => document.body.innerText.length), snippet: await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 140)) };
  await page.screenshot({ path: path.join(OUT, `offline-clientnav-${DATE}${TSFX}.png`) }).catch(() => {});
  let reloadErr = null;
  try { await page.goto(BASE + "/order", { timeout: 15000 }); } catch (e) { reloadErr = String(e.message).split("\n")[0].slice(0, 100); }
  res.reloadOffline = { error: reloadErr, textLen: await page.evaluate(() => document.body?.innerText.length ?? 0).catch(() => 0), snippet: await page.evaluate(() => document.body?.innerText.replace(/\s+/g, " ").slice(0, 140)).catch(() => "") };
  await ctx.setOffline(false);
  await page.goto(BASE + "/order", { waitUntil: "load", timeout: 60000 }); await sleep(2500);
  res.storageAfter = await draft();
  res.fieldRestored = await page.evaluate(() => [...document.querySelectorAll("input,textarea")].some((e) => e.value === "QA Draft Name"));
  await ctx.close();
  return res;
}

// ---------- ranking ----------
function winRank(pages, special) {
  const W = []; const msOf = (b) => (b / 200000) * 1000;
  const reps = pages.map((p) => ({ p: p.path, ...p.rep }));
  const sum = (f) => reps.reduce((s, r) => s + (f(r) || 0), 0);
  const avg = (f) => sum(f) / Math.max(1, reps.length);
  const waste = sum((r) => (r.oversize || []).reduce((s, o) => s + o.wasteBytes, 0));
  if (waste > 0) W.push({ title: "Serve images at the right width", save: `${kb(waste)} across routes, about ${Math.round(msOf(waste / reps.length))} ms per page`, ms: msOf(waste / reps.length), fix: "Tighten the sizes attribute on every next/image to the real CSS width (for example 50vw on two-column grids) and trim images.deviceSizes and imageSizes so the chosen srcset width is within 1.5x of CSS width times dpr." });
  const heroOver = reps.filter((r) => r.heroBytes > BUDGET.heroKb * 1024 && r.lcpEl?.startsWith("IMG"));
  if (heroOver.length) { const s = heroOver.reduce((a, r) => a + r.heroBytes - BUDGET.heroKb * 1024, 0) / heroOver.length; W.push({ title: "Cut hero and LCP image weight to 120 KB", save: `${kb(s)} on ${heroOver.length} routes, about ${Math.round(msOf(s))} ms of LCP`, ms: msOf(s) + 100, fix: "Lower the quality for hero images (quality 60 to 70, AVIF first in images.formats), set a mobile width cap, and pre-crop source art so the largest srcset step is not needed on a 360 px phone." }); }
  const notPre = reps.filter((r) => r.lcpEl?.startsWith("IMG") && !r.lcpPreloaded);
  if (notPre.length) W.push({ title: "Preload or prioritise the LCP image", save: `about 300 to 700 ms LCP on ${notPre.length} routes (${notPre.map((r) => r.p).join(", ")})`, ms: 500, fix: "Add priority (fetchPriority high, preload) to the first above-the-fold next/image on those routes and make sure it is not wrapped in a client-only component or hidden behind the splash." });
  const jsOver = reps.filter((r) => r.js > BUDGET.jsKb * 1024);
  if (jsOver.length) { const s = jsOver.reduce((a, r) => a + r.js - BUDGET.jsKb * 1024, 0) / jsOver.length; W.push({ title: "Bring route JS under 200 KB gzip", save: `${kb(s)} on ${jsOver.length} routes, about ${Math.round(msOf(s))} ms download plus parse`, ms: msOf(s) * 1.5, fix: "Run next build with the bundle analyzer, lazy load the cart, wizard, splash, mega menu and consent code with next/dynamic after first paint, and drop unused libraries." }); }
  const tbtHigh = reps.filter((r) => r.tbt > BUDGET.tbt);
  if (tbtHigh.length) { const s = avg((r) => r.tbt) - BUDGET.tbt; W.push({ title: "Reduce main-thread blocking (TBT)", save: `${Math.round(avg((r) => r.tbt))} ms average TBT at 4x CPU on ${tbtHigh.length} routes`, ms: Math.max(s, 0) + 150, fix: "Defer splash, animation and analytics scripts to requestIdleCallback, split long hydration with Suspense boundaries, avoid animating layout properties, and use CSS transform and opacity only." }); }
  const cc = {}; for (const r of reps) for (const h of r.headers || []) { if (h.g !== "other") (cc[h.g] ||= []).push(maxAge(h.cc)); }
  const bad = [];
  if (cc.media?.some((a) => a < 31536000)) bad.push("/media");
  if (cc.nextstatic?.some((a) => a < 31536000)) bad.push("/_next/static");
  if (cc.nextimage?.length && Math.min(...cc.nextimage) < 86400) bad.push("/_next/image");
  if (bad.length) W.push({ title: "Long immutable caching for static assets", save: `repeat visits: near zero bytes instead of re-downloads (${bad.join(", ")})`, ms: 600, fix: "Add headers() in next.config.ts: Cache-Control public, max-age=31536000, immutable for /media/:path*; set images.minimumCacheTTL to at least 31536000 for fingerprinted catalogue images." });
  const tp = reps.filter((r) => r.thirdParty?.length);
  if (tp.length) W.push({ title: "Remove third-party requests before consent", save: `${tp.length} routes load ${tp[0].thirdParty.length}+ third-party requests with no consent`, ms: 400, fix: "Load GTM, Meta and TikTok tags only after Accept is stored; keep Consent Mode defaults denied without loading the tag." });
  const eb = sum((r) => r.eagerBelow), lb = sum((r) => r.lazyBad);
  if (eb + lb > 0) W.push({ title: "Fix lazy loading", save: `${eb} eager images below the fold and ${lb} lazy images in the first viewport`, ms: 250, fix: "Remove priority from images past the first screen; ensure only the LCP image is eager; give grid cards loading lazy." });
  const fo = avg((r) => r.font);
  if (fo > 60 * 1024) W.push({ title: "Trim font payload", save: `${kb(fo)} average font bytes`, ms: msOf(fo - 40 * 1024), fix: "Subset to Latin, limit weights, use next/font with display swap and preload only the body weight." });
  const reqs = avg((r) => r.requests); if (reqs > 45) W.push({ title: "Reduce request count", save: `${Math.round(reqs)} requests average`, ms: 200, fix: "Lazy load below-fold images and sections, merge small chunks, avoid eager prefetch of every card link on slow networks." });
  const hy = avg((r) => r.hydrGap); if (hy > 800) W.push({ title: "Shorten hydration gap", save: `${Math.round(hy)} ms average between FCP and interactive`, ms: hy * 0.4, fix: "Keep above-fold UI as server components, move interactivity to small client islands, and hydrate the splash and mega menu lazily." });
  const bigHtml = reps.filter((r) => r.htmlDecoded > 150 * 1024); if (bigHtml.length) W.push({ title: "Shrink HTML payload", save: `${bigHtml.length} routes above 150 KB decoded HTML`, ms: 150, fix: "Paginate or lazy render long grids, trim RSC payload props (pass ids not full objects) on listing pages." });
  if (special.offline?.serviceWorkers === 0) W.push({ title: "Add an offline fallback", save: "no white or browser error screen when data drops", ms: 100, fix: "Register a small service worker that caches the app shell, an /offline page and the last visited product pages; keep the order draft in localStorage (already mk.draft.v1)." });
  if (special.memory?.growthMb > 10) W.push({ title: "Fix memory growth in scroll and navigate loop", save: `${special.memory.growthMb} MB growth in 60 s`, ms: 150, fix: "Clean up observers, listeners and rAF loops in effects; check splash and mega menu for leaks." });
  return W.sort((a, b) => b.ms - a.ms).slice(0, 10);
}

// ---------- main ----------
async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const pages = await discoverPages();
  log("base", BASE, "pages", pages.length, "runs", RUNS, QUICK ? "(quick)" : "");
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox", "--enable-precise-memory-info", "--disable-dev-shm-usage"] });
  const results = [];
  for (const p of pages) {
    log("slow4g/4x cold", p);
    const runs = await pageRuns(browser, p, "slow4g", 4, RUNS, { scroll: true });
    const rep = pick(runs);
    const m = { lcp: med(runs, "lcp"), cls: med(runs, "cls"), tbt: med(runs, "tbt"), fcp: med(runs, "fcp"), ttfb: med(runs, "ttfb"), bytes: med(runs, "bytes"), js: med(runs, "js"), img: med(runs, "img"), font: med(runs, "font"), requests: med(runs, "requests"), inp: med(runs, "inpProxy"), hydr: med(runs, "hydrGap"), scrollP95: median(runs.map((r) => r.scroll?.p95Ms)), scrollFps: median(runs.map((r) => r.scroll?.avgFps)), scrollJank: median(runs.map((r) => r.scroll?.jankFrames)), scrollDist: median(runs.map((r) => r.scroll?.dist)) };
    const entry = { path: p, runs: runs.map((r) => ({ lcp: r.lcp, cls: r.cls, tbt: r.tbt, bytes: r.bytes })), m, rep, grade: gradePage(p, rep, m) };
    if (!QUICK) {
      log("warm", p);
      const ctx = await newCtx(browser); const { page, cdp, net } = await setupPage(ctx, "slow4g", 4);
      try { await measure(page, cdp, net, BASE + p); const w = derive(await measure(page, cdp, net, BASE + p, { reload: true })); entry.warm = { lcp: w.lcp, bytes: w.bytes, requests: w.requests, fcp: w.fcp }; } catch (e) { entry.warm = { err: String(e.message).slice(0, 100) }; }
      await ctx.close();
      if (p === "/" || p === "/shop") {
        log("fast3g", p); const r3 = await pageRuns(browser, p, "fast3g", 4, 1); entry.fast3g = { lcp: r3[0].lcp, fcp: r3[0].fcp, bytes: r3[0].bytes };
        log("cpu6", p); const r6 = await pageRuns(browser, p, "slow4g", 6, 1); entry.cpu6 = { lcp: r6[0].lcp, tbt: r6[0].tbt, longTasks: r6[0].longTasks };
      }
    }
    results.push(entry);
  }
  const special = {};
  if (!ONLY) {
    log("reduced motion and save-data"); special.modes = await testReducedAndSaveData(browser);
    log("offline"); try { special.offline = await testOffline(browser); } catch (e) { special.offline = { error: String(e.message).slice(0, 200) }; }
    log("memory 60s"); try { special.memory = await testMemory(browser, QUICK ? 20 : 60); } catch (e) { special.memory = { error: String(e.message).slice(0, 200) }; }
  }
  await browser.close();
  const wins = winRank(results, special);
  const overall = results.every((r) => r.grade.pass) ? "PASS" : "FAIL";
  const json = { date: DATE, base: BASE, parallelRun: PARALLEL, timingNote: PARALLEL ? "Run in parallel with other gates: timing numbers are inflated. Re-run solo (run-all.mjs --perf-solo) before judging LCP, TBT or scroll frame p95." : "Solo run.", budgets: BUDGET, profile: "360x740 dpr 2.625, Slow 4G 1.6 Mbps 150 ms RTT, CPU 4x, cold cache", overall, results, special, wins };
  fs.writeFileSync(path.join(OUT, `perf-${DATE}${TSFX}.json`), JSON.stringify(json, null, 1));
  fs.writeFileSync(path.join(OUT, `perf-${DATE}${TSFX}.md`), render(json).replace(/[\u2013\u2014]/g, "-"));
  console.log(`${overall} -> ${path.join("strategy/gates/mobile", `perf-${DATE}${TSFX}.md`)}`);
  for (const r of results) console.log(`${r.grade.pass ? "PASS" : "FAIL"} ${r.path} LCP ${Math.round(r.m.lcp)} CLS ${r.m.cls?.toFixed(3)} TBT ${r.m.tbt} ${kb(r.m.bytes)} JS ${kb(r.m.js)}`);
}

function render(j) {
  const L = []; const f = (x, d = 0) => (x == null ? "n/a" : Number(x).toFixed(d));
  L.push(`# Mobile performance gate ${j.date}`, "", j.parallelRun ? "> WARNING: this run shared the machine with other gates. LCP, TBT, long tasks and scroll frame times are inflated. Bytes and request counts are valid. Re-run solo with run-all.mjs --perf-solo for timing." : "> Solo run: timing numbers are valid for this machine.", "", `Target: ${j.base}. Profile: ${j.profile}. Median of ${RUNS} runs. Overall: **${j.overall}**`, "", `Budgets: LCP under ${BUDGET.lcp} ms, CLS under ${BUDGET.cls}, TBT under ${BUDGET.tbt} ms, JS under ${BUDGET.jsKb} KB gzip, weight under ${BUDGET.totalKb} KB, hero image under ${BUDGET.heroKb} KB, no third party before consent.`, "");
  L.push("## Per page", "", "| Page | Grade | LCP ms | LCP element | CLS | TBT ms | FCP | TTFB | INP proxy | Bytes | Req | JS | Img | Font | 3rd | Hero |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const r of j.results) L.push(`| ${r.path} | ${r.grade.pass ? "PASS" : "FAIL"} | ${f(r.m.lcp)} | ${r.rep.lcpEl || "n/a"} (${f((r.rep.lcpSize || 0) / 1000)}k px) | ${f(r.m.cls, 3)} | ${f(r.m.tbt)} | ${f(r.m.fcp)} | ${f(r.m.ttfb)} | ${f(r.m.inp)} | ${kb(r.m.bytes)} | ${f(r.m.requests)} | ${kb(r.m.js)} | ${kb(r.m.img)} | ${kb(r.m.font)} | ${r.rep.thirdParty?.length ?? 0} | ${kb(r.rep.heroBytes)} |`);
  L.push("", "### Scroll frame p95 (3000 px programmatic scroll, 25 px per frame, 4x CPU) and JS per route (compressed on the wire)", "", `Frame budget (assumed, not in the original gate): p95 under ${BUDGET.frameP95} ms. JS budget ${BUDGET.jsKb} KB.`, "", "| Page | Scroll distance px | Avg fps | Frame p95 ms | Frames over 50 ms | JS compressed | JS vs 200 KB | Script encodings |", "|---|---|---|---|---|---|---|---|");
  for (const r of j.results) { const enc = [...new Set((r.rep.headers || []).filter((h) => h.type === "Script").map((h) => h.ce || "none"))].join(","); L.push(`| ${r.path} | ${f(r.m.scrollDist)} | ${f(r.m.scrollFps, 1)} | ${f(r.m.scrollP95, 1)} | ${f(r.m.scrollJank)} | ${kb(r.m.js)} | ${r.m.js > BUDGET.jsKb * 1024 ? "OVER by " + kb(r.m.js - BUDGET.jsKb * 1024) : "within"} | ${enc} |`); }
  L.push("", "### Failures", "");
  for (const r of j.results) L.push(`- ${r.path}: ${r.grade.pass ? "none" : r.grade.fails.join("; ")}`);
  L.push("", "### Other conditions", "", "| Page | Warm LCP | Warm bytes | Fast 3G LCP | CPU 6x LCP | CPU 6x TBT |", "|---|---|---|---|---|---|");
  for (const r of j.results) L.push(`| ${r.path} | ${f(r.warm?.lcp)} | ${r.warm?.bytes != null ? kb(r.warm.bytes) : "n/a"} | ${f(r.fast3g?.lcp)} | ${f(r.cpu6?.lcp)} | ${f(r.cpu6?.tbt)} |`);
  L.push("", "### Run spread (LCP ms per run)", "");
  for (const r of j.results) L.push(`- ${r.path}: ${r.runs.map((x) => f(x.lcp)).join(", ")}`);
  L.push("", "## Delivery details (representative run)", "");
  for (const r of j.results) {
    const x = r.rep; L.push(`### ${r.path}`);
    L.push(`- HTML ${kb(x.htmlEnc)} compressed, ${kb(x.htmlDecoded)} decoded. LCP preloaded or fetchpriority high: ${x.lcpPreloaded ? "yes" : "no"}. Lazy errors: ${x.lazyBad} lazy in first view, ${x.eagerBelow} eager far below fold.`);
    L.push(`- Hydration gap FCP to interactive: ${f(x.hydrGap)} ms. Tap probe: ${x.tap ? `${x.tap.label || "button"} ${f(x.tap.maxEventMs)} ms` : "n/a"}. Long tasks: ${x.longTasks}, longest ${x.maxLongTask} ms.`);
    L.push(`- First 3 s main thread: script ${x.main3s?.script} ms, layout ${x.main3s?.layout} ms, style ${x.main3s?.style} ms, total task ${x.main3s?.task} ms. Splash: ${x.splash ? `seen ${x.splash.seen} ms, gone ${x.splash.gone ?? "not gone"}` : "none detected"}.`);
    L.push(`- Animations: ${x.anim?.running} running, ${x.anim?.infinite} infinite, ${x.anim?.offscreenRunning} running offscreen. Idle rAF callbacks in 2 s: ${x.rafIdle}.`);
    L.push(`- Scroll 3000 px at 4x CPU: ${x.scroll ? `${x.scroll.avgFps} fps average, p95 frame ${x.scroll.p95Ms} ms, ${x.scroll.jankFrames} frames over 50 ms (${x.scroll.dist} px)` : "n/a"}.`);
    L.push(`- Oversized images (ratio over 1.5): ${x.oversize?.length ? x.oversize.map((o) => `${o.src} w${o.selW} vs need ${o.needW} (${o.ratio}x, ${kb(o.wasteBytes)} waste)`).join("; ") : "none"}.`);
    const gs = {}; for (const h of x.headers || []) { const g = h.g; (gs[g] ||= new Set()).add(h.cc || "(none)"); }
    L.push(`- Cache-Control: ${Object.entries(gs).filter(([g]) => g !== "other").map(([g, s]) => `${g}: ${[...s].join(" | ")}`).join("; ") || "n/a"}.`);
    const cmp = (x.headers || []).filter((h) => ["Document", "Script", "Stylesheet"].includes(h.type)); L.push(`- Compression: ${[...new Set(cmp.map((h) => `${h.type}:${h.ce || "none"}`))].join(", ")}.`);
    L.push(`- Top 5 resources: ${x.top5.map((t) => `${t.url.slice(0, 70)} ${t.kb} KB`).join("; ")}.`);
    if (x.thirdParty?.length) L.push(`- Third-party before consent: ${x.thirdParty.slice(0, 6).join(", ")}.`);
    L.push("");
  }
  const s = j.special;
  if (s.modes) {
    L.push("## Reduced motion and Save-Data (home, Slow 4G)", "", "| Mode | Bytes | Requests | Img | Running anims | Infinite | Idle rAF | Videos | LCP |", "|---|---|---|---|---|---|---|---|---|");
    for (const [k, v] of Object.entries(s.modes)) L.push(`| ${k} | ${kb(v.bytes)} | ${v.requests} | ${kb(v.img)} | ${v.anim?.running} | ${v.anim?.infinite} | ${v.rafIdle} | ${(v.videos || []).length} (autoplay ${(v.videos || []).filter((x) => x.autoplay).length}) | ${f(v.lcp)} |`);
    L.push("", `Lite mode attributes on html (save-data): ${JSON.stringify(s.modes.saveData?.raw?.attrs)}`, "");
  }
  if (s.memory) { L.push("## Memory, 60 s scroll and navigate loop (4x CPU)", "", s.memory.error ? `Error: ${s.memory.error}` : `Navigations: ${s.memory.navs}. Heap growth ${s.memory.growthMb} MB, DOM node change ${s.memory.nodeGrowth}, listener change ${s.memory.listenerGrowth}.`, "", ...(s.memory.samples || []).map((x) => `- t=${x.t}s heap ${x.mb} MB, nodes ${x.nodes}, listeners ${x.listeners}`), ""); }
  if (s.offline) { const o = s.offline; L.push("## Offline during order", "", "```json", JSON.stringify(o, null, 1), "```", ""); }
  L.push("## Top 10 wins", "");
  j.wins.forEach((w, i) => L.push(`${i + 1}. **${w.title}**. Saves: ${w.save}. Fix: ${w.fix}`));
  L.push("", `Re-run: node scripts/mobile-qa/perf.mjs`);
  return L.join("\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
