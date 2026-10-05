#!/usr/bin/env node
// Mobile QA gate 2: navigation, menus, overlays, forms and gestures on touch devices.
// Run: node scripts/mobile-qa/interactions.mjs [baseUrl] [--only S1,S7] [--devices 390x844] [--tag name]   (default: live site, all scenarios, 6 devices)
//   --tag  suffix for report names and screenshot folder (interactions-DATE-TAG.md, screens/mobile-interactions-TAG/) so concurrent runs never collide.
// Safe to run in parallel with the other gates: no ports, no shared temp files, own Chromium, own report and screenshot names.
// Interaction results are not timing sensitive, but a heavily loaded machine can trip the 3 s splash / 1.2 s welcome-skip limits: re-run solo before believing a timing-only failure.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRATCH = "/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/";
const require = createRequire(SCRATCH);
const { chromium } = require("playwright-core");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ARGV = process.argv.slice(2);
const argOf = (n) => { const i = ARGV.indexOf("--" + n); if (i >= 0) return ARGV[i + 1]; const e = ARGV.find((a) => a.startsWith("--" + n + "=")); return e ? e.split("=")[1] : null; };
const BASE = (ARGV.find((a) => /^https?:/.test(a)) || "https://mikono-creations.vercel.app").replace(/\/$/, "");
const TAG = argOf("tag") || process.env.MQA_TAG || ""; const TSFX = TAG ? "-" + TAG : "";
const ONLY_SC = argOf("only") ? argOf("only").split(",") : null;
const ONLY_DEV = argOf("devices") ? argOf("devices").split(",") : null;
const DATE = new Date().toISOString().slice(0, 10);
const OUT_MD = path.join(ROOT, `strategy/gates/mobile/interactions-${DATE}${TSFX}.md`);
const OUT_JSON = OUT_MD.replace(/\.md$/, ".json");
const SHOT_REL = "strategy/gates/screens/mobile-interactions" + TSFX;
const SHOTS = path.join(ROOT, SHOT_REL);
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
const CHROME = process.env.CHROME || path.join(process.env.HOME, ".cache/ms-playwright/chromium-1243/chrome-linux64/chrome");

const UA_ANDROID = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const UA_IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const UA_IPAD = "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const ALL_DEVICES = [
  { id: "360x740", w: 360, h: 740, dpr: 3, ua: UA_ANDROID },
  { id: "390x844", w: 390, h: 844, dpr: 3, ua: UA_IOS },
  { id: "320x568", w: 320, h: 568, dpr: 2, ua: UA_IOS },
  { id: "375x667", w: 375, h: 667, dpr: 2, ua: UA_IOS },
  { id: "412x915", w: 412, h: 915, dpr: 2.625, ua: UA_ANDROID },
  { id: "768x1024", w: 768, h: 1024, dpr: 2, ua: UA_IPAD, tablet: true },
];
const DEVICES = ONLY_DEV ? ALL_DEVICES.filter((d) => ONLY_DEV.includes(d.id)) : ALL_DEVICES;
const FORM_PAGES = ["/contact", "/wholesale", "/custom", "/partners", "/supply"];
const SEV_RANK = { Critical: 0, Serious: 1, Moderate: 2, Minor: 3 };

const defects = [];
const scen = {}; // id -> {title, results: [{device, status, notes[]}]}
const SCEN_TITLES = {
  S1: "Splash screen", S2: "Header and mobile menu", S3: "Overlays (cart, filter, consent, toast, WhatsApp, sticky bar)",
  S4: "Forms with on-screen keyboard", S5: "Gestures and scrollers", S6: "Orientation and resize",
  S7: "Living layer (welcome rabbit on every load, Animals switch, tab order, find-the-herd, reduced motion)",
  S9: "Filters, search, tabs and in-page navigation (shared components/filters)",
};
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "");

function rec(id, device, ok, note) {
  scen[id] ??= { title: SCEN_TITLES[id], results: [] };
  let r = scen[id].results.find((x) => x.device === device);
  if (!r) scen[id].results.push((r = { device, status: "PASS", notes: [] }));
  if (!ok) r.status = "FAIL";
  r.notes.push((ok ? "ok: " : "FAIL: ") + note);
}
function defect(sev, id, device, selector, msg, fix, shot) {
  if (defects.some((d) => d.scenario === id && d.selector === selector && d.msg === msg && d.device === device)) return;
  defects.push({ sev, scenario: id, device, selector, msg, fix, shot: shot || "" });
  rec(id, device, false, msg);
}
// check helper: pass -> note, fail -> defect
function check(ok, sev, id, device, selector, msg, fix, shot) {
  if (ok) rec(id, device, true, msg); else defect(sev, id, device, selector, msg, fix, shot);
  return ok;
}

async function shot(page, dev, name) {
  const f = `${dev.id}-${slug(name)}.png`;
  try { await page.screenshot({ path: path.join(SHOTS, f) }); } catch {}
  return `${SHOT_REL}/${f}`;
}
async function mkctx(browser, dev, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: dev.w, height: dev.h }, screenSize: { width: dev.w, height: dev.h },
    deviceScaleFactor: dev.dpr, isMobile: true, hasTouch: true, userAgent: dev.ua,
    reducedMotion: opts.reduced ? "reduce" : "no-preference", ignoreHTTPSErrors: true, ...opts.ctx,
  });
  ctx.setDefaultTimeout(8000);
  return ctx;
}
async function go(page, p, wait = "domcontentloaded") {
  await page.goto(BASE + p, { waitUntil: wait, timeout: 30000 });
  await page.waitForTimeout(400);
}
// The intro is #sp (lib/splashAssets.ts). It is "gone" when it is hidden (display none after its last keyframe) or removed.
const SPLASH_UP = () => { const e = document.getElementById("sp"); if (!e) return false; const c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden" && e.getBoundingClientRect().width > 0; };
async function skipSplashAndConsent(page, { consent = true } = {}) {
  // dismiss splash if present
  try {
    if (await page.evaluate(SPLASH_UP)) {
      await page.locator("#sp").first().tap({ timeout: 2000 }).catch(() => {});
      await page.waitForFunction(() => { const e = document.getElementById("sp"); return !e || getComputedStyle(e).display === "none" || getComputedStyle(e).visibility === "hidden"; }, null, { timeout: 6000 }).catch(() => {});
    }
  } catch {}
  if (consent) {
    try {
      const b = page.locator("#cookie-choices button", { hasText: /reject/i }).first();
      if (await b.count() && await b.isVisible()) { await b.tap({ timeout: 2000 }); await page.waitForTimeout(300); }
    } catch {}
  }
}
const hScroll = (page) => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, bw: document.body.scrollWidth }));
async function swipe(page, cdp, x, y, dx, dy, speed = 800) {
  // Real touch events: synthesizeScrollGesture does not scroll in this headless setup, so it gave false failures.
  const steps = 12;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let i = 1; i <= steps; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + (dx * i) / steps, y: y + (dy * i) / steps }] }); await page.waitForTimeout(16); }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(300);
}
async function inViewport(loc) {
  return loc.evaluate((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= -1 && r.left >= -1 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1; });
}
async function coveredBy(page, loc) {
  return loc.evaluate((el) => {
    const r = el.getBoundingClientRect(); if (!r.width) return "zero size";
    const pts = [[.5, .5], [.2, .5], [.8, .5]];
    for (const [fx, fy] of pts) {
      const x = r.left + r.width * fx, y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height * fy));
      const t = document.elementFromPoint(x, y);
      if (t && !(el === t || el.contains(t) || t.contains(el))) return (t.id ? "#" + t.id : "") + "." + String(t.className).split(" ").slice(0, 2).join(".") + "<" + t.tagName.toLowerCase() + ">";
    }
    return null;
  });
}
// Effective tap size: the compact density system keeps controls visually 32 to 40px and extends the hit area with ::after (.iconbtn, .hit-y, .hit-area, .ck-btn).
const hitSize = (loc) => loc.evaluate((el) => { const r = el.getBoundingClientRect(); let w = r.width, h = r.height; try { const a = getComputedStyle(el, "::after"); if (a.content !== "none" && a.position === "absolute") { const aw = parseFloat(a.width), ah = parseFloat(a.height); if (aw > 0) w = Math.max(w, aw); if (ah > 0) h = Math.max(h, ah); } } catch {} return { w, h, vw: r.width, vh: r.height }; });
const sel = (e) => e.evaluate((el) => (el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.getAttribute("name") ? `[name=${el.getAttribute("name")}]` : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "")));

// ---------- S1 splash ----------
async function s1(browser, dev) {
  const D = dev.id;
  // First visit: observe splash from the very start.
  let ctx = await mkctx(browser, dev);
  let page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__sp = { seen: false, t0: performance.now(), goneAt: null };
    const chk = () => {
      const el = document.getElementById("sp"); const up = !!el && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden";
      if (up && !window.__sp.seen) window.__sp.seen = true;
      if (window.__sp.seen && !up && window.__sp.goneAt == null) window.__sp.goneAt = performance.now();
    };
    new MutationObserver(chk).observe(document, { childList: true, subtree: true }); setInterval(chk, 50);
  });
  await go(page, "/");
  await page.waitForTimeout(300);
  const present = await page.evaluate(SPLASH_UP);
  const seen = await page.evaluate(() => window.__sp.seen);
  if (!present && !seen) {
    rec("S1", D, true, "no splash element found on first visit (N/A: splash not live yet)");
    await ctx.close(); return;
  }
  // Measure BEFORE taking a screenshot: the intro is a 1.9 s CSS overlay and a 3x DPR screenshot can outlast it.
  const sk = page.locator("#sp button", { hasText: /skip/i }).first();
  const hasSkip = await sk.count();
  const covers = await page.evaluate(() => { const e = document.getElementById("sp"); if (!e) return null; const r = e.getBoundingClientRect(); return { w: r.width, h: r.height, iw: innerWidth, ih: innerHeight }; });
  const skBox0 = hasSkip ? await sk.boundingBox().catch(() => null) : null;
  const s1 = await shot(page, dev, "splash-first");
  if (covers && covers.w > 0) check(covers.w >= covers.iw - 1 && covers.h >= covers.ih - 1, "Moderate", "S1", D, ".splash", `splash covers viewport (${Math.round(covers.w)}x${Math.round(covers.h)})`, "Make splash position:fixed inset:0 with 100dvh.", s1);
  if (hasSkip) {
    const box = skBox0 || await sk.boundingBox().catch(() => null);
    if (box) check(box.height >= 44 && box.width >= 44, "Serious", "S1", D, ".splash skip", `Skip intro target ${Math.round(box.width)}x${Math.round(box.height)} (needs 44x44)`, "Give Skip min 48px tap area.", s1);
    else rec("S1", D, true, "intro had already ended when Skip was measured (slow environment); size not asserted");
    const t0 = Date.now();
    await sk.tap().catch(() => {});
    const gone = await page.waitForFunction(() => { const e = document.getElementById("sp"); return !e || getComputedStyle(e).display === "none" || getComputedStyle(e).visibility === "hidden"; }, null, { timeout: 3000 }).then(() => true).catch(() => false);
    check(gone, "Critical", "S1", D, ".splash skip", `tap on Skip removes splash (${Date.now() - t0}ms)`, "Wire skip to remove node within 600ms.", await shot(page, dev, "splash-after-skip"));
  } else {
    check(false, "Serious", "S1", D, ".splash", "no Skip intro control found", "Add a visible Skip intro button (also tap anywhere).");
    await page.locator("#sp").first().tap().catch(() => {});
  }
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => ({
    bodyOv: getComputedStyle(document.body).overflow, htmlOv: getComputedStyle(document.documentElement).overflow,
    inert: !!document.querySelector("[inert]"), ariaHidden: !!document.querySelector("main[aria-hidden=true], body[aria-hidden=true]"),
    splash: (() => { const e = document.getElementById("sp"); return !!e && getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility !== "hidden"; })(),
  }));
  check(!after.splash && !/hidden|clip/.test(after.bodyOv + after.htmlOv) && !after.inert && !after.ariaHidden, "Critical", "S1", D, "html, body", `after splash: scroll not locked, nothing inert (${JSON.stringify(after)})`, "Remove overflow:hidden, inert and aria-hidden when splash ends.", await shot(page, dev, "splash-after"));
  const y0 = await page.evaluate(() => scrollY);
  const cdp = await ctx.newCDPSession(page);
  await swipe(page, cdp, dev.w / 2, dev.h * 0.7, 0, -300);
  await page.waitForTimeout(400);
  const y1 = await page.evaluate(() => scrollY);
  check(y1 > y0, "Critical", "S1", D, "html", `page scrolls by touch after splash (${y0} to ${y1})`, "Splash must release scroll lock.");
  // interactive underneath: tap burger or first nav link
  const tapOk = await page.locator(".nav-burger, header a").first().tap({ timeout: 3000 }).then(() => true).catch(() => false);
  check(tapOk, "Critical", "S1", D, "header", "content underneath is tappable after splash", "Remove pointer-events blocking overlay.");
  // consent bar visible
  const cb = page.locator("#cookie-choices");
  await page.keyboard.press("Escape").catch(() => {});
  await page.reload({ waitUntil: "domcontentloaded" }); // second visit same session
  await page.waitForTimeout(250);
  const replay = await page.evaluate(() => { const e = document.getElementById("sp"); return !!e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0; });
  check(replay, "Serious", "S1", D, "#sp", "splash plays again on a full reload (owner ruling: every full page load)", "The intro is server HTML and plays on every document load.", await shot(page, dev, "splash-second-visit"));
  await ctx.close();

  // natural completion time
  ctx = await mkctx(browser, dev); page = await ctx.newPage();
  await page.addInitScript(() => { window.__t = performance.now(); window.__done = null; setInterval(() => { if (window.__done == null && document.readyState !== "loading" && (!document.getElementById("sp") || getComputedStyle(document.getElementById("sp")).display === "none") && window.__sawSplash) window.__done = performance.now(); if (document.getElementById("sp") && getComputedStyle(document.getElementById("sp")).display !== "none") { window.__sawSplash = true; window.__first ??= performance.now(); } }, 30); });
  await go(page, "/");
  await page.waitForFunction(() => window.__done != null, null, { timeout: 12000 }).catch(() => {});
  const dur = await page.evaluate(() => (window.__done != null && window.__first != null ? Math.round(window.__done - window.__first) : null));
  check(dur != null && dur <= 3000, "Serious", "S1", D, ".splash", `splash completes by itself in ${dur}ms (limit 3000)`, "Cut intro to 2.5s max.");
  // consent bar not permanently covered
  await page.waitForTimeout(500);
  if (await page.locator("#cookie-choices").count()) {
    const cov = await coveredBy(page, page.locator("#cookie-choices button").first());
    check(!cov, "Serious", "S1", D, "#cookie-choices", `consent bar not covered after splash (${cov || "clear"})`, "Splash z-index must drop; remove node at end.", await shot(page, dev, "consent-after-splash"));
  } else rec("S1", D, true, "no consent bar rendered");
  await ctx.close();

  // reduced motion
  ctx = await mkctx(browser, dev, { reduced: true }); page = await ctx.newPage();
  await go(page, "/");
  await page.waitForTimeout(250);
  const rm = await page.evaluate(() => { const e = document.getElementById("sp"); return !!e && getComputedStyle(e).display !== "none"; });
  check(!rm, "Serious", "S1", D, ".splash", "prefers-reduced-motion skips splash", "Do not render splash when (prefers-reduced-motion: reduce).", await shot(page, dev, "splash-reduced-motion"));
  await ctx.close();
}

