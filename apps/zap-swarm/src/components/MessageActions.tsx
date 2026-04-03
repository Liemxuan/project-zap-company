// Olympus ID: OLY-SWARM
"use client";

import { useState } from "react";
import { ChevronDown, Wrench, Brain, ImageIcon, AlertTriangle, Search, Globe, Terminal, FileText, Hash } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { LucideIcon } from "lucide-react";

// ── Tool Icon Mapping ────────────────────────────────────────────
function getToolIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("search") || n.includes("query") || n.includes("find")) return Search;
  if (n.includes("crawl") || n.includes("scrape") || n.includes("browse") || n.includes("web") || n.includes("fetch") || n.includes("url")) return Globe;
  if (n.includes("code") || n.includes("python") || n.includes("exec") || n.includes("repl") || n.includes("run")) return Terminal;
  if (n.includes("file") || n.includes("read") || n.includes("write") || n.includes("document")) return FileText;
  if (n.includes("calc") || n.includes("math") || n.includes("compute")) return Hash;
  if (n.includes("think") || n.includes("reason") || n.includes("plan")) return Brain;
  if (n.includes("image") || n.includes("vision") || n.includes("screenshot")) return ImageIcon;
  return Wrench;
}

// ── JSON Utilities ───────────────────────────────────────────────
function tryParseJson(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try { return JSON.parse(trimmed); } catch { return null; }
}

function toolPreview(content: string): string {
  const json = tryParseJson(content);
  if (json !== null) {
    if (typeof json === "object" && json !== null) {
      const obj = json as Record<string, unknown>;
      if (typeof obj.query === "string") return `"${obj.query.slice(0, 80)}"`;
      if (typeof obj.url === "string") return obj.url.slice(0, 80);
      if (typeof obj.message === "string") return obj.message.slice(0, 80);
      if (typeof obj.result !== "undefined") return String(obj.result).slice(0, 80);
      if (typeof obj.output === "string") return obj.output.slice(0, 80);
      if (Array.isArray(json)) return `${(json as unknown[]).length} result${(json as unknown[]).length !== 1 ? "s" : ""}`;
      const keys = Object.keys(obj);
      if (keys.length > 0) return `{ ${keys.slice(0, 3).join(", ")}${keys.length > 3 ? " …" : ""} }`;
    }
  }
  return content.slice(0, 100).replace(/\n/g, " ");
}

function isErrorContent(content: string): boolean {
  const lower = content.toLowerCase().slice(0, 300);
  return lower.includes("error") || lower.includes("exception") || lower.includes("traceback") || lower.includes("failed");
}

// ── Tool Call Card ───────────────────────────────────────────────
// Renders [Tool: tool_name] messages as styled collapsible cards

function ToolCallCard({ toolName, content }: { toolName: string; content: string }) {
  const [open, setOpen] = useState(false);
  const Icon = getToolIcon(toolName);
  const hasError = isErrorContent(content);
  const preview = toolPreview(content);

  // Auto-format JSON content for the expanded view
  const json = tryParseJson(content);
  const displayContent = json !== null
    ? `\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``
    : content;

  return (
    <div className={`my-2 border rounded-[var(--button-border-radius,8px)] overflow-hidden ${hasError ? "border-error/20 bg-error/[0.03]" : "border-outline/10 bg-layer-cover/30"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-layer-cover/50 transition-colors"
      >
        <Icon className={`size-3.5 shrink-0 ${hasError ? "text-error" : "text-primary"}`} />
        <span className="text-[12px] font-semibold text-on-surface font-mono">{toolName}</span>
        <span className={`ml-1 shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${hasError ? "bg-error/10 text-error border-error/15" : "bg-primary/8 text-primary/70 border-primary/10"}`}>
          {hasError ? "error" : "done"}
        </span>
        <span className="ml-2 text-[11px] text-on-surface-variant/50 truncate flex-1 font-mono min-w-0">{preview}</span>
        <ChevronDown className={`size-3.5 text-on-surface-variant shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-outline/10 pt-2">
          <MarkdownRenderer content={displayContent} className="text-[12px]" />
        </div>
      )}
    </div>
  );
}

// ── Thinking Block ───────────────────────────────────────────────
// Renders <thinking>...</thinking> as a collapsible reasoning section

function ThinkingBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const lineCount = content.split("\n").length;

  return (
    <div className="my-2 border border-primary/10 rounded-[var(--button-border-radius,8px)] overflow-hidden bg-primary/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-primary/[0.06] transition-colors"
      >
        <Brain className="size-3.5 text-primary shrink-0" />
        <span className="text-[12px] font-medium text-primary">Thinking</span>
        <span className="text-[10px] text-on-surface-variant/50 ml-1">{lineCount} line{lineCount !== 1 ? "s" : ""}</span>
        <ChevronDown className={`size-3.5 text-primary/60 ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-primary/10 text-[12px] text-on-surface-variant/80 leading-relaxed whitespace-pre-wrap font-mono">
          {content}
        </div>
      )}
    </div>
  );
}

