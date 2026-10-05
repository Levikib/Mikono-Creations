// QA: node qa.mjs  (equal heights, CTA alignment, fill ratio, overflow, contrast and chroma from tones, hit areas)
import { chromium } from '/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import {chroma,ratio} from './tones.mjs';
const b=await chromium.launch({executablePath:process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const rep=[];let fails=0;
for(const pg of ['cards','contexts'])for(const w of [390,768,1440]){
 const p=await b.newPage({viewport:{width:w,height:900}});await p.goto('file://'+process.cwd()+`/${pg}.html`);await p.waitForTimeout(500);
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}});await p.waitForTimeout(300);
 const r=await p.evaluate(()=>{
  const out={rows:[],overflowX:document.documentElement.scrollWidth>innerWidth+1,small:[],fill:[]};
  document.querySelectorAll('.mk-grid').forEach(g=>{
   const cards=[...g.children].filter(c=>c.matches('.mk-card'));const byTop={};
   cards.forEach(c=>{const t=Math.round(c.getBoundingClientRect().top+scrollY-(c.classList.contains('is-feat')&&innerWidth>=640?-6:0));(byTop[t]??=[]).push(c)});
   Object.values(byTop).forEach(row=>{const hs=row.map(c=>Math.round(c.getBoundingClientRect().height*10)/10);
     const ctas=row.map(c=>{const a=c.querySelector('.mk-cta,.mk-link');return a?Math.round(a.getBoundingClientRect().bottom-c.getBoundingClientRect().bottom):0});
     out.rows.push({kind:row[0].dataset.card,n:row.length,spread:Math.max(...hs)-Math.min(...hs),ctaSpread:Math.max(...ctas)-Math.min(...ctas)})})});
  document.querySelectorAll('.mk-card').forEach(c=>{
   const r=c.getBoundingClientRect();const kids=[...c.querySelectorAll('.mk-head,.mk-title,.mk-text,.mk-meta,.mk-cta,.mk-link,.mk-facts,.mk-big,.mk-gem,.mk-over')].map(e=>e.getBoundingClientRect()).filter(k=>k.height>0);
   const segs=kids.map(k=>[Math.max(k.top-6,r.top),Math.min(k.bottom+6,r.bottom)]).sort((a,b)=>a[0]-b[0]);let cov=0,end=r.top;
   for(const [s,e] of segs){const st=Math.max(s,end);if(e>st){cov+=e-st;end=e}}
   out.fill.push({kind:c.dataset.card,ratio:+(cov/r.height).toFixed(3)});
   c.querySelectorAll('a').forEach(a=>{const ar=a.getBoundingClientRect();if(a.offsetParent&&ar.width&&!a.matches('.mk-title a,.mk-over a')){const cs=getComputedStyle(a,'::after');const ext=cs.content!=='none'?{w:ar.width+parseFloat(cs.left?.valueOf()||0)*0,h:0}:null;const h=ar.height+(cs.content!=='none'?(a.matches('.mk-link')?16:12):0);if(h<44&&!a.hasAttribute('tabindex'))out.small.push(a.textContent.trim().slice(0,20)+' '+Math.round(h))}})
  });return out});
 const bad=r.rows.filter(x=>x.spread>0.5);const badC=r.rows.filter(x=>x.ctaSpread>0.5);
 const minFill=Math.min(...r.fill.map(f=>f.ratio));const byKind={};r.fill.forEach(f=>{(byKind[f.kind]??=[]).push(f.ratio)});
 const fk=Object.fromEntries(Object.entries(byKind).map(([k,v])=>[k,+Math.min(...v).toFixed(2)]));
 rep.push({pg,w,rows:r.rows.length,heightSpreadFail:bad.length,ctaAlignFail:badC.length,overflowX:r.overflowX,minFill,fillByKind:fk,smallTargets:[...new Set(r.small)].slice(0,5)});
 fails+=bad.length+badC.length+(r.overflowX?1:0);await p.close();
}
await b.close();
// chroma budget over every colour literal in css
const css=fs.readFileSync('cards.css','utf8')+fs.readFileSync('tones.css','utf8');
const hexes=[...new Set(css.match(/#[0-9a-fA-F]{6}\b/g)||[])];const over=hexes.filter(h=>chroma(h)>0.13).map(h=>h+' '+chroma(h).toFixed(3));
const tones=JSON.parse(fs.readFileSync('contrast.json','utf8'));const aaFail=Object.values(tones).flatMap(t=>t.checks.filter(c=>!c.pass));
// literal text colours used on dark heads and stat cards
const extra=Object.entries(tones).map(([k,t])=>({n:k+' cream on stat top',r:+ratio('#FFF8EC',t.hex.stat).toFixed(2),m:4.5}));
console.log(JSON.stringify(rep,null,1));console.log('chroma literals checked',hexes.length,'over 0.13:',over);console.log('AA fails in tone checks:',aaFail.length);console.log('extra pairs',JSON.stringify(extra));
fs.writeFileSync('qa-report.json',JSON.stringify({rep,over,extra},null,1));
process.exit(fails||over.length||aaFail.length?1:0);
