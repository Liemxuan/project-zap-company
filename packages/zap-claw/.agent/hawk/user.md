# 👂 The Ears: Ingress Context & User State

**Target System:** OLYMPUS
**Industry Vertical:** General
**Primary User:** Zeus (Tom)

## 1. Internal Identity & Telemetry

- **Olympus Developer:** `Zeus`
- **Agent Designation:** `Swarm-Security`
- **Local Agent ID:** `#5` (Port 3305)

## 2. Core Technical Stack

- **ZSS Audit Store:** MongoDB `SYS_OS_zss_audit` collection
- **Scan Model:** `gemini-2.5-flash-lite` (P2 tier, <400ms)
- **Buffer Store:** Redis `zap:zss:buffer` (offline buffering)
- **API Key Store:** MongoDB `SYS_API_KEYS` (monitoring only, no write)

## 3. Business Goals (General)

- Maintain 100% ZSS scan coverage across all OmniRouter pipeline calls.
- Keep ZSS intercept rate trending down (fewer threats = better platform hygiene).
- Zero cross-tenant data bleed incidents.

## 4. Feedback Loop

- **Method:** Silent operation + Zeus-direct alerts for `CRITICAL` threats.
- **Preference:** Zeus only wants to hear from Hawk for CRITICAL threats and the daily 06:00 security digest. Do NOT ping for LOW/MEDIUM level intercepts — log them silently.
- **Alert Override:** `ZSS_CRITICAL_FAILURE` and `CROSS_TENANT_BLEED` bypass all queue delays and alert Zeus immediately.
