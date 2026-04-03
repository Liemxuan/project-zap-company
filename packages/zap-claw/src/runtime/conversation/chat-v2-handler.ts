/**
 * ZAP Swarm Chat V2 — ConversationRuntime-powered endpoint
 * 
 * Replaces the flat AgentLoop.run() with the full hook/permission pipeline.
 * Mounts at POST /api/swarm/chat/v2
 * 
 * Flow:
 * 1. Accept { sessionId, agentId, message, mode, modelId, attachments }
 * 2. Create ConversationRuntime with adapters
 * 3. Run turn with full hook + permission pipeline
 * 4. Stream status to Redis for SSE consumption by the frontend
 * 5. Persist results to MongoDB
 */

import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import { Redis } from "ioredis";
import { MongoClient } from "mongodb";
import { ConversationRuntime } from "./conversation-runtime.js";
import { Session } from "./session.js";
import { ZSSHookRunner } from "./hooks.js";
import { PermissionPolicy } from "./permissions.js";
import {
  OmniApiClient,
  ZapToolExecutor,
  RedisPermissionPrompter,
} from "./adapters.js";
import { PluginManager } from "../../plugins/manager.js";
import type { ConversationRuntimeConfig } from "./types.js";

export const chatV2Router: ExpressRouter = Router();

// ─── Mode → Tier Mapping ────────────────────────────────────────────────

const MODE_TIER_MAP: Record<string, "A_ECONOMIC" | "B_PRODUCTIVITY" | "C_PRECISION"> = {
  Flash: "A_ECONOMIC",
  Reasoning: "B_PRODUCTIVITY",
  Pro: "C_PRECISION",
  Ultra: "C_PRECISION",
};

// ─── System Prompt Loader ───────────────────────────────────────────────

async function loadSystemPrompt(agentId: string): Promise<string[]> {
  const fs = await import("fs");
  const path = await import("path");

  const slug = agentId.toLowerCase().split(" ")[0];
  const agentDir = path.resolve(process.cwd(), `.agent/${slug}`);
  const prompts: string[] = [];

  if (fs.existsSync(agentDir)) {
    const files = ["IDENTITY.md", "HEARTBEAT.md", "SOUL.md", "TOOLS.md", "USER.md"];
    for (const file of files) {
      const fp = path.join(agentDir, file);
      if (fs.existsSync(fp)) {
        prompts.push(`--- ${file} ---\n${fs.readFileSync(fp, "utf-8")}`);
      }
    }
  }

  if (prompts.length === 0) {
    const { SYSTEM_PROMPT } = await import("../../system_prompt.js");
    prompts.push(SYSTEM_PROMPT);
  }

  return prompts;
}

// ─── Memory Context Loader ──────────────────────────────────────────────

async function loadMemoryContext(
  sessionId: string,
  userId: number,
  accountType: string,
  query: string
): Promise<string> {
  try {
    const { vectorStore } = await import("../../memory/vector_store.js");
    const facts = (await Promise.race([
      vectorStore.search(query, userId.toString(), accountType, 5),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      ),
    ])) as any[];

    if (facts.length > 0) {
      const lines = facts.map((f: any) => `- [${f.factType}] ${f.fact}`);
      return `\n\n[LONG-TERM MEMORY CONTEXT]\n${lines.join("\n")}`;
    }
  } catch {
    // Silent — memory is best-effort
  }

  return `\n[SESSION_KEY: ${sessionId}]`;
}

// ─── Default Permission Policy ──────────────────────────────────────────

function buildDefaultPolicy(): PermissionPolicy {
  const policy = new PermissionPolicy("workspace-write");

  // Read-only tools
  for (const tool of [
    "get_current_time", "recall", "view_file", "list_dir",
    "grep_search", "brave_search", "analyze_asset",
  ]) {
    policy.withToolRequirement(tool, "read-only");
  }

  // Write tools
  for (const tool of [
    "remember", "forget", "write_to_file", "replace_file_content",
    "write_todos",
  ]) {
    policy.withToolRequirement(tool, "workspace-write");
  }

  // Dangerous tools — require escalation
  for (const tool of [
    "run_command", "deploy_hydra_team", "spawn", "task",
  ]) {
    policy.withToolRequirement(tool, "workspace-write");
  }

  // Permission rules — deny destructive patterns
  policy.withPermissionRules({
    allow: [
      "get_current_time",
      "recall",
      "view_file",
      "list_dir",
      "grep_search",
    ],
    deny: [
      "run_command(sudo *)",
      "run_command(rm -rf /*)",
      "run_command(chmod 777*)",
    ],
    ask: [],
  });

  return policy;
}

