---
name: agent-notebooklm-cli
description: Standard operating procedure for using notebooklm-py for token-efficient research, source injection, and chat interactions instead of the NotebookLM MCP server.
---

# NotebookLM CLI for Athena Research

The **NotebookLM CLI (`notebooklm-py`)** is the mandated research automation tool for ZAP-OS agents. It replaces the `notebooklm-mcp-server` entirely, ensuring robust stdio interaction directly via the shell and mitigating the EOF bugs with the MCP protocol.

## Configuration & Usage

The application is globally installed for the Athena research agent. Whenever you (`antigravity`, `athena`, or any other agent) need to perform backend document research or chat with a specific notebook context, you invoke the `notebooklm` native terminal command directly, rather than waiting for an MCP tool call.

### Recommended Core Commands

- `notebooklm list` - List available notebooks
- `notebooklm use [notebook_id]` - Set a persistent connection to a specific notebook
- `notebooklm status` - Display current notebook context
- `notebooklm ask "Query here"` - Query the active notebook directly
- `notebooklm source add "/path/to/local/file.md"` - Inject a source into the Notebook
- `notebooklm generate [audio|report|flashcards|infographic]` - Generate NotebookLM artifacts and drop them into the filesystem

**WARNING:** Do not attempt to rely on MCP tools matching the Notebook interface. You must execute raw terminal commands using `notebooklm` exclusively.
