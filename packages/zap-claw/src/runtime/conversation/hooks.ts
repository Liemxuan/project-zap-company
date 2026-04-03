/**
 * ZAP Hook Runner
 * Ported from claw-code/rust/crates/runtime/src/hooks.rs (988 lines)
 * 
 * Executes PreToolUse/PostToolUse/PostToolUseFailure hooks as shell commands,
 * with JSON payload on stdin and structured JSON output parsing.
 * 
 * Hook contracts:
 * - Exit 0: Allow (parse stdout for JSON control directives)
 * - Exit 2: Deny (tool is blocked)
 * - Other exits: Failure (logged, but pipeline continues)
 * - Hooks receive env vars: HOOK_EVENT, HOOK_TOOL_NAME, HOOK_TOOL_INPUT
 * - Stdout can be JSON with: { decision, systemMessage, hookSpecificOutput }
 */

import { exec } from "child_process";
import type {
  HookEvent,
  HookRunResult,
  HookProgressEvent,
  HookProgressReporter,
  PermissionOverride,
} from "./types.js";

export interface HookConfig {
  preToolUse: string[];
  postToolUse: string[];
  postToolUseFailure: string[];
}

const EMPTY_RESULT: HookRunResult = {
  isDenied: false,
  isFailed: false,
  isCancelled: false,
  messages: [],
};

// ─── Abort Signal ─────────────────────────────────────────────────────

export class HookAbortSignal {
  private _aborted = false;

  abort(): void {
    this._aborted = true;
  }

  get isAborted(): boolean {
    return this._aborted;
  }
}

// ─── Hook Runner ──────────────────────────────────────────────────────

export class HookRunner {
  private config: HookConfig;

  constructor(config: Partial<HookConfig> = {}) {
    this.config = {
      preToolUse: config.preToolUse ?? [],
      postToolUse: config.postToolUse ?? [],
      postToolUseFailure: config.postToolUseFailure ?? [],
    };
  }

  async runPreToolUse(
    toolName: string,
    toolInput: string,
    abortSignal?: HookAbortSignal,
    reporter?: HookProgressReporter
  ): Promise<HookRunResult> {
    return this.runCommands(
      "PreToolUse",
      this.config.preToolUse,
      toolName,
      toolInput,
      undefined,
      false,
      abortSignal,
      reporter
    );
  }

  async runPostToolUse(
    toolName: string,
    toolInput: string,
    toolOutput: string,
    isError: boolean,
    abortSignal?: HookAbortSignal,
    reporter?: HookProgressReporter
  ): Promise<HookRunResult> {
    return this.runCommands(
      "PostToolUse",
      this.config.postToolUse,
      toolName,
      toolInput,
      toolOutput,
      isError,
      abortSignal,
      reporter
    );
  }

  async runPostToolUseFailure(
    toolName: string,
    toolInput: string,
    toolError: string,
    abortSignal?: HookAbortSignal,
    reporter?: HookProgressReporter
  ): Promise<HookRunResult> {
    return this.runCommands(
      "PostToolUseFailure",
      this.config.postToolUseFailure,
      toolName,
      toolInput,
      toolError,
      true,
      abortSignal,
      reporter
    );
  }

  // ─── Internal Pipeline ───────────────────────────────────────────

  private async runCommands(
    event: HookEvent,
    commands: string[],
    toolName: string,
    toolInput: string,
    toolOutput: string | undefined,
    isError: boolean,
    abortSignal?: HookAbortSignal,
    reporter?: HookProgressReporter
  ): Promise<HookRunResult> {
    if (commands.length === 0) {
      return { ...EMPTY_RESULT };
    }

    if (abortSignal?.isAborted) {
      return {
        ...EMPTY_RESULT,
        isCancelled: true,
        messages: [`${event} hook cancelled before execution`],
      };
    }

    const payload = buildHookPayload(event, toolName, toolInput, toolOutput, isError);
    const result: HookRunResult = { ...EMPTY_RESULT, messages: [] };

    for (const command of commands) {
      reporter?.onEvent({
        type: "started",
        event,
        toolName,
        command,
      });

      if (abortSignal?.isAborted) {
        reporter?.onEvent({ type: "cancelled", event, toolName, command });
        result.isCancelled = true;
        result.messages.push(`${event} hook '${command}' cancelled`);
        return result;
      }

      try {
        const outcome = await runSingleCommand(command, event, toolName, toolInput, toolOutput, isError, payload);

        reporter?.onEvent({
          type: outcome.type === "cancelled" ? "cancelled" : "completed",
          event,
          toolName,
          command,
        });

        if (outcome.type === "allow") {
          mergeParsedOutput(result, outcome.parsed);
        } else if (outcome.type === "deny") {
          mergeParsedOutput(result, outcome.parsed);
          result.isDenied = true;
          return result;
        } else if (outcome.type === "failed") {
          mergeParsedOutput(result, outcome.parsed);
          result.isFailed = true;
          return result;
        } else if (outcome.type === "cancelled") {
          result.isCancelled = true;
          result.messages.push(outcome.message);
          return result;
        }
      } catch (err) {
        reporter?.onEvent({ type: "completed", event, toolName, command });
        result.isFailed = true;
        result.messages.push(
          `${event} hook '${command}' failed to start: ${err instanceof Error ? err.message : String(err)}`
        );
        return result;
      }
    }

    return result;
  }
}

