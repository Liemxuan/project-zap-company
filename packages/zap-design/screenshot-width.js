/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/design/metro/atoms/textarea');
  await page.waitForTimeout(1000); 
  
  // Set the width override to border-4
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    // Assuming the first select is width, second is radius in Textarea sandbox
    if(selects.length > 0) {
        selects[0].value = 'var(--border-width-4)';
        selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/08651243-8f88-4a9c-ab60-12de52f82ea2/textarea-width-test.png', fullPage: true });
  await browser.close();
})();
