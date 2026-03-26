import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Ensure environment variables from zap-core are loaded
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const execFileAsync = promisify(execFile);

// Initialize MCP Server
const server = new McpServer({
    name: "zap-swarm-mcp",
    version: "1.0.0",
});

// Tool 1: Dispatch Swarm Task
server.tool(
    "dispatch_swarm_task",
    "Dispatch a task directly into the ZAP 12-agent Swarm via the Ticket Registry.",
    {
        agentId: z.enum([
            'athena', 'architect', 'cleo', 'coder', 'thomas', 'nova', 
            'hermes', 'raven', 'scout', 'spike', 'hawk', 'jerry'
        ]).describe("The dedicated ZAP microservice persona to handle this task."),
        taskPayload: z.string().describe("The detailed instruction or prompt for the agent."),
        tenantId: z.string().default('ZVN').describe("The tenant ID, defaults to ZVN.")
    },
    async ({ agentId, taskPayload, tenantId }) => {
        try {
            // Write to the DLQ/Task database used by ZAP Arbiter
            const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
            const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
            await client.connect();
            const db = client.db("olympus");
            
            // Simulating OmniRouter manual triaging via MongoDB
            await db.collection("SYS_OS_dead_letters").insertOne({
                tenantId,
                senderIdentifier: "claude-mcp-client",
                assignedAgentId: agentId,
                payload: taskPayload,
                status: "PENDING_MCP_DISPATCH",
                timestamp: new Date()
            });
            await client.close();

            return {
                content: [{ type: "text", text: `Successfully dispatched task to ZAP Agent '${agentId}'. It has been queued in the JobTicket Registry.` }]
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to dispatch task: ${error.message}` }],
                isError: true
            };
        }
    }
);

// Tool 2: Get Swarm Telemetry
server.tool(
    "get_swarm_telemetry",
    "Audit the current health, status, and ports of the 12 ZAP Docker containers.",
    {},
    async () => {
        try {
            const possiblePaths = [
                'docker',
                '/usr/local/bin/docker', 
                '/opt/homebrew/bin/docker', 
                '/Applications/Docker.app/Contents/Resources/bin/docker'
            ];
            
            let stdoutObj = "";
            for (const dockerPath of possiblePaths) {
                try {
                    const { stdout } = await execFileAsync(dockerPath, ['ps', '-a', '--format', '{{json .}}']);
                    stdoutObj = stdout;
                    break;
                } catch(e) {}
            }

            if (!stdoutObj) {
                return { content: [{ type: "text", text: "Docker daemon unreachable or path resolution failed. The Swarm might be offline." }] };
            }

            const dockerStatus = stdoutObj.split('\n').filter(Boolean).map(line => JSON.parse(line));
            return {
                content: [{ type: "text", text: JSON.stringify(dockerStatus, null, 2) }]
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Telemetry audit failed: ${error.message}` }],
                isError: true
            };
        }
    }
);

// Tool 3: Read ZAP Architecture
server.tool(
    "read_zap_architecture",
    "Fetch the core ZAP M3 structural tokens and component guidelines to ensure Claude writes perfectly matching ZAP code.",
    {
        topic: z.enum(['foundation', 'components', 'colors', 'all']).describe("Which architectural knowledge domain to read.")
    },
    async ({ topic }) => {
        // Provide hyper-specific context for Claude to match
        const knowledge: Record<string, string> = {
            foundation: "ZAP uses a 7-level structural engine. ZAP enforces precise spatial depth using M3 semantic Background Layers (bg-layer-0 through bg-layer-5). Elevation utilizes precise ring opacities.",
            components: "ZAP Components strictly use Tailwind CSS combined with M3 tokens. Never use inline styles (e.g., style={{ color: 'red' }}). Always use atomic sub-components from zap-design instead of generic un-styled HTML tags when possible.",
            colors: "The color map is synced via the Metronic Color Map Hub. Primary hues use HSL variables (e.g., --m3-sys-light-primary) defined in globals.css. Do not construct ad-hoc tailwind colors like 'text-blue-500'. Instead use contextual tokens like 'text-primary' or 'text-on-surface'."
        };

        const resultText = topic === 'all' 
            ? `${knowledge.foundation}\n${knowledge.components}\n${knowledge.colors}`
            : knowledge[topic];

        return {
            content: [{ type: "text", text: resultText || "Domain not found." }]
        };
    }
);

// Connect via stdio
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("ZAP Swarm MCP Server successfully booted on STDIO.");
}

run().catch(console.error);
