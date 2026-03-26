/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the color page
    await page.goto('http://localhost:3002/debug/metro/colors');

    // Wait for the specific component to load
    await page.waitForSelector('h2:has-text("Absolute 0-100 Tonal Matrices")');

    // Add some padding and wait for any animations
    await page.waitForTimeout(2000);

    // Take a full page screenshot
    const timestamp = Date.now();
    const artifactName = `color_matrix_fixed_${timestamp}.png`;
    const artifactPath = path.join('/Users/zap/.gemini/antigravity/brain/972171dc-287f-406e-8690-139678a08cc4', artifactName);

    await page.screenshot({ path: artifactPath, fullPage: true });
    console.log(`Screenshot saved to: ${artifactPath}`);

    await browser.close();
})();
