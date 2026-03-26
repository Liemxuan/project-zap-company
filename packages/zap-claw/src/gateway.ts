export type GatewayTier =
    | "tier_p0_fast"      // Real-Time / Fast Chat
    | "tier_p1_vision"    // Vision / Pre-Processing
    | "tier_p2_security"  // Janitorial / Pre-filtering
    | "tier_p3_heavy";     // Async Heavy / Deep Research

export interface GatewayPayload {
    model: string;
    models?: string[];
    provider?: {
        order?: string[];
        allow_fallbacks?: boolean;
        data_collection?: "deny" | "allow";
        ignore?: string[];
    };
    route?: "fallback" | "parallel";
}

/**
 * The Gateway Arbitrage Matrix (B.L.A.S.T. 014)
 * Handles dynamic routing across providers and cost tiers.
 */
export function getGatewayConfig(tier: GatewayTier): GatewayPayload {
    switch (tier) {
        case "tier_p0_fast":
            return {
                model: "google/gemini-2.0-flash-001",
                models: [
                    "google/gemini-2.0-flash-001",
                    "google/gemini-2.5-flash",
                    "google/gemini-2.0-flash-exp:free"
                ],
                provider: {
                    allow_fallbacks: true,
                    data_collection: "deny"
                },
                route: "fallback"
            };

        case "tier_p1_vision":
            return {
                model: "google/gemini-2.0-flash-001", // Default to Flash for vision
                models: [
                    "google/gemini-2.0-flash-001",
                    "google/gemini-pro-vision", 
                    "google/gemini-2.5-flash-preview"
                ],
                provider: {
                    allow_fallbacks: true,
                    data_collection: "deny"
                },
                route: "fallback"
            };

        case "tier_p2_security":
            return {
                model: "google/gemini-2.0-flash-lite-001",
                models: [
                    "google/gemini-2.0-flash-lite-001",
                    "google/gemini-2.0-flash-exp:free"
                ],
                provider: {
                    allow_fallbacks: true
                }
            };

        case "tier_p3_heavy":
            return {
                model: "google/gemini-2.5-pro",
                models: [
                    "google/gemini-2.5-pro",
                    "google/gemini-2.5-pro-preview",
                    "anthropic/claude-3.5-sonnet"
                ],
                provider: {
                    allow_fallbacks: true,
                    data_collection: "deny"
                }
            };

        default:
            return getGatewayConfig("tier_p0_fast");
    }
}
