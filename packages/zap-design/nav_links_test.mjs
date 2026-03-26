import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to Metro Gateway...');
  await page.goto('http://localhost:3002/design/metro');
  await page.waitForLoadState('networkidle');

  console.log('Clicking Genesis Registry...');
  await page.click('text="Genesis Registry"');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/nav_genesis_registry.png' });

  console.log('Clicking Asset Vault...');
  await page.click('text="Asset Vault"');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/nav_asset_vault.png' });

  console.log('Expanding SYSTEM: MEASURE...');
  // The 'Page Pipeline' might be under another category, let's just navigate to it directly if click fails.
  // Actually, 'Page Pipeline' is under 'SYSTEM: BUILD' since we just added it there!
  console.log('Clicking Page Pipeline...');
  await page.click('text="Page Pipeline"');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/nav_page_pipeline.png' });

  await browser.close();
  console.log('Done screenshots.');
})();
