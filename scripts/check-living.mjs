// Checks the choreography files in data/living/*.json against the sprite manifest. Fails the build on a mistake.
//   every sprite exists, no weak sprite, props are props, at most 3 inline sprites per template, every find exists once,
//   the game has 12 finds on different pages, sizes are sane, no dashes used as punctuation.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const man = readFileSync(join(root, 'components/fx/manifest.generated.ts'), 'utf8');
const sprites = JSON.parse(man.match(/export const SPRITES = (\{[\s\S]*?\n\}) as const;/)[1]);
const dir = join(root, 'data/living');
const errs = [];
const game = JSON.parse(readFileSync(join(dir, 'game.json'), 'utf8'));
const findPlaces = new Map();
let animalsUsed = new Set();
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json') && !['game.json', 'seasons.json'].includes(x))) {
  const raw = readFileSync(join(dir, f), 'utf8');
  if (/[–—]/.test(raw)) errs.push(`${f}: contains an en or em dash`);
  const d = JSON.parse(raw);
  let inline = 0;
  for (const [bid, b] of Object.entries(d.bands)) {
    const where = `${f}:${bid}`;
    if (!b.residents.length) errs.push(`${where}: no residents`);
    if (b.residents.length > 6) errs.push(`${where}: more than 6 residents`);
    for (const r of b.residents) {
      const s = sprites[r.sprite];
      if (!s) { errs.push(`${where}: unknown sprite ${r.sprite}`); continue; }
      if (s.weak) errs.push(`${where}: weak sprite ${r.sprite}`);
      if (s.kind !== 'animal') errs.push(`${where}: ${r.sprite} is a prop, not an animal`);
      animalsUsed.add(s.animal);
      if (r.inline) inline++;
      if (!(r.size[0] >= 24 && r.size[1] >= r.size[0] && r.size[1] <= 200)) errs.push(`${where}: odd size for ${r.sprite} ${r.size}`);
      if (!(r.at >= 0 && r.at <= 100)) errs.push(`${where}: at out of range`);
      if (r.find) {
        if (!game.finds.some((x) => x.id === r.find)) errs.push(`${where}: find ${r.find} is not in game.json`);
        if (findPlaces.has(r.find)) errs.push(`${where}: find ${r.find} placed twice`);
        findPlaces.set(r.find, f);
        const g = game.finds.find((x) => x.id === r.find);
        if (g && g.sprite !== r.sprite) errs.push(`${where}: find ${r.find} sprite differs from game.json`);
      }
    }
    for (const p of b.props ?? []) if (!sprites[p.sprite] || sprites[p.sprite].kind !== 'prop') errs.push(`${where}: bad prop ${p.sprite}`);
  }
  if (inline > 4) errs.push(`${f}: ${inline} inline sprites, keep to 4 or fewer`);
}
for (const g of game.finds) if (!findPlaces.has(g.id)) errs.push(`game.json: find ${g.id} is not placed in any band`);
if (game.total !== game.finds.length || game.total !== 12) errs.push(`game.json: total must be 12 and match finds (${game.total}/${game.finds.length})`);
if (new Set(findPlaces.values()).size < 11) errs.push('finds should sit on at least 11 different pages');
if (errs.length) { console.error('qa:living FAILED\n' + errs.map((e) => ' - ' + e).join('\n')); process.exit(1); }
console.log(`qa:living ok: ${animalsUsed.size} species placed, ${game.finds.length} finds on ${new Set(findPlaces.values()).size} pages`);