// ─── POST /api/swarm/chat/v2 ────────────────────────────────────────────

chatV2Router.post("/api/swarm/chat/v2", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const {
    sessionId,
    agentId,
    message,
    tenantId,
    mode,
    modelId,
    attachments,
  } = req.body;

  const rawUserId = req.headers["x-zap-user"];
  const userId = typeof rawUserId === "string" ? parseInt(rawUserId, 10) : 999999;
  const userStrId = typeof rawUserId === "string" ? rawUserId : "999999";

  if (!sessionId || !agentId || !message) {
    res.status(400).json({ error: "Missing required fields: sessionId, agentId, message" });
    return;
  }

  // Respond immediately — execution happens in background
  res.status(200).json({ success: true, sessionId, runtime: "v2" });

  // ─── Background Execution ──────────────────────────────────────────

  setTimeout(async () => {
    let redis: Redis | null = null;
    let mongoClient: MongoClient | null = null;

    try {
      redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
      mongoClient = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
      await mongoClient.connect();
      const db = mongoClient.db("olympus");

      const emit = async (msg: string) => {
        const formatted = `> ⚙️ [system] ${msg}\r\n`;
        if (redis) {
          await redis.rpush(`zap:trace:${sessionId}:logs`, formatted);
          await redis.publish(`zap:trace:${sessionId}`, formatted);
        }
      };

      await emit(`ConversationRuntime v2 booting for agent '${agentId}'...`);

      // 1. Build system prompt
      const systemPrompt = await loadSystemPrompt(agentId);
      const memoryCtx = await loadMemoryContext(sessionId, userId, "OLYMPUS_SWARM", message);
      systemPrompt.push(memoryCtx);

      // 2. Build runtime components
      const tier = MODE_TIER_MAP[mode] || "B_PRODUCTIVITY";
      const apiClient = new OmniApiClient(tier, "OLYMPUS", modelId || undefined);
      const toolExecutor = new ZapToolExecutor(agentId, userId, sessionId);
      const hookRunner = new ZSSHookRunner();
      const permissionPolicy = buildDefaultPolicy();
      const prompter = new RedisPermissionPrompter(sessionId);

      // 3. Load dynamic plugins
      const pluginManager = new PluginManager();
      const plugins = await pluginManager.loadPlugins();

      const config: ConversationRuntimeConfig = {
        systemPrompt,
        maxIterations: 40,
        autoCompactionThreshold: 100_000,
        dynamicTools: plugins.definitions, // Inject dynamic tools here
      };

      // 4. Create session and load history
      const session = new Session({ id: sessionId });

      // Load existing history from MongoDB
      const historyCol = db.collection("SYS_OS_conversation_history");
      const historyDocs = await historyCol
        .find({ sessionId })
        .sort({ timestamp: 1 })
        .limit(30)
        .toArray();

      for (const doc of historyDocs) {
        session.pushMessage({
          role: doc.role as any,
          blocks: doc.blocks || [{ type: "text", text: doc.content || "" }],
          timestamp: doc.timestamp?.getTime?.() || Date.now(),
        });
      }

      // 5. Create ConversationRuntime
      const runtime = new ConversationRuntime(
        session,
        apiClient,
        new ZapToolExecutor(agentId, userId, sessionId, plugins.handlers),
        permissionPolicy,
        hookRunner,
        config
      );

      // Wire lifecycle callbacks to Redis for frontend consumption
      runtime.onToolStarted = (toolName, iteration) => {
        emit(`🔧 [iter ${iteration}] Tool started: ${toolName}`);
      };

      runtime.onToolFinished = (toolName, isError, iteration) => {
        const icon = isError ? "❌" : "✅";
        emit(`${icon} [iter ${iteration}] Tool finished: ${toolName}`);
      };

      runtime.onTurnProgress = (iteration, pendingTools) => {
        if (pendingTools > 0) {
          emit(`🔄 [iter ${iteration}] ${pendingTools} tool(s) pending...`);
        }
      };

      await emit(`Runtime ready. Running turn with ${historyDocs.length} history messages.`);

      // 5. Execute the turn
      const turnSummary = await runtime.runTurn(message, prompter);

      // 6. Extract final text response
      const finalText = turnSummary.assistantMessages
        .flatMap((m) => m.blocks)
        .filter((b) => b.type === "text")
        .map((b) => (b as any).text)
        .join("\n");

      // 7. Persist to MongoDB
      // Save user message
      await historyCol.insertOne({
        sessionId,
        role: "user",
        blocks: [{ type: "text", text: message }],
        content: message,
        timestamp: new Date(),
        runtime: "v2",
      });

      // Save assistant response
      for (const msg of turnSummary.assistantMessages) {
        await historyCol.insertOne({
          sessionId,
          role: msg.role,
          blocks: msg.blocks,
          content: msg.blocks
            .filter((b) => b.type === "text")
            .map((b) => (b as any).text)
            .join(""),
          timestamp: new Date(),
          runtime: "v2",
          usage: msg.usage,
        });
      }

      // Save tool results
      for (const msg of turnSummary.toolResults) {
        await historyCol.insertOne({
          sessionId,
          role: "tool",
          blocks: msg.blocks,
          content: msg.blocks
            .filter((b) => b.type === "tool_result")
            .map((b) => (b as any).content)
            .join(""),
          timestamp: new Date(),
          runtime: "v2",
        });
      }

      // 8. Push final reply to Redis for SSE
      const replyMsg = `> 🤖 [reply] ${finalText}\r\n`;
      await redis!.rpush(`zap:trace:${sessionId}:logs`, replyMsg);
      await redis!.publish(`zap:trace:${sessionId}`, replyMsg);

      // 9. Log metrics
      const { inputTokens, outputTokens } = turnSummary.usage;
      await emit(
        `Turn complete. ${turnSummary.iterations} iteration(s), ${inputTokens + outputTokens} tokens` +
        (turnSummary.autoCompaction
          ? `, auto-compacted ${turnSummary.autoCompaction.removedMessageCount} messages`
          : "")
      );

      // Title auto-gen on first message (fire-and-forget)
      if (historyDocs.length === 0) {
        generateTitle(sessionId, message, finalText).catch(() => {});
      }
    } catch (err: any) {
      console.error("[chat/v2] Runtime execution failed:", err);
      const errMsg = `> 🚨 [error] ConversationRuntime failure: ${err.message}\r\n`;
      if (redis) {
        await redis.rpush(`zap:trace:${sessionId}:logs`, errMsg);
        await redis.publish(`zap:trace:${sessionId}`, errMsg);
      }
    } finally {
      if (redis) redis.quit();
      if (mongoClient) await mongoClient.close();
    }
  }, 50);
});

// ─── Title Generation ───────────────────────────────────────────────────

async function generateTitle(
  sessionId: string,
  userMessage: string,
  assistantReply: string
): Promise<void> {
  const { generateOmniContent } = await import("../engine/omni_router.js");

  const titleResponse = await generateOmniContent(
    { apiKey: "", defaultModel: "gemini-2.5-flash", agentId: "system" },
    {
      systemPrompt:
        "Generate a concise thread title (max 6 words, no quotes). Respond with ONLY the title.",
      messages: [
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantReply },
      ],
      theme: "A_ECONOMIC" as const,
      intent: "FAST_CHAT" as const,
    }
  );

  if (titleResponse.text) {
    const mongoClient = new MongoClient(
      process.env.MONGODB_URI || "mongodb://localhost:27017"
    );
    await mongoClient.connect();
    await mongoClient
      .db("olympus")
      .collection("SYS_OS_session_titles")
      .updateOne(
        { sessionId },
        { $set: { title: titleResponse.text.trim().slice(0, 60), updatedAt: new Date() } },
        { upsert: true }
      );
    await mongoClient.close();
  }
}

// ─── CORS Preflight ─────────────────────────────────────────────────────

chatV2Router.options("/api/swarm/chat/v2", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});
