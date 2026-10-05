#!/usr/bin/env node
// Route metrics under mobile emulation: TTFB, FCP, LCP element, TBT, CLS, JS/CSS bytes, requests, hydration gap.
// Usage: node strategy/speed/routes.mjs [baseUrl] [--runs=3] [--only=/,/shop] [--out=file.json] [--cpu=4]
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
const PAGES = ["/", "/shop", "/shop/giraffe", "/journal", "/journal/a-bedtime-safari-story-with-one-animal", "/story", "/custom", "/custom/studio", "/cart", "/order", "/gallery"].filter((p) => !ONLY || ONLY.includes(p));
const NET = { offline: false, latency: 150, downloadThroughput: (1.6e6 / 8) * 0.9, uploadThroughput: 750e3 / 8 };
const UA = "Mozilla/5.0 (Linux; Android 12; Infinix X669) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const med = (v) => { const s = v.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };
const INIT = `(()=>{const q=window.__q={lcp:null,cls:0,lt:[],fcp:null,loaf:[],hydr:null};
const po=(t,cb,x={})=>{try{new PerformanceObserver(l=>l.getEntries().forEach(cb)).observe({type:t,buffered:true,...x})}catch{}};
po('largest-contentful-paint',e=>{q.lcp={t:e.startTime,url:e.url,tag:e.element&&e.element.tagName,cls:e.element&&String(e.element.className||'').slice(0,40)}});
po('layout-shift',e=>{if(!e.hadRecentInput)q.cls+=e.value});
po('longtask',e=>q.lt.push([e.startTime,e.duration]));
po('paint',e=>{if(e.name==='first-contentful-paint')q.fcp=e.startTime});
po('long-animation-frame',e=>q.loaf.push({s:e.startTime,d:e.duration,b:e.blockingDuration,sc:(e.scripts||[]).map(s=>({u:(s.sourceURL||'').split('/').pop().slice(0,40),f:s.sourceFunctionName,d:s.duration,t:s.invokerType}))}));
const iv=setInterval(()=>{if(q.hydr==null){for(const el of document.querySelectorAll('button,a')){if(Object.keys(el).some(k=>k.startsWith('__reactProps'))){q.hydr=performance.now();break}}}},40);setTimeout(()=>clearInterval(iv),20000);})();`;

async function one(browser, path, warm, store) {
  const ctx = store || await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true, userAgent: UA, serviceWorkers: "block" });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", NET);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  if (!warm) await cdp.send("Network.clearBrowserCache");
  const reqs = new Map();
  cdp.on("Network.requestWillBeSent", (e) => reqs.set(e.requestId, { url: e.request.url, type: e.type }));
  cdp.on("Network.responseReceived", (e) => { const r = reqs.get(e.requestId); if (r) { r.type = e.type; r.status = e.response.status; r.fromCache = e.response.fromDiskCache || e.response.fromPrefetchCache; } });
  cdp.on("Network.loadingFinished", (e) => { const r = reqs.get(e.requestId); if (r) r.enc = e.encodedDataLength; });
  await page.goto(BASE + path, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(6000);
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    return { q: window.__q, ttfb: nav.responseStart, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd,
      splash: document.documentElement.getAttribute("data-splash"), fx: document.documentElement.getAttribute("data-fx") };
  });
  const sum = (f) => [...reqs.values()].filter(f).reduce((s, r) => s + (r.enc || 0), 0);
  const fcp = m.q.fcp ?? 0;
  const tbt = m.q.lt.reduce((s, [st, d]) => (st >= fcp ? s + Math.max(0, d - 50) : s), 0);
  const res = { ttfb: m.ttfb, fcp, lcp: m.q.lcp?.t, lcpEl: m.q.lcp ? `${m.q.lcp.tag}:${(m.q.lcp.url || m.q.lcp.cls || "").split("/").pop()}` : null,
    tbt, cls: m.q.cls, hydr: m.q.hydr, hydrGap: m.q.hydr != null ? m.q.hydr - fcp : null,
    jsKb: sum((r) => r.type === "Script") / 1024, cssKb: sum((r) => r.type === "Stylesheet") / 1024, fontKb: sum((r) => r.type === "Font") / 1024,
    imgKb: sum((r) => r.type === "Image") / 1024, htmlKb: sum((r) => r.type === "Document") / 1024, totalKb: sum(() => true) / 1024,
    reqs: reqs.size, loaf: m.q.loaf.sort((x, y) => y.d - x.d).slice(0, 4), splash: m.splash, fx: m.fx };
  await page.close(); if (!store) await ctx.close();
  return res;
}

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const out = {};
for (const p of PAGES) {
  out[p] = {};
  for (const mode of ["cold", "warm"]) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      try {
        if (mode === "cold") runs.push(await one(browser, p, false));
        else { const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true, userAgent: UA, serviceWorkers: "block" });
          await one(browser, p, true, ctx); runs.push(await one(browser, p, true, ctx)); await ctx.close(); }
      } catch (e) { console.error("run failed", p, mode, e.message.slice(0, 100)); }
    }
    const k = (f) => med(runs.map(f));
    out[p][mode] = { n: runs.length, ttfb: k((r) => r.ttfb), fcp: k((r) => r.fcp), lcp: k((r) => r.lcp), tbt: k((r) => r.tbt), cls: k((r) => r.cls), hydrGap: k((r) => r.hydrGap),
      jsKb: k((r) => r.jsKb), cssKb: k((r) => r.cssKb), fontKb: k((r) => r.fontKb), imgKb: k((r) => r.imgKb), htmlKb: k((r) => r.htmlKb), totalKb: k((r) => r.totalKb), reqs: k((r) => r.reqs),
      lcpEl: runs[0]?.lcpEl, splash: runs[0]?.splash, fx: runs[0]?.fx, loaf: runs[0]?.loaf };
    const o = out[p][mode];
    console.log(p.padEnd(18), mode, "ttfb", Math.round(o.ttfb), "fcp", Math.round(o.fcp), "lcp", Math.round(o.lcp), "tbt", Math.round(o.tbt), "cls", o.cls?.toFixed(3), "hyd", Math.round(o.hydrGap ?? -1), "js", o.jsKb?.toFixed(0), "css", o.cssKb?.toFixed(0), "tot", o.totalKb?.toFixed(0), "req", o.reqs, o.lcpEl);
  }
}
await browser.close();
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ base: BASE, cpu: CPU, runs: RUNS, out }, null, 1));
