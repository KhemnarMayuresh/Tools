const a=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage({viewport:{width:1280,height:800}});page.setDefaultTimeout(3000);await page.goto('file:///'+path.resolve(__dirname,'../गीतकारिका Text Editor .html').replace(/\\/g,'/'));
a.equal(await page.locator('.toolbar #findToggle').count(),1);a.equal(await page.locator('#arrangeToggle').count(),0);
await page.locator('#addSection').click();await page.locator('.inline-add').last().click();await page.locator('.editor-content').fill('word');await page.locator('#addSection').click();


await page.locator('#sidebarToggle').click();a.equal(await page.locator('#sidebarContent').isVisible(),false);a.equal(await page.locator('#sidebarToggle').getAttribute('aria-expanded'),'false');await page.locator('#sidebarToggle').click();a.equal(await page.locator('#sectionList').isVisible(),true);
await page.setViewportSize({width:375,height:740});await page.locator('#sidebarToggle').click();a.equal(await page.locator('#sidebarContent').isVisible(),false);a.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.locator('#findToggle').click();a.equal(await page.locator('#searchInput').evaluate(e=>e===document.activeElement),true);await page.locator('#searchInput').fill('word');await page.locator('#searchNext').click();a.equal(await page.locator('#searchStatus').innerText(),'1 of 1');
await page.emulateMedia({media:'print'});a.equal(await page.locator('#sidebarToggle').isVisible(),false);
console.log('PASS collapsible sidebar, stable locking, toolbar Find and status alignment');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
