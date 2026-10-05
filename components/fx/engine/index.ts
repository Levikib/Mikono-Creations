// The animal engine. A standalone script (scripts/build-engine.mjs bundles this folder to public/fx/e/engine.<hash>.js), fetched by a tiny inline loader
// the moment the page's HTML is parsed, so it never waits for React to hydrate. Runs only on pages that carry animals (components/fx/FxLoader.tsx), and only after the document is parsed.
// It owns no markup. The server renders every animal, band, knot and the thread as still, complete HTML; this module only sets data
// attributes and a few CSS variables on that markup, so hydration can never disagree with it.
//
// What it does, in order of cost:
//   1. Budget. One list of visible animals; the best N (4 on a phone, 6 on a desktop, 2 in the lite tier) get data-live="1", which is
//      the only thing that lets CSS animate them. Everything else stays in its still pose. Priority first, then distance from the middle.
//   2. Entry. Animals below the fold start hidden and rise when their band's knot is reached (or when they scroll into view).
//   3. The thread. The CSS scroll() timeline draws it where supported; here we measure the page once, set the variables the timeline
//      reads, light the knots, and drive the same transforms by hand where the timeline is missing.
//   4. Small reactions: tap, pointer look, idle nudge, card peek-a-boo, add-to-list hop, the find-the-herd game.
// One scroll listener (passive, one rAF), one IntersectionObserver, one pointermove listener (fine pointers only, stores x and y).
import { applyTier, detectTier, FX_EVENT, type FxTier } from "./tier";

type El = HTMLElement;
interface Ch { el: El; prio: number; vis: boolean; entered: boolean; band: El | null }

const root = document.documentElement;
const reducedQ = matchMedia("(prefers-reduced-motion: reduce)");
const HAB: Record<string, string> = {
  savanna: "#c9a05a", grove: "#b0654a", nursery: "#c98f83", pet: "#b98f63", workshop: "#6a7049", market: "#a3955b", skyline: "#587783", pond: "#587783", cart: "#b0654a",
};

let tier: FxTier = "full";
let started = false;
let budget = 4;
const chars = new Map<El, Ch>();
let io: IntersectionObserver | null = null;
let ro: ResizeObserver | null = null;
let host: El | null = null;
let thread: El | null = null;
let timeline = false;
let knots: { el: El; band: El; y: number; lit: boolean }[] = [];
let ball: El | null = null, fillEl: El | null = null, gradEl: El | null = null, aheadEl: El | null = null;
let hostTop = 0, docH = 0, vh = 0;
let lastY = 0, lastT = 0, vel = 0;
let ballSq = "", ballRot = "";
let ticking = false, scrollIdle = 0, measureT = 0, recomputeT = 0, nudgeT = 0;
let nudges = 0, lastNudge = 0, slowFrames: number[] = [];
let hover: { x: number; y: number } | null = null;
let lookRaf = 0;
const taps = new Map<El, number[]>();
let peeked: El | null = null;
let peekTimer = 0;
let game: typeof import("./game") | null = null;

const q = <T extends El>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const busy = new Set<El>();
/** The welcome rabbit (pure CSS, see fx.css) loops for as long as the page is open, so it holds one slot whenever it is shown. */
const welcomeOn = () => {
  const l = document.querySelector(".fx-lane");
  return !!l && root.getAttribute("data-fx") !== "still" && root.getAttribute("data-fx") !== "off";
};
const extras = () => q(".fx-peeker[data-on], .fx-hopper").length + (welcomeOn() ? 1 : 0);
/** Animals using a slot right now: live ones, ones in their entry transition, a peeker, a hopper. */
const used = () => {
  const s = new Set<El>(busy);
  q(".fx-char[data-live='1']").forEach((e) => s.add(e));
  return s.size + extras();
};
const live = used;
const motionOK = () => tier === "full" || tier === "lite";

function setBudget() {
  const phone = innerWidth < 900;
  budget = tier === "lite" ? 2 : phone ? 4 : 6;
  try { if (sessionStorage.getItem("mk-fx-slow")) budget = Math.max(1, budget - 2); } catch { /* storage blocked */ }
}

