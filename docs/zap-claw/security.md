# Zap Claw — Security Model

## Non-Negotiable Rules

These are enforced in code, not just policy:

| Rule | Where enforced |
|------|---------------|
| Only whitelisted Telegram user IDs can interact | `src/bot.ts` — security middleware, silent drop |
| No web server, no exposed ports | Long polling only, no `app.listen()` anywhere |
| Secrets in `.env` only | Never in code, never in logs, `.env` in `.gitignore` |
| Agent loop hard cap | `MAX_ITERATIONS = 10` in `src/agent.ts` |
| No third-party skill files | All integrations via MCP (Level 4) — separate process, auditable |

---

## Threat Model

### Unauthorized Telegram access
**Risk:** Someone who knows your bot's username tries to use it.
**Mitigation:** Security middleware in `bot.ts` runs before any handler. If `ctx.from.id` is not in `ALLOWED_USER_IDS`, the update is silently dropped — no reply, no error, no log. The attacker learns nothing.

### Secret leakage
**Risk:** API keys exposed in code, logs, or git history.
**Mitigation:**
- All secrets in `.env` (gitignored)
- `console.log` statements never include env var values
- System prompt explicitly tells Claude not to repeat secrets
- `.env.example` has placeholder values only

### Runaway agent loop
**Risk:** Claude enters an infinite tool-calling loop, burning tokens.
**Mitigation:** `MAX_ITERATIONS = 10` hard cap. On breach, loop returns an error message and stops. No re-entry.

### Malicious tool execution
**Risk:** User crafts a message that tricks Claude into running destructive commands.
**Mitigation (Level 4):** Shell tool requires explicit confirmation for any destructive operation. All tools are registered in a closed registry — no dynamic tool loading.

### Token/cost explosion
**Risk:** A compromised key gets used by others.
**Mitigation:**
- Bot is restricted to whitelisted user IDs — no one else can trigger API calls
- For multi-tenant: each account has its own keys, isolated from others

---

## Secrets Checklist

Before any git commit, verify:
- [ ] `.env` is in `.gitignore` ✅
- [ ] No API keys in any `.ts` or `.js` file
- [ ] No API keys in `docs/` or `readme.md`
- [ ] `.env.example` has only placeholder values

---

## Multi-Tenant Security Additions (Level 2+)

When storing per-user API keys in SQLite:
- API keys must be encrypted at rest (AES-256)
- Encryption key derived from a master secret in `.env`
- Never log decrypted API keys
- Key rotation: when a user removes a key, it is zeroed in DB before deletion
