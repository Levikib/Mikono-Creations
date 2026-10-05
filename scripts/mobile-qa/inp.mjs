#!/usr/bin/env node
// Speed regression guard. Runs routes.mjs (LCP, TBT, JS, bytes per route) and inp.mjs (INP per interaction) and exits 1 on any budget breach.
// Plan: copy this folder's routes.mjs, inp.mjs and guard.mjs to scripts/mobile-qa/speed-*.mjs (keep names) and add "speed" to run-all.mjs JOBS
// ({ script: "speed-guard.mjs", args: [BASE, ...], json: `speed-${DATE}.json` }). Timing numbers need a solo run (see perf.mjs warning).
// Usage: node strategy/speed/guard.mjs [baseUrl] [--runs=3] [--quick] [--tag=name] [--only=/,/shop]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const BASE = (a.find((x) => /^https?:/.test(x)) || "https://mikono-creations.vercel.app").replace(/\/$/, "");
const QUICK = a.includes("--quick");
const RUNS = QUICK ? 1 : +((a.find((x) => x.startsWith("--runs=")) || "--runs=3").split("=")[1]);
const TAG = (a.find((x) => x.startsWith("--tag=")) || "--tag=guard").split("=")[1];
const only = a.find((x) => x.startsWith("--only="));
// Budgets (Slow 4G, CPU 4x, 360x740 dpr 2.6, medians). Targets are the owner's; "interim" lets the lead ratchet down per phase.
const B = {
  lcp: +(process.env.B_LCP || 1800), tbt: +(process.env.B_TBT || 300), jsKb: +(process.env.B_JS || 150), cls: 0.1,
  totalKb: +(process.env.B_TOTAL || 1500), inpMax: 200, inpTarget: 100, hydrGap: +(process.env.B_HYDR || 1500), reqs: 100,
};
const HAS_PFX = fs.existsSync(path.join(here, "speed-routes.mjs"));
const out = (n) => path.join(here, `${n}-${TAG}.json`);
const run = (script, args) => spawnSync(process.execPath, [path.join(here, script), BASE, ...args], { stdio: ["ignore", "inherit", "inherit"] });
run(HAS_PFX?"speed-routes.mjs":"routes.mjs", [`--runs=${RUNS}`, `--out=${out("routes")}`, ...(only ? [only] : [])]);
run(HAS_PFX?"speed-inp.mjs":"inp.mjs", [`--runs=${RUNS}`, `--out=${out("inp")}`]);
const fails = [], warns = [];
const routes = fs.existsSync(out("routes")) ? JSON.parse(fs.readFileSync(out("routes"), "utf8")).out : {};
for (const [p, v] of Object.entries(routes)) {
  const c = v.cold; if (!c) continue;
  const chk = (name, val, max, hard = true) => { if (val != null && val > max) (hard ? fails : warns).push(`${p} ${name} ${Math.round(val * 100) / 100} > ${max}`); };
  chk("LCP", c.lcp, B.lcp); chk("TBT", c.tbt, B.tbt); chk("JS KB gzip/br", c.jsKb, B.jsKb); chk("CLS", c.cls, B.cls);
  chk("total KB", c.totalKb, B.totalKb); chk("hydration gap ms", c.hydrGap, B.hydrGap, false); chk("requests", c.reqs, B.reqs, false);
}
const inp = fs.existsSync(out("inp")) ? JSON.parse(fs.readFileSync(out("inp")).toString()).res : {};
const vals = [];
for (const [k, v] of Object.entries(inp)) {
  if (v.inp == null) { warns.push(`INP ${k} skipped: ${v.skipped}`); continue; }
  vals.push(v.inp);
  if (v.inp > B.inpMax) fails.push(`INP ${k} ${Math.round(v.inp)} ms > ${B.inpMax}`);
  else if (v.inp > B.inpTarget) warns.push(`INP ${k} ${Math.round(v.inp)} ms > target ${B.inpTarget}`);
}
if (vals.length) { const s = [...vals].sort((x, y) => x - y); const p75 = s[Math.min(s.length - 1, Math.ceil(s.length * 0.75) - 1)]; if (p75 > B.inpTarget) fails.push(`INP p75 over scenarios ${Math.round(p75)} ms > ${B.inpTarget}`); }
console.log(fails.length ? "\nSPEED GUARD: FAIL" : "\nSPEED GUARD: PASS");
for (const f of fails) console.log("  FAIL", f);
for (const w of warns) console.log("  warn", w);
// Report for run-all.mjs (only when installed in scripts/mobile-qa).
if (HAS_PFX) {
  const root = path.resolve(here, "../..");
  const dir = path.join(root, "strategy/gates/mobile"); fs.mkdirSync(dir, { recursive: true });
  const date = new Date().toISOString().slice(0, 10), sfx = a.find((x) => x.startsWith("--tag=")) ? "-" + TAG : "";
  const overall = fails.length ? "FAIL" : "PASS";
  fs.writeFileSync(path.join(dir, `inp-${date}${sfx}.json`), JSON.stringify({ overall, counts: { critical: 0, high: fails.length, medium: warns.length, low: 0 }, fails, warns, budgets: B, routes, inp }, null, 1));
  fs.writeFileSync(path.join(dir, `inp-${date}${sfx}.md`), `# Speed gate (INP, LCP, TBT, JS) ${date}\n\nBase ${BASE}. Overall **${overall}**\n\n## Failures\n${fails.map((f) => "- " + f).join("\n") || "none"}\n\n## Warnings\n${warns.map((f) => "- " + f).join("\n") || "none"}\n`);
}
process.exit(fails.length ? 1 : 0);
