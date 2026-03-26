import('puppeteer').then(async ({ default: puppeteer }) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1080 });
        
        await page.goto('http://localhost:3002/design/metro/typography', { waitUntil: 'networkidle0', timeout: 5000 });
        
        // Wait for page load
        await new Promise(r => setTimeout(r, 1000));
        
        // Find TabBar buttons. Let's click the button with text containing 'Details'
        const buttons = await page.$$('button');
        let detailsFound = false;
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text && text.toLowerCase().includes('details')) {
                await btn.click();
                detailsFound = true;
                break;
            }
        }
        
        if (!detailsFound) {
            console.log('Details tab not found!');
        } else {
            console.log('Clicked details tab.');
            await new Promise(r => setTimeout(r, 3000)); // wait for animation
            await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/0c31f110-36fd-47c9-a86d-88f3d3d9b8fa/font_details_casing_resolved_audit.png', fullPage: true });
            console.log('Saved Font Details verification screenshot');
        }
        
        await browser.close();
    } catch(e) {
        console.log('Error:', e.message);
        process.exit(1);
    }
});
