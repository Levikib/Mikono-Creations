import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '../..');
const cast = {}; for (const f of fs.readdirSync(path.join(root, 'public/fx/cast'))) cast[f.replace('.svg', '')] = fs.readFileSync(path.join(root, 'public/fx/cast', f), 'utf8');
// cast2 sprites, if drawn already, are merged by name
const c2 = path.join(root, 'public/fx/cast2'); if (fs.existsSync(c2)) for (const f of fs.readdirSync(c2)) if (f.endsWith('.svg')) cast[f.replace('.svg', '')] = fs.readFileSync(path.join(c2, f), 'utf8');
const css = fs.readFileSync(path.join(root, 'components/fx/fx.css'), 'utf8') + fs.readFileSync(path.join(here, 'lab.css'), 'utf8') + fs.readFileSync(path.join(here, 'thread.css'), 'utf8') + fs.readFileSync(path.join(here, 'lab-extra.css'), 'utf8');
const js = 'window.__SPRITES=' + JSON.stringify(cast) + ';\n' + fs.readFileSync(path.join(here, 'lab.js'), 'utf8') + '\n' + fs.readFileSync(path.join(here, 'thread.js'), 'utf8');
for (const f of fs.readdirSync(here).filter(f => f.endsWith('.src.html'))) {
  const out = fs.readFileSync(path.join(here, f), 'utf8').replace('<!--@css-->', () => css).replace('<!--@js-->', () => js);
  fs.writeFileSync(path.join(here, f.replace('.src.html', '.html')), out); console.log('built', f, (out.length / 1024).toFixed(0) + 'KB');
}
