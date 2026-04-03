const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // 1. Chat Interface
  console.log("Navigating to Chat UI...");
  await page.goto('http://localhost:3500/chats/new');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/b84835ad-3e2f-4dac-b760-7dea6ee37748/UI_Chat.png', fullPage: true });

  // 2. Dashboard Channels
  console.log("Navigating to Channels Dashboard...");
  await page.goto('http://localhost:3500/channels');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/b84835ad-3e2f-4dac-b760-7dea6ee37748/UI_Channels.png', fullPage: true });

  // 3. MCP Sandbox
  console.log("Navigating to Sandbox Dashboard...");
  await page.goto('http://localhost:3500/sandbox');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/zap/.gemini/antigravity/brain/b84835ad-3e2f-4dac-b760-7dea6ee37748/UI_Sandbox.png', fullPage: true });

  await browser.close();
  console.log("Screenshots captured successfully.");
}

run().catch(console.error);
