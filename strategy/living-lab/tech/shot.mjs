import { createRequire } from "node:module"; import path from "node:path";
const { chromium } = createRequire(import.meta.url)("/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core");
const b = await chromium.launch({ executablePath: path.join(process.env.HOME, ".cache/ms-playwright/chromium-1243/chrome-linux64/chrome"), args: ["--no-sandbox"] });
const c = await b.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
for (const v of ["css","js"]) { const p = await c.newPage(); const errs=[]; p.on("pageerror",e=>errs.push(e.message)); await p.goto(`http://localhost:8765/poc.html?variant=${v}`); await p.waitForTimeout(500); await p.evaluate(()=>scrollTo({top:1500,behavior:"instant"})); await p.waitForTimeout(1200); await p.screenshot({path:`/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/poc-${v}.png`}); console.log(v, errs, await p.evaluate(()=>document.documentElement.scrollHeight)); }
await b.close();
