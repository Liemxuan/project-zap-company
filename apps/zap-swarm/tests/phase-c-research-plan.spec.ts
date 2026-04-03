/**
 * Phase C — Research Plan Panel
 *
 * Strategy: Uses `window.__ZAP_SET_JOBS__` dev-mode hook to inject job state
 * directly into the React component, bypassing EventSource entirely.
 * This is necessary because Playwright's page.route() cannot properly mock
 * the browser's native EventSource streaming parser.
 */

import { test, expect, Page } from "@playwright/test";

const SESSION_ID = "chat_test_jobs_001";

function makeTask(overrides: {
  id?: string;
  intent?: string;
  status?: string;
}) {
  return {
    _id: overrides.id ?? `job_${Math.random().toString(36).slice(2)}`,
    intent: overrides.intent ?? "Research market trends",
    status: overrides.status ?? "PENDING",
    createdAt: new Date().toISOString(),
  };
}

async function openChatAndInjectJobs(page: Page, tasks: object[]) {
  // Stub APIs to prevent real network calls
  await page.route("**/api/swarm/agents", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ agents: [] }), contentType: "application/json" })
  );
  await page.route(`**/api/swarm/history/${SESSION_ID}/stream`, (route) =>
    route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
      body: "event: ping\ndata: {}\n\n",
    })
  );

  await page.goto(`/chats/${SESSION_ID}`);

  // Wait for React hydration and the dev hook to be exposed
  await page.waitForFunction(() => typeof (window as any).__ZAP_SET_JOBS__ === "function", null, { timeout: 5000 });

  // Inject jobs via the dev hook
  await page.evaluate((t) => (window as any).__ZAP_SET_JOBS__(t), tasks);

  // Small wait for React to re-render
  await page.waitForTimeout(200);
}

async function openChatNoJobs(page: Page) {
  await page.route("**/api/swarm/agents", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ agents: [] }), contentType: "application/json" })
  );
  await page.route(`**/api/swarm/history/${SESSION_ID}/stream`, (route) =>
    route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
      body: "event: ping\ndata: {}\n\n",
    })
  );

  await page.goto(`/chats/${SESSION_ID}`);
  await page.waitForFunction(() => typeof (window as any).__ZAP_SET_JOBS__ === "function", null, { timeout: 5000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Panel is hidden when there are no jobs
// ─────────────────────────────────────────────────────────────────────────────
test("Research Plan panel is hidden by default with no jobs", async ({ page }) => {
  await openChatNoJobs(page);
  const panel = page.locator('[data-testid="research-plan-header"]');
  await expect(panel).not.toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Panel appears and expands when jobs arrive
// ─────────────────────────────────────────────────────────────────────────────
test("Research Plan panel appears and expands when jobs arrive", async ({ page }) => {
  const tasks = [
    makeTask({ intent: "Research market trends", status: "RUNNING" }),
    makeTask({ intent: "Analyse competitor data", status: "PENDING" }),
  ];

  await openChatAndInjectJobs(page, tasks);

  const panelHeader = page.locator('[data-testid="research-plan-header"]');
  await expect(panelHeader).toBeVisible({ timeout: 3000 });
  await expect(page.locator("text=Research market trends")).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Step count shown in panel header
// ─────────────────────────────────────────────────────────────────────────────
test("step count is displayed in panel header", async ({ page }) => {
  const tasks = [
    makeTask({ intent: "Research trends" }),
    makeTask({ intent: "Write summary" }),
    makeTask({ intent: "Deploy report" }),
  ];

  await openChatAndInjectJobs(page, tasks);
  await expect(page.locator("text=3 steps")).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4-9: classifyStep label classification
// ─────────────────────────────────────────────────────────────────────────────
test("shows RESEARCH classification for search intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Search the web for news" })]);
  const label = page.locator('[data-testid="research-plan-content"] >> text=RESEARCH');
  await expect(label).toBeVisible({ timeout: 3000 });
});

test("shows RESEARCH classification for fetch intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Fetch latest stock prices" })]);
  const label = page.locator('[data-testid="research-plan-content"] >> text=RESEARCH');
  await expect(label).toBeVisible({ timeout: 3000 });
});

test("shows ANALYSIS classification for analyse intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Analyse the dataset for patterns" })]);
  const label = page.locator('[data-testid="research-plan-content"] >> text=ANALYSIS');
  await expect(label).toBeVisible({ timeout: 3000 });
});

test("shows SYNTHESIS classification for write intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Write a summary report" })]);
  const label = page.locator('[data-testid="research-plan-content"] >> text=SYNTHESIS');
  await expect(label).toBeVisible({ timeout: 3000 });
});

test("shows EXECUTE classification for deploy intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Deploy the service to production" })]);
  const label = page.locator('[data-testid="research-plan-content"] >> text=EXECUTE');
  await expect(label).toBeVisible({ timeout: 3000 });
});

test("shows MEMORY classification for store intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Store results in memory" })]);
  const label = page.locator('[data-testid="research-plan-content"]').getByText("MEMORY", { exact: true });
  await expect(label).toBeVisible({ timeout: 3000 });
});

test("shows TASK classification for unrecognised intent", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Do something unrecognised" })]);
  const label = page.locator('[data-testid="research-plan-content"] >> text=TASK');
  await expect(label).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 10: Step numbers
// ─────────────────────────────────────────────────────────────────────────────
test("step numbers are displayed for each job", async ({ page }) => {
  await openChatAndInjectJobs(page, [
    makeTask({ intent: "Research topic A" }),
    makeTask({ intent: "Research topic B" }),
  ]);

  await expect(page.locator('[data-testid="research-plan-header"]')).toBeVisible({ timeout: 3000 });
  const content = page.locator('[data-testid="research-plan-content"]');
  await expect(content.locator("text=1").first()).toBeVisible({ timeout: 3000 });
  await expect(content.locator("text=2").first()).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 11: Toggle collapses and expands
// ─────────────────────────────────────────────────────────────────────────────
test("clicking the panel header toggles the step list", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Research topic" })]);

  const header = page.locator('[data-testid="research-plan-header"]');
  await expect(header).toBeVisible({ timeout: 3000 });
  await expect(page.locator("text=Research topic")).toBeVisible({ timeout: 2000 });

  // Collapse
  await header.click();
  await expect(page.locator("text=Research topic")).not.toBeVisible({ timeout: 2000 });

  // Expand
  await header.click();
  await expect(page.locator("text=Research topic")).toBeVisible({ timeout: 2000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 12: RUNNING job shows spinning icon
// ─────────────────────────────────────────────────────────────────────────────
test("RUNNING job shows animate-spin status icon", async ({ page }) => {
  await openChatAndInjectJobs(page, [makeTask({ intent: "Research topic", status: "RUNNING" })]);

  await expect(page.locator('[data-testid="research-plan-header"]')).toBeVisible({ timeout: 3000 });
  const spinner = page.locator('[data-testid="research-plan-content"] .animate-spin').first();
  await expect(spinner).toBeVisible({ timeout: 3000 });
});
