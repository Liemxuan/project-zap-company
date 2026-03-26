import { renderHUD } from '../memory/hud.js';
import { OmniResponse } from '../runtime/engine/omni_router.js';

export async function formatTelegramHUD(user: any, llmReply: string, telemetry?: OmniResponse): Promise<string> {
    const userId = user.telegramId || user.id.toString();

    // 1. Get the centralized HUD block
    const hudBlock = await renderHUD(userId, telemetry?.modelId, telemetry?.providerRef, telemetry);

    // 2. Determine Header (Tenant-specific)
    let header = "";
    if (user.tenantId === "OLYMPUS") {
        header = `⚡️ *OLYMPUS OMNI-VIEW*`;
    } else if (user.tenantId === "ZVN" && user.department === "ZAP Executive") {
        header = `👔 *ZAP Executive*`;
    } else {
        header = `🤖 *ZAP System*`;
    }

    // 3. Simple divider if hud is present
    const divider = hudBlock ? "\n───────────────" : "";

    return `${header}\n\n${llmReply}${divider}${hudBlock}`;
}
