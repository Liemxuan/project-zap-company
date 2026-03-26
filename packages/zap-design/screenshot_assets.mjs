import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 1080 });

  console.log('Navigating to Asset Vault...');
  await page.goto('http://localhost:3002/design/assets');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for images to load just in case

  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/asset_vault_full.png', fullPage: true });

  await browser.close();
  console.log('Done screenshot.');
})();
