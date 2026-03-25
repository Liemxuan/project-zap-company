# SOP-028-THIRD-PARTY-MCP-SUPPLIERS

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** MCP INTEGRATION

---

## 1. Context & Purpose
This SOP dictates the architectural standard for integrating any external service (Third-Party Supplier) into the ZAP-OS ecosystem. To maintain strict security isolation, API standardization, and autonomous Swarm interoperability, **all third-party integrations must be abstracted through the Model Context Protocol (MCP)**. 

We do not write custom, ad-hoc REST or GraphQL wrappers in the core logic for individual providers. 

## 2. Core Directives

### 2.1 The MCP Abstraction Layer
Every external service (Google Workspace, LLM Providers, Tax Authorities, Hardware APIs) must be implemented as an isolated **MCP Server**. The core ZAP-OS engine and its autonomous agents act strictly as **MCP Clients**.

### 2.2 Security & Isolation
- **Never** store third-party API keys (e.g., Stripe secret keys, OpenAI tokens) directly in the frontend accessible database schema or global environment variables where not absolutely required.
- Keys must be securely held within the specific configuration scope of the designated MCP Server.
- The ZAP-OS database (`third_party_suppliers` table) handles the authorization of *who* is allowed to invoke the server, but the server handles the actual cryptographic handshake with the supplier.

### 2.3 The Three Interaction Vectors
All MCP Suppliers must expose their capabilities via the standard protocol:
1.  **Resources (`list_resources`, `read_resource`):** For reading external state (e.g., fetching a Google Calendar, checking live Tax Rates).
2.  **Tools (`list_tools`, `call_tool`):** For executing actions (e.g., `calculate_tax`, `generate_llm_completion`, `create_calendar_event`).
3.  **Prompts (`list_prompts`, `get_prompt`):** For exposing predefined, sector-specific interaction templates.

## 3. Database Architecture (The Pointer Table)

To track usage, billing, and access without exposing secrets, the Postgres database must maintain a pointer table linking the tenant to their authorized MCP configurations:

```sql
-- Concept Schema
CREATE TABLE third_party_suppliers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    category VARCHAR(64) NOT NULL, -- e.g., 'LLM_PROVIDER', 'TAX_AUTHORITY', 'WORKSPACE'
    supplier_name VARCHAR(128) NOT NULL, -- e.g., 'Google Workspace', 'Avalara'
    mcp_server_type VARCHAR(64) NOT NULL, -- 'stdio', 'sse'
    status VARCHAR(32) DEFAULT 'ACTIVE'
);
```

## 4. Sector-Specific Loading
MCP Supplier tools are not loaded globally for all tenants to prevent namespace collisions and context exhaustion.
- **Tools must be dynamically scoped by the Tenant's Sector.** 
- Example: A tenant in the `FOOD_AND_BEVERAGE` sector does not need the `CLIO_LEGAL_MANAGEMENT` MCP tools loaded into their active Swarm context.

## 5. Swarm Plug-and-Play
By enforcing this protocol, internal agents (Spike, Jerry) do not require core logic updates when a new supplier is added. If a new Tax API drops, it is wrapped in an MCP server, registered to the tenant, and the Swarm instantly gains the capability via the `list_tools` command.

**End of SOP.**
