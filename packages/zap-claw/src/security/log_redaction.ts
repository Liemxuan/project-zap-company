// packages/zap-claw/src/security/log_redaction.ts
// BLAST-IRONCLAD Phase 1: Log Redaction Middleware
// Prevents API keys, JWT tokens, and PII (home dir / username) from leaking
// into Redis trace logs, SSE terminal streams, and Morgan HTTP output.

const SECRET_KEY_RE =
  /(api[-_]?key|access[-_]?token|auth(?:_?token)?|authorization|bearer|secret|passwd|password|credential|jwt|private[-_]?key|cookie|connectionstring)/i;

const JWT_INLINE_RE =
  /\b[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g;

const KEY_VALUE_RE =
  /((?:api[-_]?key|token|secret|password|bearer|authorization)\s*[=:]\s*)([^\s,;"'}{]+)/gi;

const REDACTED = "***REDACTED***";

// ---- PII: Home Directory & Username Scrubbing ----
const HOME_DIR = process.env.HOME || process.env.USERPROFILE || "/Users/unknown";
const USERNAME = process.env.USER || process.env.LOGNAME || "unknown";

// Build a masked username: first char + asterisks
function maskUsername(name: string): string {
  if (!name || name.length === 0) return "*";
  return `${name[0]}${"*".repeat(Math.max(1, name.length - 1))}`;
}

const MASKED_USER = maskUsername(USERNAME);
const MASKED_HOME = HOME_DIR.replace(
  new RegExp(`${escapeRegex(USERNAME)}$`),
  MASKED_USER
);

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---- Core Redaction Functions ----

/**
 * Redacts secrets, JWT tokens, and PII from a log string.
 * This is the primary function used by logTrace() and morgan.
 */
export function redactSecrets(input: string): string {
  if (!input || typeof input !== "string") return input;

  let result = input;

  // 1. Scrub inline JWT-shaped tokens (3-part base64url dot-separated)
  result = result.replace(JWT_INLINE_RE, REDACTED);

  // 2. Scrub key=value patterns for known secret keys
  result = result.replace(KEY_VALUE_RE, `$1${REDACTED}`);

  // 3. Scrub home directory paths (prevents /Users/zap from leaking)
  if (HOME_DIR && HOME_DIR !== "/") {
    result = result.split(HOME_DIR).join(MASKED_HOME);
  }

  // 4. Scrub standalone username in non-path contexts (word-boundary safe)
  if (USERNAME && USERNAME.length > 2) {
    const usernamePattern = new RegExp(
      `(?<![A-Za-z0-9._/-])${escapeRegex(USERNAME)}(?![A-Za-z0-9._-])`,
      "g"
    );
    result = result.replace(usernamePattern, MASKED_USER);
  }

  return result;
}

/**
 * Redacts secret values from a flat key-value record.
 * Used for structured payloads (e.g., event metadata sent to MongoDB).
 */
export function redactRecord(
  record: Record<string, unknown>
): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (SECRET_KEY_RE.test(key)) {
      redacted[key] = REDACTED;
    } else if (
      typeof value === "string" &&
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
    ) {
      // JWT-shaped value regardless of key name
      redacted[key] = REDACTED;
    } else if (typeof value === "string") {
      redacted[key] = redactSecrets(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      redacted[key] = redactRecord(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}
