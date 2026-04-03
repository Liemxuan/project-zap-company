// Olympus ID: OLY-SWARM
"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ExternalLink } from "lucide-react";

type MarkdownRendererProps = {
  content: string;
  className?: string;
  theme?: "light" | "dark";
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-[var(--button-border-radius,8px)] bg-layer-cover/80 border border-outline/10 text-on-surface-variant hover:text-on-surface hover:bg-layer-cover transition-all opacity-0 group-hover/code:opacity-100"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check className="size-3.5 text-[var(--state-success,#4caf50)]" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

export function MarkdownRenderer({ content, className = "", theme = "dark" }: MarkdownRendererProps) {
  const syntaxTheme = theme === "dark" ? oneDark : oneLight;

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Code blocks + inline code
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const codeString = String(children).replace(/\n$/, "");

            // Inline code (no language match and single line)
            if (!match) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-[4px] bg-layer-cover border border-outline/10 text-[0.875em] font-[var(--font-dev,monospace)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Fenced code block
            return (
              <div className="group/code relative my-4 rounded-[var(--button-border-radius,8px)] border border-outline/10 overflow-hidden">
                {/* Language label */}
                <div className="flex items-center justify-between px-4 py-2 bg-layer-cover/60 border-b border-outline/10">
                  <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                    {match[1]}
                  </span>
                </div>
                <SyntaxHighlighter
                  style={syntaxTheme}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1rem 1.25rem",
                    background: "transparent",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    fontFamily: "var(--font-dev, 'JetBrains Mono', monospace)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "var(--font-dev, 'JetBrains Mono', monospace)",
                    },
                  }}
                  showLineNumbers={codeString.split("\n").length > 3}
                  lineNumberStyle={{
                    minWidth: "2.5em",
                    paddingRight: "1em",
                    color: "var(--on-surface-variant, #999)",
                    opacity: 0.4,
                    fontSize: "12px",
                    userSelect: "none",
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
                <CopyButton text={codeString} />
              </div>
            );
          },

          // Paragraphs
          p({ children }) {
            return (
              <p className="mb-3 last:mb-0 leading-relaxed text-[length:var(--type-body-small-desktop,13px)]">
                {children}
              </p>
            );
          },

          // Headings
          h1({ children }) {
            return <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-on-surface">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mb-3 mt-5 first:mt-0 text-on-surface">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-on-surface">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-on-surface">{children}</h4>;
          },

          // Lists
          ul({ children }) {
            return <ul className="mb-3 pl-5 list-disc space-y-1.5 last:mb-0">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-3 pl-5 list-decimal space-y-1.5 last:mb-0">{children}</ol>;
          },
          li({ children }) {
            return (
              <li className="text-[length:var(--type-body-small-desktop,13px)] leading-relaxed pl-1">
                {children}
              </li>
            );
          },

          // Links
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors inline-flex items-center gap-1"
              >
                {children}
                <ExternalLink className="size-3 inline-block shrink-0" />
              </a>
            );
          },

          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-[3px] border-primary/40 pl-4 my-3 text-on-surface-variant italic">
                {children}
              </blockquote>
            );
          },

          // Tables
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-[var(--button-border-radius,8px)] border border-outline/10">
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
            return (
              <td className="px-4 py-2.5 border-b border-outline/5 text-on-surface">
                {children}
              </td>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-5 border-outline/10" />;
          },

          // Images
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt || ""}
                className="max-w-full h-auto rounded-[var(--button-border-radius,8px)] my-3 border border-outline/10"
                loading="lazy"
              />
            );
          },

          // Preformatted (fallback for code blocks without language)
          pre({ children }) {
            return <>{children}</>;
          },

          // Strong / emphasis
          strong({ children }) {
            return <strong className="font-semibold text-on-surface">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-on-surface/90">{children}</em>;
          },

          // Strikethrough (GFM)
          del({ children }) {
            return <del className="line-through text-on-surface-variant">{children}</del>;
          },

          // Task list checkboxes (GFM)
          input({ type, checked, ...props }) {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 accent-primary align-middle"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      />
    </div>
  );
}
