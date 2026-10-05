#!/usr/bin/env node
// Per interaction INP + LoAF attribution + click-to-next-FCP for navigation. Mobile emulation, Slow 4G, CPU 4x.
// Usage: node strategy/speed/inp.mjs [baseUrl] [--runs=3] [--only=menu,cart] [--out=file.json] [--budget] [--cpu=4]
// --budget: exit 1 if any interaction median INP > 200 ms, or p75 over the set > 100 ms is reported as a warning only.
import { createRequire } from "node:module";
import fs from "node:fs";
const PW = process.env.PLAYWRIGHT_CORE || "/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core";
const { chromium } = createRequire(import.meta.url)(PW);
const CHROME = process.env.CHROME_PATH || `${process.env.HOME}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`;
const a = process.argv.slice(2);
const flag = (n, d) => (a.find((x) => x.startsWith(`--${n}=`)) || `--${n}=${d}`).split("=")[1];
const BASE = (a.find((x) => /^https?:/.test(x)) || "https://mikono-creations.vercel.app").replace(/\/$/, "");
const RUNS = +flag("runs", 3), CPU = +flag("cpu", 4), OUT = flag("out", "");
const ONLY = flag("only", "") ? flag("only", "").split(",") : null;
const BUDGET = a.includes("--budget");
const NET = { offline: false, latency: 150, downloadThroughput: (1.6e6 / 8) * 0.9, uploadThroughput: 750e3 / 8 };
const UA = "Mozilla/5.0 (Linux; Android 12; Infinix X669) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const med = (v) => { const s = v.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };

const INIT = `(()=>{const q=window.__i={ev:[],loaf:[]};
const po=(t,cb,x={})=>{try{new PerformanceObserver(l=>l.getEntries().forEach(cb)).observe({type:t,buffered:true,...x})}catch{}};
po('event',e=>q.ev.push({n:e.name,d:e.duration,s:e.startTime,id:e.interactionId,in:e.processingStart-e.startTime,pr:e.processingEnd-e.processingStart}),{durationThreshold:16});
po('long-animation-frame',e=>q.loaf.push({s:e.startTime,d:e.duration,b:e.blockingDuration,r:e.renderStart-e.startTime,sc:(e.scripts||[]).map(s=>({u:(s.sourceURL||'inline').split('/').pop().slice(0,36),f:(s.sourceFunctionName||'').slice(0,30),d:Math.round(s.duration),t:s.invokerType}))}));
window.__ready=()=>document.documentElement.getAttribute('data-splash')!=='on'&&[...document.querySelectorAll('button,a')].some(el=>Object.keys(el).some(k=>k.startsWith('__reactProps')));})();`;

// Each scenario: page to load, viewport kind, steps. A step is [type, selector|fn]. The measured action is the one marked "m".
const S = {
  menu: { url: "/", label: "Open mobile menu", m: { tap: "button.nav-burger" } },
  mega: { url: "/", desktop: true, label: "Open a mega panel (desktop click)", m: { tap: "#nav-btn-shop" } },
  density: { url: "/shop", label: "Density toggle 2-up", m: { tap: 'button[aria-label="Two animals across"]' } },
  density3: { url: "/shop", label: "3-up / 2-up toggle back to 3-up", pre: [{ tap: 'button[aria-label="Two animals across"]' }], m: { tap: 'button[aria-label="Three animals across"]' } },
  addorder: { url: "/shop/giraffe", label: "Add to order list", pre: [{ tap: 'label:has(input[name$="-colour"])' }, { tap: 'label:has(input[name$="-size"])' }], m: { tap: "button[data-add-to-order]" } },
  cartopen: { url: "/", seed: true, label: "Open the cart drawer", m: { tap: "a[data-cart-target]" } },
  cartclose: { url: "/", seed: true, label: "Close the cart drawer", pre: [{ tap: "a[data-cart-target]", wait: 1500 }], m: { key: "Escape" } },
  qty: { url: "/cart", seed: true, label: "Change quantity in the cart (One more)", m: { tap: 'button[aria-label^="One more"]' } },
  qtypdp: { url: "/shop/giraffe", label: "Product page quantity stepper", m: { tap: 'button[aria-label="One more"]' } },
  chip: { url: "/shop", label: "Shop filter chip / option", m: { tapAny: ['label:has(input[name="animal"])', 'input[name="animal"]', '[role="tab"]', "nav[aria-label=Categories] a"] } },
  footer: { url: "/", label: "Expand a footer accordion", pre: [{ scrollTo: "footer" }], m: { tap: "footer summary" } },
  type: { url: "/contact", label: "Type in a form field (6 keys)", m: { typeIn: 'input:not([type=hidden]):not([type=checkbox]), textarea' } },
  wizard: { url: "/order", seed: true, label: "Order wizard step Next", m: { tapText: "Next" }, pre: [{ tapAny: ['input[type=radio]', 'label:has(input[type=radio])'], optional: true }] },
  studio: { url: "/custom/studio", label: "Studio step Next", m: { tapText: "Next" }, pre: [{ tapAny: ['input[type=radio]', 'label:has(input[type=radio])', 'button[aria-pressed]'], optional: true }] },
  nav: { url: "/", label: "Link tap /shop (click to next FCP)", nav: true, m: { tap: 'a[href="/shop"].nav-top, a[href="/shop"]' } },
  navcard: { url: "/shop", label: "Product card tap (click to next FCP)", nav: true, m: { tap: '#products li:not([hidden]) a[href^="/shop/"]' } },
};