// ---------------------------------------------------------------- characters
function adopt() {
  const found = q(".fx-char[data-sp]").filter((e) => !e.closest(".fx-lane") && !e.closest("[hidden]"));
  const fresh = found.filter((e) => !chars.has(e));
  if (!fresh.length) return;
  // one batch of reads, then one batch of writes
  const tops = fresh.map((e) => e.getBoundingClientRect().top);
  fresh.forEach((e, i) => {
    const band = e.closest<El>(".fx-band");
    const ch: Ch = { el: e, prio: Number(e.dataset.prio) || 2, vis: false, entered: false, band };
    chars.set(e, ch);
    const role = e.dataset.role;
    const below = tops[i] > innerHeight - 8;
    if (!e.dataset.st) {
      if (motionOK() && (role === "rise" || role === "perch") && below && !e.hasAttribute("data-free")) e.dataset.st = "hid";
      else { e.dataset.st = "in"; ch.entered = true; }
    }
    io?.observe(e);
  });
}

// Sprites are lazy <img> in the server markup. The browser's own lazy distance depends on the connection, so the engine decides: the nearest
// few load at once (strictly by distance from the viewport), the rest the moment they come within one and a half screens. Nothing far away is fetched early.
let primeIO: IntersectionObserver | null = null;
function prime() {
  const imgs = q<HTMLImageElement>(".fx-char img[loading='lazy'], .fx-prop img[loading='lazy']").filter((i) => !i.dataset.pr);
  if (!imgs.length) return;
  const tops = imgs.map((i) => i.getBoundingClientRect().top);
  const order = imgs.map((_, i) => i).sort((a, b) => Math.abs(tops[a] - innerHeight) - Math.abs(tops[b] - innerHeight));
  const near = innerHeight * 1.2;
  let eager = 0;
  for (const i of order) {
    const img = imgs[i];
    img.dataset.pr = "1";
    if (tops[i] < near && eager < 4) { img.loading = "eager"; eager++; }
    else (primeIO ??= new IntersectionObserver((ens) => {
      for (const en of ens) if (en.isIntersecting) { (en.target as HTMLImageElement).loading = "eager"; primeIO?.unobserve(en.target); }
    }, { rootMargin: "0px 0px 150% 0px" })).observe(img);
  }
}

function enter(ch: Ch) {
  if (ch.entered) return;
  // an animal in a band with a knot waits for the thread to reach it
  if (ch.band && ch.band.hasAttribute("data-knot") && !ch.band.hasAttribute("data-lit") && thread) return;
  ch.entered = true;
  const e = ch.el;
  if (e.dataset.st === "hid") {
    if (used() >= budget) {
      e.setAttribute("data-nomo", "");
    } else {
      busy.add(e);
      const end = () => { busy.delete(e); soon(0); };
      e.addEventListener("transitionend", end, { once: true });
      window.setTimeout(end, 1100);
    }
    requestAnimationFrame(() => { e.dataset.st = "in"; });
  }
}

function recompute() {
  recomputeT = 0;
  if (!motionOK()) return;
  const mid = innerHeight / 2;
  const vis: { ch: Ch; d: number }[] = [];
  chars.forEach((ch) => {
    if (!ch.vis || !ch.el.isConnected) return;
    const r = ch.el.getBoundingClientRect();
    vis.push({ ch, d: Math.abs(r.top + r.height / 2 - mid) });
  });
  vis.sort((a, b) => b.ch.prio - a.ch.prio || a.d - b.d);
  const room = Math.max(0, budget - extras() - busy.size);
  vis.splice(0, vis.length, ...vis.filter((v) => !busy.has(v.ch.el)));
  vis.forEach((v, i) => {
    const on = i < room && v.ch.el.dataset.st !== "hid" && !v.ch.el.hasAttribute("data-calm");
    if (on) { if (v.ch.el.dataset.live !== "1") v.ch.el.dataset.live = "1"; } else if (v.ch.el.dataset.live) delete v.ch.el.dataset.live;
  });
  chars.forEach((ch) => { if (!ch.vis && ch.el.dataset.live) delete ch.el.dataset.live; });
}
const soon = (ms = 90) => { if (!recomputeT) recomputeT = window.setTimeout(recompute, ms); };

