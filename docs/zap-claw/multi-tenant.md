# Zap Claw — Multi-Tenant Design

## Overview

Each person you onboard gets a fully isolated account. Their data, their keys, their conversations — completely separate from every other account.

---

## Account Model

```
Account
├── telegram_id       (unique identifier — their Telegram user ID)
├── display_name      (for your reference as admin)
├── key_mode          "single" | "round-robin"
└── api_keys[]
    ├── provider      "openrouter" | "anthropic" | "openai"
    ├── model         e.g. "anthropic/claude-opus-4-5"
    ├── priority      0 = first, 1 = second, etc.
    └── api_key_enc   AES-256 encrypted at rest
```

---

## Key Modes

### Single
One key, one model. Simple. If it gets rate-limited, the user sees a message to try again.

```
Message → key[0] → LLM → reply
```

### Round-Robin
Up to 5 keys. Rotates automatically on rate-limit errors. Silent to the user.

```
Message → key[0]
  → 429? cooldown key[0] for 60s → try key[1]
  → 429? cooldown key[1] for 60s → try key[2]
  → success → reply
  → all keys cooling? → "I'm rate-limited. Try in ~60 seconds."
```

**Max keys per account:** 5
- 1–3: typical individual
- 4–5: heavy user
- More than 5: should upgrade their API plan instead

---

## Provider Strategy

Recommendation: **OpenRouter for all accounts**

OpenRouter is already the aggregator for Anthropic, Google, OpenAI, and others. One SDK, one API format, maximum model flexibility. Users pick any model available on OpenRouter.

Supporting direct providers (Anthropic API, OpenAI API directly) is possible but requires maintaining multiple SDKs — skip unless specifically needed.

---

## Onboarding Flow (Telegram commands)

```
/register
  → Creates account record in DB
  → Prompts to add first key

/addkey
  → Bot asks: provider? (default: openrouter)
  → Bot asks: model? (shows suggestions)
  → Bot asks: API key?
  → Key encrypted, stored in DB

/setmode single|roundrobin
  → Updates account key_mode

/keys
  → Lists current keys (masked: sk-or-v1-xxxx...xxxx)

/removekey [id]
  → Zeroes + deletes key from DB

/status
  → Shows current config summary
```

---

## Admin Commands (Owner Only)

```
/admin list            → all accounts + status
/admin suspend [id]    → disable an account
/admin unsuspend [id]  → re-enable
/admin delete [id]     → permanently remove account + keys
```

Admin commands only available to the owner's Telegram ID (same as `ALLOWED_USER_IDS` for single-user mode, or a separate `ADMIN_USER_ID` env var).

---

## Data Isolation

Every DB query is scoped by `account_id` or `telegram_id`:

```sql
-- Never query without user scope
SELECT * FROM memories WHERE user_id = ? AND ...
SELECT * FROM api_keys WHERE account_id = ? AND ...
```

No cross-account data access is possible at the query level.

---

## Billing Transparency

Each user's API costs go directly to their own OpenRouter account. Zap Claw never sees or aggregates their spend — it just passes through their key to OpenRouter.

You (the service provider) are not in the payment chain. You provide the infrastructure; they bring the keys.
