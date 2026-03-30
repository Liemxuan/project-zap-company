import OpenAI from "openai";
import type {
    ChatCompletionMessageParam,
    ChatCompletionToolMessageParam,
} from "openai/resources/index.js";
import { toolDefinitions, executeTool, getAvailableTools } from "./tools/index.js";
import { SYSTEM_PROMPT } from "./system_prompt.js";
import { getHistory, appendMessage, pruneHistory } from "./history.js";
import * as fs from "fs";
import * as path from "path";
import { type GatewayTier, getGatewayConfig, type GatewayPayload } from "./gateway.js";
import { type ToolMiddlewareContext } from "./middlewares/pipeline.js";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "zap-claw";

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_ITERATIONS = 40;

// ── Agent Loop ────────────────────────────────────────────────────────────────

export class AgentLoop {
    private readonly client: OpenAI;
    private readonly gatewayPayload: GatewayPayload;
    private readonly botName: string;
    private systemPromptCache: string | null = null;

    constructor(tier: GatewayTier = "tier_p3_heavy", botName: string = "ZapClaw") {
        this.botName = botName;
        const apiKey = process.env["OPENROUTER_API_KEY"];
        if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

        this.gatewayPayload = getGatewayConfig(tier);

        const headers: Record<string, string> = {
            "HTTP-Referer": "https://github.com/zap-claw",
            "X-Title": "Zap Claw",
        };

        this.client = new OpenAI({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: headers,
        });
    }

    private getSystemPrompt(): string {
        if (this.systemPromptCache) return this.systemPromptCache;

        // Try to load Triangulation-specific agent templates
        const slug = this.botName.toLowerCase().split(" ")[0]; // e.g. "claw"
        const specificAgentDir = path.resolve(process.cwd(), `.agent/${slug}`);

        if (fs.existsSync(specificAgentDir)) {
            let compiledPrompt = "Zap Claw Omni-Router Framework. ";
            const filesToLoad = ["IDENTITY.md", "HEARTBEAT.md", "SOUL.md", "TOOLS.md", "USER.md"];
            for (const file of filesToLoad) {
                const filePath = path.join(specificAgentDir, file);
                if (fs.existsSync(filePath)) {
                    compiledPrompt += `\n\n--- ${file} ---\n${fs.readFileSync(filePath, "utf-8")}`;
                }
            }
            this.systemPromptCache = compiledPrompt;
            return compiledPrompt;
        }

        // Fallback to the legacy root SYSTEM_PROMPT
        this.systemPromptCache = SYSTEM_PROMPT;
        return SYSTEM_PROMPT;
    }