function act(el: El, name: string) {
  if (!motionOK()) return;
  if (el.dataset.act) return;
  const live1 = live();
  if (live1 >= budget && el.dataset.live !== "1") {
    // evict the lowest priority live animal for the length of the reaction
    const low = q(".fx-char[data-live='1']").sort((a, b) => (Number(a.dataset.prio) || 2) - (Number(b.dataset.prio) || 2))[0];
    if (low && low !== el) delete low.dataset.live;
  }
  el.dataset.live = "1";
  el.dataset.act = name;
  const done = () => { delete el.dataset.act; soon(40); };
  el.addEventListener("animationend", done, { once: true });
  window.setTimeout(() => { if (el.dataset.act) done(); }, 2600);
}

// ---------------------------------------------------------------- the thread
function head(p: number) { return scrollY + vh * (0.3 + 0.7 * p); }
function progress() { const m = Math.max(1, docH - vh); return Math.min(1, Math.max(0, scrollY / m)); }

function measure() {
  measureT = 0;
  vh = innerHeight;
  docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  if (!host || !thread) return;
  hostTop = host.getBoundingClientRect().top + scrollY;
  const ya = 0.3 * vh - hostTop;
  const yb = docH - hostTop;
  thread.style.setProperty("--ya", `${ya.toFixed(1)}px`);
  thread.style.setProperty("--yb", `${yb.toFixed(1)}px`);
  const stops: { y: number; c: string }[] = [];
  knots.forEach((k) => {
    const r = k.band.getBoundingClientRect();
    const y = r.bottom + scrollY;
    k.y = y;
    k.el.style.top = `${(y - hostTop).toFixed(1)}px`;
    const hab = k.band.dataset.habitat ?? "grove";
    stops.push({ y: y - hostTop, c: HAB[hab] ?? HAB.grove });
  });
  stops.sort((a, b) => a.y - b.y);
  if (stops.length) {
    const parts = [`${stops[0].c} 0px`];
    stops.forEach((s, i) => {
      parts.push(`${s.c} ${Math.max(0, s.y - 40).toFixed(0)}px`);
      const n = stops[i + 1];
      if (n) parts.push(`${s.c} ${(s.y + 20).toFixed(0)}px`, `${n.c} ${Math.max(s.y + 21, n.y - 40).toFixed(0)}px`);
    });
    const last = stops[stops.length - 1];
    parts.push(`${last.c} 100%`);
    thread.style.setProperty("--fx-grad", `linear-gradient(180deg, ${parts.join(", ")})`);
  }
  frame(true);
}
const remeasure = () => { if (!measureT) measureT = window.setTimeout(measure, 120); };

function frame(force = false) {
  ticking = false;
  const now = performance.now();
  const y = scrollY;
  const dt = Math.max(1, now - lastT);
  if (!force && lastT && dt > 100 && motionOK()) {
    slowFrames = slowFrames.filter((t) => now - t < 2000);
    slowFrames.push(now);
    if (slowFrames.length >= 3) { try { sessionStorage.setItem("mk-fx-slow", "1"); } catch { /* storage blocked */ } setBudget(); soon(0); slowFrames = []; }
  }
  const v = (y - lastY) / dt; // px per ms
  vel += (v - vel) * 0.18;
  lastY = y; lastT = now;
  if (!thread) return;
  const p = progress();
  const h = head(p);
  // knots
  for (const k of knots) {
    if (!k.lit && k.y <= h + 2) {
      k.lit = true;
      k.el.setAttribute("data-lit", "");
      k.band.setAttribute("data-lit", "");
      chars.forEach((ch) => { if (ch.band === k.band) enter(ch); });
    }
  }
  if (!motionOK()) return;
  if (ball) {
    // Quantised, and written only when the value changes: each inline style write restyles the ball every scroll frame.
    const sq = (Math.round(Math.min(0.16, Math.abs(vel) / 5) / 0.02) * 0.02).toFixed(2);
    const rot = `${Math.round((y / (Math.PI * 24)) * 360 / 4) * 4}deg`;
    if (ballSq !== sq) { ballSq = sq; ball.style.setProperty("--sq", sq); }
    if (ballRot !== rot) { ballRot = rot; ball.style.setProperty("--rot", rot); }
  }
  if (!timeline) {
    const hh = h - hostTop;
    const hostH = thread.getBoundingClientRect().height || 1;
    const fill = fillEl, grad = gradEl, ahead = aheadEl;
    if (fill && grad && ahead) {
      const c = Math.min(0, -hostH + hh);
      fill.style.transform = `translateY(${c}px)`;
      grad.style.transform = `translateY(${-c}px)`;
      ahead.style.transform = `translateY(${Math.max(0, hh)}px)`;
    }
  }
}

