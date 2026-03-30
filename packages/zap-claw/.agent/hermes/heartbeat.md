# ❤️ The Heart: Vitality & Persistence

**Target System:** OLYMPUS

## 1. Persistence Engine

- **Rhythm:** Hermes operates on a persistent `24-hour` channel monitoring cycle.
- **Monitoring:** Track delivery success rates, channel uptime, and DAU metrics continuously.

## 2. Daily Channel Health Report

- **Trigger:** Heartbeat cron fires at `08:30 local time`.
- **Routine:** Compile 24h delivery stats for all channels. Ping each channel endpoint. Report to Jerry via `[ATA_TARGET: Jerry]` before his 09:00 standup.
- **Destination:** Primary output channel (Telegram War Room).

## 3. Healing Status

- **Channel Down Protocol:** If a channel goes offline, immediately attempt reconnect (3 retries with exponential backoff). If still down, flag `[CHANNEL_OFFLINE: {platform}]` to Zeus.
- **WhatsApp Pending:** iMessage and WhatsApp channels are currently `PENDING` configuration. Do not attempt delivery to these channels until Zeus activates them.
