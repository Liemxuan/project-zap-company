import "dotenv/config";
import * as http from "http";
import { getGatewayConfig, type GatewayTier } from "./gateway.js";
import { executeWithArbitrage, janitorScan } from "./arbitrage.js";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "zap-claw";
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === "/api/memory/extract" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                const text = payload.text || "";
                const config = payload.config || {};

                // Map the python script's tier name slightly
                let explicitTier: GatewayTier = (config.tier === "Tier1-Budget" ? "tier_p0_fast" : "tier_p0_fast") as GatewayTier;
                if (config.tier === "Tier3-Heavy") explicitTier = "tier_p3_heavy";

                // Grab the routing config from the arbitrage matrix
                const gatewayConfig = getGatewayConfig(explicitTier);

                // Construct the payload for OpenRouter
                const requestPayload: any = {
                    model: gatewayConfig.model,
                    messages: [
                        { role: "system", content: "You are the Ralph Loop extraction process. Extract factual memory from the user's text. Return valid JSON only." },
                        { role: "user", content: `<user_data>${text}</user_data>` }
                    ]
                };

                if (gatewayConfig.provider) requestPayload.provider = gatewayConfig.provider;
                if (gatewayConfig.route) requestPayload.route = gatewayConfig.route;

                // --- Context Injection (Phase 2) ---
                let memoryContext = "";
                let mongoClient: MongoClient | null = null;
                // Defaulting to "UNKNOWN_MERCHANT" for now since the API doesn't pass a strong userId yet
                const merchantId = payload.merchantId || "UNKNOWN_MERCHANT";

                try {
                    mongoClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
                    await mongoClient.connect();
                    const db = mongoClient.db(DB_NAME);
                    const collection = db.collection("merchant_memory");

                    const facts = await collection.find({ merchantId }).sort({ createdAt: -1 }).toArray();

                    if (facts.length > 0) {
                        memoryContext = "\n\n[LONG-TERM MEMORY CONTEXT]\nThe following validated facts and preferences were previously recorded for this user. You MUST treat these as absolute truth:\n";
                        for (const f of facts) {
                            memoryContext += `- [${f.factType}] ${f.fact}\n`;
                        }
                    }
                } catch (error: any) {
                    console.warn(`[api] ⚠️ Failed to fetch MongoDB MemoryFacts for merchant ${merchantId}. Proceeding without long-term context. Error: ${error.message}`);
                } finally {
                    if (mongoClient) {
                        await mongoClient.close();
                    }
                }

                const baseSystemPrompt = "You are the Ralph Loop extraction process. Extract factual memory from the user's text. Return valid JSON only.";
                const activeSystemPrompt = baseSystemPrompt + memoryContext;

                // Update the OpenRouter request payload as well
                requestPayload.messages[0].content = activeSystemPrompt;
                
                // --- Janitor Pipeline (Priority 2) ---
                const untrustedPayload = `[UNTRUSTED_MERCHANT_DATA]\n${text}`;
                requestPayload.messages[1].content = `<user_data>${untrustedPayload}</user_data>`;
                
                const securityResult = await janitorScan(text);
                if (!securityResult.safe) {
                    res.writeHead(403, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: "Security Alert: Prompt Injection or Malicious Content Detected",
                        reason: securityResult.reason 
                    }));
                    return;
                }

                if (explicitTier === ("tier_p3_heavy" as GatewayTier)) {
                    const { createCase, updateCaseStatus } = await import("./case_manager.js");
                    const caseId = await createCase(merchantId, 3, { text, tier: explicitTier });
                    
                    res.writeHead(202, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: "Request accepted for deep processing",
                        caseId 
                    }));

                    // Process in background
                    (async () => {
                        try {
                            await updateCaseStatus(caseId, "PROCESSING");
                            const { completion } = await executeWithArbitrage(requestPayload, gatewayConfig);
                            await updateCaseStatus(caseId, "COMPLETED", completion);
                        } catch (err: any) {
                            await updateCaseStatus(caseId, "FAILED", null, err.message);
                        }
                    })();
                    return;
                }

                const start = Date.now();

                const { completion, usedModel, usedProvider } = await executeWithArbitrage(
                    requestPayload,
                    gatewayConfig
                );

                const latency = Date.now() - start;

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    latency_ms: latency,
                    routed_model: usedModel,
                    routed_provider: usedProvider,
                    cached: completion.usage?.prompt_tokens_details?.cached_tokens ?? 0,
                    data: completion.choices[0]?.message.content
                }));
            } catch (error: any) {
                console.error("[api] Error processing extraction:", error.message);

                // Forward the 429 status code if OpenRouter hit a wall that wasn't caught by fallbacks
                let statusCode = 500;
                if (error.status === 429) statusCode = 429;

                res.writeHead(statusCode, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Endpoint not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Zap Claw Gateway API listening on port ${PORT}`);
    console.log(`   Endpoint: POST http://localhost:${PORT}/api/memory/extract`);
});
