/**
 * Athena — Research Agent Server
 * 
 * Wraps the NotebookLM CLI to give any agent in the fleet
 * programmatic access to deep research capabilities.
 * 
 * Endpoints:
 *   POST /api/research/notebook     — Create a new research notebook
 *   POST /api/research/source       — Add a source (URL or text) to current notebook
 *   POST /api/research/ask          — Ask a question across all sources
 *   POST /api/research/generate     — Generate content (audio, quiz, mind-map, etc.)
 *   POST /api/research/download     — Download a generated artifact
 *   GET  /api/research/notebooks    — List all notebooks
 *   GET  /api/research/status       — Current notebook context
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { SafeExecutor } from "./security/safe-executor.js";
import { mountMemoryRoutes } from "./lib/memory_routes.js";

const AGENT_NAME = "Athena";
const PORT = parseInt(process.env.PORT || "3903", 10);
const NOTEBOOKLM_BIN = process.env.NOTEBOOKLM_BIN || "notebooklm";

console.log(`⚡️ ${AGENT_NAME} Research Agent booting...`);

// ── Helper: run notebooklm CLI commands ───────────────────────────────────────
function parseArgs(cmd: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < cmd.length; i++) {
        const char = cmd[i];
        if (inQuotes) {
            if (char === quoteChar) {
                inQuotes = false;
            } else {
                current += char;
            }
        } else {
            if (char === '"' || char === "'") {
                inQuotes = true;
                quoteChar = char;
            } else if (char === ' ') {
                if (current.trim().length > 0) {
                    args.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
    }
    if (current.trim().length > 0) args.push(current);
    return args;
}

async function runCliAsync(argsString: string, timeoutMs: number = 300000): Promise<{ ok: boolean; output: string }> {
    try {
        const args = parseArgs(argsString);
        const executor = new SafeExecutor({
            allowedCommands: [NOTEBOOKLM_BIN],
            timeout: timeoutMs,
            env: { ...process.env, PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH}` }
        });

        const result = await executor.execute(NOTEBOOKLM_BIN, args);
        return { ok: result.exitCode === 0, output: (result.stdout + "\\n" + result.stderr).trim() };
    } catch (e: any) {
        return { ok: false, output: e.message };
    }
}

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cors());

// Mount Memory v2.1 + Heartbeat
mountMemoryRoutes(app, { name: "athena", role: "research-agent", port: PORT });

// ── Health / Root ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => res.json({ agent: AGENT_NAME, status: "ok", port: PORT }));
app.get("/health", (_req, res) => res.json({ status: "ok", agent: AGENT_NAME, uptime: process.uptime() }));

// ── Research Endpoints ────────────────────────────────────────────────────────

// List all notebooks
app.get("/api/research/notebooks", async (_req, res) => {
    const result = await runCliAsync("list --json", 60000);
    if (!result.ok) return res.status(500).json({ error: result.output });
    try {
        return res.json({ notebooks: JSON.parse(result.output) });
    } catch {
        // CLI output may not be JSON — return raw
        return res.json({ notebooks: result.output });
    }
});

// Current context status
app.get("/api/research/status", async (_req, res) => {
    const result = await runCliAsync("status", 60000);
    return res.json({ status: result.ok ? "active" : "no-context", output: result.output });
});

const NotebookSchema = z.object({ title: z.string().max(250) });

// Create a new notebook
app.post("/api/research/notebook", async (req, res) => {
    const parse = NotebookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload: title required (max 250 chars)" });
    const { title } = parse.data;

    const result = await runCliAsync(`create "${title.replace(/"/g, '\\"')}"`, 60000);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ created: true, output: result.output });
});

const UseSchema = z.object({ notebook_id: z.string().max(250) });

// Set active notebook
app.post("/api/research/use", async (req, res) => {
    const parse = UseSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload: notebook_id required (max 250 chars)" });
    const { notebook_id } = parse.data;

    const result = await runCliAsync(`use ${notebook_id}`, 60000);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ active: true, output: result.output });
});

const SourceSchema = z.object({
    url: z.string().max(2048).optional(),
    text: z.string().max(50000).optional(),
    file: z.string().max(1024).optional()
}).refine(data => data.url || data.text || data.file, { message: "url, text, or file required" });

// Add source (URL, text, or file path)
app.post("/api/research/source", async (req, res) => {
    const parse = SourceSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload: url, text, or file required with valid lengths" });
    const { url, text, file } = parse.data;

    let args = "source add";
    if (url) args += ` "${url.replace(/"/g, '\\"')}"`;
    else if (file) args += ` "${file.replace(/"/g, '\\"')}"`;
    else if (text) args += ` --text "${text.replace(/"/g, '\\"')}"`;

    const result = await runCliAsync(args);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ added: true, output: result.output });
});

const AskSchema = z.object({ question: z.string().max(2000) });

// Ask a question
app.post("/api/research/ask", async (req, res) => {
    const parse = AskSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload: question required (max 2000 chars)" });
    const { question } = parse.data;

    const result = await runCliAsync(`ask "${question.replace(/"/g, '\\"')}"`);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ answer: result.output });
});

const GenerateSchema = z.object({
    type: z.enum(["audio", "video", "quiz", "flashcards", "mind-map", "slide-deck", "infographic", "data-table", "cinematic-video"]),
    instructions: z.string().max(2000).optional(),
    wait: z.boolean().optional()
});

// Generate content (audio, quiz, mind-map, video, flashcards, slide-deck, etc.)
app.post("/api/research/generate", async (req, res) => {
    const parse = GenerateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: `Invalid payload` });
    const { type, instructions, wait } = parse.data;

    let args = `generate ${type}`;
    if (instructions) args += ` "${instructions.replace(/"/g, '\\"')}"`;
    if (wait !== false) args += " --wait";

    // Long-running — use async with 5 min timeout
    const result = await runCliAsync(args, 300000);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ generated: true, type, output: result.output });
});

const DownloadSchema = z.object({
    type: z.string().max(100),
    output_path: z.string().max(1024),
    format: z.string().max(100).optional()
});

// Download generated artifact
app.post("/api/research/download", async (req, res) => {
    const parse = DownloadSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload: type and output_path required" });
    const { type, output_path, format } = parse.data;

    let args = `download ${type}`;
    if (format) args += ` --format ${format}`;
    args += ` "${output_path.replace(/"/g, '\\"')}"`;

    const result = await runCliAsync(args);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ downloaded: true, path: output_path, output: result.output });
});

const WebSchema = z.object({ query: z.string().max(1000) });

// Research web sources
app.post("/api/research/web", async (req, res) => {
    const parse = WebSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload: query required (max 1000 chars)" });
    const { query } = parse.data;

    const result = await runCliAsync(`source add-research "${query.replace(/"/g, '\\"')}"`, 120000);
    if (!result.ok) return res.status(500).json({ error: result.output });
    return res.json({ researched: true, output: result.output });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
    console.log(`[${AGENT_NAME.toUpperCase()} SERVER] 🎧 Research agent active on port ${PORT}`);
    console.log(`[${AGENT_NAME.toUpperCase()}] 📚 NotebookLM CLI: ${NOTEBOOKLM_BIN}`);

    // Quick auth check
    runCliAsync("auth check", 10000).then(authCheck => {
        if (authCheck.output.includes("pass")) {
            console.log(`[${AGENT_NAME.toUpperCase()}] ✅ NotebookLM auth: valid`);
        } else {
            console.warn(`[${AGENT_NAME.toUpperCase()}] ⚠️  NotebookLM auth: needs login (run 'notebooklm login')`);
        }
    });
});

// Graceful shutdown
process.once("SIGINT", () => console.log(`\n[shutdown] SIGINT received, stopping ${AGENT_NAME}...`));
process.once("SIGTERM", () => console.log(`\n[shutdown] SIGTERM received, stopping ${AGENT_NAME}...`));
