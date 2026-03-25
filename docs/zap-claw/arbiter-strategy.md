# 🧠 ZAP Arbiter Strategy: The Economic Hierarchy (Feb 2026 Update)

This document outlines the business logic for AI model routing within ZAP OS, optimized for cost-efficiency and performance based on user-provided infrastructure.

## 💰 Resource Inventory & Cost Model

| Resource | Provider | Cost Model | Capability | Priority | Verified ID (2026) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gemini 3.1 Pro** | Google Cloud | **Fixed Monthly (Prepaid)** | High Reasoning | **P0 (Brain)** | `gemini-3.1-pro-preview` |
| **Nano Banana Pro** | Google Cloud | **Fixed Monthly (Prepaid)** | High Versatility | **P0 (Pro)** | `nano-banana-pro-preview` |
| **Gemini 2.5 Flash** | Google Cloud | **Fixed Monthly (Prepaid)** | High Speed | **P0 (Flash)** | `gemini-2.5-flash` |
| **DeepSeek (BYOK)** | OpenRouter | Pay-As-You-Go (Cheap) | Reasoning/Bulk | **P1** | `deepseek/deepseek-chat` |
| **Claude (PAYG)** | OpenRouter | Pay-As-You-Go (Premium) | Coding SOTA | **P2** | `anthropic/claude-3.5-sonnet` |
| **Ollama** | Local Machine | Sunk Cost (Zero Marginal) | Backup Only | **P3** | `OLLAMA` |

---

## 🏗️ Theme-Based Routing Logic (Hydra Chain)

The Arbiter attempts models in this specific sequence to minimize PAYG spend while maximizing use of prepaid resources.

### 1. A_ECONOMIC (The "Fast Pass")
*Objective: Maximum speed and volume at zero marginal cost.*
1. **Gemini 2.5 Flash** (Prepaid)
2. **Gemini 2.0 Flash Lite** (Prepaid)
3. **DeepSeek Chat** (Cheap BYOK)
4. **Local Ollama** (Sunk Cost)

### 2. B_PRODUCTIVITY (The "Daily Driver")
*Objective: High intelligence for standard tasks using the "all you can eat" Brain.*
1. **Nano Banana Pro** (Prepaid - 2026 SOTA)
2. **Gemini 2.0 Flash** (Prepaid)
3. **Claude 3.5 Sonnet** (Premium PAYG Fallback)

### 3. C_PRECISION (The "Surgical Strike")
*Objective: Maximum accuracy and reasoning.*
1. **Gemini 3.1 Pro** (Prepaid - Platinum Tier)
2. **Gemini 2.5 Pro** (Prepaid - Gold Tier)
3. **Claude 3.5 Sonnet** (Premium PAYG Fallback)

---

## 🌉 Smoothing & Safety Protocols

- **Prepaid Arbitrage**: The Arbiter will automatically try multiple Google API keys (STANDARD -> PRO -> ULTRA) to find an available prepaid slot before ever charging the user's credit card on PAYG providers.
- **Ralph-Loop Protection**: Execution is strictly linear. The Hydra chain traverses downwards once. If all models fail, the request enters the Dead Letter Queue (DLQ). There is no recursive circling.
- **ID Normalization**: Automatic mapping of theme tags to standard SDK identifiers (e.g., stripping `google/` prefixes for internal SDK calls).
- **BYOK Hierarchy**: Config precedence: Individual Agent Keys > Tenant Keys > Global System Keys.
