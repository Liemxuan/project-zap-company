# EXP-004: Omni-Router Strategy & BYOK Schema

This document outlines the technical blueprint for Phase 13: allowing Agency Owners to Bring Your Own Key (BYOK) and routing traffic dynamically between Google, OpenRouter, and local Ollama.

## 1. MongoDB Schema Modfications

To support dynamic LLM routing without hardcoding preferences, we will inject a new optional `llmConfig` object into both the `SYS_OS_tenants` and `SYS_OS_agents` collections.

### Schematic: `llmConfig`
```typescript
interface LLMConfig {
    provider: "GOOGLE" | "OPENROUTER" | "OLLAMA";
    defaultModel: string; // e.g., "gemini-2.5-pro", "anthropic/claude-3.5-sonnet", "mistral"
    apiKey?: string;      // The encrypted API key (omitted for local Ollama without auth)
    baseUrl?: string;     // Required for Ollama (e.g., "http://localhost:11434"), optional for others
}
```

### Schema Injection Points
1.  **Collection:** `OLYMPUS.SYS_OS_tenants`
    *   **Field:** `llmConfig` (Optional). If present, acts as the default fallback for all agents in this tenant.
2.  **Collection:** `OLYMPUS.SYS_OS_agents`
    *   **Field:** `llmConfig` (Optional). If present, *strictly overrides* the tenant and global fallbacks.

---

## 2. Omni-Router Interface Blueprint

We will create a new core routing engine at `src/runtime/engine/omni_router.ts`. 

### The Resolution Hierarchy Function
```typescript
async function resolveAgentLLMConfig(db: Db, tenantId: string, assignedAgentId: string): Promise<LLMConfig> {
    // 1. Check Agent Level
    const agent = await db.collection("SYS_OS_agents").findOne({ agentId: assignedAgentId });
    if (agent && agent.llmConfig) return agent.llmConfig;

    // 2. Check Tenant Level
    const tenant = await db.collection("SYS_OS_tenants").findOne({ tenantId: tenantId });
    if (tenant && tenant.llmConfig) return tenant.llmConfig;

    // 3. Global Fallback (.env)
    return {
        provider: process.env.GLOBAL_DEFAULT_PROVIDER || "GOOGLE",
        defaultModel: process.env.GLOBAL_DEFAULT_MODEL || "gemini-2.5-pro",
        apiKey: process.env.GOOGLE_API_KEY
    };
}
```

### The Standardized Execution Wrapper
Because Google GenAI and OpenAI (OpenRouter) use fundamentally different SDKs and payload structures (`contents` vs `messages`), the `omni_router.ts` must expose a unified `generateOmniContent()` function.

```typescript
interface OmniPayload {
    systemPrompt: string;
    messages: Array<{ role: "user" | "model", text: string }>;
}

async function generateOmniContent(config: LLMConfig, payload: OmniPayload): Promise<string> {
    switch(config.provider) {
        case "GOOGLE":
            return await executeGoogleGenAI(config, payload);
        case "OPENROUTER":
            return await executeOpenRouter(config, payload);
        case "OLLAMA":
            return await executeOllama(config, payload);
        default:
            throw new Error(`Unsupported LLM Provider: ${config.provider}`);
    }
}
```

## 3. Implementation Steps (Next Phase)
1. Add seed data incorporating `llmConfig` into `seed_pho24_story.ts`.
2. Build `src/runtime/engine/omni_router.ts` with the resolution and wrapper logic.
3. Refactor `serialized_lane.ts` to replace the direct `GoogleGenAI` call with `generateOmniContent()`.
4. Run integration tests for all 3 providers.
