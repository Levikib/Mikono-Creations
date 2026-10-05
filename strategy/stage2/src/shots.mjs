import { createRequire } from 'node:module';
const require = createRequire('/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/');
const { chromium } = require('playwright-core');
const P = '/home/shannara/mikono-creations/strategy/stage2/preview/';
const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => console.log('ERR', e.message)); p.on('console', (m) => m.type()==='error' && console.log('CON', m.text()));
  await p.goto('http://localhost:8765/strategy/stage2/preview/index.html');
  await p.waitForSelector('body[data-ready]');
  for (const t of [0.3, 2.5, 6]) {
    await p.waitForTimeout(t === 0.3 ? 300 : t === 2.5 ? 2200 : 3500);
    await p.screenshot({ path: P + `hero-${tag}-t${t}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 900) } });
  }
  await p.evaluate(() => scrollTo(0, 1000)); await p.waitForTimeout(900);
  await p.screenshot({ path: P + `anims-${tag}.png` });
  await p.evaluate(() => scrollTo(0, 1900)); await p.waitForTimeout(900);
  await p.screenshot({ path: P + `lane-${tag}.png` });
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(900);
  await p.screenshot({ path: P + `yarn-${tag}.png` });
  await p.close();
}
await b.close();
