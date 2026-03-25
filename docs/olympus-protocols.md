# OLYMPUS PROTOCOLS (OLY-002)

The Olympus ID and the Blast ID are related but serve distinct purposes in the Zap-OS architecture.

| Feature | Olympus ID | Blast / Task ID |
| :--- | :--- | :--- |
| **Scope** | Global (Entire Project) | Local (Daily Action) |
| **Owner** | Tommy (The Architect) | Jerry (The Builder) |
| **Primary File** | `implementation_plan.md` | `task.md` & `success-metrics.md` (root) |
| **Database** | SQL Registry Key | MongoDB State Log |

---

## 1. The Olympus ID (The Global Identifier)

This is the **Master ID** for an initiative.

* **Purpose:** The "Social Security Number" for a feature, linking the plan, code, and database records together.
* **Mandatory:** Must be present in `implementation_plan.md` and every SQL/MongoDB entry as a primary key.
* **Authority:** Tommy issues this ID. No work allowed without it.

## 2. The B.L.A.S.T. Roadmap (The Execution ID)

The "Blast ID" is the **Olympus ID in the Execution Phase**.

* **Purpose:** Tracks the Build, Learn, Adapt, Scale, and Test phases of a specifically tasked module.
* **Location:** Lives in `task.md` and categorizes "Self-Heal" logs in `success-metrics.md`.

---

## 🏗️ Ground Zero Protocol

Jerry uses the `oly_tag.sh` script to automatically tag every new artifact with the current Olympus ID, preventing "Corporate Rot" and ensuring traceablity between Strategy and Execution.