function onScroll() {
  noteInput();
  if (!ticking) { ticking = true; requestAnimationFrame(() => frame()); }
  clearTimeout(scrollIdle);
  scrollIdle = window.setTimeout(() => {
    vel = 0;
    if (ball) ball.style.setProperty("--sq", "0");
    soon(0);
    touchPeek();
  }, 140);
  if (peeked) hidePeek();
}

// ---------------------------------------------------------------- pointer: look, tap
function onMove(e: PointerEvent) {
  hover = { x: e.clientX, y: e.clientY };
  if (!lookRaf) lookRaf = requestAnimationFrame(look);
}
function look() {
  lookRaf = 0;
  if (!hover || !motionOK()) return;
  q(".fx-char[data-live='1']").slice(0, 6).forEach((el) => {
    const r = el.getBoundingClientRect();
    const dx = hover!.x - (r.left + r.width / 2), dy = hover!.y - (r.top + r.height / 2);
    const near = Math.hypot(dx, dy) < 320;
    const a = near ? Math.max(-5, Math.min(5, dx / 40)) : 0;
    if (el.dataset.look === undefined) el.dataset.look = "";
    el.style.setProperty("--look", a.toFixed(1));
  });
}

function nearestChar(x: number, y: number, pad: number): Ch | null {
  let best: Ch | null = null, bd = pad;
  chars.forEach((ch) => {
    if (!ch.vis || ch.el.classList.contains("fx-find")) return;
    const r = ch.el.getBoundingClientRect();
    const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom);
    const d = Math.hypot(dx, dy);
    if (d < bd) { bd = d; best = ch; }
  });
  return best;
}

const COLS = ["#b0654a", "#c9a05a", "#6a7049", "#c79b7d", "#8a4630", "#aac2cc"];
function bits(x: number, y: number, n: number, spread = 70) {
  if (!motionOK()) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    s.className = "fx-bit";
    const a = (i / n) * Math.PI * 2 + (i % 2) * 0.3, d = spread * (0.6 + ((i * 37) % 50) / 100);
    s.style.cssText = `--x0:${x}px;--y0:${y}px;--x:${Math.round(Math.cos(a) * d)}px;--y:${Math.round(Math.sin(a) * d - 24)}px;--r:${(i % 2 ? 1 : -1) * (150 + ((i * 53) % 200))}deg;--c:${COLS[i % COLS.length]};animation-delay:${((i * 0.03) % 0.25).toFixed(2)}s`;
    document.body.appendChild(s);
    window.setTimeout(() => s.remove(), 1800);
  }
}

function onDown(e: PointerEvent) {
  noteInput();
  const t = e.target as Element | null;
  if (t?.closest("a,button,input,select,textarea,summary,label,[role=button]")) return;
  const ch = nearestChar(e.clientX, e.clientY, 36);
  if (!ch) return;
  const now = Date.now();
  const list = (taps.get(ch.el) ?? []).filter((x) => now - x < 3000);
  list.push(now);
  taps.set(ch.el, list);
  act(ch.el, list.length >= 3 ? "tickle" : "hop");
  bits(e.clientX, e.clientY, 8, 46);
}

// ---------------------------------------------------------------- idle nudge
function noteInput() {
  clearTimeout(nudgeT);
  if (!motionOK() || tier === "lite") return;
  nudgeT = window.setTimeout(nudge, 6000);
}
function nudge() {
  if (nudges >= 3 || Date.now() - lastNudge < 20000 || document.hidden) return noteInput();
  const mid = innerHeight / 2;
  const cand = Array.from(chars.values()).filter((c) => c.vis && !c.el.classList.contains("fx-find") && c.el.dataset.st !== "hid" && c.el.dataset.role !== "float");
  cand.sort((a, b) => Math.abs(a.el.getBoundingClientRect().top - mid) - Math.abs(b.el.getBoundingClientRect().top - mid));
  if (!cand[0]) return;
  nudges++; lastNudge = Date.now();
  act(cand[0].el, "wave");
}

