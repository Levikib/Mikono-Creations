/*
 * Intro splash, v2. A small centred stack on the dusk amber background, about 1.9 s from the first paint to a clean exit.
 * It is plain server HTML (rendered with dangerouslySetInnerHTML, so React never hydrates it and cannot mismatch) plus a small
 * critical style block in the document head, so it is on screen from the very first paint without waiting for any script or stylesheet.
 * Pure CSS animation, transform and opacity only (plus one discrete visibility step at the end). No counter, no @property.
 * Timeline: 0 to .25 s stack fades in, .15 to 1.55 s thread ring turns and the progress line fills while the animals walk,
 * 1.62 to 1.94 s the whole overlay fades and then leaves the layout (visibility hidden, pointer-events none, display none).
 * public/splash-gate.js only adds Skip, Escape and the "done" signal; with no script the CSS timeline still ends it.
 */

import { SPLASH_MARK } from "./splashMark";

const shapes: Record<string, string> = {
  giraffe: '<rect x="10" y="30" width="34" height="19" rx="9.5"/><rect x="13" y="42" width="6" height="18" rx="3"/><rect x="21" y="43" width="6" height="17" rx="3"/><rect x="30" y="43" width="6" height="17" rx="3"/><rect x="38" y="42" width="6" height="18" rx="3"/><rect x="37" y="11" width="9" height="26" rx="4.5"/><ellipse cx="49" cy="11" rx="9" ry="6"/><circle cx="44.5" cy="4" r="2.2"/><circle cx="50" cy="4" r="2.2"/><rect x="6" y="33" width="4" height="13" rx="2"/>',
  elephant: '<ellipse cx="34" cy="38" rx="21" ry="15"/><rect x="15" y="46" width="8" height="14" rx="4"/><rect x="24" y="47" width="8" height="13" rx="4"/><rect x="36" y="47" width="8" height="13" rx="4"/><rect x="45" y="46" width="8" height="14" rx="4"/><circle cx="54" cy="30" r="11"/><ellipse cx="47" cy="31" rx="7" ry="11"/><rect x="59" y="33" width="7" height="24" rx="3.5" transform="rotate(-8 62 33)"/>',
  lion: '<ellipse cx="28" cy="42" rx="19" ry="11"/><rect x="12" y="46" width="7" height="14" rx="3.5"/><rect x="21" y="47" width="7" height="13" rx="3.5"/><rect x="33" y="47" width="7" height="13" rx="3.5"/><rect x="42" y="46" width="7" height="14" rx="3.5"/><circle cx="50" cy="30" r="15"/><rect x="7" y="34" width="3.5" height="14" rx="1.75"/>',
  rabbit: '<ellipse cx="30" cy="45" rx="16" ry="13"/><circle cx="49" cy="36" r="9"/><ellipse cx="46" cy="17" rx="3.5" ry="10.5"/><ellipse cx="53" cy="19" rx="3.5" ry="9.5"/><rect x="18" y="54" width="16" height="6" rx="3"/><rect x="44" y="52" width="9" height="8" rx="4"/><circle cx="13" cy="46" r="4.5"/>',
  zebra: '<rect x="12" y="30" width="32" height="17" rx="8.5"/><rect x="14" y="42" width="5" height="18" rx="2.5"/><rect x="22" y="43" width="5" height="17" rx="2.5"/><rect x="32" y="43" width="5" height="17" rx="2.5"/><rect x="40" y="42" width="5" height="18" rx="2.5"/><rect x="37" y="13" width="10" height="24" rx="5" transform="rotate(12 42 36)"/><rect x="44" y="9" width="20" height="11" rx="5.5" transform="rotate(10 50 14)"/><rect x="7" y="32" width="3" height="14" rx="1.5"/>',
};

const animals = Object.entries(shapes)
  .map(([, s], i) => `<i style="--i:${i}"><svg viewBox="0 0 72 64" width="26" height="23" aria-hidden="true" focusable="false" fill="currentColor">${s}</svg></i>`)
  .join("");

