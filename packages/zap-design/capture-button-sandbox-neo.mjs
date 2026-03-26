import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page.goto('http://localhost:3002/design/zap/atoms/button');
  
  // Wait for the theme selector to be ready
  await page.waitForTimeout(1000);
  
  // Click the NEO theme button
  await page.getByRole('button', { name: 'neo' }).click();
  
  // Wait for the styling to apply and the ThemeContext to fetch and clear M3 overrides
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'button-sandbox-neo-check.png' });
  await browser.close();
})();
