const {chromium}=require('/tmp/claude-1000/-home-shannara-mikono-creations/dc36e544-c58f-4c8b-ab4e-71cdc2ebcd35/scratchpad/node_modules/playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']});
const dirs=process.argv.slice(2).length?process.argv.slice(2):['a','b'];
for(const d of dirs){
 const url='file://'+__dirname+'/'+d+'.html';
 let p=await b.newPage({viewport:{width:1440,height:900}});await p.goto(url);await p.waitForTimeout(800);
 await p.screenshot({path:`screens/${d}-desktop-hero.png`});
 await p.click('[data-mega]');await p.waitForTimeout(700);await p.screenshot({path:`screens/${d}-desktop-megamenu.png`});
 await p.click('[data-mega]');await p.waitForTimeout(400);
 await p.screenshot({path:`screens/${d}-desktop-full.png`,fullPage:true});
 for(const [n,s] of [['bento','#cats'],['cards','.pgrid'],['tiers','.tiers'],['icons','.isheet'],['type','.spec']]){
  const el=await p.$(s);await el.scrollIntoViewIfNeeded();await p.evaluate(()=>scrollBy(0,-120));await p.waitForTimeout(300);await p.screenshot({path:`screens/${d}-desktop-${n}.png`});}
 await p.close();
 p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});await p.goto(url);await p.waitForTimeout(800);
 await p.screenshot({path:`screens/${d}-mobile-closed.png`});
 await p.click('[data-burger]');await p.waitForTimeout(700);await p.screenshot({path:`screens/${d}-mobile-menu.png`});
 await p.click('[data-burger]');await p.waitForTimeout(500);
 await p.screenshot({path:`screens/${d}-mobile-full.png`,fullPage:true});
 const el=await p.$('.pgrid');await el.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await p.screenshot({path:`screens/${d}-mobile-cards.png`});
 await p.close();
}
await b.close();})();
