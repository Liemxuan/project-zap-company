---
name: setup-notebooklm-mcp
description: Installs, configures, and authenticates the NotebookLM MCP server for use in the agent.
---

# NotebookLM MCP Setup Skill

This skill automates the process of adding the NotebookLM MCP server to an agent's environment, ensuring the correct executable is references and authentication has been completed. Look for the local MCP config file at `~/.gemini/antigravity/mcp_config.json`, `~/.config/opencode/opencode.json` or similar depending on the environment.

## Execution Steps

Follow these steps exactly to set up the NotebookLM MCP server.

### 1. Install the Server

Use `uv` (or `pip` if `uv` is unavailable) to install the `notebooklm-mcp-server` package globally.

```bash
uv tool install notebooklm-mcp-server
```

**Note**: The package name is `notebooklm-mcp-server`, but the executables it provides are `notebooklm-mcp` and `notebooklm-mcp-auth`.

### 2. Configure the MCP Server

Locate the user's MCP configuration file.
Add the following configuration to the `mcpServers` object in the JSON file:

```json
    "notebooklm-mcp-server": {
      "command": "uvx",
      "args": [
        "--from",
        "notebooklm-mcp-server",
        "notebooklm-mcp"
      ]
    }
```

*Crucial*: The arguments must correctly reference the package name with `--from notebooklm-mcp-server` so that `uvx` knows where to find `notebooklm-mcp`.

### 3. Run Authentication

Execute the authentication daemon. This will open a browser window for the user to log into their Google account.

```bash
notebooklm-mcp-auth
```

Notify the user that a Chrome window has opened and they need to complete the login process. You must wait for their confirmation before proceeding.

### 4. Verify Installation

Once the user confirms they have logged in, verify the server is working by checking for notebooks.

```bash
uvx notebooklm-mcp
```

(You can also verify by interacting with the MCP server directly using MCP tools if your environment supports it, asking it to list notebooks.)
