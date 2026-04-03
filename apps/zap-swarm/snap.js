const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
  const context = await browser.newContext();
  await context.addCookies([{name: 'zap_session', value: 'mock-user-id-bypass', domain: 'localhost', path: '/'}]);
  const page = await context.newPage();
  await page.goto('http://localhost:3500/chats/new');
  await page.waitForTimeout(2000); // wait for skeletons to disappear
  await page.click('button:has-text("Jerry")');
  await page.waitForURL(/\/chats\/[A-Za-z0-9_-]+\?agent=Jerry/);
  await page.waitForTimeout(1000);
  await page.fill('textarea', 'Generate a picture of a cat using nano_banana_2');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(10000); // Wait for the backend LLM loop and WebSocket push
  await page.screenshot({ path: '/tmp/swarm-chat.png' });
  await browser.close();
  console.log("Screenshot saved to /tmp/swarm-chat.png");
})();
