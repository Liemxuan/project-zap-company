# SOP-006: Arbiter Routing & Theme Management

## 1. Purpose
This SOP defines the procedure for managing AI routing priorities within the ZAP OS Omni-Router. It ensures that the system always prioritizes **Prepaid Monthly** resources (Google Gemini) over **Pay-As-You-Go** (PAYG) resources (OpenRouter/Claude/DeepSeek) to minimize operational costs.

## 2. Scope
Applies to `omni_router.ts` and any agent metadata that includes `arbiterTheme` or `byok` preferences.

## 3. The Economic Hierarchy (Business Logic)
1. **P0 (Prepaid)**: Google Gemini models. These are unlimited within a monthly fixed fee. Use these first.
2. **P1 (Cheap PAYG)**: DeepSeek / Llama (via OpenRouter BYOK). Use for bulk data or if P0 is rate-limited.
3. **P2 (Premium PAYG)**: Claude / GPT-4 (via OpenRouter). Use only for mission-critical precision if P0 fails.
4. **P3 (Sunk Cost)**: Local Ollama. The final fallback if the internet or API keys fail.

## 4. Theme Configuration (`ZAP_THEMES`)
All routing is governed by a theme defined in `omni_router.ts`. 

- **A_ECONOMIC**: Favors Flash/Lite models.
- **B_PRODUCTIVITY**: Favors Pro/Nano models for software engineering.
- **C_PRECISION**: Favors 3.1 Pro and Reasoning models for complex drafting.

## 5. Maintenance Procedures

### 5.1 Adding a New Model
1. Run `npx tsx src/scripts/list_google_models.ts` to find the exact ID.
2. Verify the model supports `generateContent`.
3. Add the ID to the relevant `ZAP_THEMES` priority array in `omni_router.ts`.

### 5.2 Patching Model IDs (Annual Sync)
As providers update IDs (e.g., from `gemini-1.5` to `gemini-2.0` in 2026), the Arbiter Strategy document and the code must be updated simultaneously to prevent `404 NOT_FOUND` errors.

### 5.3 Loop Prevention (Ralph-Loop)
- Never allow a model failover to trigger a recursive call to `executeSerializedLane`.
- Ensure `lastError` is thrown after the Hydra chain exhausts all options to prevent infinite retries.

## 6. Verification
After any change to routing logic, run the team simulation:
```bash
npx tsx src/scripts/spawn_team.ts
```
Verify 100% success in `models used` and confirm that `isPrepaid: true` is appearing in telemetry where expected.
