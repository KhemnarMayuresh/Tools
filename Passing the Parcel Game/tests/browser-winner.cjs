const a=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),os=require('node:os');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const until=async(fn)=>{for(let i=0;i<150;i++){if(await fn())return;await new Promise(r=>setTimeout(r,20));}throw Error('State did not settle');};
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:375,height:850}});
 await page.addInitScript(()=>{crypto.getRandomValues=values=>{values.fill(1);return values;};});
 await page.clock.install();await page.clock.pauseAt(new Date());
 await page.goto('file:///'+path.resolve(__dirname,'../PassingTheParcel.html').replace(/\\/g,'/'));
 await page.locator('#configuration').evaluate(e=>e.open=true);await page.locator('#roster').fill('A\nB\nC');await page.locator('#mode').selectOption('elimination');await page.locator('#playStyle').selectOption('screen');await page.locator('#minTime').fill('5');await page.locator('#maxTime').fill('5');
 a.equal(await page.locator('#startingPlayer').inputValue(),'random');
 await page.locator('#start').click();await until(async()=>await page.locator('#phase').innerText()==='Music playing');a.equal(await page.locator('#holderName').innerText(),'B');await page.clock.runFor(5000);await page.locator('#confirmHolder').click();
 await page.locator('#next').click();await until(async()=>await page.locator('#phase').innerText()==='Music playing');a.equal(await page.locator('#holderName').innerText(),'C');await page.clock.runFor(5000);await page.locator('#confirmHolder').click();
 a.equal(await page.locator('.winner-card .winner').innerText(),'C');a.deepEqual(await page.locator('.elimination-standings li').allTextContents(),['C · Winner','B · eliminated in round 2','A · eliminated in round 1']);a.equal(await page.locator('.confetti i').count(),40);
 a.notEqual(await page.locator('.winner').evaluate(e=>getComputedStyle(e).color),await page.locator('#completion').evaluate(e=>getComputedStyle(e).color));
 a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 a.equal(await page.locator('.confetti i').first().evaluate(e=>getComputedStyle(e).animationName),'confetti-fall');await page.clock.resume();await page.waitForTimeout(600);const folder=path.join(os.tmpdir(),'passing-the-parcel');fs.mkdirSync(folder,{recursive:true});await page.locator('#completion').screenshot({path:path.join(folder,'winner.png')});
 await page.emulateMedia({reducedMotion:'reduce'});a.equal(await page.locator('.confetti i').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 console.log('Winner browser passed: random active starter, reverse standings, winner color, confetti and reduced motion.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
