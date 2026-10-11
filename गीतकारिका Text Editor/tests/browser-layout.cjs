const a=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 await page.goto('file:///'+path.resolve(__dirname,'../गीतकारिका Text Editor .html').replace(/\\/g,'/'));
 await page.locator('#addSection').click();await page.locator('.inline-add').last().click();await page.locator('.editor-content').fill('word\n'.repeat(80));
 
 a.equal(await page.locator('.block-actions').isVisible(),true);
 a.equal(await page.locator('.section-card').evaluate(e=>getComputedStyle(e).resize),'both');
 await page.locator('#findToggle').click();await page.locator('#searchInput').fill('word');await page.locator('#searchNext').click();await page.evaluate(()=>scrollTo(0,1000));
 const rect=await page.locator('.search-bar').boundingBox();a.ok(rect.y>=0&&rect.y<90);
 await page.locator('#searchNext').click();a.equal(await page.locator('#searchStatus').innerText(),'2 of 80');
 a.equal(await page.locator('.block-actions').isVisible(),true);
 await page.locator('#addSection').click();await page.locator('.block-card').first().hover();await page.locator('.block-menu > summary').click();await page.locator('[data-move-block]').selectOption({index:1});
 a.equal(await page.locator('.section-card').nth(1).locator('.editor-content').count(),1);
 
 await page.locator('[data-move-block]').evaluate(e=>{e.selectedIndex=0;e.dispatchEvent(new Event('change',{bubbles:true}));});
 a.equal(await page.locator('.section-card').first().locator('.editor-content').count(),1);
 await page.setViewportSize({width:375,height:740});await page.evaluate(()=>scrollTo(0,800));
 const mobile=await page.locator('.search-bar').boundingBox();a.ok(mobile.y>=0&&mobile.x>=0&&mobile.x+mobile.width<=375);
 a.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.emulateMedia({media:'print'});a.equal(await page.locator('.search-bar').isVisible(),false);
 console.log('PASS writing, layout movement, fixed Find, mobile and print');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
