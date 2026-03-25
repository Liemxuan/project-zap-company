---
name: devops-workspace-ready
description: Automated workspace initialization and readiness check. Use when the user says "let's go", "ready to start", "workspace ready", or wants to begin a development session. Automatically checks server status, validates dependencies, performs health checks, starts the dev server if needed, and opens the browser to localhost:3000 - all without requiring user confirmation.
---

# DevOps Workspace Ready

Fully automated workspace initialization skill that prepares your development environment without any user intervention.

## What This Skill Does

When triggered, this skill automatically:

1. **Health Check** - Validates workspace state (git status, dependencies, TypeScript)
2. **Dependency Management** - Installs missing dependencies and repairs corrupted native modules (e.g., LightningCSS)
3. **Server Management** - Checks if dev server is running, starts it if not
4. **Browser Launch** - Opens localhost:3000 in the default browser
5. **Status Report** - Provides clear readiness confirmation

**Zero user interaction required** - everything runs automatically.

## Workflow

### Step 0: Create Task with Unique ID

**ALWAYS FIRST** - Generate task tracking file in project root:

```bash
node scripts/create_task.mjs
```

This creates `CURRENT_task.md` in the project root with:

- Unique task ID (format: TASK-YYYYMMDD-HHMMSS)
- Timestamp
- Task breakdown template

### Step 1: Diagnose and Recover from Previous Issues

**CRITICAL STEP** - Analyze log files from previous sessions and attempt automated recovery:

```bash
node scripts/diagnose_and_recover.mjs
```

This script automatically:

- Scans all log files (`server.log`, `compile.log`, `tsc_errors.log`, etc.)
- Detects common issues:
  - Missing dependencies → Runs `npm install`
  - Port conflicts (EADDRINUSE) → Kills processes on port 3000
  - Compile errors → Clears `.next` cache
  - TypeScript errors → Reports (non-blocking)
- **Fixes localhost corruption aggressively:**
  - Kills all Node processes
  - Clears `.next` cache
  - Clears `node_modules/.cache`
  - Flushes Windows DNS cache
- **Clears stale IDE problems** by running fresh TypeScript and ESLint checks
- Reports all recovery actions taken
- **ZERO user confirmations required**

**Why this is critical:** Previous failed sessions leave behind zombie processes, corrupted cache, missing dependencies, AND stale IDE error markers that prevent you from seeing what's actually broken. This step ensures a clean slate with current problems only.

### Step 2: Run Health Check

Execute the health check script to validate workspace state:

```bash
node scripts/check_health.mjs
```

This script automatically:

- Checks git status (branch, uncommitted changes)
- Verifies node_modules exists, runs `npm install` if missing
- Checks for outdated packages (informational only)
- Validates TypeScript compilation (non-blocking)

### Step 3: Ensure Server is Running

Execute the server check script:

```bash
node scripts/check_server.mjs
```

This script automatically:

- Checks if port 3000 is in use
- If server is running: reports status and continues
- If server is NOT running: automatically starts `npm run dev` and waits for it to be ready (max 30 seconds)

### Step 4: Verify App Loads

Execute the app verification script:

```bash
node scripts/verify_app.mjs
```

This script validates that the app returns valid HTML content (not just an open port):

- Makes HTTP request to localhost:3000
- Checks for valid HTML response
- Confirms app-specific content (ZAP, Login, etc.)
- Reports success or failure with details

### Step 5: Open Browser

Once the server is confirmed running and app is verified, automatically open the browser:

```bash
node scripts/open_browser.mjs
```

On Windows, use `start`. On macOS, use `open`. On Linux, use `xdg-open`.

### Step 6: Show Context Summary (FINAL CONFIRMATION)

**ONLY AFTER** browser is open and app is working, display session context:

```bash
node scripts/show_context.mjs
```

This script displays:

- Progress overview (completed, in-progress, pending tasks)
- Outstanding work by section
- Current constraints
- Opens `task.md` in VS Code for review

**Why this is last:** You should only see your task context AFTER confirming the workspace is fully operational. This prevents wasting time reviewing tasks when the environment isn't ready.

Provide a clear, concise summary:

```
✅ Workspace Ready!
🌐 Browser opened to http://localhost:3000
🚀 You're all set to start coding!
```

## Execution Guidelines

**Fully Automated** - Do NOT ask for user confirmation at any step. Execute all commands automatically using `SafeToAutoRun: true`.

**Error Handling** - If any step fails, continue with remaining steps and report issues in the final summary. The workflow is designed to be resilient.

**Browser Command** - Use the appropriate command for the operating system:

- Windows: `start http://localhost:3000`
- macOS: `open http://localhost:3000`
- Linux: `xdg-open http://localhost:3000`

**Concise Output** - Keep status messages brief and actionable. Focus on the final "ready" state rather than verbose progress updates.

## Success Criteria

The workspace is ready when:

- ✅ Dependencies are installed
- ✅ Dev server is running on port 3000
- ✅ Browser is open to localhost:3000
- ✅ User receives clear "ready to code" confirmation

## Notes

- All scripts use `.mjs` extension for ES modules
- Scripts are designed to be idempotent (safe to run multiple times)
- Health checks are informational; only critical failures (missing dependencies, server start failure) block readiness
- TypeScript errors are reported but don't block the workflow

## Troubleshooting

### If You're Being Asked for Confirmations

The skill is designed to run with **ZERO confirmations**. If you're seeing confirmation prompts:

1. **Check SafeToAutoRun**: All `run_command` calls in the AI's execution should have `SafeToAutoRun: true`
2. **Not a skill issue**: The skill itself doesn't ask for confirmations - this is the AI's execution behavior
3. **Solution**: The AI should execute all script commands automatically without asking

### If Localhost Keeps Getting Corrupted

The diagnostic script now includes aggressive localhost corruption fixes:

- Kills all Node processes (prevents zombie processes)
- Clears `.next` cache (prevents build corruption)
- Clears `node_modules/.cache` (prevents dependency cache issues)
- Flushes DNS cache (prevents localhost resolution issues)

This runs **automatically** every time you say "let's go".
