import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'zap_session',
      value: 'mock-user-id-bypass',
      domain: '127.0.0.1',
      path: '/',
    },
    {
      name: 'zap_session',
      value: 'mock-user-id-bypass',
      domain: 'localhost',
      path: '/',
    }
  ]);
  const page = await context.newPage();
  await page.goto("http://localhost:3500/chats/chat_123");
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/89d0ff65-f3f4-4117-99cb-a27e8734b68b/artifacts/debug-snapshot.png', fullPage: true });
  await browser.close();
  console.log("Debug snapshot saved");
})();
