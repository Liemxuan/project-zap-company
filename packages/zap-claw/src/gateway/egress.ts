import { OmniResponse } from "../runtime/engine/omni_router.js";

/**
 * Strips all markdown formatting down to plain text.
 */
function stripMarkdown(text: string): string {
    return text
        // Remove bold/italic (**, __, *, _)
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        // Remove headers (#, ##, etc.)
        .replace(/#{1,6}\s?/g, '')
        // Remove strikethrough (~~)
        .replace(/~~(.*?)~~/g, '$1')
        // Remove link text but keep the URL: [link text](url) -> link text URL
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1 $2')
        // Remove inline code ticks
        .replace(/`(.*?)`/g, '$1')
        // Remove code block ticks
        .replace(/```.*?```/gs, (match) => match.replace(/```(.*?\n)?/g, '').replace(/```/g, ''))
        .trim();
}

/**
 * Formats standard markdown into WhatsApp-flavor markdown.
 * - Bold: *text*
 * - Italic: _text_
 * - Strikethrough: ~text~
 * - Monospace: ```text```
 * - Standard headers (#) are not natively supported, so we strip them
 */
export function formatForWhatsApp(text: string): string {
    let formatted = text;
    // Standard Bold (**text**) to WhatsApp Bold (*text*)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '*$1*');
    // Headers (# text) are converted to bold caps
    formatted = formatted.replace(/^#+\s*(.*)$/gm, '*$1*');
    // Strikethrough (~~text~~) to WhatsApp (~text~)
    formatted = formatted.replace(/~~(.*?)~~/g, '~$1~');
    // Links [text](url) -> text: url
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '$1: $2');

    return formatted;
}

/**
 * Formats standard markdown into Telegram HTML parse mode format.
 * - Bold: <b>text</b>
 * - Italic: <i>text</i>
 * - Strikethrough: <s>text</s>
 * - Code: <code>text</code>
 * - Links: <a href="url">text</a>
 */
export function formatForTelegramHTML(text: string): string {
    let formatted = text;

    // Links [text](url) -> <a href="url">text</a>
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Headers (# text) to Bold
    formatted = formatted.replace(/^#+\s*(.*)$/gm, '<b>$1</b>');

    // Bold (**text**) to <b>text</b>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Italic (*text* or _text_) to <i>text</i> - avoiding matching WhatsApp bold temporarily handled above
    formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<i>$1</i>');
    formatted = formatted.replace(/_(.*?)_/g, '<i>$1</i>');

    // Strikethrough (~~text~~) to <s>text</s>
    formatted = formatted.replace(/~~(.*?)~~/g, '<s>$1</s>');

    // Inline code (`text`) to <code>text</code>
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Code blocks (```text```) to <pre><code>text</code></pre>
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert newlines to HTML lines (Telegram interprets raw text newlines fine with HTML parse mode, but this is safer)
    // Actually, Telegram HTML still processes raw `\n` perfectly, so we'll leave newlines to avoid `br` bloat.

    return formatted;
}

/**
 * Chunks text into smaller pieces if it exceeds the platform limit.
 */
export function chunkMessage(text: string, limit: number): string[] {
    if (text.length <= limit) return [text];

    const chunks: string[] = [];
    let currentChunk = "";

    const lines = text.split('\n');
    for (const line of lines) {
        if (currentChunk.length + line.length + 1 > limit) {
            chunks.push(currentChunk.trim());
            currentChunk = line + '\n';
        } else {
            currentChunk += line + '\n';
        }
    }
    if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());
    return chunks;
}

import type { SwarmChannel } from "./schema.js";

/**
 * The unified Egress Router.
 * Takes the raw OmniResponse and routes it to the specific platform formatter.
 * Implements BLAST-1 Ephemeral Canvas Link injection.
 */
export async function routeEgress(reply: OmniResponse & { canvasId?: string }, channel: SwarmChannel): Promise<string> {
    let rawText = reply.text || "";

    if (reply.canvasId) {
        const HOST = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        rawText += `\n\n[Visual Canvas Ready] ✨\nTap to securely view your interactive data:\n${HOST}/canvas/${reply.canvasId}`;
    }

    console.log(`[Egress Router] 📤 Dispatching message to natively linked channel API: [${channel}]`);

    let finalPayload = rawText;

    try {
        switch (channel) {
            case "WHATSAPP":
                finalPayload = formatForWhatsApp(rawText);
                break;
            case "TELEGRAM":
                finalPayload = formatForTelegramHTML(rawText);
                break;
            case "ZALO":
            case "IMESSAGE":
                finalPayload = stripMarkdown(rawText);
                break;
            case "SLACK":
                finalPayload = rawText;
                if (process.env.SLACK_WEBHOOK_URL) {
                    await fetch(process.env.SLACK_WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: finalPayload })
                    });
                    console.log(`[Egress] ✅ Live Slack API Push Successful`);
                } else {
                    console.warn(`[Egress] ⚠️ SLACK_WEBHOOK_URL not set. Emitting to stdout.`);
                }
                break;
            case "DISCORD":
                finalPayload = rawText;
                if (process.env.DISCORD_WEBHOOK_URL) {
                    await fetch(process.env.DISCORD_WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: finalPayload })
                    });
                    console.log(`[Egress] ✅ Live Discord API Push Successful`);
                } else {
                    console.warn(`[Egress] ⚠️ DISCORD_WEBHOOK_URL not set. Emitting to stdout.`);
                }
                break;
            case "CLI":
                finalPayload = rawText;
                break;
            default:
                finalPayload = rawText;
                break;
        }
    } catch (e: any) {
        console.error(`[Egress Router] ❌ Live dispatch failed for ${channel}:`, e.message);
    }

    return finalPayload;
}

// ===============================================
// MOCK TESTS FOR EGRESS FORMATTING
// ===============================================
export function runEgressMocks() {
    const mockReply: OmniResponse = {
        text: "## Weekly Report🚀\nHere is your **amazing** summary of the week.\n\n- Revenue: $500\n- Status: ~~Pending~~ Done\n\nPlease check the [dashboard](https://example.com) for details!\n\n```json\n{ \"status\": \"success\" }\n```",
        toolCalls: undefined,
        modelId: "mock-model",
        providerRef: "GOOGLE",
        apiKeyTail: "LOCAL",
        tokensUsed: { prompt: 10, completion: 50, total: 60, cached: 0 }
    };

    console.log("======================================================");
    console.log("--- EGRESS TEST 1: WHATSAPP Formatter ---");
    console.log("======================================================");
    routeEgress(mockReply, "WHATSAPP").then(r => console.log(r));

    console.log("\n======================================================");
    console.log("--- EGRESS TEST 2: TELEGRAM (HTML) Formatter ---");
    console.log("======================================================");
    routeEgress(mockReply, "TELEGRAM").then(r => console.log(r));

    console.log("\n======================================================");
    console.log("--- EGRESS TEST 3: ZALO Formatter (Plain text) ---");
    console.log("======================================================");
    routeEgress(mockReply, "ZALO").then(r => console.log(r));

    console.log("\n======================================================");
    console.log("--- EGRESS TEST 4: CLI Formatter (passthrough) ---");
    console.log("======================================================");
    routeEgress(mockReply, "CLI").then(r => console.log(r));
}

// Only run if called directly from the terminal
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runEgressMocks();
}
