import type { ChatCompletionMessageParam } from "openai/resources/index.js";

function truncateString(str: string, maxLength: number): string {
    if (!str) return "";
    let s = str.trim();
    if (s.length > maxLength) {
        return s.substring(0, maxLength) + "...";
    }
    return s;
}

export function buildContextSummary(messages: ChatCompletionMessageParam[]): string {
    const userMessages = messages.filter(m => m.role === "user").length;
    const assistantMessages = messages.filter(m => m.role === "assistant").length;
    let toolMessages = messages.filter(m => m.role === "tool").length;

    let lines: string[] = [
        "<summary>",
        "Conversation summary:",
        `- Scope: ${messages.length} earlier messages compacted (user=${userMessages}, assistant=${assistantMessages}, tool=${toolMessages}).`,
        "- Key timeline:"
    ];

    for (const msg of messages) {
        let contentStr = "";
        
        if (typeof msg.content === "string") {
            contentStr = truncateString(msg.content, 160).replace(/\n/g, " ");
        } else if (Array.isArray(msg.content)) {
            const parts = (msg.content as any[]).map(p => {
                if (p.type === "text") return truncateString(p.text, 50);
                if (p.type === "image_url") return "[Image]";
                return "[Mixed Content]";
            });
            contentStr = parts.join(" | ").replace(/\n/g, " ");
        }

        if (msg.role === "assistant") {
            const amsg = msg as any;
            if (amsg.tool_calls && amsg.tool_calls.length > 0) {
                const tools = amsg.tool_calls.map((t: any) => t.function?.name || "unknown").join(", ");
                contentStr += ` [Invoked Tools: ${tools}]`;
            }
        }
        
        if (msg.role === "tool") {
            const tmsg = msg as any;
            contentStr = `[Tool Result: ${tmsg.tool_call_id || "unknown"}] ` + contentStr;
        }

        if (contentStr.trim().length === 0) {
            contentStr = "(empty or complex content)";
        }

        lines.push(`  - ${msg.role}: ${contentStr}`);
    }

    lines.push("</summary>");
    return lines.join("\n");
}
