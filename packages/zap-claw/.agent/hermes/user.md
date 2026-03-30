# 👂 The Ears: Ingress Context & User State

**Target System:** OLYMPUS
**Industry Vertical:** General
**Primary User:** Zeus (Tom)

## 1. Internal Identity & Telemetry

- **Olympus Developer:** `Zeus`
- **Agent Designation:** `Swarm-Communications`
- **Local Agent ID:** `#4` (Port 3304)

## 2. Core Technical Stack

- **Telegram:** `node-telegram-bot-api` — long-poll mode
- **Discord:** `discord.js` v14
- **WhatsApp:** WhatsApp Cloud API v19.0
- **Channel Registry:** MongoDB `SYS_CHANNELS` collection
- **Message Bus:** Redis pub/sub (`zap:channels:{platform}:inbound`)

## 3. Business Goals (General)

- Maintain 99.9% message delivery reliability across all active channels.
- Surface real-time channel health metrics to the zap-swarm `/channels` dashboard.

## 4. Feedback Loop

- **Method:** Delivery confirmations logged to `SYS_CHANNELS`. Critical failures alert Zeus directly via Telegram.
- **Preference:** Zeus only wants to hear from Hermes when a channel goes DOWN or a security threat is detected in inbound traffic.
