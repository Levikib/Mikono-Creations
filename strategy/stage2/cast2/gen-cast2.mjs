// Generator for the cast2 sprites. Output: public/fx/cast2/<name>.svg  (run: node gen-cast2.mjs)
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '../../../public/fx/cast2');
mkdirSync(OUT, { recursive: true });
const mods = ['cats', 'birds', 'hoofed', 'small', 'props'];
let total = 0, n = 0;
for (const m of mods) {
  let mod; try { mod = await import(pathToFileURL(join(here, 'parts', m + '.mjs')).href); } catch (e) { if (e.code === 'ERR_MODULE_NOT_FOUND') continue; throw e; }
  for (const [name, fn] of Object.entries(mod.sprites)) {
    const svg = fn().replace(/\s+/g, ' ').replace(/> </g, '><');
    writeFileSync(join(OUT, name + '.svg'), svg);
    total += svg.length; n++;
    console.log(name.padEnd(22), svg.length, svg.length > 6000 ? 'OVER 6KB' : '');
  }
}
console.log(n, 'files', (total / 1024).toFixed(1), 'KB');
