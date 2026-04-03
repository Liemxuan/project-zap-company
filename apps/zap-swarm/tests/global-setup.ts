import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
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
  await context.storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
