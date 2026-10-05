import { chromium } from '/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core/index.mjs';
const tag=process.argv[2]||'v1';
const b=await chromium.launch({executablePath:process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
for(const page of ['cards','contexts'])for(const w of [390,1440]){
 const p=await b.newPage({viewport:{width:w,height:900},deviceScaleFactor:w==390?2:1});
 await p.goto('file://'+process.cwd()+`/${page}.html`);await p.waitForTimeout(600);
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0)});
 await p.waitForTimeout(400);
 await p.screenshot({path:`shots/${tag}-${page}-${w}.png`,fullPage:true});
 await p.close();
}
await b.close();
