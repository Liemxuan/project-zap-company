// packages/zap-claw/src/mcp/mcp_client.ts

export interface McpToolSchema {
  name: string;
  description?: string;
  inputSchema: Record<string, any>;
}

/**
 * Convert MCP tool schemas to OpenAI-compatible function definitions.
 * Prefixes tool names with `mcp__{serverSlug}__{toolName}` to avoid collisions.
 */
export function buildMcpToolDefinitions(mcpTools: McpToolSchema[], serverName: string) {
  const slug = serverName.replace(/[^a-zA-Z0-9]/g, '_');
  return mcpTools.map(tool => ({
    type: 'function' as const,
    function: {
      name: `mcp__${slug}__${tool.name}`,
      description: `[MCP:${serverName}] ${tool.description}`,
      parameters: tool.inputSchema,
    },
  }));
}

/**
 * Parse an MCP-prefixed tool name back into server + tool.
 */
export function parseMcpToolName(prefixedName: string): { serverSlug: string; toolName: string } | null {
  const match = prefixedName.match(/^mcp__([^_]+(?:_[^_]+)*)__(.+)$/);
  if (!match) return null;
  return { serverSlug: match[1] ?? '', toolName: match[2] ?? '' };
}

/**
 * Connect to an MCP server via stdio transport.
 * Returns discovered tools and a callable dispatch function.
 */
export async function connectMcpServer(command: string, args: string[] = []) {
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');

  const transport = new StdioClientTransport({ command, args });
  const client = new Client({ name: 'zap-claw', version: '1.0.0' });
  await client.connect(transport);

  const { tools } = await client.listTools();

  return {
    tools,
    toolDefinitions: buildMcpToolDefinitions(tools as any, command.split('/').pop()?.replace(/\.[^.]+$/, '') || command),
    async callTool(name: string, input: Record<string, unknown>) {
      const result = await client.callTool({ name, arguments: input });
      return result;
    },
    async close() {
      await client.close();
    },
  };
}
