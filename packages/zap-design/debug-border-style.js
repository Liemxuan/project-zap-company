/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:3000/design/metro/atoms/textarea');
  await page.waitForTimeout(1000); 

  // Inspect the textarea dom
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
       const computed = window.getComputedStyle(textarea);
       console.log("--layer-border-style is:", computed.getPropertyValue('--layer-border-style'));
       console.log("--layer-4-border-style is:", computed.getPropertyValue('--layer-4-border-style'));
       console.log("border-style is:", computed.borderStyle);
    }
  });

  await browser.close();
})();
