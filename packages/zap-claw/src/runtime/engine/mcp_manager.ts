import fs from 'fs';
import path from 'path';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface McpConfig {
    mcpServers: Record<string, {
        command: string;
        args: string[];
        env?: Record<string, string>;
        disabled?: boolean;
    }>;
}

export class MCPManager {
    static clients: Map<string, Client> = new Map();
    static toolSchemas: any[] = [];
    static isInitialized = false;

    static async init() {
        if (this.isInitialized) return;
        
        try {
            const configPath = process.env.MCP_CONFIG_PATH || '/Users/zap/.gemini/antigravity/mcp_config.json';
            if (!fs.existsSync(configPath)) {
                console.warn(`[MCP Manager] Config not found at ${configPath}`);
                return;
            }

            const config: McpConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            
            for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
                if (serverConfig.disabled) {
                    console.log(`[MCP Manager] Skipping disabled server: ${serverName}`);
                    continue;
                }

                console.log(`[MCP Manager] Booting ${serverName}...`);
                const transport = new StdioClientTransport({
                    command: serverConfig.command,
                    args: serverConfig.args,
                    env: { ...process.env, ...(serverConfig.env || {}) } as Record<string, string>
                });

                const client = new Client(
                    { name: 'zap-swarm-client', version: '1.0.0' },
                    { capabilities: {} }
                );

                await client.connect(transport);
                this.clients.set(serverName, client);

                // Fetch tools
                const toolsResponse = await client.listTools();
                for (const tool of toolsResponse.tools) {
                    this.toolSchemas.push({
                        type: 'function',
                        function: {
                            name: `${serverName}_${tool.name}`,
                            description: tool.description,
                            parameters: tool.inputSchema
                        }
                    });
                }
            }
            this.isInitialized = true;
            console.log(`[MCP Manager] Initialized with ${this.toolSchemas.length} tools across ${this.clients.size} servers.`);
        } catch (e: any) {
            console.error(`[MCP Manager] Error initializing: ${e.message}`);
        }
    }

    static getTools() {
        return this.toolSchemas;
    }

    static async executeTool(serverName: string, toolName: string, args: any) {
        const client = this.clients.get(serverName);
        if (!client) throw new Error(`MCP Server ${serverName} not found or not booted`);
        const result = await client.callTool({ name: toolName, arguments: args });
        if (result.isError) {
            throw new Error(`MCP Tool Error: ${((result as any).content || []).map((c: any) => c.text).join('\n')}`);
        }
        return ((result as any).content || []).map((c: any) => c.text).join('\n');
    }
}