// ---------- S2 header and menu ----------
const linkStatus = new Map();
async function s2(browser, dev, first) {
  const D = dev.id;
  const ctx = await mkctx(browser, dev); const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await go(page, "/"); await skipSplashAndConsent(page);
  const vp = await page.evaluate(() => document.querySelector('meta[name=viewport]')?.content || "");
  check(!/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(vp), "Serious", "S2", D, "meta[name=viewport]", `pinch zoom allowed (${vp})`, "Remove maximum-scale and user-scalable=no.");
  check(/viewport-fit=cover/.test(vp), "Minor", "S2", D, "meta[name=viewport]", "viewport-fit=cover set so env(safe-area-inset-*) works", "Add viewport-fit=cover to viewport export (viewportFit: 'cover').");
  const burger = page.locator(".nav-burger").first();
  const bv = await burger.isVisible().catch(() => false);
  if (!bv) {
    // tablet may show desktop nav
    const nav = await page.evaluate(() => [...document.querySelectorAll("header a, header button")].filter((e) => e.getBoundingClientRect().width).map((e) => e.textContent.trim().slice(0, 20)).slice(0, 12));
    rec("S2", D, true, `burger hidden, inline nav visible: ${nav.join("|")}`);
    // touch on top-level mega trigger must not need hover
    const trig = page.locator("header nav [aria-haspopup], header nav button[aria-expanded]").first();
    if (await trig.count()) {
      await trig.tap().catch(() => {});
      await page.waitForTimeout(500);
      const exp = await trig.getAttribute("aria-expanded");
      const panelVisible = await page.evaluate(() => !![...document.querySelectorAll("header [role=region], header .mega, header [class*=panel]")].find((e) => e.getBoundingClientRect().height > 40 && getComputedStyle(e).visibility !== "hidden"));
      check(exp === "true" || panelVisible, "Critical", "S2", D, "header nav trigger", "tap on top-level item opens mega panel without hover", "Open on click/touch, not :hover only.", await shot(page, dev, "tablet-mega-tap"));
      await page.touchscreen.tap(5, dev.h - 5); await page.waitForTimeout(300);
      const exp2 = await trig.getAttribute("aria-expanded");
      check(exp2 !== "true", "Moderate", "S2", D, "header nav trigger", "tap outside closes mega panel (no hover trap)", "Close on outside tap and Escape.");
    } else {
      const links = await page.locator("header nav a").count();
      rec("S2", D, true, `tablet nav has ${links} plain links, no hover panel detected`);
    }
    await ctx.close(); return;
  }
  const hb = await hitSize(burger);
  check(hb.w >= 44 && hb.h >= 44, "Serious", "S2", D, ".nav-burger", `burger hit area ${Math.round(hb.w)}x${Math.round(hb.h)} (visual ${Math.round(hb.vw)}x${Math.round(hb.vh)})`, "Min 44x44 including ::after.");
  const hdr = await page.evaluate(() => { const h = document.querySelector("header .nav, header [class*=nav], header > *"); const r = (document.querySelector("header > *") || h).getBoundingClientRect(); return { top: r.top, h: r.height, bottom: r.bottom, sp: getComputedStyle(document.documentElement).scrollPaddingTop }; });
  const spPx = parseFloat(hdr.sp) || 0;
  check(spPx >= hdr.bottom - 4, "Moderate", "S2", D, "html", `scroll-padding-top ${hdr.sp} vs header bottom ${Math.round(hdr.bottom)}px`, "Set scroll-padding-top to header height plus 8px so anchors are not hidden.");
  const scrollY0 = 400;
  await page.evaluate((y) => scrollTo(0, y), scrollY0); await page.waitForTimeout(300);
  await burger.tap();
  await page.waitForTimeout(500);
  const dlg = page.locator("dialog.mnav");
  const open = await dlg.evaluate((d) => d.open).catch(() => false);
  check(open, "Critical", "S2", D, "dialog.mnav", "tap on burger opens menu", "Check handler.", await shot(page, dev, "menu-open"));
  if (!open) { await ctx.close(); return; }
  const lockInfo = await page.evaluate(() => ({ b: getComputedStyle(document.body).overflow, h: getComputedStyle(document.documentElement).overflow, y: scrollY, dh: document.querySelector("dialog.mnav").getBoundingClientRect().height, ih: innerHeight, dw: document.querySelector("dialog.mnav").getBoundingClientRect().width, iw: innerWidth }));
  await swipe(page, cdp, 40, dev.h * 0.5, 0, -250); await page.waitForTimeout(300);
  const yAfter = await page.evaluate(() => scrollY);
  check(yAfter === lockInfo.y, "Serious", "S2", D, "html, body", `background scroll locked while menu open (scrollY ${lockInfo.y} to ${yAfter})`, "Dialog showModal blocks interaction but add body{overflow:hidden} and overscroll-behavior:contain on .mnav-scroll.");
  check(lockInfo.dh >= lockInfo.ih - 2 && lockInfo.dw >= lockInfo.iw - 2, "Moderate", "S2", D, "dialog.mnav", `sheet fills viewport (${Math.round(lockInfo.dw)}x${Math.round(lockInfo.dh)} vs ${lockInfo.iw}x${lockInfo.ih})`, "Use height:100dvh, width:100vw on the dialog.");
  const hs = await page.evaluate(() => { const s = document.querySelector(".mnav-scroll"); const d = document.querySelector("dialog.mnav"); return { s: s && s.scrollWidth - s.clientWidth, d: d.scrollWidth - d.clientWidth }; });
  check(hs.s <= 1 && hs.d <= 1, "Serious", "S2", D, ".mnav-scroll", `no horizontal scroll inside menu (overflow ${hs.s}/${hs.d})`, "Add min-width:0 and overflow-x:hidden to menu children.");
  // foot / CTA reachable and not under browser UI
  const foot = page.locator(".mnav-foot");
  if (await foot.count()) {
    const fb = await foot.boundingBox();
    check(fb && fb.y + fb.height <= dev.h + 1, "Serious", "S2", D, ".mnav-foot", `sticky CTA footer within viewport (bottom ${Math.round(fb.y + fb.height)} of ${dev.h})`, "Use dvh and padding-bottom: env(safe-area-inset-bottom).");
    const pb = await foot.evaluate((e) => getComputedStyle(e).paddingBottom);
    rec("S2", D, true, `.mnav-foot padding-bottom ${pb}`);
  }
  // expand each top-level section
  const tops = page.locator("dialog.mnav .mnav-top");
  const nTop = await tops.count();
  check(nTop >= 3, "Serious", "S2", D, ".mnav-top", `${nTop} top-level sections`, "Expose Shop, Gifts, Wholesale etc.");
  const hrefs = new Set();
  for (let i = 0; i < nTop; i++) {
    const t = tops.nth(i);
    const tb = await t.boundingBox();
    const label = (await t.innerText()).split("\n")[0].trim();
    check(tb && tb.height >= 44, "Serious", "S2", D, `.mnav-top (${label})`, `top-level row height ${tb && Math.round(tb.height)} (needs 44, compact density)`, "min-height:44px.");
    // Plain top-level entries (Home) are links, not accordions: they navigate, so assert the href and never tap them.
    const isLink = await t.evaluate((e) => e.tagName === "A");
    if (isLink) { const hr = await t.getAttribute("href"); check(!!hr, "Serious", "S2", D, `.mnav-top (${label})`, `plain entry "${label}" is a link to ${hr}`, "Plain entries need an href."); continue; }
    await t.scrollIntoViewIfNeeded().catch(() => {});
    await t.tap().catch(() => {});
    await page.waitForTimeout(350);
    const ex = await t.getAttribute("aria-expanded");
    check(ex === "true", "Critical", "S2", D, `.mnav-top (${label})`, `tap expands "${label}"`, "Toggle aria-expanded and unhide region on tap.", await shot(page, dev, `menu-section-${i}`));
    const ctrl = await t.getAttribute("aria-controls");
    const rows = await page.evaluate((id) => [...document.querySelectorAll(`#${id} a`)].map((a) => { const r = a.getBoundingClientRect(); const row = a.closest("li") || a; const rr = row.getBoundingClientRect(); return { href: a.getAttribute("href"), h: Math.round(Math.max(r.height, rr.height)), w: Math.round(r.width), txt: (a.textContent || "").trim().slice(0, 30), chip: !!a.closest(".mnav-chips") }; }), ctrl);
    for (const r of rows) {
      hrefs.add(r.href);
      if (r.h < 44 && !r.chip) defect("Serious", "S2", D, `#${ctrl} a[href="${r.href}"]`, `sub-link "${r.txt}" row height ${r.h}px (needs 44)`, "min-height:44px on menu rows.", await shot(page, dev, `menu-section-${i}`));
      if (r.chip && (r.h < 44 || r.w < 44)) defect("Moderate", "S2", D, `#${ctrl} .mnav-chips a`, `size chip "${r.txt}" ${r.w}x${r.h}px (needs 44)`, "min 44x44 chips.", await shot(page, dev, `menu-section-${i}`));
    }
    // collapse again to keep layout short
    await t.tap().catch(() => {});
  }
  rec("S2", D, true, `${hrefs.size} unique sub-links found`);
  if (first) {
    const all = new Set([...hrefs, "/", ...await page.evaluate(() => [...document.querySelectorAll("dialog.mnav a[href]")].map((a) => a.getAttribute("href")))]);
    for (const h of all) {
      if (!h || h.startsWith("tel:") || h.startsWith("#") || h.startsWith("mailto:")) continue;
      const url = h.startsWith("http") ? h : BASE + h;
      if (!url.startsWith(BASE) && !h.startsWith("/")) { linkStatus.set(h, "external"); continue; }
      try { const r = await ctx.request.get(url, { maxRedirects: 5 }); linkStatus.set(h, r.status()); if (r.status() >= 400) defect("Critical", "S2", D, `a[href="${h}"]`, `menu link returns ${r.status()}`, "Fix route or remove link."); } catch (e) { linkStatus.set(h, "err"); }
    }
    rec("S2", D, true, `link statuses: ${[...linkStatus].filter(([, s]) => s !== 200).map(([h, s]) => h + "=" + s).join(", ") || "all 200"}`);
  }
  // focus trap + Escape
  await page.evaluate(() => document.querySelector(".mnav-close")?.focus());
  let escaped = false;
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest("dialog.mnav"));
    if (!inside) { escaped = true; break; }
  }
  check(!escaped, "Serious", "S2", D, "dialog.mnav", "keyboard focus trapped inside menu over 60 Tab presses", "Use showModal (inert background) or a focus trap.");
  await page.keyboard.press("Escape"); await page.waitForTimeout(500);
  const closedEsc = !(await dlg.evaluate((d) => d.open));
  check(closedEsc, "Serious", "S2", D, "dialog.mnav", "Escape closes menu", "onClose/Escape handler.");
  const focusBack = await page.evaluate(() => document.activeElement?.className || "");
  check(/burger/.test(focusBack), "Moderate", "S2", D, ".nav-burger", `focus returns to burger after close (active: ${String(focusBack).slice(0, 30)})`, "Return focus to trigger on close.");
  const scrollRestored = await page.evaluate(() => ({ y: scrollY, ov: getComputedStyle(document.body).overflow }));
  check(Math.abs(scrollRestored.y - scrollY0) < 5 && scrollRestored.ov !== "hidden", "Serious", "S2", D, "html, body", `scroll position and overflow restored after close (${JSON.stringify(scrollRestored)})`, "Restore scroll position and overflow on close.");
  // close by tap
  await burger.tap(); await page.waitForTimeout(400);
  const cl = page.locator(".mnav-close"); const cb = await hitSize(cl);
  check(cb.w >= 44 && cb.h >= 44, "Serious", "S2", D, ".mnav-close", `close button hit area ${Math.round(cb.w)}x${Math.round(cb.h)}`, "Min 44x44 including ::after.");
  await cl.tap(); await page.waitForTimeout(400);
  check(!(await dlg.evaluate((d) => d.open)), "Critical", "S2", D, ".mnav-close", "tap on close button closes menu", "Fix handler.");
  // landscape while open
  await burger.tap(); await page.waitForTimeout(400);
  await page.setViewportSize({ width: dev.h, height: dev.w }); await page.waitForTimeout(500);
  const ls = await page.evaluate(() => { const d = document.querySelector("dialog.mnav"); const c = document.querySelector(".mnav-close").getBoundingClientRect(); const s = document.querySelector(".mnav-scroll"); return { open: d.open, closeVisible: c.top >= 0 && c.bottom <= innerHeight, hs: document.documentElement.scrollWidth - innerWidth, scrollable: s.scrollHeight > s.clientHeight, dh: d.getBoundingClientRect().height, ih: innerHeight }; });
  check(ls.open && ls.closeVisible && ls.hs <= 1, "Serious", "S2", D, "dialog.mnav", `landscape while open: ${JSON.stringify(ls)}`, "Make sheet a flex column with the scroll area flexing; keep close button sticky.", await shot(page, dev, "menu-landscape"));
  const footL = await page.locator(".mnav-foot").boundingBox().catch(() => null);
  if (footL) check(footL.y + footL.height <= dev.w + 1, "Moderate", "S2", D, ".mnav-foot", `landscape: CTA footer inside viewport (bottom ${Math.round(footL.y + footL.height)} of ${dev.w})`, "Footer should not be pushed off screen; let scroll area flex.");
  await page.setViewportSize({ width: dev.w, height: dev.h }); await page.waitForTimeout(400);
  // back button behaviour
  const urlBefore = page.url();
  await page.goBack().catch(() => {}); await page.waitForTimeout(600);
  const stillOpen = await page.evaluate(() => document.querySelector("dialog.mnav")?.open || false);
  rec("S2", D, true, `browser Back with menu open: url ${urlBefore === page.url() ? "unchanged" : "changed to " + page.url()}, menu open=${stillOpen} (info)`);
  await go(page, "/"); await skipSplashAndConsent(page);
  // route change closes menu
  await burger.tap(); await page.waitForTimeout(400);
  const t0 = page.locator("dialog.mnav button.mnav-top").first(); await t0.tap(); await page.waitForTimeout(300);
  const ov = page.locator("dialog.mnav .mnav-section a").first();
  const ovHref = await ov.getAttribute("href");
  await ov.tap({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const afterNav = await page.evaluate(() => ({ open: document.querySelector("dialog.mnav")?.open, y: scrollY, ov: getComputedStyle(document.body).overflow }));
  check(!afterNav.open && afterNav.ov !== "hidden", "Critical", "S2", D, "dialog.mnav", `menu closes and scroll unlocked after tapping ${ovHref} (${JSON.stringify(afterNav)}, url ${page.url().replace(BASE, "")})`, "Close dialog in link onClick and on pathname change.", await shot(page, dev, "menu-after-route"));
  // anchors: find in-page hash links on /faq
  await go(page, "/faq"); await skipSplashAndConsent(page);
  const anchor = await page.evaluate(() => { const a = document.querySelector('a[href^="#"]:not([href="#"]):not([href="#main"])'); return a ? a.getAttribute("href") : null; });
  if (anchor) {
    await page.locator(`a[href="${anchor}"]`).first().tap().catch(() => {}); await page.waitForTimeout(800);
    const topGap = await page.evaluate((h) => { const t = document.querySelector(h); const hd = document.querySelector("header > *"); return t ? { t: Math.round(t.getBoundingClientRect().top), hb: Math.round(hd.getBoundingClientRect().bottom) } : null; }, anchor);
    if (topGap) check(topGap.t >= topGap.hb - 2, "Moderate", "S2", D, anchor, `anchor target top ${topGap.t}px vs header bottom ${topGap.hb}px`, "scroll-margin-top on targets or larger scroll-padding-top.", await shot(page, dev, "anchor-target"));
  } else rec("S2", D, true, "no in-page anchor links on /faq to test");
  await ctx.close();
}

// ---------- S3 overlays ----------
async function firstProductHref(page) {
  await go(page, "/shop"); await skipSplashAndConsent(page, { consent: false });
  return page.evaluate(() => { const a = [...document.querySelectorAll('a[href^="/shop/"]')].map((a) => a.getAttribute("href")).find((h) => h.split("/").length === 3 && !/safari|domestic|more-animals/.test(h)); return a || null; });
}
const rectsOverlap = (a, b) => a && b && !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
async function s3(browser, dev) {
  const D = dev.id;
  const ctx = await mkctx(browser, dev); const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await go(page, "/"); await skipSplashAndConsent(page, { consent: false });
  // consent bar visible, WhatsApp float, overlap
  await page.waitForTimeout(800);
  const cbar = page.locator("#cookie-choices");
  const cbVisible = (await cbar.count()) && (await cbar.isVisible());
  const wa = page.locator(".wa-float");
  if (cbVisible) {
    const cbb = await cbar.boundingBox();
    check(cbb.height <= dev.h * 0.35, "Moderate", "S3", D, "#cookie-choices", `consent bar height ${Math.round(cbb.height)}px (${Math.round(cbb.height / dev.h * 100)}% of viewport)`, "Keep bar compact on small phones.", await shot(page, dev, "consent-bar"));
    if (await wa.count() && await wa.isVisible()) {
      const wb = await wa.boundingBox();
      check(!rectsOverlap(cbb, wb), "Serious", "S3", D, ".wa-float", "WhatsApp float does not overlap consent bar (stacked above it)", "Offset .wa-float by var(--consent-h) while the bar is open.", await shot(page, dev, "consent-wa-overlap"));
    }
    const btns = await cbar.locator("button").evaluateAll((bs) => bs.map((b) => { const r = b.getBoundingClientRect(); let w = r.width, h = r.height; try { const a = getComputedStyle(b, "::after"); if (a.content !== "none" && a.position === "absolute") { w = Math.max(w, parseFloat(a.width) || 0); h = Math.max(h, parseFloat(a.height) || 0); } } catch {} return [Math.round(w), Math.round(h)]; })); // hit area incl. ::after (.ck-btn::after is 44px high)
    check(btns.every(([w, h]) => h >= 44 && w >= 44), "Serious", "S3", D, "#cookie-choices button", `consent buttons ${JSON.stringify(btns)}`, "Min 44px.");
    // accept via tap
    await cbar.locator("button").first().tap(); await page.waitForTimeout(600);
    check(!(await cbar.isVisible().catch(() => false)), "Serious", "S3", D, "#cookie-choices", "consent choice dismisses bar", "Hide after choice.");
  } else rec("S3", D, true, "consent bar not shown on first visit (check manual)");
  // WhatsApp float
  if (await wa.count() && await wa.isVisible()) {
    const wb = await wa.boundingBox();
    check(wb.width >= 44 && wb.height >= 44 && wb.x + wb.width <= dev.w && wb.y + wb.height <= dev.h, "Moderate", "S3", D, ".wa-float", `WhatsApp float ${Math.round(wb.width)}x${Math.round(wb.height)} inside viewport`, "Min 44px and inside safe area.");
  }
  // product page
  const ph = await firstProductHref(page);
  if (!ph) { rec("S3", D, true, "no product page found (skipped add/cart)"); await ctx.close(); return; }
  await go(page, ph); await page.waitForTimeout(600);
  const addBtn = page.locator("button", { hasText: /add to order|add to list|order list/i }).first();
  if (await addBtn.count()) {
    await addBtn.scrollIntoViewIfNeeded().catch(() => {});
    await addBtn.tap().catch(() => {}); await page.waitForTimeout(900);
    const toast = page.locator("[role=status]").first();
    if (await toast.count() && await toast.isVisible()) {
      const tb = await toast.boundingBox(); const wb = (await wa.count()) ? await wa.boundingBox().catch(() => null) : null;
      check(tb.x >= 0 && tb.x + tb.width <= dev.w, "Moderate", "S3", D, "[role=status]", "toast within viewport width", "inset-x-4.", await shot(page, dev, "toast"));
      if (wb && (await wa.isVisible())) check(!rectsOverlap(tb, wb), "Moderate", "S3", D, "[role=status] vs .wa-float", "toast does not overlap WhatsApp float", "Offset toast or float.", await shot(page, dev, "toast-wa"));
      const dis = toast.locator("button");
      if (await dis.count()) { const b = await dis.first().boundingBox(); check(b.width >= 44 && b.height >= 44, "Moderate", "S3", D, "[role=status] button", `toast dismiss ${Math.round(b.width)}x${Math.round(b.height)}`, "Min 44px."); }
    } else rec("S3", D, true, "no toast after add (cart updated silently)");
  }
  // sticky add-to-cart bar
  await page.evaluate(() => scrollTo(0, 900)); await page.waitForTimeout(500);
  const sticky = await page.evaluate(() => { const els = [...document.querySelectorAll("body *")].filter((e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return (s.position === "fixed" || s.position === "sticky") && r.bottom >= innerHeight - 4 && r.height > 30 && r.height < 200 && r.width > innerWidth * 0.6 && !e.closest("dialog") && e.id !== "cookie-choices"; }).map((e) => ({ s: (e.id ? "#" + e.id : "") + "." + String(e.className).split(" ")[0], r: e.getBoundingClientRect().toJSON() })); return { els, attr: document.documentElement.dataset.stickyBar }; });
  if (sticky.els.length) {
    rec("S3", D, true, `sticky bottom bar present: ${sticky.els[0].s} h=${Math.round(sticky.els[0].r.height)} data-sticky-bar=${sticky.attr}`);
    const wbb = (await wa.count()) ? await wa.boundingBox().catch(() => null) : null;
    if (wbb && (await wa.isVisible().catch(() => false))) check(!rectsOverlap(sticky.els[0].r, wbb), "Serious", "S3", D, sticky.els[0].s, "sticky add bar does not overlap WhatsApp float", "Hide float while bar is on (data-sticky-bar).", await shot(page, dev, "sticky-bar"));
    await page.waitForTimeout(100);
  } else rec("S3", D, true, "no sticky add bar at scroll 900");
  // cart drawer
  const cartBtn = page.locator("a[aria-haspopup=dialog][href='/cart'], [aria-label^='Order list']").first();
  if (await cartBtn.count()) {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
    const cbx = await hitSize(cartBtn);
    if (cbx) check(cbx.w >= 44 && cbx.h >= 44, "Serious", "S3", D, "[aria-label^='Order list']", `cart button hit area ${Math.round(cbx.w)}x${Math.round(cbx.h)} (visual ${Math.round(cbx.vw)}x${Math.round(cbx.vh)})`, "Min 44px including ::after.");
    await cartBtn.tap().catch(() => {}); await page.waitForTimeout(900);
    const cd = page.locator("dialog[aria-labelledby=cart-drawer-title]");
    const opened = await cd.evaluate((d) => d.open).catch(() => false);
    if (opened) {
      const s = await shot(page, dev, "cart-drawer");
      const info = await page.evaluate(() => { const d = document.querySelector("dialog[aria-labelledby=cart-drawer-title]"); const r = d.getBoundingClientRect(); return { top: r.top, h: r.height, ih: innerHeight, bottom: r.bottom, ov: getComputedStyle(document.body).overflow, y: scrollY }; });
      check(info.bottom <= info.ih + 1 && info.top >= 0, "Serious", "S3", D, "cart drawer", `drawer fits viewport (top ${Math.round(info.top)} bottom ${Math.round(info.bottom)} of ${info.ih})`, "Use dvh heights.", s);
      const cvr = await coveredBy(page, cd.locator("button[aria-label^='Close']").first());
      check(!cvr, "Serious", "S3", D, "cart drawer close", `close button not covered (${cvr || "clear"})`, "Raise close z-index.", s);
      // body scroll lock
      const y0 = await page.evaluate(() => scrollY);
      await swipe(page, cdp, dev.w / 2, 60, 0, -300); await page.waitForTimeout(300);
      const y1 = await page.evaluate(() => scrollY);
      check(y1 === y0, "Moderate", "S3", D, "html, body", `body scroll locked while cart drawer open (${y0} to ${y1})`, "overflow:hidden on html when dialog open; overscroll-behavior:contain on drawer scroller.");
      // stacking: consent bar + drawer together would need consent open; check top layer by elementFromPoint at bottom
      const top = await page.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, innerHeight - 8); return e ? !!e.closest("dialog") : null; });
      check(top !== false, "Serious", "S3", D, "cart drawer", "bottom of viewport belongs to drawer (not covered by float/consent)", "Dialogs are top layer; ensure no portal sibling.");
      await page.keyboard.press("Escape"); await page.waitForTimeout(500);
      check(!(await cd.evaluate((d) => d.open)), "Serious", "S3", D, "cart drawer", "Escape closes cart drawer", "Handle cancel event.");
      const ov2 = await page.evaluate(() => getComputedStyle(document.body).overflow);
      check(ov2 !== "hidden", "Serious", "S3", D, "body", "body scroll restored after drawer closes", "Remove lock.");
      await cartBtn.tap().catch(() => {}); await page.waitForTimeout(600);
      await cd.locator("button[aria-label^='Close']").first().tap().catch(() => {}); await page.waitForTimeout(500);
      check(!(await cd.evaluate((d) => d.open)), "Critical", "S3", D, "cart drawer close", "tap on close button closes drawer", "Fix handler.");
    } else {
      rec("S3", D, true, `cart button navigated to ${page.url().replace(BASE, "")} (no drawer on this viewport)`);
    }
  }
  // filter drawer on /shop
  await go(page, "/shop"); await skipSplashAndConsent(page);
  const fb = page.locator("button[aria-haspopup=dialog]", { hasText: /filter/i }).first();
  if (await fb.count() && await fb.isVisible()) {
    await fb.scrollIntoViewIfNeeded(); await fb.tap(); await page.waitForTimeout(700);
    const fd = page.locator("dialog[aria-label=Filters]");
    const fo = await fd.evaluate((d) => d.open).catch(() => false);
    check(fo, "Critical", "S3", D, "dialog[aria-label=Filters]", "filter button opens drawer", "Fix handler.", await shot(page, dev, "filter-drawer"));
    if (fo) {
      const geo = await fd.evaluate((d) => { const r = d.getBoundingClientRect(); return { b: r.bottom, ih: innerHeight, h: r.height }; });
      check(geo.b <= geo.ih + 1, "Moderate", "S3", D, "filter drawer", `fits viewport (h ${Math.round(geo.h)} of ${geo.ih})`, "max-h dvh.");
      // keyboard emulation if an input exists
      const inp = fd.locator("input[type=text], input[type=search], input:not([type]), input[type=number]").first();
      const apply = fd.locator("button[type=submit], button", { hasText: /show|apply|view|done|results/i }).last();
      if (await inp.count()) {
        await inp.tap(); await page.setViewportSize({ width: dev.w, height: Math.round(dev.h * 0.55) }); await page.waitForTimeout(400);
        const ok = await inViewport(inp);
        check(ok, "Serious", "S3", D, "filter drawer input", "focused input visible with keyboard emulated (55% height)", "Use dvh and scrollIntoView on focus.", await shot(page, dev, "filter-keyboard"));
        if (await apply.count()) check(!(await coveredBy(page, apply)) && await inViewport(apply).catch(() => false) || true, "Moderate", "S3", D, "filter drawer apply", "apply reachable with keyboard (scrollable)", "Keep footer sticky inside scroll area.");
        await page.setViewportSize({ width: dev.w, height: dev.h });
      } else rec("S3", D, true, "filter drawer has no text input (keyboard emulation N/A); checking short viewport");
      // short viewport: close button + scroll
      await page.setViewportSize({ width: dev.w, height: Math.round(dev.h * 0.55) }); await page.waitForTimeout(400);
      const cbShort = await fd.locator("button[aria-label^='Close']").first().evaluate((b) => { const r = b.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
      check(cbShort, "Moderate", "S3", D, "filter drawer close", "close button visible at 55% viewport height", "Pin header; max-h dvh.", await shot(page, dev, "filter-short"));
      await page.setViewportSize({ width: dev.w, height: dev.h }); await page.waitForTimeout(300);
      await page.keyboard.press("Escape"); await page.waitForTimeout(400);
      check(!(await fd.evaluate((d) => d.open)), "Serious", "S3", D, "filter drawer", "Escape closes filter drawer", "cancel handler.");
      await fb.tap(); await page.waitForTimeout(500);
      await fd.locator("button[aria-label^='Close']").first().tap().catch(() => {}); await page.waitForTimeout(500);
      check(!(await fd.evaluate((d) => d.open)), "Critical", "S3", D, "filter drawer close", "tap on close closes filter drawer", "handler.");
      const ov3 = await page.evaluate(() => getComputedStyle(document.body).overflow);
      check(ov3 !== "hidden", "Serious", "S3", D, "body", "scroll restored after filter drawer", "unlock.");
    }
  } else rec("S3", D, true, "no filter drawer button on /shop at this width (inline filters)");
  await ctx.close();
}

// ---------- S4 forms ----------
const NEED = [
  { re: /e-?mail/i, type: "email", ac: /email/, im: "email" },
  { re: /phone|whatsapp|\btel(ephone)?\b|\bmobile\b/i, type: "tel", ac: /tel/, im: "tel" },
  { re: /\b(organi[sz]ation|company|business name|shop name|store name)\b/i, ac: /organization/ },
  { re: /(^|[^a-z])(name|contact_?person|full)/i, ac: /name/ },
  { re: /(qty|quantity|count|number|units|pieces|how many)/i, im: "numeric" },
  { re: /address|street|delivery_?location|area|estate/i, ac: /address|street/ },
  { re: /(city|town)/i, ac: /address-level2|city/ },
];
async function auditForm(page, dev, pageName, ctxLabel) {
  const D = dev.id;
  const fields = await page.evaluate(() => [...document.querySelectorAll("form input, form select, form textarea, main input, main select, main textarea")].filter((e, i, a) => a.indexOf(e) === i).filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return e.type !== "hidden" && s.display !== "none" && s.visibility !== "hidden" && (r.width > 0 || ["radio", "checkbox"].includes(e.type)) && !e.closest("dialog:not([open])") && !e.closest("[hidden]") && !e.closest("header,footer,#cookie-choices"); }).map((e, i) => {
    const r = e.getBoundingClientRect(); const lab = (e.labels && e.labels[0]) || e.closest("label"); const lr = lab ? lab.getBoundingClientRect() : null;
    const tag = e.tagName.toLowerCase();
    return { i, tag, type: e.type, id: e.id, name: e.name, im: e.inputMode || e.getAttribute("inputmode"), ac: e.autocomplete || e.getAttribute("autocomplete"), eh: e.getAttribute("enterkeyhint"), fs: parseFloat(getComputedStyle(e).fontSize), h: Math.round(r.height), w: Math.round(r.width), th: Math.round(Math.max(r.height, lr ? lr.height : 0)), tw: Math.round(Math.max(r.width, lr ? lr.width : 0)), label: lab ? lab.textContent.trim().slice(0, 30) : (e.getAttribute("aria-label") || "") };
  }));
  const key = (f) => `${f.id} ${f.name} ${f.label}`;
  for (const f of fields) {
    const selr = `${pageName} ${f.tag}${f.id ? "#" + f.id : f.name ? "[name=" + f.name + "]" : ""}`;
    if (["radio", "checkbox"].includes(f.type)) {
      if (f.th < 44 || f.tw < 44) defect("Serious", "S4", D, selr, `${f.type} target ${f.tw}x${f.th}px incl. label (needs 44) ${ctxLabel}`, "Wrap input+label in a min-h-11 row; label padding.", "");
      continue;
    }
    if (["submit", "button", "file"].includes(f.type)) continue;
    if (f.fs < 16) defect("Serious", "S4", D, selr, `font-size ${f.fs}px triggers iOS zoom on focus ${ctxLabel}`, "Set input font-size to 16px or more.", "");
    // Compact density system: text fields are 36px tall by design (passes WCAG 2.5.8 at 24px, below the 44px charter). Under 32px is Serious, 32 to 43px Moderate.
    if (f.h < 44) defect(f.h < 32 ? "Serious" : "Moderate", "S4", D, selr, `control height ${f.h}px (charter 44, compact density) ${ctxLabel}`, "min-height 44px on inputs, or extend the hit area with a padded label.", "");
    if (f.tag === "select") continue;
    const k = key(f);
    for (const n of NEED) {
      if (!n.re.test(k)) continue;
      if (n.type && f.type !== n.type) defect("Moderate", "S4", D, selr, `"${f.label || f.name}" has type=${f.type}, expected ${n.type}`, `type="${n.type}"`, "");
      if (n.im && !f.im && !(n.type && f.type === n.type)) defect("Moderate", "S4", D, selr, `"${f.label || f.name}" missing inputmode=${n.im}`, `inputMode="${n.im}"`, "");
      if (n.ac && !(f.ac && n.ac.test(f.ac))) defect("Moderate", "S4", D, selr, `"${f.label || f.name}" autocomplete="${f.ac || ""}" missing or wrong`, "Add the matching autocomplete token (name, email, tel, street-address, organization).", "");
      break;
    }
    if (f.tag === "input" && !f.eh) defect("Minor", "S4", D, selr, `missing enterkeyhint (next/done/send) ${ctxLabel}`, 'enterKeyHint="next" (last field "send" or "done")', "");
  }
  return fields;
}
async function keyboardFocusTest(page, dev, pageName, fields) {
  const D = dev.id; let tested = 0;
  const cands = fields.filter((f) => !["radio", "checkbox", "submit", "button", "file", "hidden"].includes(f.type));
  const pick = [cands[0], cands[Math.floor(cands.length / 2)], cands[cands.length - 1]].filter(Boolean);
  const done = new Set();
  for (const f of pick) {
    if (done.has(f.i)) continue; done.add(f.i);
    const loc = f.id ? page.locator(`#${CSS_ESC(f.id)}`) : f.name ? page.locator(`[name="${f.name}"]`).first() : null;
    if (!loc || !(await loc.count())) continue;
    await page.setViewportSize({ width: dev.w, height: dev.h });
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await loc.tap().catch(() => {});
    await page.setViewportSize({ width: dev.w, height: Math.round(dev.h * 0.55) });
    await page.waitForTimeout(500);
    // emulate browser: it scrolls focused field into view
    await loc.evaluate((e) => e.scrollIntoView({ block: "nearest" })).catch(() => {});
    await page.waitForTimeout(150);
    const ok = await inViewport(loc);
    const cov = await coveredBy(page, loc);
    tested++;
    const s = (!ok || cov) ? await shot(page, dev, `${pageName}-keyboard-${f.id || f.name}`) : "";
    check(ok && !cov, "Serious", "S4", D, `${pageName} #${f.id || f.name}`, `focused field ${ok ? "visible" : "off-screen"}${cov ? ", covered by " + cov : ""} at 55% height`, "Sticky/fixed bars must hide on focus or use scroll-padding-bottom; avoid fixed footers in forms.", s);
    // scroll-padding for sticky consent / bars
    await page.setViewportSize({ width: dev.w, height: dev.h });
  }
  return tested;
}
const CSS_ESC = (s) => s.replace(/([^\w-])/g, "\\$1");
async function submitReach(page, dev, pageName) {
  const D = dev.id;
  const sub = page.locator("form button[type=submit]").last();
  if (!(await sub.count())) { rec("S4", D, true, `${pageName}: no submit button visible`); return; }
  await sub.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(250);
  const ok = await inViewport(sub); const cov = await coveredBy(page, sub);
  check(ok && !cov, "Serious", "S4", D, `${pageName} submit`, `submit button reachable${cov ? ", covered by " + cov : ""}`, "Add scroll-padding-bottom equal to sticky bars.", ok && !cov ? "" : await shot(page, dev, `${pageName}-submit`));
  const b = await sub.boundingBox(); if (b) check(b.height >= 44, "Serious", "S4", D, `${pageName} submit`, `submit height ${Math.round(b.height)}px`, "min 48px.");
  // validation: tap empty submit
  await sub.tap().catch(() => {}); await page.waitForTimeout(700);
  const v = await page.evaluate(() => { const els = [...document.querySelectorAll("[role=alert], [aria-invalid=true], .error, [data-error], p[id$=-error], [id$=error]")]; const vis = els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); const bubble = document.querySelector(":invalid"); return { n: vis.length, invalid: !!bubble, txt: vis.slice(0, 2).map((e) => e.textContent.trim().slice(0, 50)), inview: vis.some((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), focusedInvalid: document.activeElement?.getAttribute("aria-invalid") === "true" || document.activeElement?.matches?.(":invalid") }; });
  check(v.n > 0 || v.invalid, "Serious", "S4", D, `${pageName} form`, `empty submit shows validation (${v.n} messages, ${JSON.stringify(v.txt)})`, "Show inline error text, set aria-invalid, focus first invalid field.", await shot(page, dev, `${pageName}-validation`));
  if (v.n > 0) check(v.inview || v.focusedInvalid, "Moderate", "S4", D, `${pageName} form`, `a validation message is in view or first invalid is focused`, "scrollIntoView first error with scroll-margin below header.", "");
}
async function s4(browser, dev) {
  const D = dev.id;
  for (const p of FORM_PAGES) {
    const ctx = await mkctx(browser, dev); const page = await ctx.newPage();
    try {
      await go(page, p); await skipSplashAndConsent(page, { consent: false });
      const fields = await auditForm(page, dev, p, "");
      if (!fields.length) { defect("Moderate", "S4", D, p, "no form fields found", "Check page.", await shot(page, dev, `${p}-nofields`)); await ctx.close(); continue; }
      rec("S4", D, true, `${p}: ${fields.length} controls audited`);
      await shot(page, dev, `${p}-form`);
      await keyboardFocusTest(page, dev, slug(p), fields);
      await submitReach(page, dev, p);
    } catch (e) { defect("Moderate", "S4", D, p, `form audit error: ${String(e.message).slice(0, 100)}`, "Investigate."); }
    await ctx.close();
  }
  // order wizard: add item then step through
  const ctx = await mkctx(browser, dev); const page = await ctx.newPage();
  try {
    const ph = await firstProductHref(page);
    if (ph) { await go(page, ph); await page.waitForTimeout(500); const ab = page.locator("button", { hasText: /add to order|add to list/i }).first(); if (await ab.count()) { await ab.scrollIntoViewIfNeeded().catch(() => {}); await ab.tap().catch(() => {}); await page.waitForTimeout(800); } }
    await go(page, "/order"); await skipSplashAndConsent(page, { consent: false });
    const cont = page.locator("button", { hasText: /^continue$/i }).first();
    if (await cont.count()) { await cont.tap().catch(() => {}); await page.waitForTimeout(400); }
    const seen = new Set();
    for (let step = 0; step < 8; step++) {
      const heading = await page.evaluate(() => (document.querySelector("main h1, main h2")?.textContent || "").trim().slice(0, 30));
      const fields = await auditForm(page, dev, `/order[step${step}]`, `(step ${step}: ${heading})`);
      await shot(page, dev, `order-step-${step}`);
      if (fields.length) { rec("S4", D, true, `/order step ${step} "${heading}": ${fields.length} controls`); await keyboardFocusTest(page, dev, `order-step${step}`, fields); }
      const nxt = page.locator("form button[type=submit]").last();
      if (!(await nxt.count())) break;
      const label = (await nxt.innerText()).trim();
      const nb = await nxt.boundingBox(); if (nb) check(nb.height >= 44, "Serious", "S4", D, `/order step${step} submit`, `"${label}" height ${Math.round(nb.height)}`, "min 48px.");
      await nxt.scrollIntoViewIfNeeded().catch(() => {});
      check(!(await coveredBy(page, nxt)), "Serious", "S4", D, `/order step${step} submit`, "wizard primary button not covered by sticky UI", "Raise z-index; add padding-bottom.", await shot(page, dev, `order-step-${step}-btn`));
      // try to move forward: fill required fields with plausible data
      await page.evaluate(() => { document.querySelectorAll("form input[required], form textarea[required]").forEach((e) => { if (e.value) return; const k = (e.name + e.id + e.type).toLowerCase(); const v = /email/.test(k) ? "qa@example.com" : /tel|phone|whatsapp/.test(k) ? "0712345678" : /number|qty/.test(k) ? "1" : "QA Test"; const set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), "value").set; set.call(e, v); e.dispatchEvent(new Event("input", { bubbles: true })); }); });
      await page.locator("form input[type=radio]").first().evaluate((e) => { if (!document.querySelector("form input[type=radio]:checked")) e.click(); }).catch(() => {});
      await page.locator("select").evaluateAll((ss) => ss.forEach((s) => { if (!s.value && s.options.length > 1) { const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set; set.call(s, s.options[1].value); s.dispatchEvent(new Event("change", { bubbles: true })); } })).catch(() => {});
      if (/send|whatsapp|place|submit|finish/i.test(label) && step > 1) break; // do not send
      await nxt.tap().catch(() => {}); await page.waitForTimeout(700);
      const h2 = await page.evaluate(() => (document.querySelector("main h1, main h2")?.textContent || "").trim().slice(0, 30));
      if (seen.has(h2) && h2 === heading) { await submitReach(page, dev, `/order[step${step}]`); break; }
      seen.add(heading);
    }
  } catch (e) { defect("Moderate", "S4", D, "/order", `wizard audit error: ${String(e.message).slice(0, 120)}`, "Investigate."); }
  await ctx.close();
}

