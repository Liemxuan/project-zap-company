import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TEMPLATE_DIR = path.join(process.cwd(), 'src/scripts/templates/agent');
const TARGET_DIR = path.join(process.cwd(), '.agent'); // Default output dir, can be customized later

async function ask(question: string): Promise<string> {
    return new Promise(resolve => rl.question(`\x1b[36m? \x1b[0m${question} `, resolve));
}

async function runInit() {
    console.log("🚀 \x1b[1mZAPCLAW Init: Agent Provisioning System\x1b[0m");
    console.log("-----------------------------------------------");

    const systemTypeInput = await ask("What is the Target System? (1) OLYMPUS Platform  (2) Standard MERCHANT: ");
    const isOlympus = systemTypeInput.trim() === '1' || systemTypeInput.toUpperCase().includes('OLYMPUS') || systemTypeInput.toUpperCase().includes('ZEUS');
    const systemTypeStr = isOlympus ? "OLYMPUS" : "MERCHANT";

    let devIdStr = "Automated System";
    let agentNameStr = "Standard Swarm Unit";

    if (isOlympus) {
        devIdStr = await ask("Enter your Olympus Developer ID (e.g., Zeus, Zap, Delta): ");
        agentNameStr = await ask("Enter the designation for this new internal Agent: ");
    } else {
        devIdStr = await ask("Enter the Olympus Developer provisioning this Merchant Agent: ");
        agentNameStr = await ask("Enter the name of the Merchant's new Agent: ");
    }

    const localAgentIdInput = await ask("Enter this Agent's Local Sequence ID for this Tenant (e.g., 1 for the first agent): ");
    const localAgentId = localAgentIdInput.trim() || "1";

    const hudId = `HUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    let verticalStr = "General";
    if (!isOlympus) {
        let rawVertical = await ask("What is the Merchant Vertical? (e.g., Food & Beverage, Spa & Nails, Hotel, Airbnb): ");
        verticalStr = rawVertical.trim() || "Food & Beverage";
    }

    const personalityInput = await ask("What is the Agent's Personality / Tone? (default: Professional, objective, and strictly KPI-driven): ");
    const personalityStr = personalityInput.trim() || "Professional, objective, and strictly KPI-driven";

    const heartbeatCronInput = await ask("What is the Heartbeat trigger cron/time? (default: 09:00 local time): ");
    const heartbeatCronStr = heartbeatCronInput.trim() || "09:00 local time";

    const cycleDurationInput = await ask("What is the operational Cycle Duration? (default: 24-hour): ");
    const cycleDurationStr = cycleDurationInput.trim() || "24-hour";

    const baseToolsInput = await ask("What are the Base Tools granted? (default: Zapclaw Anti-gravity CLI): ");
    const baseToolsStr = baseToolsInput.trim() || "Full and unrestricted access to the Zapclaw Anti-gravity CLI.";

    console.log("\n--- HUD Profiles ---");
    console.log("1) NONE (Clean view)");
    console.log("2) TOKEN_STATS (Models, Keys, TPM)");
    console.log("3) REMINDERS (Focus on tasks)");
    console.log("4) ALL (Full cockpit)");
    const hudProfileInput = await ask("Select initial HUD Profile (default: 1): ");
    const hudMap: Record<string, string> = { "1": "NONE", "2": "TOKEN_STATS", "3": "REMINDERS", "4": "ALL" };
    const hudProfileStr = hudMap[hudProfileInput.trim()] || "NONE";

    const primaryUser = isOlympus ? "Zeus (Tom)" : "Platform Tenant (Merchant)";
    const specificGoal = isOlympus
        ? "Maintain massive 100k+ multi-tenant architectural stability and route global inference."
        : `Optimize performance and drive automated execution for the ${verticalStr} sector.`;

    // Standardize Best Practices across all agents
    const baseSkills = "- **B.L.A.S.T. Protocol:** Strict adherence to Blueprinting, Logging, Actioning, and Testing.\n- **HUD Tracking:** Generate a unique HUD ID for every significant artifact or output.";

    const skillsList = isOlympus
        ? `${baseSkills}\n- Infrastructure Coding\n- Omni-Router Traffic Management\n- Server Diagnostics\n- Platform Security Protocols`
        : `${baseSkills}\n- Zapier Automation\n- Email & Voice Engagement\n- Sales & Marketing Workflows\n- Vertical-Specific Legal Compliance`;

    // Default Gateways
    const connectionStrategy = isOlympus ? "Omni-Router (Internal Default)" : "Zapclaw Gateway (Optimized) / BYOK Fallback";
    const primaryModel = isOlympus ? "Gemini 3.1 (Deep Brain - SOTA)" : "Gemini 1.5 Flash (Fast Brain - Cost Optimized)";

    console.log(`\n\x1b[33mConfiguring Template Variables...\x1b[0m`);
    console.log(`- TARGET_SYSTEM: ${systemTypeStr}`);
    console.log(`- DEVELOPER:     ${devIdStr}`);
    console.log(`- AGENT NAME:    ${agentNameStr}`);
    console.log(`- VERTICAL:      ${verticalStr}`);
    console.log(`- PRIMARY_USER:  ${primaryUser}`);
    console.log(`- GLOBAL HUD_ID: ${hudId}`);
    console.log(`- LOCAL AGENT #: ${localAgentId}`);
    console.log(`- GATEWAY:       ${connectionStrategy}`);
    console.log(`- HUD PROFILE:   ${hudProfileStr}`);

    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    const files = [
        'AGENTS.md', 'SKILL.md', 'IDENTITY.md', 'USER.md', 'TOOLS.md', 'HEARTBEAT.md', 'SOUL.md',
        'MEMORY.md', 'SHIELD.md', 'projects/INDEX.md', 'MODELS.md', 'SELF_HEALING_BRAIN.md', 'BOOTSTRAP.md'
    ];

    let fileCount = 0;
    for (const file of files) {
        const tplPath = path.join(TEMPLATE_DIR, file);
        const targetPath = path.join(TARGET_DIR, file);

        if (fs.existsSync(tplPath)) {
            let content = fs.readFileSync(tplPath, 'utf-8');

            // Find and process Olympus Blocks
            // Replace {{OLYMPUS_BLOCK_START}}[internal]{{OLYMPUS_BLOCK_END}} format
            const blockRegex = /\{\{OLYMPUS_BLOCK_START\}\}([\s\S]*?)\{\{OLYMPUS_BLOCK_END\}\}/g;
            content = content.replace(blockRegex, (match, blockContent) => {
                if (isOlympus) {
                    return blockContent.trim(); // Keep the content, trim surrounding newlines
                } else {
                    return ""; // Delete entire block if not Olympus
                }
            });

            // Replace standard variables
            content = content
                .replace(/\{\{SYSTEM_TYPE\}\}/g, systemTypeStr)
                .replace(/\{\{VERTICAL\}\}/g, verticalStr)
                .replace(/\{\{PRIMARY_USER\}\}/g, primaryUser)
                .replace(/\{\{SKILLS_LIST\}\}/g, skillsList)
                .replace(/\{\{HUD_ID\}\}/g, hudId)
                .replace(/\{\{LOCAL_AGENT_ID\}\}/g, localAgentId)
                .replace(/\{\{DEVELOPER_ID\}\}/g, devIdStr)
                .replace(/\{\{AGENT_NAME\}\}/g, agentNameStr)
                .replace(/\{\{CONNECTION_STRATEGY\}\}/g, connectionStrategy)
                .replace(/\{\{PRIMARY_MODEL\}\}/g, primaryModel)
                .replace(/\{\{PERSONALITY\}\}/g, personalityStr)
                .replace(/\{\{HEARTBEAT_CRON\}\}/g, heartbeatCronStr)
                .replace(/\{\{CYCLE_DURATION\}\}/g, cycleDurationStr)
                .replace(/\{\{BASE_TOOLS\}\}/g, baseToolsStr)
                .replace(/\{\{HUD_PROFILE\}\}/g, hudProfileStr)
                .replace(/\{\{SPECIFIC_BUSINESS_GOAL\}\}/g, specificGoal);

            const warningHeader = `<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: ${hudId}
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->\n\n`;

            const finalContent = warningHeader + content.trim() + '\n';

            const dirPath = path.dirname(targetPath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            fs.writeFileSync(targetPath, finalContent);
            fileCount++;
        } else {
            console.error(`❌ Template missing: ${file}`);
        }
    }

    console.log(`\n✅ Anatomy Generation Complete. Provisioned ${fileCount} files into \x1b[32m${TARGET_DIR}/\x1b[0m`);

    // Self-Diagnostic validation step
    console.log(`\n\x1b[34mRunning Self-Diagnostic...\x1b[0m`);
    let allValid = true;
    for (const file of files) {
        const fullPath = path.join(TARGET_DIR, file);
        if (fs.existsSync(fullPath)) {
            console.log(`- [\x1b[32mOK\x1b[0m] ${file}`);
        } else {
            console.log(`- [\x1b[31mFAIL\x1b[0m] ${file}`);
            allValid = false;
        }
    }

    if (allValid) {
        console.log(`\n✨ \x1b[1mAgent Anatomy Validated. Anti-Gravity systems go.\x1b[0m\n`);
    } else {
        console.log(`\n❌ \x1b[31mDiagnostic Failed: Missing critical Anatomy files.\x1b[0m\n`);
    }

    rl.close();
}

runInit().catch(console.error);
