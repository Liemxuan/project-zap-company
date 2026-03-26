import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    await page.goto('http://localhost:3002/design/metro');
    await page.waitForTimeout(3000); 
    
    const screenshotPath = '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/design_metro_current.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Saved screenshot to ${screenshotPath}`);
    await browser.close();
})();
