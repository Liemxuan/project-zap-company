import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "olympus";

/**
 * Universal Form Registry Seeder
 * Populates the tracking database with all known ZAP UI forms.
 */
async function seedFormRegistry() {
    if (!MONGO_URI) {
        console.error("❌ MONGODB_URI is not set in .env");
        process.exit(1);
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const registryCol = db.collection("SYS_OS_form_registry");

        const forms = [
            {
                uid: 101,
                formId: "FRM-ADMIN-01",
                name: "Titan Global Registry",
                description: "Main admin dashboard for viewing the entire ZAP system state, connected gateways, and server architecture. Currently Read-Only.",
                path: "/admin.html",
                mode: "full",
                status: "working",
                qcState: "human_tested",
                lastUpdated: new Date().toISOString()
            },
            {
                uid: 102,
                formId: "FRM-BYOK-01",
                name: "Bring Your Own Key",
                description: "Allows users to inject personal Anthropic/OpenAI/Ollama API keys securely into their tenant configuration without revealing them to the main system.",
                path: "/byok.html",
                mode: "edit", // Edits existing user tenant
                status: "working",
                qcState: "human_tested",
                lastUpdated: new Date().toISOString()
            },
            {
                uid: 103,
                formId: "FRM-MODELS-01",
                name: "Manual Model Overrides",
                description: "Administrative form to manually inject offline models (e.g., local Ollama) or override hardware token limits (TPM/RPD) before synchronization.",
                path: "/models-admin.html",
                mode: "new", // Creates new overrides
                status: "working",
                qcState: "bot_swarm_tested",
                lastUpdated: new Date().toISOString()
            },
            {
                uid: 104,
                formId: "FRM-GTW-01",
                name: "Gateway Management Directory",
                description: "Administrative form to list, configure, and override OLYMPUS gateways such as Telegram, Discord, and Web UIs, their roles, and their linked inference model pipelines.",
                path: "/gateway-admin.html",
                mode: "full", // Edits/Creates gateway profiles 
                status: "in_progress",
                qcState: "pending",
                lastUpdated: new Date().toISOString()
            },
            {
                uid: 105,
                formId: "FRM-BRND-01",
                name: "Brand Guidelines Hub",
                description: "Defines the core aesthetic, tone, and visual language for specific tenants to be ingested by ZAP Design systems and LLM context injectors.",
                path: "/brand-admin.html",
                mode: "full",
                status: "in_progress",
                qcState: "pending",
                lastUpdated: new Date().toISOString()
            }
        ];

        // Upsert all predefined forms
        for (const f of forms) {
            await registryCol.updateOne(
                { formId: f.formId },
                { $set: f },
                { upsert: true }
            );
        }

        console.log("✅ Form Registry Seeded Successfully.");

    } catch (error) {
        console.error("❌ Error seeding form registry:", error);
    } finally {
        await client.close();
    }
}

seedFormRegistry();
