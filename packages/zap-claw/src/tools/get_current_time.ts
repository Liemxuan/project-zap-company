import type { ChatCompletionTool } from "openai/resources/chat/completions.js";

// ── Tool definition (sent to the model via OpenRouter) ────────────────────────

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_current_time",
        description:
            "Returns the current date and time in ISO 8601 format, along with the local timezone offset. Use this whenever you need to know the current time, compute durations, or answer time-related questions.",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
};

// ── Tool handler ──────────────────────────────────────────────────────────────

export function handler(_input: Record<string, unknown>): string {
    const now = new Date();
    const offset = -now.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const minutes = String(absOffset % 60).padStart(2, "0");
    const timezone = `UTC${sign}${hours}:${minutes}`;

    return JSON.stringify({
        iso: now.toISOString(),
        local: now.toLocaleString(),
        timezone,
        unix: Math.floor(now.getTime() / 1000),
    });
}
