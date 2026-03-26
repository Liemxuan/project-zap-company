import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page.goto('http://localhost:3002/design/zap/atoms/button');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'button-sandbox-check.png' });
  await browser.close();
})();
