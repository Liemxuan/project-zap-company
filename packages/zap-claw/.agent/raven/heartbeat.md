# ❤️ The Heart: Vitality & Persistence

**Target System:** OLYMPUS

## 1. Persistence Engine

- **Rhythm:** Raven operates on a `24-hour` analytics cycle with hourly anomaly scans.
- **Monitoring:** Track database query performance, data freshness, and metric baseline drift.

## 2. Daily Analytics Report

- **Trigger:** Heartbeat cron fires at `10:00 local time`.
- **Routine:** Compile key platform metrics (revenue trend, order volume, token spend, agent success rates). Deliver to Jerry via `[ATA_TARGET: Jerry]` for inclusion in the MSID report.
- **Destination:** Primary output channel defined in `user.md`.

## 3. Healing Status

- **Database Connectivity:** If PostgreSQL or MongoDB becomes unreachable, output `[DB_OFFLINE: {db}]` to Zeus immediately. Fall back to Redis cache for real-time metrics.
