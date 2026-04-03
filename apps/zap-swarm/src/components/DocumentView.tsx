// Olympus ID: OLY-SWARM
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Download, List, ChevronRight, Copy, Check, ExternalLink, FileText } from "lucide-react";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    const match = h2 || h3;
    const level = h2 ? 2 : h3 ? 3 : null;
    if (!match || !level) continue;

    const rawTitle = match[1].replace(/[*_`#]/g, "").trim();
    const baseId = slugify(rawTitle);
    const count = seen.get(baseId) || 0;
    seen.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count}`;
    toc.push({ id, title: rawTitle, level: level as 2 | 3 });
  }
  return toc;
}

function extractTitle(markdown: string): string {
  const h1 = markdown.match(/^# (.+)/m);
  return h1 ? h1[1].replace(/[*_`#]/g, "").trim() : "Document";
}

type DocumentViewProps = {
  content: string;
  onExport?: () => void;
};

export function DocumentView({ content, onExport }: DocumentViewProps) {
  const toc = parseToc(content);
  const title = extractTitle(content);
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");
  const [tocOpen, setTocOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (!contentRef.current || toc.length === 0) return;

    const headingEls = toc.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        root: contentRef.current,
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      }
    );

    headingEls.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [content, toc.length]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      const container = contentRef.current;
      const top = el.offsetTop - 24;
      container.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
    }
  }, []);

  const handleExportMd = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(title) || "report"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onExport?.();
  }, [content, title, onExport]);

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  // Per-render heading ID counter — fresh Map each render, no side effects
  const renderHeadingCounters = new Map<string, number>();
  const makeHeadingId = (text: string): string => {
    const baseId = slugify(String(text).replace(/[*_`#]/g, "").trim());
    const count = renderHeadingCounters.get(baseId) ?? 0;
    renderHeadingCounters.set(baseId, count + 1);
    return count === 0 ? baseId : `${baseId}-${count}`;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Document header bar */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-outline/10 bg-layer-base/60">
        <button
          type="button"
          onClick={() => setTocOpen((v) => !v)}
          title="Toggle table of contents"
          className={`p-1.5 rounded-md transition-colors ${tocOpen ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface hover:bg-layer-panel"}`}
        >
          <List className="size-3.5" />
        </button>
        <FileText className="size-3.5 text-on-surface-variant shrink-0" />
        <Text size="label-large" className="font-semibold text-on-surface truncate flex-1">{title}</Text>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopyAll}
            title="Copy markdown"
            className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-layer-panel transition-colors"
          >
            {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleExportMd}
            title="Export as Markdown"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-on-surface-variant hover:text-on-surface hover:bg-layer-panel border border-outline/10 transition-colors"
          >
            <Download className="size-3" />
            .md
          </button>
        </div>
      </div>

      {/* Body: TOC + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* TOC Sidebar */}
        {tocOpen && toc.length > 0 && (
          <nav className="w-[200px] shrink-0 flex flex-col overflow-y-auto border-r border-outline/10 bg-layer-base/40 py-4 custom-scrollbar">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest">Contents</span>
            </div>
            {toc.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left flex items-start gap-1.5 px-3 py-1.5 text-[12px] leading-snug transition-all group ${
                  item.level === 3 ? "pl-6" : ""
                } ${
                  activeId === item.id
                    ? "text-primary bg-primary/8 font-medium"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-layer-panel/60"
                }`}
              >
                {item.level === 2 ? (
                  <ChevronRight
                    className={`size-3 mt-0.5 shrink-0 transition-transform ${activeId === item.id ? "text-primary" : "text-on-surface-variant/40 group-hover:text-on-surface-variant"}`}
                  />
                ) : (
                  <span className="size-3 mt-1.5 shrink-0 flex items-center justify-center">
                    <span className={`size-1 rounded-full ${activeId === item.id ? "bg-primary" : "bg-on-surface-variant/30"}`} />
                  </span>
                )}
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Document Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-[680px] mx-auto px-8 py-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1({ children }) {
                  const text = String(children);
                  return (
                    <h1 className="text-2xl font-bold mb-6 mt-0 text-on-surface leading-tight tracking-tight">
                      {children}
                    </h1>
                  );
                },
                h2({ children }) {
                  const id = makeHeadingId(String(children));
                  return (
                    <h2
                      id={id}
                      className="text-lg font-bold mb-3 mt-8 first:mt-0 text-on-surface scroll-mt-6 border-b border-outline/10 pb-2"
                    >
                      {children}
                    </h2>
                  );
                },
                h3({ children }) {
                  const id = makeHeadingId(String(children));
                  return (
                    <h3
                      id={id}
                      className="text-base font-semibold mb-2 mt-6 first:mt-0 text-on-surface scroll-mt-6"
                    >
                      {children}
                    </h3>
                  );
                },
                h4({ children }) {
                  return <h4 className="text-sm font-semibold mb-2 mt-4 text-on-surface">{children}</h4>;
                },
                p({ children }) {
                  return <p className="mb-4 last:mb-0 leading-relaxed text-[14px] text-on-surface/90">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="mb-4 pl-5 list-disc space-y-1.5">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="mb-4 pl-5 list-decimal space-y-1.5">{children}</ol>;
                },
                li({ children }) {
                  return <li className="text-[14px] leading-relaxed text-on-surface/90 pl-1">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-[3px] border-primary/50 pl-5 my-4 text-on-surface-variant italic bg-primary/[0.03] py-3 pr-4 rounded-r-md">
                      {children}
                    </blockquote>
                  );
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors inline-flex items-center gap-0.5"
                    >
                      {children}
                      <ExternalLink className="size-3 shrink-0 opacity-60" />
                    </a>
                  );
                },
                strong({ children }) {
                  return <strong className="font-semibold text-on-surface">{children}</strong>;
                },
                em({ children }) {
                  return <em className="italic text-on-surface/85">{children}</em>;
                },
                hr() {
                  return <hr className="my-8 border-outline/15" />;
                },
                table({ children }) {
                  return (
                    <div className="my-5 overflow-x-auto rounded-[var(--button-border-radius,8px)] border border-outline/10">
                      <table className="w-full text-[13px] border-collapse">{children}</table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-layer-cover/50">{children}</thead>;
                },
                th({ children }) {
                  return (
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline/10">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return <td className="px-4 py-2.5 border-b border-outline/5 text-[13px] text-on-surface">{children}</td>;
                },
                img({ src, alt }) {
                  return (
                    <img
                      src={src}
                      alt={alt || ""}
                      className="max-w-full h-auto rounded-[var(--button-border-radius,8px)] my-4 border border-outline/10 shadow-sm"
                      loading="lazy"
                    />
                  );
                },
                code({ className: codeClassName, children, ...props }) {
                  const match = /language-(\w+)/.exec(codeClassName || "");
                  const codeString = String(children).replace(/\n$/, "");

                  if (!match) {
                    return (
                      <code className="px-1.5 py-0.5 rounded-[4px] bg-layer-cover border border-outline/10 text-[0.875em] font-[var(--font-dev,monospace)]" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="my-4 rounded-[var(--button-border-radius,8px)] border border-outline/10 overflow-hidden">
                      <div className="flex items-center px-4 py-2 bg-layer-cover/60 border-b border-outline/10">
                        <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">{match[1]}</span>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: "1rem 1.25rem", background: "transparent", fontSize: "13px", lineHeight: "1.6" }}
                        showLineNumbers={codeString.split("\n").length > 3}
                        lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", opacity: 0.35, fontSize: "12px", userSelect: "none" }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                del({ children }) {
                  return <del className="line-through text-on-surface-variant">{children}</del>;
                },
                input({ type, checked, ...props }) {
                  if (type === "checkbox") {
                    return <input type="checkbox" checked={checked} readOnly className="mr-2 accent-primary align-middle" {...props} />;
                  }
                  return <input type={type} {...props} />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