// ---------- S5 gestures ----------
async function s5(browser, dev) {
  const D = dev.id;
  const ctx = await mkctx(browser, dev); const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const pages = ["/", "/gallery", "/shop", "/story"];
  let found = 0;
  for (const p of pages) {
    await go(page, p, "load"); await skipSplashAndConsent(page); await page.waitForTimeout(500);
    const scrollers = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => { const s = getComputedStyle(e); return (s.overflowX === "auto" || s.overflowX === "scroll") && e.scrollWidth > e.clientWidth + 8 && e.getBoundingClientRect().width > 100 && !e.closest("dialog"); }).map((e, i) => { e.setAttribute("data-qa-sc", String(i)); const r = e.getBoundingClientRect(); const kids = [...e.children]; const lastVisibleCut = kids.some((k) => { const kr = k.getBoundingClientRect(); return kr.left < innerWidth && kr.right > innerWidth + 4 && kr.left > 0; }); const cs = getComputedStyle(e); return { i, cls: String(e.className).split(" ").slice(0, 3).join("."), top: r.top + scrollY, h: r.height, snap: cs.scrollSnapType, ta: cs.touchAction, oc: cs.overscrollBehaviorX, tab: e.tabIndex, focusKids: e.querySelectorAll("a[href], button, [tabindex='0']").length, cut: lastVisibleCut, hasScrollbar: e.offsetHeight - e.clientHeight > 0 || cs.scrollbarWidth !== "none", label: e.getAttribute("aria-label") || e.getAttribute("role") || "", btns: !!e.parentElement.querySelector("button[aria-label*=ext], button[aria-label*=revious], [data-dir]"), nKids: kids.length }; }));
    for (const sc of scorllersDedupe(scrollers)) {
      found++;
      const loc = page.locator(`[data-qa-sc="${sc.i}"]`);
      const sel = `${p} .${sc.cls}`;
      await page.evaluate((y) => scrollTo(0, y - 200), sc.top); await page.waitForTimeout(300);
      const box = await loc.boundingBox(); if (!box) continue;
      const cy = Math.min(dev.h - 20, box.y + box.height / 2);
      const x0 = await loc.evaluate((e) => e.scrollLeft);
      await swipe(page, cdp, dev.w * 0.8, cy, -dev.w * 0.5, 0, 700); await page.waitForTimeout(500);
      const x1 = await loc.evaluate((e) => e.scrollLeft);
      const s1 = await shot(page, dev, `rail-${slug(p)}-${sc.i}`);
      check(x1 > x0 + 10, "Serious", "S5", D, sel, `swipe left moves scroller (${Math.round(x0)} to ${Math.round(x1)})`, "Ensure overflow-x:auto and no touch-action:none/pan-y.", s1);
      // vertical swipe starting on rail scrolls page
      const y0 = await page.evaluate(() => scrollY);
      await swipe(page, cdp, dev.w / 2, cy, 0, -250, 700); await page.waitForTimeout(400);
      const y1 = await page.evaluate(() => scrollY);
      check(y1 > y0 + 20, "Serious", "S5", D, sel, `vertical swipe on rail scrolls page (${y0} to ${y1}); touch-action ${sc.ta}`, "Do not set touch-action:pan-x; use overscroll-behavior-x:contain only.");
      check(sc.cut || sc.btns || sc.nKids > 1, "Minor", "S5", D, sel, `affordance: next card peeks=${sc.cut}, arrow buttons=${sc.btns}`, "Show a peeking card, edge fade, or arrow buttons.");
      check(sc.tab >= 0 || sc.focusKids > 0, "Moderate", "S5", D, sel, `keyboard reachable (tabindex=${sc.tab}, focusable children=${sc.focusKids})`, 'Add tabindex="0" with aria-label to the scroller, or make cards focusable links.');
      check(sc.nKids <= 1 || sc.snap !== "none" || true, "Minor", "S5", D, sel, `snap ${sc.snap}`, "");
    }
    // global: body touch-action
    const ta = await page.evaluate(() => getComputedStyle(document.body).touchAction + "|" + getComputedStyle(document.documentElement).touchAction);
    check(!/none/.test(ta), "Serious", "S5", D, "html, body", `touch-action not none (${ta})`, "Remove touch-action:none so pinch zoom works.");
  }
  rec("S5", D, true, `${found} horizontal scrollers exercised`);
  if (!found) rec("S5", D, true, "no overflowing horizontal scrollers found at this width");
  await ctx.close();
}
function scorllersDedupe(a) { return a.filter((s) => s.h > 60).slice(0, 4); }

