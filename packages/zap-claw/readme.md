# 🦀 Zap Claw

A lean, secure personal AI agent. Telegram frontend, Claude brain, zero exposed ports.

Built from scratch in TypeScript — every line understood.

## Setup

### 1. Prerequisites

- Node.js 20+
- A Telegram bot token (create one via [@BotFather](https://t.me/BotFather))
- An Google API key ([console.cloud.google.com](https://aistudio.google.com/api-keys))
- Your Telegram user ID ([get it here](https://t.me/userinfobot))

### 2. Configure

```bash
cd zap-claw
cp .env.example .env
```

Edit `.env`:

```env
TELEGRAM_BOT_TOKEN=8440806833:AAH...    # from @BotFather
GOOGLE_API_KEY=3434Ad-...            # from Google
ALLOWED_USER_IDS=123456789              # your Telegram user ID
```

### 3. Run

```bash
npm install
npm run dev
```

You should see:

```
🦀 Zap Claw is running...
[bot] Connected as @YourBotName (id: 1234567890)
```

### 4. Chat

Open Telegram, find your bot, and send a message. Try:

- `What time is it?`
- `What's today's date in Tokyo?`
- `/clear` — reset the conversation

## architecture

```
src/
├── index.ts          # Entry point, env validation, start
├── bot.ts            # Telegram bot + security whitelist middleware
├── agent.ts          # Agentic loop (Claude + tools, max 10 iterations)
├── system_prompt.ts  # Gemini's persona + instructions
└── tools/
    ├── index.ts      # Tool registry
    └── get_current_time.ts
```

## Security

| Threat | Mitigation |
|--------|-----------|
| Unauthorized access | `ALLOWED_USER_IDS` whitelist — non-whitelisted requests silently dropped |
| Exposed server | Long polling only — **no web server, no open ports** |
| Secret leakage | `.env` excluded from git; no secrets in code or logs |
| Runaway agent | `MAX_ITERATIONS = 10` hard cap on the agentic loop |
| Third-party code | No community skill files — integrations via MCP only (Level 4) |

## Levels

| Level | Status | Description |
|-------|--------|-------------|
| **1 — Foundation** | ✅ | Telegram + Claude + agentic loop + `get_current_time` |
| **2 — Memory** | 🔜 | Persistent SQLite memory with FTS5 search |
| **3 — Voice** | 🔜 | Whisper transcription + ElevenLabs TTS |
| **4 — Tools + MCP** | 🔜 | Shell, files, external services via MCP bridge |
| **5 — Heartbeat** | 🔜 | Proactive morning briefings, scheduled check-ins |
