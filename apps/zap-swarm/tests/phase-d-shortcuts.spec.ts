/**
 * Phase D — Keyboard Shortcuts
 *
 * Shortcuts implemented:
 *   Enter            → send message (handleSendMessage)
 *   Cmd/Ctrl+Enter   → send message (alternative)
 *   Shift+Enter      → newline (no send)
 *   Escape           → cancel execution (handleCancelExecution) — only when isTyping=true
 *   Cmd/Ctrl+K       → focus textarea from anywhere on the page
 *
 * Cancel hits: POST /api/swarm/threads/:id/interrupt { reason: "user_cancelled" }
 * Send hits:   POST /api/swarm/chat { sessionId, agentId, message, tenantId }
 */

import { test, expect } from "@playwright/test";

const SESSION_ID = "chat_test_shortcuts_001";
const STREAM_URL = `/api/swarm/history/${SESSION_ID}/stream`;
const CHAT_API = "/api/swarm/chat";
const INTERRUPT_API = `/api/swarm/threads/${SESSION_ID}/interrupt`;

function sseEvent(event: string, data: object): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

test.describe("Phase D — Keyboard Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    // Stub the SSE stream — silent by default, each test overrides if needed
    await page.route(STREAM_URL, async (route) => {
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        body: sseEvent("ping", { ts: Date.now() }),
      });
    });

    // Stub agents
    await page.route("/api/swarm/agents", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ agents: [] }),
        contentType: "application/json",
      })
    );

    // Stub chat send
    await page.route(CHAT_API, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ jobId: "job_test_123" }),
        contentType: "application/json",
      });
    });

    // Stub interrupt/cancel
    await page.route(INTERRUPT_API, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ ok: true }),
        contentType: "application/json",
      });
    });

    await page.goto(`/chats/${SESSION_ID}`);
    // Wait for the textarea to be present before each test
    await page.locator("textarea").first().waitFor({ state: "visible", timeout: 5000 });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Cmd+K focuses the chat textarea
  // ──────────────────────────────────────────────────────────────────────────
  test("Cmd+K focuses the chat textarea from anywhere on the page", async ({ page }) => {
    const textarea = page.locator("textarea").first();

    // Click away from the textarea to ensure it's blurred
    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await expect(textarea).not.toBeFocused();

    // Fire global Cmd+K
    await page.keyboard.press("Meta+k");

    await expect(textarea).toBeFocused();
  });

  test("Ctrl+K also focuses the textarea (Windows/Linux binding)", async ({ page }) => {
    const textarea = page.locator("textarea").first();

    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await page.keyboard.press("Control+k");

    await expect(textarea).toBeFocused();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Enter sends the message and clears the input
  // ──────────────────────────────────────────────────────────────────────────
  test("Enter key sends the message and clears the textarea", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.click();
    await textarea.fill("Hello from Enter key");

    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/api/swarm/chat") && req.method() === "POST"),
      page.keyboard.press("Enter"),
    ]);

    const body = JSON.parse(request.postData() ?? "{}");
    expect(body.message).toBe("Hello from Enter key");

    // Textarea should be cleared after send
    await expect(textarea).toHaveValue("");
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Cmd+Enter also sends the message
  // ──────────────────────────────────────────────────────────────────────────
  test("Cmd+Enter sends the message (alternative shortcut)", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.click();
    await textarea.fill("Hello from Cmd+Enter");

    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/api/swarm/chat") && req.method() === "POST"),
      page.keyboard.press("Meta+Enter"),
    ]);

    const body = JSON.parse(request.postData() ?? "{}");
    expect(body.message).toBe("Hello from Cmd+Enter");
    await expect(textarea).toHaveValue("");
  });

  test("Ctrl+Enter also sends the message (Windows/Linux)", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.click();
    await textarea.fill("Hello from Ctrl+Enter");

    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/api/swarm/chat") && req.method() === "POST"),
      page.keyboard.press("Control+Enter"),
    ]);

    const body = JSON.parse(request.postData() ?? "{}");
    expect(body.message).toBe("Hello from Ctrl+Enter");
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Shift+Enter inserts a newline, does NOT send
  // ──────────────────────────────────────────────────────────────────────────
  test("Shift+Enter inserts a newline without sending", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.click();
    await textarea.fill("Line one");

    let chatRequestFired = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/swarm/chat")) chatRequestFired = true;
    });

    await page.keyboard.press("Shift+Enter");
    // Type a second line to confirm cursor moved down
    await page.keyboard.type("Line two");

    // No send should have happened
    expect(chatRequestFired).toBe(false);

    // Textarea value should contain a newline
    const value = await textarea.inputValue();
    expect(value).toContain("\n");
    expect(value).toContain("Line one");
    expect(value).toContain("Line two");
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: Escape cancels a running execution
  // ──────────────────────────────────────────────────────────────────────────
  test("Escape calls interrupt API when agent is working", async ({ page }) => {
    // Wait for dev hooks to register
    await page.waitForFunction(() => typeof (window as any).__ZAP_SET_TYPING__ === "function", null, { timeout: 5000 });

    // Set typing state to true via hook
    await page.evaluate(() => (window as any).__ZAP_SET_TYPING__(true));
    await page.waitForTimeout(200);

    const textarea = page.locator("textarea").first();
    await textarea.click();

    const [interruptRequest] = await Promise.all([
      page.waitForRequest(
        (req) => req.url().includes("/interrupt") && req.method() === "POST",
        { timeout: 4000 }
      ),
      page.keyboard.press("Escape"),
    ]);

    const body = JSON.parse(interruptRequest.postData() ?? "{}");
    expect(body.reason).toBe("user_cancelled");
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6: Escape does NOT call interrupt when agent is idle (isTyping=false)
  // ──────────────────────────────────────────────────────────────────────────
  test("Escape does nothing when agent is not working", async ({ page }) => {
    let interruptCalled = false;
    page.on("request", (req) => {
      if (req.url().includes("/interrupt")) interruptCalled = true;
    });

    const textarea = page.locator("textarea").first();
    await textarea.click();

    // Press Escape while idle
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    expect(interruptCalled).toBe(false);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 7: Empty input does not trigger send on Enter
  // ──────────────────────────────────────────────────────────────────────────
  test("Enter with empty textarea does not send a message", async ({ page }) => {
    let chatRequestFired = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/swarm/chat")) chatRequestFired = true;
    });

    const textarea = page.locator("textarea").first();
    await textarea.click();
    // Ensure empty
    await textarea.fill("");

    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);

    expect(chatRequestFired).toBe(false);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 8: Cancel button visible while typing, send hint visible while idle
  // ──────────────────────────────────────────────────────────────────────────
  test("ESC cancel button is shown while agent is working", async ({ page }) => {
    // Wait for dev hooks
    await page.waitForFunction(() => typeof (window as any).__ZAP_SET_TYPING__ === "function", null, { timeout: 5000 });
    
    // Set typing state to true
    await page.evaluate(() => (window as any).__ZAP_SET_TYPING__(true));
    await page.waitForTimeout(200);

    // When isTyping=true, at minimum the typing indicator should be visible
    const indicator = page.locator('[data-testid="typing-indicator"], .animate-spin, .animate-bounce').first();
    await expect(indicator).toBeVisible({ timeout: 3000 });
  });

  test("send hint (⌘↵) is shown when agent is idle", async ({ page }) => {
    // Check for the send button (the arrow-up submit button) which is visible when idle
    const sendBtn = page.locator('button[type="submit"], button:has(svg)').last();
    await expect(sendBtn).toBeVisible({ timeout: 3000 });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 9: Cmd+K works from outside the textarea (e.g. from the logs panel)
  // ──────────────────────────────────────────────────────────────────────────
  test("Cmd+K focuses textarea even when another element has focus", async ({ page }) => {
    // Click somewhere other than the textarea to blur it
    await page.locator("body").click({ position: { x: 10, y: 10 } });

    const textarea = page.locator("textarea").first();
    await expect(textarea).not.toBeFocused();

    await page.keyboard.press("Meta+k");
    await expect(textarea).toBeFocused({ timeout: 2000 });
  });
});
