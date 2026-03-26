import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1837, height: 1119 } });

    console.log('Navigating to Core Colors Clone...');
    await page.goto('http://localhost:3002/design/core/colors');
    await page.waitForTimeout(3000); // Allow M3 Engine to calculate the new Deep Orange palette

    const artifactPath = '/Users/zap/.gemini/antigravity/brain/bd248b53-d598-4a08-869c-4e86850186d6';
    
    // Baseline capture
    await page.screenshot({ path: `${artifactPath}/audit_00_baseline.png` });
    console.log('Baseline captured.');

    const layers = [
        { id: 'L0_Base', prop: '--color-layer-base' },
        { id: 'L1_Canvas', prop: '--color-layer-canvas' },
        { id: 'L2_Cover', prop: '--color-layer-cover' },
        { id: 'L3_Panels', prop: '--color-layer-panel' },
        { id: 'L4_Dialogs', prop: '--color-layer-dialog' },
        { id: 'L5_Modals', prop: '--color-layer-modal' },
    ];

    for (const layer of layers) {
        console.log(`Auditing ${layer.id}...`);
        
        await page.evaluate((propName) => {
            const style = document.createElement('style');
            style.id = 'zap-nuclear-override';
            // Pure Cyan (#00FFFF) pops aggressively against Deep Orange so we can see the exact layer bounds
            style.innerHTML = `:root { ${propName}: #00FFFF !important; }`;
            document.head.appendChild(style);
        }, layer.prop);

        await page.waitForTimeout(500);
        await page.screenshot({ path: `${artifactPath}/audit_${layer.id}.png` });

        await page.evaluate(() => {
            const style = document.getElementById('zap-nuclear-override');
            if (style) style.remove();
        });
    }

    await browser.close();
    console.log('Audit complete.');
})();