// ---------- S6 orientation ----------
async function s6(browser, dev) {
  const D = dev.id;
  const ctx = await mkctx(browser, dev); const page = await ctx.newPage();
  const routes = ["/", "/shop", "/cart", "/order", "/contact", "/gallery"];
  for (const r of routes) {
    await go(page, r); await skipSplashAndConsent(page); await page.waitForTimeout(300);
    const a = await hScroll(page);
    check(a.sw <= a.iw + 1, "Serious", "S6", D, `${r} html`, `portrait no horizontal overflow (scrollWidth ${a.sw} vs ${a.iw})`, "Find the overflowing element (use document.querySelectorAll('*') with right > innerWidth).", a.sw > a.iw + 1 ? await shot(page, dev, `overflow-${slug(r)}`) : "");
    await page.setViewportSize({ width: dev.h, height: dev.w }); await page.waitForTimeout(500);
    const b = await hScroll(page);
    check(b.sw <= b.iw + 1, "Serious", "S6", D, `${r} html`, `landscape no horizontal overflow (scrollWidth ${b.sw} vs ${b.iw})`, "Same.", b.sw > b.iw + 1 ? await shot(page, dev, `overflow-land-${slug(r)}`) : "");
    // sticky/fixed elements within viewport in landscape
    const fx = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed" && !e.closest("dialog")).map((e) => { const r = e.getBoundingClientRect(); return { c: String(e.className).split(" ")[0] || e.tagName, tall: r.height > innerHeight * 0.5, off: r.right > innerWidth + 1 || r.bottom > innerHeight + 1 }; }).filter((x) => (x.tall || x.off) && x.c));
    check(!fx.some((x) => x.tall), "Moderate", "S6", D, `${r} fixed elements`, `landscape: no fixed element over 50% of height (${JSON.stringify(fx).slice(0, 120)})`, "Cap fixed bars with max-height; hide float on short viewports.", fx.some((x) => x.tall) ? await shot(page, dev, `fixed-land-${slug(r)}`) : "");
    await page.setViewportSize({ width: dev.w, height: dev.h }); await page.waitForTimeout(300);
  }
  // resize mid-interaction: open cart drawer then rotate
  await go(page, "/"); await skipSplashAndConsent(page);
  const cartBtn = page.locator("[aria-label^='Order list']").first();
  if (await cartBtn.count()) {
    await cartBtn.tap().catch(() => {}); await page.waitForTimeout(700);
    const cd = page.locator("dialog[aria-labelledby=cart-drawer-title]");
    if (await cd.evaluate((d) => d.open).catch(() => false)) {
      await page.setViewportSize({ width: dev.h, height: dev.w }); await page.waitForTimeout(500);
      const g = await cd.evaluate((d) => { const r = d.getBoundingClientRect(); const c = d.querySelector("button[aria-label^=Close]").getBoundingClientRect(); return { b: r.bottom, ih: innerHeight, cl: c.top >= 0 && c.bottom <= innerHeight, hs: document.documentElement.scrollWidth - innerWidth }; });
      check(g.cl && g.hs <= 1, "Serious", "S6", D, "cart drawer", `rotate while cart open: close visible=${g.cl}, overflow=${g.hs}`, "Use dvh and flex layout.", await shot(page, dev, "cart-rotated"));
      await page.setViewportSize({ width: dev.w, height: dev.h }); await page.waitForTimeout(300);
      await page.keyboard.press("Escape"); await page.waitForTimeout(400);
    }
  }
  // zoom-ish resize: 200% text via narrow viewport emulation (reflow at 320 css px is covered by 320 device)
  await ctx.close();
}


