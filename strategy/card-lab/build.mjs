// Builds cards.html and contexts.html from one set of card helper functions. Run: node build.mjs
import fs from 'node:fs';
const C=JSON.parse(fs.readFileSync('contrast.json','utf8'));
const ic={
 bag:"M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0",
 yarn:"M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM5 10c5 2 9 2 14-1M6 16c4-2 8-2 12 0M9 4.6c0 6 1 11 6 15",
 many:"M9 8.5a3 3 0 1 0 0 .1zM17 10a2.4 2.4 0 1 0 0 .1zM3 19c0-3.5 3-5 6-5s6 1.5 6 5M15 14.5c3 0 6 1 6 4.5",
 book:"M4 5.5C7 4.5 9.5 5 12 7c2.5-2 5-2.5 8-1.5V18c-3-1-5.5-.5-8 1.5-2.5-2-5-2.5-8-1.5zM12 7v12",
 gift:"M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2.5 0-4.5-1-4.5-2.7S10 3 12 7c2-4 4.5-3.3 4.5-2.7S14.500 7 12 7",
 pin:"M12 21s-6-5.500-6-11a6 6 0 0 1 12 0c0 5.500-6 11-6 11zM12 7.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z",
 leaf:"M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19c3-5 6-8 10-10",
 chat:"M4 20l1.500-4.500A8 8 0 1 1 9 18.500z",
 arrow:"M5 12h14M13 6l6 6-6 6",
 ruler:"M3 15L15 3l6 6L9 21zM8 10l2 2M11 7l2 2M5 13l2 2",
 sun:"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
 shield:"M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z",
 hand:"M8 12V6a1.500 1.500 0 0 1 3 0v5M11 11V4.500a1.500 1.500 0 0 1 3 0V11M14 11V6a1.500 1.500 0 0 1 3 0v8c0 4-2.500 6-5.500 6S7 18 6 15l-1.500-3a1.500 1.500 0 0 1 3-1z",
 truck:"M3 6h11v10H3zM14 9h4l3 3v4h-7M7 18.500a1.500 1.500 0 1 0 0-.1zM17 18.500a1.500 1.500 0 1 0 0-.1z",
 paw:"M7 11a1.700 2.200 0 1 0 0 .1zM17 11a1.700 2.200 0 1 0 0 .1zM10 6.500a1.600 2.200 0 1 0 0 .1zM14 6.500a1.600 2.200 0 1 0 0 .1zM12 12c-3 0-5 2.500-5 4.500 0 1.500 1.500 2 3 1.500l2-.5 2 .5c1.500.5 3 0 3-1.500 0-2-2-4.500-5-4.500z",
 tag:"M3 12V4h8l10 10-8 8z M7.500 8.500h.01",
};
const I=(n,cls='i')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ic[n]}"/></svg>`;
const gem=n=>`<span class="mk-gem">${I(n)}</span>`;
const T=(tone,label,num)=>`<span class="mk-tag">${num?`<i>${num}</i>`:''}${label}</span>`;
// --- card helpers: one anatomy, many heads ---
export const Photo=({tone='amber',img,tag,name,meta,cta='Ask for price',href='#'})=>`
<article class="mk-card mk-card--photo" data-tone="${tone}" data-card="photo">
 <div class="mk-head"><div class="mk-photo"><img src="img/${img}" alt="Crocheted ${name.toLowerCase()}" loading="lazy" width="400" height="400"></div>${tag?T(tone,tag):''}</div>
 <div class="mk-foot"><div class="mk-txt"><h3 class="mk-title"><a href="${href}">${name}</a></h3><span class="mk-meta">${meta}</span></div><a class="mk-cta mk-cta--icon" href="${href}" aria-label="${cta}: ${name}">${I('chat')}<span class="mk-cta__t">${cta}</span></a></div>
</article>`;
export const Feature=({tone,icon,tag,title,text,link='Learn more',href='#',num})=>`
<article class="mk-card mk-card--feature" data-tone="${tone}" data-card="feature">
 <div class="mk-head">${tag?T(tone,tag):''}${gem(icon)}${num?`<span class="mk-num" aria-hidden="true">${num}</span>`:''}</div>
 <div class="mk-body"><h3 class="mk-title"><a href="${href}">${title}</a></h3><p class="mk-text">${text}</p></div>
 <div class="mk-foot"><a class="mk-link" href="${href}">${link}${I('arrow')}</a></div>
</article>`;
export const Tier=({tone,icon,tag,num,title,text,facts=[],cta,href='#',feat=false,meta})=>`
<article class="mk-card mk-card--tier${feat?' is-feat':''}" data-tone="${tone}" data-card="tier">
 <div class="mk-head">${T(tone,tag)}<span class="mk-num" aria-hidden="true">${num}</span>${gem(icon)}</div>
 <div class="mk-body"><h3 class="mk-title"><a href="${href}">${title}</a></h3><p class="mk-text">${text}</p>${facts.length?`<ul class="mk-facts">${facts.map(f=>`<li>${f}</li>`).join('')}</ul>`:''}</div>
 <div class="mk-foot">${meta?`<span class="mk-meta">${meta}</span>`:''}<a class="mk-cta" href="${href}">${cta}${I('arrow')}</a></div>
</article>`;
export const Stat=({tone,tag,big,title,text,link,href='#'})=>`
<article class="mk-card mk-card--stat" data-tone="${tone}" data-card="stat">
 <div class="mk-head">${T(tone,tag)}<span class="mk-big">${big}</span><span class="mk-bead"></span></div>
 <div class="mk-body"><h3 class="mk-title"><a href="${href}">${title}</a></h3><p class="mk-text">${text}</p></div>
 <div class="mk-foot"><a class="mk-link" href="${href}">${link}${I('arrow')}</a></div>
</article>`;
export const Story=({tone,img,tag,num,title,text,meta,link='Read',href='#',alt=''})=>`
<article class="mk-card mk-card--story" data-tone="${tone}" data-card="story">
 <div class="mk-head"><div class="mk-photo"><img src="img/${img}" alt="${alt}" loading="lazy" width="640" height="400"></div><span class="mk-scrim"></span>${T(tone,tag,num)}<h3 class="mk-over"><a href="${href}">${title}</a></h3></div>
 <div class="mk-body" data-title="${title}"><p class="mk-text">${text}</p></div>
 <div class="mk-foot"><span class="mk-meta">${meta}</span><a class="mk-link" href="${href}" tabindex="-1" aria-hidden="true">${link}${I('arrow')}</a></div>
</article>`;
export const Link=({tone,icon,title,text,href='#'})=>`
<article class="mk-card mk-card--link" data-tone="${tone}" data-card="link">
 <div class="mk-head">${gem(icon)}</div>
 <div class="mk-body"><h3 class="mk-title"><a href="${href}">${title}</a></h3><p class="mk-text">${text}</p></div>
 <div class="mk-foot">${I('arrow')}</div>
</article>`;
export const Band=({tone,tag,title,text,cta,cta2,href='#'})=>`
<section class="mk-band" data-tone="${tone}" data-card="band"><div>${T(tone,tag)}<h3>${title}</h3><p>${text}</p></div><div class="mk-acts"><a class="mk-cta" href="${href}">${cta}${I('arrow')}</a>${cta2?`<a class="mk-cta" href="${href}" style="background:rgb(255 248 236/.0);color:var(--cream);box-shadow:inset 0 0 0 1.5px rgb(255 248 236/.7)">${cta2}</a>`:''}</div></section>`;
const head=(title)=>`<!doctype html><html lang="en-KE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="tones.css"><link rel="stylesheet" href="cards.css"><style>
body{margin:0;background:var(--bone);background-image:radial-gradient(900px 480px at 88% -4%,rgb(255 255 255/.85),transparent 62%),radial-gradient(700px 480px at -4% 52%,rgb(201 160 90/.12),transparent 62%);color:var(--ink);font:400 14px/1.5 var(--font-sans);-webkit-font-smoothing:antialiased}
.wrap{max-width:1180px;margin:0 auto;padding:12px 16px 40px}
h1{font:800 clamp(22px,1.3rem + 1.4vw,34px)/1.05 var(--font-display);letter-spacing:-.04em;margin:8px 0 4px}
.lead{color:var(--ink-soft);max-width:70ch;margin:0 0 6px;font-size:14px}
.spec{font:400 11px/1.4 var(--font-mono);color:var(--ink-soft);letter-spacing:.04em;margin:0 0 6px;text-transform:uppercase}
.sw{display:grid;grid-template-columns:repeat(auto-fit,minmax(172px,1fr));gap:8px}
.sw div{border-radius:12px;padding:8px;background:var(--paper);box-shadow:0 0 0 1px rgb(90 63 50/.14);font:400 11px/1.35 var(--font-mono);color:var(--ink-soft)}
.sw .bar{height:38px;border-radius:8px;margin-bottom:6px}
.sw b{display:block;font:700 12px/1.2 var(--font-display);color:var(--ink);margin-bottom:2px}
.nav{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 4px}.nav a{font:400 11px var(--font-mono);color:var(--ink-soft);letter-spacing:.06em;text-transform:uppercase}
.two{display:grid;gap:12px;grid-template-columns:1fr}@media(min-width:900px){.two{grid-template-columns:1fr 1fr}}
.cap{font:400 11px/1.4 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);margin:10px 0 6px}
.hdr{display:flex;align-items:center;gap:10px;margin:6px 0 2px}.hdr img{width:30px;height:30px}
.ph{max-width:100%}@media(max-width:700px){.ph,.ph+.cap,.cap.has-ph{display:none}}
.phone{width:390px;max-width:100%;border-radius:20px;background:var(--bone);padding:12px 16px;box-shadow:0 0 0 1px rgb(90 63 50/.2)}
</style></head><body><div class="wrap">`;
const foot=`</div></body></html>`;
const P=(img,name,tag='Safari')=>({img,name,tag,meta:'S to XL'});
const photos=[P('lion.webp','Lion'),P('giraffe.webp','Yellow giraffe'),P('giraffe2.webp','Orange giraffe'),P('elephant.webp','Caramel elephant'),P('zebra.webp','Zebra'),P('rhino.webp','Blue rhino'),P('monkey.webp','Monkey','More'),P('turtle.webp','Turtle','More')];
const tiers=()=>[
 Tier({tone:'amber',icon:'bag',tag:'Shop',num:'01',title:'Ready to go',text:'Pick a finished animal and ask for the price on WhatsApp.',facts:['S to XL','Zero plastic'],cta:'Shop animals',href:'/shop'}),
 Tier({tone:'terracotta',icon:'yarn',tag:'Custom',num:'02',title:'Make it yours',text:'Choose the animal, colours and size, and we crochet it by hand.',facts:['Your colours','Made for you'],cta:'Start yours',href:'/custom',feat:true}),
 Tier({tone:'olive',icon:'many',tag:'Trade',num:'03',title:'For many',text:'Shops, events and groups. We send the price list on WhatsApp.',facts:['Price list','Sample pack'],cta:'Ask for list',href:'/wholesale'}),
];
const ways=(extra='')=>`<div class="mk-grid mk-grid--3 mk-grid--tiers ${extra}">${tiers().join('')}</div>`;
export {head,foot,I,ways,photos,tiers};
// ================= cards.html =================
let h=head('Mikono card system, prototype');
h+=`<div class="hdr"><img src="img/../../../public/logo-mark.png" alt="" onerror="this.remove()"><span class="spec">Mikono card system / strategy 14 / static prototype</span></div>
<h1>One card. Five tones. Seven variants.</h1>
<p class="lead">Every card has the same three zones (head, body, foot), the same 18px radius, 12px padding, a 52px foot with the action pinned at the bottom, and equal height in a row. Tone is chosen by meaning, never at random.</p>
<div class="nav"><a href="#tones">Tones</a><a href="#tiers">Three ways</a><a href="#photo">Photo</a><a href="#feature">Feature</a><a href="#stat">Stat</a><a href="#story">Story</a><a href="#link">Link</a><a href="#band">Band</a><a href="contexts.html">Contexts page</a></div>
<div class="mk-sec" id="tones" data-tone="amber"><p class="mk-eyebrow">Tone map</p><h2>Five tones, assigned by meaning</h2>
<div class="sw">${Object.entries(C).map(([k,v])=>{const hx=v.hex;const ok=v.checks.filter(c=>c.pass).length;return `<div data-tone="${k}"><span class="bar" style="background:linear-gradient(160deg,${hx.top},${hx.mid} 46%,${hx.deep})"></span><b>${v.name}</b>top ${hx.top}<br>mid ${hx.mid}<br>deep ${hx.deep}<br>tint ${hx.tint}<br>max chroma ${v.maxC} / ${v.checks.length} AA checks: ${ok} pass</div>`}).join('')}</div></div>
<div class="mk-sec" id="tiers" data-tone="terracotta"><p class="mk-eyebrow">TierCard, home</p><h2>Three ways to take one home</h2>
${ways()}
<p class="cap has-ph">Phone option A, chosen: tight vertical stack of rows (rail + body + foot, 3 cards about 330px tall in total, nothing hidden)</p>
<iframe class="ph" src="phone-tiers.html" title="Phone option A" width="390" height="400" style="border:0;border-radius:18px;box-shadow:0 0 0 1px rgb(90 63 50/.2);background:#F3EEE5"></iframe>
<p class="cap has-ph">Phone option B, rejected: snap row (third card hidden, leaves dead space under the cards, fails no-hidden-content)</p>
<iframe class="ph" src="phone-snap.html" title="Phone option B" width="390" height="330" style="border:0;border-radius:18px;box-shadow:0 0 0 1px rgb(90 63 50/.2);background:#F3EEE5"></iframe></div>
<div class="mk-sec" id="photo" data-tone="amber"><p class="mk-eyebrow">PhotoCard, shop and animals</p><h2>Safari animals</h2>
<div class="mk-grid">${photos.map(p=>Photo({tone:'amber',...p})).join('')}</div></div>
<div class="mk-sec" data-tone="amber"><p class="mk-eyebrow">PhotoCard tones side by side</p><h2>The same card in every tone</h2>
<div class="mk-grid mk-grid--5">${[['amber','giraffe.webp','Giraffe'],['terracotta','lion.webp','Lion'],['olive','elephant.webp','Elephant'],['baobab','rhino.webp','Rhino'],['slate','zebra.webp','Zebra']].map(([t,i,n])=>Photo({tone:t,img:i,name:n,tag:t==='terracotta'?'Custom':t==='olive'?'Trade':t==='baobab'?'Story':t==='slate'?'Learn':'Shop',meta:'S to XL',cta:'Open'})).join('')}</div></div>
<div class="mk-sec" id="feature" data-tone="slate"><p class="mk-eyebrow">FeatureCard</p><h2>Why Mikono</h2>
<div class="mk-grid">
${Feature({tone:'slate',icon:'leaf',tag:'Material',title:'Zero plastic',text:'Soft crocheted animals with no plastic parts.',link:'Safety',href:'/safety',num:'01'})}
${Feature({tone:'slate',icon:'shield',tag:'Build',title:'Nothing detachable',text:'Eyes and noses are worked into the crochet.',link:'Safety',href:'/safety',num:'02'})}
${Feature({tone:'slate',icon:'yarn',tag:'Yarn',title:'Recycled acrylic yarn',text:'Made from recycled acrylic yarn, easy to clean.',link:'Care guide',href:'/care',num:'03'})}
${Feature({tone:'baobab',icon:'hand',tag:'People',title:'25+ women supported',text:'Every animal is crocheted by hand in Nairobi.',link:'Our impact',href:'/impact',num:'04'})}
</div></div>
<div class="mk-sec" id="stat" data-tone="baobab"><p class="mk-eyebrow">StatCard / FactTile, confirmed facts only</p><h2>Facts</h2>
<div class="mk-grid">
${Stat({tone:'baobab',tag:'People',big:'25+',title:'Women supported',text:'Hands that crochet every animal.',link:'Impact',href:'/impact'})}
${Stat({tone:'olive',tag:'Stockists',big:'7',title:'Outlets in Nairobi',text:'Find us in malls, markets and Karen.',link:'Stockists',href:'/stockists'})}
${Stat({tone:'terracotta',tag:'Since',big:'2019',title:'Made in Nairobi',text:'Founded by Leah Maina.',link:'Our story',href:'/story'})}
${Stat({tone:'amber',tag:'Sizes',big:'S to XL',title:'Four size classes',text:'Choose by comparison, not centimetres.',link:'Size guide',href:'/size-guide'})}
</div></div>
<div class="mk-sec" id="story" data-tone="slate"><p class="mk-eyebrow">StoryCard, journal and projects</p><h2>From the journal</h2>
<div class="mk-grid mk-rowmobile">
${Story({tone:'slate',img:'hands-stitching-giraffe-parts-640.webp',tag:'How it is made',num:'01',title:'From yarn to giraffe',text:'Follow one giraffe from a skein of yarn to a finished animal.',meta:'Journal',href:'/journal/yarn-to-giraffe',alt:'Hands stitching giraffe parts'})}
${Story({tone:'slate',img:'maker-crocheting-toy-waiting-560.webp',tag:'Our name',num:'02',title:'What Mikono means',text:'Mikono is the Swahili word for hands. A note on the name.',meta:'Journal',href:'/journal/what-mikono-means',alt:'A maker crocheting'})}
${Story({tone:'baobab',img:'hands-crocheting-yellow-giraffe-640.webp',tag:'Project',num:'03',title:'Making giraffes',text:'A run of yellow giraffes, crocheted one round at a time.',meta:'Projects',href:'/projects/making-giraffes',alt:'Hands crocheting a yellow giraffe'})}
${Story({tone:'baobab',img:'maker-at-stall-640.webp',tag:'Makers',num:'04',title:'The market table',text:'Lions, rabbits and giraffes laid out for a market morning.',meta:'Projects',href:'/projects/the-market-table',alt:'Maker at a market stall'})}
</div></div>
<div class="mk-sec" id="link" data-tone="olive"><p class="mk-eyebrow">LinkCard, menu and stockists</p><h2>Stockists</h2>
<div class="mk-grid mk-grid--1">
${Link({tone:'olive',icon:'pin',title:'Blue Rhino Shop',text:'Village Market Mall'})}
${Link({tone:'olive',icon:'pin',title:'Giraffe Centre',text:'Karen'})}
${Link({tone:'olive',icon:'pin',title:'Marula Green Market',text:'16 Marula Lane, Karen'})}
</div></div>
<div class="mk-sec" id="band" data-tone="terracotta"><p class="mk-eyebrow">PromoBand</p><h2>Band</h2>
${Band({tone:'terracotta',tag:'Custom',title:'Design your own crocheted animal',text:'Pick the animal, the colours and the size. We make it by hand in Nairobi.',cta:'Start yours',cta2:'See how',href:'/custom'})}
<div style="height:8px"></div>
${Band({tone:'olive',tag:'Trade',title:'Stock Mikono in your shop',text:'Ask for the price list or a sample pack. A person replies on WhatsApp.',cta:'Ask for the list',href:'/wholesale'})}
</div>`+foot;
fs.writeFileSync('cards.html',h);
// ================= contexts.html =================
let c=head('Mikono cards in context');
c+=`<div class="hdr"><span class="spec">Same cards, every page / strategy 14</span></div><h1>Cards in context</h1>
<p class="lead">Home, shop, gifts, journal, stockists, makers and wholesale use the same anatomy and the same helpers. Only the tone and the head content change, and the tone follows the meaning of the page.</p>
<div class="mk-sec" data-tone="terracotta"><p class="mk-eyebrow">Home</p><h2>Three ways to take one home</h2>${ways()}</div>
<div class="mk-sec" data-tone="slate"><p class="mk-eyebrow">Home trust strip</p><h2>Why Mikono</h2><div class="mk-grid">
${Feature({tone:'slate',icon:'leaf',tag:'Material',title:'Zero plastic',text:'Soft crocheted animals with no plastic parts.',link:'Safety',href:'/safety'})}
${Feature({tone:'slate',icon:'shield',tag:'Build',title:'Nothing detachable',text:'Eyes and noses are worked into the crochet.',link:'Safety',href:'/safety'})}
${Feature({tone:'slate',icon:'yarn',tag:'Yarn',title:'Recycled acrylic yarn',text:'Made from recycled acrylic yarn, easy to clean.',link:'Care guide',href:'/care'})}
${Feature({tone:'baobab',icon:'hand',tag:'People',title:'25+ women supported',text:'Every animal is crocheted by hand in Nairobi.',link:'Our impact',href:'/impact'})}</div></div>
<div class="mk-sec" data-tone="amber"><p class="mk-eyebrow">Shop</p><h2>Safari animals</h2><div class="mk-grid">${photos.slice(0,8).map(p=>Photo({tone:'amber',...p})).join('')}</div></div>
<div class="mk-sec" data-tone="amber"><p class="mk-eyebrow">Gifts</p><h2>Gift ideas</h2><div class="mk-grid">
${Feature({tone:'amber',icon:'gift',tag:'Gift',title:'A first animal',text:'A soft crocheted friend to welcome a new arrival.',link:'See gifts',href:'/gifts'})}
${Feature({tone:'amber',icon:'paw',tag:'Gift',title:'Safari set',text:'A lion, a giraffe and an elephant together.',link:'See gifts',href:'/gifts'})}
${Feature({tone:'amber',icon:'ruler',tag:'Gift',title:'Pick a size',text:'Four size classes, S to XL, chosen by comparison.',link:'Size guide',href:'/size-guide'})}
${Feature({tone:'terracotta',icon:'yarn',tag:'Custom',title:'Make it yours',text:'Choose colours and size and we crochet it for you.',link:'Start yours',href:'/custom'})}</div></div>
<div class="mk-sec" data-tone="slate"><p class="mk-eyebrow">Journal</p><h2>Journal</h2><div class="mk-grid mk-rowmobile">
${Story({tone:'slate',img:'hands-stitching-giraffe-parts-640.webp',tag:'How it is made',num:'01',title:'From yarn to giraffe',text:'Follow one giraffe from a skein of yarn to a finished animal.',meta:'Journal',alt:''})}
${Story({tone:'slate',img:'maker-crocheting-toy-waiting-560.webp',tag:'Our name',num:'02',title:'What Mikono means',text:'Mikono is the Swahili word for hands. A note on the name.',meta:'Journal'})}
${Story({tone:'slate',img:'canopy-stall-animals-640.webp',tag:'Ordering',num:'03',title:'How ordering on WhatsApp works',text:'Choose an animal, send us a message and we reply.',meta:'Journal'})}
${Story({tone:'slate',img:'long-table-whole-range-640.webp',tag:'Sizing',num:'04',title:'How to choose a size, S to XL',text:'Four size classes explained by simple comparison.',meta:'Journal'})}</div></div>
<div class="mk-sec" data-tone="olive"><p class="mk-eyebrow">Stockists</p><h2>Find us in Nairobi</h2><div class="mk-grid mk-grid--1">
${[['Blue Rhino Shop','Village Market Mall'],['Spinners Web Shop','Kitisuru'],['Pop-up Shop','Yaya Centre Mall'],['Giraffe Centre','Karen'],['Beth International Shops','JKIA'],['Marula Green Market','16 Marula Lane, Karen'],['New Muthaiga Mall','Muthaiga']].map(([n,p])=>Link({tone:'olive',icon:'pin',title:n,text:p})).join('')}</div></div>
<div class="mk-sec" data-tone="baobab"><p class="mk-eyebrow">Makers and impact</p><h2>Made by many hands</h2><div class="mk-grid">
${Story({tone:'baobab',img:'maker-at-stall-640.webp',tag:'Makers',num:'01',title:'At the market stall',text:'A maker behind a table of crocheted animals.',meta:'Makers'})}
${Story({tone:'baobab',img:'hands-crocheting-yellow-giraffe-640.webp',tag:'Makers',num:'02',title:'Crocheting a giraffe',text:'Round by round, by hand.',meta:'Makers'})}
</div><div style="height:var(--gap)"></div><div class="mk-grid">${Stat({tone:'baobab',tag:'People',big:'25+',title:'Women supported',text:'Hands that crochet every animal.',link:'Impact'})}
${Stat({tone:'baobab',tag:'Since',big:'2019',title:'Made in Nairobi',text:'Founded by Leah Maina.',link:'Our story'})}
${Stat({tone:'baobab',tag:'Stockists',big:'7',title:'Outlets in Nairobi',text:'Malls, markets and Karen.',link:'Stockists'})}
${Stat({tone:'baobab',tag:'Sizes',big:'S to XL',title:'Four size classes',text:'Compared, not measured.',link:'Size guide'})}</div></div>
<div class="mk-sec" data-tone="olive"><p class="mk-eyebrow">Wholesale</p><h2>Trade with Mikono</h2><div class="mk-grid">
${Feature({tone:'olive',icon:'tag',tag:'Request',title:'Price list',text:'A person sends the price list on WhatsApp.',link:'Ask',href:'/wholesale'})}
${Feature({tone:'olive',icon:'gift',tag:'Request',title:'Sample pack',text:'See and feel the animals before you order.',link:'Ask',href:'/wholesale'})}
${Feature({tone:'olive',icon:'chat',tag:'Request',title:'Quote',text:'Tell us what you need and we reply with a quote.',link:'Ask',href:'/wholesale'})}
${Feature({tone:'olive',icon:'truck',tag:'Request',title:'Reorder',text:'Order again from your last list.',link:'Ask',href:'/wholesale'})}</div>
<div style="height:10px"></div>${Band({tone:'olive',tag:'Trade',title:'Stock Mikono in your shop',text:'Ask for the price list or a sample pack. A person replies on WhatsApp.',cta:'Ask for the list',href:'/wholesale'})}</div>`+foot;
fs.writeFileSync('contexts.html',c);
fs.writeFileSync('phone-tiers.html',head('Phone A')+`<div class="mk-sec" data-tone="terracotta" style="padding-top:0"><h2>Three ways to take one home</h2>${ways()}</div>`+foot);
fs.writeFileSync('phone-snap.html',head('Phone B')+`<div class="mk-sec" data-tone="terracotta" style="padding-top:0"><h2>Three ways to take one home</h2><div class="mk-snap">${tiers().join('')}</div></div>`+foot);
console.log('built');
