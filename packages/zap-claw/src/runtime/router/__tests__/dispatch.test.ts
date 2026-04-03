import { MongoClient } from "mongodb";
import { passesMentionGate, resolveAgentBinding } from "../dispatch.js";

jest.mock("mongodb");

describe("Native Router: Dispatch Matrix & Mention Gating", () => {
    describe("passesMentionGate", () => {
        it("allows all DM (private) messages regardless of text", () => {
            expect(passesMentionGate("private", "hello there", "zap_bot")).toBe(true);
        });

        it("allows group messages if they are explicitly part of a bound thread", () => {
            expect(passesMentionGate("group", "no mention here", "zap_bot", "42")).toBe(true);
        });

        it("allows group messages if they contain the @botUsername mention", () => {
            expect(passesMentionGate("group", "hey @zap_bot can you help?", "zap_bot")).toBe(true);
            expect(passesMentionGate("supergroup", "@zap_bot, tell me a joke", "zap_bot")).toBe(true);
        });

        it("drops group messages without an explicit mention or thread bound", () => {
            expect(passesMentionGate("group", "hello everyone", "zap_bot")).toBe(false);
            expect(passesMentionGate("channel", "announcement text", "zap_bot")).toBe(false);
        });
    });

    describe("resolveAgentBinding", () => {
        let mockCollection: any;
        let mockDb: any;
        let mockClient: any;

        beforeEach(() => {
            mockCollection = {
                findOne: jest.fn()
            };
            mockDb = {
                collection: jest.fn().mockReturnValue(mockCollection)
            };
            mockClient = {
                connect: jest.fn(),
                db: jest.fn().mockReturnValue(mockDb),
                close: jest.fn()
            };
            (MongoClient as unknown as jest.Mock).mockImplementation(() => mockClient);
            jest.clearAllMocks();
        });

        it("resolves Rule 1: Exact Thread Override", async () => {
            mockCollection.findOne.mockResolvedValueOnce({
                agentId: "hermes-subagent",
                systemPrompt: "Nested sub-thread context",
                priority: 100
            });

            const result = await resolveAgentBinding("dummy", "TENANT_A", "telegram", "123", "42");
            expect(result?.agentId).toBe("hermes-subagent");
            expect(mockCollection.findOne).toHaveBeenCalledWith(
                { platform: "telegram", peerId: "123", parentThreadId: "42" },
                { sort: { priority: -1 } }
            );
        });

        it("resolves Rule 3: Platform Catch-All if no peer match", async () => {
            mockCollection.findOne
                .mockResolvedValueOnce(null) // Rule 1 fails
                .mockResolvedValueOnce(null) // Rule 2 fails
                .mockResolvedValueOnce({
                    agentId: "platform-default-agent",
                    priority: 10
                }); // Rule 3 succeeds

            const result = await resolveAgentBinding("dummy", "TENANT_A", "telegram", "unknown_user");
            
            expect(result?.agentId).toBe("platform-default-agent");
            expect(mockCollection.findOne).toHaveBeenCalledTimes(3);
        });

        it("fails-closed and returns null if no bindings exist", async () => {
            mockCollection.findOne.mockResolvedValue(null);
            
            const result = await resolveAgentBinding("dummy", "TENANT_A", "telegram", "unknown_user");
            expect(result).toBeNull();
        });
    });
});
