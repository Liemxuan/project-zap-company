/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/design/metro/molecules/profile-switcher', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000); // 4 secs to let React render
  const box = await page.evaluate(() => {
     const el = document.querySelector('.bg-green-500');
     if (!el) return null;
     const rect = el.getBoundingClientRect();
     const cs = window.getComputedStyle(el);
     return {
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity
     };
  });
  console.log('BOX:', box);
  const sandbox = await page.evaluate(() => {
      const el = document.querySelector('.bg-layer-panel'); // The L3 Section
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  console.log('SANDBOX:', sandbox);
  await browser.close();
})();
