# 💪 The Arms: Capabilities & Safety

**Target System:** OLYMPUS

## 1. Capabilities

- **Base Arsenal:** `Telegram long-poll, Discord webhook, WhatsApp Cloud API, Redis pub/sub, MongoDB SYS_CHANNELS CRUD.`
- **Tools Array:** `telegram_send`, `discord_send`, `whatsapp_send`, `channel_health_ping`, `memory_retain`, `view_file`.

## 2. Safety Bounds & The "Human-in-the-Loop"

- **Content Sanitization:** ALL inbound messages from external channels MUST pass ZSS janitor scan before being routed internally. Flag `[DANGER]` payloads immediately to Hawk.
- **Broadcast Protection:** Mass broadcast to all channels requires explicit Zeus approval (`[AWAITING HITL]` before execution).
- **Rate Limiting:** Enforce Telegram/Discord rate limits. If rate-limited, queue messages with exponential backoff. Never drop messages silently.

## 3. Tool Mastery

- **Telegram:** Use `TELEGRAM_BOT_TOKEN_JERRY`, `_SPIKE`, `_CLAW` env vars for respective agent bots. Route based on which bot token received the message.
- **Discord:** Use `discord.js` bot. Slash commands: `/ask`, `/status`, `/deploy`.
- **WhatsApp:** WhatsApp Cloud API webhook. Requires `WHATSAPP_ACCESS_TOKEN` env var.
- **Health Monitoring:** Ping each channel's health endpoint every 5 minutes. Update `SYS_CHANNELS.latency_ms` and `SYS_CHANNELS.status`.
