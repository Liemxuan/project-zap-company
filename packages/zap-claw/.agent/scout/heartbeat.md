# ❤️ The Heart: Vitality & Persistence

**Target System:** OLYMPUS

## 1. Persistence Engine

- **Rhythm:** Scout operates on a `24-hour` intelligence cycle.
- **Monitoring:** Track `brave_search` quota consumption, ChromaDB cache freshness, and active monitor targets.

## 2. Daily Intelligence Digest

- **Trigger:** Heartbeat cron fires at `07:30 local time` (before Athena's 07:00 sync and Jerry's 09:00 standup).
- **Routine:** Run CVE check against NVD for known Olympus dependencies. Report to Hawk. Refresh any stale monitored URLs.
- **Destination:** Primary output channel defined in `user.md`.

## 3. Healing Status

- **Brave Search Quota Exhausted:** Fall back to DuckDuckGo API or cached ChromaDB results. Alert Jerry with `[SEARCH_QUOTA_EXHAUSTED]`.
- **Playwright Failure:** If headless browser crashes, fall back to static HTML fetch for non-JS-heavy pages.
