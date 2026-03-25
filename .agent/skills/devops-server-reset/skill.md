---
name: devops-server-reset
description: robustly resets the local development environment. Use this when the localhost server is failing, ports are stuck (EADDRINUSE), or the preview is not loading. It handles killing zombie Node processes, clearing Next.js cache, and verifying ports before restarting.
---

# Server Reset Skill

Use this procedure when:

- High Severity: "Port 3000 is already in use" errors.
- Medium Severity: Browser preview refuses to connect (Connection Refused).
- Low Severity: Strange caching behavior or "Hot Reload" stopped working.

## Procedure

1. **Stop Current Processes**:
   Ensure no `run_command` steps are currently running in the background.
   Terminate them if necessary.
2. **Execute Reset Script**: Run the specialized bash script included in this skill.

    ```bash
    chmod +x .agent/skills/devops-server-reset/reset-dev.sh
    .agent/skills/devops-server-reset/reset-dev.sh
    ```

3. **Restart Server**: After the script confirms "Environment Reset Complete",
   start the server afresh.

    ```bash
    npm run dev
    ```

4. **Verify**: Check `server.log` or console output to confirm it successfully
   bound to Port 3000 (or the next available port).

## Troubleshooting Loops

If the server keeps crashing immediately:

- Check `package.json` for syntax errors.
- Check `next.config.ts` for invalid configuration.
- Do NOT simply re-run the reset script in a loop. Analyze the error output first.
