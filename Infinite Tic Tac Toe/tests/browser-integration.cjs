const a=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),http=require('node:http'),os=require('node:os');
const {chromium,firefox}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const Core=require('../game-core.js');
const folder=path.resolve(__dirname,'..');
const config={size:3,winLength:3,moveLimit:200,mode:'local',difficulty:3};
const server=http.createServer((req,res)=>{
 try{const file=path.resolve(folder,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(folder+path.sep)){res.writeHead(403).end();return;}
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.md':'text/plain'};
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).on('error',()=>res.writeHead(404).end()).pipe(res);
 }catch(_){res.writeHead(400).end();}
});
const at=(page,r,c)=>page.locator(`.cell[data-row="${r}"][data-col="${c}"]`);
async function setup(page,overrides={}){
 await page.locator('#configuration').evaluate(el=>el.open=true);
 if(overrides.size)await page.locator('#size').selectOption(String(overrides.size));
 if(overrides.winLength)await page.locator('#winLength').selectOption(String(overrides.winLength));
 if(overrides.moveLimit)await page.locator('#moveLimit').fill(String(overrides.moveLimit));
 if(overrides.mode)await page.locator('#mode').selectOption(overrides.mode);
 if(overrides.difficulty!==undefined)await page.locator('#difficulty').selectOption(String(overrides.difficulty));
 await page.locator('#start').click();
}
function drawSequence(limit){let r=Core.createRound('draw',{...config,moveLimit:limit},'X');const cells=[];while(r.phase==='playing'){
 const cell=Core.getLegalMoves(r).find(c=>Core.playMove(r,c).phase!=='won');a.ok(cell);cells.push(cell);r=Core.playMove(r,cell);
 }return {cells,reason:r.drawReason};}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}/index.html`;
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const errors=[],remote=[];const page=await browser.newPage({viewport:{width:375,height:850}});
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))remote.push(r.url());});
 // Every legal grid/target pair can be selected and played, without page overflow.
 for(let size=3;size<=10;size++)for(let winLength=3;winLength<=size;winLength++){
 await page.goto(url);await setup(page,{size,winLength});a.equal(await page.locator('.cell').count(),size*size);
 await at(page,0,0).click();a.equal(await page.locator('#moveCount').innerText(),'1 / 200');a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 // Rolling indicators for both actors, eviction and undo, including false-win regression.
 await page.goto(url);await setup(page);
 for(const [r,c]of [[0,0],[1,0],[0,1],[1,2],[2,2],[2,0]])await at(page,r,c).click();
 a.equal(await page.locator('.cell.oldest').count(),2);a.match(await at(page,0,0).getAttribute('aria-label'),/next to leave on X/);
 await at(page,0,2).click();a.equal(await at(page,0,0).innerText(),'');a.equal(await page.locator('.cell.winning').count(),0);a.match(await page.locator('#status').innerText(),/oldest mark.*row 1, column 1/);
 await page.locator('#undo').click();a.match(await at(page,0,0).innerText(),/X/);a.equal(await page.locator('.cell.oldest').count(),2);
 // Real legal placements produce both kinds of draw and exactly one history/score entry.
 for(const limit of [20,200]){await page.goto(url);await setup(page,{moveLimit:limit});const sequence=drawSequence(limit);
 for(const c of sequence.cells)await at(page,c.row,c.col).click();a.equal(await page.locator('#drawScore').innerText(),'1');a.equal(await page.locator('#history li').count(),1);
 a.match(await page.locator('#history').innerText(),sequence.reason==='repetition'?/threefold repetition/:/move limit/);await at(page,2,2).click({force:true});a.equal(await page.locator('#drawScore').innerText(),'1');}
 // HTTP worker succeeds; real computer win then alternating O opening is scheduled once.
 await page.goto(url);await page.evaluate(()=>{window.workerReplies=0;const Native=window.Worker;window.Worker=class extends Native{constructor(...args){super(...args);this.addEventListener('message',()=>window.workerReplies++);}};});
 await setup(page,{mode:'computer',difficulty:3});
 const waitCount=count=>page.waitForFunction(n=>document.querySelector('#moveCount').textContent.startsWith(n+' /'),count);
 await at(page,0,0).click();await waitCount(2);await at(page,2,0).click();await waitCount(4);await at(page,2,2).click();
 await page.waitForFunction(()=>document.querySelector('#oScore').textContent==='1');a.ok(await page.evaluate(()=>window.workerReplies)>=3);
 await page.locator('#nextRound').click();await waitCount(1);a.match(await page.locator('#players').innerText(),/Computer/);a.equal(await page.locator('#undo').isDisabled(),true);
 await page.locator('#pause').click();await page.waitForTimeout(400);a.equal(await page.locator('#moveCount').innerText(),'1 / 200');await page.locator('#pause').click();a.equal(await page.locator('#moveCount').innerText(),'1 / 200');
 // New match while a decision is pending cancels old work.
 const empty=await page.locator('.cell').evaluateAll(els=>els.find(el=>!el.querySelector('.mark').textContent).dataset);await at(page,empty.row,empty.col).click();
 await page.locator('#newMatch').click();await page.locator('#confirmYes').click();await page.waitForTimeout(1800);a.equal(await page.locator('#moveCount').innerText(),'0 / 200');a.equal(await page.locator('#start').isVisible(),true);
 // Validation and literal Unicode names, keyboard extremes and 10x10 internal scroll.
 await page.locator('#nameX').fill(' ');await page.locator('#start').click();a.match(await page.locator('#status').innerText(),/Names/);
 await page.locator('#nameX').fill('😀'.repeat(41));await page.locator('#start').click();a.match(await page.locator('#status').innerText(),/1–40/);
 await page.locator('#nameX').fill(' <img src=x>भारत ');await page.locator('#mode').selectOption('local');await setup(page,{size:10,winLength:10});a.equal(await page.locator('#players img').count(),0);
 await at(page,0,0).focus();await page.keyboard.press('End');a.equal(await at(page,0,9).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Home');a.equal(await at(page,0,0).evaluate(el=>el===document.activeElement),true);
 const target=await at(page,0,0).boundingBox();a.ok(target.width>=44&&target.height>=44);
 a.equal(await page.locator('.board-viewport').evaluate(el=>el.scrollWidth>el.clientWidth && el.scrollHeight>el.clientHeight && el.clientHeight<=innerHeight*0.6),true);a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const screenshots=process.env.TIC_SCREENSHOTS||path.join(os.tmpdir(),'infinite-tic-tac-toe');fs.mkdirSync(screenshots,{recursive:true});
 await page.screenshot({path:path.join(screenshots,'large-mobile.png'),fullPage:true});await page.setViewportSize({width:640,height:360});a.ok((await page.locator('.board-viewport').boundingBox()).height<=216);a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(screenshots,'large-landscape.png'),fullPage:true});
 // Preferences persist; invalid values default to system and modest sound.
 await page.locator('[data-theme-choice="dark"]').click();await page.reload();a.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.evaluate(()=>{localStorage.setItem('tic-tac-toe-theme','bad');localStorage.setItem('tic-tac-toe-sound','{"enabled":true,"volume":99}');});await page.reload();a.equal(await page.locator('[data-theme-choice="system"]').getAttribute('aria-pressed'),'true');a.equal(await page.locator('#volume').inputValue(),'0.2');
 // Denied storage/audio/worker keep play actionable and explain fallback.
 const blocked=await browser.newPage();blocked.on('pageerror',e=>errors.push(e.message));await blocked.addInitScript(()=>{
 Object.defineProperty(window,'localStorage',{get(){throw Error('denied');}});window.Worker=class{constructor(){throw Error('blocked');}};window.AudioContext=class{constructor(){throw Error('blocked');}};window.webkitAudioContext=undefined;
 });await blocked.goto(url);await setup(blocked,{mode:'computer',difficulty:5});await at(blocked,0,0).click();await blocked.waitForFunction(()=>document.querySelector('#moveCount').textContent.startsWith('2 /'));a.match(await blocked.locator('#aiStatus').innerText(),/fallback/);
 await blocked.locator('[data-theme-choice="dark"]').click();a.equal(await blocked.locator('html').getAttribute('data-theme'),'dark');await blocked.locator('#pause').click();await blocked.locator('#undo').click();a.equal(await blocked.locator('#moveCount').innerText(),'0 / 200');a.equal(await blocked.locator('#turn').innerText(),'Game paused');
 a.deepEqual(errors,[]);a.deepEqual(remote,[]);console.log('Tic Tac Toe HTTP integration passed: 36 grid/target pairs, rolling/undo, draws, real workers, alternate opener, blocked features and responsive layouts.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
 try{const ff=await firefox.launch({headless:true});await ff.close();console.log('Firefox runtime available (Edge flows above).');}catch(error){console.log('Firefox runtime unavailable: '+error.message.split('\n')[0]);}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});


