---
name: olympus-sync
description: Automates project backup, GitHub synchronization, and protocol pushing for the ZAP Olympus infrastructure.
---

# Olympus-Sync Skill

This skill provides a standardized process for backing up the local Olympus environment, syncing changes with global collaborators (like the Clawde Team or remote crews in Vietnam), and ensuring protocol integrity.

## Core Capabilities

1. **Protocol Integrity**: Ensures global rules (`claude.md` and `a2a-sync.md`) are tracked and staged.
2. **Full Backup**: Stages all modified source code and assets across the entire `Olympus/` root.
3. **Global Sync**: Commits and pushes the current state to the master repository.

## When to Use

- Before ending a major development session.
- When significant protocol changes occur (e.g., updating A2A routines).
- When a remote team needs the latest system snapshot to avoid merge conflicts.

## How to Call

Ask Antigravity to:

- "Run global sync"
- "Sync Olympus"
- "Backup and push everything"

## Process Steps

1. **Stage Changes**: Includes global root files (`claude.md`, `a2a-sync.md`), components, and scripts.
2. **Commit**: Ensure you read the `git status` first. Use a standardized `chore:`, `feat:`, or `fix:` prefix matching the actual changes tracked.
3. **Retain to Memory v2 (SOP-035)**: Before pushing, fire a `POST http://localhost:3002/api/memory/retain` call with `type: "experience"` summarizing what was synced, which files changed, the domain, and tags. If new rules or patterns were discovered during the session, also retain them as world facts (`type: "world"`). This ensures the self-teaching loop captures every sync event.
4. **Push**: Execute `git push` to update the remote branch.
5. **Report**: Provide a clean summary of what was synced, pushed, and retained.

---
_Standardized for Olympus / ZAP-Claw Infrastructure._

