// Animation cost probe. Usage: node probe.mjs <url> [--cpu=4] [--fx=full|lite|off] [--label=x] [--scroll=3000] [--noSplash]
// Measures getAnimations(), frame deltas while scrolling, long tasks, layer count, JS heap.
import { createRequire } from "node:module";
import path from "node:path";
const PW = process.env.PLAYWRIGHT_CORE || "/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core";
const { chromium } = createRequire(import.meta.url)(PW);
const CHROME = process.env.CHROME_PATH || path.join(process.env.HOME, ".cache/ms-playwright/chromium-1243/chrome-linux64/chrome");
const a = process.argv.slice(2);
const url = a.find((x) => /^(https?|file):/.test(x));
const opt = (n, d) => (a.find((x) => x.startsWith(`--${n}=`)) || `--${n}=${d}`).split("=")[1];
const CPU = Number(opt("cpu", 4)), FX = opt("fx", "none"), SCROLL = Number(opt("scroll", 3000)), LABEL = opt("label", "");
const UA = "Mozilla/5.0 (Linux; Android 12; Infinix X669) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pct = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null; };
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true, userAgent: UA });
if (FX !== "none") await ctx.addInitScript((v) => { try { localStorage.setItem("mk-fx", v); } catch {} }, FX);
await ctx.addInitScript(() => { window.__lt = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push({ s: e.startTime, d: e.duration }))).observe({ type: "longtask", buffered: true }); } catch {} });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
await cdp.send("Performance.enable");
let layers = 0; cdp.on("LayerTree.layerTreeDidChange", (e) => { if (e.layers) layers = e.layers.length; });
await page.goto(url, { waitUntil: "load" });
await sleep(Number(opt("settle", 5000)));
await cdp.send("DOM.enable"); await cdp.send("LayerTree.enable"); await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" })); await sleep(500);
const anims = await page.evaluate(() => {
  const all = document.getAnimations();
  const vh = innerHeight;
  const isOff = (an) => { const t = an.effect && an.effect.target; if (!t || !t.getBoundingClientRect) return false; const r = t.getBoundingClientRect(); return r.bottom < -120 || r.top > vh + 120; };
  const infinite = all.filter((x) => { try { return x.effect.getComputedTiming().iterations === Infinity; } catch { return false; } });
  const running = all.filter((x) => x.playState === "running");
  return { total: all.length, running: running.length, infinite: infinite.length, runningOffscreen: running.filter(isOff).length, targets: new Set(all.map((x) => x.effect && x.effect.target)).size, fxChars: document.querySelectorAll(".fx-char").length, svgNodes: document.querySelectorAll("svg *").length, domNodes: document.getElementsByTagName("*").length, dataFx: document.documentElement.getAttribute("data-fx"), docH: document.documentElement.scrollHeight };
});
const m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
const t0 = Date.now();
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
const res = await page.evaluate((SC) => new Promise((resolve) => {
  const lt0 = window.__lt.length, fr = []; let last = performance.now(), y = 0; const max = Math.min(SC, document.documentElement.scrollHeight - innerHeight);
  const f = (t) => { fr.push(t - last); last = t; y += 25; window.scrollTo({ top: y, behavior: "instant" }); if (y < max) requestAnimationFrame(f); else setTimeout(() => resolve({ fr, lt: window.__lt.slice(lt0), y: scrollY }), 200); };
  requestAnimationFrame(f);
}), SCROLL);
const m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
const fr = res.fr.slice(1);
const out = {
  label: LABEL, url, cpu: CPU, fx: FX, anims,
  scroll: { px: Math.round(res.y), ms: Date.now() - t0, frames: fr.length, avgFrameMs: +(fr.reduce((x, y) => x + y, 0) / fr.length).toFixed(1), p50: +pct(fr, 0.5).toFixed(1), p95: +pct(fr, 0.95).toFixed(1), p99: +pct(fr, 0.99).toFixed(1), over33: fr.filter((x) => x > 33).length, over50: fr.filter((x) => x > 50).length },
  longTasksDuringScroll: res.lt.length, longTaskMs: Math.round(res.lt.reduce((s, x) => s + x.d, 0)),
  layers, heapMB: +(m1.JSHeapUsedSize / 1048576).toFixed(1), nodes: m1.Nodes, layoutCount: m1.LayoutCount - m0.LayoutCount, recalcStyle: m1.RecalcStyleCount - m0.RecalcStyleCount,
  taskDurationS: +(m1.TaskDuration - m0.TaskDuration).toFixed(3), scriptS: +(m1.ScriptDuration - m0.ScriptDuration).toFixed(3), layoutS: +(m1.LayoutDuration - m0.LayoutDuration).toFixed(3), styleS: +(m1.RecalcStyleDuration - m0.RecalcStyleDuration).toFixed(3),
};
console.log(JSON.stringify(out));
await browser.close();
