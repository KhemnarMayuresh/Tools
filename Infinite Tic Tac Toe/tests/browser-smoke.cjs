const a=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),os=require('node:os');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const url='file:///'+path.resolve(__dirname,'../index.html').replace(/\\/g,'/');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:375,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('dialog',()=>{throw Error('Unexpected blocking dialog');});
 await page.clock.install({time:new Date('2026-10-10T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-10T12:00:00Z'));
 await page.goto(url);a.equal(await page.locator('#configuration').evaluate(e=>e.open),false);a.equal(await page.locator('#start').isVisible(),true);
 await page.locator('#start').click();a.equal(await page.locator('#size').isDisabled(),true);a.equal(await page.locator('.cell').count(),9);
 const cell=(r,c)=>page.locator(`.cell[data-row="${r}"][data-col="${c}"]`);
 await cell(0,0).click({force:true});await cell(0,0).click({force:true});a.equal(await page.locator('#moveCount').innerText(),'1 / 200');
 await page.locator('#pause').click();await cell(1,0).click({force:true});a.equal(await page.locator('#moveCount').innerText(),'1 / 200');await page.locator('#pause').click();
 await cell(1,0).click({force:true});await cell(0,1).click({force:true});await cell(1,1).click({force:true});await cell(0,2).click({force:true});a.match(await page.locator('#turn').innerText(),/Player X wins/);a.equal(await page.locator('.cell.winning').count(),3);a.equal(await page.locator('#xScore').innerText(),'1');a.equal(await page.locator('#history li').count(),1);a.equal(await page.locator('#undo').isDisabled(),true);
 await page.locator('#nextRound').click();a.match(await page.locator('#turn').innerText(),/Player O/);a.equal(await page.locator('#xScore').innerText(),'1');
 await cell(0,0).focus();await page.keyboard.press('ArrowRight');a.equal(await cell(0,1).evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');a.match(await cell(0,1).innerText(),/O/);await page.locator('#undo').click();a.equal(await page.locator('#moveCount').innerText(),'0 / 200');
 await page.locator('#newMatch').click();await page.locator('#confirmNo').click();a.equal(await page.locator('#xScore').innerText(),'1');await page.locator('#newMatch').click();await page.locator('#confirmYes').click();a.equal(await page.locator('#size').isDisabled(),false);
 await page.locator('#configuration').evaluate(e=>e.open=true);await page.locator('#size').selectOption('4');await page.locator('#nameX').fill('<b>भारत</b>');await page.locator('#start').click();a.equal(await page.locator('.cell').count(),16);a.match(await page.locator('#rules').innerText(),/connect 3.*keep 4/);a.equal(await page.locator('#turn b').count(),0);
 for(const [r,c] of [[0,0],[1,0],[0,1],[1,1],[0,2]])await cell(r,c).click({force:true});a.equal(await page.locator('#xScore').innerText(),'1');
 await page.locator('#newMatch').click();await page.locator('#confirmYes').click();await page.locator('#configuration').evaluate(e=>e.open=true);await page.locator('#mode').selectOption('computer');await page.locator('#size').selectOption('3');await page.locator('#difficulty').selectOption('0');await page.locator('#start').click();await cell(0,0).click({force:true});await cell(0,1).click({force:true});a.equal(await page.locator('#moveCount').innerText(),'1 / 200');
 await page.locator('#pause').click();await page.clock.runFor(2000);a.equal(await page.locator('#moveCount').innerText(),'1 / 200');await page.locator('#pause').click();await page.clock.runFor(100);await page.waitForFunction(()=>document.querySelector('#moveCount').textContent.startsWith('2 /'));await page.locator('#undo').click();a.equal(await page.locator('#moveCount').innerText(),'0 / 200');
 await cell(0,0).click({force:true});await page.locator('#restart').click();await page.locator('#confirmNo').click();a.equal(await page.locator('#moveCount').innerText(),'1 / 200');await page.locator('#restart').click();await page.locator('#confirmYes').click();await page.clock.runFor(2500);a.equal(await page.locator('#moveCount').innerText(),'0 / 200');a.equal(await page.locator('#size').isDisabled(),true);
 await page.clock.resume();for(const theme of ['light','dark','system']){await page.locator(`[data-theme-choice="${theme}"]`).click();a.equal(await page.locator(`[data-theme-choice="${theme}"]`).getAttribute('aria-pressed'),'true');}await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');a.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const screenshots=process.env.TIC_SCREENSHOTS||path.join(os.tmpdir(),'infinite-tic-tac-toe');fs.mkdirSync(screenshots,{recursive:true});await page.screenshot({path:path.join(screenshots,'mobile.png'),fullPage:true});
 await page.setViewportSize({width:640,height:360});a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(screenshots,'landscape.png'),fullPage:true});
 a.deepEqual(errors,[]);console.log('Tic Tac Toe browser smoke passed; screenshots: '+screenshots);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});