// ─── Built-in Security Hooks (ZSS) ───────────────────────────────────

/**
 * Creates a HookRunner with ZAP's built-in security rules pre-wired.
 * These run in-process (no shell), augmented by any config-provided shell hooks.
 */
export class ZSSHookRunner extends HookRunner {
  constructor(config: Partial<HookConfig> = {}) {
    super(config);
  }

  override async runPreToolUse(
    toolName: string,
    toolInput: string,
    abortSignal?: HookAbortSignal,
    reporter?: HookProgressReporter
  ): Promise<HookRunResult> {
    // Phase 1: Run built-in ZSS checks (in-process, instant)
    const zssResult = this.zssPreCheck(toolName, toolInput);
    if (zssResult.isDenied) return zssResult;

    // Phase 2: Run configured shell hooks
    const shellResult = await super.runPreToolUse(toolName, toolInput, abortSignal, reporter);

    // Merge: ZSS messages + shell messages
    return {
      ...shellResult,
      messages: [...zssResult.messages, ...shellResult.messages],
      isDenied: shellResult.isDenied || zssResult.isDenied,
    };
  }

  private zssPreCheck(toolName: string, toolInput: string): HookRunResult {
    const inputLower = toolInput.toLowerCase();
    const messages: string[] = [];

    // Secret leakage prevention
    const secretPatterns = [".env", "id_rsa", ".pem", "secret_key", "api_key", "access_token"];
    for (const pattern of secretPatterns) {
      if (inputLower.includes(pattern)) {
        return {
          isDenied: true,
          isFailed: false,
          isCancelled: false,
          messages: [`ZSS: Access to '${pattern}' blocked — secret leakage prevention`],
          permissionOverride: "deny",
          permissionReason: "ZSS secret containment",
        };
      }
    }

    // Privilege escalation
    if (toolName === "run_command" || toolName === "execute_bash" || toolName === "Bash") {
      const dangerousPatterns = ["sudo ", "chmod 777", "chown root", "rm -rf /"];
      for (const pattern of dangerousPatterns) {
        if (inputLower.includes(pattern)) {
          return {
            isDenied: true,
            isFailed: false,
            isCancelled: false,
            messages: [`ZSS: Privilege escalation blocked — '${pattern}' is prohibited`],
            permissionOverride: "deny",
            permissionReason: "ZSS privilege escalation prevention",
          };
        }
      }
    }

    return { ...EMPTY_RESULT, messages };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────

interface ParsedHookOutput {
  messages: string[];
  deny: boolean;
  permissionOverride?: PermissionOverride;
  permissionReason?: string;
  updatedInput?: string;
}

type CommandOutcome =
  | { type: "allow"; parsed: ParsedHookOutput }
  | { type: "deny"; parsed: ParsedHookOutput }
  | { type: "failed"; parsed: ParsedHookOutput }
  | { type: "cancelled"; message: string };

function buildHookPayload(
  event: HookEvent,
  toolName: string,
  toolInput: string,
  toolOutput: string | undefined,
  isError: boolean
): string {
  const parsed = safeJsonParse(toolInput);
  return JSON.stringify({
    hook_event_name: event,
    tool_name: toolName,
    tool_input: parsed,
    tool_input_json: toolInput,
    tool_output: toolOutput ?? null,
    tool_result_is_error: isError,
  });
}

function runSingleCommand(
  command: string,
  event: HookEvent,
  toolName: string,
  toolInput: string,
  toolOutput: string | undefined,
  isError: boolean,
  payload: string
): Promise<CommandOutcome> {
  return new Promise((resolve, reject) => {
    const child = exec(command, {
      timeout: 30_000, // 30s max for any hook
      env: {
        ...process.env,
        HOOK_EVENT: event,
        HOOK_TOOL_NAME: toolName,
        HOOK_TOOL_INPUT: toolInput,
        HOOK_TOOL_IS_ERROR: isError ? "1" : "0",
        ...(toolOutput !== undefined ? { HOOK_TOOL_OUTPUT: toolOutput } : {}),
      },
    });

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (data) => (stdout += data));
    child.stderr?.on("data", (data) => (stderr += data));

    // Write payload to stdin
    if (child.stdin) {
      child.stdin.write(payload);
      child.stdin.end();
    }

    child.on("error", reject);
    child.on("close", (code) => {
      const trimmedStdout = stdout.trim();
      const parsed = parseHookOutput(trimmedStdout);

      switch (code) {
        case 0:
          resolve(
            parsed.deny
              ? { type: "deny", parsed }
              : { type: "allow", parsed }
          );
          break;
        case 2:
          resolve({
            type: "deny",
            parsed: withFallback(parsed, `${event} hook denied tool '${toolName}'`),
          });
          break;
        default:
          resolve({
            type: "failed",
            parsed: withFallback(
              parsed,
              `Hook '${command}' exited with status ${code}${stderr ? `: ${stderr.trim()}` : ""}`
            ),
          });
          break;
      }
    });
  });
}

function parseHookOutput(stdout: string): ParsedHookOutput {
  if (!stdout) {
    return { messages: [], deny: false };
  }

  try {
    const root = JSON.parse(stdout);
    if (typeof root !== "object" || root === null) {
      return { messages: [stdout], deny: false };
    }

    const parsed: ParsedHookOutput = { messages: [], deny: false };

    if (typeof root.systemMessage === "string") {
      parsed.messages.push(root.systemMessage);
    }
    if (typeof root.reason === "string") {
      parsed.messages.push(root.reason);
    }
    if (root.continue === false || root.decision === "block") {
      parsed.deny = true;
    }

    const specific = root.hookSpecificOutput;
    if (specific && typeof specific === "object") {
      if (typeof specific.additionalContext === "string") {
        parsed.messages.push(specific.additionalContext);
      }
      if (specific.permissionDecision === "allow" || specific.permissionDecision === "deny" || specific.permissionDecision === "ask") {
        parsed.permissionOverride = specific.permissionDecision as PermissionOverride;
      }
      if (typeof specific.permissionDecisionReason === "string") {
        parsed.permissionReason = specific.permissionDecisionReason;
      }
      if (specific.updatedInput !== undefined) {
        parsed.updatedInput = JSON.stringify(specific.updatedInput);
      }
    }

    if (parsed.messages.length === 0) {
      parsed.messages.push(stdout);
    }

    return parsed;
  } catch {
    return { messages: [stdout], deny: false };
  }
}

function withFallback(parsed: ParsedHookOutput, fallback: string): ParsedHookOutput {
  if (parsed.messages.length === 0) {
    parsed.messages.push(fallback);
  }
  return parsed;
}

function mergeParsedOutput(target: HookRunResult, parsed: ParsedHookOutput): void {
  target.messages.push(...parsed.messages);
  if (parsed.permissionOverride) target.permissionOverride = parsed.permissionOverride;
  if (parsed.permissionReason) target.permissionReason = parsed.permissionReason;
  if (parsed.updatedInput) target.updatedInput = parsed.updatedInput;
}

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return { raw: input };
  }
}

/**
 * Merge hook feedback messages into tool output, matching claw-code's merge_hook_feedback.
 */
export function mergeHookFeedback(
  messages: string[],
  output: string,
  isError: boolean
): string {
  if (!messages.length) return output;

  const sections: string[] = [];
  if (output.trim()) sections.push(output);

  const label = isError ? "Hook feedback (error)" : "Hook feedback";
  sections.push(`${label}:\n${messages.join("\n")}`);
  return sections.join("\n\n");
}
