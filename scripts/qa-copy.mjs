// Copy QA: dash characters, banned phrases, TODO counts. Exits 1 on dash or slop hits.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dirs = ["app", "components", "content", "lib", "data"];
const exts = new Set([".ts", ".tsx", ".md", ".mdx", ".json", ".css", ".js", ".mjs"]);

const dashRe = /[\u2013\u2014]/;
const slop = [
  "elevate", "unleash", "delve", "tapestry", "journey", "seamless", "in today's world",
  "more than just", "crafted with passion", "game-changer", "game changer", "game changing",
  "curated", "bespoke", "cutting-edge", "world-class", "best-in-class", "premium quality",
  "magical", "adorable", "perfect for everyone", "look no further", "take it to the next level",
  "dive into", "embark", "treasure trove", "unlock", "revolutionise", "passionate about",
  "we are proud to", "nestled", "rich heritage", "one-of-a-kind", "hand-picked", "lovingly",
  "child safe", "safe for babies", "choking", "nothing to swallow",
];
const slopRes = slop.map((p) => [p, new RegExp(`\\b${p.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`, "i")]);

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (exts.has(extname(p))) yield p;
  }
}

let bad = 0;
let todos = 0;
const report = [];
for (const d of dirs) {
  for (const file of walk(join(root, d))) {
    const lines = readFileSync(file, "utf8").split("\n");
    let exempt = false;
    lines.forEach((line, i) => {
      if (line.includes("SCAN-EXEMPT-START")) exempt = true;
      if (!exempt) {
        if (dashRe.test(line)) { bad++; report.push(`DASH  ${file.replace(root, "")}:${i + 1}`); }
        for (const [p, re] of slopRes) {
          if (re.test(line)) { bad++; report.push(`SLOP  ${file.replace(root, "")}:${i + 1}  "${p}"`); }
        }
        todos += (line.match(/TODO/g) || []).length;
      }
      if (line.includes("SCAN-EXEMPT-END")) exempt = false;
    });
  }
}
console.log(report.join("\n"));
console.log(`qa:copy hits=${bad} TODO=${todos}`);
process.exit(bad ? 1 : 0);
