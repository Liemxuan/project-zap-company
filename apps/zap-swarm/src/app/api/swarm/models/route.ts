export const revalidate = 86400;
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";

const MODELS_REGISTRY_PATH = path.resolve(process.cwd(), "../../packages/zap-claw/.agent/gemini_models_registry.md");

export interface GeminiModelEntry {
  name: string;
  identifier: string;
  description: string;
  strategy: string;
  tags: string[];
  status: "ACTIVE" | "INACTIVE";
}

export async function GET() {
  try {
    const content = await fs.readFile(MODELS_REGISTRY_PATH, "utf8");
    const models: GeminiModelEntry[] = [];
    
    // Split by ### to isolate each model block
    const blocks = content.split("### ").slice(1);
    
    for (const block of blocks) {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 5) continue; // Too short to be a valid block

      const name = lines[0]; // First line is the heading
      
      let identifier = "";
      let description = "";
      let strategy = "";
      let tags: string[] = [];
      let status: "ACTIVE" | "INACTIVE" = "ACTIVE";

      for (const line of lines) {
        if (line.startsWith("- **API Identifier:**")) {
          // Extract text between backticks
          const match = line.match(/`([^`]+)`/);
          if (match) identifier = match[1];
        } else if (line.startsWith("- **Official Description:**")) {
          description = line.replace("- **Official Description:**", "").trim();
        } else if (line.startsWith("- **Infrastructure Strategy:**")) {
          strategy = line.replace("- **Infrastructure Strategy:**", "").trim();
        } else if (line.startsWith("- **Tags / Keywords:**")) {
          // Extract all strings in backticks
          const matches = [...line.matchAll(/`([^`]+)`/g)];
          if (matches.length > 0) {
            tags = matches.map(m => m[1]);
          } else {
            tags = line.replace("- **Tags / Keywords:**", "").split(",").map(t => t.trim());
          }
        } else if (line.startsWith("- **Status:**")) {
          if (line.includes("INACTIVE")) status = "INACTIVE";
        }
      }

      if (name && identifier) {
        models.push({ name, identifier, description, strategy, tags, status });
      }
    }

    return NextResponse.json({ success: true, models }, { status: 200 });
  } catch (error: any) {
    logger.error("[api/swarm/models] Failed to load registry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load gemini models registry: " + error.message },
      { status: 500 }
    );
  }
}
