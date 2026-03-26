import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page.goto('http://localhost:3002/design/core/combat-signin');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'core-signin-check.png' });
  await browser.close();
})();
