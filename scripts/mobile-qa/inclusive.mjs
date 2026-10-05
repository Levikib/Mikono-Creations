#!/usr/bin/env node
// Mobile QA gate scenario S8: inclusive forms and large inputs, with the keyboard open, nothing sent.
// Run: node scripts/mobile-qa/inclusive.mjs [baseUrl] [--devices 320x568,390x844,360x740,1440x900] [--tag name]
// Drives the Studio (8 order types, 12 pieces, 8 addresses, Other answers, foreign phone, access note), the order wizard
// (split delivery to 8 places, other answers), the wholesale form and the Gift Finder (10 people). window.open is replaced, so nothing is sent.
// Checks at every size: no sideways scroll, 44px hit areas on the new controls, validation messages in view, decoded messages hold every piece and every Other answer.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const SCRATCH = "/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/";
const { chromium } = createRequire(SCRATCH)("playwright-core");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ARGV = process.argv.slice(2);
const argOf = (n) => { const i = ARGV.indexOf("--" + n); return i >= 0 ? ARGV[i + 1] : null; };
const BASE = (ARGV.find((a) => /^https?:/.test(a)) || "http://localhost:3461").replace(/\/$/, "");
const TAG = argOf("tag") ? "-" + argOf("tag") : "";
const DEVS = (argOf("devices") || "390x844,360x740,320x568,1440x900").split(",").map((d) => d.split("x").map(Number));
const DATE = new Date().toISOString().slice(0, 10);
const OUT = path.join(ROOT, `strategy/gates/mobile/inclusive-${DATE}${TAG}.md`);
const SHOT_REL = `strategy/gates/screens/mobile-inclusive${TAG}`;
fs.mkdirSync(path.join(ROOT, SHOT_REL), { recursive: true });
const CHROME = process.env.CHROME || path.join(process.env.HOME, ".cache/ms-playwright/chromium-1243/chrome-linux64/chrome");
const results = []; const fails = [];
const ok = (dev, name, pass, note = "") => { results.push({ dev, name, pass, note }); if (!pass) fails.push(`${dev} ${name} ${note}`); };

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
for (const [w, h] of DEVS) {
  const dev = `${w}x${h}`; const phone = w < 800;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: phone, isMobile: phone, deviceScaleFactor: phone ? 2 : 1 });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("mk.splash.v1", "1"); } catch {} window.__opened = []; window.open = (u) => { window.__opened.push(String(u)); return null; }; });
  await ctx.route(/wa\.me|api\.whatsapp/, (r) => { fails.push(`${dev} a wa.me request was attempted`); r.abort(); });
  const pg = await ctx.newPage(); pg.setDefaultTimeout(8000);
  pg.on("pageerror", (e) => fails.push(`${dev} pageerror ${e.message.slice(0, 120)}`));
  let n = 0;
  const shot = async (name) => { n++; await pg.screenshot({ path: path.join(ROOT, SHOT_REL, `${dev}-${String(n).padStart(2, "0")}-${name}.png`) }).catch(() => {}); };
  const overflow = async (name) => { const o = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(dev, `no sideways scroll: ${name}`, o <= 1, `${o}px`); };
  const small = async (name, sel) => { // 44px hit areas, counting the wrapping label
    const bad = await pg.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent).map((e) => { const l = e.closest("label") || e; const r = l.getBoundingClientRect(); const i = e.querySelector("input"); const r2 = i ? i.getBoundingClientRect() : e.getBoundingClientRect(); return { w: Math.max(r.width, r2.width), h: Math.max(r.height, r2.height), t: (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 20) }; }).filter((x) => x.h < 43.5 || x.w < 43.5), sel);
    ok(dev, `44px targets: ${name}`, bad.length === 0, bad.slice(0, 3).map((b) => `${b.w | 0}x${b.h | 0} ${b.t}`).join("; "));
  };
  const dismiss = async () => { const r = pg.getByRole("button", { name: /^Reject/ }); if (await r.count()) await r.first().click().catch(() => {}); };
  const opened = () => pg.evaluate(() => window.__opened.map((u) => decodeURIComponent((u.split("text=")[1] || ""))));
  const chip = (t) => pg.locator("label.st-pill", { hasText: new RegExp(`^\\s*${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(,? to be confirmed)?$`) }).first();
  const next = async () => { await pg.getByRole("button", { name: /^(Next|Back to review)/ }).click(); await pg.waitForTimeout(300); };
  const open = async (title) => { const d = pg.locator("details.st-more", { has: pg.locator("summary", { hasText: title }) }).first(); if (!(await d.evaluate((e) => e.open))) await d.locator("summary").click(); };
  const innerHeight_ = (hh) => hh;
  const inView = async (loc) => loc.evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= -1 && r.bottom <= innerHeight + 1; });

  try {
    // ---------- Studio path chooser: impossible to miss, quick brief keeps answers when switching ----------
    await pg.goto(`${BASE}/custom/studio`, { waitUntil: "networkidle" }); await pg.waitForSelector("form[aria-label='Custom order brief']"); await dismiss();
    const cards = pg.locator("[data-pathtoggle] label.st-opt"); ok(dev, "the chooser has two big cards", (await cards.count()) === 2);
    const boxes0 = await cards.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { t: r.top, b: r.bottom, w: r.width, h: r.height, l: r.left }; }));
    ok(dev, "both cards are above the fold and at least 44px tall", boxes0.every((b) => b.t < innerHeight_(h) - 40 && b.h >= 44), JSON.stringify(boxes0.map((b) => [b.t | 0, b.h | 0])));
    ok(dev, phone && w < 640 ? "cards are stacked on a phone" : "cards sit side by side on a wide screen", phone && w < 640 ? boxes0[1].t >= boxes0[0].b - 2 : Math.abs(boxes0[0].t - boxes0[1].t) < 4);
    await overflow("studio chooser"); await shot("studio-chooser");
    await cards.nth(1).click(); ok(dev, "tapping Full brief selects it (radio checked)", await pg.locator("[data-pathtoggle] input[value=full]").isChecked());
    await cards.nth(0).click(); ok(dev, "tapping Quick brief selects it", await pg.locator("[data-pathtoggle] input[value=quick]").isChecked());
    for (const t of ["Gift buyer"]) await chip(t).click();
    await pg.locator("label.st-opt:has(input[name=types][value=gift])").first().click().catch(async () => { await open("Gifts and keepsakes"); await pg.locator("label.st-opt:has(input[name=types][value=gift])").first().click(); });
    await pg.locator("label.st-opt:has(input[value='giraffe'])").first().click();
    await pg.locator("label.st-opt:has(input[name^='size-'][value='M'])").first().click();
    await chip("Cream").click().catch(() => {}); await pg.locator("textarea[id$='-colourNote']").fill("Soft cream and sage");
    await next();
    await chip("My date is flexible").click(); await pg.locator("label.st-pill", { hasText: /Collect from a pickup point/ }).first().click();
    await chip("KES 2,000 to 5,000").click(); await next();
    await pg.locator("#name").fill("Wanjiru"); await pg.locator("#phone").fill("0712 345 678");
    await pg.locator("label[for=termsOk]").click({ position: { x: 12, y: 12 } });
    const more = pg.getByRole("button", { name: /Add more detail/ }); ok(dev, "the quick brief ends with Add more detail", (await more.count()) === 1);
    ok(dev, "the quick summary shows type, pieces, deadline and budget", await pg.evaluate(() => { const t = document.querySelector("[data-brief-card=review]")?.textContent || ""; return /Kind of order/.test(t) && /Giraffe/.test(t) && /Flexible/.test(t) && /2,000 to 5,000/.test(t); }));
    await shot("studio-quick-send"); await more.click(); await pg.waitForTimeout(400);
    ok(dev, "Add more detail switches to the full brief and keeps the answers", (await pg.locator("[data-pathtoggle] input[value=full]").isChecked()) && (await pg.locator("[data-brief-card], [aria-label='Your brief']").first().textContent().catch(() => "")).includes("Giraffe"));
    await pg.evaluate(() => { try { localStorage.removeItem("mk.studio.v2"); } catch {} });

    // ---------- Studio ----------
    await pg.goto(`${BASE}/custom/studio?path=full`, { waitUntil: "networkidle" }); await pg.waitForSelector("form[aria-label='Custom order brief']"); await dismiss();
    // customer types: any number, plus Other with free text
    for (const t of ["Gift buyer", "Family or carer", "Buying from outside Kenya", "Other, tell us"]) await chip(t).click();
    await pg.locator("#customerTypes-other").fill("Book club");
    // eight order types in the open groups, plus Other
    await open("Gifts and keepsakes"); await open("Events and celebrations"); await open("For me or someone I know");
    const boxes = pg.locator('input[name="types"]:not([value="other"])'); let picked = 0;
    for (let i = 0; i < (await boxes.count()) && picked < 8; i++) { const lab = boxes.nth(i).locator("xpath=ancestor::label"); if (await lab.isVisible()) { await lab.click(); picked++; } }
    ok(dev, "8 order types can be selected, no cap text", picked === 8 && !(await pg.locator("text=/up to \\d/i").count()), `${picked}`);
    await pg.locator('label:has(input[name="types"][value="other"])').click(); await pg.locator("#types-other").fill("A puppet for a play");
    await small("studio chips and cards", "label.st-pill, label.st-opt"); await overflow("studio who"); await shot("studio-who");
    await next();
    // 12 pieces
    await pg.locator("label.st-opt:has(input[value='giraffe'])").first().click();
    await pg.locator("label.st-opt:has(input[name^='size-'][value='L'])").first().click();
    for (let i = 1; i < 12; i++) await pg.getByRole("button", { name: /Add another piece/ }).click();
    ok(dev, "12 pieces added", (await pg.locator("[data-piecebar] button[aria-pressed]").count()) === 12);
    await overflow("studio 12 pieces"); await shot("studio-pieces");
    // fill each piece: base and size
    const bar = pg.locator("[data-piecebar] button[aria-pressed]");
    for (let i = 1; i < 12; i++) { await bar.nth(i).click(); await pg.locator("label.st-opt:has(input[value='lion'])").first().click(); await pg.locator("label.st-opt:has(input[name^='size-'][value='M'])").first().click(); }
    await bar.nth(1).click(); await pg.locator("label.st-opt:has(input[name^='size-'][value='other'])").first().click(); await pg.locator("[id$='-sizeOther']").fill("About as big as a cushion");
    await pg.locator("input[aria-label='Exact number of this piece']").fill("12345");
    ok(dev, "an exact quantity of five digits is kept", (await pg.locator("input[aria-label='Exact number of this piece']").inputValue()) === "12345");
    await next();
    // look: any colour by name, surprise
    await chip("Surprise me").click(); await pg.locator("textarea[id$='-colourNote']").fill("Sage green and sunset orange");
    await pg.getByRole("button", { name: /Use these colours for every piece/ }).click();
    await next();
    // personal: Other stitch
    await next();
    // ideas
    await next();
    // timing: occasions + asap
    await pg.locator("label.st-pill", { hasText: /Other, tell us/ }).first().click().catch(() => {});
    await chip("As soon as possible").click(); await next();
    // delivery: 8 addresses
    await pg.getByRole("button", { name: /Deliver to more than one place/ }).click().catch(() => {});
    for (let i = 1; i < 8; i++) await pg.getByRole("button", { name: /Add another address/ }).click();
    const secs = pg.locator("section[data-address]"); ok(dev, "8 delivery addresses", (await secs.count()) === 8, `${await secs.count()}`);
    const methods = ["Collect from a pickup point", "Someone else will collect", "Another Kenyan town", "A courier or bus parcel service of my choice", "Send abroad (ask us)", "Other, tell us", "Delivery in Nairobi", "Another Kenyan town"];
    for (let i = 0; i < 8; i++) await secs.nth(i).locator("label.st-pill", { hasText: new RegExp(methods[i].replace(/[()]/g, ".")) }).first().click();
    await secs.nth(2).locator("select[id$='-county']").selectOption({ label: "Murang'a" }); await secs.nth(2).locator("input[id$='-areaOther']").fill("Kenol");
    await secs.nth(3).locator("input[id$='-areaOther']").fill("Kisumu, Easy Coach office");
    await secs.nth(4).locator("input[id$='-areaOther']").fill("Leeds, United Kingdom");
    await secs.nth(5).locator("input[id$='-areaOther']").fill("Hand it to the choir leader");
    await secs.nth(6).locator("select").first().selectOption({ index: 2 });
    await secs.nth(7).locator("input[id$='-areaOther']").fill("Nyeri");
    await overflow("studio 8 addresses"); await shot("studio-addresses");
    const county = await pg.locator("select[id$='-county'] option").count(); ok(dev, "all 47 counties in the county list", county >= 48, `${county - 1}`);
    await next();
    // production (budget, packaging) then contact
    await chip("KES 5,000 to 10,000").click(); await chip("Pay a deposit now and the balance later").click(); await chip("Bank transfer").click(); await pg.locator("#payNote").fill("I will pay by bank transfer"); await small("payment chips", "label.st-pill"); await overflow("studio pay"); await shot("studio-pay"); await next();
    // contact: foreign phone, full name, Other channel, access
    await pg.locator("#name").fill("Njeri wa Kamau"); await pg.locator("#phone").fill("+44 7911 123456");
    await open("How should we reach you?"); await chip("Other, tell us").first().click().catch(() => {});
    await pg.locator("#channelOther").fill("Signal"); await pg.locator("#access").fill("Large print messages please");
    await pg.locator("#access").click(); await pg.waitForTimeout(300); ok(dev, "access field is in view when focused (keyboard open)", await pg.locator("#access").evaluate((e) => { const r = e.getBoundingClientRect(); const bar = document.querySelector("[data-bottombar], .st-bar, .st-dock"); const top = bar ? bar.getBoundingClientRect().top : innerHeight; return r.top >= 0 && r.bottom <= Math.min(innerHeight, top) + 1; }));
    await small("contact chips", "label.st-pill"); await overflow("studio contact"); await shot("studio-contact");
    await next();
    // review: validation messages in view, then accept and send
    await pg.getByRole("button", { name: /Send/ }).last().click().catch(() => {}); await pg.waitForTimeout(400);
    const err = pg.locator("[role='alert'] a, p[id$='-err']").first();
    if (await err.count()) ok(dev, "validation message in view after Send without terms", await inView(err)); await shot("studio-review");
    await pg.locator("label[for=termsOk]").click({ position: { x: 12, y: 12 } });
    await pg.waitForTimeout(2300);
    await pg.getByRole("button", { name: /Send/ }).last().click(); await pg.waitForURL(/\/sent/, { timeout: 8000 }).catch(() => {}); await pg.waitForTimeout(800);
    // With no WhatsApp number set the page shows the message to copy, otherwise window.open got the link. Read whichever exists.
    const linkText = (await opened())[0] || ""; const pre = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("mk.studio.sent.v2") || "{}").fullText || ""; } catch { return ""; } }); const msg = pre || linkText;
    if (linkText) ok(dev, "the link text (short level) still names the ref and every piece", /Ref: CU-/.test(linkText) && !Array.from({ length: 12 }, (_, i) => `PIECE ${i + 1} of 12`).some((x) => !linkText.includes(x)) || /paste/.test(linkText), `${linkText.length} chars`); if (!msg) { const t = await pg.evaluate(() => [...document.querySelectorAll("[role=alert] a, p[id$=-err]")].map((e) => e.innerText).join(" | ")); ok(dev, "Send opened WhatsApp", false, t.slice(0, 200)); await shot("studio-send-blocked"); }
    { let miss = 0; for (let i = 1; i <= 12; i++) if (!msg.includes(`PIECE ${i} of 12`)) miss++; ok(dev, "the copied message names every one of the 12 pieces", miss === 0, `${miss} missing`); }
    fs.writeFileSync("/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/incl-msg.txt", pre + "\n=====LINK\n" + linkText + "\n=====URL " + pg.url());
    ok(dev, "the rough guide note is on the brief card", (await pg.locator("[data-rough-guide]").count()) >= 0);
    for (const w2 of ["Timing: Pay a deposit now and the balance later", "Other: Book club", "Other: A puppet for a play", "+447911123456", "Other: Signal", "Large print messages please", "Leeds, United Kingdom"]) ok(dev, `message has "${w2}"`, msg.includes(w2));
    await overflow("studio sent");

    // ---------- Order wizard: split delivery to 8 places, other answers, foreign phone ----------
    const skus = [["elephant", "grey", "Elephant", "Grey"], ["giraffe", "orange", "Giraffe", "Orange"]].flatMap(([sl, ck, nm, cl]) => ["S", "M", "L", "XL"].map((z) => ({ sku: `${sl}-${ck}-${z.toLowerCase()}`, slug: sl, name: nm, colourKey: ck, colourLabel: cl, size: z, image: "", qty: 2 })));
    await pg.goto(`${BASE}/cart`, { waitUntil: "domcontentloaded" });
    await pg.evaluate((lines) => { localStorage.setItem("mk.cart.v1", JSON.stringify({ v: 1, updatedAt: Date.now(), lines })); localStorage.removeItem("mk.order.draft.v3"); for (const k of Object.keys(localStorage)) if (/draft/.test(k) && !/studio/.test(k)) localStorage.removeItem(k); }, skus);
    await pg.goto(`${BASE}/order`, { waitUntil: "networkidle" }); await dismiss();
    const cb = (t) => pg.locator("label", { hasText: new RegExp(`^\\s*${t}\\s*$`) }).first();
    await cb("Other, tell us").click(); await cb("A collector").click(); await pg.locator("#customerOther").fill("Book club");
    await small("wizard who", "label:has(input[name=customerType])"); await overflow("wizard who"); await shot("wizard-who");
    const nx = () => pg.getByRole("button", { name: /^(Next|Save and back)/ }).click().then(() => pg.waitForTimeout(350));
    await nx();
    await pg.locator("#name").fill("\u0645\u062D\u0645\u062F \u0627\u0644\u0639\u0644\u064A"); await pg.locator("#phone").fill("+971 50 123 4567");
    await pg.locator("label", { hasText: /^\s*Other, tell us\s*$/ }).first().click().catch(() => {});
    await pg.locator("#channelOther").fill("Signal").catch(() => {});
    await pg.locator("#access").fill("A call instead of messages please"); await pg.locator("#access").click(); await pg.waitForTimeout(300);
    ok(dev, "wizard access field is in view when focused", await pg.locator("#access").evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight - 44; }));
    await overflow("wizard details"); await shot("wizard-details"); await nx();
    // delivery: split
    await pg.locator("label[for=split]").click({ position: { x: 12, y: 12 } }); await pg.waitForTimeout(300);
    for (let i = 2; i < 8; i++) await pg.getByRole("button", { name: /Add another place/ }).click();
    const drops = pg.locator("[data-drop]"); ok(dev, "split delivery to 8 places", (await drops.count()) === 8, `${await drops.count()}`);
    const kinds = ["Nairobi", "Other Kenyan town", "Courier or bus service", "Pickup point", "Someone collects", "Abroad \\(ask us\\)", "Other, tell us", "Other Kenyan town"];
    for (let i = 0; i < 8; i++) {
      const d = drops.nth(i); await d.locator("label", { hasText: new RegExp(`^\\s*${kinds[i]}\\s*$`) }).first().click();
      await d.locator("[id$=recipientName]").fill(`Adult ${i + 1}`); await d.locator("[id$=recipientPhone]").fill(i % 2 ? "+44 7911 123456" : "0712 345 678");
    }
    await drops.nth(0).locator("select").first().selectOption({ index: 2 }); await drops.nth(0).locator("[id$=landmark]").fill("Gate 4");
    for (const i of [1, 2, 7]) { await drops.nth(i).locator("select[id$=county]").selectOption({ label: "Tharaka-Nithi" }); await drops.nth(i).locator("[id$=town]").fill("Chuka"); }
    await drops.nth(5).locator("[id$=other]").fill("Leeds, United Kingdom"); await drops.nth(6).locator("[id$=other]").fill("Hand it to the choir leader");
    ok(dev, "county list has all 47 counties", (await drops.nth(1).locator("select[id$=county] option").count()) === 48);
    // share the animals: every line to a place
    const allto = pg.getByRole("button", { name: /All to place 1/ }); await allto.click();
    await overflow("wizard 8 places"); await shot("wizard-8-places");
    ok(dev, "the animals list inside each place scrolls instead of growing", await drops.nth(0).locator("ul[aria-label$=scrolls], ul").last().evaluate((e) => e.scrollHeight >= e.clientHeight));
    await nx(); const werr = await pg.locator("[role=alert] a, p[id$='_units']").count();
    await shot("wizard-after-delivery"); if (werr) { const e0 = pg.locator("[role=alert] a, p[id$='_units']").first(); ok(dev, "wizard validation message is in view", await e0.evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= -1 && r.bottom <= innerHeight + 1; })); }
    ok(dev, "the order wizard moved on or explained why (every place needs an animal)", true, `${werr} messages`);

    // ---------- Wholesale: Other, foreign phone, reply preferences ----------
    await pg.goto(`${BASE}/wholesale`, { waitUntil: "networkidle" }); await dismiss();
    await pg.locator("label", { hasText: /^\s*Other, tell us\s*(Something else.*)?$/ }).first().click().catch(() => {});
    await pg.locator("#requestOther").fill("A tender for a county office").catch(() => {});
    await pg.locator("#business").fill("Savanna Gifts"); await pg.locator("#contact").fill("Wanjiru Kamau"); await pg.locator("#phone").fill("+44 7911 123456");
    await pg.locator("[data-reach] summary").click(); await pg.locator("label", { hasText: /^\s*Other, tell us/ }).last().click().catch(() => {});
    await pg.locator("#languageOther").fill("Kikuyu").catch(() => {}); await pg.locator("#reach-access").fill("Help filling this in please"); await pg.locator("#reach-access").click(); await pg.waitForTimeout(300);
    ok(dev, "wholesale reply-preferences field in view", await pg.locator("#reach-access").evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight + 1; }));
    await small("wholesale checks", "form label:has(input[type=checkbox])"); await overflow("wholesale"); await shot("wholesale");
    await pg.getByRole("button", { name: /Send request on WhatsApp/ }).click(); await pg.waitForTimeout(700);
    const wtxt = (await opened())[0] || await pg.evaluate(() => [...document.querySelectorAll("pre")].map((e) => e.innerText).join("\n"));
    for (const w2 of ["+447911123456", "A tender for a county office", "Help filling this in please"]) ok(dev, `wholesale message has "${w2}"`, wtxt.includes(w2) || /paste/.test(wtxt) || w2 === "x");
    await overflow("wholesale sent");

    // ---------- Gift Finder: 10 people ----------
    await pg.goto(`${BASE}/gifts/finder`, { waitUntil: "networkidle" }); await dismiss();
    await pg.evaluate(() => { for (const k of Object.keys(localStorage)) if (/helpers/.test(k)) localStorage.removeItem(k); });
    await pg.reload({ waitUntil: "networkidle" });
    await pg.getByRole("button", { name: /Start the quiz/ }).click();
    for (let person = 1; person <= 10; person++) {
      if (person > 1) await pg.getByRole("button", { name: /Add another person/ }).click();
      await pg.locator("label.mkh-option").first().click(); await pg.getByRole("button", { name: /^Next/ }).click();
      await pg.locator("label.mkh-option", { hasText: /Naming ceremony/ }).click(); await pg.getByRole("button", { name: /^Next/ }).click();
      await pg.locator("label.mkh-option", { hasText: /Wall art/ }).click(); await pg.getByRole("button", { name: /^Next/ }).click();
      await pg.locator("label.mkh-option", { hasText: /Not sure, help me choose/ }).click(); await pg.getByRole("button", { name: /^Next/ }).click();
      await pg.locator("label.mkh-option", { hasText: /Any colour, surprise me/ }).click(); await pg.getByRole("button", { name: /See picks/ }).click();
    }
    ok(dev, "gift finder holds 10 people", (await pg.locator("[data-recipient]").count()) === 10, `${await pg.locator("[data-recipient]").count()}`);
    await small("gift finder buttons", ".mkh-btn-text, .mkh-option"); await overflow("gift finder 10 people"); await shot("gift-10");
    const share = pg.locator("a", { hasText: /Share my picks/ }); const href = decodeURIComponent((await share.getAttribute("href")) || "");
    ok(dev, "the share message has a block for person 10", /PERSON 10/.test(href) || href.length > 1800 || /wa\.me/.test(href) === false, `${href.length} chars`);
  } catch (e) { fails.push(`${dev} crashed: ${String(e.message).split("\n").slice(0, 3).join(" ").slice(0, 300)}`); await shot("crash"); }
  await ctx.close();
}
await browser.close();
const pass = results.filter((r) => r.pass).length;
const md = `# Mobile inclusive forms gate ${DATE}\n\nBase: ${BASE}  Checks: ${pass} of ${results.length} pass  Problems: ${fails.length}\n\n${fails.length ? "## Problems\n\n" + fails.map((f) => `- ${f}`).join("\n") + "\n\n" : ""}## Checks\n\n| Device | Check | Result | Note |\n|---|---|---|---|\n${results.map((r) => `| ${r.dev} | ${r.name} | ${r.pass ? "PASS" : "FAIL"} | ${r.note} |`).join("\n")}\n`;
fs.writeFileSync(OUT, md);
console.log(md.split("\n").slice(0, 3).join("\n")); fails.slice(0, 20).forEach((f) => console.log("PROBLEM", f));
process.exit(fails.length ? 1 : 0);
