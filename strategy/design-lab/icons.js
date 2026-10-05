/* Mikono brand icons: 24 grid, 1.75 stroke, round caps and joins, 2px corner radius feel.
   Each icon = .duo (earth-tone fill, optional) + .ln (stroke) + animated parts (.m1 .m2). */
(function(){
const I={
yarn:`<g class="duo"><circle cx="12" cy="12" r="8"/></g><g class="ln"><circle cx="12" cy="12" r="8"/><g class="m1"><path d="M5 9.2c4.6 2.2 9.4 2.2 14 0M4.6 13.6c5 2.4 10.2 2.4 14.8 0M9.4 4.4c-1.2 5.2 0 11 4 15.2"/></g><path d="M17.4 19.2c1.8 1 3.2.6 3.8-.8"/></g>`,
hook:`<g class="duo"><circle cx="18" cy="17.5" r="3.2"/></g><g class="ln"><g class="m1"><path d="M4.5 19.5 15.5 8.5"/><path d="M15.5 8.5c-1.3-1.5-.9-3.3.7-4.1 1.7-.8 3.5.1 3.7 1.7.1.9-.4 1.6-1.1 2"/></g><path d="M14.5 18c1.4 1.4 3.4 1.9 5 .9"/></g>`,
hands:`<g class="duo"><path class="m1" d="M12 5.4c-.9-1.5-3.6-1.4-3.6.8 0 1.7 2 2.8 3.6 4.1 1.6-1.300 3.6-2.400 3.600-4.100 0-2.200-2.700-2.300-3.600-.800z"/></g><g class="ln"><path class="m1" d="M12 5.4c-.9-1.5-3.6-1.4-3.6.8 0 1.7 2 2.8 3.6 4.1 1.6-1.300 3.600-2.400 3.600-4.100 0-2.200-2.700-2.300-3.600-.800z"/><path d="M3 14.500h2.800l3.200 2.200h4.600c1.100 0 1.600 1.300.7 1.900L11 20.600H5.800L3 19.200z"/><path d="M13.600 16.700 18 15.300c1.300-.4 2.500.9 1.700 2L15.500 21"/></g>`,
giraffe:`<g class="duo"><rect x="7" y="6.2" width="9.500" height="4.300" rx="2.100"/></g><g class="ln"><g class="m1"><path d="M9.500 3.600v2.600M13.500 3.600v2.600"/><rect x="7" y="6.200" width="9.500" height="4.300" rx="2.100"/><path d="M10 10.500V21M14.500 10.500V21"/></g><circle cx="12.250" cy="14" r=".7" class="dot"/><circle cx="12.250" cy="18" r=".7" class="dot"/><circle cx="14.400" cy="7.900" r=".5" class="dot"/></g>`,
elephant:`<g class="duo"><circle cx="8.600" cy="11" r="4.800"/></g><g class="ln"><circle cx="8.600" cy="11" r="4.800"/><g class="m1"><path d="M12.400 7.200c3.600-.6 6.200 1.500 6.200 4.800v5.200c0 1.800-2.400 1.800-2.400 0v-3.300"/></g><path d="M14.700 15.400c.2 1.600 1.100 2.800 2.600 3.200"/><circle cx="13.600" cy="10" r=".7" class="dot"/><path d="M4 18.800h8.400"/></g>`,
lion:`<g class="duo"><circle cx="12" cy="12" r="8.600"/></g><g class="ln"><g class="m1"><path d="M12 3.400l1.800 1.700 2.400-.4.800 2.300 2.200 1-.2 2.400 1.600 1.800-1.600 1.800.2 2.400-2.200 1-.8 2.300-2.400-.4L12 20.600l-1.800-1.700-2.400.4-.8-2.300-2.200-1 .2-2.400L3.400 12l1.600-1.800-.2-2.400 2.200-1 .8-2.300 2.400.4z"/></g><circle cx="12" cy="12.300" r="4"/><circle cx="10.500" cy="11.300" r=".6" class="dot"/><circle cx="13.500" cy="11.300" r=".6" class="dot"/><path d="M11 13.500h2l-1 1z"/></g>`,
rhino:`<g class="duo"><path d="M3.500 15.500V12l4-2.800h8.300a4.200 4.200 0 0 1 4.200 4.200v2.100z"/></g><g class="ln"><path d="M3.500 15.500V12l4-2.800h8.300a4.200 4.200 0 0 1 4.200 4.200v4.100H3.500z"/><g class="m1"><path d="M6.200 10.300 4.200 6.400l3.300 2.800"/></g><path d="M7 17.500v2.600M16.500 17.500v2.600"/><circle cx="9.800" cy="12" r=".7" class="dot"/><path d="M13 9.300l.5-1.800 1.600 1.900"/></g>`,
zebra:`<g class="duo"><path d="M8 4.600 10.500 7l4.200 1.700c2.300 1 3.500 3.100 3.500 5.800V20H9v-5.200"/></g><g class="ln"><g class="m1"><path d="M8 4.600 10.500 7l4.200 1.700c2.300 1 3.500 3.100 3.500 5.800V20H9v-5.200L6.300 12.500 7 8.800z"/></g><path d="M12.400 9.800l2.600 3M13.600 7.900l3.400 3.600M10.700 12.700l3.400 3.300M12 17h3.900M18.200 17.800" /><circle cx="9.200" cy="8.700" r=".6" class="dot"/></g>`,
rabbit:`<g class="duo"><circle cx="12" cy="14.800" r="5.200"/></g><g class="ln"><g class="m1"><path d="M9.300 10.300C7.700 6 8 3 9.500 3s2.200 3 2 7.300M14.700 10.300c1.600-4.300 1.300-7.300-.2-7.300s-2.200 3-2 7.300"/></g><circle cx="12" cy="14.800" r="5.200"/><circle cx="10.200" cy="14" r=".6" class="dot"/><circle cx="13.800" cy="14" r=".6" class="dot"/><path d="M11 16.300l1 .8 1-.8"/></g>`,
gift:`<g class="duo"><rect x="4" y="10.500" width="16" height="9.500" rx="2"/></g><g class="ln"><rect x="4" y="10.500" width="16" height="9.500" rx="2"/><g class="m1"><rect x="3" y="7" width="18" height="3.500" rx="1.400"/><path d="M12 7C10 3.500 6.800 4 7.500 6c.4 1 2.500 1 4.500 1zM12 7c2-3.500 5.200-3 4.500-1-.4 1-2.500 1-4.500 1z"/></g><path d="M12 10.500V20"/></g>`,
truck:`<g class="duo"><rect x="2.500" y="6" width="11" height="10" rx="2"/></g><g class="ln"><g class="m1"><rect x="2.500" y="6" width="11" height="10" rx="2"/><path d="M13.500 9.500h4l3 3.300V16h-7"/></g><circle class="m2" cx="7" cy="17.500" r="2"/><circle class="m2" cx="17" cy="17.500" r="2"/></g>`,
whatsapp:`<g class="duo"><path d="M12 3.500a8.500 8.500 0 0 0-7.300 12.800L3.600 20.400l4.200-1.100A8.500 8.500 0 1 0 12 3.500z"/></g><g class="ln"><g class="m1"><path d="M12 3.500a8.500 8.500 0 0 0-7.300 12.800L3.600 20.400l4.200-1.100A8.500 8.500 0 1 0 12 3.500z"/></g><path d="M9.200 8.600c-.5.600-.7 1.500-.1 2.700a8.200 8.200 0 0 0 3.600 3.500c1.100.5 1.900.3 2.500-.3l.3-.7-1.800-1-.8.600c-.8-.4-1.600-1.100-2.100-2l.6-.8-.9-1.800z"/></g>`,
arrow:`<g class="ln"><path d="M5 12h14M13 6l6 6-6 6"/></g>`,
chev:`<g class="ln"><path d="M6 9l6 6 6-6"/></g>`,
bag:`<g class="duo"><path d="M5 8h14l-1 12H6z"/></g><g class="ln"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.500a3 3 0 0 1 6 0V8"/></g>`,
menu:`<g class="ln"><path d="M4 9h16M4 15h16"/></g>`,
close:`<g class="ln"><path d="M6 6l12 12M18 6 6 18"/></g>`
};
const clean=s=>s.replace(/(\d)\.(\d{3})\d*/g,'$1.$2').replace(/(\.\d*?)0+(?=\D)/g,'$1');
function paint(root){(root||document).querySelectorAll('[data-ic]').forEach(el=>{
 const n=el.getAttribute('data-ic');if(!I[n])return;
 el.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+I[n]+'</svg>';
 el.classList.add('icw');el.removeAttribute('data-ic');});}
window.MK_ICONS=I;window.mkPaint=paint;paint();
/* tilt + parallax, off for reduced motion */
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!rm){
 document.querySelectorAll('.tilt').forEach(c=>{
  c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.setProperty('--rx',(-y*8).toFixed(2)+'deg');c.style.setProperty('--ry',(x*10).toFixed(2)+'deg');c.style.setProperty('--mx',(x+.5)*100+'%');c.style.setProperty('--my',(y+.5)*100+'%');});
  c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');});});
 const h=document.querySelector('.hero');
 if(h)h.addEventListener('pointermove',e=>{const r=h.getBoundingClientRect();h.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));h.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3));});
}
/* nav + menus */
const nav=document.querySelector('.nav'),mb=document.querySelector('[data-mega]');
if(mb)mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
const bg=document.querySelector('[data-burger]');
if(bg)bg.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');bg.setAttribute('aria-expanded',o)});
addEventListener('keydown',e=>{if(e.key==='Escape'){nav&&nav.classList.remove('open');document.body.classList.remove('menu-open')}});
})();
