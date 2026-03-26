/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:3000/design/metro/atoms/textarea');
  await page.waitForTimeout(1000); 

  // Set the width override to border-4
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    if(selects.length > 0) {
        selects[0].value = 'var(--border-width-4)';
        selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.waitForTimeout(500);

  // Inspect the textarea dom
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
       console.log("TEXTAREA INLINE STYLES: ", textarea.getAttribute('style'));
       console.log("TEXTAREA CLASSES: ", textarea.className);
       const computed = window.getComputedStyle(textarea);
       console.log("COMPUTED BORDER WIDTH: ", computed.borderWidth);
       console.log("COMPUTED BORDER STYLE: ", computed.borderStyle);
       console.log("COMPUTED BORDER COLOR: ", computed.borderColor);
    }
  });

  await browser.close();
})();
