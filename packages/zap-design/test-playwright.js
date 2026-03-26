/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/design/core/atoms/button');
  await page.waitForTimeout(2000); // Wait for hydration
  // The main showcase Button is "Action Button" inside the hero display canvas.
  const mainButton = page.locator('button:has-text("Action Button")');
  let classes = await mainButton.getAttribute('class');
  console.log('Main button loaded classes:', classes);
  
  // Click "secondary" semantic color selector
  // It's the button with exact text "secondary"
  await page.locator('button', { hasText: 'secondary' }).first().click();
  await page.waitForTimeout(500); // give react time to rerender
  
  classes = await mainButton.getAttribute('class');
  console.log('Main button classes after clicking secondary:', classes);
  await browser.close();
})();
