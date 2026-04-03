/**
 * ZAP Permission Policy
 * Ported from claw-code/rust/crates/runtime/src/permissions.rs (676 lines)
 * 
 * Implements allow/deny/ask rule matching with hook override integration.
 * Rules use the format: toolName(pattern) where pattern supports wildcards.
 * 
 * Examples:
 *   "Bash"                → matches all Bash invocations
 *   "Bash(git:*)"         → matches Bash where input starts with "git"
 *   "Bash(rm -rf:*)"      → matches destructive rm commands
 */

import type {
  PermissionMode,
  PermissionOverride,
  PermissionContext,
  PermissionOutcome,
  PermissionPrompter,
  PermissionRequest,
} from "./types.js";

// ─── Permission Modes (ordered by escalation) ────────────────────────

const MODE_ORDER: Record<PermissionMode, number> = {
  "read-only": 0,
  "workspace-write": 1,
  "danger-full-access": 2,
  "prompt": 3,
  "allow": 4,
};

export interface PermissionRuleConfig {
  allow: string[];
  deny: string[];
  ask: string[];
}

// ─── Permission Rule ─────────────────────────────────────────────────

interface PermissionRule {
  raw: string;
  toolName: string;
  matcher: RuleMatcher;
}

type RuleMatcher =
  | { type: "any" }
  | { type: "exact"; value: string }
  | { type: "prefix"; prefix: string };

function parseRule(raw: string): PermissionRule {
  const trimmed = raw.trim();
  const openParen = trimmed.indexOf("(");
  const closeParen = trimmed.lastIndexOf(")");

  if (openParen !== -1 && closeParen === trimmed.length - 1 && openParen < closeParen) {
    const toolName = trimmed.substring(0, openParen).trim();
    const content = trimmed.substring(openParen + 1, closeParen).trim();

    if (toolName) {
      return {
        raw: trimmed,
        toolName,
        matcher: parseRuleMatcher(content),
      };
    }
  }

  return {
    raw: trimmed,
    toolName: trimmed,
    matcher: { type: "any" },
  };
}

function parseRuleMatcher(content: string): RuleMatcher {
  if (!content || content === "*") {
    return { type: "any" };
  }
  if (content.endsWith(":*")) {
    return { type: "prefix", prefix: content.slice(0, -2) };
  }
  return { type: "exact", value: content };
}

function ruleMatches(rule: PermissionRule, toolName: string, input: string): boolean {
  if (rule.toolName !== toolName) return false;

  switch (rule.matcher.type) {
    case "any":
      return true;
    case "exact": {
      const subject = extractPermissionSubject(input);
      return subject === rule.matcher.value;
    }
    case "prefix": {
      const subject = extractPermissionSubject(input);
      return subject !== null && subject.startsWith(rule.matcher.prefix);
    }
  }
}

/**
 * Extract the "subject" from tool input for rule matching.
 * Looks for common keys: command, path, file_path, filePath, url, pattern.
 */
function extractPermissionSubject(input: string): string | null {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "object" && parsed !== null) {
      for (const key of ["command", "path", "file_path", "filePath", "url", "pattern", "code"]) {
        if (typeof parsed[key] === "string") {
          return parsed[key];
        }
      }
    }
  } catch {
    // Not JSON — use raw input
  }
  return input.trim() || null;
}

// ─── Permission Policy ──────────────────────────────────────────────

export class PermissionPolicy {
  private activeMode: PermissionMode;
  private toolRequirements: Map<string, PermissionMode>;
  private allowRules: PermissionRule[];
  private denyRules: PermissionRule[];
  private askRules: PermissionRule[];

  constructor(activeMode: PermissionMode) {
    this.activeMode = activeMode;
    this.toolRequirements = new Map();
    this.allowRules = [];
    this.denyRules = [];
    this.askRules = [];
  }

  withToolRequirement(toolName: string, requiredMode: PermissionMode): this {
    this.toolRequirements.set(toolName, requiredMode);
    return this;
  }

