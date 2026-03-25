# ZAP OS: Agency API Key Onboarding Protocol (BYOK)

Welcome to the ZAP OS Omni-Channel system. As an Agency Owner, you have complete control over the AI models routing through your environment. This document outlines how you provide your "Bring Your Own Key" (BYOK) credentials so that they map correctly to your specific Tenants and Agents.

We support multiple provider networks to ensure maximum efficiency, cost-control, and privacy:
1.  **Google Gemini (Ultra / Pro / Flash):** For high-context reasoning and enterprise speed.
2.  **OpenRouter:** To seamlessly switch between competitive models (Claude 3.5 Sonnet, GPT-4o, Llama 3) without restructuring the backend.
3.  **Local Ollama:** For entirely private, on-premise, Air-Gapped execution.

---

## The Routing Hierarchy
When a user speaks to an agent on Telegram or WhatsApp, the system resolves the API key in this order:
1.  **Agent-Specific Key:** Does this exact agent have a dedicated key? (e.g., Use an expensive OpenRouter/Claude key for the CEO assistant, but cheap Google Flash for general logic). If yes, use it.
2.  **Tenant-Wide Key:** Does the tenant company (e.g., "ZVN" or "PHO24") have a default API key assigned to them? If yes, use it for all agents under that tenant who don't have a specific key.
3.  **Global Fallback Key:** If the agency owner hasn't provided specific keys, it uses the Master `.env` key hosted on the core server.

---

## Instructions for Agency Owners

Please fill out the **API Routing Matrix** below. You can copy this markdown table, or convert it to an Excel/CSV file, fill in your specific credentials, and return it to the integration team.

### Supported Providers
In the `Provider` column, you MUST use one of the exactly matched keywords:
*   `GOOGLE`
*   `OPENROUTER`
*   `OLLAMA`

### Supported Models (Examples)
*   **Google:** `gemini-1.5-pro` (Reasoning), `gemini-1.5-flash` (Speed/Cost)
*   **OpenRouter:** `anthropic/claude-3.5-sonnet`, `meta-llama/llama-3.1-70b-instruct`
*   **Ollama:** `llama3.2`, `mistral`, `deepseek-coder-v2` (**Note:** Provide your custom Ollama Base URL instead of an API key text).

---

## The API Routing Matrix (Fill This Out)

| Scope Level | Assignment ID (Tenant or Agent) | LLM Provider | Default Model String | API Key (or Base URL for Ollama) | Notes / Roles |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GLOBAL** | `MASTER_ZAP_CLAW` | `GOOGLE` | `gemini-1.5-pro` | `AIzaSyB-MASTER-KEY-XXXXXXXXX` | The ultimate fallback key. |
| **TENANT** | `OLYMPUS` | `GOOGLE` | `gemini-1.5-pro` | `AIzaSyB-OLYMPUS-KEY-XXXXXXXX` | Overrides Master for all Olympus God Admins. |
| **TENANT** | `ZVN` | `OPENROUTER` | `meta-llama/llama-3.1-8b-instruct`| `sk-or-ZVN-ROUTER-KEY-XXXXX` | Cheap default for ZVN general staff. |
| **AGENT** | `AGNT-ZVN-TOM` | `OPENROUTER` | `anthropic/claude-3.5-sonnet` | `sk-or-TOM-PREMIUM-KEY-XXXX` | Expensive premium reasoning specifically for Tom (CEO). |
| **AGENT** | `AGNT-PHO24-RALPH`| `OLLAMA` | `mistral` | `http://192.168.1.150:11434` | Autonomous background agent (Ralph) runs locally for free. |
| **...** | `...` | `...` | `...` | `...` | `...` |

**How to format your submission:**
If using Excel/CSV, ensure your headers exactly match: `Scope Level, Assignment ID, LLM Provider, Default Model String, API Key`.

Once you submit this matrix, our deployment script will encrypt your keys and securely seed them into the MongoDB `SYS_OS_tenants` and `SYS_OS_agents` collections. The ZAP Execution Lanes will immediately begin routing prompts according to your exact financial and structural specifications.
