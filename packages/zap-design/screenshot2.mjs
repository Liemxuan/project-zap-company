import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/design/metro/atoms/badge', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/ef1ce948-cb07-46b3-b50c-eca2c18f2cec/badge_sandbox_wired.png', fullPage: true });
  await browser.close();
})();
