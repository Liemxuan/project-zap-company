// packages/zap-claw/src/security/agent_jwt.ts
// BLAST-IRONCLAD Phase 3: Per-Agent JWT Authentication
// Provides cryptographic proof-of-identity for agents hitting zap-claw APIs.
// Adapted from Paperclip's agent-auth-jwt.ts pattern.
// Uses HMAC-SHA256 with constant-time comparison via timingSafeEqual.

import crypto from "node:crypto";

const JWT_SECRET = process.env.AGENT_JWT_SECRET || "zap-ironclad-default-secret-CHANGE-ME";
const JWT_ISSUER = "zap-claw";
const JWT_AUDIENCE = "zap-swarm";
const DEFAULT_TTL_SECONDS = 24 * 60 * 60; // 24 hours

export interface AgentClaims {
  sub: string;           // Agent ID (e.g., "spike", "jerry")
  tenant_id: string;     // Tenant context
  role: string;          // Agent profession/role
  run_id: string;        // Unique boot/run identifier
  iss: string;           // Issuer (always "zap-claw")
  aud: string;           // Audience (always "zap-swarm")
  iat: number;           // Issued at (epoch seconds)
  exp: number;           // Expiry (epoch seconds)
}

// ---- Base64url helpers ----

function base64urlEncode(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data, "utf-8") : data;
  return buf.toString("base64url");
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString("utf-8");
}

// ---- Core JWT Functions ----

/**
 * Issues a signed JWT for an agent.
 * Called once at agent boot time via POST /api/agent/token.
 */
export function issueAgentJwt(opts: {
  agentId: string;
  tenantId: string;
  role: string;
  ttlSeconds?: number;
}): string {
  const now = Math.floor(Date.now() / 1000);
  const runId = crypto.randomUUID();

  const header = { alg: "HS256", typ: "JWT" };
  const payload: AgentClaims = {
    sub: opts.agentId,
    tenant_id: opts.tenantId,
    role: opts.role,
    run_id: runId,
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    iat: now,
    exp: now + (opts.ttlSeconds || DEFAULT_TTL_SECONDS),
  };

  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signingInput)
    .digest();

  return `${signingInput}.${base64urlEncode(signature)}`;
}

/**
 * Verifies a JWT and returns the decoded claims if valid.
 * Uses timingSafeEqual to prevent timing attacks on signature comparison.
 * Returns null if the token is invalid, expired, or malformed.
 */
export function verifyAgentJwt(token: string): AgentClaims | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  // Recompute signature
  const signingInput = `${headerB64}.${payloadB64}`;
  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signingInput)
    .digest();

  const providedSig = Buffer.from(signatureB64!, "base64url");

  // Constant-time comparison to prevent timing attacks
  if (expectedSig.length !== providedSig.length) return null;
  if (!crypto.timingSafeEqual(expectedSig, providedSig)) return null;

  // Parse payload
  try {
    const claims: AgentClaims = JSON.parse(base64urlDecode(payloadB64!));

    // Validate issuer and audience
    if (claims.iss !== JWT_ISSUER) return null;
    if (claims.aud !== JWT_AUDIENCE) return null;

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) return null;

    return claims;
  } catch {
    return null;
  }
}

// ---- Express Middleware ----

/**
 * Express middleware that requires a valid agent JWT in the Authorization header.
 * Populates `req.agentClaims` with the decoded token payload.
 *
 * Usage:
 *   app.use('/api/memory', requireAgentJwt, memoryRoutes);
 *
 * To opt-in gradually, apply to specific routes rather than globally.
 */
export function requireAgentJwt(
  req: any,
  res: any,
  next: () => void
): void {
  // Skip in development if AGENT_JWT_ENFORCE is not set
  if (process.env.AGENT_JWT_ENFORCE !== "true") {
    return next();
  }

  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Missing agent JWT. Send Authorization: Bearer <token>",
    });
    return;
  }

  const token = authHeader.slice(7);
  const claims = verifyAgentJwt(token);

  if (!claims) {
    res.status(401).json({ error: "Invalid or expired agent JWT." });
    return;
  }

  // Attach claims to request for downstream route handlers
  req.agentClaims = claims;
  next();
}

// ---- Health Check ----

/**
 * Quick check to verify the JWT infrastructure is operational.
 * Issues a test token, verifies it, and returns success/failure.
 */
export function selfTest(): boolean {
  const token = issueAgentJwt({
    agentId: "self-test",
    tenantId: "OLYMPUS",
    role: "HEALTH_CHECK",
  });
  const claims = verifyAgentJwt(token);
  return claims !== null && claims.sub === "self-test";
}