// ---------------------------------------------------------------- peek-a-boo on cards
function showPeek(li: El) {
  if (tier !== "full" || peeked === li) return;
  const card = li.querySelector<El>("[data-peek-src]");
  if (!card) return;
  hidePeek();
  peeked = li;
  const p = document.createElement("div");
  p.className = "fx-peeker";
  const idx = q("li", li.parentElement as El).indexOf(li);
  p.style.setProperty("--px", `${[34, 62, 48][idx % 3]}%`);
  p.style.setProperty("--pt", `${-(Number(card.dataset.peekCy) || 0.1) * 46}px`);
  const img = new Image();
  img.alt = ""; img.decoding = "async";
  img.src = card.dataset.peekSrc!;
  p.appendChild(img);
  li.appendChild(p);
  // make room in the budget
  const extra = live() + 1;
  if (extra > budget) { const low = q(".fx-char[data-live='1']").sort((a, b) => (Number(a.dataset.prio) || 2) - (Number(b.dataset.prio) || 2))[0]; if (low) delete low.dataset.live; }
  requestAnimationFrame(() => requestAnimationFrame(() => p.setAttribute("data-on", "")));
  window.clearTimeout(peekTimer);
  peekTimer = window.setTimeout(hidePeek, 4200);
}
function hidePeek() {
  window.clearTimeout(peekTimer);
  const li = peeked;
  peeked = null;
  if (!li) return;
  const p = li.querySelector<El>(".fx-peeker");
  if (!p) return;
  p.removeAttribute("data-on");
  window.setTimeout(() => p.remove(), 650);
  soon(700);
}
function touchPeek() {
  if (tier !== "full" || !host?.hasAttribute("data-peek") || matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const mid = innerHeight * 0.5;
  let best: El | null = null, bd = 1e9;
  q("li", host).forEach((li) => {
    if (!li.querySelector("[data-peek-src]") || li.hidden) return;
    const r = li.getBoundingClientRect();
    if (r.height === 0 || r.bottom < 0 || r.top > innerHeight) return;
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bd && r.top > 120) { bd = d; best = li; }
  });
  if (best && bd < innerHeight * 0.3) window.setTimeout(() => { if (!ticking && best) showPeek(best); }, 450);
}
function onOver(e: PointerEvent) {
  if (e.pointerType === "touch" || tier !== "full" || !host?.hasAttribute("data-peek")) return;
  const li = (e.target as Element | null)?.closest<El>("li");
  if (li && li.querySelector("[data-peek-src]")) showPeek(li);
}

// ---------------------------------------------------------------- add to order list: the animal hops to the basket
function onCartAdd(e: Event) {
  if (!motionOK()) return;
  const d = (e as CustomEvent<{ x?: number; y?: number; sprite?: string }>).detail ?? {};
  const target = q("[data-cart-target]").find((t) => t.offsetParent !== null);
  if (!target || typeof d.x !== "number" || typeof d.y !== "number" || !d.sprite) return;
  const r = target.getBoundingClientRect();
  const h = document.createElement("span");
  h.className = "fx-hopper";
  h.style.cssText = `left:${d.x}px;top:${d.y}px;--fx-dx:${r.left + r.width / 2 - d.x}px;--fx-dy:${r.top + r.height / 2 - d.y}px`;
  const img = new Image();
  img.alt = ""; img.src = d.sprite;
  h.appendChild(img);
  document.body.appendChild(h);
  soon(0);
  window.setTimeout(() => {
    h.remove();
    target.setAttribute("data-wobble", "");
    window.setTimeout(() => target.removeAttribute("data-wobble"), 700);
    window.dispatchEvent(new CustomEvent("mikono:cart-landed"));
    soon(0);
  }, 900);
}

