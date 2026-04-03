import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, input } = body;

    if (!input) {
      return NextResponse.json({ success: false, error: "Empty input payload." }, { status: 400 });
    }

    // Artificial delay to simulate "Agent Thinking/Extraction"
    await new Promise(resolve => setTimeout(resolve, 1500));

    let config: any = {
      name: "unknown-connector",
      command: "npx",
      args: ["-y"],
      env: {},
      status: "offline",
      type: "stdio"
    };

    // 1. Try to parse as JSON
    try {
      const parsed = JSON.parse(input);
      if (parsed.name && (parsed.command || parsed.mcpServers)) {
         // It looks like a valid MCP config block already
         config = { ...config, ...parsed };
         return NextResponse.json({ success: true, config });
      }
    } catch (e) {
      // Not JSON, continue to GitHub extraction
    }

    // 2. Try to extract from GitHub URL
    const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = input.match(githubRegex);
    
    if (match) {
      const repoName = match[2].replace(".git", "");
      config.name = repoName;
      
      if (repoName.includes("mcp-server-") || repoName.includes("-mcp")) {
         config.args = ["-y", repoName];
      } else if (repoName === "cli" && match[1] === "googleworkspace") {
         config.name = "google-workspace";
         config.args = ["-y", "@googleworkspace/cli", "mcp"];
         config.env = { "GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE": "/Users/zap/.config/gws/credentials.json" };
         return NextResponse.json({ 
            success: true, 
            config,
            instructions: "This tool requires Google OAuth. You must run 'npx @googleworkspace/cli auth login' on your local terminal first, then ensure the 'GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE' path in the config points to your generated credentials.json."
         });
      } else if (repoName === "server-github") {
         config.args = ["-y", "@modelcontextprotocol/server-github"];
      } else {
         // Generic guess
         config.args = ["-y", repoName];
      }
      
      return NextResponse.json({ success: true, config });
    }

    // 3. Fallback: Treat as package name if no spaces
    if (!input.includes(" ") && !input.includes("/")) {
      config.name = input;
      config.args = ["-y", input];
      return NextResponse.json({ success: true, config });
    }

    return NextResponse.json({ success: false, error: "Could not derive a valid MCP configuration from the provided input." });

  } catch (error: any) {
    logger.error(`[api/swarm/mcp/provision POST] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
