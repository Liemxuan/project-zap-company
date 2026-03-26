/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('http://localhost:3000/design/metro', { waitUntil: 'networkidle' });
    
    // Wait for the SideNav to load
    await page.waitForTimeout(1500);
    
    // Click "Laboratory: R&D"
    const labButton = page.locator('button', { hasText: 'Laboratory: R&D' });
    if (await labButton.isVisible()) {
        await labButton.click();
        await page.waitForTimeout(500);
    }
    
    // Click "Nested Experiments"
    const nestedButton = page.locator('button', { hasText: 'Nested Experiments' });
    if (await nestedButton.isVisible()) {
        await nestedButton.click();
        await page.waitForTimeout(500);
    }

    // Click "Deep Testing"
    const deepButton = page.locator('button', { hasText: 'Deep Testing' });
    if (await deepButton.isVisible()) {
        await deepButton.click();
        await page.waitForTimeout(500);
    }

    // Screenshot the sidebar specifically
    const sidebar = page.locator('aside').first();
    if (await sidebar.isVisible()) {
        await sidebar.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/ef1ce948-cb07-46b3-b50c-eca2c18f2cec/sidenav_3_level_deep.png' });
        console.log('Saved 3-level deep sidebar screenshot');
    } else {
        await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/ef1ce948-cb07-46b3-b50c-eca2c18f2cec/sidenav_3_level_deep_full.png' });
        console.log('Saved full page screen instead');
    }
    await browser.close();
})();
