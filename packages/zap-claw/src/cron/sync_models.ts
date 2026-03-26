import { MongoClient } from "mongodb";
import "dotenv/config";
import { checkInfrastructureStatus } from "../lib/infrastructure.js";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

// Updated for Feb 2026 performance benchmarks
const GOOGLE_RANKING = [
    'gemini-3.1-pro-preview',    // Released Feb 19, 2026 - Highest IQ
    'gemini-3-flash-preview',    // Best speed/cost ratio
    'gemini-2.5-pro',           // Reliable fallback
];

const OPENROUTER_RANKING = [
    'anthropic/claude-4.6-sonnet', // #1 in Coding/Agents
    'google/gemini-3.1-pro',       // #1 in Context (2M+)
    'deepseek/deepseek-v3.2',      // #1 in Value
    'openai/gpt-5.2'               // Frontier generalist
];

export interface ModelEntry {
    id: string;
    name: string;
    contextLength?: number;
    description?: string;
    price?: { prompt: number; completion: number };
}

export async function runModelSync() {
    console.log("🌐 [Model Sync] Waking up. Fetching latest global models...");

    // 0. Proactive Infrastructure Check
    await checkInfrastructureStatus();

    const models = {
        GOOGLE: [] as ModelEntry[],
        OPENROUTER: [] as ModelEntry[],
        OLLAMA: [] as ModelEntry[]
    };

    // 1. Fetch Google Models
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (apiKey) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = (await res.json()) as any;
                const fetchedModels = (data.models || []).filter((m: any) =>
                    m.supportedGenerationMethods?.includes("generateContent") && m.name.includes("gemini")
                ).map((m: any) => ({
                    id: m.name.replace('models/', ''),
                    name: m.displayName || m.name.replace('models/', ''),
                    contextLength: m.inputTokenLimit,
                    description: m.description
                }));

                // Rank Google models
                models.GOOGLE = fetchedModels.sort((a: ModelEntry, b: ModelEntry) => {
                    // Try to match exact or partial
                    const indexA = GOOGLE_RANKING.findIndex(r => a.id.includes(r));
                    const indexB = GOOGLE_RANKING.findIndex(r => b.id.includes(r));
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;
                    return b.name.localeCompare(a.name); // Then alphabetical / latest version descending
                });
            } else {
                console.error("❌ [Model Sync] Google GenAI failed:", res.status, res.statusText);
            }
        } else {
            console.warn("⚠️ [Model Sync] No GOOGLE_API_KEY found. Skipping Google models.");
        }
    } catch (e) {
        console.error("❌ [Model Sync] Google GenAI fetch error:", e);
    }

    // 2. Fetch OpenRouter Models
    try {
        const res = await fetch("https://openrouter.ai/api/v1/models");
        if (res.ok) {
            const data = (await res.json()) as any;
            const fetchedModels = (data.data || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                contextLength: m.context_length,
                description: m.description,
                price: {
                    prompt: parseFloat(m.pricing?.prompt || "0"),
                    completion: parseFloat(m.pricing?.completion || "0")
                }
            }));

            // Rank OpenRouter models
            models.OPENROUTER = fetchedModels.sort((a: ModelEntry, b: ModelEntry) => {
                const indexA = OPENROUTER_RANKING.findIndex(r => a.id === r);
                const indexB = OPENROUTER_RANKING.findIndex(r => b.id === r);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return b.id.localeCompare(a.id); // By ID alphabetically for the rest
            });
        } else {
            console.error("❌ [Model Sync] OpenRouter API failed:", res.status, res.statusText);
        }
    } catch (e) {
        console.error("❌ [Model Sync] OpenRouter fetch error:", e);
    }

    // 3. Fetch Ollama (Local) Models
    try {
        // Hardcode standard port for local Ollama
        const res = await fetch("http://localhost:11434/api/tags");
        if (res.ok) {
            const data = (await res.json()) as any;
            models.OLLAMA = (data.models || []).map((m: any) => ({
                id: m.model,
                name: m.name,
                description: `Local model, size: ${(m.size / 1024 / 1024 / 1024).toFixed(2)} GB`
            }));
            // No strict ranking for Ollama needed, just default return order
        } else {
            console.warn("⚠️ [Model Sync] Ollama API unreachable. Ensure Ollama is running locally.");
        }
    } catch (e) {
        console.warn("⚠️ [Model Sync] Ollama unreachable natively. Skipping.");
    }

    // Attempt to save to MongoDB
    if (!MONGO_URI) {
        console.warn("⚠️ [Model Sync] MONGODB_URI not set. Cannot persist models.");
        return;
    }

    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const modelsCol = db.collection(`SYS_OS_global_models`);

        // Always upsert to a single root document to act as a system-wide cache
        await modelsCol.updateOne(
            { _id: "global_registry" as any },
            {
                $set: {
                    providers: models,
                    lastSyncedAt: new Date().toISOString()
                }
            },
            { upsert: true }
        );

        console.log(`✅ [Model Sync] Successfully synchronized models structure to Database.`);
        console.log(`   - Google: ${models.GOOGLE.length} models`);
        console.log(`   - OpenRouter: ${models.OPENROUTER.length} models`);
        console.log(`   - Ollama: ${models.OLLAMA.length} models`);

    } catch (dbErr) {
        console.error("❌ [Model Sync] Database error while preserving models:", dbErr);
    } finally {
        await client.close();
    }
}
