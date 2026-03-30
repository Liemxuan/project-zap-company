import express from 'express';
import { Redis } from 'ioredis';
import bodyParser from 'body-parser';
import cors from 'cors';
import { handleTelegramWebhook as legacyTelegramWebhook } from './platforms/telegram.js';
import { handleTelegramWebhook as nativeTelegramWebhook } from './runtime/router/inbound.js';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import morgan from 'morgan';
import { mountMemoryRoutes } from './lib/memory_routes.js';
import { SafeExecutor } from './security/safe-executor.js';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3900;

// Middleware to parse incoming JSON bodies
app.use(cors());
// SOP-033: Exclude webhook/payment from global JSON parsing to allow Stripe signature validation
app.use('/webhook/payment', bodyParser.raw({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(morgan('dev'));

import { syncRouter } from './api/sync_routes.js';
import { webhookRouter } from './api/webhooks.js';
import { inventoryRouter } from './api/inventory_routes.js';
import { startSyncWorker } from './workers/sync_drain_worker.js';

app.use(syncRouter);
app.use(webhookRouter);
app.use(inventoryRouter);

// Start the background worker (this runs asynchronously and loops continuously in the background)
startSyncWorker().catch(err => console.error("Sync Worker threw unhandled error:", err));

// Serve the static frontend Web Dashboards from the /public directory
app.use(express.static('public'));

// Mount Memory v2 + Heartbeat
mountMemoryRoutes(app, { name: 'gateway', role: 'API Gateway', port: parseInt(PORT as string) || 3001 });

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

console.log("==========================================");
console.log(" ZAP CLAW - LIVE HTTP GATEWAY");
console.log("==========================================\n");

// Healthcheck / Browser friendly endpoint
app.get('/webhook/telegram', (req, res) => {
    res.status(200).send("✅ ZAP OS Webhook is active and listening for POST requests.");
});

// ==========================================
// PHASE 19: BYOK DASHBOARD API ENDPOINTS
// ==========================================

const AdminKeysSchema = z.object({
    tenantId: z.string().max(250),
    llmConfig: z.object({ provider: z.string().max(100) }).passthrough(),
    searchConfig: z.object({
        provider: z.enum(['InfoQuest', 'Brave', 'Perplexity']).default('InfoQuest'),
        infoQuestApiKey: z.string().optional(),
        braveApiKey: z.string().optional(),
        perplexityApiKey: z.string().optional()
    }).optional()
});

// 1. Admin Titan Registry
app.post('/api/admin/keys', async (req, res) => {
    const parse = AdminKeysSchema.safeParse(req.body);
    if (!parse.success) {
        res.status(400).json({ error: "Missing required fields or invalid payload lengths." });
        return;
    }
    const { tenantId, llmConfig, searchConfig } = parse.data;

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const settingsCol = db.collection(`SYS_OS_settings`);
        
        const updatePayload: any = { llmConfig };
        if (searchConfig) {
            updatePayload.searchConfig = searchConfig;
        }

        const result = await settingsCol.updateOne(
            { tenantId: tenantId },
            { $set: updatePayload },
            { upsert: true }
        );

        res.status(200).json({ message: `Tenant [${tenantId}] API Keys updated successfully.` });
    } catch (e: any) {
        console.error("[API Admin] Error:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

// 2. Customer BYOK Registry
app.post('/api/customer/byok', async (req, res) => {
    const { agentId, llmConfig } = req.body;
    if (!agentId || !llmConfig || !llmConfig.provider) {
        res.status(400).json({ error: "Missing required fields." });
        return;
    }

    // Extract Tenant ID from the specific Agent ID naming convention (e.g. AGNT-ZVN-TOM -> ZVN)
    const parts = agentId.split('-');
    if (parts.length < 3) {
        res.status(400).json({ error: "Invalid Agent ID format." });
        return;
    }
    const tenantIdSubstring = parts[1];

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const usersCol = db.collection(`SYS_OS_users`);
        const result = await usersCol.updateOne(
            { assignedAgentId: agentId },
            { $set: { llmConfig: llmConfig } }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ error: "Assigned Agent ID not found in system." });
        } else {
            res.status(200).json({ message: "Personal API Profile updated successfully." });
        }
    } catch (e: any) {
        console.error("[API Customer] Error:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

// ==========================================
// 3. Dynamic Global Models Endpoint
// ==========================================
app.get('/api/models', async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const modelsCol = db.collection(`SYS_OS_global_models`);

        const modelsDoc = await modelsCol.findOne({ _id: "global_registry" as any });

        if (modelsDoc && modelsDoc.providers) {
            const providers = modelsDoc.providers;
            const overrides = modelsDoc.overrides || {};

            // Phase 21: Merge manual overrides into the dynamically synced providers list
            for (const [key, overrideData] of Object.entries(overrides)) {
                // key format: "PROVIDER:model-id", e.g. "OLLAMA:deepseek-r1-local"
                const [providerName, ...modelIdParts] = key.split(':');
                if (!providerName) continue;

                const modelId = modelIdParts.join(':');

                if (providers[providerName]) {
                    const existingIndex = providers[providerName].findIndex((m: any) => m.id === modelId);
                    if (existingIndex !== -1) {
                        // Apply overrides to existing synced model
                        providers[providerName][existingIndex] = {
                            ...providers[providerName][existingIndex],
                            ...(overrideData as any)
                        };
                    } else {
                        // Inject newly defined manual model (e.g. local offline Ollama model)
                        providers[providerName].push(overrideData);
                    }
                }
            }
            res.status(200).json(providers);
        } else {
            // Fallback immediately if daemon hasn't synced yet
            res.status(200).json({
                GOOGLE: [{ id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' }, { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' }],
                OPENROUTER: [{ id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }],
                OLLAMA: [{ id: 'llama3:latest', name: 'Llama 3' }]
            });
        }
    } catch (e: any) {
        console.error("[API Models] Error fetching global models array:", e);
        res.status(500).json({ error: "Failed to load models list." });
    } finally {
        await client.close();
    }
});

// ==========================================
// Phase 21: Manual Model Override Endpoint
// ==========================================
app.post('/api/admin/models', async (req, res) => {
    const { provider, id, name, contextLength, overrideTPM, overrideRPD } = req.body;

    if (!provider || !id || !name) {
        res.status(400).json({ error: "Provider, Model ID, and Name are required." });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const modelsCol = db.collection(`SYS_OS_global_models`);

        const overrideKey = `overrides.${provider}:${id}`;

        const overridePayload = {
            id,
            name,
            ...(contextLength && { contextLength: parseInt(contextLength, 10) }),
            ...(overrideTPM && { overrideTPM: parseInt(overrideTPM, 10) }),
            ...(overrideRPD && { overrideRPD: parseInt(overrideRPD, 10) })
        };

        // Inject the manual override into the overrides dictionary
        // This is protected from sync_models.ts because the daemon only uses $set { providers, lastSyncedAt }
        await modelsCol.updateOne(
            { _id: "global_registry" as any },
            { $set: { [overrideKey]: overridePayload } },
            { upsert: true }
        );

        res.status(200).json({ message: `Model Override [${id}] saved successfully.` });
    } catch (e: any) {
        console.error("[API Admin Models] Error saving model override:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

// ==========================================
// Phase 23: Gateway Management System
// ==========================================
app.get('/api/admin/gateways', async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const gatewaysCol = db.collection(`SYS_OS_gateways`);

        const gateways = await gatewaysCol.find({}).toArray();
        res.status(200).json(gateways);
    } catch (e: any) {
        console.error("[API Admin Gateways] Error fetching gateways:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

app.post('/api/admin/gateways', async (req, res) => {
    const { gatewayId, tenantId, boundAgentId, type, role, modelSource, status } = req.body;

    if (!gatewayId || !tenantId || !boundAgentId || !type || !role || !modelSource || !status) {
        res.status(400).json({ error: "Missing required fields." });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const gatewaysCol = db.collection(`SYS_OS_gateways`);

        const payload = {
            gatewayId,
            tenantId,
            boundAgentId,
            type,
            role,
            modelSource,
            status,
            lastUpdated: new Date().toISOString()
        };

        await gatewaysCol.updateOne(
            { gatewayId: gatewayId },
            { $set: payload },
            { upsert: true }
        );

        res.status(200).json({ message: `Gateway [${gatewayId}] saved successfully.` });
    } catch (e: any) {
        console.error("[API Admin Gateways] Error saving gateway:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

// ==========================================
// Phase 24: Infrastructure Registry & Dashboard
// ==========================================
app.get('/api/admin/infra-registry', async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const infraCol = db.collection(`SYS_OS_infra_keys`);

        const dbKeys = await infraCol.find({}).toArray();
        const dbMap = Object.fromEntries(dbKeys.map(k => [k.name, k]));

        const registry = [
            { name: "PRECISION_GATEWAY", provider: "GOOGLE", env: "GOOGLE_ULTRA_API_KEY" },
            { name: "INTERNAL_COMMANDER", provider: "GOOGLE", env: "GOOGLE_COMMANDER_API_KEY" },
            { name: "CODE_WORKFORCE", provider: "GOOGLE", env: "GOOGLE_PRO_API_KEY" },
            { name: "SCOUT_RESEARCH", provider: "GOOGLE", env: "GOOGLE_SCOUT_API_KEY" },
            { name: "FRONTIER_BRIDGE", provider: "OPENROUTER", env: "OPENROUTER_API_KEY" },
        ];

        const results = registry.map(item => {
            const envKey = process.env[item.env] || "";
            const dbItem = dbMap[item.name];

            const activeKey = (dbItem ? dbItem.apiKey : "") || envKey;
            const project = (dbItem ? dbItem.project : "") || (envKey ? "ZAP-ISOLATED-PRJ" : "N/A");

            return {
                name: item.name,
                provider: item.provider,
                project: project,
                status: activeKey ? "ACTIVE" : "MISSING",
                keyTail: activeKey ? `****${activeKey.slice(-4)}` : "BLANK"
            };
        });

        res.status(200).json(results);
    } catch (e) {
        res.status(500).json({ error: "Failed to load infra registry" });
    } finally {
        await client.close();
    }
});

app.post('/api/admin/infra-registry', async (req, res) => {
    const { name, project, apiKey } = req.body;
    console.log(`[Infra Registry] Received registration request for: ${name} (Project: ${project})`);

    if (!name || !apiKey) {
        console.warn("[Infra Registry] Missing required fields.");
        res.status(400).json({ error: "Name and API Key are required." });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const infraCol = db.collection(`SYS_OS_infra_keys`);

        const result = await infraCol.updateOne(
            { name: name },
            {
                $set: {
                    name,
                    project: project || "ZAP-PROJECT",
                    apiKey,
                    updatedAt: new Date().toISOString()
                }
            },
            { upsert: true }
        );

        res.status(200).json({ message: `Infrastructure key [${name}] updated successfully.` });
    } catch (e: any) {
        res.status(500).json({ error: "Database error while saving infra key" });
    } finally {
        await client.close();
    }
});

// ==========================================
// Phase 25: Brand Guidelines API
// ==========================================
app.get('/api/admin/brand', async (req, res) => {
    const { tenantId } = req.query;
    if (!tenantId) {
        res.status(400).json({ error: "Tenant ID is required." });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const brandCol = db.collection(`SYS_OS_brand_guidelines`);

        const doc = await brandCol.findOne({ tenantId: tenantId });

        if (!doc) {
            res.status(404).json({ error: "Brand guidelines not found." });
        } else {
            res.status(200).json(doc);
        }
    } catch (e: any) {
        console.error("[API Brand] Error fetching guidelines:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

app.post('/api/admin/brand', async (req, res) => {
    const { tenantId, status, vibe, principles, colors, fonts } = req.body;

    if (!tenantId) {
        res.status(400).json({ error: "Tenant ID is required." });
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const brandCol = db.collection(`SYS_OS_brand_guidelines`);

        const payload = {
            tenantId,
            status: status || 'active',
            vibe: vibe || '',
            principles: principles || '',
            colors: colors || [],
            fonts: fonts || [],
            updatedAt: new Date().toISOString()
        };

        await brandCol.updateOne(
            { tenantId: tenantId },
            { $set: payload },
            { upsert: true }
        );

        res.status(200).json({ message: `Brand guidelines for [${tenantId}] saved successfully.` });
    } catch (e: any) {
        console.error("[API Brand] Error saving guidelines:", e);
        res.status(500).json({ error: "Internal Database Error" });
    } finally {
        await client.close();
    }
});

// ==========================================
// 4. Live API Key Validation Endpoint
// ==========================================
// Accepts temporary credentials and fires a test payload via Omni-Router
app.post('/api/test-key', async (req, res) => {
    const { provider, defaultModel, apiKey } = req.body;

    if (!provider || !defaultModel) {
        res.status(400).json({ error: "Provider and model are required for validation." });
        return;
    }

    // Dynamic import to prevent circular dependencies if OmniRouter scales up
    const { generateOmniContent, getGlobalKeyFallback } = await import('./runtime/engine/omni_router.js');

    const config = {
        provider: provider as any,
        defaultModel: defaultModel,
        // Fallback to the Global ENV key only if the user didn't provide one (testing standard connection)
        apiKey: apiKey || getGlobalKeyFallback(provider)
    };

    const payload = {
        systemPrompt: "You are a network diagnostic tool. Reply with exactly the word 'ACK'.",
        messages: [{ role: "user" as const, content: "Ping" }],
        theme: "A_ECONOMIC" as const,
        intent: "FAST_CHAT" as const
    };

    try {
        const result = await generateOmniContent(config, payload);
        res.status(200).json({
            message: "Validation Successful",
            modelId: result.modelId,
            tokens: result.tokensUsed
        });
    } catch (e: any) {
        console.error("[API Test Key] Validation Error:", e);
        // Extract a clean error message if possible to show to the user
        const errorMessage = e.message || "Connection refused by the provider.";
        res.status(500).json({ error: errorMessage });
    }
});

// ==========================================
// TELEGRAM OMNI-CHANNEL WEBHOOK (PRJ-016: Native Router)
// ==========================================
// Native Olympus routing — bypasses OpenClaw entirely.
// Legacy handler preserved at /webhook/telegram/legacy for rollback.
app.post('/webhook/telegram', nativeTelegramWebhook);

app.post('/webhook/telegram/legacy', async (req, res) => {
    try {
        await legacyTelegramWebhook(req.body);
        res.status(200).send('OK');
    } catch (error) {
        console.error(`[Server API] 🚨 Legacy Telegram webhook error:`, error);
        res.status(500).send('Internal Server Error');
    }
});

const HUDChatSchema = z.object({
    userId: z.union([z.number(), z.string().transform(v => parseInt(v, 10))]).optional(),
    message: z.string().max(8000), // Protect against Token DoS
    botName: z.string().max(100).optional(),
    accountType: z.string().max(100).optional(),
});

// ==========================================
// ZAP SWARM CHAT HISTORY INGESTION
// ==========================================
app.get('/api/history/:sessionId', async (req, res) => {
    // allow CORS for Next.js dev server on :3000
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const sessionId = req.params.sessionId;
    
    // Dynamic import to avoid circular dependencies with Prisma/Redis connection flows if not needed
    try {
        const { getHistory } = await import('./history.js');
        const history = await getHistory(sessionId, req.query.accountType as string || "PERSONAL", 100);
        res.status(200).json({ success: true, history });
    } catch (e: any) {
        console.error("[History API] Error fetching history:", e);
        res.status(500).json({ error: e.message || "Failed to fetch chat history." });
    }
});

// Preflight CORS handler for /api/history
app.options('/api/history/:sessionId', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// ==========================================
// ZAP DESIGN HUD COMMAND INGESTION
// ==========================================
app.post('/api/hud/chat', async (req, res) => {
    // allow CORS for Next.js dev server on :3000
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const parse = HUDChatSchema.safeParse(req.body);
    if (!parse.success) {
        res.status(400).json({ error: "Missing required 'message' field or length exceeded (max 8000)." });
        return;
    }
    const { userId, message, botName, accountType } = parse.data;

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // ensure headers are sent early to start chunking
        res.flushHeaders?.();

        const { AgentLoop } = await import('./agent.js');
        const loop = new AgentLoop("tier_p3_heavy", botName || "Jerry");

        const onStatus = (msg: string) => {
            res.write(`data: ${JSON.stringify({ status: msg })}\n\n`);
        };

        const response = await loop.run(userId || 999999, message, accountType || "OLYMPUS_HUD", undefined, onStatus);

        res.write(`data: ${JSON.stringify({ reply: response })}\n\n`);
        res.end();
    } catch (e: any) {
        console.error("[HUD Chat API] Error processing HUD request:", e);
        res.write(`data: ${JSON.stringify({ error: e.message || "Failed to process HUD command." })}\n\n`);
        res.end();
    }
});

// ==========================================
// ZAP SWARM ASYNC COMMAND INGESTION
// ==========================================
app.post('/api/swarm/chat', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { sessionId, agentId, message, tenantId } = req.body;
    
    if (!sessionId || !agentId || !message) {
        res.status(400).json({ error: "Missing required fields." });
        return;
    }

    try {
        // Enqueue the job for frontend tracking
        const { MongoClient } = await import("mongodb");
        const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
        await client.connect();
        const db = client.db("olympus");
        const col = db.collection(`${tenantId || "ZVN"}_SYS_OS_job_queue`);
        
        const jobResult = await col.insertOne({
            status: "PENDING",
            queueName: "Queue-Short",
            priority: 0,
            tenantId: tenantId || "ZVN",
            sourceChannel: "SWARM",
            historyContext: { sessionId, assignedAgentId: agentId },
            payload: { messages: [{ role: "user", content: message }] },
            createdAt: new Date()
        });
        
        const jobId = jobResult.insertedId;
        await client.close();

        // Return immediately so the UI doesn't block
        res.status(200).json({ success: true, jobId, sessionId });

        // Kick off background execution
        setTimeout(async () => {
            try {
                const { AgentLoop } = await import('./agent.js');
                const loop = new AgentLoop("tier_p3_heavy", agentId);
                
                const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
                
                const onStatus = async (msg: string) => {
                    const formattedMsg = `> ⚙️ [system] ${msg}\r\n`;
                    await redis.rpush(`zap:trace:${sessionId}:logs`, formattedMsg);
                    await redis.publish(`zap:trace:${sessionId}`, formattedMsg);
                };

                await onStatus(`Agent ${agentId} assigned. Processing multi-modal request...`);
                
                const response = await loop.run(sessionId as any, message, "OLYMPUS_SWARM", sessionId, onStatus);

                const replyMsg = `> 🤖 [reply] ${response}\r\n`;
                await redis.rpush(`zap:trace:${sessionId}:logs`, replyMsg);
                await redis.publish(`zap:trace:${sessionId}`, replyMsg);
                
                // Mark job complete
                const updateClient = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
                await updateClient.connect();
                await updateClient.db("olympus").collection(`${tenantId || "ZVN"}_SYS_OS_job_queue`).updateOne(
                    { _id: jobId },
                    { $set: { status: "COMPLETED", completedAt: new Date() } }
                );
                await updateClient.close();
                redis.quit();
            } catch (err: any) {
                console.error("[Swarm Async] Background execution failed:", err);
            }
        }, 100);

    } catch (e: any) {
        console.error("[Swarm Chat API] Error processing swarm request:", e);
        res.status(500).json({ error: e.message || "Failed to process swarm command." });
    }
});

// Preflight CORS handler for /api/hud/chat
app.options('/api/hud/chat', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});


// ==========================================
// OLY-SWARM-002: Swarm Telemetry & HUD Endpoints
// ==========================================
app.get('/api/admin/heartbeat', async (req, res) => {
    try {
        const executor = new SafeExecutor({ allowedCommands: ['docker'] });
        let dockerStatus: any[] = [];
        let daemonAlive = false;
        
        const possiblePaths = [
            'docker',
            '/usr/local/bin/docker', 
            '/opt/homebrew/bin/docker', 
            '/Applications/Docker.app/Contents/Resources/bin/docker'
        ];
        
        for (const dockerPath of possiblePaths) {
            try {
                const { stdout } = await executor.execute(dockerPath, ['ps', '-a', '--format', '{{json .}}']);
                dockerStatus = stdout.split('\n').filter(Boolean).map((line: string) => JSON.parse(line));
                daemonAlive = true;
                break; // Stop trying if successful
            } catch (e) {
                continue;
            }
        }
        res.json({ status: 'ok', timestamp: new Date().toISOString(), agents: dockerStatus, daemonAlive });
    } catch (error: any) {
        res.status(500).json({ error: 'Heartbeat failed', details: error.message });
    }
});

app.get('/api/admin/swarm', async (req, res) => {
    try {
        const executor = new SafeExecutor({ allowedCommands: ['ps'] });
        let psOutput = '';
        try {
            const { stdout } = await executor.execute('ps', ['aux']);
            psOutput = stdout.split('\n').filter((line: string) => line.includes('node') || line.includes('bun')).join('\n');
        } catch(e) {}
        
        const zapNodes = [
            { id: 'athena', name: 'Athena', role: 'Data Logic' },
            { id: 'architect', name: 'Architect', role: 'System Design' },
            { id: 'cleo', name: 'Cleo', role: 'Context Manager' },
            { id: 'coder', name: 'Coder', role: 'Implementation' },
            { id: 'thomas', name: 'Thomas', role: 'Testing & QA' },
            { id: 'nova', name: 'Nova', role: 'Innovation' },
            { id: 'hermes', name: 'Hermes', role: 'Communications' },
            { id: 'raven', name: 'Raven', role: 'Security Ops' },
            { id: 'scout', name: 'Scout', role: 'Discovery' },
            { id: 'spike', name: 'Spike', role: 'Structural Builder' },
            { id: 'hawk', name: 'Hawk', role: 'Oversight' },
            { id: 'jerry', name: 'Jerry', role: 'Watchdog Sync' }
        ];

        const nativeAgents = zapNodes.map(def => ({
            id: `agent-${def.id}`,
            name: def.name,
            role: def.role,
            port: 0,
            status: psOutput.includes(def.id) ? 'online' : 'offline'
        }));


        res.json({
            status: 'ok',
            registry: {
                active_jobs: psOutput.includes('jerry_server') ? 1 : 0,
                tpm_burn_rate: 0,
                last_claude_uplink: new Date().toISOString()
            },
            nativeAgents
        });
    } catch(e: any) {
        res.status(500).json({ error: e.message });
    }
});

const httpServer = app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`[Server] ✅ ZAP Claw is listening on port ${PORT}`);
    console.log(`[Server] Webhook Endpoint Ready: POST http://localhost:${PORT}/webhook/telegram`);
});

// Immediately bind the Native WebSocket Gateway to the running HTTP server
import('./gateway/wss.js').then(({ GatewayWebSocketServer }) => {
    new GatewayWebSocketServer(httpServer);
    console.log(`[WSS Gateway] 📡 Native WebSocket Server attached and listening for Agent connections.`);
}).catch(e => {
    console.error(`[WSS Gateway] ❌ Failed to attach WebSocket Server:`, e);
});
