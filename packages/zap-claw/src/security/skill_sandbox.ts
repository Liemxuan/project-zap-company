// packages/zap-claw/src/security/skill_sandbox.ts
// BLAST-IRONCLAD Phase 6: VM-based Skill Execution Sandbox
// Provides isolated execution context for untrusted/marketplace skills.
// Trusted (built-in) skills bypass this entirely for zero overhead.
// Adapted from Paperclip's plugin-runtime-sandbox.ts pattern.

import vm from "node:vm";
import path from "node:path";
import { readFileSync, existsSync, realpathSync } from "node:fs";

const DEFAULT_TIMEOUT_MS = 3_000;
const MAX_TIMEOUT_MS = 10_000;

// Allowlisted globals for sandboxed skill scripts.
// Intentionally excludes: require, process, __dirname, __filename, Buffer (full)
const SANDBOX_GLOBALS = {
  console: {
    log: (...args: any[]) => console.log("[SANDBOX]", ...args),
    warn: (...args: any[]) => console.warn("[SANDBOX]", ...args),
    error: (...args: any[]) => console.error("[SANDBOX]", ...args),
  },
  setTimeout,
  clearTimeout,
  URL,
  TextEncoder,
  TextDecoder,
  JSON,
  Math,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Map,
  Set,
  RegExp,
  Error,
  Promise,
};

// Modules that sandboxed skills are allowed to import.
// Everything else is blocked.
const ALLOWED_MODULES = new Set([
  "url",
  "querystring",
  "path",
  "crypto",      // hashing only, not system access
]);

export interface SandboxResult {
  output: unknown;
  durationMs: number;
  timedOut: boolean;
}

/**
 * Checks whether `targetPath` is within `rootPath` to prevent directory traversal.
 */
function isWithinRoot(targetPath: string, rootPath: string): boolean {
  const relative = path.relative(rootPath, targetPath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

/**
 * Creates a restricted `require` function for the sandbox.
 * Only allows importing from the ALLOWED_MODULES set.
 * Blocks filesystem, network, child_process, and all other Node.js APIs.
 */
function createSandboxedRequire(skillRoot: string) {
  return function sandboxedRequire(moduleId: string): unknown {
    // Block relative path traversal
    if (moduleId.startsWith(".") || moduleId.startsWith("/")) {
      const resolved = path.resolve(skillRoot, moduleId);
      if (!isWithinRoot(resolved, skillRoot)) {
        throw new Error(
          `[SANDBOX] BLOCKED: Path traversal attempt — ${moduleId} escapes skill root.`
        );
      }
      // Allow loading files within the skill's own directory
      if (existsSync(resolved)) {
        const code = readFileSync(resolved, "utf-8");
        const moduleContext = vm.createContext({
          ...SANDBOX_GLOBALS,
          module: { exports: {} },
          exports: {},
        });
        vm.runInContext(code, moduleContext, {
          filename: resolved,
          timeout: DEFAULT_TIMEOUT_MS,
        });
        return (moduleContext as any).module.exports;
      }
      throw new Error(`[SANDBOX] Module not found: ${moduleId}`);
    }

    // Only allow builtin modules from the allowlist
    if (ALLOWED_MODULES.has(moduleId)) {
      return require(moduleId);
    }

    throw new Error(
      `[SANDBOX] BLOCKED: Module '${moduleId}' is not in the allowlist. ` +
        `Allowed: ${Array.from(ALLOWED_MODULES).join(", ")}`
    );
  };
}

/**
 * Executes a skill script inside a VM sandbox with restricted globals,
 * module allowlisting, and execution timeout.
 *
 * @param entryPath Absolute path to the skill's entry script
 * @param timeoutMs Maximum execution time (default: 3000ms, max: 10000ms)
 * @returns SandboxResult with execution output and timing
 */
export async function executeSkillInSandbox(opts: {
  entryPath: string;
  timeoutMs?: number;
  injectedContext?: Record<string, unknown>;
}): Promise<SandboxResult> {
  const startTime = Date.now();
  const timeout = Math.min(
    opts.timeoutMs || DEFAULT_TIMEOUT_MS,
    MAX_TIMEOUT_MS
  );

  if (!existsSync(opts.entryPath)) {
    throw new Error(`[SANDBOX] Skill entry not found: ${opts.entryPath}`);
  }

  const skillRoot = realpathSync(path.dirname(opts.entryPath));
  const code = readFileSync(opts.entryPath, "utf-8");

  // Build the isolated context
  const contextGlobals = {
    ...SANDBOX_GLOBALS,
    require: createSandboxedRequire(skillRoot),
    module: { exports: {} as Record<string, unknown> },
    exports: {} as Record<string, unknown>,
    __skillRoot: skillRoot,
    // Inject any caller-provided context (e.g., user query, agent config)
    ...(opts.injectedContext || {}),
  };

  const context = vm.createContext(contextGlobals);

  let output: unknown;
  let timedOut = false;

  try {
    const script = new vm.Script(code, { filename: opts.entryPath });
    output = script.runInContext(context, { timeout });

    // If the script exports a function, it might be the entry point
    const moduleExports = (context as any).module.exports;
    if (typeof moduleExports === "function") {
      output = moduleExports;
    } else if (
      typeof moduleExports === "object" &&
      Object.keys(moduleExports).length > 0
    ) {
      output = moduleExports;
    }
  } catch (err: any) {
    if (err.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
      timedOut = true;
      console.error(
        `[SANDBOX] ⏱️ Skill execution timed out after ${timeout}ms: ${opts.entryPath}`
      );
    }
    throw err;
  }

  const durationMs = Date.now() - startTime;

  console.log(
    `[SANDBOX] ✅ Skill executed in ${durationMs}ms (timeout: ${timeout}ms, timedOut: ${timedOut})`
  );

  return { output, durationMs, timedOut };
}
