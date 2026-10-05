#!/usr/bin/env node
// Runs the mobile QA gates (layout, interactions, width, perf) against one base URL and prints a combined summary.
//
// Usage:
//   node scripts/mobile-qa/run-all.mjs [baseUrl] [--pages quick|all] [--perf-solo] [--dry] [--skip layout,interactions,perf] [--tag name] [--timeout-min 45]
//
//   (default)    layout, interactions and perf start together, in parallel. MQA_PARALLEL=1 is set so perf stamps its report:
//                parallel runs steal CPU and INFLATE every timing number (LCP, TBT, long tasks, scroll frame p95). Bytes and JS size stay valid.
//   --perf-solo  layout and interactions run in parallel first; perf runs ALONE afterwards, so its timing numbers are trustworthy. Use this for sign-off.
//   --dry        one page, one device, one scenario each (smoke test of the scripts, about 2 to 4 minutes). Reports get the tag "dry".
//   --tag        suffix for all report names and screenshot folders, so two runner invocations never overwrite each other.
//
// Collision safety: each gate writes its own files (layout-DATE, interactions-DATE, perf-DATE, with the optional tag), its own screenshot folder
// and uses its own Chromium process (no fixed ports, no shared temp files). The runner writes summary-DATE[-tag].md and .json.
// Exit code: 0 when all gates PASS, 1 otherwise.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const ARGV = process.argv.slice(2);
const argOf = (n, d = null) => { const i = ARGV.indexOf("--" + n); if (i >= 0) return ARGV[i + 1]; const e = ARGV.find((a) => a.startsWith("--" + n + "=")); return e ? e.split("=")[1] : d; };
const BASE = (ARGV.find((a) => /^https?:/.test(a)) || "https://mikono-creations.vercel.app").replace(/\/$/, "");
const DRY = ARGV.includes("--dry");
const SOLO = ARGV.includes("--perf-solo");
const PAGES = argOf("pages", "quick");
const SKIP = (argOf("skip", "") || "").split(",").filter(Boolean);
const TAG = argOf("tag", DRY ? "dry" : "") || "";
const TIMEOUT_MS = Number(argOf("timeout-min", "45")) * 60000;
const DATE = new Date().toISOString().slice(0, 10);
const TSFX = TAG ? "-" + TAG : "";
const OUT = path.join(ROOT, "strategy/gates/mobile");
fs.mkdirSync(OUT, { recursive: true });

const tagArgs = TAG ? ["--tag", TAG] : [];
const JOBS = {
  layout: { script: "layout.mjs", args: [BASE, "--pages", PAGES, ...(DRY ? ["--only", "/", "--devices", "390x844", "--no-nav"] : []), ...tagArgs], json: `layout-${DATE}${TSFX}.json` },
  interactions: { script: "interactions.mjs", args: [BASE, ...(DRY ? ["--only", "S7", "--devices", "390x844"] : []), ...tagArgs], json: `interactions-${DATE}${TSFX}.json` },
  // Full width audit: content must use the site container at 1920 to 390 (see scripts/mobile-qa/width.mjs).
  width: { script: "width.mjs", args: [BASE, ...(PAGES === "quick" ? ["--sample"] : []), ...(DRY ? ["--only", "/,/journal/a-hippos-day-and-night", "--widths", "1440,390"] : []), ...tagArgs], json: `width-${DATE}${TSFX}.json` },
  // Optional fourth gate (opt in with --with-inp): INP per interaction plus LCP, TBT and JS per route against the owner's speed budgets.
  inp: { script: "inp.mjs", args: [BASE, ...(DRY ? ["--quick", "--only=/"] : []), ...(TAG ? [`--tag=${TAG}`] : [])], json: `inp-${DATE}${TSFX}.json`, optional: true },
  perf: { script: "perf.mjs", args: [BASE, ...(DRY ? ["--only=/", "--runs=1", "--quick"] : []), ...(TAG ? [`--tag=${TAG}`] : [])], json: `perf-${DATE}${TSFX}.json` },
};

function run(name, extraEnv) {
  const job = JOBS[name];
  const t0 = Date.now();
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(HERE, job.script), ...job.args], { cwd: ROOT, env: { ...process.env, ...extraEnv }, stdio: ["ignore", "pipe", "pipe"] });
    const pre = `[${name}] `;
    const pipe = (stream, out) => { let buf = ""; stream.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { out.write(pre + buf.slice(0, i) + "\n"); buf = buf.slice(i + 1); } }); };
    pipe(child.stdout, process.stdout); pipe(child.stderr, process.stderr);
    const killer = setTimeout(() => { process.stderr.write(`${pre}timeout after ${TIMEOUT_MS / 60000} min, killing\n`); child.kill("SIGKILL"); }, TIMEOUT_MS);
    child.on("exit", (code, sig) => { clearTimeout(killer); resolve({ name, code, sig, seconds: Math.round((Date.now() - t0) / 1000) }); });
  });
}

