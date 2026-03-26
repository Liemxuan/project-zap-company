import { getOrCreateSession } from "../session.js";

// Mock MongoDB model for isolated testing
jest.mock("../session.js", () => ({
    getOrCreateSession: jest.fn()
}));

describe("Native Router: Telegram Webhook", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should process an incoming Telegram webhook and bind to a threadId seamlessly", async () => {
        // 1. Arrange: Simulate an incoming Telegram JSON payload with a forum topic
        const mockRequest = {
            headers: { "x-tenant-id": "OLYMPUS_TEST" },
            body: {
                message: {
                    chat: { id: 123456789 },
                    from: { id: 987654321 },
                    text: "Agent, execute order 66",
                    message_thread_id: 42 // Native Forum Topic / Subagent Thread
                }
            }
        } as any;

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;

        (getOrCreateSession as jest.Mock).mockResolvedValue({
            sessionId: "OLYMPUS_TEST:telegram:123456789:42",
            messages: []
        });

        // 2. Act: Import and run the handler dynamically to avoid side-effects
        const { handleTelegramWebhook } = require("../inbound.js");
        await handleTelegramWebhook(mockRequest, mockResponse);

        // 3. Assert: Verify the router correctly extracted and passed the threadId
        expect(getOrCreateSession).toHaveBeenCalledWith(
            "OLYMPUS_TEST",
            "telegram",
            "123456789",
            "42"
        );

        // Verify it returned HTTP 200 to Telegram
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ ok: true });
    });
});
