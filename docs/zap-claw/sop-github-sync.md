# 📖 SOP: GitHub Sync & Checkpointing

This document defines the standard procedure for managing the ZAP Olympus project state. Following this ensures that your work is never lost and that global teams (e.g., Vietnam) are always aligned.

## 1. Concepts: Checkpoint vs. Sync

Understanding the difference is critical for data integrity.

| Action | Purpose | Command / Tool | Visibility |
| :--- | :--- | :--- | :--- |
| **Checkpoint** (Save) | Captures your local state. Use this frequently to "save" your progress locally. | `git add .` + `git commit` | **Local Only** |
| **Olympus-Sync** (Publish) | Captures state AND publishes it to the master server. | **`olympus-sync` Skill** | **Global (Vietnam Team)** |

---

## 2. When to Execute

### 🟢 Local Checkpoint (Save)

* **Trigger**: Every 30-60 minutes of active coding or after finishing a specific file fix.
* **Why**: If the agent makes a mistake or the system crashes, we can "rollback" to the exact moment before the failure.
* **Procedure**: Ask Antigravity to: *"Save a checkpoint"* or *"Commit my current work."*

### 🔵 Olympus-Sync (Global Push)

* **Trigger**:
    1. At the end of your workday.
    2. Before a handover to the Vietnam team.
    3. After completing a major Phase (e.g., Phase 28).
* **Why**: This updates the GitHub repository and includes the latest `data/zap-claw.db` (Agent Brain). Without this, the Vietnam team is working on old logic.
* **Procedure**: Ask Antigravity to: *"Run `olympus-sync`"* or *"Sync Olympus for the team."*

---

## 3. Automated Backup: `olympus-sync`

The `olympus-sync` skill is the **Authoritative Sync Method**. It automates the following steps:

1. **Stage All**: Tracks new files (Identity docs, Soul guides) and modified code.
2. **State Capture**: Ensures the SQLite database (`data/zap-claw.db`) is included so agent memories are synced.
3. **Timestamped Commit**: Creates a log entry with the exact time.
4. **Global Push**: Updates `https://github.com/tomtranzap/ZAP-Claw.git`.
5. **Guide Generation**: Refreshes the `collaboration-guide.md` for remote developers.

---

## 4. Emergency Recovery

If a "failure" occurs (code won't run, agent is confused):

1. Use `git log` to find the last healthy **Checkpoint**.
2. Run `git reset --hard <hash>` to return to stability.

---
*Mastered for ZAP Olympus Strategy.*
