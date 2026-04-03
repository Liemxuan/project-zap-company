// Extracted from claw-code Rust harness (crates/runtime/src/hooks.rs & conversation.rs)
// Ported to TypeScript for the Olympus Native Router.

export type PermissionOutcome = "ALLOW" | "DENY" | "PROMPT";

export interface HookRunResult {
    updatedInput?: Record<string, unknown>;
    permissionOverride?: PermissionOutcome;
    permissionReason?: string;
    messages: string[];
    isDenied: boolean;
    isCancelled: boolean;
}

export interface PermissionContext {
    override?: PermissionOutcome;
    reason?: string;
}

export class HookRunner {
    async runPreToolUse(toolName: string, input: Record<string, unknown>): Promise<HookRunResult> {
        // Evaluate pre-flight conditions to explicitly allow or deny
        // Matches `run_pre_tool_use_hook` in claw-code/conversation.rs
        const inputString = JSON.stringify(input).toLowerCase();
        const messages: string[] = [];
        let override: PermissionOutcome | undefined = undefined;
        let reason: string | undefined = undefined;

        // ACP Zero-Trust: Defense in Depth (ZSS)
        
        // 1. Secret Leakage & File system bounds
        if (inputString.includes(".env") || inputString.includes("id_rsa") || inputString.includes("secret") || inputString.includes(".pem")) {
            override = "DENY";
            reason = "ACP Zero-Trust: Accessing environment variables, SSH keys, or secrets is strictly prohibited.";
            messages.push(reason);
        }

        // 2. Privilege Escalation & Unsafe Execution
        if (toolName === "execute_bash" || toolName === "run_script") {
            if (inputString.includes("sudo") || inputString.includes("chmod") || inputString.includes("chown")) {
                override = "DENY";
                reason = "ACP Zero-Trust: Privilege escalation (sudo/chmod/chown) is strictly prohibited by ZSS protocol.";
                messages.push(reason);
            }
        }

        const result: HookRunResult = {
            updatedInput: input,
            messages,
            isDenied: override === "DENY",
            isCancelled: false
        };

        if (override !== undefined) {
            result.permissionOverride = override;
        }
        if (reason !== undefined) {
            result.permissionReason = reason;
        }

        return result;
    }

    async runPostToolUse(toolName: string, input: Record<string, unknown>, output: string, isError: boolean): Promise<HookRunResult> {
        // Matches `run_post_tool_use_hook`
        const messages: string[] = [];
        
        // ACP Zero-Trust: Token Exhaustion Prevention
        if (output && output.length > 50000) {
            messages.push("🚨 ACP WARNING: Tool output exceeds 50KB limit. Compaction recommended to prevent Token DoS.");
        }

        return {
            messages,
            isDenied: false,
            isCancelled: false
        };
    }

    async runPostToolUseFailure(toolName: string, input: Record<string, unknown>, output: string): Promise<HookRunResult> {
        // Matches `run_post_tool_use_failure_hook`
        return {
            messages: ["🚨 ACP FAILURE TRACE DUMP: Execution breached integrity bounds or crashed."],
            isDenied: false,
            isCancelled: false
        };
    }
}

export function mergeHookFeedback(messages: string[], output: string, isError: boolean): string {
    if (!messages || messages.length === 0) return output;
    
    // Derived from `merge_hook_feedback` in Rust
    const formattedMessages = messages.map(msg => `[Hook Feedback]: ${msg}`).join("\n");
    return `${output}\n\n${formattedMessages}`;
}

export class PermissionPolicy {
    async authorize(toolName: string, input: Record<string, unknown>, context: PermissionContext): Promise<{ outcome: PermissionOutcome, reason?: string }> {
        // High-stakes gating logic derived from Rust PermissionPrompter
        if (context.override === "DENY") {
            return { outcome: "DENY", reason: context.reason || "Pre-flight hook denied execution." };
        }
        
        // Example: Certain tools always require a prompt
        if (toolName === "execute_bash" || toolName === "mongodb_query") {
            return { outcome: "PROMPT", reason: "Tool requires explicit human verification." };
        }

        return { outcome: "ALLOW" };
    }
}
