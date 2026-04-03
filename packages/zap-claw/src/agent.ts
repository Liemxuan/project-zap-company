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

export class AgentLoop {
    private readonly gatewayPayload: GatewayPayload;
    private readonly botName: string;
    private systemPromptCache: string | null = null;

    constructor(tier: GatewayTier = "tier_p3_heavy", botName: string = "ZapClaw") {
        this.botName = botName;
        this.gatewayPayload = getGatewayConfig(tier);
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

    async run(userId: number, userMessage: string | any[], accountType: string = "PERSONAL", sessionId?: string, onStatus?: (msg: string) => void, modelOverride?: string): Promise<string> {
        const setStatus = (msg: string) => {
            console.log(msg);
            if (onStatus) onStatus(msg);
        };
        // Append the user's message to DB with accountType and BOT identifier
        const unifiedAccountType = accountType.includes(":") || accountType === "OLYMPUS_SWARM" ? accountType : `${accountType}:${this.botName}`;
        
        const userMessageString = typeof userMessage === "string" ? userMessage : JSON.stringify(userMessage);
        const searchMessageContent = typeof userMessage === "string" ? userMessage : (userMessage.find(x => x.type === "text")?.text || "Multimodal Input");
        
        await appendMessage(userId, "user", userMessageString, unifiedAccountType);

        setStatus(`[agent] ⚙️ System check passed. Calculating reasoning tier for: "${searchMessageContent.slice(0, 40)}${searchMessageContent.length > 40 ? '...' : ''}"`);

        // --- Bicameral Brain Routing (Bicameral Execution) ---
        // Determine complexity: Simple pattern matching vs. Deep Reasoning
        const isOlympus = unifiedAccountType.includes("OLYMPUS");
        const isResearch = /research|analyze|blueprint|complex|architect|reason|logic|deep/i.test(searchMessageContent);

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
            const searchPromise = vectorStore.search(searchMessageContent, userId.toString(), unifiedAccountType, 5);
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

        // --- Context Management (Auto-Compaction) ---
        // NATIVE ROUTER UPGRADE: Fetch history ONCE per request, matching Rust memory architecture
        setStatus(`[agent:trace] Fetching history for ${userId}...`);
        const historyRows = await getHistory(userId, unifiedAccountType, 30);
        setStatus(`[agent:trace] History fetched (${historyRows.length} rows).`);

        // If tokens > 100k (limit for budget) or > 500k (limit for heavy), trigger compaction
        const COMPACTION_THRESHOLD = runtimeTier === "tier_p0_fast" ? 100000 : 500000;

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
                let parsedContent: string | any[] = row.content;
                try {
                    if (typeof row.content === "string" && row.content.trim().startsWith("[")) {
                        const parsed = JSON.parse(row.content);
                        if (Array.isArray(parsed)) parsedContent = parsed;
                    }
                } catch(e) {}
                return { role: "user", content: parsedContent as any };
            }
        });

        // Ensure no orphaned tool results remain at the start of the context window
        let dbHistory: ChatCompletionMessageParam[] = [];
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

        // --- NATIVE ROUTER (PRD-005): AUTO-COMPACTION BUILDER ---
        const totalTokensUsed = historyRows.reduce((sum, r: any) => sum + (r.totalTokens || 0), 0);
        if (totalTokensUsed > COMPACTION_THRESHOLD) {
            console.log(`[agent] 📉 Token Pressure High (${totalTokensUsed} tokens). Triggering Auto-Compaction...`);
            const keepCount = 10;
            if (dbHistory.length > keepCount) {
                const { buildContextSummary } = await import("./runtime/engine/compaction.js");
                const compactionCutoff = dbHistory.length - keepCount;
                
                const compactedMessages = dbHistory.slice(0, compactionCutoff);
                const summaryString = buildContextSummary(compactedMessages);
                
                // Truncate the history payload natively for the upcoming LLM context
                dbHistory = [
                    { role: "system", content: summaryString },
                    ...dbHistory.slice(compactionCutoff)
                ];
                
                // Fire async DB background prune to time-travel inject the summary 1000ms before oldest
                pruneHistory(userId, keepCount, summaryString, unifiedAccountType).catch(e => console.error("Prune error:", e));
            } else {
                pruneHistory(userId, keepCount).catch(e => console.error("Prune error:", e));
            }
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

        // We will keep a local array of the conversation during this loop iteration
        // to handle the multi-turn tool calling without hitting DB over and over
        const currentTurnMessages: ChatCompletionMessageParam[] = [];

        while (iterations < MAX_ITERATIONS) {
            iterations++;
            setStatus(`[agent:trace] Starting iteration ${iterations}...`);

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
                    tools: getAvailableTools(this.botName),
                    sessionId,
                    ...(modelOverride && { forceModel: true }),
                };

                const omniResponse = await generateOmniContent({
                    apiKey: "", // Let the router resolve the balanced key pool
                    defaultModel: modelOverride || runtimePayload.model,
                    agentId: "OLYMPUS" // Important: Maps to the 105-key infrastructure pool
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
                        sessionId: sessionId || null,
                        timestamp: new Date(),
                        botName: this.botName,
                        agentId: this.botName,
                        pillar: omniResponse.providerRef,
                        provider: omniResponse.providerRef,
                        accountLevel: "STANDARD",
                        projectId: "default",
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

                // --- DeerFlow Context Engineering: Title Auto-Gen ---
                // On first assistant response in a session, generate a thread title
                if (iterations === 1 && sessionId) {
                    (async () => {
                        try {
                            const { generateOmniContent } = await import("./runtime/engine/omni_router.js");
                            const titleResponse = await generateOmniContent({
                                apiKey: process.env.GOOGLE_API_KEY || "",
                                defaultModel: "gemini-2.5-flash",
                                agentId: "system"
                            }, {
                                systemPrompt: "Generate a concise thread title (max 6 words, no quotes). Respond with ONLY the title.",
                                messages: [{ role: "user", content: userMessage as any }],
                                theme: "A_ECONOMIC",
                                intent: "FAST_CHAT"
                            });
                            if (titleResponse.text) {
                                const { MongoClient } = await import("mongodb");
                                const client = new MongoClient(process.env.MONGODB_URI || "");
                                await client.connect();
                                const db = client.db("olympus");
                                await db.collection("SYS_OS_session_titles").updateOne(
                                    { sessionId },
                                    { $set: { title: titleResponse.text.trim().slice(0, 60), updatedAt: new Date() } },
                                    { upsert: true }
                                );
                                await client.close();
                            }
                        } catch (e: any) {
                            console.warn(`[agent:title] Title generation failed: ${e.message}`);
                        }
                    })();
                }

                // --- DeerFlow Context Engineering: Follow-up Suggestions ---
                // After every final response, generate 3 next-step suggestions and store for the frontend
                if (sessionId) {
                    (async () => {
                        try {
                            const { generateOmniContent } = await import("./runtime/engine/omni_router.js");
                            const followupResponse = await generateOmniContent({
                                apiKey: process.env.GOOGLE_API_KEY || "",
                                defaultModel: "gemini-2.5-flash",
                                agentId: "system"
                            }, {
                                systemPrompt: "Generate 3 short follow-up question suggestions (max 10 words each) the user might want to ask next. Respond with ONLY a JSON array of strings, e.g. [\"Question 1?\",\"Question 2?\",\"Question 3?\"]",
                                messages: [
                                    { role: "user", content: userMessage as any },
                                    { role: "assistant", content: finalContent }
                                ],
                                theme: "A_ECONOMIC",
                                intent: "FAST_CHAT"
                            });
                            if (followupResponse.text) {
                                let suggestions: string[] = [];
                                try {
                                    const raw = followupResponse.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
                                    suggestions = JSON.parse(raw);
                                } catch { suggestions = []; }
                                if (suggestions.length > 0) {
                                    const { MongoClient } = await import("mongodb");
                                    const client = new MongoClient(process.env.MONGODB_URI || "");
                                    await client.connect();
                                    const db = client.db("olympus");
                                    await db.collection("SYS_OS_followup_suggestions").updateOne(
                                        { sessionId },
                                        { $set: { suggestions: suggestions.slice(0, 3), updatedAt: new Date(), userId } },
                                        { upsert: true }
                                    );
                                    await client.close();
                                }
                            }
                        } catch (e: any) {
                            console.warn(`[agent:followup] Follow-up generation failed: ${e.message}`);
                        }
                    })();
                }

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

                const toolResults: ChatCompletionToolMessageParam[] = [];

                for (const call of toolCalls) {
                    if (call.type !== 'function') {
                        toolResults.push({
                            role: 'tool' as const,
                            tool_call_id: call.id,
                            content: `Unsupported tool type: ${call.type}`,
                        } as ChatCompletionToolMessageParam);
                        continue;
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
                    
                    // --- NATIVE ROUTER (PRD-005): CLAW-CODE RUST LOOP PATTERN ---
                    const { HookRunner, PermissionPolicy, mergeHookFeedback } = await import("./runtime/engine/hook_runner.js");
                    const runner = new HookRunner();
                    const policy = new PermissionPolicy();
                    
                    const hookResult = await runner.runPreToolUse(toolName, toolInput);
                    const effectiveInput = hookResult.updatedInput ?? toolInput;
                    
                    const permissionCtx: any = { };
                    if (hookResult.permissionOverride) permissionCtx.override = hookResult.permissionOverride;
                    if (hookResult.permissionReason) permissionCtx.reason = hookResult.permissionReason;

                    const permissionOutcome = await policy.authorize(toolName, effectiveInput, permissionCtx);

                    if (permissionOutcome.outcome === "DENY") {
                        pipelineCtx.resultContent = mergeHookFeedback(
                            hookResult.messages, 
                            `[SYSTEM] Execution denied by Permission Policy: ${permissionOutcome.reason}`, 
                            true
                        );
                        pipelineCtx.hadError = true;
                        pipelineCtx.isAllowed = false;
                    } 

                    // --- PHASE 8/9: DYNAMIC MIDDLEWARE PIPELINE ---
                    if (pipelineCtx.isAllowed) {
                        await runMiddlewarePipeline([
                            GuardrailMiddleware,
                            SandboxMiddleware, // Absolute airgap routing for Spike execution
                            UploadsMiddleware,
                            FallbackMiddleware, // Catch execution failures
                            TodoListMiddleware,
                            HitlMiddleware,
                            ExecutionMiddleware
                        ], pipelineCtx);
                        
                        // Merge pre-flight hook feedback into output immediately following Rust loop semantics
                        pipelineCtx.resultContent = mergeHookFeedback(
                            hookResult.messages, 
                            pipelineCtx.resultContent || "", 
                            false
                        );
                    }

                    const hookOutput = pipelineCtx.resultContent || "";
                    const postHook = pipelineCtx.hadError 
                        ? await runner.runPostToolUseFailure(toolName, effectiveInput, hookOutput)
                        : await runner.runPostToolUse(toolName, effectiveInput, hookOutput, false);

                    if (postHook.messages.length > 0) {
                        pipelineCtx.resultContent = mergeHookFeedback(
                            postHook.messages, 
                            hookOutput, 
                            pipelineCtx.hadError || false
                        );
                    }
                    
                    if (pipelineCtx.hadError) {
                        hadToolError = true;
                    }

                    toolResults.push({
                        role: "tool" as const,
                        tool_call_id: call.id,
                        content: pipelineCtx.resultContent || `[SYSTEM ERROR] Middleware failure: No output generated for ${toolName}.`,
                    } as ChatCompletionToolMessageParam);
                }

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

                // NATIVE ROUTER UPGRADE: Do not clear array, we retain history in-memory 
                // exactly like the Rust runtime `session.messages` to avoid DB thrashing.
                // currentTurnMessages retains the appended context naturally.
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