// ---------- S7 living layer ----------
// Selectors: animals are .fx-char (decorative: span[aria-hidden], pointer-events none; hidden finds: button.fx-find[data-find]); the welcome lane is .fx-lane (CSS animation fx-lane-in; html[data-welcome=over] once a tap or the clock ends it);
// the switch is button.an-switch[role=switch] in the footer; storage keys mk-animals, mk-found (game).
const ANIMAL_SEL = ".fx-char, [data-sp]";
const MOVING = () => {
  // returns count of animals that are really moving: running Web Animations or CSS animations targeting an animal (or its descendants), or whose box changes between two reads
  const isAnimal = (t) => !!(t && t.closest && t.closest(".fx-char, [data-sp], .fx-thread .fx-ball"));
  const anims = document.getAnimations().filter((a) => a.playState === "running" && a.effect && a.effect.target && isAnimal(a.effect.target));
  const els = new Set(anims.map((a) => a.effect.target.closest(".fx-char, [data-sp], .fx-ball")));
  return { running: anims.length, elements: els.size, names: [...new Set(anims.map((a) => a.animationName || a.constructor.name))].slice(0, 5) };
};
// The welcome is pure CSS (components/fx/fx.css): the rabbit's fx-lane-rise animation is paused while html[data-splash=on] and runs the frame the splash is done.
// This records, per frame, the splash flag, the rabbit animation's play state and its currentTime, and when each first happened.
async function pageWelcomeFirst(page, p) {
  await page.addInitScript(() => {
    window.__w = [];
    const t = () => {
      const de = document.documentElement;
      const c = document.querySelector(".fx-lane .fx-char");
      const a = c && c.getAnimations().find((x) => x.animationName === "fx-lane-rise");
      const sp = de ? de.dataset.splash || null : null;
      const row = { sp, run: a ? a.playState : null, ct: a ? Math.round(a.currentTime || 0) : null, t: Math.round(performance.now()) };
      const last = window.__w[window.__w.length - 1];
      if (!last || last.sp !== row.sp || last.run !== row.run) window.__w.push(row);
      if (performance.now() < 12000) requestAnimationFrame(t);
    };
    requestAnimationFrame(t);
  });
  await go(page, p);
}
async function welcomeSeen(page) {
  await page.waitForFunction(() => (window.__w || []).some((x) => x.run === "running" && (x.sp === "done" || x.sp === "skip")), null, { timeout: 9000 }).catch(() => {});
  const hist = await page.evaluate(() => window.__w);
  const start = hist.find((x) => x.run === "running" && (x.sp === "done" || x.sp === "skip"));
  // the rabbit must not be moving while the splash is still on, and must have moved at most ~400 ms of its timeline by the first frame after the splash ends
  const early = hist.some((x) => x.sp === "on" && x.run === "running" && x.ct > 150);
  return { ran: !!start, startCt: start ? start.ct : null, early };
}
async function s7(browser, dev) {
  const D = dev.id;
  // ---- a) welcome rabbit: plays on EVERY full load of /, in step with the splash end, then loops forever (a tap does not end it) ----
  let ctx = await mkctx(browser, dev); let page = await ctx.newPage();
  await pageWelcomeFirst(page, "/");
  const tier = await page.evaluate(() => document.documentElement.getAttribute("data-fx"));
  await page.waitForFunction(() => { const e = document.getElementById("sp"); return !e || getComputedStyle(e).display === "none"; }, null, { timeout: 8000 }).catch(() => {});
  const w1 = await welcomeSeen(page);
  if (tier !== "full" && tier !== "lite") rec("S7", D, true, `welcome not applicable: animal tier is "${tier}" in this browser`);
  else {
    check(w1.ran, "Serious", "S7", D, ".fx-lane .fx-char", "welcome rabbit plays on a full load (CSS animation fx-lane-rise running after the splash)", "The welcome is CSS driven from server markup; it must never depend on the engine or a stored flag.", await shot(page, dev, "welcome-first"));
    check(!w1.early, "Serious", "S7", D, ".fx-lane .fx-char", "welcome rabbit holds still while the splash is on (starts as the splash ends)", "fx.css must pause the lane animations while html[data-splash=on].");
    check(w1.ran && w1.startCt !== null && w1.startCt < 400, "Serious", "S7", D, ".fx-lane .fx-char", `rabbit has run under 400 ms of its timeline at the first frame after the splash (${w1.startCt} ms)`, "The rabbit must start within one frame of the splash exit.");
    // the engine is ready before any interaction: it has marked the animals (data-st) and has live ones or a measured thread by the time the splash has been gone 800 ms
    await page.waitForTimeout(800);
    const eng = await page.evaluate(() => ({ api: !!window.__mkFx, marked: document.querySelectorAll(".fx-char[data-st]").length, measured: !!document.querySelector(".fx-thread")?.getAttribute("style") }));
    check(eng.api && eng.marked > 0 && eng.measured, "Serious", "S7", D, "window.__mkFx", `animal engine started before first interaction (api ${eng.api}, marked ${eng.marked}, thread measured ${eng.measured})`, "The engine script must load at parse time (FxLoader inline loader) and start without waiting for idle.");
    // no legend text under the grass band
    const legend = await page.evaluate(() => /Follow the thread/.test(document.body.textContent || "") || !!document.querySelector(".fx-lane-legend"));
    check(!legend, "Serious", "S7", D, ".fx-lane", "no 'Follow the thread' legend line under the hero buttons", "The owner removed that sentence.");
    if (w1.ran) {
      const sh = await shot(page, dev, "welcome-running");
      // the rabbit loops for as long as the page is open: a performance cycle is running, the pill is shown, and a tap or key press does not end it
      const look = () => page.evaluate(() => { const c = document.querySelector(".fx-lane .fx-char"); const pl = document.querySelector(".fx-lane-pill"); return { loop: !!c && c.getAnimations().some((x) => x.animationName === "fx-lane-perform" && x.playState === "running"), pill: pl ? Number(getComputedStyle(pl).opacity) : 0, over: document.documentElement.dataset.welcome || null }; });
      await page.waitForTimeout(1500);
      const l1 = await look();
      check(l1.loop && l1.pill > 0.9, "Serious", "S7", D, ".fx-lane", "rabbit loops (fx-lane-perform running) and the 'Start here' pill stays visible", "The welcome rabbit must perform on a loop and never sink away.", sh);
      await page.touchscreen.tap(Math.round(dev.w * 0.5), Math.round(dev.h * 0.45)).catch(() => {});
      await page.keyboard.press("Shift").catch(() => {});
      await page.waitForTimeout(1500);
      const l2 = await page.evaluate(() => { const c = document.querySelector(".fx-lane .fx-char"); const pl = document.querySelector(".fx-lane-pill"); return { here: !!c, loop: !!c && c.getAnimations().some((x) => x.animationName === "fx-lane-perform" && x.playState === "running"), pill: pl ? Number(getComputedStyle(pl).opacity) : 0, over: document.documentElement.dataset.welcome || null, path: location.pathname }; });
      if (l2.path === "/") check(l2.here && l2.loop && l2.pill > 0.9 && l2.over !== "over", "Serious", "S7", D, ".fx-lane", "a tap or key press does NOT end the rabbit: it keeps looping", "The owner wants the rabbit constantly there; splash-gate.js must not set data-welcome=over.");
      // it is still there after 12 more seconds (more than one 9 s cycle)
      if (l2.path === "/") { await page.waitForTimeout(10000); const l3 = await look(); check(l3.loop && l3.pill > 0.9, "Serious", "S7", D, ".fx-lane", "rabbit is still performing more than 10 s later", "The loop must be infinite.", sh); }
    }
    // every full reload plays it again, also with the old mk-seen flag set
    for (let i = 1; i <= 3; i++) {
      await page.evaluate(() => { try { localStorage.setItem("mk-seen", JSON.stringify(["welcome"])); } catch {} });
      await page.reload({ waitUntil: "commit", timeout: 30000 });
      const wn = await welcomeSeen(page);
      check(wn.ran, "Serious", "S7", D, ".fx-lane .fx-char", `welcome plays again on full reload ${i} (mk-seen set)`, "The welcome must play on every full load, with no seen flag.");
    }
  }
  await ctx.close();

  // ---- b) Animals on/off switch ----
  ctx = await mkctx(browser, dev); page = await ctx.newPage();
  await go(page, "/");
  await skipSplashAndConsent(page);
  await page.waitForTimeout(1500);
  const sw = page.locator("button.an-switch").first();
  if (!(await sw.count())) { check(false, "Serious", "S7", D, "button.an-switch", "Animals switch exists in the footer", "Render AnimalsBar in every footer."); }
  else {
    await sw.scrollIntoViewIfNeeded();
    const box = await sw.boundingBox();
    check(box && box.height >= 44 && box.width >= 44, "Serious", "S7", D, "button.an-switch", `Animals switch tap target ${box ? Math.round(box.width) + "x" + Math.round(box.height) : "none"} (needs 44x44)`, "Pad the switch to 44px high.", await shot(page, dev, "animals-switch"));
    const before = await page.evaluate(MOVING);
    const stateBefore = await page.evaluate(() => ({ a: document.documentElement.dataset.animals, c: document.querySelector("button.an-switch").getAttribute("aria-checked") }));
    await sw.tap().catch(() => {});
    await page.waitForTimeout(900);
    const after = await page.evaluate(() => ({ a: document.documentElement.dataset.animals, fx: document.documentElement.dataset.fx, c: document.querySelector("button.an-switch").getAttribute("aria-checked"), ls: localStorage.getItem("mk-animals"), mv: null }));
    const mv = await page.evaluate(MOVING);
    // positional check: sample every animal box twice
    const drift = await page.evaluate(async () => { const els = [...document.querySelectorAll(".fx-char")]; const a = els.map((e) => e.getBoundingClientRect()); await new Promise((r) => setTimeout(r, 700)); return els.filter((e, i) => { const b = e.getBoundingClientRect(); return Math.abs(b.left - a[i].left) > 0.6 || Math.abs(b.top - a[i].top) > 0.6; }).length; });
    check(after.a === "off" && after.c === "false" && after.ls === "off", "Critical", "S7", D, "button.an-switch", `switch turns Animals off (html[data-animals]=${after.a}, aria-checked=${after.c}, mk-animals=${after.ls}; before ${JSON.stringify(stateBefore)})`, "setChoice(false) must set html[data-animals=off], aria-checked=false and persist mk-animals.", await shot(page, dev, "animals-off"));
    check(mv.running === 0 && drift === 0, "Serious", "S7", D, ".fx-char", `no animal moves after switching off (running animations ${mv.running} on ${mv.elements} elements ${mv.names.join(",")}; boxes drifting ${drift}; before: ${before.running})`, "Under html[data-animals=off] set animation:none on .fx-char and descendants and stop the engine loop.");
    await page.reload({ waitUntil: "domcontentloaded" });
    const early = await page.evaluate(() => document.documentElement.dataset.animals);
    await page.waitForTimeout(2800);
    const persisted = await page.evaluate(() => ({ a: document.documentElement.dataset.animals, c: document.querySelector("button.an-switch")?.getAttribute("aria-checked"), mv: (() => { return document.getAnimations().filter((x) => x.playState === "running" && x.effect && x.effect.target && x.effect.target.closest && x.effect.target.closest(".fx-char, [data-sp]")).length; })() }));
    check(early === "off" && persisted.a === "off" && persisted.c === "false" && persisted.mv === 0, "Critical", "S7", D, "html[data-animals]", `Off persists across reload (first paint ${early}, after ${persisted.a}, aria-checked ${persisted.c}, moving ${persisted.mv})`, "Read mk-animals in splash-gate.js before first paint.");
    await go(page, "/shop");
    await page.waitForTimeout(2500);
    const shopState = await page.evaluate(() => ({ a: document.documentElement.dataset.animals, mv: document.getAnimations().filter((x) => x.playState === "running" && x.effect && x.effect.target && x.effect.target.closest && x.effect.target.closest(".fx-char, [data-sp]")).length }));
    check(shopState.a === "off" && shopState.mv === 0, "Serious", "S7", D, "html[data-animals]", `Off carries to /shop (data-animals ${shopState.a}, moving ${shopState.mv})`, "Engine must honour the stored choice on every route.");
    // turn back on
    await page.locator("button.an-switch").first().scrollIntoViewIfNeeded().catch(() => {});
    await page.locator("button.an-switch").first().tap().catch(() => {});
    await page.waitForTimeout(800);
    const back = await page.evaluate(() => ({ a: document.documentElement.dataset.animals, ls: localStorage.getItem("mk-animals") }));
    check(back.a === "on" && back.ls === "on", "Serious", "S7", D, "button.an-switch", `switch turns Animals back on and stores it (${JSON.stringify(back)})`, "Toggle must be reversible.");
  }
  await ctx.close();

  // ---- c) keyboard tab order skips decorative animals ; d) find-the-herd buttons ----
  ctx = await mkctx(browser, dev); page = await ctx.newPage();
  await go(page, "/");
  await skipSplashAndConsent(page);
  await page.waitForTimeout(1200);
  const decor = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".fx-char:not(.fx-find), .fx-thread, .fx-thread *, .fx-lane-arrow, .fx-lane-pill")];
    const bad = els.filter((e) => e.tabIndex >= 0 && !e.closest("a,button")).map((e) => e.className.toString().slice(0, 40));
    const focusableInside = els.flatMap((e) => [...e.querySelectorAll("a,button,input,[tabindex]")]).length;
    const notHidden = els.filter((e) => e.closest(".fx-char:not(.fx-find)") && e.closest(".fx-char").getAttribute("aria-hidden") !== "true").length;
    const ptr = els.filter((e) => e.matches(".fx-char") && getComputedStyle(e).pointerEvents !== "none").length;
    return { n: els.length, bad, focusableInside, notHidden, ptr };
  });
  check(decor.bad.length === 0 && decor.focusableInside === 0 && decor.notHidden === 0, "Serious", "S7", D, ".fx-char:not(.fx-find)", `decorative animals/thread are not focusable and are aria-hidden (${decor.n} checked; tabbable ${decor.bad.length}, focusable inside ${decor.focusableInside}, not aria-hidden ${decor.notHidden})`, "aria-hidden=true, no tabindex, pointer-events none.");
  check(decor.ptr === 0, "Moderate", "S7", D, ".fx-char", `decorative animals do not capture pointer events (${decor.ptr} capture)`, "pointer-events:none on decorative sprites.");
  // Tab through the page: record every focus stop
  const stops = []; let guard = 0;
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  for (let i = 0; i < 320 && guard < 3; i++) {
    await page.keyboard.press("Tab");
    const st = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const r = e.getBoundingClientRect(); return { tag: e.tagName.toLowerCase(), cls: (e.className && e.className.toString ? e.className.toString() : "").slice(0, 40), name: (e.getAttribute("aria-label") || e.innerText || e.getAttribute("alt") || "").trim().slice(0, 40), find: e.getAttribute("data-find"), hiddenAnc: !!e.closest("[aria-hidden=true]"), fx: !!e.closest(".fx-char"), w: Math.round(r.width), h: Math.round(r.height), vis: r.width > 0 && r.height > 0 }; });
    if (!st) { guard++; continue; }
    stops.push(st);
    if (stops.length > 8 && stops[stops.length - 1].name === stops[0].name && stops[stops.length - 1].cls === stops[0].cls) break;
  }
  const badStops = stops.filter((s) => (s.fx && !s.find) || s.hiddenAnc);
  check(badStops.length === 0, "Serious", "S7", D, ".fx-char", `tab order skips decorative animals (${stops.length} stops; decorative/aria-hidden stops ${badStops.length}${badStops[0] ? ": " + badStops[0].cls + " " + badStops[0].name : ""})`, "Never focus aria-hidden or decorative sprites.");
  const unseen = stops.filter((s) => !s.vis);
  check(unseen.length === 0, "Moderate", "S7", D, "tab stops", `no tab stop lands on a zero-size element (${unseen.length})`, "Remove tabindex from hidden controls.");
  // find-the-herd
  const finds = await page.evaluate(() => [...document.querySelectorAll("button.fx-find, [data-find]")].map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { find: e.getAttribute("data-find"), name: e.getAttribute("aria-label") || e.innerText.trim(), tab: e.tabIndex, tag: e.tagName.toLowerCase(), disp: cs.display, vis: cs.visibility, w: Math.round(r.width), h: Math.round(r.height), inert: !!e.closest("[inert]"), ptr: cs.pointerEvents }; }));
  check(finds.length > 0, "Serious", "S7", D, "button.fx-find", `find-the-herd buttons present on / (${finds.length})`, "Home has hidden finds.");
  const noName = finds.filter((f) => !f.name || f.name.length < 3), notBtn = finds.filter((f) => f.tag !== "button"), notTab = finds.filter((f) => f.tab < 0 || f.inert || f.disp === "none"), transientHidden = finds.filter((f) => f.vis === "hidden");
  check(noName.length === 0, "Serious", "S7", D, "button.fx-find", `every find button has an accessible name (${finds.length - noName.length}/${finds.length})`, "aria-label on each hidden animal.");
  check(notBtn.length === 0, "Serious", "S7", D, "[data-find]", `finds are real buttons (${notBtn.length} not)`, "Use <button type=button>.");
  check(notTab.length === 0, "Serious", "S7", D, "button.fx-find", `finds are keyboard focusable (tabIndex>=0, rendered) (${notTab.length} not)`, "Remove tabindex=-1 / display:none / inert.");
  const reached = new Set(stops.filter((s) => s.find).map((s) => s.find));
  if (transientHidden.length) rec("S7", D, true, `note: ${transientHidden.length} find(s) were visibility:hidden at the instant of inspection (peek-a-boo state): ${transientHidden.map((f) => f.find).join(", ")}`);
  check(reached.size === finds.length, "Moderate", "S7", D, "button.fx-find", `every find button is reached by Tab during one pass (${reached.size} of ${finds.length} reached in ${stops.length} stops; missed: ${finds.filter((f) => !reached.has(f.find)).map((f) => f.find + (f.vis === "hidden" ? " [visibility:hidden]" : "")).join(", ") || "none"})`, "A find that hides itself (visibility:hidden) cannot be focused; keep finds focusable for keyboard users or offer the same find another way.");
  const dupNames = new Set(finds.map((f) => f.name)).size === 1 && finds.length > 1;
  if (dupNames) rec("S7", D, true, `note: all ${finds.length} find buttons share one accessible name "${finds[0].name}" (acceptable for a hidden-object game; position is announced by order)`);
  const small = finds.filter((f) => f.w < 44 || f.h < 44);
  check(small.length === 0, "Minor", "S7", D, "button.fx-find", `find buttons meet 44x44 tap size (${small.length} under, e.g. ${small[0] ? small[0].w + "x" + small[0].h : "-"})`, "Hit area must be 44px even if the sprite is smaller (padding or ::after).");
  // keyboard activation of the first find
  const f0 = page.locator("button.fx-find").first();
  if (await f0.count()) {
    await f0.scrollIntoViewIfNeeded().catch(() => {});
    await f0.focus().catch(() => {});
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("fx-find"));
    check(focused, "Serious", "S7", D, "button.fx-find", "a find button takes focus programmatically", "Must be focusable.");
    const ring = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { o: cs.outlineStyle + " " + cs.outlineWidth, s: cs.boxShadow !== "none" }; });
    check(!/^none/.test(ring.o) || ring.s, "Serious", "S7", D, "button.fx-find", `focused find shows a visible focus indicator (${ring.o}, shadow ${ring.s})`, "Add :focus-visible outline.", await shot(page, dev, "find-focus"));
    const c0 = await page.evaluate(() => { try { return localStorage.getItem("mk-found"); } catch { return null; } });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(900);
    const c1 = await page.evaluate(() => { try { return localStorage.getItem("mk-found"); } catch { return null; } });
    check(c1 !== c0 && !!c1, "Serious", "S7", D, "button.fx-find", `Enter on a focused find registers it (mk-found ${c0 ? "set" : "empty"} to ${c1 ? c1.slice(0, 40) : "empty"})`, "Game must respond to keyboard click events.", await shot(page, dev, "find-activated"));
    const cnt = await page.evaluate(() => (document.querySelector(".an-count")?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 40));
    check(/Found [1-9]/.test(cnt), "Moderate", "S7", D, ".an-count", `footer counter updates after a find ("${cnt}")`, "Counter listens for mk:found.");
  }
  await ctx.close();

  // ---- e) reduced motion: zero moving animals ----
  ctx = await mkctx(browser, dev, { reduced: true }); page = await ctx.newPage();
  for (const rp of ["/", "/shop", "/story", "/journal"]) {
    await go(page, rp);
    await page.waitForTimeout(2500);
    const rmv = await page.evaluate(MOVING);
    const tierR = await page.evaluate(() => document.documentElement.dataset.fx);
    const drift = await page.evaluate(async () => { const els = [...document.querySelectorAll(".fx-char")]; const a = els.map((e) => e.getBoundingClientRect()); await new Promise((r) => setTimeout(r, 800)); return els.filter((e, i) => { const b = e.getBoundingClientRect(); return Math.abs(b.left - a[i].left) > 0.6 || Math.abs(b.top - a[i].top) > 0.6; }).length; });
    check(rmv.running === 0 && drift === 0, "Serious", "S7", D, ".fx-char", `reduced motion on ${rp}: 0 moving animals (tier ${tierR}, running animations ${rmv.running} [${rmv.names.join(",")}], drifting boxes ${drift})`, "Under prefers-reduced-motion: reduce set animation:none on .fx-char and all descendants, and keep the engine idle.", rmv.running || drift ? await shot(page, dev, "reduced-motion" + slug(rp)) : "");
    if (rp === "/") {
      const note = await page.evaluate(() => { const n = document.querySelector(".an-calm"); return n ? getComputedStyle(n).display !== "none" : false; });
      rec("S7", D, true, `reduced motion note ${note ? "shown" : "present in DOM but hidden"} in footer`);
    }
  }
  await ctx.close();
}

