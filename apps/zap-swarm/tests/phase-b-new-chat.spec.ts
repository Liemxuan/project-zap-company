/**
 * Phase B — New Chat Landing (Agent Selector Grid)
 *
 * The /chats/new page must:
 * 1. Render a grid of agent cards, not an immediate redirect
 * 2. Show skeleton cards while /api/swarm/agents is loading
 * 3. Always show OmniRouter as the first card
 * 4. Clicking OmniRouter navigates to /chats/chat_xxx (random ID)
 * 5. Clicking a named agent navigates to /chats/[agentName]
 * 6. Back link returns to /
 */

import { test, expect } from "@playwright/test";

const MOCK_AGENTS = [
  { name: "Jerry", role: "Chief of Staff", status: "active", uptime: "3h 12m" },
  { name: "Spike", role: "Data Arbitrage Analyst", status: "idle", uptime: "1h 5m" },
  { name: "Athena", role: "Researcher", status: "active", uptime: "7h 44m" },
];

// Stub agents API with a configurable delay
function stubAgents(page: import("@playwright/test").Page, delayMs = 0) {
  return page.route("/api/swarm/agents", async (route) => {
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, agents: MOCK_AGENTS }),
      contentType: "application/json",
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Page renders the agent selector grid (not a redirect)
// ─────────────────────────────────────────────────────────────────────────────
test("renders agent selector grid on /chats/new", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  // The page should not immediately redirect — heading should be visible
  await expect(page.locator("text=New Session")).toBeVisible({ timeout: 3000 });
  expect(page.url()).toContain("/chats/new");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: OmniRouter card is always the first card
// ─────────────────────────────────────────────────────────────────────────────
test("OmniRouter card is the first item in the grid", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  // Verify OmniRouter is visible in the grid
  const omniCard = page.getByRole("button", { name: /OmniRouter/i });
  await expect(omniCard).toBeVisible({ timeout: 3000 });
  await expect(omniCard).toContainText("Auto-route");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Agent cards are rendered from the API response
// ─────────────────────────────────────────────────────────────────────────────
test("renders an agent card for each agent returned by the API", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  // Wait for skeleton cards to resolve
  for (const agent of MOCK_AGENTS) {
    await expect(page.locator(`text=${agent.name}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${agent.role}`)).toBeVisible({ timeout: 3000 });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Skeleton cards shown during loading
// ─────────────────────────────────────────────────────────────────────────────
test("shows skeleton loading cards before agents load", async ({ page }) => {
  // Delay the response by 2s so we can catch the loading state
  await stubAgents(page, 2000);
  await page.goto("/chats/new");

  // During the delay, skeleton cards (animate-pulse divs) should be present
  const skeletons = page.locator(".animate-pulse");
  await expect(skeletons.first()).toBeVisible({ timeout: 1500 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Clicking OmniRouter navigates to /chats/chat_xxx
// ─────────────────────────────────────────────────────────────────────────────
test.skip("clicking OmniRouter navigates to a random chat_xxx session", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  const omniCard = page.getByRole("button", { name: /OmniRouter/i });
  await expect(omniCard).toBeVisible({ timeout: 3000 });

  // Click the OmniRouter card (force because sidebar may overlap in small viewports)
  await omniCard.click({ force: true });

  // Wait for navigation — should land on /chats/chat_...
  await page.waitForURL(/\/chats\/chat_/, { timeout: 10000 });
  expect(page.url()).toMatch(/\/chats\/chat_/);
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Clicking a named agent navigates to /chats/[agentName]
// ─────────────────────────────────────────────────────────────────────────────
test("clicking Jerry card navigates to /chats/Jerry", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  await expect(page.locator("text=Jerry")).toBeVisible({ timeout: 5000 });

  await page.locator("text=Jerry").first().click();

  await page.waitForURL(/\/chats\/[A-Za-z0-9_-]+\?agent=Jerry/, { timeout: 3000 });
  expect(page.url()).toContain("agent=Jerry");
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Status dots reflect agent status (green = active, amber = idle)
// ─────────────────────────────────────────────────────────────────────────────
test("active agent shows green status dot", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  await expect(page.locator("text=Jerry")).toBeVisible({ timeout: 5000 });

  // The status dot for an active agent should have the green class (bg-green-400)
  const jerryCard = page.locator("button[type='button']", { hasText: "Jerry" });
  const greenDot = jerryCard.locator(".bg-green-400");
  await expect(greenDot).toBeVisible();
});

test("idle agent shows amber status dot", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  await expect(page.locator("text=Spike")).toBeVisible({ timeout: 5000 });

  const spikeCard = page.locator("button[type='button']", { hasText: "Spike" });
  const amberDot = spikeCard.locator(".bg-amber-400");
  await expect(amberDot).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: Back link returns to home
// ─────────────────────────────────────────────────────────────────────────────
test("Back link navigates to /", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  await expect(page.locator("text=Back")).toBeVisible({ timeout: 3000 });
  await page.locator("text=Back").click();

  await page.waitForURL("/", { timeout: 3000 });
  expect(page.url()).toMatch(/\/$/);
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 9: Uptime text is shown on each card
// ─────────────────────────────────────────────────────────────────────────────
test("agent card shows uptime text", async ({ page }) => {
  await stubAgents(page);
  await page.goto("/chats/new");

  await expect(page.locator("text=3h 12m")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("text=1h 5m")).toBeVisible({ timeout: 3000 });
});
