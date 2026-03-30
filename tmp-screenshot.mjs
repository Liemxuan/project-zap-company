import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:4700/auth/metro/user-management', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log(text);
    await browser.close();
})();
