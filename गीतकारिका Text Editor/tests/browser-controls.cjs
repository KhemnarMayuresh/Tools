const a=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage({viewport:{width:1000,height:800}});page.setDefaultTimeout(3000);await page.goto('file:///'+path.resolve(__dirname,'../गीतकारिका Text Editor .html').replace(/\\/g,'/'));
await page.locator('#addSection').click();await page.locator('.inline-add').last().click();await page.locator('.editor-content').fill('Keep writing');
a.equal(await page.locator('.section-top .section-actions').count(),1);
a.equal(await page.locator('[data-action="deleteSection"]').isVisible(),false);a.equal(await page.locator('[data-move-block]').isVisible(),false);
await page.locator('.block-card').first().hover();await page.locator('.block-menu > summary').click();a.equal(await page.locator('[data-move-block]').isVisible(),true);a.equal(await page.locator('[data-action="deleteBlock"]').isVisible(),true);
await page.locator('.block-menu > summary').press('Escape');a.equal(await page.locator('[data-move-block]').isVisible(),false);
await page.locator('.section-menu > summary').click();a.equal(await page.locator('[data-action="deleteSection"]').isVisible(),true);
await page.locator('.section-menu > summary').press('Escape');a.equal(await page.locator('.section-menu').isVisible(),true);
a.equal(await page.locator('[data-action="deleteSection"]').isVisible(),false);
await page.locator('#addSection').click();await page.locator('.section-card').nth(1).locator('.section-menu > summary').click();await page.locator('[data-action="sectionUp"]').nth(1).press('Enter');a.equal(await page.locator('.section-card').first().locator('[data-action="sectionUp"]').evaluate(e=>e===document.activeElement),true);a.equal(await page.locator('.section-card').first().locator('.section-menu').getAttribute('open'),null);await page.setViewportSize({width:375,height:740});a.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.locator('.block-card').first().hover();await page.locator('.block-menu > summary').click();a.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.emulateMedia({media:'print'});a.equal(await page.locator('.block-menu').isVisible(),false);
console.log('PASS compact headers, labelled menus, dismissal, mobile and print');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
