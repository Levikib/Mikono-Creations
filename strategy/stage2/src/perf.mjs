import { createRequire } from 'node:module';
const require = createRequire('/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/');
const { chromium } = require('playwright-core');
const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
async function run(url, w, h, label, mouse) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 500, isMobile: w < 500 });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(url); await p.waitForSelector('body[data-ready]'); await p.waitForTimeout(3500);
  const r = await p.evaluate(async (mouse) => {
    const anims = document.getAnimations().filter((a) => a.playState === 'running');
    const targets = new Set(anims.map((a) => a.effect.target));
    const props = new Set(); anims.forEach((a) => a.effect.getKeyframes().forEach((k) => Object.keys(k).forEach((x) => !['offset','easing','composite','computedOffset'].includes(x) && props.add(x))));
    const times = []; let last = performance.now(); const end = last + 5000;
    await new Promise((res) => { const f = (t) => { times.push(t - last); last = t; if (t < end) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
    times.shift(); times.sort((a, b) => a - b);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    return { running: anims.length, nodes: targets.size, props: [...props].join(','), frames: times.length, avg: +avg.toFixed(1), p95: +times[Math.floor(times.length * 0.95)].toFixed(1), max: +times[times.length - 1].toFixed(1), over33: times.filter((x) => x > 33.4).length };
  }, mouse);
  console.log(label, JSON.stringify(r));
  await ctx.close();
}
const base = 'http://localhost:8765/strategy/stage2/preview/';
await run(base + 'hero-only.html', 390, 844, 'HERO mobile 4x', false);
await run(base + 'hero-only.html', 1440, 900, 'HERO desktop 4x', false);
await run(base + 'index.html', 1440, 900, 'FULL preview page top 4x', false);
await b.close();
