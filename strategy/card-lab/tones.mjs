// Generates tones.css and contrast.json. Pure node, no deps. Run: node tones.mjs
import fs from 'node:fs';
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const lin=c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;
const gam=c=>c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055;
export function hex2rgb(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)}
export function rgb2hex(r){return '#'+r.map(v=>Math.round(clamp(v)*255).toString(16).padStart(2,'0')).join('').toUpperCase()}
export function rgb2oklch([r,g,b]){const [R,G,B]=[r,g,b].map(lin);
 const l=Math.cbrt(0.4122214708*R+0.5363325363*G+0.0514459929*B),m=Math.cbrt(0.2119034982*R+0.6806995451*G+0.1073969566*B),s=Math.cbrt(0.0883024619*R+0.2817188376*G+0.6299787005*B);
 const L=0.2104542553*l+0.793617785*m-0.0040720468*s,a=1.9779984951*l-2.428592205*m+0.4505937099*s,bb=0.0259040371*l+0.7827717662*m-0.808675766*s;
 return {L,C:Math.hypot(a,bb),H:(Math.atan2(bb,a)*180/Math.PI+360)%360}}
function oklch2rgbRaw(L,C,H){const a=C*Math.cos(H*Math.PI/180),b=C*Math.sin(H*Math.PI/180);
 const l=(L+0.3963377774*a+0.2158037573*b)**3,m=(L-0.1055613458*a-0.0638541728*b)**3,s=(L-0.0894841775*a-1.291485548*b)**3;
 return [4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.707614701*s]}
export function oklch2hex(L,C,H){let c=C;for(let i=0;i<40;i++){const raw=oklch2rgbRaw(L,c,H);if(raw.every(v=>v>=-0.0005&&v<=1.0005))return rgb2hex(raw.map(gam));c*=0.96}return rgb2hex(oklch2rgbRaw(L,0,H).map(gam))}
export const lum=h=>{const [r,g,b]=hex2rgb(h).map(lin);return .2126*r+.7152*g+.0722*b};
export const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
export const chroma=h=>rgb2oklch(hex2rgb(h)).C;
const CREAM='#FFF8EC', PAPER='#FBF8F2', INK='#2A2420', INKSOFT='#5F5348';
const T={
 amber:{name:'Shop and animals',top:[.84,.100,84],mid:[.62,.105,72],deep:[.45,.080,62],tint:[.945,.032,86],tint2:[.90,.050,84],accInk:[.43,.085,62],btnA:[.53,.092,62],btnB:[.43,.078,58],halo:[.80,.09,84],gem:[.78,.10,82]},
 terracotta:{name:'Custom and make it yours',top:[.74,.098,50],mid:[.57,.115,40],deep:[.38,.088,34],tint:[.94,.030,50],tint2:[.90,.048,48],accInk:[.42,.098,36],btnA:[.52,.108,38],btnB:[.42,.092,34],halo:[.78,.09,50],gem:[.74,.10,52]},
 olive:{name:'Wholesale and trade',top:[.74,.078,118],mid:[.57,.068,116],deep:[.37,.052,112],tint:[.945,.030,112],tint2:[.90,.045,114],accInk:[.40,.062,113],btnA:[.49,.062,114],btnB:[.39,.054,112],halo:[.80,.07,118],gem:[.76,.08,116]},
 baobab:{name:'Story, makers and impact',top:[.54,.046,56],mid:[.37,.032,52],deep:[.20,.016,50],tint:[.93,.020,70],tint2:[.88,.030,70],accInk:[.38,.045,54],btnA:[.36,.040,52],btnB:[.25,.025,50],halo:[.72,.06,70],gem:[.80,.105,82]},
 slate:{name:'Journal and learning',top:[.74,.040,232],mid:[.57,.048,236],deep:[.34,.038,240],tint:[.945,.016,230],tint2:[.90,.026,232],accInk:[.40,.052,238],btnA:[.46,.050,238],btnB:[.36,.042,240],halo:[.82,.04,232],gem:[.78,.05,232]},
};
const mixHex=(a,b,k)=>rgb2hex(hex2rgb(a).map((v,i)=>v*k+hex2rgb(b)[i]*(1-k)));
const out={}, css=[];
for(const [k,t] of Object.entries(T)){
 const h={};for(const n of ['top','mid','deep','tint','tint2','accInk','btnA','btnB','halo','gem'])h[n]=oklch2hex(...t[n]);
 const m=t.mid,d=t.deep;h.stat=oklch2hex(d[0]+(m[0]-d[0])*0.38,d[1]+(m[1]-d[1])*0.38,d[2]);
 const checks=[
  ['cream on head deep (numeral/gloss text zone)',CREAM,h.deep,4.5],
  ['cream on head mid (tag/medallion glyph, 3:1 UI)',CREAM,h.mid,3],
  ['cream on CTA top',CREAM,h.btnA,4.5],
  ['cream on CTA bottom',CREAM,h.btnB,4.5],
  ['ink on tint (footer name)',INK,h.tint,4.5],
  ['ink-soft on tint (meta)',INKSOFT,h.tint,4.5],
  ['ink-soft on tint2',INKSOFT,h.tint2,4.5],
  ['accent-ink on tint (link, tag text)',h.accInk,h.tint,4.5],
  ['accent-ink on paper (link)',h.accInk,PAPER,4.5],
  ['ink on paper (title)',INK,PAPER,4.5],
  ['ink-soft on paper (body)',INKSOFT,PAPER,4.5],
  ['ink on tag pill (paper)',INK,PAPER,4.5],
  ['accent-ink on tag pill (paper)',h.accInk,PAPER,4.5],
  ['cream on stat top (stat card text zone)',CREAM,h.stat,4.5],
  ['cream .9 alpha approx on stat top',mixHex(CREAM,h.stat,.9),h.stat,4.5],
  ['head mid vs paper (outline/medallion edge, 3:1)',h.mid,PAPER,3],
 ].map(([n,a,b,min])=>({n,a,b,r:+ratio(a,b).toFixed(2),min,pass:ratio(a,b)>=min}));
 const chromas=Object.fromEntries(Object.entries(h).map(([n,v])=>[n,+chroma(v).toFixed(3)]));
 const maxC=Math.max(...Object.values(chromas));
 out[k]={name:t.name,hex:h,oklch:Object.fromEntries(Object.entries(t).filter(([n])=>Array.isArray(t[n])).map(([n,v])=>[n,`oklch(${v[0]} ${v[1]} ${v[2]})`])),chromas,maxC,checks};
 const rgbTriplet=hex2rgb(h.deep).map(v=>Math.round(v*255)).join(' ');
 css.push(`[data-tone="${k}"]{--t-top:${h.top};--t-mid:${h.mid};--t-deep:${h.deep};--t-tint:${h.tint};--t-tint2:${h.tint2};--t-ink:${h.accInk};--t-btn-a:${h.btnA};--t-btn-b:${h.btnB};--t-halo:${h.halo};--t-gem:${h.gem};--t-stat:${h.stat};--t-rgb:${rgbTriplet};--t-pat:var(--pat-${k})}`);
}
fs.writeFileSync('tones.css','/* generated by tones.mjs, do not edit */\n'+css.join('\n')+'\n');
fs.writeFileSync('contrast.json',JSON.stringify(out,null,1));
let bad=0;for(const [k,v] of Object.entries(out)){console.log(k,JSON.stringify(v.hex),'maxC',v.maxC);for(const c of v.checks){if(!c.pass){bad++;console.log('  FAIL',c.n,c.r,'<',c.min)}}}
console.log(bad?`${bad} FAILS`:'ALL PASS');
