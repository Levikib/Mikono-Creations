/* Runs in the head, before first paint, and never blocks the intro: the intro itself is plain HTML and a CSS timeline (lib/splashAssets.ts).
   1. Animal tier (components/fx): off when the Animals switch is off or Save-Data is on, still under reduced motion, lite on weak devices, else full.
   2. Stored phone grid density (components/card/DensityToggle): html[data-density="comfy"] is set before paint, so there is no jump.
   3. Intro state on <html data-splash>: "on" while it plays, "skip" for reduced motion and bots (CSS hides it), "done" after it leaves.
   The intro plays on every full page load, except where a visitor arrives to do a task: /cart, /order and /custom/studio (and their sub pages, such as shared list
   links and the "sent" pages) go straight to the content, so a deep link is never delayed. Client side navigation never reloads the document, so it does not replay.
   It ends on its own animationend; Skip, a tap anywhere or Escape end it at once. A 4 s timer is only a safety net.
   4. The home welcome (rabbit, arrow and "Start here" pill in the lane under the hero buttons) is pure CSS (components/fx/fx.css), paused while
      html[data-splash="on"] and running the moment it is "done" or "skip", so it starts as the page is revealed with no engine. Without this script
      it runs after a delay equal to the splash length. Any tap, key press, wheel or touch ends it (html[data-welcome="over"]). window.__mkW holds the
      time the page was revealed, for the engine's animal budget. */
(function () {
  var d = document.documentElement;
  try {
    // Same decision as components/fx/engine/tier.ts. The Animals switch (mk-animals, "on" or "off") wins; then reduced motion (still);
    // then Save-Data or 2g (off, unless the visitor switched Animals on, then lite); then weak devices (lite); else full.
    var n = navigator, cn = n.connection || {}, ch = null, old = null, tier = "full";
    try { ch = window.localStorage.getItem("mk-animals"); old = window.localStorage.getItem("mk-fx"); } catch (e1) {}
    var choice = (ch === "on" || ch === "off") ? ch : (old === "off" ? "off" : null);
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var saver = !!cn.saveData || /(^|-)2g$/.test(cn.effectiveType || "");
    var weak = /(^|-)3g$/.test(cn.effectiveType || "") || (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2) || (n.deviceMemory && n.deviceMemory <= 4 && n.hardwareConcurrency && n.hardwareConcurrency <= 4);
    if (choice === "off") tier = "off";
    else if (reduced) tier = "still";
    else if (saver) tier = choice === "on" ? "lite" : "off";
    else if (weak) tier = "lite";
    d.setAttribute("data-fx", tier);
    d.setAttribute("data-animals", tier === "off" ? "off" : "on");
  } catch (e0) {}
  var calmTier = tier === "still" || tier === "off";
  try { if (window.localStorage.getItem("mk-density") === "comfy") d.setAttribute("data-density", "comfy"); } catch (e2) {}

  var state = "on";
  try {
    var bot = /bot|crawl|spider|slurp|lighthouse|pagespeed|gtmetrix|pingdom|prerender/i.test(navigator.userAgent || "");
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Task pages skip the intro. The CSS fallback is unchanged: without this script the intro still ends on its own timeline.
    var task = /^\/(cart|order|custom\/studio)(\/|$)/.test(String(location.pathname || "").replace(/\/{2,}/g, "/"));
    if (bot || calm || task) state = "skip";
  } catch (e) { state = "skip"; }
  d.setAttribute("data-splash", state);
  window.__mkW = performance.now();
  // The home welcome (rabbit, arrow, pill) is plain CSS held paused while html[data-splash=on] and released the same frame the splash is marked done.
  // Any input ends the welcome at once; so does the clock, a little after the sequence is over (a later client side visit to home then shows no rabbit).
  // The welcome rabbit now loops for as long as the page is open (components/fx/fx.css): nothing ends it, so there is nothing to arm.
  function armWelcome() {}
  if (state !== "on") { armWelcome(); return; }

  var done = false, safety;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(safety);
    var shell = document.getElementById("shell");
    if (shell) shell.removeAttribute("inert");
    d.setAttribute("data-splash", "done");
    window.__mkW = performance.now();
    armWelcome();
    window.dispatchEvent(new Event("mk:splash-done"));
  }
  safety = setTimeout(finish, 4000);
  function lock() { var shell = document.getElementById("shell"); if (shell && !done) shell.setAttribute("inert", ""); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", lock); else lock();

  function skip() {
    if (done) return;
    var sp = document.getElementById("sp");
    if (!sp) { finish(); return; }
    if ((" " + sp.className + " ").indexOf(" is-skip ") < 0) sp.className = (sp.className + " is-skip").trim();
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!done && t && t.closest && t.closest("#sp")) skip();
  }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") skip(); });
  document.addEventListener("animationend", function (e) {
    var t = e.target;
    if (t && t.id === "sp" && (e.animationName === "sp-end" || e.animationName === "sp-skip")) finish();
  }, true);
})();
