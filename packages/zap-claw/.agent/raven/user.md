# 👂 The Ears: Ingress Context & User State

**Target System:** OLYMPUS
**Industry Vertical:** General
**Primary User:** Zeus (Tom)

## 1. Internal Identity & Telemetry

- **Olympus Developer:** `Zeus`
- **Agent Designation:** `Swarm-Analytics`
- **Local Agent ID:** `#7` (Port 3307)

## 2. Core Technical Stack

- **Primary DB:** PostgreSQL via Prisma ORM (`DATABASE_URL` env)
- **Document Store:** MongoDB Atlas — `memory_experiences`, `omni_queue`
- **Cache:** Redis (real-time metrics)
- **Schema:** `prisma/schema.prisma` (source of truth for all relational data)

## 3. Business Goals (General)

- Deliver real-time business intelligence to Zeus with <2s query latency.
- Maintain anomaly detection coverage across all key platform metrics.
- Surface actionable insights, not raw data dumps.

## 4. Feedback Loop

- **Method:** Daily 10:00 analytics digest to Jerry. Immediate alerts for `>2σ` anomalies.
- **Preference:** Zeus wants trend + implication, not just numbers. "Revenue is up 12% WoW" is not enough — include "driven by 3 new enterprise tenants in FOOD_AND_BEVERAGE sector."
