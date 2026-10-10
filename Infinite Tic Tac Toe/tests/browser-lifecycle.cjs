const a=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const folder=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 if(req.url==='/away'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Away</title><p>Return to the game.</p>');return;}
 const file=path.resolve(folder,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(folder+path.sep)){res.writeHead(403).end();return;}
 res.setHeader('Content-Type',path.extname(file)==='.js'?'text/javascript':path.extname(file)==='.css'?'text/css':'text/html');fs.createReadStream(file).on('error',()=>res.writeHead(404).end()).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({channel:'msedge',headless:true,ignoreDefaultArgs:['--disable-back-forward-cache']});
 try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.addEventListener('pageshow',event=>window.wasRestored=event.persisted));
 await page.goto(base+'/index.html');await page.locator('#configuration').evaluate(e=>e.open=true);await page.locator('#mode').selectOption('computer');await page.locator('#difficulty').selectOption('5');await page.locator('#start').click();await page.locator('.cell').first().click();
 a.equal(await page.locator('#moveCount').innerText(),'1 / 200');await page.goto(base+'/away');await page.goBack({waitUntil:'commit'});await page.waitForFunction(()=>window.wasRestored===true);a.equal(await page.evaluate(()=>window.wasRestored),true,'test must exercise actual back-forward cache');
 await page.waitForFunction(()=>document.querySelector('#moveCount').textContent==='2 / 200',{},{timeout:4000});
 await page.waitForTimeout(500);a.equal(await page.locator('#moveCount').innerText(),'2 / 200');
 // A paused round must remain paused on restoration.
 await page.locator('#pause').click();await page.goto(base+'/away');await page.goBack({waitUntil:'commit'});await page.waitForFunction(()=>window.wasRestored===true);a.equal(await page.evaluate(()=>window.wasRestored),true);await page.waitForTimeout(400);a.equal(await page.locator('#turn').innerText(),'Game paused');a.equal(await page.locator('#moveCount').innerText(),'2 / 200');
 a.deepEqual(errors,[]);console.log('Tic Tac Toe browser lifecycle passed: actual Back/Forward cache resumes one pending AI action and preserves pause.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});

