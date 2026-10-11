const a=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1000,height:720}});page.setDefaultTimeout(3000);
 await page.goto('file:///'+path.resolve(__dirname,'../गीतकारिका Text Editor .html').replace(/\\/g,'/'));
 a.equal(await page.locator('.search-bar').isVisible(),false);
 await page.locator('#findToggle').click();a.equal(await page.locator('#searchInput').evaluate(e=>e===document.activeElement),true);
 await page.locator('#searchInput').fill('word');await page.locator('#searchInput').press('Escape');
 a.equal(await page.locator('.search-bar').isVisible(),false);a.equal(await page.locator('#findToggle').evaluate(e=>e===document.activeElement),true);
 await page.locator('#findToggle').click();a.equal(await page.locator('#searchInput').inputValue(),'word');
 await page.locator('#searchClose').click();a.equal(await page.locator('.search-bar').isVisible(),false);
 a.equal(await page.locator('.toolbar #findToggle').count(),1);
 await page.setViewportSize({width:375,height:740});await page.locator('#findToggle').click();a.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.emulateMedia({media:'print'});a.equal(await page.locator('#findToggle').isVisible(),false);a.equal(await page.locator('.search-bar').isVisible(),false);
 console.log('PASS Find is opt-in, focused, dismissible, persistent while scrolling and printable');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
