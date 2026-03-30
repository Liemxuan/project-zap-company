import { omniQueue, triageJob } from "../engine/omni_queue.js";
import { getOrCreateSession, appendMessage } from "./session.js";
import { OmniPayload, LLMConfig } from "../engine/omni_router.js";

export interface SpawnSubAgentOptions {
    tenantId: string;
    agentSlug: string; // e.g., 'spike', 'jerry'
    mode: "session" | "run";
    parentSessionId: string;
    threadId?: string;
    chatId: string;
    channel?: string;
    payload: string;
}

/**
 * Native ACP (Agent Client Protocol) Spawner
 * -------------------------------------------------------------
 * Bypasses the limitations of external webhook frameworks by directly
 * resolving and enqueuing agent tasks locally. Natively solves the 
 * Telegram thread-binding limitation by injecting and propagating
 * existing thread and session constraints down to sub-agents.
 */
export async function spawnSubAgent(options: SpawnSubAgentOptions): Promise<string> {
    const { tenantId, agentSlug, mode, parentSessionId, threadId, chatId, channel = "ACP_INTERNAL", payload } = options;

    console.log(`[NativeACP] 🤖 Spawning sub-agent ${agentSlug} from parent session ${parentSessionId}...`);

    let sessionId = parentSessionId;

    if (mode === "session") {
        // Enforce the same memory thread binding if in session mode
        const session = await getOrCreateSession(tenantId, channel, chatId, threadId);
        sessionId = session.sessionId;
        
        // Write the handoff trace to memory so the global history shows the transfer
        await appendMessage(
            sessionId,
            tenantId,
            "system",
            `[ACP HANDOFF] Invoking sub-agent framework for specialized processing: ${agentSlug}.`
        );
        
        // Write the payload parameter as the user intent to steer the sub-agent
        await appendMessage(sessionId, tenantId, "user", payload);
    }

    // Construct the strictly typed OmniPayload for the multi-tier execution lane
    const omniPayload: OmniPayload = {
        // In a full implementation, this hooks up to the Agent Identity Registry
        systemPrompt: `You are ${agentSlug.toUpperCase()}, a native ACP bounded sub-agent executing inside the Olympus environment. Process the pending tasks accurately.`,
        messages: [
            { role: "user", content: payload }
        ],
        theme: "C_PRECISION", // Execution and deep architectural code tasks default to heavy precision
        intent: "ACP_SUBAGENT_SPAWN"
    };

    const queueName = triageJob(omniPayload);
    
    // Default LLM configuration (the OmniRouter or specific agent profiles will override as needed)
    const llmConfig: LLMConfig = {
        apiKey: process.env.GOOGLE_API_KEY || "", 
        defaultModel: "google/gemini-2.0-pro-exp-02-05", // Default heavy lifter for native tools
        accountLevel: "STANDARD"
    };

    // Push directly onto the local serialized Redis lane via OmniQueue
    const jobId = await omniQueue.enqueue(
        queueName,
        2, // Priority 2 for heavy async processing
        tenantId,
        omniPayload,
        llmConfig,
        channel as any,
        chatId,
        parseInt(chatId) || 0,
        {
            tenantId,
            senderIdentifier: chatId,
            sessionId: sessionId,
            assignedAgentId: agentSlug,
            ...(threadId ? { threadId } : {}) // This precisely patches the OpenClaw "thread=true" defect
        }
    );

    console.log(`[NativeACP] 🚀 Sub-agent [${agentSlug}] successfully enqueued on ${queueName} as Job: ${jobId}`);
    return jobId;
}