    async run(userId: number, userMessage: string, accountType: string = "PERSONAL", sessionId?: string, onStatus?: (msg: string) => void): Promise<string> {
        const setStatus = (msg: string) => {
            console.log(msg);
            if (onStatus) onStatus(msg);
        };
        // Append the user's message to DB with accountType and BOT identifier
        const unifiedAccountType = accountType.includes(":") || accountType === "OLYMPUS_SWARM" ? accountType : `${accountType}:${this.botName}`;
        await appendMessage(userId, "user", userMessage, unifiedAccountType);

        // --- Bicameral Brain Routing (Bicameral Execution) ---
        // Determine complexity: Simple pattern matching vs. Deep Reasoning
        const isOlympus = unifiedAccountType.includes("OLYMPUS");
        const isResearch = /research|analyze|blueprint|complex|architect|reason|logic|deep/i.test(userMessage);

        // Tier 3: Strategic Research (Gemini Deep Research)
        // Tier 2: Heavy reasoning (Gemini Flash/Pro 3.1)
        // Tier 1: Budget (Flash 2.5)
        let runtimeTier: GatewayTier = "tier_p0_fast";

        if (isResearch || isOlympus) {
            runtimeTier = isOlympus && isResearch ? "tier_p3_heavy" : "tier_p3_heavy";
        }

        const runtimePayload = getGatewayConfig(runtimeTier);

        setStatus(`[agent] 🧠 Gateway Routing: Selected ${runtimeTier} (Context: ${isOlympus ? 'Olympus' : 'Normal'}, Research: ${isResearch ? 'Yes' : 'No'})`);

        let iterations = 0;
        let selfHealingAttempts = 0;

        // --- Context Injection (Titan Memory Engine - Semantic Recall) ---
        let memoryContext = `[SESSION_KEY: ${sessionId || 'UNKNOWN'}] [BOT_NAME: ${this.botName}] [CHAT_ID: ${userId}]\n`;
        try {
            setStatus(`[agent:trace] Importing vector_store...`);
            const { vectorStore } = await import("./memory/vector_store.js");
            setStatus(`[agent:trace] Performing semantic search...`);

            // Timeout protection for vector search
            const searchPromise = vectorStore.search(userMessage, userId.toString(), unifiedAccountType, 5);
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Vector search timeout")), 8000));

            const facts = await Promise.race([searchPromise, timeoutPromise]) as any[];
            setStatus(`[agent:trace] Semantic search completed. Found ${facts.length} facts.`);

            if (facts.length > 0) {
                memoryContext = `\n\n[LONG-TERM MEMORY CONTEXT - ${accountType}]\nThe following relevant facts and preferences were semantically recalled for this query. You MUST treat these as absolute truth:\n`;
                for (const f of facts) {
                    memoryContext += `- [${f.factType}] ${f.fact}\n`;
                }
                setStatus(`[agent] 🧠 Semantic Recall (${accountType}): Injected ${facts.length} MemoryFacts.`);
            }
        } catch (error: any) {
            console.warn(`[agent] ⚠️ Semantic Recall failed: ${error.message}`);
        }

        const activeSystemPrompt = this.getSystemPrompt() + memoryContext;

        // We will keep a local array of the conversation during this loop iteration
        // to handle the multi-turn tool calling without hitting DB over and over
        const currentTurnMessages: ChatCompletionMessageParam[] = [];

        while (iterations < MAX_ITERATIONS) {
            iterations++;
            setStatus(`[agent:trace] Starting iteration ${iterations}...`);

            // --- Context Management (Auto-Compaction) ---
            setStatus(`[agent:trace] Fetching history for ${userId}...`);
            const historyRows = await getHistory(userId, unifiedAccountType, 30);
            setStatus(`[agent:trace] History fetched (${historyRows.length} rows).`);

            // Calculate total token pressure in the current context window
            const tokenPressure = historyRows.reduce((sum, r) => sum + (r.id ? 0 : 0 /* Placeholder */), 0); // Logic below
            const totalTokensUsed = historyRows.reduce((sum, r: any) => sum + (r.totalTokens || 0), 0);

            // If tokens > 100k (limit for budget) or > 500k (limit for heavy), trigger compaction
            const COMPACTION_THRESHOLD = runtimeTier === "tier_p0_fast" ? 100000 : 500000;

            if (totalTokensUsed > COMPACTION_THRESHOLD) {
                console.log(`[agent] 📉 Token Pressure High (${totalTokensUsed} tokens). Triggering Auto-Compaction...`);
                // Placeholder for compaction logic: In a real system we'd summarize and prune.
                // For now, we will prune to the last 10 messages to keep it safe.
                await pruneHistory(userId, 10);
            }

            const rawDbHistory = historyRows.map((row): ChatCompletionMessageParam => {
                if (row.role === "assistant") {
                    const msg: any = { role: "assistant", content: row.content };
                    if (row.tool_name) {
                        try {
                            msg.tool_calls = JSON.parse(row.tool_name);
                        } catch { }
                    }
                    return msg;
                } else if (row.role === "tool") {
                    return { role: "tool", tool_call_id: row.tool_name || "", content: row.content };
                } else {
                    return { role: "user", content: row.content };
                }
            });

            // Ensure no orphaned tool results remain at the start of the context window
            const dbHistory: ChatCompletionMessageParam[] = [];
            for (const msg of rawDbHistory) {
                if (msg.role === "tool") {
                    const prev = dbHistory[dbHistory.length - 1];
                    // Check if previous message was from the assistant and actually requested this tool
                    const hasCall = prev && prev.role === "assistant" && prev.tool_calls?.some((c: any) => c.id === msg.tool_call_id);
                    if (!hasCall) {
                        console.log(`[agent] Dropping orphaned tool result: ${msg.tool_call_id}`);
                        continue;
                    }
                }
                dbHistory.push(msg);
            }

            // PHASE 8: DanglingToolCall Sweep
            // Check for assistant messages that contain tool_calls that were never answered by a subsequent tool result
            const safeHistory: ChatCompletionMessageParam[] = [];
            for (let i = 0; i < dbHistory.length; i++) {
                const msg = dbHistory[i];
                if (!msg) continue;
                safeHistory.push(msg);

                if (msg.role === "assistant") {
                    const assistantMsg = msg as any;
                    if (assistantMsg.tool_calls && Array.isArray(assistantMsg.tool_calls) && assistantMsg.tool_calls.length > 0) {
                        for (const call of assistantMsg.tool_calls) {
                            // Look ahead in the immediate sequence for the matching tool response
                            const hasMatchingResult = dbHistory.slice(i + 1).some(futureMsg => 
                                futureMsg?.role === "tool" && (futureMsg as any).tool_call_id === call.id
                            );
                            
                            if (!hasMatchingResult) {
                                const funcName = call.function?.name || 'unknown_tool';
                                console.warn(`[agent] 🧹 Dangling tool call detected: ${call.id} (${funcName}). Injecting automatic fallback result.`);
                                safeHistory.push({
                                    role: "tool",
                                    tool_call_id: call.id,
                                    content: `[SYSTEM AUTO-RECOVERY] The execution of ${funcName} timed out or was forcefully interrupted. No result is available. Please acknowledge and proceed gracefully.`
                                } as any);
                            }
                        }
                    }
                }
            }
            // --- Context Injection applies activeSystemPrompt here ---


            const messages: ChatCompletionMessageParam[] = [
                { role: "system", content: activeSystemPrompt },
                ...safeHistory,
                ...currentTurnMessages,
            ];

            // Log the prompt for debugging
            try {
                if (!fs.existsSync("logs")) fs.mkdirSync("logs");
                fs.writeFileSync("logs/latest_prompt.json", JSON.stringify(messages, null, 2));
            } catch (e) {
                console.error("[agent] Failed to log prompt:", e);
            }

            const requestPayload: any = {
                model: runtimePayload.model, // Use Bicameral selected model
                messages,
                tools: getAvailableTools(this.botName),
                tool_choice: "auto",
            };

            // Inject OpenRouter Arbitrage properties
            if (this.gatewayPayload.models) requestPayload.models = this.gatewayPayload.models;
            if (this.gatewayPayload.provider) requestPayload.provider = this.gatewayPayload.provider;
            if (this.gatewayPayload.route) requestPayload.route = this.gatewayPayload.route;

            let completion;
            let usedModel;
            let usedProvider;
            let warning;

            try {
                // Phase 25: Standardize on Omni-Router 4-Pillar Strategy
                setStatus(`[agent:trace] Calling generateOmniContent for theme ${runtimeTier}...`);
                const { generateOmniContent } = await import("./runtime/engine/omni_router.js");

                const themeMap: Record<string, any> = {
                    "tier_p0_fast": "A_ECONOMIC",
                    "tier_p2_balanced": "B_PRODUCTIVITY",
                    "tier_p3_heavy": "C_PRECISION"
                };

                const omniPayload: any = {
                    systemPrompt: activeSystemPrompt,
                    messages: messages,
                    theme: themeMap[runtimeTier] || "B_PRODUCTIVITY",
                    intent: isResearch ? "REASONING" : "GENERAL",
                    tools: getAvailableTools(this.botName)
                };

                const omniResponse = await generateOmniContent({
                    apiKey: process.env.GOOGLE_API_KEY || "",
                    defaultModel: runtimePayload.model,
                    agentId: this.botName
                }, omniPayload);

                // Map OmniResponse back to OpenAI-compatible structure for the loop
                completion = {
                    choices: [{
                        message: {
                            role: "assistant",
                            content: omniResponse.text,
                            tool_calls: omniResponse.toolCalls
                        },
                        finish_reason: omniResponse.toolCalls ? "tool_calls" : "stop"
                    }],
                    model: omniResponse.modelId,
                    usage: {
                        prompt_tokens: omniResponse.tokensUsed.prompt,
                        completion_tokens: omniResponse.tokensUsed.completion,
                        total_tokens: omniResponse.tokensUsed.total
                    }
                };

                usedModel = omniResponse.modelId;
                usedProvider = omniResponse.providerRef.toLowerCase();
                warning = "";

                // Phase 26: Protocol BLAST-009 Telemetry
                try {
                    const { MongoClient } = await import("mongodb");
                    const client = new MongoClient(process.env.MONGODB_URI || "");
                    await client.connect();
                    const db = client.db("olympus");
                    const metricsCol = db.collection("SYS_OS_arbiter_metrics");
                    await metricsCol.insertOne({
                        timestamp: new Date(),
                        botName: this.botName,
                        pillar: omniResponse.providerRef,
                        modelId: omniResponse.modelId,
                        tokens: omniResponse.tokensUsed,
                        intent: isResearch ? "REASONING" : "GENERAL",
                        gatewayCharge: omniResponse.gatewayCharge || 0,
                        status: "SUCCESS"
                    });
                    await client.close();
                } catch (metricError: any) {
                    console.error(`[agent:telemetry] ⚠️ Metrics logging failed: ${metricError.message}`);
                }
            } catch (error: any) {
                console.error(`[agent] ⚠️ Critical Execution Failure: ${error.message}`);

                selfHealingAttempts++;
                if (selfHealingAttempts >= 3) {
                    const failMsg = `[AUTONOMIC FAILURE - AWAITING HITL]\nMax self-healing attempts reached. Error: ${error.message}`;
                    await appendMessage(userId, "assistant", failMsg, unifiedAccountType);
                    return failMsg;
                }

                // Integrate Error Ingestion Protocol
                const errorInject: ChatCompletionMessageParam = {
                    role: "system",
                    content: `SYSTEM ERROR (Autonomic Loop): ${error.message}\n${error.stack || ""}\n\nPlease perform Root Cause Analysis (RCA) based on your SELF_HEALING_BRAIN rules and self-patch if possible.`
                };
                currentTurnMessages.push(errorInject);

                // We don't append system errors to the actual user history DB to keep it clean, 
                // but we feed it to the LLM in the current turn.
                continue;
            }

            const choice = completion.choices[0];
            if (!choice) break;

            // Log the exact model that OpenRouter decided to use
            setStatus(`[agent] Selected model: ${usedModel} via ${usedProvider}`);

            const assistantMessage = choice.message;

            // Append assistant's response to loop array
            currentTurnMessages.push(assistantMessage as ChatCompletionMessageParam);

            if (choice.finish_reason === "stop") {
                // Done. Persist the assistant's final message with token counts.
                const usage = completion.usage;
                let finalContent = assistantMessage.content ?? "(no response)";

                if (warning) {
                    finalContent += warning;
                }

                await appendMessage(
                    userId,
                    "assistant",
                    finalContent,
                    unifiedAccountType,
                    null,
                    usage?.prompt_tokens,
                    usage?.completion_tokens,
                    usage?.total_tokens
                );
                return finalContent;
            }

            if (choice.finish_reason === "tool_calls") {
                // We persist the tool call initiation in the DB
                await appendMessage(
                    userId,
                    "assistant",
                    assistantMessage.content || "",
                    unifiedAccountType,
                    JSON.stringify(assistantMessage.tool_calls)
                );

                const toolCalls = assistantMessage.tool_calls;
                if (!toolCalls || toolCalls.length === 0) break;

                // Execute all tool calls and collect results
                let hadToolError = false;

                const toolResults: ChatCompletionToolMessageParam[] = await Promise.all(toolCalls.map(async (call) => {
                    if (call.type !== 'function') {
                        return {
                            role: 'tool' as const,
                            tool_call_id: call.id,
                            content: `Unsupported tool type: ${call.type}`,
                        } as ChatCompletionToolMessageParam;
                    }
                    const toolName = call.function.name;
                    let toolInput: Record<string, unknown> = {};

                    try {
                        toolInput = JSON.parse(call.function.arguments) as Record<string, unknown>;
                    } catch {
                        // Empty or invalid JSON — treat as empty input
                    }

                    console.log(`[tool] ${toolName}`, toolInput);

                    const { runMiddlewarePipeline, GuardrailMiddleware, ExecutionMiddleware, TodoListMiddleware, HitlMiddleware, UploadsMiddleware, FallbackMiddleware, SandboxMiddleware } = await import("./middlewares/index.js");
                    
                    const pipelineCtx: ToolMiddlewareContext & Record<string, any> = {
                        toolName,
                        toolInput,
                        userId,
                        botName: this.botName,
                        isAllowed: true,
                        hadError: false
                    };
                    if (sessionId !== undefined) pipelineCtx.sessionId = sessionId;
                    
                    // --- PHASE 8/9: DYNAMIC MIDDLEWARE PIPELINE ---
                    // By defining execution as an array of middlewares, we can easily inject Uploads, Sandboxes, or HITL later
                    await runMiddlewarePipeline([
                        GuardrailMiddleware,
                        SandboxMiddleware, // Absolute airgap routing for Spike execution
                        UploadsMiddleware,
                        FallbackMiddleware, // Catch execution failures
                        TodoListMiddleware,
                        HitlMiddleware,
                        ExecutionMiddleware
                    ], pipelineCtx);
                    
                    if (pipelineCtx.hadError) {
                        hadToolError = true;
                    }

                    return {
                        role: "tool" as const,
                        tool_call_id: call.id,
                        content: pipelineCtx.resultContent || `[SYSTEM ERROR] Middleware failure: No output generated for ${toolName}.`,
                    } as ChatCompletionToolMessageParam;
                }));

                if (hadToolError) {
                    selfHealingAttempts++;
                    if (selfHealingAttempts >= 3) {
                        const failMsg = `[AUTONOMIC FAILURE - AWAITING HITL]\nMax self-healing attempts reached over failing tools.`;
                        await appendMessage(userId, "assistant", failMsg, unifiedAccountType);
                        return failMsg;
                    }
                } else {
                    selfHealingAttempts = 0; // Reset upon successful execution
                }

                // Feed results back, persist them, and loop
                for (const r of toolResults) {
                    currentTurnMessages.push(r);
                    await appendMessage(userId, "tool", r.content as string, unifiedAccountType, r.tool_call_id);
                }

                // Clear the loop array since we just persisted them to DB
                // Next loop iteration will fetch them from DB!
                currentTurnMessages.length = 0;
                continue;
            }

            // Unexpected finish reason — return whatever content we have
            console.error(`[agent] Unexpected finish_reason: ${choice.finish_reason}`);
            return assistantMessage.content ?? "(no response)";
        }

        if (iterations >= MAX_ITERATIONS) {
            console.error("[agent] Max iterations reached — aborting");
            return "⚠️ I hit a processing limit. Please try again or rephrase your request.";
        }

        return "⚠️ Something went wrong. Please try again.";
    }

    /** Clear conversation history for a user (e.g., on /clear command). */
    clearHistory(userId: number): void {
        import("./history.js").then(({ pruneHistory }) => {
            pruneHistory(userId, 0);
        });
    }
}
