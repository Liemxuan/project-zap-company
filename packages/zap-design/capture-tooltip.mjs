import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3002/design/zap/molecules/tooltip');
  
  // Hover over the tooltip trigger
  await page.getByRole('button', { name: 'Hover' }).hover();
  
  // Wait for the delay-duration.
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/f0dec4c9-9f48-48c4-bc9b-efdc170bc420/tooltip_hover_state.png' });
  
  console.log('Hover screenshot captured.');
  await browser.close();
})();
