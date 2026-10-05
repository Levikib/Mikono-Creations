// Checks new journal batch files: compiles the TS, then tests the real data.
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const files = process.argv.slice(2);
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "posts-"));
const DASH = /[–—]/;
const SLOP = /\b(delve|tapestry|journey|seamless|elevate|unleash|unlock|embrace|game-?changer|in today's|it'?s important to note|more than just|crafted with passion|treasure trove|embark)\b/i;
const strings = (v, out = []) => { if (typeof v === "string") out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out)); return out; };
let problems = 0;
const allSentences = new Map();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const out = path.join(tmp, path.basename(f).replace(/\.ts$/, ".mjs"));
  fs.writeFileSync(out, js);
  let mod; try { mod = await import(pathToFileURL(out).href); } catch (e) { console.log(f, "IMPORT FAIL", e.message.slice(0, 120)); problems++; continue; }
  const posts = mod.default ?? Object.values(mod).find(Array.isArray) ?? [];
  console.log(`\n${path.basename(f)}: ${posts.length} posts`);
  for (const p of posts) {
    const body = strings(p.body ?? p.blocks ?? p.sections ?? []);
    const text = body.join(" ");
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    const long = sentences.filter((s) => s.split(/\s+/).length > 28).length;
    const avg = Math.round(words / Math.max(1, sentences.length));
    const imgs = (p.images ?? []).length;
    const issues = [];
    if (words < 400 || words > 800) issues.push(`words ${words}`);
    if (p.title && p.title.length > 60) issues.push(`title ${p.title.length}`);
    if (p.description && p.description.length > 150) issues.push(`desc ${p.description.length}`);
    if (strings(p).some((s) => DASH.test(s))) issues.push("dash");
    const sl = text.match(SLOP); if (sl) issues.push("slop:" + sl[0]);
    if (avg > 20) issues.push(`avg sentence ${avg}`);
    if (long > 3) issues.push(`${long} long sentences`);
    if (imgs !== 4) issues.push(`images ${imgs}`);
    for (const s of sentences) { const k = s.toLowerCase().trim(); if (k.length > 40) { if (allSentences.has(k) && allSentences.get(k) !== p.slug) issues.push("repeat:" + k.slice(0, 40)); allSentences.set(k, p.slug); } }
    if (issues.length) problems++;
    console.log(`${issues.length ? "FIX " : "ok  "} ${p.slug} | ${words}w avg ${avg} | ${issues.join("; ")}`);
  }
}
console.log(problems ? `\n${problems} posts need fixes` : "\nall posts pass");
fs.rmSync(tmp, { recursive: true, force: true });
