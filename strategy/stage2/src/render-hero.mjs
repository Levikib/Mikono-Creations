// Transpiles components/fx with the TypeScript compiler and server-renders HeroScene, AmbientCast and YarnPath
// to HTML fragments so the plain preview page shows the real component output.
import ts from '/home/shannara/mikono-creations/node_modules/typescript/lib/typescript.js';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const root = '/home/shannara/mikono-creations/';
const tmp = '/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/fxbuild/';
mkdirSync(tmp, { recursive: true });
for (const f of readdirSync(root + 'components/fx').filter((f) => /\.(ts|tsx)$/.test(f))) {
  let src = readFileSync(root + 'components/fx/' + f, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
    .replace(/from '(\.\/[^']+)'/g, (m, p) => `from '${p}.mjs'`).replace(/\.mjs\.mjs/g, '.mjs');
  writeFileSync(tmp + f.replace(/\.tsx?$/, '.mjs'), out);
}
// react resolution
writeFileSync(tmp + 'package.json', '{"type":"module"}');
const { symlinkSync, existsSync } = await import('node:fs');
if (!existsSync(tmp + 'node_modules')) symlinkSync(root + 'node_modules', tmp + 'node_modules');
const React = (await import(tmp + 'node_modules/react/index.js')).default;
const { renderToStaticMarkup } = await import(tmp + 'node_modules/react-dom/server.node.js');
const { HeroScene } = await import(tmp + 'HeroScene.mjs');
const { AmbientCast } = await import(tmp + 'AmbientCast.mjs');
const { Character } = await import(tmp + 'Character.mjs');
const { YarnPath } = await import(tmp + 'YarnPath.mjs');
const { Confetti } = await import(tmp + 'Confetti.mjs');
const h = React.createElement;
const P = root + 'strategy/stage2/preview/';
const hero = renderToStaticMarkup(h(HeroScene, {}));
writeFileSync(P + 'hero-fragment.html', hero);
writeFileSync(P + 'ambient-fragment.html', renderToStaticMarkup(h(AmbientCast, { page: 'home' })));
writeFileSync(P + 'yarn-fragment.html', renderToStaticMarkup(h(YarnPath, { side: 'left' })));
const chars = ['giraffe','elephant','lion','rhino','zebra','rabbit','hippo','monkey','octopus','turtle','butterfly','yarn'];
writeFileSync(P + 'chars-fragment.html', chars.map((n, i) => renderToStaticMarkup(h(Character, { name: n, size: 120, anim: 'idle', seed: i }))).join('\n'));
console.log('hero markup KB', (hero.length / 1024).toFixed(1), 'svg only KB', (hero.match(/<svg[\s\S]*<\/svg>/)[0].length / 1024).toFixed(1));