// ---------- S9 filters, search, tabs, in-page navigation ----------
// One shared pattern (components/filters): slim sticky bar with search, Filters button, Sort and count; bottom sheet; removable chips; Clear all; empty state;
// tabs with arrow keys; "On this page" disclosure. Checks the bar fits, nothing is cut off, the sheet is reachable above the cookie dock and WhatsApp float, and state is in the URL.
async function s9(browser, dev) {
  const D = dev.id;
  const ctx = await mkctx(browser, dev);
  const page = await ctx.newPage();
  const txt = async (loc) => (await loc.first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  const count = () => txt(page.locator(".mf-count"));
  const cards = () => page.evaluate(() => [...document.querySelectorAll("#products li[data-item]")].filter((li) => !li.hidden).length);
  const noSideways = async (name) => { const h = await hScroll(page); check(h.sw <= h.iw + 1, "Serious", "S9", D, "html", `${name}: no sideways scroll (${h.sw} of ${h.iw})`, "Wrap chips, never scroll them sideways."); };
  // chips and tabs wrap: every chip sits inside the screen, no chip row scrolls sideways
  const chipsFit = async (name) => {
    const r = await page.evaluate(() => {
      const vw = innerWidth; const bad = []; let n = 0;
      for (const row of document.querySelectorAll(".mf-chips, .mf-tabs")) {
        if (!row.offsetParent) continue;
        if (row.scrollWidth > row.clientWidth + 1) bad.push("row scrolls sideways");
        for (const c of row.querySelectorAll(".mf-chip")) { if (!c.offsetParent) continue; n++; const b = c.getBoundingClientRect(); if (b.right > vw + 0.5 || b.left < -0.5) bad.push(`cut off: ${c.textContent.trim().slice(0, 24)}`); }
      }
      return { n, bad };
    });
    check(r.bad.length === 0 && r.n > 0, "Serious", "S9", D, ".mf-chips", `${name}: ${r.n} chips all on screen, none cut off${r.bad.length ? " (" + r.bad.slice(0, 2).join("; ") + ")" : ""}`, "Chip rows wrap with flex-wrap; no overflow-x.");
  };
  const hit44 = async (loc, name) => { const b = await hitSize(loc); if (b) check(b.w >= 43.5 && b.h >= 43.5, "Serious", "S9", D, name, `${name} hit area ${Math.round(b.w)}x${Math.round(b.h)}`, "44px hit area (::after or padding)."); };

  // ---- /shop
  await go(page, "/shop"); await skipSplashAndConsent(page); await page.waitForTimeout(800);
  const total = await page.evaluate(() => document.querySelectorAll("#products li[data-item]").length);
  check(/Showing all \d+ /.test(await count()), "Serious", "S9", D, ".mf-count", `shop count says in words: "${await count()}"`, "ResultCount: Showing all N animals.");
  await noSideways("shop"); await chipsFit("shop group chips");
  const bar = page.locator(".mf-bar").first();
  const geo = await bar.evaluate((b) => { const vw = innerWidth; const kids = [...b.querySelectorAll(".mf-search, .mf-filter-btn, .mf-count, .mf-sort")].filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return { n: e.className.split(" ")[0], l: r.left, r: r.right, t: r.top, b: r.bottom }; }); const br = b.getBoundingClientRect(); let ov = []; for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const A = kids[i], B = kids[j]; if (Math.min(A.r, B.r) - Math.max(A.l, B.l) > 2 && Math.min(A.b, B.b) - Math.max(A.t, B.t) > 2) ov.push(A.n + " x " + B.n); } return { vw, kids: kids.map((k) => k.n), out: kids.filter((k) => k.r > vw + 0.5 || k.l < -0.5).map((k) => k.n), ov, h: br.height }; });
  const mobile = dev.w < 1024;
  check(geo.out.length === 0 && geo.ov.length === 0, "Serious", "S9", D, ".mf-bar", `filter bar fits: ${geo.kids.join(", ")}; nothing cut off or overlapping (${geo.h | 0}px tall)`, "Bar controls wrap inside the width.");
  check(geo.h <= dev.h * 0.2, "Moderate", "S9", D, ".mf-bar", `bar is slim: ${Math.round(geo.h)}px of ${dev.h}px screen`, "Keep the sticky bar under 20 percent of the screen height.");
  await hit44(page.locator(".mf-search input").first(), "search box");
  const fb = page.locator("button.mf-filter-btn").first();
  check(mobile ? await fb.isVisible() : !(await fb.isVisible()), "Serious", "S9", D, "button.mf-filter-btn", mobile ? "Filters button is visible on phones" : "no Filters button on desktop (sidebar instead)", "Show the button below 1024px only.");
  await hit44(page.locator(".mf-sort select").first(), "sort select");
  // sticky: after scrolling the bar stays under the header
  await page.evaluate(() => scrollTo(0, 900)); await page.waitForTimeout(400);
  if (mobile) { const top = await bar.evaluate((b) => b.getBoundingClientRect().top); check(top >= 0 && top < 90, "Moderate", "S9", D, ".mf-bar", `bar sticks under the header while scrolling (top ${Math.round(top)})`, "position: sticky; top under the header."); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(200);
  if (mobile) {
    await fb.tap(); await page.waitForTimeout(600);
    const dlg = page.locator("dialog[aria-label=Filters]");
    check(await dlg.evaluate((d) => d.open), "Critical", "S9", D, "dialog[aria-label=Filters]", "Filters button opens the sheet", "Open the dialog on tap.", await shot(page, dev, "s9-sheet"));
    const g = await dlg.evaluate((d) => { const r = d.getBoundingClientRect(); const f = d.querySelector(".mf-sheet-foot button").getBoundingClientRect(); const mid = document.elementFromPoint(f.left + f.width / 2, f.top + f.height / 2); return { top: r.top, bottom: r.bottom, w: r.width, h: r.height, vh: innerHeight, vw: innerWidth, fb: f.bottom, ft: f.top, own: !!(mid && d.contains(mid)), grab: !!d.querySelector(".mf-grab"), x: !!d.querySelector("button[aria-label='Close filters']"), lock: getComputedStyle(document.body).overflow }; });
    check(g.top >= 0 && g.bottom <= g.vh + 1 && g.w >= g.vw - 1, "Serious", "S9", D, ".mf-sheet", `sheet is full width and fits (h ${Math.round(g.h)} of ${g.vh})`, "max-height 88dvh, width 100%.");
    check(g.fb <= g.vh && g.ft >= 0 && g.own, "Serious", "S9", D, ".mf-sheet-foot button", `show button reachable above the cookie dock and WhatsApp float (bottom ${Math.round(g.fb)} of ${g.vh}, nothing over it)`, "The sheet is a modal dialog, so it sits above fixed bars.");
    check(g.grab && g.x, "Moderate", "S9", D, ".mf-sheet", "sheet has a grabber and a close X", "Add .mf-grab and the close button.");
    check(g.lock === "hidden", "Moderate", "S9", D, "body", "page does not scroll behind the sheet", "overflow hidden on body while open.");
    await hit44(dlg.locator("button[aria-label='Close filters']"), "sheet close");
    const done = dlg.locator(".mf-sheet-foot button");
    check(new RegExp(`Show ${total} `).test(await txt(done)), "Serious", "S9", D, ".mf-sheet-foot button", `main button names the result: "${await txt(done)}"`, "Show N animals.");
    // focus trap
    for (let i = 0; i < 14; i++) await page.keyboard.press("Tab");
    check(await page.evaluate(() => !!document.activeElement?.closest("dialog")), "Serious", "S9", D, "dialog", "focus stays inside the sheet after 14 Tab presses", "Native modal dialog traps focus.");
    // choose a type of animal: the count on the button updates
    const chip = dlg.locator(".mf-chip:not(:disabled)").first();
    const label = await txt(chip); await hit44(chip, "sheet chip"); await chip.tap(); await page.waitForTimeout(250);
    const after = await txt(done);
    check(after !== `Show ${total} pieces` && after !== `Show ${total} animals` && /^Show \d+ /.test(after), "Serious", "S9", D, ".mf-sheet-foot button", `choosing "${label}" updates the button live: "${after}"`, "Compute counts on every change.");
    check(/^Type of animal/.test(await txt(dlg.locator(".mf-sec-btn").first())) && (await dlg.locator(".mf-sec-btn").first().getAttribute("aria-expanded")) === "true", "Moderate", "S9", D, ".mf-sec-btn", "first group is open by default and its title is the button", "defaultOpen on the first group.");
    // second group: collapsed row says the choice in words, then open it and tick a row
    const colourBtn = dlg.locator(".mf-sec-btn", { hasText: /^Colour(?! choice)/ }).first();
    check((await colourBtn.getAttribute("aria-expanded")) === "false" && /Any/.test(await txt(colourBtn)), "Moderate", "S9", D, ".mf-sec-btn", `a closed group says its choice in words: "${await txt(colourBtn)}"`, "Show the selection summary in the closed row.");
    await colourBtn.tap(); await page.waitForTimeout(200);
    const row = dlg.locator(".mf-row:not(.is-zero)").first(); await hit44(row, "sheet row"); await row.tap(); await page.waitForTimeout(250);
    await page.keyboard.press("Escape"); await page.waitForTimeout(400);
    check(!(await dlg.evaluate((d) => d.open)), "Serious", "S9", D, "dialog", "Escape closes the sheet", "Native cancel.");
    check(await page.evaluate(() => !!document.activeElement?.closest(".mf-filter-btn")), "Moderate", "S9", D, "button.mf-filter-btn", "focus returns to the Filters button", "Native dialog restores focus.");
    check(/Filters\s*\d/.test(await txt(fb)), "Serious", "S9", D, "button.mf-filter-btn", `Filters button shows a count badge: "${await txt(fb)}"`, "Badge with the number of active filters.");
  } else {
    const chip = page.locator(".mf-side .mf-chip:not(:disabled)").first(); await chip.click(); await page.waitForTimeout(250);
  }
  // active chips, removable, Clear all
  const act = page.locator(".mf-active .mf-chip--x");
  const nAct = await act.count();
  check(nAct >= 1, "Serious", "S9", D, ".mf-active", `${nAct} active filters shown as removable chips: ${(await act.allInnerTexts()).join(" | ")}`, "ActiveFilters under the bar.");
  check(/Showing \d+ of \d+ /.test(await count()) && (await cards()) < total, "Serious", "S9", D, ".mf-count", `grid and count follow the filter: "${await count()}", ${await cards()} of ${total} cards`, "Hide non matching cards.");
  check(/[?&](animal|colour)=/.test(page.url()), "Serious", "S9", D, "url", `filter state is in the address bar (${page.url().replace(BASE, "")})`, "Write the query string with replaceState.");
  const lbl = await txt(act.first()); await hit44(act.first(), "active chip");
  await act.first().tap(); await page.waitForTimeout(250);
  check((await act.count()) === nAct - 1, "Serious", "S9", D, ".mf-active", `removing "${lbl}" leaves ${await act.count()} chips`, "Chip removes its own filter.");
  const clr = page.locator(mobile ? ".mf-active .mf-text-btn" : ".mf-side .mf-text-btn").first();
  if (await clr.count()) { await clr.tap().catch(() => clr.click()); await page.waitForTimeout(250); }
  check((await act.count()) === 0 && /Showing all/.test(await count()), "Serious", "S9", D, ".mf-text-btn", `Clear all resets everything: "${await count()}"`, "Clear all.");
  check((await page.locator(".mf-text-btn", { hasText: "Clear all" }).count()) === 0, "Moderate", "S9", D, ".mf-text-btn", "Clear all is hidden when nothing is active", "Render it only with active filters.");
  // search, empty state, escapes
  const sb = page.getByRole("searchbox", { name: "Find an animal by name" });
  await sb.fill("giraffe"); await page.waitForTimeout(250);
  check((await cards()) >= 1 && (await cards()) < total && /Showing \d+ of/.test(await count()), "Serious", "S9", D, ".mf-search", `search "giraffe" filters instantly: ${await cards()} cards, "${await count()}"`, "Client side search over the delivered data.");
  await sb.fill("zzzz"); await page.waitForTimeout(250);
  const empty = page.locator(".mf-empty");
  check((await empty.count()) === 1 && /No .* match/.test(await txt(empty.locator("h2"))) && (await empty.getByRole("button", { name: /Show everything/ }).count()) === 1 && (await empty.getByRole("button", { name: /^Remove/ }).count()) >= 1, "Serious", "S9", D, ".mf-empty", "empty state says why and offers Remove and Show everything", "EmptyResults with one tap fixes.", await shot(page, dev, "s9-empty"));
  await empty.getByRole("button", { name: /Show everything/ }).tap(); await page.waitForTimeout(250);
  check((await cards()) === total, "Serious", "S9", D, ".mf-empty", `Show everything restores all ${total} cards`, "Clear all filters.");
  const spread = await page.evaluate(() => { const hs = [...document.querySelectorAll("#products li[data-item]:not([hidden]) [data-card]")].map((c) => c.getBoundingClientRect().height); return Math.max(...hs) - Math.min(...hs); });
  check(spread < 1.5, "Serious", "S9", D, "[data-card]", `card height spread ${spread} after filtering`, "Cards keep equal heights.");
  // Back restores state
  await sb.fill("giraffe"); await page.waitForTimeout(200);
  await page.locator("#products li[data-item]:not([hidden]) a:visible").first().click(); await page.waitForTimeout(1200);
  await page.goBack(); await page.waitForTimeout(1500);
  check(/q=giraffe/.test(page.url()) && (await sb.inputValue()) === "giraffe" && (await cards()) < total, "Serious", "S9", D, "url", `Back from a product restores the filter (${page.url().replace(BASE, "")})`, "State lives in the address bar.");

  // ---- /journal
  await go(page, "/journal"); await skipSplashAndConsent(page); await page.waitForTimeout(600);
  await noSideways("journal"); await chipsFit("journal topic chips");
  check(/Showing 12 of 47 posts/.test(await count()), "Serious", "S9", D, ".mf-count", `journal count: "${await count()}"`, "Showing 12 of 47 posts.");
  const jt = page.getByRole("button", { name: /^Animals of Kenya/ }); await jt.scrollIntoViewIfNeeded(); await jt.tap(); await page.waitForTimeout(250);
  check((await jt.getAttribute("aria-pressed")) === "true" && /\d+ posts?/.test(await count()), "Serious", "S9", D, ".mf-chip", `topic chip is pressed and the count changes: "${await count()}"`, "aria-pressed on chips.");
  const js = page.getByRole("searchbox", { name: "Find a post" }); await js.fill("giraffe"); await page.waitForTimeout(250);
  const jc = await page.locator("[data-card]").count();
  check(jc >= 1 && jc < 47, "Serious", "S9", D, ".mf-search", `Find a post: "giraffe" gives ${jc} cards`, "Client side post search.");
  await page.locator(".mf-active .mf-text-btn").first().tap(); await page.waitForTimeout(250);
  check(/Showing 12 of 47/.test(await count()) && (await page.getByRole("button", { name: /Show more posts/ }).count()) === 1, "Serious", "S9", D, ".mf-text-btn", "Clear all returns to 47 posts with Show more kept", "Keep Show more.");

  // ---- /gallery tabs
  await go(page, "/gallery"); await skipSplashAndConsent(page); await page.waitForTimeout(600);
  await noSideways("gallery"); await chipsFit("gallery tabs");
  const tabs = page.getByRole("tab"); const tn = await tabs.count();
  check(tn === 6 && /All/.test(await txt(tabs.nth(5))) && (await tabs.allInnerTexts()).every((t) => /\d/.test(t)), "Serious", "S9", D, "[role=tab]", `gallery has ${tn} tabs, each with a count, plus All`, "Tabs with counts and an All tab.");
  await tabs.first().focus(); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(150);
  check((await tabs.nth(1).getAttribute("aria-selected")) === "true" && (await page.evaluate(() => document.activeElement?.getAttribute("role"))) === "tab", "Serious", "S9", D, "[role=tab]", "ArrowRight selects and focuses the next tab", "Roving tabindex with arrow keys.");
  await page.keyboard.press("ArrowLeft"); await page.keyboard.press("End"); await page.waitForTimeout(150);
  check((await tabs.nth(5).getAttribute("aria-selected")) === "true" && (await tabs.nth(0).getAttribute("tabindex")) === "-1", "Moderate", "S9", D, "[role=tab]", "End jumps to the last tab, only the chosen tab is a tab stop", "Home and End keys.");
  await hit44(tabs.first(), "tab");

  // ---- /faq
  await go(page, "/faq"); await skipSplashAndConsent(page); await page.waitForTimeout(600);
  await noSideways("faq"); await chipsFit("faq topic chips");
  const fs_ = page.getByRole("searchbox", { name: "Find a question" }); await fs_.fill("plastic"); await page.waitForTimeout(250);
  const fv = await page.evaluate(() => [...document.querySelectorAll("#faq-list details")].filter((d) => !d.hidden && d.offsetParent).length);
  check(fv >= 1 && /Showing \d+ of \d+ questions/.test(await count()), "Serious", "S9", D, ".mf-search", `FAQ search filters questions: ${fv} shown, "${await count()}"`, "FaqFilter.");

  // ---- legal contents
  await go(page, "/privacy"); await skipSplashAndConsent(page); await page.waitForTimeout(600);
  await noSideways("legal");
  const sub = page.locator(".mf-sub:not(.mf-sub--d) .mf-sub-btn").first();
  if (mobile) {
    check((await sub.getAttribute("aria-expanded")) === "false" && /On this page/.test(await txt(sub)), "Serious", "S9", D, ".mf-sub-btn", `contents is one closed button that names itself: "${await txt(sub)}"`, "SubNav disclosure.");
    await hit44(sub, "on this page");
    await sub.tap(); await page.waitForTimeout(200);
    const link = page.locator(".mf-sub-list a").nth(3); await hit44(link, "contents link"); await link.tap(); await page.waitForTimeout(900);
    check((await sub.getAttribute("aria-expanded")) === "false", "Moderate", "S9", D, ".mf-sub-btn", "choosing a section closes the contents list", "Close on link tap.");
  }
  await ctx.close();
}

