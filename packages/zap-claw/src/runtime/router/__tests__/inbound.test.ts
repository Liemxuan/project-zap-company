// Mock session module before any imports
jest.mock("../session.js", () => ({
    getOrCreateSession: jest.fn(),
    appendMessage: jest.fn(),
}));

// Mock omni_queue to prevent real DB calls
jest.mock("../../engine/omni_queue.js", () => ({
    omniQueue: { enqueue: jest.fn().mockResolvedValue("mock-job-id") },
    triageJob: jest.fn().mockReturnValue("Queue-Text-Fast"),
    QueuePriority: { NORMAL: 1 },
}));

// Mock omni_router to prevent import side effects
jest.mock("../../engine/omni_router.js", () => ({}));

// Mock dispatch logic for PRJ-016
jest.mock("../dispatch.js", () => ({
    passesMentionGate: jest.fn(),
    resolveAgentBinding: jest.fn()
}));

import { getOrCreateSession } from "../session.js";
import { passesMentionGate, resolveAgentBinding } from "../dispatch.js";
import { handleTelegramWebhook } from "../inbound.js";

describe("Native Router: Telegram Webhook (PRJ-016)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should process an incoming Telegram webhook and bind to a threadId seamlessly", async () => {
        const mockRequest = {
            headers: { "x-tenant-id": "OLYMPUS_TEST" },
            body: {
                message: {
                    chat: { id: 123456789, type: "private" },
                    from: { id: 987654321 },
                    text: "Agent, execute order 66",
                    message_thread_id: 42
                }
            }
        } as any;

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;

        (passesMentionGate as jest.Mock).mockReturnValue(true);
        (resolveAgentBinding as jest.Mock).mockResolvedValue({
            agentId: "hermes-test",
            systemPrompt: "Test System Prompt",
            priority: 50
        });

        (getOrCreateSession as jest.Mock).mockResolvedValue({
            sessionId: "OLYMPUS_TEST:telegram:123456789:42",
            messages: []
        });

        await handleTelegramWebhook(mockRequest, mockResponse);

        expect(passesMentionGate).toHaveBeenCalledWith(
            "private",
            "Agent, execute order 66",
            expect.any(String), // botUsername
            "42"
        );

        expect(resolveAgentBinding).toHaveBeenCalledWith(
            expect.any(String), // mongoUri
            "OLYMPUS_TEST",
            "telegram",
            "123456789",
            "42"
        );

        expect(getOrCreateSession).toHaveBeenCalledWith(
            "OLYMPUS_TEST",
            "telegram",
            "123456789",
            "42"
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ ok: true });
    });

    it("should drop group messages that fail the mention gate", async () => {
        const mockRequest = {
            headers: { "x-tenant-id": "OLYMPUS_TEST" },
            body: {
                message: {
                    chat: { id: -100123, type: "supergroup" },
                    from: { id: 987654321 },
                    text: "Just talking to my friends",
                }
            }
        } as any;

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;

        // Simulate failing the mention gate
        (passesMentionGate as jest.Mock).mockReturnValue(false);

        await handleTelegramWebhook(mockRequest, mockResponse);

        expect(passesMentionGate).toHaveBeenCalled();
        expect(resolveAgentBinding).not.toHaveBeenCalled();
        expect(getOrCreateSession).not.toHaveBeenCalled();

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ ok: true, dropped: "mention_gated" });
    });

    it("should drop payloads that fail agent binding resolution (Fail-Closed)", async () => {
        const mockRequest = {
            headers: { "x-tenant-id": "OLYMPUS_TEST" },
            body: {
                message: {
                    chat: { id: 12345, type: "private" },
                    from: { id: 987654321 },
                    text: "Help me",
                }
            }
        } as any;

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;

        (passesMentionGate as jest.Mock).mockReturnValue(true);
        // Simulate no binding found
        (resolveAgentBinding as jest.Mock).mockResolvedValue(null);

        await handleTelegramWebhook(mockRequest, mockResponse);

        expect(getOrCreateSession).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ ok: true, dropped: "no_agent_binding" });
    });
});