// ── Inline Image ─────────────────────────────────────────────────
// Renders image URLs extracted from content as inline images

function InlineImage({ url, alt }: { url: string; alt?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="my-2 flex items-center gap-2 px-3 py-2 bg-layer-cover/30 rounded-[var(--button-border-radius,8px)] border border-outline/10 text-on-surface-variant/60 text-[11px]">
        <AlertTriangle className="size-3.5" />
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block my-2">
      <img
        src={url}
        alt={alt || "Generated image"}
        onError={() => setError(true)}
        className="max-w-full max-h-[400px] object-contain rounded-[var(--button-border-radius,8px)] border border-outline/10 hover:opacity-90 transition-opacity"
        loading="lazy"
      />
    </a>
  );
}

// ── System Message ───────────────────────────────────────────────
// Renders system-level messages with muted styling

function SystemMessage({ content }: { content: string }) {
  return (
    <div className="text-[11px] text-on-surface-variant/50 italic px-1 py-0.5">
      {content}
    </div>
  );
}

// ── Content Parser ───────────────────────────────────────────────
// Parses agent content into structured segments for rendering

type Segment =
  | { type: "tool"; toolName: string; content: string }
  | { type: "thinking"; content: string }
  | { type: "image"; url: string }
  | { type: "markdown"; content: string }
  | { type: "system"; content: string };

function parseContent(content: string, originalRole?: string): Segment[] {
  if (originalRole === "system") {
    return [{ type: "system", content }];
  }

  // Check for [Tool: X] prefix — entire message is a tool result
  const toolMatch = content.match(/^\[Tool: (.+?)\]\n?([\s\S]*)$/);
  if (toolMatch) {
    return [{ type: "tool", toolName: toolMatch[1], content: toolMatch[2] }];
  }

  // Fallback: bare tool role messages with no prefix
  if (originalRole === "tool") {
    return [{ type: "tool", toolName: "tool_result", content }];
  }

  const segments: Segment[] = [];
  const remaining = content;

  // Extract <thinking>...</thinking> blocks
  const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = thinkingRegex.exec(remaining)) !== null) {
    // Text before thinking block
    const before = remaining.slice(lastIndex, match.index).trim();
    if (before) segments.push({ type: "markdown", content: before });
    segments.push({ type: "thinking", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  const afterThinking = remaining.slice(lastIndex).trim();
  if (afterThinking) {
    // Extract image references: > 🖼️ [image] URL
    const imageRegex = /> 🖼️ \[image\] (.+)/g;
    let imgLastIndex = 0;
    let imgMatch: RegExpExecArray | null;
    let hasImages = false;

    while ((imgMatch = imageRegex.exec(afterThinking)) !== null) {
      hasImages = true;
      const before = afterThinking.slice(imgLastIndex, imgMatch.index).trim();
      if (before) segments.push({ type: "markdown", content: before });
      segments.push({ type: "image", url: imgMatch[1].trim() });
      imgLastIndex = imgMatch.index + imgMatch[0].length;
    }

    const finalText = afterThinking.slice(imgLastIndex).trim();
    if (finalText) segments.push({ type: "markdown", content: finalText });
    if (!hasImages && segments.length === 0) {
      segments.push({ type: "markdown", content: afterThinking });
    }
  }

  return segments.length > 0 ? segments : [{ type: "markdown", content }];
}

// ── Main Export ──────────────────────────────────────────────────

type MessageActionsProps = {
  content: string;
  originalRole?: string; // 'assistant' | 'tool' | 'system'
  className?: string;
};

export function MessageActions({ content, originalRole, className }: MessageActionsProps) {
  const segments = parseContent(content, originalRole);

  return (
    <div className={className}>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case "tool":
            return <ToolCallCard key={i} toolName={seg.toolName} content={seg.content} />;
          case "thinking":
            return <ThinkingBlock key={i} content={seg.content} />;
          case "image":
            return <InlineImage key={i} url={seg.url} />;
          case "system":
            return <SystemMessage key={i} content={seg.content} />;
          case "markdown":
            return <MarkdownRenderer key={i} content={seg.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
