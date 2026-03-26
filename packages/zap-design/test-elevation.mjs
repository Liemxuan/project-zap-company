import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // Set viewport to a good size for viewing the elevation page
    await page.setViewportSize({ width: 1440, height: 1080 });
    
    await page.goto('http://localhost:3002/design/metro/elevation');
    await page.waitForTimeout(4000); // Wait for fonts and CSS to load
    
    // Scroll down to the ZAP Layer System section (Section 02)
    await page.evaluate(() => {
        const zapLayersSection = document.getElementById('zap-layers');
        if (zapLayersSection) {
            zapLayersSection.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.scrollBy(0, -100); // Adjust to see header
        }
    });
    
    await page.waitForTimeout(1000);
    
    const screenshotPath = '/Users/zap/.gemini/antigravity/brain/a951bc8e-5ae2-4f0e-a089-2e91fea65055/elevation_l0_l5_test.png';
    await page.screenshot({ path: screenshotPath });
    
    console.log(`Saved screenshot to ${screenshotPath}`);
    await browser.close();
})();
