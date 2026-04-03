import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // SSE tests share port — run sequentially
  retries: 1,
  reporter: "list",
  globalSetup: require.resolve('./tests/global-setup'),
  use: {
    baseURL: "http://localhost:3500",
    trace: "on-first-retry",
    storageState: 'storageState.json',
  },
  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
      },
    },
  ],
  // Assumes `npm run dev` is already running. Start it automatically in CI:
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:3500",
  //   reuseExistingServer: true,
  // },
});
