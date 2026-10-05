// Render every public/fx/cast2/*.svg to preview PNGs and build cast2-sheet.png (usage: node render.mjs [filter])
import { createRequire } from 'node:module';
import { readdirSync, writeFileSync } from 'node:fs';
const require = createRequire('/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/');
const { chromium } = require('playwright-core');
const root = '/home/shannara/mikono-creations/';
const dir = root + 'public/fx/cast2/', prev = root + 'strategy/stage2/cast2/preview/';
const filt = process.argv[2]; const fl = filt ? filt.split(',') : null;
const files = readdirSync(dir).filter((n) => n.endsWith('.svg') && (!fl || fl.some((x) => n.includes(x)))).sort();
const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1300, height: 800 }, deviceScaleFactor: 1 });
const cols = 6, cell = 210;
const cells = files.map((n) => `<figure><img src="file://${dir}${n}"><figcaption>${n.replace('.svg', '')}</figcaption></figure>`).join('');
const html = `<body style="margin:0;background:#F3EEE5;font:12px sans-serif"><div style="display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:8px;padding:12px">${cells}</div><style>figure{margin:0;background:#FBF8F2;border-radius:18px;padding:4px;text-align:center}img{width:${cell - 10}px;height:${cell - 10}px}</style>`;
writeFileSync(prev + '_sheet.html', html);
await p.goto('file://' + prev + '_sheet.html'); await p.waitForTimeout(400);
await p.screenshot({ path: prev + (filt ? 'sheet-' + filt : 'cast2-sheet') + '.png', fullPage: true });
if (!filt) for (const n of files) {
  await p.setViewportSize({ width: 400, height: 400 });
  writeFileSync(prev + "_one.html", `<body style="margin:0;background:transparent"><img src="file://${dir}${n}" style="width:400px;height:400px">`); await p.goto("file://" + prev + "_one.html");
  await p.waitForTimeout(60);
  await p.screenshot({ path: prev + n.replace('.svg', '.png'), omitBackground: true });
}
await b.close();
console.log(files.length, 'rendered');
