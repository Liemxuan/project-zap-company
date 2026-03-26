import { prisma } from "../db/client.js";

export type HUDType = "NONE" | "TOKEN_STATS" | "REMINDERS" | "ALL";

export interface HUDData {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    lastReminder?: string;
}

/**
 * Get the current token usage for a session (today).
 */
export async function getTokenUsage(sessionId: string): Promise<{ prompt: number; completion: number; total: number; tpm: number }> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const oneMinuteAgo = new Date(Date.now() - 60000);

    const [dailyAggregates, minuteAggregates] = await Promise.all([
        (prisma.interaction.aggregate({
            where: {
                sessionId,
                createdAt: { gte: startOfToday },
            },
            _sum: {
                promptTokens: true,
                completionTokens: true,
                totalTokens: true,
            },
        }) as any),
        (prisma.interaction.aggregate({
            where: {
                sessionId,
                createdAt: { gte: oneMinuteAgo },
            },
            _sum: {
                totalTokens: true,
            },
        }) as any)
    ]);

    const sum = dailyAggregates._sum;
    return {
        prompt: sum.promptTokens || 0,
        completion: sum.completionTokens || 0,
        total: sum.totalTokens || 0,
        tpm: minuteAggregates._sum?.totalTokens || 0,
    };
}

/**
 * Get the user's selected HUD preference from memory.
 */
export async function getHUDPreference(userId: string): Promise<HUDType> {
    const pref = await prisma.memoryFact.findFirst({
        where: {
            agentId: userId,
            factType: "HUD_PREFERENCE",
        },
    });

    return (pref?.fact as HUDType) || "NONE"; // Default to NONE (disabled)
}

/**
 * Set the user's HUD preference.
 */
export async function setHUDPreference(userId: string, type: HUDType): Promise<void> {
    // Delete existing
    await prisma.memoryFact.deleteMany({
        where: {
            agentId: userId,
            factType: "HUD_PREFERENCE",
        },
    });

    // Create new
    await prisma.memoryFact.create({
        data: {
            agentId: userId,
            factType: "HUD_PREFERENCE",
            fact: type,
            accountType: "SYSTEM",
        },
    });
}

/**
 * Render the HUD string based on preference.
 * Can take optional real-time telemetry from the gateway to avoid DB lag.
 */
export async function renderHUD(
    userId: string,
    usedModel: string = "unknown",
    usedProvider: string = "unknown",
    telemetry?: any
): Promise<string> {
    const pref = await getHUDPreference(userId);
    if (pref === "NONE") return "";

    let hudParts: string[] = [];

    if (pref === "TOKEN_STATS" || pref === "ALL") {
        let tierAlias = "SYS";
        let keyTail = "N/A";
        let total = 0;
        let modelId = usedModel;

        if (telemetry) {
            // Use real-time data from OmniResponse if available
            const pMap: Record<string, string> = {
                "GOOGLE": "G",
                "OPENROUTER": "OR",
                "OLLAMA": "OLM"
            };
            const pAlias = pMap[telemetry.providerRef] || "SYS";

            // Refine alias based on specific gateway registration protocol
            if (telemetry.providerRef === "GOOGLE") {
                const k = telemetry.apiKeyTail || "";
                // Identity checks based on registration keys
                if (k.includes("d4ibQI") || telemetry.accountLevel === "ULTRA") {
                    tierAlias = "G1 (Ultra)";
                } else {
                    tierAlias = "G2 (Pro)";
                }
            } else if (telemetry.providerRef === "OPENROUTER") {
                tierAlias = "OR (BYOK)";
            } else if (telemetry.providerRef === "OLLAMA") {
                tierAlias = "LOC (Ollama)";
            } else {
                tierAlias = pAlias;
            }

            keyTail = telemetry.apiKeyTail || "N/A";
            total = telemetry.tokensUsed?.total || 0;
            modelId = telemetry.modelId || usedModel;
        } else {
            // Fallback to Prisma aggregates
            const usage = await getTokenUsage(userId);
            total = usage.total;

            let providerAlias = "SYS";
            let accountLabel = "System Default";
            let projectLabel = "google:default";

            if (usedProvider === "google-native" || usedProvider === "google") {
                const k = process.env.GOOGLE_API_KEY || "";
                keyTail = k.slice(-6) || "N/A";
                const isUltra = keyTail.includes("d4ibQI");
                providerAlias = isUltra ? "G1 (Ultra)" : "G2 (Pro)";
                accountLabel = isUltra ? "tomtranzap@gmail.com" : "tom@zap.vn";
            } else if (usedProvider === "openrouter") {
                providerAlias = "OR (BYOK)";
                accountLabel = "tom@zap.vn";
                const k = process.env.OPENROUTER_API_KEY || "";
                keyTail = k.slice(-6) || "N/A";
                projectLabel = "openrouter:default";
            } else if (usedProvider === "ollama") {
                providerAlias = "LOC (Ollama)";
                accountLabel = "MacMini";
                projectLabel = "local:watchdog";
            }

            const proj = projectLabel;
            const ceiling = 1000000;
            const percent = Math.round((total / ceiling) * 100);

            const displayKeyTail = providerAlias.includes("G1") ? "d4ibQI" : keyTail;

            hudParts.push(`👀 Sensing | 💆 Chief of Staff\n${providerAlias};Model: ${usedModel} | Key: ...${displayKeyTail} | Proj: ${proj} | Tokens: ${Math.round(total / 1000)}k/1.0m (${percent}%)]`);
        }

        // Management Choices
        hudParts.push(`\n[ ] A: Monitor the group chat for Jerry's compressed response payload.`);
        hudParts.push(`[ ] B: Execute a secondary compressed ping if Jerry times out.`);
        hudParts.push(`[ ] C: Resume Work: Awaiting your next directive.`);
        hudParts.push(`[ ] D: All the above (Agent Decision): Hold position, monitor the heartbeat, and let the agents volley.`);
    }

    if (pref === "REMINDERS" || pref === "ALL") {
        const reminder = await prisma.memoryFact.findFirst({
            where: {
                agentId: userId,
                factType: "REMINDER",
            },
            orderBy: { createdAt: "desc" },
        });
        if (reminder && typeof reminder.fact === 'string') {
            hudParts.push(`⏰ **Next Up**: ${reminder.fact}`);
        } else if (pref === "REMINDERS") {
            hudParts.push(`⏰ **Next Up**: No pending reminders.`);
        }
    }

    if (hudParts.length === 0) return "";

    return `\n\n${hudParts.join("\n")}`;
}
