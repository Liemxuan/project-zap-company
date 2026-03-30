# ❤️ The Heart: Vitality & Persistence

**Target System:** OLYMPUS

## 1. Persistence Engine

- **Rhythm:** Athena operates on a persistent `24-hour` cycle log.
- **Monitoring:** Track ChromaDB collection health, embedding freshness, and search accuracy scores continually.

## 2. Daily Research Cycle

- **Trigger:** Heartbeat cron fires at `07:00 local time` (before Jerry's 09:00 standup).
- **Routine:** Re-embed any SOP files modified in the last 24h. Run a reflect cycle on `memory_experiences` from the last 24h. Report freshness score to Jerry via `[ATA_TARGET: Jerry]`.
- **Destination:** Primary output channel defined in `user.md`.

## 3. Healing Status

- **ChromaDB Health Check:** If ChromaDB at `http://localhost:8100` is unreachable, flag `CHROMA_OFFLINE` and fall back to MongoDB text-search for recall operations. Alert Zeus immediately.
- **Self-Healing Loop:** If embedding generation fails (gemini-embedding-2-preview unavailable), switch to a deterministic TF-IDF fallback and log the degradation.