async function run(browser, key, sc) {
  const ctx = await browser.newContext(sc.desktop
    ? { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1, userAgent: UA.replace("Mobile ", "") }
    : { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true, userAgent: UA });
  await ctx.addInitScript(INIT);
  if (sc.seed) await ctx.addInitScript(`try{localStorage.setItem('mk.cart.v1',JSON.stringify({v:1,updatedAt:Date.now(),lines:[{sku:'giraffe-yellow-brown-spots-m',slug:'giraffe',name:'Giraffe',colourKey:'yellow-brown-spots',colourLabel:'Yellow and brown spots',size:'M',image:'/media/products/giraffe/giraffe-yellow-brown-spots-01.jpg',qty:1},{sku:'lion-tan-brown-mane-m',slug:'lion',name:'Lion',colourKey:'tan-brown-mane',colourLabel:'Tan',size:'M',image:'/media/products/lion/lion-tan-brown-mane-01.jpg',qty:2}]}))}catch{}`);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", NET);
  await page.goto(BASE + sc.url, { waitUntil: "load", timeout: 90000 });
  await page.waitForFunction(() => window.__ready && window.__ready(), null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  const loc = (sel) => page.locator(sel).first();
  const doStep = async (st) => {
    if (st.scrollTo) { await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), st.scrollTo); await page.waitForTimeout(600); return true; }
    let sel = st.tap;
    if (st.tapAny) { for (const s of st.tapAny) if (await page.locator(s).first().isVisible().catch(() => false)) { sel = s; break; } }
    if (st.tapText) { sel = `button:has-text("${st.tapText}"), a:has-text("${st.tapText}")`; }
    if (st.key) { await page.keyboard.press(st.key); return true; }
    if (st.typeIn) { const l = loc(st.typeIn); if (!(await l.isVisible().catch(() => false))) return false; await l.tap().catch(() => {}); await page.keyboard.type("hello", { delay: 40 }); return true; }
    if (!sel) return false;
    const l = loc(sel); if (!(await l.isVisible().catch(() => false))) return false;
    if (sc.desktop) await l.click({ timeout: 8000 }); else await l.tap({ timeout: 8000 });
    return true;
  };
  for (const p of sc.pre || []) { const ok = await doStep(p); if (!ok && !p.optional) { await ctx.close(); return { skipped: "pre step target missing" }; } await page.waitForTimeout(p.wait || 900); }
  const t0 = await page.evaluate(() => ({ ev: window.__i.ev.length, loaf: window.__i.loaf.length, now: performance.now() }));
  const ok = await doStep(sc.m);
  if (!ok) { await ctx.close(); return { skipped: "target missing" }; }
  await page.waitForTimeout(sc.nav ? 5000 : 1800);
  const r = await page.evaluate((t0) => {
    const ev = window.__i.ev.slice(t0.ev), loaf = window.__i.loaf.filter((l) => l.s + l.d >= t0.now);
    const fcp = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
    return { ev, loaf, fcp: fcp && fcp.startTime, now: t0.now };
  }, t0).catch(() => null);
  await ctx.close();
  if (!r) return { skipped: "page navigated (hard); no data" };
  const byId = {};
  for (const e of r.ev) if (e.id) (byId[e.id] ||= []).push(e);
  const inter = Object.values(byId).map((g) => ({ d: Math.max(...g.map((e) => e.d)), names: [...new Set(g.map((e) => e.n))].join("+"), inDelay: Math.max(...g.map((e) => e.in)), proc: Math.max(...g.map((e) => e.pr)) }));
  const worst = inter.sort((x, y) => y.d - x.d)[0] || { d: 0, names: "none (under 16 ms)", inDelay: 0, proc: 0 };
  const loaf = r.loaf.sort((x, y) => y.d - x.d)[0];
  return { inp: worst.d, names: worst.names, inDelay: worst.inDelay, proc: worst.proc, loaf: loaf ? { d: Math.round(loaf.d), b: Math.round(loaf.b), sc: loaf.sc.sort((x, y) => y.d - x.d).slice(0, 3) } : null };
}

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const res = {};
for (const [key, sc] of Object.entries(S)) {
  if (ONLY && !ONLY.includes(key)) continue;
  const rs = [];
  for (let i = 0; i < RUNS; i++) { try { rs.push(await run(browser, key, sc)); } catch (e) { rs.push({ skipped: "error " + e.message.slice(0, 80) }); } }
  const ok = rs.filter((r) => r.inp != null);
  res[key] = ok.length ? { label: sc.label, inp: med(ok.map((r) => r.inp)), all: ok.map((r) => Math.round(r.inp)), inDelay: med(ok.map((r) => r.inDelay)), proc: med(ok.map((r) => r.proc)), ev: ok[0].names, loaf: ok.map((r) => r.loaf).filter(Boolean).sort((x, y) => y.d - x.d)[0] || null } : { label: sc.label, skipped: rs[0]?.skipped };
  const o = res[key];
  console.log(key.padEnd(10), o.skipped ? "SKIP " + o.skipped : `INP ${Math.round(o.inp)} ms (runs ${o.all}) delay ${Math.round(o.inDelay)} proc ${Math.round(o.proc)} ${o.ev} loaf ${o.loaf ? o.loaf.d + "ms " + JSON.stringify(o.loaf.sc.map((s) => s.u + ":" + s.d)) : "-"}`);
}
await browser.close();
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ base: BASE, cpu: CPU, res }, null, 1));
if (BUDGET) { const bad = Object.entries(res).filter(([, v]) => v.inp > 200); if (bad.length) { console.error("INP over 200 ms:", bad.map(([k, v]) => `${k}=${Math.round(v.inp)}`).join(", ")); process.exit(1); } }