export const SPLASH_HTML = `<div id="sp" role="presentation"><div class="sp-in"><div class="sp-logo"><b class="sp-ring"></b><img src="${SPLASH_MARK}" width="40" height="41" alt="" decoding="sync"></div><p class="sp-word">MIKONO CREATIONS</p><p class="sp-tag">Beautiful crafts for beautiful moments</p><div class="sp-bar"><u></u></div><div class="sp-walk"><div class="sp-row">${animals}</div><span class="sp-ground"></span></div></div><button type="button" class="sp-skip">Skip</button></div>`;

export const SPLASH_CSS = `#sp{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:radial-gradient(60% 46% at 50% 42%,rgb(227 174 90/.2),transparent 72%),#120F0C;color:#F4EBDD;overscroll-behavior:contain;cursor:pointer;animation:sp-end .32s ease 1.62s forwards}
:where(#sp) *{margin:0;box-sizing:border-box}
.sp-in{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 16px;animation:sp-in .3s ease-out both}
.sp-logo{position:relative;width:56px;height:58px;display:grid;place-items:center;border-radius:50%;background:#FBF8F2}
.sp-logo img{width:40px;height:auto;display:block}
.sp-ring{position:absolute;inset:-7px -7px -5px;border-radius:50%;border:2px solid rgb(227 174 90/.22);border-top-color:#E3AE5A;border-right-color:#E3AE5A;animation:sp-spin .8s linear 2}
.sp-word{margin-top:24px;font:600 13px/1 var(--font-display,system-ui),system-ui,sans-serif;letter-spacing:.28em;text-indent:.28em;white-space:nowrap;animation:sp-up .4s ease-out .12s both}
.sp-tag{margin-top:10px;font:400 12px/1.2 var(--font-sans,system-ui),system-ui,sans-serif;color:#BFB09F;animation:sp-up .4s ease-out .28s both}
.sp-bar{margin-top:18px;width:132px;height:2px;border-radius:2px;background:rgb(244 235 221/.16);overflow:hidden}
.sp-bar u{display:block;height:100%;background:#E3AE5A;transform-origin:0 50%;transform:scaleX(0);animation:sp-fill 1.4s cubic-bezier(.4,.1,.3,1) .15s forwards}
.sp-walk{position:relative;margin-top:16px;width:164px;height:30px;color:#E3AE5A}
.sp-row{position:absolute;left:0;right:0;bottom:4px;display:flex;justify-content:space-between;animation:sp-walk 1.5s linear .1s both}
.sp-row i{display:block;opacity:0;animation:sp-pop .3s ease-out both;animation-delay:calc(.2s + var(--i)*.09s)}
.sp-row svg{display:block}
.sp-ground{position:absolute;left:0;right:0;bottom:2px;height:1px;background:rgb(191 176 159/.35)}
.sp-skip{position:absolute;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));min-width:44px;min-height:44px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:#F4EBDD;font:600 13px/1 var(--font-sans,system-ui),system-ui,sans-serif;letter-spacing:.04em;cursor:pointer;opacity:.85}
.sp-skip::before{content:"";position:absolute;inset:6px 4px;border-radius:999px;border:1.5px solid rgb(244 235 221/.4);z-index:-1}
.sp-skip:focus-visible{outline:2px solid #E3AE5A;outline-offset:-2px}
#sp.is-skip{animation:sp-skip .16s ease forwards}
html[data-splash=skip] #sp,html[data-splash=done] #sp{display:none}
@media (prefers-reduced-motion:reduce){#sp{display:none}}
@keyframes sp-end{0%{opacity:1;visibility:visible}99%{opacity:0;visibility:visible}100%{opacity:0;visibility:hidden;pointer-events:none;display:none}}
@keyframes sp-skip{0%{opacity:1;visibility:visible}99%{opacity:0;visibility:visible}100%{opacity:0;visibility:hidden;pointer-events:none;display:none}}
@keyframes sp-in{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
@keyframes sp-up{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes sp-spin{to{transform:rotate(360deg)}}
@keyframes sp-fill{to{transform:scaleX(1)}}
@keyframes sp-walk{from{transform:translateX(-8px)}to{transform:translateX(8px)}}
@keyframes sp-pop{to{opacity:.95}}
`;
