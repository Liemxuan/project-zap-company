/**
 * Standardized ZapSwarmEvent Schema
 * Mapped from OpenClaw Architecture PRD to normalize inbound webhook/socket 
 * payloads from heterogeneous communication channels (Slack, Discord, Telegram, etc).
 */

export type SwarmChannel = 
    | "SLACK" 
    | "DISCORD" 
    | "TELEGRAM" 
    | "WHATSAPP" 
    | "IMESSAGE" 
    | "TEAMS" 
    | "ZALO"
    | "CLI";

export interface SwarmSender {
    /** Unique ID from the origin platform (e.g. Discord snowflake, Slack member ID) */
    id: string;
    /** Human-readable username or handle */
    username: string;
    /** Whether the user is an admin or has trusted roles within their platform */
    isPlatformAdmin?: boolean;
    /** System-mapped role after RBAC verification */
    mappedRole?: "OWNER" | "ADMIN" | "USER" | "GUEST";
}

export interface SwarmMessageContext {
    /** The actual content of the message */
    text: string;
    /** Whether the agent was explicitly @mentioned (Mention Gating metric) */
    hasMention: boolean;
    /** Optional array of attachments (images, files) normalized to systemic URLs */
    attachments?: Array<{
        type: "image" | "file" | "audio" | "video";
        url: string;
        sizeBytes?: number;
    }>;
}

export interface SwarmRouteMeta {
    /** The specific channel or DM ID where this message originated */
    threadId: string;
    /** Whether it's a direct message (1:1) or a group message */
    isDirectMessage: boolean;
    /** Original event timestamp */
    timestamp: number;
}

/**
 * The unified event envelope passed from the Gateway to the Swarm routing engine.
 */
export interface ZapSwarmEvent {
    /** The platform this event originated from */
    channel: SwarmChannel;
    /** The tenant or merchant workspace this event belongs to */
    tenantId: string;
    /** Optionally bound session ID to maintain continuous context */
    sessionId?: string;
    
    sender: SwarmSender;
    message: SwarmMessageContext;
    route: SwarmRouteMeta;
    
    /** 
     * The raw, unparsed payload from the provider for diagnostic 
     * or fallback extraction (kept strictly typed as unknown).
     */
    rawPayload?: unknown;
}
