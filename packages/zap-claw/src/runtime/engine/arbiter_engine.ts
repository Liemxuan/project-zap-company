import { Db } from "mongodb";
import { ArbiterTheme, OmniIntent } from "./omni_router.js";

export interface ArbiterProfile {
    theme: ArbiterTheme;
    budgetLimit: number; // in USD
    currentSpend: number;
    alertThreshold: number; // e.g. 0.8 for 80%
    lastAlertSent?: Date;
}

export interface ModelPerformance {
    modelId: string;
    avgLatency: number;
    avgTokensPerDollar: number;
    successRate: number;
}

/**
 * ZAP Arbiter Intelligence
 * Analyzes historical data to optimize routing decisions.
 */
export class ArbiterEngine {
    constructor(private db: Db) { }

    /**
     * Checks if a tenant has exceeded their budget.
     */
    async isWithinBudget(tenantId: string): Promise<boolean> {
        const profile = await this.db.collection("SYS_OS_tenant_budgets").findOne({ tenantId });
        if (!profile) return true; // No limit set

        if (profile.currentSpend >= profile.budgetLimit) {
            console.warn(`[Arbiter] 🛑 Budget Block: Tenant ${tenantId} has consumed ${profile.currentSpend}/${profile.budgetLimit} USD.`);
            return false;
        }
        return true;
    }

    /**
     * Gets the most optimized model list based on current Theme and Intent,
     * using historical performance metrics to re-rank within the same tier.
     */
    async getOptimizedChain(theme: ArbiterTheme, intent: OmniIntent): Promise<string[]> {
        // Base priorities from Theme
        const basePriorities = this.getDefaultThemePriorities(theme);

        // Fetch recent performance (last 7 days)
        const metrics = await this.db.collection("SYS_OS_arbiter_metrics")
            .find({ intent, timestamp: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
            .toArray();

        // If no metrics, return base
        if (metrics.length < 5) return basePriorities;

        // Group by model and calculate performance
        const modelStats: Record<string, any> = {};
        metrics.forEach(m => {
            if (!modelStats[m.modelId]) modelStats[m.modelId] = { totalLat: 0, count: 0, totalTokens: 0 };
            modelStats[m.modelId].totalLat += m.latencyMs;
            modelStats[m.modelId].totalTokens += m.tokens?.total || 0;
            modelStats[m.modelId].count++;
        });

        // Sort siblings within the same tier (e.g. if theme is Precision, rank Claude vs Gemini Ultra)
        // For now, let's keep it simple and just return the priorities, 
        // but in a real "steroids" version, we'd swap 0 and 1 if metrics favored the other.

        return basePriorities;
    }

    private getDefaultThemePriorities(theme: ArbiterTheme): string[] {
        const mapping: Record<ArbiterTheme, string[]> = {
            "A_ECONOMIC": ["deepseek/deepseek-v3.2", "OLLAMA", "google/gemini-2.5-flash"],
            "B_PRODUCTIVITY": ["google/gemini-3.1-pro", "anthropic/claude-4.6-sonnet", "OLLAMA"],
            "C_PRECISION": ["anthropic/claude-4.6-sonnet", "google/gemini-3.1-pro", "deepseek/deepseek-v3.2"]
        };
        return mapping[theme];
    }
}
