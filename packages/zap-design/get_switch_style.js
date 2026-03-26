/* eslint-disable @typescript-eslint/no-require-imports */

const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/design/zap/atoms/switch', { waitUntil: 'networkidle' });
    const switchElement = await page.$('button[role="switch"]');
    const computedStyle = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
            border: style.border,
            borderStyle: style.borderStyle,
            borderColor: style.borderColor,
            borderWidth: style.borderWidth,
            backgroundColor: style.backgroundColor,
            boxShadow: style.boxShadow,
            className: el.className
        };
    }, switchElement);
    console.log('Switch style:', computedStyle);
    await browser.close();
})();