  withPermissionRules(config: PermissionRuleConfig): this {
    this.allowRules = config.allow.map(parseRule);
    this.denyRules = config.deny.map(parseRule);
    this.askRules = config.ask.map(parseRule);
    return this;
  }

  requiredModeFor(toolName: string): PermissionMode {
    return this.toolRequirements.get(toolName) ?? "danger-full-access";
  }

  async authorize(
    toolName: string,
    input: string,
    prompter?: PermissionPrompter
  ): Promise<PermissionOutcome> {
    return this.authorizeWithContext(toolName, input, {}, prompter);
  }

  async authorizeWithContext(
    toolName: string,
    input: string,
    context: PermissionContext,
    prompter?: PermissionPrompter
  ): Promise<PermissionOutcome> {
    // 1. Check deny rules first (absolute block)
    const denyRule = this.findMatchingRule(this.denyRules, toolName, input);
    if (denyRule) {
      return {
        type: "deny",
        reason: `Permission to use ${toolName} denied by rule '${denyRule.raw}'`,
      };
    }

    const currentMode = this.activeMode;
    const requiredMode = this.requiredModeFor(toolName);
    const askRule = this.findMatchingRule(this.askRules, toolName, input);
    const allowRule = this.findMatchingRule(this.allowRules, toolName, input);

    // 2. Handle hook overrides
    switch (context.override) {
      case "deny":
        return {
          type: "deny",
          reason: context.reason ?? `Tool '${toolName}' denied by hook`,
        };

      case "ask":
        return this.promptOrDeny(toolName, input, currentMode, requiredMode, context.reason, prompter);

      case "allow":
        // Hook allows, but ask rules still take precedence
        if (askRule) {
          return this.promptOrDeny(
            toolName, input, currentMode, requiredMode,
            `Tool '${toolName}' requires approval (ask rule '${askRule.raw}')`,
            prompter
          );
        }
        if (allowRule || currentMode === "allow" || MODE_ORDER[currentMode] >= MODE_ORDER[requiredMode]) {
          return { type: "allow" };
        }
        break;
    }

    // 3. Standard flow (no hook override)
    if (askRule) {
      return this.promptOrDeny(
        toolName, input, currentMode, requiredMode,
        `Tool '${toolName}' requires approval (ask rule '${askRule.raw}')`,
        prompter
      );
    }

    if (allowRule || currentMode === "allow" || MODE_ORDER[currentMode] >= MODE_ORDER[requiredMode]) {
      return { type: "allow" };
    }

    // 4. Prompt if we can escalate
    if (
      currentMode === "prompt" ||
      (currentMode === "workspace-write" && requiredMode === "danger-full-access")
    ) {
      return this.promptOrDeny(
        toolName, input, currentMode, requiredMode,
        `Tool '${toolName}' requires escalation from ${currentMode} to ${requiredMode}`,
        prompter
      );
    }

    // 5. Default deny
    return {
      type: "deny",
      reason: `Tool '${toolName}' requires ${requiredMode} permission; current mode is ${currentMode}`,
    };
  }

  private async promptOrDeny(
    toolName: string,
    input: string,
    currentMode: PermissionMode,
    requiredMode: PermissionMode,
    reason: string | undefined,
    prompter?: PermissionPrompter
  ): Promise<PermissionOutcome> {
    if (!prompter) {
      return {
        type: "deny",
        reason: reason ?? `Tool '${toolName}' requires approval (no prompter available)`,
      };
    }

    const decision = await prompter.decide({
      toolName,
      input,
      currentMode,
      requiredMode,
      reason,
    });

    return decision.type === "allow"
      ? { type: "allow" }
      : { type: "deny", reason: decision.reason };
  }

  private findMatchingRule(
    rules: PermissionRule[],
    toolName: string,
    input: string
  ): PermissionRule | undefined {
    return rules.find((rule) => ruleMatches(rule, toolName, input));
  }
}