// ---------------------------------------------------------------- setup and teardown
function scan() {
  host = q("[data-fx-page]").find((h) => !h.closest("[hidden]")) ?? null;
  thread = host?.querySelector<El>(".fx-thread") ?? null;
  ball = thread?.querySelector<El>(".fx-ball") ?? null;
  fillEl = thread?.querySelector<El>(".fx-t-fill") ?? null;
  gradEl = thread?.querySelector<El>(".fx-t-grad") ?? null;
  aheadEl = thread?.querySelector<El>(".fx-t-ahead") ?? null;
  knots = [];
  if (thread && thread.getAttribute("data-mode") === "on") {
    q(".fx-knot", thread).forEach((k) => {
      const band = document.querySelector<El>(`.fx-band[data-fx-band="${k.dataset.for}"]`);
      if (band) knots.push({ el: k, band, y: 0, lit: false }); else k.remove();
    });
  }
  timeline = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
  chars.forEach((ch, el) => { if (!el.isConnected) { io?.unobserve(el); chars.delete(el); } });
  adopt();
  prime();
  measure();
}

function initGame() {
  if (!document.querySelector(".fx-find")) return;
  import("./game").then((m) => { game = m; m.init({ bits, act: (el) => act(el, "wave"), enabled: () => tier !== "off" }); });
}

// The page body streams in behind a Suspense boundary (app/loading.tsx): the engine can start before it is in place, and again when React swaps it in
// (it is hidden until then) or hydration replaces it. A cheap observer notices a host the engine has not scanned and rescans once, in a frame.
let watch: MutationObserver | null = null;
function watchHost() {
  if (watch || typeof MutationObserver === "undefined") return;
  let queued = false;
  const check = () => {
    queued = false;
    const h = q("[data-fx-page]").find((x) => !x.closest("[hidden]"));
    if (h && h !== host) rescan();
  };
  watch = new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(check); } });
  watch.observe(document.body, { childList: true, subtree: true });
  // the document is settled a moment after load; nothing more to wait for
  const done = () => window.setTimeout(() => { watch?.disconnect(); watch = null; }, 1500);
  if (document.readyState === "complete") done(); else window.addEventListener("load", done, { once: true });
}

function applyChange() {
  tier = applyTier();
  setBudget();
  if (!motionOK()) {
    chars.forEach((ch) => { delete ch.el.dataset.live; delete ch.el.dataset.act; });
    hidePeek();
    return;
  }
  scan();
  soon(0);
}

export function rescan() {
  if (!started) return;
  hidePeek();
  scan();
  initGame();
  soon(60);
}

export function start() {
  if (started) { rescan(); return; }
  started = true;
  tier = applyTier();
  setBudget();
  lastY = scrollY; lastT = performance.now();
  io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      const ch = chars.get(en.target as El);
      if (!ch) continue;
      ch.vis = en.isIntersecting;
      if (en.isIntersecting) enter(ch);
    }
    soon(60);
  }, { rootMargin: "60px 0px 60px 0px" });
  scan();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { setBudget(); remeasure(); soon(100); }, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("keydown", noteInput, { passive: true });
  window.addEventListener(FX_EVENT, applyChange);
  window.addEventListener("mikono:cart-add", onCartAdd);
  document.addEventListener("pointerover", onOver as EventListener, { passive: true });
  document.addEventListener("pointerleave", () => hidePeek());
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) window.addEventListener("pointermove", onMove, { passive: true });
  reducedQ.addEventListener("change", applyChange);
  ro = new ResizeObserver(remeasure);
  ro.observe(document.body);
  document.fonts?.ready.then(remeasure);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { chars.forEach((c) => delete c.el.dataset.live); } else soon(0); });
  initGame();
  noteInput();
  frame(true);
  soon(0);
  watchHost();
}

export function stop() {
  tier = "off";
  chars.forEach((c) => { delete c.el.dataset.live; });
  void game;
}

// ---------------------------------------------------------------- boot
// The inline loader in FxLoader adds this file as <script async data-auto="1"> in production. Starting here, before React has hydrated, is safe: the engine only sets
// data attributes, custom properties and `loading` on markup the server already rendered and no client component re-renders. In development the loader starts it after hydration instead.
interface FxApi { start: () => void; rescan: () => void; stop: () => void }
(window as Window & { __mkFx?: FxApi }).__mkFx = { start, rescan, stop };
const me = document.currentScript as HTMLScriptElement | null;
if (me && me.dataset.auto === "1" && detectTier() !== "off") {
  // The loader sits after the footer, so everything above it is already parsed; no need to wait for DOMContentLoaded.
  if (document.querySelector("[data-fx-page], .fx-find")) start();
}
