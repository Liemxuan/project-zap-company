/**
 * Phase A — Streaming Render
 *
 * Strategy: mock the SSE endpoint (/api/swarm/history/:id/stream) to inject
 * controlled events, then assert DOM state at each stage.
 *
 * SSE event shapes (from stream/route.ts):
 *   status       → { type: "working" | "reply_incoming" }
 *   reply_preview→ { content: "...text..." }
 *   messages     → { messages: [{ id, role, content, timestamp }] }
 *   jobs         → { tasks: [...] }
 */

import { test, expect, Page } from "@playwright/test";

const SESSION_ID = "chat_test_stream_001";
const STREAM_URL = `/api/swarm/history/${SESSION_ID}/stream`;

// Encode an SSE event into the wire format
function sseEvent(event: string, data: object): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

// Helper: open the chat page with a mocked SSE stream that sends events in sequence
async function openChatWithStream(
  page: Page,
  events: Array<{ event: string; data: object; delayMs?: number }>
) {
  await page.route(STREAM_URL, async (route) => {
    // Build the full SSE body up-front (Playwright doesn't support chunked streaming
    // in route handlers, so we batch all events with the correct SSE format)
    const body = events.map(e => sseEvent(e.event, e.data)).join("");
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body,
    });
  });

  // Stub the agents API so the greeting appears immediately
  await page.route("/api/swarm/agents", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ agents: [] }),
      contentType: "application/json",
    })
  );

  await page.goto(`/chats/${SESSION_ID}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Typing spinner appears when status=working
// ─────────────────────────────────────────────────────────────────────────────
test("shows typing spinner on status:working event", async ({ page }) => {
  await openChatWithStream(page, [
    { event: "status", data: { type: "working" } },
  ]);

  // The typing indicator is rendered when isTyping=true and no streamingContent
  // It contains a Loader2 icon (animate-spin) or a set of bouncing dots
  const spinner = page.locator('[data-testid="typing-indicator"], .animate-spin, .animate-bounce').first();
  await expect(spinner).toBeVisible({ timeout: 4000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Streaming bubble appears on reply_preview event
// Uses __ZAP_SET_STREAM_PREVIEW__ hook since page.route() EventSource mock is unreliable
// ─────────────────────────────────────────────────────────────────────────────
test.skip("renders streaming bubble when reply_preview arrives", async ({ page }) => {
  const previewText = "Here is the answer you were looking for";

  // Stub API routes
  await page.route("**/api/swarm/agents", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ agents: [] }), contentType: "application/json" })
  );
  await page.route(`**${STREAM_URL}`, (route) =>
    route.fulfill({ status: 200, headers: { "Content-Type": "text/event-stream" }, body: "event: ping\ndata: {}\n\n" })
  );

  await page.goto(`/chats/${SESSION_ID}`);
  await page.waitForFunction(() => typeof (window as any).__ZAP_SET_STREAM_PREVIEW__ === "function", null, { timeout: 5000 });

  // Inject stream preview text
  await page.evaluate((text) => (window as any).__ZAP_SET_STREAM_PREVIEW__(text), previewText);
  await page.waitForTimeout(200);

  await expect(page.locator(`text=${previewText}`)).toBeVisible({ timeout: 3000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Spinner hides once reply_preview fires
// ─────────────────────────────────────────────────────────────────────────────
test.skip("typing spinner disappears once reply_preview fires", async ({ page }) => {
  // Stub API routes
  await page.route("**/api/swarm/agents", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ agents: [] }), contentType: "application/json" })
  );
  await page.route(`**${STREAM_URL}`, (route) =>
    route.fulfill({ status: 200, headers: { "Content-Type": "text/event-stream" }, body: "event: ping\ndata: {}\n\n" })
  );

  await page.goto(`/chats/${SESSION_ID}`);
  await page.waitForFunction(() => typeof (window as any).__ZAP_SET_TYPING__ === "function", null, { timeout: 5000 });

  // Set typing to true first
  await page.evaluate(() => (window as any).__ZAP_SET_TYPING__(true));
  await page.waitForTimeout(200);

  // Verify spinner is visible
  const spinner = page.locator('[data-testid="typing-indicator"], .animate-spin, .animate-bounce').first();
  await expect(spinner).toBeVisible({ timeout: 2000 });

  // Now inject stream preview (should clear typing)
  await page.evaluate(() => {
    (window as any).__ZAP_SET_STREAM_PREVIEW__("Partial answer...");
    (window as any).__ZAP_SET_TYPING__(false);
  });
  await page.waitForTimeout(200);

  // Preview should appear and spinner should be gone
  await expect(page.locator("text=Partial answer...")).toBeVisible({ timeout: 2000 });
  const typingDots = page.locator('[data-testid="typing-indicator"]');
  await expect(typingDots).not.toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Settled messages event clears streaming bubble
// ─────────────────────────────────────────────────────────────────────────────
test("streaming bubble is replaced by settled message on messages event", async ({ page }) => {
  const settledContent = "Final complete answer from the agent.";

  await openChatWithStream(page, [
    { event: "status", data: { type: "working" } },
    { event: "reply_preview", data: { content: "Partial..." } },
    {
      event: "messages",
      data: {
        messages: [
          {
            id: "msg_1",
            role: "user",
            content: "Hello",
            timestamp: new Date().toISOString(),
          },
          {
            id: "msg_2",
            role: "assistant",
            content: settledContent,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    },
  ]);

  await page.goto(`/chats/${SESSION_ID}`);

  // Settled message should appear
  await expect(page.locator(`text=${settledContent}`)).toBeVisible({ timeout: 5000 });

  // Streaming bubble (blinking cursor) should be gone
  // The cursor is a span with animate-pulse that only exists inside the streaming bubble
  // After messages settle, streamingContent is null so the streaming bubble is unmounted
  const streamingBubble = page.locator(".animate-pulse");
  await expect(streamingBubble).not.toBeVisible({ timeout: 2000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: EventSource connects to the correct URL
// ─────────────────────────────────────────────────────────────────────────────
test("EventSource connects to the SSE stream endpoint", async ({ page }) => {
  let streamRequested = false;

  await page.route(STREAM_URL, async (route) => {
    streamRequested = true;
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      body: sseEvent("ping", { ts: Date.now() }),
    });
  });

  await page.route("/api/swarm/agents", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ agents: [] }), contentType: "application/json" })
  );

  await page.goto(`/chats/${SESSION_ID}`);
  await page.waitForTimeout(1000);

  expect(streamRequested).toBe(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Messages from SSE are rendered in the chat feed
// ─────────────────────────────────────────────────────────────────────────────
test("historical messages from SSE messages event appear in the chat feed", async ({ page }) => {
  await openChatWithStream(page, [
    {
      event: "messages",
      data: {
        messages: [
          { id: "1", role: "user", content: "What is the capital of France?", timestamp: new Date().toISOString() },
          { id: "2", role: "assistant", content: "The capital of France is Paris.", timestamp: new Date().toISOString() },
        ],
      },
    },
  ]);

  await page.goto(`/chats/${SESSION_ID}`);

  await expect(page.locator("text=What is the capital of France?")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("text=The capital of France is Paris.")).toBeVisible({ timeout: 5000 });
});
