import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = "olympus";

const COMMON_PASSWORD = "12345678";

// Immutable Tenant Locales (The Ground Truth)
const olympusSettings = { tenantId: "OLYMPUS", regionCode: "US", baseTimezone: "America/Los_Angeles", baseCurrency: "USD", baseLocale: "en-US", locked: true };
const zvnSettings = { tenantId: "ZVN", regionCode: "VN", baseTimezone: "America/Los_Angeles", baseCurrency: "USD", baseLocale: "en-US", locked: true };
const pho24Settings = { tenantId: "PHO24", regionCode: "VN", baseTimezone: "Asia/Ho_Chi_Minh", baseCurrency: "VND", baseLocale: "vi-VN", locked: true };

// Flexible Employee Preferences (How it looks on their screen)
const usPrefs = { dateFormat: "MM/DD/YYYY", timeFormat: "12h" };
const vnPrefs = { dateFormat: "DD/MM/YYYY", timeFormat: "24h" };

const olympusGods = [
    // Type B: Assisted (Zeus uses Jerry as his Omni-View Copilot)
    { name: "Zeus", role: "System Architect / God Admin", department: "Infrastructure", email: "zeus@olympus.sys", password: COMMON_PASSWORD, tenantId: "OLYMPUS", regionCode: "US", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-OLY-JERRY", defaultModel: "gemini-2.5-pro", telegramId: "8522264702", llmConfig: { provider: "GOOGLE", defaultModel: "gemini-2.5-pro" } }
];

const zapEmployees = [
    { name: "Tom", role: "CEO", department: "ZAP Executive", email: "tom@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-TOM", defaultModel: "gemini-2.5-pro", llmConfig: { provider: "OPENROUTER", defaultModel: "google/gemini-2.5-pro:free" } },
    { name: "Tommy", role: "Sales Executive", department: "ZAP Sales", email: "tommy@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-TOMMY", defaultModel: "gemini-2.5-flash" },
    { name: "Alice", role: "Lead Engineer", department: "ZAP Engineering", email: "alice@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-ALICE", defaultModel: "gemini-2.5-pro" },
    { name: "Bob", role: "Customer Support", department: "ZAP IT", email: "bob@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-BOB", defaultModel: "gemini-2.5-flash" },
    { name: "Charlie", role: "Database Admin", department: "ZAP Engineering", email: "charlie@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-CHAR", defaultModel: "gemini-2.5-flash" },
    { name: "Diana", role: "Product Manager", department: "ZAP Product", email: "diana@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-DIANA", defaultModel: "gemini-2.5-pro" },
    { name: "Eve", role: "Security Ops", department: "ZAP IT", email: "eve@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-EVE", defaultModel: "gemini-2.5-pro" },
    { name: "Grace", role: "HR Manager", department: "ZAP HR", email: "grace@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-GRACE", defaultModel: "gemini-2.5-flash" },
    { name: "Heidi", role: "UX Designer", department: "ZAP Product", email: "heidi@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-HEIDI", defaultModel: "gemini-2.5-flash" },
    { name: "Bert", role: "Investor Communications", department: "ZAP Executive", email: "bert@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-BERT", defaultModel: "gemini-2.5-pro" },
    { name: "Nguyet", role: "CPA & Legal", department: "ZAP Finance", email: "nguyet@zap.com", password: COMMON_PASSWORD, tenantId: "ZVN", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-ZVN-NGUYET", defaultModel: "gemini-2.5-pro" }
];

const pho24Users = [
    // --- Management & BD ---
    // Type B: Assisted (Employee with an Agent copilot)
    { name: "Dan", role: "CEO", department: "Management", email: "dan@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: usPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-DAN", defaultModel: "gemini-2.5-pro" },
    { name: "Alex", role: "BD Director", department: "Business Development", email: "alex@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-ALEX", defaultModel: "gemini-2.5-pro" },

    // --- Marketing Department ---
    { name: "Mike", role: "Marketing Manager", department: "Marketing", email: "mike@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-MIKE", defaultModel: "gemini-2.5-flash" },
    // Type C: Autonomous (Standalone AI that automates a process, assigned a model and ID)
    { name: "Ralph", role: "Autonomous Dept Agent", department: "Marketing", email: "ralph@ai.pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "AUTONOMOUS", assignedAgentId: "AGNT-PHO-RALPH", defaultModel: "gemini-2.5-pro", linkedHuman: "mike@pho24.com", llmConfig: { provider: "OLLAMA", defaultModel: "mistral", baseUrl: "http://localhost:11434" } },

    // --- Stores Department ---
    { name: "Sarah", role: "Head Chef", department: "Stores: Walk-in & Pickup", email: "sarah@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-SARAH", defaultModel: "gemini-2.5-flash" },
    { name: "Linda", role: "Sales Manager", department: "Stores: Walk-in & Pickup", email: "linda@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-LINDA", defaultModel: "gemini-2.5-flash" },
    { name: "James", role: "Sales Manager", department: "Stores: Distribution", email: "james@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-JAMES", defaultModel: "gemini-2.5-flash" },

    // Type A: None (Regular employee, no AI)
    { name: "Kevin", role: "Junior Cook", department: "Stores: Walk-in & Pickup", email: "kevin@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "NONE" },
    { name: "Lisa", role: "Cleaning Staff", department: "Stores: Walk-in & Pickup", email: "lisa@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "NONE" },

    // --- Online Sales Department ---
    { name: "Chloe", role: "Online Manager", department: "Online Sales: Web & App", email: "chloe@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-CHLOE", defaultModel: "gemini-2.5-flash" },
    { name: "David", role: "Aggregator Lead", department: "Online Sales: Aggregators", email: "david@pho24.com", password: COMMON_PASSWORD, tenantId: "PHO24", regionCode: "VN", preferences: vnPrefs, agentType: "ASSISTED", assignedAgentId: "AGNT-PHO-DAVID", defaultModel: "gemini-2.5-flash" }
];

async function seedStoryData() {
    console.log(`[Seed Process] Connecting to Atlas Cluster...`);
    const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // 0. The Master Overlord Data (Tenant OLYMPUS)
        const olympusUsers = db.collection("OLYMPUS_SYS_OS_users");
        await olympusUsers.deleteMany({});
        const olympusInsert = await olympusUsers.insertMany(olympusGods);
        console.log(`[Seed Process] ✅ Inserted ${olympusInsert.insertedCount} God Admin into OLYMPUS_SYS_OS_users (Zeus)`);

        const olympusSettingsCol = db.collection("OLYMPUS_SYS_OS_settings");
        await olympusSettingsCol.deleteMany({});
        await olympusSettingsCol.insertOne(olympusSettings);
        console.log(`[Seed Process] 🔒 Locked OLYMPUS timezone to ${olympusSettings.baseTimezone} & currency to ${olympusSettings.baseCurrency}`);

        // 1. ZAP Internal Data (Tenant ZVN)
        const zvnUsers = db.collection("ZVN_SYS_OS_users");
        await zvnUsers.deleteMany({}); // Clear existing to prevent duplicates
        const zvnInsert = await zvnUsers.insertMany(zapEmployees);
        console.log(`[Seed Process] ✅ Inserted ${zvnInsert.insertedCount} ZAP employees into ZVN_SYS_OS_users (including Tom)`);

        const zvnSettingsCol = db.collection("ZVN_SYS_OS_settings");
        await zvnSettingsCol.deleteMany({});
        await zvnSettingsCol.insertOne(zvnSettings);
        console.log(`[Seed Process] 🔒 Locked ZAP (ZVN) timezone to ${zvnSettings.baseTimezone} & currency to ${zvnSettings.baseCurrency}`);

        // 2. Pho24 Customer Data (Tenant PHO24)
        const pho24UsersCol = db.collection("PHO24_SYS_OS_users");
        await pho24UsersCol.deleteMany({});
        const pho24Insert = await pho24UsersCol.insertMany(pho24Users);
        console.log(`[Seed Process] ✅ Inserted ${pho24Insert.insertedCount} Pho24 employees and Autonomous Agents into PHO24_SYS_OS_users`);

        const pho24SettingsCol = db.collection("PHO24_SYS_OS_settings");
        await pho24SettingsCol.deleteMany({});
        await pho24SettingsCol.insertOne(pho24Settings);
        console.log(`[Seed Process] 🔒 Locked Pho24 (PHO24) timezone to ${pho24Settings.baseTimezone} & currency to ${pho24Settings.baseCurrency}`);

        console.log(`\n[Seed Process] SUCCESS. The story data is live in MongoDB Compass! All passwords are set to '12345678'.`);
    } catch (error) {
        console.error(`[Seed Process] FATAL ERROR:`, error);
    } finally {
        await client.close();
        console.log(`[Seed Process] Connection closed.`);
    }
}

seedStoryData();
