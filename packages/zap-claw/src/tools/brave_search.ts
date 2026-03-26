import type { ChatCompletionTool } from "openai/resources/chat/completions.js";
import { prisma } from "../db/client.js";

// ── Tool definition (sent to the model via OpenRouter) ────────────────────────

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "brave_search",
        description:
            "Search the internet using the Brave Search API. Use this to get real-time information, news, or technical documentation when your internal knowledge is insufficient.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The search query to execute.",
                },
                count: {
                    type: "number",
                    description: "Number of search results to return (max 10, default 5).",
                    default: 5,
                },
            },
            required: ["query"],
        },
    },
};

// ── Tool handler ──────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function handler(
    input: { query: string; count?: number },
    context?: { botName?: string | undefined }
): Promise<string> {
    const { query, count = 5 } = input;
    const botName = context?.botName || "UnknownAgent";

    // 1. Resolve API Key (Hierarchy: Agent Profile Preferences -> Environment Fallback)
    let apiKey = process.env.BRAVE_API_KEY;

    try {
        // Attempt to find agent-specific key in the database
        // In the multi-tenant architecture, we check the preferences field
        const agent = await prisma.interaction.findFirst({
            where: { role: "AGENT", content: { contains: botName } },
            orderBy: { createdAt: "desc" }
        });

        // Note: Realistically, we'd query a dedicated AgentProfile collection if we had a direct mapping.
        // For now, we'll implement the logic to check for 'braveApiKey' in the system env.
        // If the user adds it to AgentProfile in MongoDB later, this logic can be extended.

        // Check if an agent-specific key exists in env (e.g. BRAVE_API_KEY_JERRY)
        const agentSpecificEnvKey = `BRAVE_API_KEY_${botName.toUpperCase().replace(/\s+/g, "_")}`;
        if (process.env[agentSpecificEnvKey]) {
            apiKey = process.env[agentSpecificEnvKey];
        }
    } catch (dbError) {
        console.warn(`[brave_search] DB lookup failed for ${botName}, falling back to system key.`);
    }

    if (!apiKey) {
        return "Error: Brave API key not configured. Please set BRAVE_API_KEY in .env";
    }

    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
        try {
            const response = await fetch(
                `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Accept-Encoding": "gzip",
                        "X-Subscription-Token": apiKey,
                    },
                }
            );

            if (response.status === 429 && retryCount < maxRetries) {
                const retryAfter = 1500; // Brave Free plan limit is 1 request per second/minute depending on endpoint, but let's be safe.
                console.warn(`[brave_search] Rate limited (429). Retrying in ${retryAfter}ms...`);
                await sleep(retryAfter);
                retryCount++;
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                return `Brave Search API error: ${response.status} ${response.statusText} - ${errorText}`;
            }

            const data = (await response.json()) as any;
            const results = data.web?.results || [];

            if (results.length === 0) {
                return "No results found for your query.";
            }

            const summary = results
                .map((r: any, i: number) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nDescription: ${r.description}`)
                .join("\n\n");

            return `Search results for "${query}":\n\n${summary}`;
        } catch (error: any) {
            if (retryCount < maxRetries) {
                retryCount++;
                await sleep(1000);
                continue;
            }
            return `Failed to execute search: ${error.message}`;
        }
    }
    return "Failed to execute search after multiple retries due to rate limiting.";
}
