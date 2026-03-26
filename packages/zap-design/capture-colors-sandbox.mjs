import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page.goto('http://localhost:3002/design/metro/colors');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'colors-sandbox-check.png' });
  await browser.close();
})();
