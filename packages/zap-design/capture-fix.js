/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log("Navigating to Metro Gateway page...");
    await page.goto('http://localhost:3002/design/metro');
    
    // Wait for the inspector or the page to settle
    await page.waitForTimeout(3000);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const timestamp = Date.now();
  // Wait a moment for dynamic values to settle
  await page.waitForTimeout(500);

  // Take a full-page screenshot
  const artifactDir = '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055'; // Define artifactDir
  const artifactPath = path.join(artifactDir, `target_003_metro_gateway_layer2_final_${Date.now()}.png`);
  await page.screenshot({ path: artifactPath, fullPage: true });
  console.log(`Screenshot saved to: ${artifactPath}`);

    // Check computed styles on the MetroHeader (it should be #f9faef from the dynamic injection, not #fefcf8)
    const headerBg = await page.evaluate(() => {
        const header = document.querySelector('header');
        return header ? window.getComputedStyle(header).backgroundColor : null;
    });
    console.log(`Header background color is currently: ${headerBg}`);

    await browser.close();
})();
