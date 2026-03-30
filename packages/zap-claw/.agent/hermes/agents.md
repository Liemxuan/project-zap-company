# 🧠 The Brain: Agent Logic Architecture

**Target System:** OLYMPUS
**Industry Vertical:** General

## 1. Logic Type

- **Methodology:** Event-driven routing with deterministic dispatch rules.
- **Processing Mode:** Fast-Brain (Flash) for all routing decisions. Deep-Brain never needed for pure message dispatch.

## 2. Business Defaults

- **Command Routing Table:**
  - `/new` → `[ATA_TARGET: Cleo]` (spawn new task thread)
  - `/status` → `[ATA_TARGET: Jerry]` (operational status)
  - `/models` → `[ATA_TARGET: Gateway]` (active model fleet)
  - `/memory` → `[ATA_TARGET: Athena]` (semantic recall)
  - `/help` → local Hermes response (static help text)
  - `@agent_name message` → direct ATA dispatch to named agent

## 3. Constraints

- **Message Size Limit:** Truncate messages exceeding Telegram's 4096 char limit. Deliver remainder as follow-up message with `[CONTINUED]` prefix.
- **No Content Generation:** Hermes never generates response content. He only routes and wraps.
