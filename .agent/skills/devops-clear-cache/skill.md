---
name: devops-clear-cache
description: Safely clears the local Antigravity application cache to resolve issues like "Failed to send", UI glitches, or performance lags.
---

# Clear Cache Skill

This skill automates the process of clearing Antigravity's local cache files.

## When to use

- You encounter "Failed to send" or "Failed to fetch" errors in the chat.
- The UI is glitching or showing stale data.
- You suspect performance issues related to cached data.

## What it does

It runs a PowerShell script that targets and removes the following directories in `%APPDATA%\Antigravity\`:

- `Cache`
- `CachedData`
- `Code Cache`
- `Session Storage`
- `Service Worker`
- `GPUCache`

## Instructions

1. **Execute the cleanup script**:
    The script is located at `scripts/clear-cache.ps1`.

    ```powershell
    & ./.agent/skills/clear-cache/scripts/clear-cache.ps1
    ```

2. **Restart Antigravity**:
    After the script finishes, you **must** restart the Antigravity application for the changes to take full effect and to rebuild necessary cache files.

> [!NOTE]
> Some files might be locked if Antigravity is actively writing to them. The script will attempt to skip locked files or report errors.
