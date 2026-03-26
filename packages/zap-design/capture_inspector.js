/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('http://localhost:3000/design/metro/foundations/colors', { waitUntil: 'networkidle' });
    
    // Wait for the inspector panel to load
    await page.waitForTimeout(2000);
    const inspector = await page.$('.w-80.shrink-0'); 
    if (inspector) {
        await inspector.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/ef1ce948-cb07-46b3-b50c-eca2c18f2cec/sidenav_subnav_check.png' });
        console.log('Saved inspector nav screenshot');
    } else {
        await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/ef1ce948-cb07-46b3-b50c-eca2c18f2cec/sidenav_subnav_check.png' });
        console.log('Inspector not found, saved full page screenshot');
    }
    await browser.close();
})();
