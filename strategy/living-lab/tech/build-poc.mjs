// Generates poc.html (self-contained) from the real cast SVGs. Run: node build-poc.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "../../../public/fx/cast");
const names = readdirSync(dir).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4)).sort();
const svg = {};
for (const n of names) svg[n] = readFileSync(join(dir, n + ".svg"), "utf8").trim().replace(/(id="|href="#|url\(#)(\w+)/g, `$1${n}_$2`);
const tpl = readFileSync(join(here, "poc.template.html"), "utf8");
const out = tpl.replace("/*CAST*/", "const CAST = " + JSON.stringify(svg) + ";");
writeFileSync(join(here, "poc.html"), out);
console.log("poc.html", (out.length / 1024).toFixed(1), "KB", names.length, "characters");
