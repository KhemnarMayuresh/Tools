const a = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    for (const mode of ['invalid', 'blocked', 'normal']) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      if (mode === 'invalid') await page.addInitScript(() => localStorage.setItem('drawing-everyday-words', JSON.stringify({invalid: true})));
      if (mode === 'blocked') await page.addInitScript(() => { Storage.prototype.getItem = Storage.prototype.setItem = Storage.prototype.removeItem = function () { throw new Error('Storage unavailable'); }; });
      await page.goto('file:///' + path.resolve(__dirname, '../30sDrawingGame.html').replace(/\\/g, '/'));
      await page.locator('#configuration > summary').click();
      a.equal(await page.locator('[data-category=category-everyday] [data-prompt]').count(), 150);
      if (mode !== 'normal') a.match(await page.locator('#everydayFeedback').innerText(), /default words/);
      await page.getByRole('button', {name: 'Edit words', exact: true}).click();
      await page.locator('#everydayWords').fill(Array.from({length:201},(_,i)=>'Item '+i).join('\n'));
      await page.locator('#saveEveryday').click();
      a.match(await page.locator('#everydayFeedback').innerText(), /200 unique words/);
      a.equal(await page.locator('[data-category=category-everyday] [data-prompt]').count(),150);
      await page.locator('#everydayWords').fill('Cup\nCar');
      await page.locator('#saveEveryday').click();
      a.equal(await page.locator('[data-category=category-everyday] [data-prompt]').count(),2);
      if (mode === 'blocked') a.match(await page.locator('#everydayFeedback').innerText(), /storage is unavailable/);
      if (mode === 'normal') {
        await page.getByText('Add custom prompts', {exact:true}).click();
        await page.locator('#customCategory').fill(' everyday THINGS ');
        await page.locator('#customWords').fill('Cup\nTea flask');
        await page.locator('#addCustom').click();
        a.equal(await page.locator('[data-category=category-everyday] [data-prompt]').count(),3);
        await page.reload();
        await page.locator('#configuration > summary').click();
        a.equal(await page.locator('[data-category=category-everyday] [data-prompt]').count(),3);
      }
      a.deepEqual(errors,[]);
      await context.close();
    }
    console.log('Invalid/blocked storage, atomic word limits and custom-add integration passed.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
