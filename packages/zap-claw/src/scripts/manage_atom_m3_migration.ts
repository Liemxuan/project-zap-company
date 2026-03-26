import { PrismaClient } from '@prisma/client';
import { omniQueue, triageJob, getQueueCollection } from '../runtime/engine/omni_queue.js';
import { OmniPayload, LLMConfig } from '../runtime/engine/omni_router.js';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

// The 11 remaining atoms for M3 Token Migration
const ATOM_TARGETS = [
    "surfaces/canvas.tsx",
    "surfaces/card.tsx",
    "surfaces/panel.tsx",
    "interactive/Toggle.tsx",
    "interactive/Select.tsx",
    "interactive/SearchInput.tsx",
    "status/badges.tsx",
    "status/pills.tsx",
    "status/avatars.tsx",
    "status/indicators.tsx",
    "layout/AccordionItem.tsx"
];

const ATOMS_DIR = path.resolve(__dirname, '../../../zap-design/src/genesis/atoms');

async function runAtomMigrationSwarm() {
    console.log("🚀 [ZAP-CSO] Deploying Swarm: M3 Atom Migration (Spike x Jerry)");

    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db("olympus");
    const tenantId = "ZVN";
    const queueCol = db.collection(getQueueCollection(tenantId));

    // Clear ghost items to ensure a clean queue
    await queueCol.deleteMany({ status: "WAITING_APPROVAL" });

    const ticketId = `ZAP-ATOM-M3-${Date.now()}`;
    await prisma.jobTicket.create({
        data: {
            ticketId,
            level: 'L7',
            scope: 'Genesis Atoms M3 Token Migration (Phase 1)',
            manager: 'CSO (Antigravity)',
            status: 'IN_PROGRESS',
            targetBranch: 'main'
        }
    });

    console.log(`📡 Dispatching Alpha/Beta teams to ${ATOM_TARGETS.length} atom files...`);

    await omniQueue.connect(tenantId);

    const config: LLMConfig = {
        apiKey: "system_internal",
        defaultModel: "google/gemini-3.1-pro-preview"
    };

    /**
     * ZAP M3 Token Injection Protocol (Derived from Button/Input)
     */
    const m3Protocol = `
## ZAP M3 Token Injection Protocol (Strict Arbitrary Syntax)
We are migrating from hardcoded Neo-Brutalist classes to dynamic CSS variables.
1. **NO HARDCODED COLORS OR SIZES:** Strip all \`border-black\`, \`shadow-brutal\`, \`bg-white\`, \`text-black\`, etc.
2. **USE ARBITRARY SYNTAX LIMITATIONS:** Tailwind arbitrary values must be used to bind to the CSS variables defined in \`tokens.css\`.
3. **MAPPINGS:**
   - Backgrounds: \`bg-[color:var(--layer-cover)]\`, \`bg-[color:var(--layer-canvas)]\`, \`bg-[color:var(--brand-teal)]\`
   - Borders: \`border-[color:var(--card-border)]\`, \`border-[color:var(--input-border)]\`
   - Text: \`text-[color:var(--brand-midnight)]\`
   - Shadows: \`shadow-[var(--card-shadow)]\`
   - Radii: \`rounded-[var(--rounded-card)]\`, \`rounded-[var(--rounded-btn)]\`, \`rounded-[var(--rounded-input)]\`
   - Border Width: \`border-[length:var(--card-border-width)]\`
4. **COMPONENT PRESERVATION:** Do not change functional React logic, props, or behavior. ONLY refactor the Tailwind \`className\` strings.
    `;

    for (const relativePath of ATOM_TARGETS) {
        const fullPath = path.join(ATOMS_DIR, relativePath);
        
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ [ERROR] Target file not found: ${fullPath}`);
            continue;
        }

        const fileContent = fs.readFileSync(fullPath, 'utf8');

        // --- ALPHA JOB (SPIKE - The Builder) ---
        const alphaTask = `
**Alpha Task (Spike):** Refactor the following React component to strictly use M3 Token Arbitrary Syntax.
File: \`${relativePath}\`

${m3Protocol}

**Current Source Code:**
\`\`\`tsx
${fileContent}
\`\`\`

Analyze the source, strip the legacy classes, inject the M3 variables using arbitrary syntax, and return the ENTIRE updated file content. Do not truncate.
        `;

        const alphaPayload: OmniPayload = {
            systemPrompt: "You are Spike (Builder). Implement the ZAP M3 Token protocol precisely. Output the full refactored file content.",
            messages: [{ role: "user", content: alphaTask }],
            theme: "C_PRECISION",
            intent: "CODING"
        };

        const alphaJobId = await omniQueue.enqueue(
            triageJob(alphaPayload),
            2,
            tenantId,
            alphaPayload,
            config,
            "CLI",
            "Antigravity (CSO)"
        );
        await omniQueue.approveJob(alphaJobId, tenantId);

        // --- BETA JOB (JERRY - The Watchdog) ---
        const betaTask = `
**Beta Task (Jerry):** Audit the Refactoring of \`${relativePath}\`.
Verify absolute compliance with the ZAP M3 Token Injection Protocol.
There must be ZERO hardcoded colors (e.g., \`bg-white\`, \`border-black\`) or legacy dimensions.
Everything must use arbitrary syntax (e.g., \`bg-[color:var(--layer-cover)]\`).

Report any deviations immediately. If a single legacy class remains, FAIL the build.
        `;

        const betaPayload: OmniPayload = {
            systemPrompt: "You are Jerry (Watchdog). Audit Spike's output. Pass or Fail with technical comments.",
            messages: [{ role: "user", content: betaTask }],
            theme: "C_PRECISION",
            intent: "REASONING"
        };

        const betaJobId = await omniQueue.enqueue(
            triageJob(betaPayload),
            2,
            tenantId,
            betaPayload,
            config,
            "CLI",
            "Antigravity (CSO)"
        );
        await omniQueue.approveJob(betaJobId, tenantId);

        console.log(`🔗 Paired [Alpha: ${alphaJobId}] <-> [Beta: ${betaJobId}] for ${relativePath}`);
    }

    console.log("\n🛸 Swarm Payload Delivered. The remaining 11 atoms are now in the Red/Green TRT loop.");

    await prisma.$disconnect();
    await mongoClient.close();
    process.exit(0);
}

runAtomMigrationSwarm().catch(console.error);
