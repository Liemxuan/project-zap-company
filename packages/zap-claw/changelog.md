# Changelog

All notable changes to Zap Claw are documented here.
Format: `[YYYY-MM-DD] vX.X — Description`

---

## [2026-02-20] v1.0 — Level 1 Foundation

### Added
- Telegram bot using grammy (long polling, no web server)
- Security middleware: user ID whitelist, silent drop for non-whitelisted users
- OpenRouter LLM integration via OpenAI-compatible SDK
- Agentic tool loop with `MAX_ITERATIONS = 10` safety cap
- First tool: `get_current_time`
- System prompt defining Zap Claw persona
- Per-user conversation history (in-memory)
- `/start` and `/clear` commands
- Environment validation on startup (fail fast with clear error messages)
- Graceful SIGINT/SIGTERM shutdown
- `docs/` folder with ROADMAP, archITECTURE, SECURITY, DATABASE, MULTI_TENANT, DECISIONS

### Configuration
- `OPENROUTER_API_KEY` — OpenRouter API key
- `MODEL` — model to use (default: `anthropic/claude-opus-4-5`)
- `TELEGRAM_BOT_TOKEN` — bot token from @BotFather
- `ALLOWED_USER_IDS` — comma-separated Telegram user IDs

### Bot
- @ZAP_Claw_bot — confirmed working 2026-02-20

---

## Upcoming

### v1.1 — Level 2: Memory
- `better-sqlite3` + FTS5
- Persistent conversation history
- `remember` / `recall` / `forget` tools
- Account config store in SQLite

### v1.2 — Level 3: Voice
- Whisper transcription
- ElevenLabs TTS

### v1.3 — Level 4: Tools + MCP
- Shell tool with confirmation gate
- File read/write tools
- MCP bridge

### v2.0 — Multi-Tenant
- Account onboarding via Telegram
- Per-account API key management
- Round-robin key rotation with cooldown
- Admin commands