function summarise(name) {
  const f = path.join(OUT, JOBS[name].json);
  if (!fs.existsSync(f)) return { name, overall: "ERROR", counts: {}, note: `no report ${path.relative(ROOT, f)}` };
  const stat = fs.statSync(f);
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  const fresh = Date.now() - stat.mtimeMs < 4 * 3600e3;
  if (name === "layout") {
    const c = j.counts || {};
    return { name, overall: j.overall, counts: { critical: c.critical || 0, high: c.high || 0, medium: c.medium || 0, low: c.low || 0 }, report: `strategy/gates/mobile/${JOBS[name].json.replace(".json", ".md")}`, fresh };
  }
  if (name === "interactions") {
    const c = j.counts || {};
    return { name, overall: j.overall, counts: { critical: c.Critical || 0, high: c.Serious || 0, medium: c.Moderate || 0, low: c.Minor || 0 }, report: `strategy/gates/mobile/${JOBS[name].json.replace(".json", ".md")}`, fresh };
  }
  if (name === "width") {
    const c = j.counts || {};
    return { name, overall: j.overall, counts: { critical: 0, high: c.failing || 0, medium: 0, low: 0 }, report: `strategy/gates/mobile/${JOBS[name].json.replace(".json", ".md")}`, fresh };
  }
  if (name === "inp") return { name, overall: j.overall, counts: j.counts || {}, report: `strategy/gates/mobile/${JOBS[name].json.replace(".json", ".md")}`, fresh };
  // perf: map budget failures to severity. LCP, CLS, TBT, JS budget = high; scroll frame p95, page weight, hero image, third party = medium.
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const r of j.results || []) for (const fl of (r.grade && r.grade.fails) || []) { if (/^(LCP|CLS|TBT|JS)/.test(fl)) counts.high++; else counts.medium++; }
  const wins = (j.wins || []).length;
  return { name, overall: j.overall, counts, report: `strategy/gates/mobile/${JOBS[name].json.replace(".json", ".md")}`, fresh, parallelRun: !!j.parallelRun, note: j.parallelRun ? "timing inflated (parallel run)" : "solo timing", wins };
}

(async () => {
  const names = Object.keys(JOBS).filter((n) => !SKIP.includes(n) && (!JOBS[n].optional || ARGV.includes("--with-inp")));
  console.log(`Base ${BASE}  mode ${DRY ? "dry run" : PAGES}  ${SOLO ? "perf solo after the others" : "all in parallel"}  tag "${TAG || "-"}"`);
  const t0 = Date.now();
  const results = [];
  if (SOLO) {
    const first = names.filter((n) => n !== "perf" && n !== "inp");
    results.push(...(await Promise.all(first.map((n) => run(n, { MQA_PARALLEL: "0" })))));
    if (names.includes("perf")) results.push(await run("perf", { MQA_PARALLEL: "0" }));
    if (names.includes("inp")) results.push(await run("inp", { MQA_PARALLEL: "0" })); // timing gate: never in parallel
  } else {
    const par = names.length > 1 ? "1" : "0";
    results.push(...(await Promise.all(names.map((n) => run(n, { MQA_PARALLEL: par })))));
  }
  const rows = names.map((n) => ({ ...summarise(n), exit: results.find((r) => r.name === n) }));
  const overall = rows.every((r) => r.overall === "PASS") ? "PASS" : "FAIL";
  const pad = (s, n) => String(s).padEnd(n);
  const lines = [];
  lines.push(pad("Gate", 14) + pad("Result", 8) + pad("Critical", 10) + pad("High", 7) + pad("Medium", 8) + pad("Low", 6) + pad("Secs", 6) + "Report");
  for (const r of rows) lines.push(pad(r.name, 14) + pad(r.overall, 8) + pad(r.counts.critical ?? "-", 10) + pad(r.counts.high ?? "-", 7) + pad(r.counts.medium ?? "-", 8) + pad(r.counts.low ?? "-", 6) + pad(r.exit ? r.exit.seconds : "-", 6) + (r.report || r.note || ""));
  lines.push("", `OVERALL ${overall}  (${Math.round((Date.now() - t0) / 1000)} s wall)`);
  const par = rows.find((r) => r.name === "perf");
  if (par && par.parallelRun) lines.push("NOTE: perf ran in parallel. LCP, TBT and scroll frame p95 are inflated; run with --perf-solo for trustworthy timing.");
  console.log("\n" + lines.join("\n"));
  const md = `# Mobile QA combined summary ${DATE}${TSFX}\n\nBase: ${BASE}. Mode: ${DRY ? "dry run" : PAGES}, ${SOLO ? "perf solo" : "all parallel"}. Overall: **${overall}**\n\n| Gate | Result | Critical | High | Medium | Low | Seconds | Report |\n|---|---|---|---|---|---|---|---|\n` +
    rows.map((r) => `| ${r.name} | ${r.overall} | ${r.counts.critical ?? "-"} | ${r.counts.high ?? "-"} | ${r.counts.medium ?? "-"} | ${r.counts.low ?? "-"} | ${r.exit ? r.exit.seconds : "-"} | ${r.report || r.note || ""} |`).join("\n") +
    `\n\nSeverity mapping: layout critical/high/medium/low; interactions Critical/Serious/Moderate/Minor; perf failures LCP, CLS, TBT, JS budget count as high, others (scroll p95, weight, hero, third party) as medium.\n` +
    (par && par.parallelRun ? `\nWARNING: perf ran in parallel with the other gates, so timing numbers are inflated. Re-run with --perf-solo.\n` : "");
  fs.writeFileSync(path.join(OUT, `summary-${DATE}${TSFX}.md`), md.replace(/[–—]/g, "-"));
  fs.writeFileSync(path.join(OUT, `summary-${DATE}${TSFX}.json`), JSON.stringify({ date: DATE, base: BASE, overall, solo: SOLO, rows }, null, 1));
  process.exit(overall === "PASS" ? 0 : 1);
})();
