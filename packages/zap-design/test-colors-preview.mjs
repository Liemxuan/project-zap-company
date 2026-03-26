import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // Set viewport to fully render the expanded preview
    await page.setViewportSize({ width: 1440, height: 1080 });
    
    await page.goto('http://localhost:3002/design/metro/colors');
    await page.waitForTimeout(5000); // Wait for fonts and MCU extraction to load properly
    
    // Switch to Expanded tab
    await page.evaluate(() => {
        const expandedBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent?.includes('EXPANDED'));
        if (expandedBtn) expandedBtn.click();
    });
    
    await page.waitForTimeout(2000);
    
    const screenshotPath = '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/colors_mockup_l0_l5_fixed.png';
    await page.screenshot({ path: screenshotPath });
    
    console.log(`Saved screenshot to ${screenshotPath}`);
    await browser.close();
})();
