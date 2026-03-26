import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3002/design/core/combat-signin');
  await page.waitForTimeout(1000);
  const coreBg = await page.evaluate(() => {
    const card = document.querySelector('.max-w-\\[440px\\]');
    const container = document.querySelector('.min-h-screen');
    return {
      card: window.getComputedStyle(card).backgroundColor,
      container: window.getComputedStyle(container).backgroundColor
    };
  });
  
  await page.goto('http://localhost:3002/design/metro/combat-signin');
  await page.waitForTimeout(1000);
  const metroBg = await page.evaluate(() => {
    const card = document.querySelector('.max-w-\\[440px\\]');
    const container = document.querySelector('.min-h-screen');
    return {
      card: window.getComputedStyle(card).backgroundColor,
      container: window.getComputedStyle(container).backgroundColor
    };
  });

  console.log('CORE:', coreBg);
  console.log('METRO:', metroBg);

  await browser.close();
})();
