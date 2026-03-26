import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/design/metro/atoms/pill');
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500); 
    await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/ef1ce948-cb07-46b3-b50c-eca2c18f2cec/pill_sandbox_scrolled_final.png' });
    await browser.close();
})();