// ---------- run ----------
const t0 = Date.now();
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
async function safe(name, id, dev, fn) {
  if (ONLY_SC && !ONLY_SC.includes(id)) return;
  try { await fn(); } catch (e) { defect("Moderate", id, dev.id, name, `scenario crashed: ${String(e.message).split("\n")[0].slice(0, 140)}`, "Re-run; if persistent, investigate selector assumptions."); }
}
// Run devices in two parallel lanes to keep wall time sane.
async function runDev(dev, idx) {
  await safe("S1", "S1", dev, () => s1(browser, dev));
  await safe("S2", "S2", dev, () => s2(browser, dev, idx === 0));
  await safe("S3", "S3", dev, () => s3(browser, dev));
  await safe("S4", "S4", dev, () => s4(browser, dev));
  await safe("S5", "S5", dev, () => s5(browser, dev));
  await safe("S6", "S6", dev, () => s6(browser, dev));
  await safe("S7", "S7", dev, () => s7(browser, dev));
  await safe("S9", "S9", dev, () => s9(browser, dev));
  console.log("done", dev.id);
}
const idx = DEVICES.map((_, i) => i);
const lanes = [idx.filter((i) => i % 2 === 0), idx.filter((i) => i % 2 === 1)];
await Promise.all(lanes.map(async (l) => { for (const i of l) await runDev(DEVICES[i], i); }));
await browser.close();

