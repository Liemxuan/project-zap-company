# SOP-016: OpenPencil Figma Ingestion & Design Automation

**Olympus ID:** OLY-116
**Status:** ACTIVE
**Author:** Antigravity / Jerry
**Date:** March 2026

## 1. Objective

To deprecate the manual HTML-export ingestion process (Stitch MCP) in favor of the **OpenPencil MCP Server**, allowing Team Claw and ZAP OS agents to directly read, parse, and modify native `.fig` (Figma) files from the local filesystem.

## 2. Infrastructure Setup

The `@open-pencil/mcp` server is permanently installed and registered in the root Antigravity `mcp_config.json`.
It is configured with `OPENPENCIL_MCP_ROOT` pointing to `/Users/zap/Workspace/`.

**Requirement:** Do NOT attempt to boot OpenPencil via `npm run dev` in the terminal for standard Agent workflows. The MCP connection runs automatically in the background via the Gemini extension.

## 3. Workflow Protocol: Ingesting a Design

When a Designer (Zeus) has a new Figma file that needs to be converted into a ZAP-Design React component, follow this tight integration loop:

### Step 1: The Drop

1. The Designer drops the native `.fig` file anywhere within the `/Users/zap/Workspace/` boundary (e.g., `/Users/zap/Workspace/olympus/docs/designs/`).
2. The Designer prompts the active Agent (e.g., "Jerry, convert the new `dashboard-v2.fig` into a React component").

### Step 2: The Agentic Scan

1. The Agent uses their native MCP tools to connect to OpenPencil.
2. The Agent calls the OpenPencil `find` or `list` commands to target the specific `.fig` file by its absolute path.
3. The Agent recursively reads the document state (Color nodes, Layout data, Text properties).

### Step 3: ZAP Component Translation

1. The Agent extracts the exact HSL color codes, drop shadows, and border radii from the `.fig` file.
2. The Agent translates these raw Figma properties into the **ZAP 4-Layer Theme Architecture** (`theme-core.css`, `theme-neo.css`).
3. The Agent generates the `Page.tsx` or `Component.tsx` using `zap-design` structural standards (Atoms, Molecules, Surface).

## 4. Reverse Modifications (AI-Driven Design)

Because OpenPencil supports read **and write** via MCP, Agents have the authority to modify the `.fig` design file directly.

* If an Agent spots a design flaw (e.g., inadequate contrast on a button), the Agent can fix the React code AND use OpenPencil MCP to correct the `fill` property inside the `.fig` file, ensuring the source of truth remains synchronized.

## 5. Security Enclaves

The OpenPencil MCP server has been hard-locked to `/Users/zap/Workspace/`. It cannot traverse into the OS Root (`/`) or system configuration directories. Agents attempting to pass paths outside of the Workspace boundary will receive a `PermissionDenied` error.

## 6. Architecture & File Structure Mapping

If you need to modify how the AI interacts with OpenPencil (or add new tools), reference the following directory mapping within the `open-pencil` workspace:

### The MCP Router (Incoming/Outgoing)

* **Path:** `packages/mcp/src/server.ts`
* **Role:** Acts as the entry point for JSON-RPC connections. It initializes the `@modelcontextprotocol/sdk` server and handles native file I/O tools (like `open_file`, `save_file`, `new_document`), enforcing the security boundary constraints defined in Section 5.

### The Execution Logic (The Brains)

* **Path:** `packages/core/src/tools/schema.ts`
* **Role:** Contains the standalone `ToolDef` objects (e.g., `get_node`, `set_fill`, `render`). These translate natural language or AI intentions into programmatic instructions against the OpenPencil `SceneGraph` API.

### The Binary Codec (The Output)

* **Path:** `packages/core/src/kiwi/` (Internal Logic)
* **Role:** After tools manipulate the Scene Graph, calling `save_file` triggers the Kiwi codec. It mathematically compresses the active typescript state back into the raw `.fig` binary format to be persisted on the filesystem.
