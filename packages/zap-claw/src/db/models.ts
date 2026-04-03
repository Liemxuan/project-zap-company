export interface Tenant {
    tenantId: string;
    businessName?: string;
    industry?: "SPA_BEAUTY" | "FOOD_BEVERAGE" | "HOSPITALITY" | "RETAIL" | "PROFESSIONAL";
    regionCode: "US" | "VN" | "DE"; // Strict enforcement for sharding
    baseTimezone?: string;
    baseCurrency?: string;
    baseLocale?: string;
    locked?: boolean;
    pairingEnforced?: boolean; // Toggle for secure onboarding handshake
    byok?: {
        apiKey?: string;
        modelId?: string;
    };
    capabilities?: {
        hasVision: boolean; // Nano Banana Image Analysis
        hasAudioDialog: boolean; // Gemini Native Audio
        hasRAG: boolean; // Gemini Embedding 1 Document Search
        hasDeepResearch: boolean; // Async Deep Research Pro Engine
    };
}

export interface AgentProfile {
    agentId: string;
    tenantId: string;
    regionCode: "US" | "VN" | "DE";
    name?: string;
    role?: string;
    department?: string;
    agentType?: "ASSISTED" | "AUTONOMOUS" | "NONE";
    defaultModel?: string;
    preferences?: {
        byok?: {
            apiKey?: string;
            modelId?: string;
        };
        [key: string]: any;
    };
    systemPromptRefs?: {
        ethicalBoundsId: string;
        skillsManifestId: string;
        personaGuideId: string;
        selfHealingBrainId: string;
    };
}

export interface SysOsActiveSession {
    _id?: string;
    tenantId: string;
    sessionKey: string; // Format: provider:channelId:threadId
    assignedAgentId: string;
    sandboxMode: boolean;
    lastActive: Date;
}

export interface SysOsBinding {
    _id?: string;
    tenantId: string;
    platform: "telegram" | "discord" | "api";
    peerId?: string;
    parentThreadId?: string;
    agentId: string;
    priority: number; // 0-100, highest wins
}