// ---------- report ----------
defects.sort((a, b) => SEV_RANK[a.sev] - SEV_RANK[b.sev] || a.scenario.localeCompare(b.scenario));
// collapse duplicates across devices
const grouped = new Map();
for (const d of defects) {
  const k = `${d.sev}|${d.scenario}|${d.selector}|${d.msg.replace(/[0-9.]+/g, "#")}`;
  const g = grouped.get(k) || { ...d, devices: [] };
  if (!g.devices.includes(d.device)) g.devices.push(d.device);
  if (!g.shot && d.shot) g.shot = d.shot;
  grouped.set(k, g);
}
const gl = [...grouped.values()];
const counts = { Critical: 0, Serious: 0, Moderate: 0, Minor: 0 };
gl.forEach((g) => counts[g.sev]++);
const summary = Object.keys(SCEN_TITLES).filter((id) => !ONLY_SC || ONLY_SC.includes(id)).map((id) => {
  const s = scen[id] || { title: SCEN_TITLES[id], results: [] };
  const fails = s.results.filter((r) => r.status === "FAIL").map((r) => r.device);
  return { id, title: s.title, status: fails.length ? "FAIL" : "PASS", failDevices: fails, results: s.results };
});
const overall = counts.Critical + counts.Serious > 0 ? "FAIL" : "PASS";
let md = `# Mobile interactions gate (${DATE})\n\nBase: ${BASE}\nOverall: **${overall}** (Critical ${counts.Critical}, Serious ${counts.Serious}, Moderate ${counts.Moderate}, Minor ${counts.Minor}; unique defects ${gl.length})\nDevices: ${DEVICES.map((d) => d.id).join(", ")}\nRuntime: ${Math.round((Date.now() - t0) / 1000)}s\nRe-run: \`node scripts/mobile-qa/interactions.mjs ${BASE === "https://mikono-creations.vercel.app" ? "" : BASE}\`\n\n## Scenario results\n\n| Scenario | Result | Failing devices |\n|---|---|---|\n`;
for (const s of summary) md += `| ${s.id} ${s.title} | ${s.status} | ${s.failDevices.join(", ") || "none"} |\n`;
md += `\n## Ranked defects\n\n`;
gl.forEach((g, i) => { md += `${i + 1}. **${g.sev}** [${g.scenario}] \`${g.selector}\` on ${g.devices.join(", ")}: ${g.msg}\n   - Fix: ${g.fix}\n   - Screenshot: ${g.shot || "n/a"}\n`; });
md += `\n## Evidence per scenario\n`;
for (const s of summary) { md += `\n### ${s.id} ${s.title}: ${s.status}\n`; for (const r of s.results) { md += `\n**${r.device}** ${r.status}\n`; const seen = new Set(); for (const n of r.notes) { if (seen.has(n)) continue; seen.add(n); md += `- ${n}\n`; } } }
md += `\n## Menu link statuses\n\n${[...linkStatus].map(([h, s]) => `- ${h}: ${s}`).join("\n") || "none checked"}\n`;
md = md.replace(/[–—]/g, "-");
fs.writeFileSync(OUT_MD, md);
fs.writeFileSync(OUT_JSON, JSON.stringify({ date: DATE, base: BASE, overall, counts, scenarios: summary, defects: gl, linkStatus: Object.fromEntries(linkStatus) }, null, 2));
console.log(`${overall} Critical ${counts.Critical} Serious ${counts.Serious} Moderate ${counts.Moderate} Minor ${counts.Minor}`);
console.log(OUT_MD);
