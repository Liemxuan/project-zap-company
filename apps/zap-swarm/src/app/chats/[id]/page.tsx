"use client";

import Link from "next/link";
import { TerminalSquare, Send, Bot, User, Paperclip, Loader2, Download, Files, Code2, Eye, ExternalLink, Copy, X, ChevronDown, Circle, CircleDashed, GraduationCap, ArrowUp, Zap, Rocket, Check, Blocks, Brain, LineChart, Mic2, History, Clock } from "lucide-react";
import { use, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { OmniJobGraphNode, WorkflowGraph } from "@/components/WorkflowGraph";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getSession } from "../../../../../../packages/zap-auth/src/actions";
import { Sandpack } from "@codesandbox/sandpack-react";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  originalRole?: string;
  toolName?: string;
  content: string;
  timestamp: string;
};

export default function TraceExecution({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentIdFromUrl = searchParams?.get('agent');
  const sessionId = resolvedParams.id;
  const [logs, setLogs] = useState<string>("> Booting trace interface connection...\n");
  const [userSession, setUserSession] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Focus and Click Outside Refs
  const inputBarRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const artifactsHeaderRef = useRef<HTMLDivElement>(null);


  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<{id?: string, name: string, type: string, url?: string, status?: string, mimeType?: string, data?: string, text?: string}[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputBarRef.current && !inputBarRef.current.contains(e.target as Node)) {
        setAutonomyDropdownOpen(false);
        setContextDropdownOpen(false);
        setSkillsDropdownOpen(false);
        setModeDropdownOpen(false);
      }
      if (artifactsHeaderRef.current && !artifactsHeaderRef.current.contains(e.target as Node)) {
        setFileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Fetch Identity 2 AM standard — mandatory for forced login context
    getSession().then(session => {
        if (session) setUserSession(session);
    });

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  // Resize Handler State
  const [rightPaneWidth, setRightPaneWidth] = useState(450);
  const [isDragging, setIsDragging] = useState(false);

  // Autonomy Selection State
  const [autonomyDropdownOpen, setAutonomyDropdownOpen] = useState(false);
  const [autonomyMode, setAutonomyMode] = useState("Edit automatically");

  // Context Actions State
  const [contextDropdownOpen, setContextDropdownOpen] = useState(false);

  // Conversational Mock State
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [jobs, setJobs] = useState<OmniJobGraphNode[]>([]);

  const [streamPreview, setStreamPreview] = useState<string>("");
  const [isWorking, setIsWorking] = useState(false);

  // Sub-Phase 2A & 2B: Artifact and HITL State
  const [hitlChallenge, setHitlChallenge] = useState<any>(null);
  const [artifactPreview, setArtifactPreview] = useState<any>(null);

  // Test hooks: expose state setters on window for Playwright
  useEffect(() => {
    console.log("[ZAP_TEST_HOOKS] Registering window.__ZAP_SET_JOBS__");
    (window as any).__ZAP_SET_JOBS__ = (tasks: OmniJobGraphNode[]) => {
      setJobs(prev => {
        if (prev.length === 0 && tasks.length > 0) setTodosOpen(true);
        return tasks;
      });
    };
    (window as any).__ZAP_SET_TYPING__ = setIsTyping;
    (window as any).__ZAP_SET_STREAM_PREVIEW__ = setStreamPreview;
    (window as any).__ZAP_SET_MESSAGES__ = setMessages;
    return () => {
      delete (window as any).__ZAP_SET_JOBS__;
      delete (window as any).__ZAP_SET_TYPING__;
      delete (window as any).__ZAP_SET_STREAM_PREVIEW__;
      delete (window as any).__ZAP_SET_MESSAGES__;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classifyStep = (intent: string) => {
    if (!intent) return "TASK";
    const t = intent.toLowerCase();
    if (t.includes("search") || t.includes("research") || t.includes("fetch")) return "RESEARCH";
    if (t.includes("analyse") || t.includes("analys") || t.includes("evaluat") || t.includes("review")) return "ANALYSIS";
    if (t.includes("generat") || t.includes("write") || t.includes("draft")) return "SYNTHESIS";
    if (t.includes("deploy") || t.includes("execut") || t.includes("run")) return "EXECUTE";
    if (t.includes("memory") || t.includes("store") || t.includes("save")) return "MEMORY";
    return "TASK";
  };

  // Skill Invocation State
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<{ name: string; identifier: string; strategy: string; status: string }[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/swarm/models')
      .then(r => r.json())
      .then(d => {
        if (d.models) {
          const active = d.models.filter((m: any) => m.status === 'ACTIVE');
          setAvailableModels(active);
          if (!selectedModelId && active.length > 0) {
            const def = active.find((m: any) => m.identifier === 'gemini-2.5-flash') || active[0];
            setSelectedModelId(def.identifier);
          }
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dfSkills = [
    { id: 'df-deep-research', name: 'Deep Research', icon: <Brain className="size-[15px]" strokeWidth={2} />, desc: 'Systematic multi-angle research engine' },
    { id: 'df-chart-visualization', name: 'Chart Analytics', icon: <LineChart className="size-[15px]" strokeWidth={2} />, desc: 'Render JS visualization frameworks' },
    { id: 'df-web-design-guidelines', name: 'UX Compliance', icon: <Eye className="size-[15px]" strokeWidth={2} />, desc: 'Audit against Interface Guidelines' },
    { id: 'df-podcast-generation', name: 'Podcast Studio', icon: <Mic2 className="size-[15px]" strokeWidth={2} />, desc: 'Generate conversational audio' }
  ];

  const injectSkill = (skill: typeof dfSkills[0]) => {
    setSkillsDropdownOpen(false);
    setInput((prev) => prev + (prev.trim() ? " " : "") + `/${skill.id} `);
  };

  const [selectedSkillContext, setSelectedSkillContext] = useState({ url: "", query: "" });
  const activeSkillTag = input.trim().match(/^\/(df-[^\s]+)/)?.[1];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "agent",
      content: "OmniRouter Sandbox (v2.0) initialized. I have loaded the `web-builder` and `image-generation` skills. How can I help you build today?",
      timestamp: new Date().toISOString(), // suppressHydrationWarning handles SSR mismatch
    }
  ]);

  // Fix Next.js hydration error with timestamps natively
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "1" && !prev[0].timestamp) {
        return [{ ...prev[0], timestamp: new Date().toISOString() }];
      }
      return prev;
    });
  }, []);

  // Phase 5: Unified Continuous Polling for State Consistency -> Migrated to Phase A SSE
  const hasLoadedHistoryRef = useRef(false);

  useEffect(() => {
    if (!resolvedParams.id) return;

    // Phase A: Streaming render with EventSource
    const es = new EventSource(`/api/swarm/history/${resolvedParams.id}/stream`);

    es.addEventListener("messages", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.messages && data.messages.length > 0) {
          setMessages(prev => {
            const newMessages = data.messages.map((h: any) => ({
              id: h.id?.toString() || h._id?.toString(),
              role: h.role === "user" ? "user" : "agent",
              originalRole: h.originalRole || h.role,
              toolName: h.toolName,
              content: h.toolName ? `[Tool: ${h.toolName}]\n${h.content}` : h.content,
              timestamp: h.timestamp ? new Date(h.timestamp).toISOString() : new Date().toISOString()
            }));
            if (prev.length !== newMessages.length || prev[prev.length - 1]?.content !== newMessages[newMessages.length - 1]?.content) {
              setStreamPreview(""); // clear stream preview
              setIsWorking(false);
              setIsTyping(false);
              if (!hasLoadedHistoryRef.current) {
                setLogs((l: string) => l + `\n> 📦 [system] Restored ${data.messages.length} historical messages from database.\n`);
                hasLoadedHistoryRef.current = true;
              } else if (newMessages.length > prev.length) {
                setLogs((l: string) => l + `> 📥 [system] Received new agent response via memory pipeline.\n`);
              }
              return newMessages;
            }
            return prev;
          });
        }
      } catch (err) { }
    });

    es.addEventListener("jobs", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.tasks) {
          setJobs(prev => {
            // Auto-expand if transitioning from 0 to >0
            if (prev.length === 0 && data.tasks.length > 0) {
              setTodosOpen(true);
            }
            return data.tasks;
          });
        }
      } catch (err) { }
    });

    es.addEventListener("status", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "working") {
          setIsWorking(true);
          setStreamPreview(""); // hasn't got text yet
          setIsTyping(true);
        } else if (data.type === "reply_incoming") {
          setIsWorking(false);
          setIsTyping(true);
        }
      } catch (err) { }
    });

    es.addEventListener("reply_preview", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.content) {
          setStreamPreview(data.content);
          setIsWorking(false); // token arrived, stop spinner
          setIsTyping(true);
        }
      } catch (err) { }
    });

    return () => es.close();
  }, [resolvedParams.id]);

  // Artifacts State
  const [artifacts, setArtifacts] = useState<{ name: string, content: string, type: 'html' | 'image' | 'text' }[]>([]);
  const [activeArtifactIndex, setActiveArtifactIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('preview');
  const [showArtifacts, setShowArtifacts] = useState(true);

  // Sessions Panel State
  const [showSessionsPanel, setShowSessionsPanel] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<{ id: string; title: string | null; agentId: string; createdAt: string; turns: number }[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    if (!showSessionsPanel) return;
    setSessionsLoading(true);
    const agentParam = agentIdFromUrl ? `?agent=${encodeURIComponent(agentIdFromUrl)}` : '';
    fetch(`/api/swarm/sessions${agentParam}`)
      .then(r => r.json())
      .then(d => { if (d.sessions) setSessionHistory(d.sessions); })
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, [showSessionsPanel, agentIdFromUrl]);

  // VFS Artifacts Sync
  useEffect(() => {
    if (!resolvedParams.id) return;

    const fetchArtifacts = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch(`/api/swarm/threads/${resolvedParams.id}/artifacts`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (data.artifacts) {
            const parsed = data.artifacts.map((a: any) => ({
              name: a.filename,
              content: a.content,
              type: a.type === 'image' || a.filename.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? 'image' : a.type === 'html' || a.filename.endsWith('.html') ? 'html' : 'text'
            }));

            setArtifacts(prev => {
              const newArr = [...prev];
              let changed = false;

              parsed.forEach((p: any) => {
                const existingIdx = newArr.findIndex(existing => existing.name === p.name);
                if (existingIdx === -1) {
                  newArr.push(p);
                  changed = true;
                } else if (newArr[existingIdx].content !== p.content) {
                  newArr[existingIdx] = p;
                  changed = true;
                }
              });
              return changed ? newArr : prev;
            });
          }
        }
      } catch (err) {
        // Silent — artifact polling is non-critical
      } finally {
        clearTimeout(timeout);
      }
    };

    fetchArtifacts();
    const interval = setInterval(fetchArtifacts, 8000);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  // Handle SSE Terminal Trace
  useEffect(() => {
    let sse: EventSource;
    try {
      sse = new EventSource(`/api/swarm/logs?container=${resolvedParams.id}`);
      sse.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.logs) {
            setLogs((prev) => prev + data.logs);
          }
        } catch (err) { }
      };
    } catch (err) {
      console.error("SSE Connection Failed:", err);
    }

    return () => {
      if (sse) sse.close();
    };
  }, [resolvedParams.id]);

  // WebSocket Native Connection for Gateway Bridging (Artifacts & HITL)
  useEffect(() => {
    if (!resolvedParams.id) return;
    const wsUrl = (process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900").replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', event: 'hitl' }));
      ws.send(JSON.stringify({ type: 'subscribe', event: 'artifact' }));
    };

    ws.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === 'hitl') {
          if (payload.data?.status === "WAITING_APPROVAL") {
            setHitlChallenge(payload.data);
          } else {
            setHitlChallenge(null);
          }
        }
        if (payload.type === 'artifact') {
          setArtifactPreview(payload.data);
        }
      } catch (err) {}
    };

    return () => ws.close();
  }, [resolvedParams.id]);

  // Auto-scroll terminal
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle Drag Resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth < 50) {
        setRightPaneWidth(0);
      } else if (newWidth < 800) {
        setRightPaneWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);


  const processFiles = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      const tempId = crypto.randomUUID();
      
      const fileEntry = { 
        id: tempId, 
        name: file.name, 
        type: file.type.startsWith('image/') ? 'image' : 'file', 
        mimeType: file.type || 'application/octet-stream',
        status: 'uploading',
        data: '',
        text: ''
      };
      
      setAttachments(prev => [...prev, fileEntry]);

      // Read for UI local preview / pure text injection
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (fileEntry.type === 'image' || file.type === 'application/pdf') {
          setAttachments(prev => prev.map(a => a.id === tempId ? { ...a, data: result } : a));
        } else {
          const textReader = new FileReader();
          textReader.onload = (tev) => {
            setAttachments(prev => prev.map(a => a.id === tempId ? { ...a, text: tev.target?.result as string } : a));
          };
          textReader.readAsText(file);
        }
      };
      reader.readAsDataURL(file);

      // Upload to gateway backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", resolvedParams.id);
      
      fetch('/api/swarm/upload', {
        method: 'POST',
        headers: {
          'X-ZAP-User': userSession?.username || 'GUEST'
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.attachment) {
           setAttachments(prev => prev.map(a => a.id === tempId ? { ...a, status: 'complete', url: data.attachment.url } : a));
        } else {
           setAttachments(prev => prev.map(a => a.id === tempId ? { ...a, status: 'error' } : a));
        }
      })
      .catch(() => {
         setAttachments(prev => prev.map(a => a.id === tempId ? { ...a, status: 'error' } : a));
      });
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const items = e.dataTransfer.items;
    if (items) {
      const files: File[] = [];
      const scanFiles = async (item: any) => {
        if (item.isFile) {
          return new Promise<void>((resolve) => {
            item.file((file: File) => {
              files.push(file);
              resolve();
            });
          });
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          return new Promise<void>((resolve) => {
            dirReader.readEntries(async (entries: any[]) => {
              for (const entry of entries) {
                await scanFiles(entry);
              }
              resolve();
            });
          });
        }
      };

      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
        if (item) {
          await scanFiles(item);
        } else if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) processFiles(files);
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };


  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const currentInput = (overrideInput || input).trim();
    if ((!currentInput && attachments.length === 0) || isTyping) return;

    const sessionId = resolvedParams.id;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput || (attachments.length > 0 ? "Uploaded files." : ""),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentSkillTag = currentInput.match(/^\/(df-[^\s]+)/)?.[1];
    setInput("");
    const attachmentsPayload = [...attachments];
    setAttachments([]);
    setIsTyping(true);

    // Initial reasoning step log
    setLogs(prev => prev + `\n> 👤 [user] ${currentInput}\n> ⚙️ [system] Enqueueing job to ConversationRuntime V2...\n`);

    try {
      const response = await fetch('/api/swarm/chat/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          agentId: agentIdFromUrl || resolvedParams.id, // Support the agent from the query string or URL fallback
          message: currentInput || (attachmentsPayload.length > 0 ? "Uploaded files." : ""),
          tenantId: "OLYMPUS_SWARM",
          modelId: selectedModelId || undefined,
          contextParams: currentSkillTag ? selectedSkillContext : undefined,
          attachments: attachmentsPayload.length > 0 ? attachmentsPayload : undefined

        })
      });

      if (!response.ok) {
        // Surface the real error body from claw, not just the HTTP status text
        let errMsg = response.statusText;
        try { const errBody = await response.json(); errMsg = errBody.error || errMsg; } catch { }
        throw new Error(`API Error: ${errMsg}`);
      }

      const data = await response.json();
      setLogs(prev => prev + `> ✅ [system] Job enqueued (ID: ${data.jobId}). Waiting for agent execution...\n`);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setLogs(prev => prev + `> ❌ [error] ${err.message}\n`);
      setIsTyping(false);
    }
  };

  // SSE Log parsing removed: Phase 5 mandates polling from actual backend history

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Phase D: Cmd+K focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputBarRef.current?.querySelector('textarea')?.focus();
      }
      // Phase D: Esc cancels
      if (e.key === 'Escape' && isTyping) {
        // Phase D: Cancel running execution
        setIsTyping(false);
        setIsWorking(false);
        fetch(`/api/swarm/threads/${resolvedParams.id}/interrupt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'user_cancelled' }),
        }).catch(() => {/* silent */ });
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTyping, resolvedParams.id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Phase D: Enter/Cmd+Enter sends
    if (e.key === "Enter" && (!e.shiftKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  // Header UI Functions
  const [copied, setCopied] = useState(false);
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [todosOpen, setTodosOpen] = useState(false); // Collapsed by default (Phase C)

  const handleCopy = () => {
    const textToCopy = activeArtifactIndex === null ? logs : activeArtifactIndex === -1 ? JSON.stringify(jobs, null, 2) : artifacts[activeArtifactIndex].content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = activeArtifactIndex === null ? logs : activeArtifactIndex === -1 ? JSON.stringify(jobs, null, 2) : artifacts[activeArtifactIndex].content;
    const filename = activeArtifactIndex === null ? `system_trace_${resolvedParams.id}.log` : activeArtifactIndex === -1 ? `omni_queue_dag.json` : artifacts[activeArtifactIndex].name;
    const type = activeArtifactIndex === null || activeArtifactIndex === -1 ? 'text/plain' : artifacts[activeArtifactIndex].type === 'html' ? 'text/html' : 'application/octet-stream';

    let blob;
    if (activeArtifactIndex !== null && activeArtifactIndex !== -1 && artifacts[activeArtifactIndex]?.type === 'image' && content.startsWith('data:image')) {
      const arr = content.split(',');
      const match = arr[0].match(/:(.*?);/);
      const mime = match ? match[1] : 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) { u8arr[n] = bstr.charCodeAt(n); }
      blob = new Blob([u8arr], { type: mime });
    } else {
      blob = new Blob([content], { type });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewWindow = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      if (activeArtifactIndex === null) {
        newWindow.document.write(`<pre style="background:#000;color:#0f0;padding:20px;margin:0;min-height:100vh;">${logs}</pre>`);
      } else if (activeArtifactIndex === -1) {
        newWindow.document.write(`<pre>${JSON.stringify(jobs, null, 2)}</pre>`);
      } else {
        if (artifacts[activeArtifactIndex].type === 'html') {
          newWindow.document.write(artifacts[activeArtifactIndex].content);
        } else if (artifacts[activeArtifactIndex].type === 'image') {
          newWindow.document.write(`<img src="${artifacts[activeArtifactIndex].content}" style="max-width:100%; height:auto;" />`);
        } else {
          newWindow.document.write(`<pre>${artifacts[activeArtifactIndex].content}</pre>`);
        }
      }
      newWindow.document.title = (activeArtifactIndex === null ? `Trace: ${resolvedParams.id}` : activeArtifactIndex === -1 ? `DAG: ${resolvedParams.id}` : artifacts[activeArtifactIndex].name) ?? 'Preview';
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-hidden relative z-10 bg-layer-base">
        {/* TWO PANE SPLIT */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* DRAG OVERLAY: Prevents text selection interference while dragging */}
          {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize" />}

          {/* LEFT PANE: THE CHAT CANVAS (DeerFlow Clone) */}
          <div 
            className={`flex-1 flex flex-col bg-layer-canvas relative z-10 min-w-0 transition-colors ${isDragOver ? 'bg-primary/5 ring-1 ring-primary ring-inset' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragOver && (
              <div className="absolute inset-0 z-[100] bg-layer-base/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-center p-8 bg-surface-container-high rounded-[24px] shadow-2xl border border-outline/20 text-primary">
                  <Files className="size-10 mb-3" strokeWidth={1.5} />
                  <span className="text-[12px] font-bold tracking-widest uppercase">Drop attachments to upload</span>
                </div>
              </div>
            )}

            {/* Functional Chat Header (MCP, Export, Tools) */}
            <div className="h-[50px] shrink-0 border-b border-outline/10 flex items-center justify-between px-6 bg-layer-base/50 backdrop-blur-md relative z-20">
              <div className="flex items-center gap-3">
                <div className="flex items-center h-full pl-2 pr-4 border-r border-outline/10 gap-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-on-surface">ID:</span>
                  <span className="text-[11px] font-normal text-on-surface-variant uppercase tracking-widest">{resolvedParams.id}</span>
                </div>

                {/* MCP Live Status Pill */}
                <div className="hidden md:flex flex-row items-center gap-2 bg-layer-panel border border-outline/10 px-3 py-1.5 rounded-[8px] shadow-sm ml-1">
                  <div className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-50"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-[#10b981]"></span>
                  </div>
                  <div className="text-on-surface-variant font-mono uppercase tracking-widest text-[9px] font-bold">MCP LIVE</div>
                  <div className="flex items-center gap-1.5 ml-2 border-l border-outline/10 pl-2">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 text-[9px] font-mono rounded-[4px] tracking-tight">STITCH</span>
                    <span className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 px-1.5 py-0.5 text-[9px] font-mono rounded-[4px] tracking-tight">GITHUB</span>
                  </div>
                </div>
              </div>
              <div className="flex bg-transparent items-center gap-5">
                <button type="button" onClick={handleDownload} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <Download className="size-[15px]" strokeWidth={2} />
                  <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">EXPORT</span>
                </button>
                <button type="button"
                  onClick={() => setShowArtifacts(!showArtifacts)}
                  className={`flex items-center gap-2 transition-colors ${showArtifacts ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <Files className="size-[15px]" strokeWidth={2} />
                  <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">ARTIFACTS</span>
                </button>
                <button type="button"
                  onClick={() => setShowSessionsPanel(p => !p)}
                  className={`flex items-center gap-2 transition-colors ${showSessionsPanel ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <History className="size-[15px]" strokeWidth={2} />
                  <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">SESSIONS</span>
                </button>
              </div>
            </div>

            {/* Sessions Panel Overlay */}
            {showSessionsPanel && (
              <div className="absolute inset-0 z-30 flex">
                <div className="w-[320px] h-full bg-layer-base border-r border-outline/10 flex flex-col shadow-2xl">
                  <div className="h-[50px] shrink-0 border-b border-outline/10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <History className="size-4 text-primary" strokeWidth={2} />
                      <span className="text-[11px] font-bold tracking-widest uppercase text-on-surface">Session History</span>
                    </div>
                    <button type="button" aria-label="Close sessions panel" title="Close sessions panel" onClick={() => setShowSessionsPanel(false)} className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {sessionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="size-4 animate-spin text-primary" />
                      </div>
                    ) : sessionHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 gap-2 opacity-50">
                        <Clock className="size-5 text-on-surface-variant" />
                        <span className="text-[11px] text-on-surface-variant">No previous sessions</span>
                      </div>
                    ) : (
                      <div className="p-2 flex flex-col gap-1">
                        {sessionHistory.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              const url = agentIdFromUrl ? `/chats/${s.id}?agent=${encodeURIComponent(agentIdFromUrl)}` : `/chats/${s.id}`;
                              router.push(url);
                              setShowSessionsPanel(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors flex flex-col gap-0.5 border ${s.id === resolvedParams.id ? 'bg-primary/10 border-primary/20 text-on-surface' : 'bg-transparent border-transparent hover:bg-layer-panel text-on-surface-variant hover:text-on-surface'}`}
                          >
                            <span className="text-[12px] font-medium truncate">
                              {s.title || s.id}
                            </span>
                            <div className="flex items-center gap-2">
                              <Clock className="size-2.5 opacity-50" />
                              <span className="text-[10px] font-mono opacity-50">
                                {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {s.turns} turn{s.turns !== 1 ? 's' : ''}
                              </span>
                              {s.id === resolvedParams.id && <span className="text-[9px] font-mono text-primary uppercase tracking-widest ml-auto">current</span>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 bg-black/20 backdrop-blur-[2px]" onClick={() => setShowSessionsPanel(false)} />
              </div>
            )}

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 w-full max-w-4xl mx-auto custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} ${msg.originalRole === 'system' && msg.content.toLowerCase().includes("compacted") ? 'opacity-80' : ''}`}
                >
                  <div className="flex-none pt-1">
                    {msg.role === "agent" ? (
                      <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shadow-sm">
                        <Bot className="size-4 text-primary" strokeWidth={2} />
                      </div>
                    ) : (
                      userSession?.image ? (
                        <div className="size-8 rounded-full border border-outline/10 overflow-hidden shadow-sm">
                          <img src={userSession.image} alt={userSession.name || "User"} className="size-full object-cover" />
                        </div>
                      ) : (
                        <div className="size-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center shadow-sm">
                          <User className="size-4 text-secondary" strokeWidth={2} />
                        </div>
                      )
                    )}
                  </div>

                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <Text size="label-large" className="text-on-surface-variant font-semibold">
                        {msg.role === 'agent' ? (agentIdFromUrl || 'Jerry') : (userSession?.name || 'Operator')}
                      </Text>
                      <span className="text-on-surface-variant/40 text-[10px]">•</span>
                      <Text size="label-medium" className="text-on-surface-variant/70 uppercase tabular-nums" suppressHydrationWarning>
                        {msg.timestamp ? (() => {
                          const d = new Date(msg.timestamp);
                          const now = new Date();
                          const isToday = d.toDateString() === now.toDateString();
                          const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                          return isToday ? time : `${date} ${time}`;
                        })() : ''}
                      </Text>
                    </div>

                    {msg.originalRole === 'system' && msg.content.toLowerCase().includes("compacted") ? (
                      <div className="px-4 py-2 mt-1 bg-surface-container-highest/50 border border-outline/10 text-on-surface-variant rounded-[var(--layer-3-border-radius,8px)] flex items-center gap-2">
                        <span className="text-xs">✂️</span>
                        <Text size="label-medium" className="text-on-surface-variant italic font-mono text-[11px] leading-relaxed">{msg.content}</Text>
                      </div>
                    ) : msg.toolName || msg.content.startsWith('[Tool:') ? (
                      <div className="mt-1 w-full min-w-[300px] flex flex-col bg-layer-panel border border-outline/10 rounded-[var(--layer-3-border-radius,8px)] overflow-hidden shadow-sm hover:border-outline/20 transition-colors">
                        <details className="group">
                          <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-layer-cover hover:bg-surface-container-highest transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                            <Code2 className="size-4 text-primary shrink-0 group-open:text-primary/70 transition-colors" />
                            <Text size="label-small" className="font-mono text-on-surface text-[12px] font-semibold">
                              Executed Tool: {msg.toolName || msg.content.match(/\[Tool: (.*?)\]/)?.[1] || 'Unknown'}
                            </Text>
                            <ChevronDown className="size-4 text-on-surface-variant ml-auto group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="px-4 py-3 bg-[#0f1115] border-t border-outline/10 overflow-x-auto custom-scrollbar uppercase font-mono text-[10px] w-full">
                            <pre className="text-[#e2e8f0] font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words max-w-[calc(90vw-100px)] lg:max-w-[700px]">
                              {msg.content.replace(/^\[Tool: .*?\]\n?/, '')}
                            </pre>
                          </div>
                        </details>
                      </div>
                    ) : (
                      <div
                        className={`p-4 shadow-sm border border-outline/10 
                          ${msg.role === 'user'
                            ? 'bg-layer-panel text-on-surface rounded-[var(--layer-3-border-radius,16px)] rounded-tr-sm'
                            : 'bg-surface-container text-on-surface rounded-[var(--layer-3-border-radius,16px)] rounded-tl-sm'
                          }`}
                      >
                        <Text size="body-small" className="antialiased leading-relaxed">{msg.content}</Text>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {artifactPreview && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4 w-full justify-start mt-2 mb-4">
                  <div className="w-full min-w-[300px] max-w-4xl mx-auto bg-layer-panel border border-outline/20 rounded-lg p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="size-4 text-primary" />
                      <Text size="label-large" className="text-on-surface font-semibold tracking-wide uppercase">Pending Artifact</Text>
                    </div>
                    <div className="flex items-center justify-center bg-layer-base rounded border border-outline/10 p-6 min-h-[150px]">
                      <div className="flex flex-col items-center gap-3">
                         <Loader2 className="size-6 animate-spin text-primary" />
                         <Text size="body-medium" className="text-on-surface-variant font-mono text-[12px]">Generating [{artifactPreview.tool || 'artifact'}]...</Text>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {hitlChallenge && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 w-full justify-start mt-4 mb-4">
                  <div className="w-full max-w-4xl mx-auto p-5 border border-error bg-[#150d0d] rounded-lg shadow-xl ring-1 ring-error/20">
                    <div className="flex items-center gap-2 mb-3">
                       <Zap className="size-[15px] text-error" strokeWidth={2.5} />
                       <Text size="label-large" className="text-error font-bold uppercase tracking-widest text-[11px]">Human-in-the-Loop Required</Text>
                    </div>
                    <div className="bg-error/10 border border-error/20 p-3 rounded mb-4">
                      <Text size="body-small" className="text-error/90 font-mono text-[11px] leading-relaxed">
                        {hitlChallenge.reason}
                      </Text>
                    </div>
                    {hitlChallenge.suspendedToolCall && (
                       <pre className="p-3 bg-black border border-outline/10 rounded mb-4 text-[10px] text-on-surface-variant/80 font-mono overflow-auto opacity-70">
                         {JSON.stringify(hitlChallenge.suspendedToolCall, null, 2)}
                       </pre>
                    )}
                    <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-error/20">
                      <button type="button" onClick={() => setHitlChallenge(null)} className="px-4 py-1.5 hover:bg-error/20 text-error font-bold text-[11px] font-mono tracking-wider rounded transition-colors border border-transparent hover:border-error/30">DISMISS ALARM</button>
                      <button type="button" onClick={() => alert("To authorize, run 'pnpm run approve_job' in your terminal")} className="px-4 py-1.5 bg-error text-error-foreground hover:bg-error/90 font-bold text-[11px] font-mono tracking-wider rounded shadow-md border border-error/50 relative overflow-hidden group">
                        <span className="relative z-10 flex items-center gap-2"><ArrowUp className="size-3" /> AUTHORIZE EXECUTION</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {isTyping && (
                <motion.div data-testid="typing-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 w-full justify-start">
                  <div className="size-8 shrink-0 rounded-[var(--button-border-radius,8px)] bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary mt-1">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                  <div className="flex flex-col items-start pt-2">
                    <Text size="label-medium" className="text-on-surface-variant/70 italic animate-pulse">Running execution trace in terminal...</Text>
                  </div>
                </motion.div>
              )}
              <div ref={chatBottomRef} className="h-4 shrink-0" />
            </div>

            {/* Prompt Input Box (Sticky Bottom) */}
            <div className="shrink-0 p-4 md:px-8 md:pb-8 bg-layer-canvas flex justify-center flex-col items-center">


              <div className="w-full max-w-4xl flex flex-col gap-4 min-w-0 transition-[width] duration-300 ease-in-out relative group/resizer">

                <div className="bg-layer-panel border border-outline/10 rounded-none shadow-sm flex flex-col">
                  {/* To-dos Accordion - Conditional Visibility (Only show if jobs exist) */}
                  {messages.length > 0 && jobs.length > 0 && (
                    <div className="transition-all duration-300">
                      <motion.button type="button"
                        data-testid="research-plan-header"
                        onClick={() => setTodosOpen(prev => !prev)}
                        whileHover={{ backgroundColor: 'rgba(var(--color-on-surface-rgb), 0.05)', y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-between px-3 py-1 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Circle className="size-[15px]" />
                          <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">RESEARCH PLAN</span>
                          {jobs.length > 0 && <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-mono font-bold">{jobs.length} steps</span>}
                        </div>
                        <ChevronDown className={`size-[15px] transition-transform ${todosOpen ? '' : 'rotate-180'}`} />
                      </motion.button>

                      {todosOpen && (
                        <div data-testid="research-plan-content" className="px-5 pb-5 flex flex-col gap-3.5 border-t border-outline/10 mt-2 pt-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                          {jobs.length > 0 ? jobs.map((job, index) => (
                            <div key={job._id || Math.random().toString()} className="flex items-start gap-3 text-on-surface-variant hover:text-on-surface group cursor-pointer transition-colors relative">
                              <div className="w-[18px] text-right font-mono text-[11px] mt-0.5 opacity-50">{index + 1}</div>
                              {job.status === "COMPLETED" ? (
                                <Check className="size-[14px] shrink-0 mt-0.5 text-primary" strokeWidth={2} />
                              ) : (job.status as string) === "FAILED" || (job.status as string) === "DEAD_LETTER" ? (
                                <X className="size-[14px] shrink-0 mt-0.5 text-error" />
                              ) : job.status === "RUNNING" ? (
                                <Loader2 className="size-[14px] shrink-0 mt-0.5 text-primary animate-spin" />
                              ) : (
                                <CircleDashed className="size-[14px] shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 flex items-center gap-2">
                                <span className="text-[10px] font-mono px-1.5 py-[2px] rounded border border-outline/10 bg-surface-container text-on-surface-variant">{classifyStep(job.intent || "")}</span>
                                <Text size="body-small" className={job.status === 'COMPLETED' ? 'line-through opacity-70' : ''}>
                                  {job.payload?.intent || job.intent || job.payload?.messages?.[0]?.content?.slice(0, 60) + ((job.payload?.messages?.[0]?.content?.length || 0) > 60 ? "..." : "") || `Task ${job._id}`}
                                </Text>
                              </div>
                            </div>
                          )) : (
                            <div className="flex items-center gap-2 py-1 opacity-50">
                              <CircleDashed className="size-3.5 animate-spin-slow" />
                              <Text size="body-small" className="italic">Waiting for agent to formulate research plan...</Text>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <form
                    aria-label="Chat Input Form"
                    ref={inputBarRef}
                    onSubmit={handleSendMessage}
                    className={`relative flex flex-col bg-surface-container-highest border border-outline/10 rounded-none shadow-lg overflow-visible ${jobs.length > 0 ? 'mt-2' : ''}`}
                  >
                    {activeSkillTag === 'df-deep-research' && (
                      <div className="w-full bg-layer-panel/60 border-b border-outline/10 p-4 pb-3 space-y-3 shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="size-4 text-primary" strokeWidth={2} />
                          <Text size="label-large" className="font-semibold text-on-surface tracking-wide uppercase text-[10px]">Deep Research Parameters</Text>
                        </div>
                        <input
                          type="text"
                          placeholder="Target URL or Domain (e.g. docs.stripe.com)" aria-label="Target URL or Domain"
                          value={selectedSkillContext.url}
                          onChange={(e) => setSelectedSkillContext({ ...selectedSkillContext, url: e.target.value })}
                          className="w-full bg-layer-base border border-outline/20 p-2.5 text-[13px] text-on-surface rounded-sm outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Specific query or extraction focus (e.g. Find all pricing tiers)" aria-label="Specific query or extraction focus"
                          value={selectedSkillContext.query}
                          onChange={(e) => setSelectedSkillContext({ ...selectedSkillContext, query: e.target.value })}
                          className="w-full bg-layer-base border border-outline/20 p-2.5 text-[13px] text-on-surface rounded-sm outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40 transition-colors"
                        />
                      </div>
                    )}

                    {attachments.length > 0 && (
                      <div className="px-5 pt-4 flex flex-wrap gap-2">
                        {attachments.map((att, i) => (
                          <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border group transition-colors ${att.status === 'error' ? 'bg-error/10 border-error/20' : 'bg-layer-panel border-outline/10'}`}>
                            {att.type === 'image' ? <Eye className={`size-3.5 ${att.status === 'error' ? 'text-error' : 'text-primary'}`} /> : <Files className={`size-3.5 ${att.status === 'error' ? 'text-error' : 'text-primary'}`} />}
                            <span className={`text-[12px] ${att.status === 'error' ? 'text-error' : 'text-on-surface'} truncate max-w-[150px]`}>{att.name}</span>
                            {att.status === 'uploading' ? (
                              <Loader2 className="size-3.5 text-primary animate-spin ml-1" />
                            ) : (
                              <button type="button" aria-label="Remove attachment" title="Remove attachment" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                <X className="size-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <input aria-label="Upload files" type="file" ref={fileInputRef} multiple onChange={handleFileUpload} className="hidden" />

                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="How can I assist you today?" aria-label="Message input"
                      className="w-full bg-transparent border-none text-on-surface p-5 pb-16 resize-y outline-none min-h-[60px] max-h-[60vh] text-[length:var(--type-body-small-desktop,13px)] font-normal antialiased leading-relaxed placeholder:text-on-surface-variant custom-scrollbar"
                    />

                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <div className="relative">
                          <button
                            aria-label="Attach Context"
                            type="button"
                            onClick={() => setContextDropdownOpen(!contextDropdownOpen)}
                            title="Attach context or files"
                            aria-label="Attach context or files"
                            className={`p-2 rounded-full transition-colors ${contextDropdownOpen ? 'bg-layer-cover text-on-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
                          >
                            <Paperclip className="size-[15px]" strokeWidth={2} />
                          </button>
                          {contextDropdownOpen && (
                            <div className="absolute bottom-full left-0 mb-4 w-[240px] bg-surface-container-high border border-outline/10 rounded-none shadow-2xl flex flex-col py-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                              <button type="button" onClick={() => { setContextDropdownOpen(false); fileInputRef.current?.click(); }} className="w-full flex items-center gap-3 text-left px-3 md:px-4 py-2 hover:bg-surface-container-highest transition-colors text-[13px] text-on-surface">
                                <ArrowUp className="size-4 text-on-surface-variant" /> Upload from computer
                              </button>
                              <button type="button" onClick={() => setContextDropdownOpen(false)} className="w-full flex items-center gap-3 text-left px-3 md:px-4 py-2 hover:bg-surface-container-highest transition-colors text-[13px] text-on-surface">
                                <Files className="size-4 text-on-surface-variant" /> Add context
                              </button>
                              <button type="button" onClick={() => setContextDropdownOpen(false)} className="w-full flex items-center gap-3 text-left px-3 md:px-4 py-2 hover:bg-surface-container-highest transition-colors text-[13px] text-on-surface">
                                <Brain className="size-4 text-on-surface-variant" /> Browse the web
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            aria-label="Invoke DeerFlow Skill"
                            type="button"
                            onClick={() => { setSkillsDropdownOpen(prev => !prev); setAutonomyDropdownOpen(false); setContextDropdownOpen(false); }}
                            title="Invoke DeerFlow Skill"
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors ${skillsDropdownOpen ? 'bg-layer-cover text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                          >
                            <Blocks className="size-[15px]" strokeWidth={2} />
                            Skills
                            <ChevronDown className={`size-3 ml-0.5 opacity-60 transition-transform ${skillsDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {skillsDropdownOpen && (
                            <div className="absolute bottom-full left-0 mb-4 w-[320px] bg-surface-container-high border border-outline/10 rounded-none shadow-2xl flex flex-col py-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                              <div className="px-3 md:px-4 py-2 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1 flex items-center justify-between">
                                DeerFlow Integrations
                                <button type="button" aria-label="Close skills dropdown" onClick={() => setSkillsDropdownOpen(false)} className="hover:text-on-surface" title="Close"><X className="size-3.5" /></button>
                              </div>
                              {dfSkills.map(s => (
                                <button type="button" key={s.id} onClick={() => injectSkill(s)} className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group">
                                  <div className="w-6 shrink-0 mt-0.5 text-on-surface-variant group-hover:text-on-surface transition-colors">{s.icon}</div>
                                  <div className="flex flex-col gap-0.5 flex-1 pr-2">
                                    <span className="text-[13px] font-semibold text-on-surface">{s.name}</span>
                                    <span className="text-[11px] text-on-surface-variant/70 leading-snug">{s.desc}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Model Selector */}
                        <div className="relative">
                          <button
                            aria-label="Select Model"
                            type="button"
                            onClick={() => { setModeDropdownOpen(prev => !prev); setSkillsDropdownOpen(false); setAutonomyDropdownOpen(false); setContextDropdownOpen(false); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors ${modeDropdownOpen ? 'bg-layer-cover text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                          >
                            <Zap className="size-[15px]" strokeWidth={2} />
                            <span className="max-w-[120px] truncate">
                              {availableModels.find(m => m.identifier === selectedModelId)?.name ?? selectedModelId ?? 'Model'}
                            </span>
                            <ChevronDown className={`size-3 ml-0.5 opacity-60 transition-transform ${modeDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {modeDropdownOpen && (
                            <div className="absolute bottom-full left-0 mb-4 w-[360px] bg-surface-container-high border border-outline/10 rounded-none shadow-2xl flex flex-col py-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[420px] overflow-y-auto custom-scrollbar">
                              <div className="px-3 md:px-4 py-2 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1 flex items-center justify-between sticky top-0 bg-surface-container-high">
                                Select Model
                                <button type="button" aria-label="Close model dropdown" onClick={() => setModeDropdownOpen(false)} className="hover:text-on-surface" title="Close"><X className="size-3.5" /></button>
                              </div>
                              {availableModels.length === 0 && (
                                <div className="px-4 py-3 text-[12px] text-on-surface-variant/60">Loading models...</div>
                              )}
                              {availableModels.map(model => (
                                <button type="button"
                                  key={model.identifier}
                                  onClick={() => { setSelectedModelId(model.identifier); setModeDropdownOpen(false); }}
                                  className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group"
                                >
                                  <div className="flex flex-col gap-0.5 flex-1 pr-6">
                                    <span className="text-[13px] font-semibold text-on-surface">{model.name}</span>
                                    <span className="text-[10px] font-mono text-primary/70">{model.identifier}</span>
                                    <span className="text-[11px] text-on-surface-variant/60 leading-snug mt-0.5">{model.strategy}</span>
                                  </div>
                                  {selectedModelId === model.identifier && <Check className="size-4 text-primary absolute right-4 top-3.5" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                      <div className="flex items-center gap-2 pointer-events-auto pr-1">

                        {/* Claude Parity: Autonomy Dropdown */}
                        <div className="relative hidden md:block">
                          <button
                            aria-label="Autonomy Mode"
                            type="button"
                            onClick={() => { setAutonomyDropdownOpen(prev => !prev); setSkillsDropdownOpen(false); setContextDropdownOpen(false); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-[8px] transition-colors ${autonomyDropdownOpen ? 'bg-layer-panel border border-outline/20 text-on-surface shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                          >
                            <Code2 className="size-[13px]" />
                            {autonomyMode}
                          </button>

                          {autonomyDropdownOpen && (
                            <div className="absolute bottom-full right-0 mb-4 w-[280px] bg-surface-container-high border border-outline/10 rounded-[12px] shadow-2xl flex flex-col p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                              <div className="px-3 py-2 text-[11px] font-semibold text-on-surface-variant/80 tracking-wide mb-1 flex items-center justify-between border-b border-outline/10 pb-2">
                                Modes
                                <span className="flex items-center gap-1 opacity-60 text-[9px] uppercase"><ArrowUp className="size-2" /> + <span className="border border-outline/20 px-1 rounded">TAB</span> to switch</span>
                              </div>

                              <button type="button" onClick={() => { setAutonomyMode("Ask before edits"); setAutonomyDropdownOpen(false); }} className="w-full flex items-center text-left px-3 py-2.5 hover:bg-surface-container-highest transition-colors rounded-md relative group mt-1">
                                <div className="w-8 shrink-0 flex justify-center"><Bot className="size-[16px] text-on-surface-variant group-hover:text-on-surface" /></div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[13px] font-medium text-on-surface">Ask before edits</span>
                                  <span className="text-[11px] text-on-surface-variant/70">ZAP Swarm will ask for approval before making each edit</span>
                                </div>
                                {autonomyMode === "Ask before edits" && <Check className="size-4 text-primary absolute right-3" />}
                              </button>

                              <button type="button" onClick={() => { setAutonomyMode("Edit automatically"); setAutonomyDropdownOpen(false); }} className="w-full flex items-center text-left px-3 py-2.5 bg-[#dbb57d]/10 hover:bg-[#dbb57d]/20 transition-colors rounded-md relative group mt-1 border border-[#dbb57d]/20">
                                <div className="w-8 shrink-0 flex justify-center"><Code2 className="size-[16px] text-[#dbb57d]" /></div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[13px] font-medium text-on-surface">Edit automatically</span>
                                  <span className="text-[11px] text-on-surface-variant/70">ZAP Swarm will edit your selected text or the whole file</span>
                                </div>
                                {autonomyMode === "Edit automatically" && <Check className="size-4 text-[#dbb57d] absolute right-3" />}
                              </button>

                              <button type="button" onClick={() => { setAutonomyMode("Plan mode"); setAutonomyDropdownOpen(false); }} className="w-full flex items-center text-left px-3 py-2.5 hover:bg-surface-container-highest transition-colors rounded-md relative group mt-1">
                                <div className="w-8 shrink-0 flex justify-center"><Files className="size-[16px] text-on-surface-variant group-hover:text-on-surface" /></div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[13px] font-medium text-on-surface">Plan mode</span>
                                  <span className="text-[11px] text-on-surface-variant/70">ZAP Swarm will explore the codebase and present a plan before editing</span>
                                </div>
                                {autonomyMode === "Plan mode" && <Check className="size-4 text-primary absolute right-3" />}
                              </button>

                              <button type="button" onClick={() => { setAutonomyMode("Bypass permissions"); setAutonomyDropdownOpen(false); }} className="w-full flex items-center text-left px-3 py-2.5 hover:bg-surface-container-highest transition-colors rounded-md relative group mt-1">
                                <div className="w-8 shrink-0 flex justify-center"><Rocket className="size-[16px] text-on-surface-variant group-hover:text-error" /></div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[13px] font-medium text-on-surface">Bypass permissions</span>
                                  <span className="text-[11px] text-on-surface-variant/70">ZAP Swarm will not ask for approval before running potentially dangerous commands</span>
                                </div>
                                {autonomyMode === "Bypass permissions" && <Check className="size-4 text-error absolute right-3" />}
                              </button>

                              <div className="mt-2 pt-2 border-t border-outline/10 flex items-center justify-between px-3 pb-1">
                                <span className="flex items-center gap-2 text-on-surface-variant text-[12px]"><CircleDashed className="size-3.5" /> Effort (Medium)</span>
                                <div className="w-10 h-5 bg-layer-panel rounded-full border border-outline/20 relative shadow-inner">
                                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-on-surface-variant rounded-full" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Send Button */}
                        <button
                          aria-label="Send message to agent"
                          type="submit"
                          title="Send message to agent"
                          disabled={!input.trim()}
                          className="size-8 bg-primary text-primary-foreground disabled:opacity-30 hover:bg-primary/90 rounded-full flex items-center justify-center transition-all"
                        >
                          <ArrowUp className="size-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-4xl flex flex-col items-center mt-3 mb-2"
                >
                  <div className="flex flex-wrap gap-2 justify-center">
                    <motion.button type="button" 
                      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'var(--color-surface-container-highest)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSendMessage(e, "Surprise me with a unique Next.js UI component.")} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-layer-panel border border-outline/10 text-on-surface-variant hover:text-on-surface transition-colors rounded-none shadow-sm h-8"
                    >
                      <Zap className="size-[15px]" strokeWidth={2} /> <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">Surprise me</span>
                    </motion.button>
                    <motion.button type="button" 
                      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'var(--color-surface-container-highest)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSendMessage(e, "Write a resilient API route for fetching user data.")} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-layer-panel border border-outline/10 text-on-surface-variant hover:text-on-surface transition-colors rounded-none shadow-sm h-8"
                    >
                      <Code2 className="size-[15px]" strokeWidth={2} /> <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">Write</span>
                    </motion.button>
                    <motion.button type="button" 
                      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'var(--color-surface-container-highest)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSendMessage(e, "Research modern structural patterns for Tailwind v4.")} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-layer-panel border border-outline/10 text-on-surface-variant hover:text-on-surface transition-colors rounded-none shadow-sm h-8"
                    >
                      <Brain className="size-[15px]" strokeWidth={2} /> <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">Research</span>
                    </motion.button>
                    <motion.button type="button" 
                      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'var(--color-surface-container-highest)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSendMessage(e, "Collect all component dependencies and build a script.")} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-layer-panel border border-outline/10 text-on-surface-variant hover:text-on-surface transition-colors rounded-none shadow-sm h-8"
                    >
                      <Files className="size-[15px]" strokeWidth={2} /> <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">Collect</span>
                    </motion.button>
                    <motion.button type="button" 
                      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'var(--color-surface-container-highest)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSendMessage(e, "Learn the difference between memory pools and caching.")} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-layer-panel border border-outline/10 text-on-surface-variant hover:text-on-surface transition-colors rounded-none shadow-sm h-8"
                    >
                      <GraduationCap className="size-[15px]" strokeWidth={2} /> <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">Learn</span>
                    </motion.button>
                    <motion.button type="button" 
                      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'var(--color-surface-container-highest)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSendMessage(e, "Create a dashboard using the Metronic design system.")} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-layer-panel border border-outline/10 text-on-surface-variant hover:text-on-surface transition-colors rounded-none shadow-sm h-8"
                    >
                      <Blocks className="size-[15px]" strokeWidth={2} /> <span className="text-[11px] font-bold tracking-widest uppercase mt-0.5">Create</span>
                    </motion.button>
                  </div>
                  {messages.length === 0 && (
                    <div className="mt-4 px-4 py-2 border border-error/20 bg-error/5 rounded-full">
                      <Text size="body-tiny" className="text-error/90 uppercase font-mono tracking-widest text-[9px] font-bold">⚠️ ZAP OMNIROUTER CAN MAKE STRUCTURAL PERMUTATIONS TO LOCALHOST DATA. EXERCISE CAUTION.</Text>
                    </div>
                  )}
                </motion.div>

                <Text size="label-small" className="text-center text-on-surface-variant/60 mt-1 block tracking-wider uppercase truncate max-w-full px-4 mb-2">
                  ZAP OmniRouter can make structural permutations to localhost data. Exercise caution.
                </Text>
              </div>
            </div>
          </div>

          {/* DYNAMIC RESIZER BAR */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            className={`w-[5px] shrink-0 cursor-col-resize hover:bg-primary/50 transition-colors z-30 relative group flex items-center justify-center ${isDragging ? 'bg-primary border-l border-r border-primary' : 'bg-outline/5 border-l border-r border-outline/10'}`}
          >
            <div className="h-6 w-0.5 bg-outline/20 group-hover:bg-primary-foreground/50 rounded-full" />
          </div>

          {/* RIGHT PANE: DOCKER SANDBOX TERMINAL */}
          <div
            className="shrink-0 bg-layer-base flex flex-col relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] border-l border-outline/10"
            // eslint-disable-next-line react/forbid-component-props, react/forbid-dom-props
            style={{ width: `${rightPaneWidth}px` }}
          >
            {/* Functional Artifacts Header */}
            <div className="h-[50px] bg-layer-base/90 backdrop-blur-md border-b border-outline/10 px-4 flex items-center shrink-0 justify-between absolute top-0 inset-x-0 z-20">

              {/* Left: Artifacts Dropdown */}
              <div className="relative" ref={artifactsHeaderRef}>
                <button type="button"
                  onClick={() => setFileDropdownOpen(prev => !prev)}
                  title="Select file or execution log"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all border ${fileDropdownOpen ? 'bg-layer-panel border-outline/20' : 'bg-transparent border-transparent hover:bg-layer-panel'}`}
                >
                  <Text size="label-small" className={fileDropdownOpen ? "text-on-surface" : "text-on-surface-variant"}>
                    {activeArtifactIndex === null ? 'execution_trace.log' : activeArtifactIndex === -1 ? 'omni_queue_dag.graph' : artifacts[activeArtifactIndex].name}
                  </Text>
                  <ChevronDown className={`size-3.5 transition-transform ${fileDropdownOpen ? 'rotate-180 text-on-surface' : 'text-on-surface-variant'}`} />
                </button>
                {fileDropdownOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-[240px] bg-layer-panel border border-outline/10 rounded-md shadow-lg py-1 z-50 overflow-hidden">
                    <button type="button"
                      onClick={() => { setActiveArtifactIndex(null); setFileDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface-container-highest flex items-center justify-between ${activeArtifactIndex === null ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}
                    >
                      execution_trace.log {activeArtifactIndex === null && <span className="text-[10px] text-primary">✓</span>}
                    </button>
                    <button type="button"
                      onClick={() => { setActiveArtifactIndex(-1); setFileDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface-container-highest flex items-center justify-between ${activeArtifactIndex === -1 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}
                    >
                      <span className="flex items-center gap-1.5"><CircleDashed className="size-3.5 opacity-60" /> omni_queue_dag.graph</span> {activeArtifactIndex === -1 && <span className="text-[10px] text-primary">✓</span>}
                    </button>
                    {artifacts.map((art, idx) => (
                      <button type="button"
                        key={idx}
                        onClick={() => { setActiveArtifactIndex(idx); setFileDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface-container-highest flex items-center justify-between ${activeArtifactIndex === idx ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}
                      >
                        {art.name} {activeArtifactIndex === idx && <span className="text-[10px] text-primary">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Middle: Editor Toggles — compact icons matching reference design */}
              {activeArtifactIndex !== null && activeArtifactIndex !== -1 && artifacts[activeArtifactIndex]?.type !== 'image' && (
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-layer-panel border border-outline/10 p-0.5 gap-0.5 rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <button type="button"
                    onClick={() => setPreviewMode('code')}
                    title="View Source Code"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all text-[12px] font-medium ${previewMode === 'code' ? 'bg-layer-cover text-on-surface shadow-[0_2px_4px_rgba(0,0,0,0.04)] ring-1 ring-outline/5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
                  >
                    <Code2 className="size-3.5" />
                    Code
                  </button>
                  <button type="button"
                    onClick={() => setPreviewMode('preview')}
                    title="View Rendered Page"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all text-[12px] font-medium ${previewMode === 'preview' ? 'bg-layer-cover text-on-surface shadow-[0_2px_4px_rgba(0,0,0,0.04)] ring-1 ring-outline/5' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
                  >
                    <Eye className="size-3.5" />
                    Preview
                  </button>
                </div>
              )}

              {/* Right: Sandbox Actions */}
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Open New Window" onClick={handleOpenNewWindow} className="group relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                  <ExternalLink className="size-3.5" />
                  <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Open New Window</div>
                </button>
                <button type="button" aria-label="Copy to Clipboard" onClick={handleCopy} className="group relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                  {copied ? <span className="text-[10px] text-primary font-medium px-1">Copied!</span> : <Copy className="size-3.5" />}
                  {!copied && <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Copy to Clipboard</div>}
                </button>
                <button type="button" aria-label="Download Source" onClick={handleDownload} className="group relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                  <Download className="size-3.5" />
                  <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Download Source</div>
                </button>
                <div className="w-[1px] h-3 bg-outline/20 mx-1 border-r border-transparent" />
                <button type="button"
                  onClick={() => router.push('/')}
                  title="Close session and return"
                  aria-label="Close session and return"
                  className="group relative p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors"
                >
                  <X className="size-3.5" />
                  <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">Close Chat Window</div>
                </button>
              </div>
            </div>

            <div className="flex-1 p-0 pt-[50px] overflow-hidden bg-layer-canvas">
              {activeArtifactIndex === null ? (
                /* EXECUTION_TRACE.LOG - Always force dark terminal view regardless of previewMode */
                <div className="p-6 overflow-y-auto h-full custom-scrollbar bg-[#0f1115] relative">
                  <pre className="text-slate-200 font-mono text-[12px] leading-relaxed whitespace-pre-wrap word-break selection:bg-primary/30">
                    {logs}
                  </pre>
                  <div ref={bottomRef} className="h-4" />
                </div>
              ) : activeArtifactIndex === -1 ? (
                <div className="relative w-full h-full flex items-center justify-center bg-layer-canvas">
                  {jobs.length > 0 ? (
                    <WorkflowGraph jobs={jobs} />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                      <CircleDashed className="size-6 text-on-surface-variant animate-spin-slow" />
                      <Text size="body-small">No DAG Tasks In Queue</Text>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col p-4 bg-layer-canvas overflow-hidden">
                  <div className="h-full flex flex-col overflow-hidden bg-[#0f1115] rounded-xl border border-outline/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative">

                    {/* Floating Window Header */}
                    <div className="h-12 bg-[#1a1d24] border-b border-[#2e333e] px-4 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2 w-16">
                        <div className="size-3 rounded-full bg-[#ef4444]" />
                        <div className="size-3 rounded-full bg-[#eab308]" />
                        <div className="size-3 rounded-full bg-[#22c55e]" />
                      </div>
                      <Text size="label-small" className="text-[#94a3b8] font-semibold tracking-widest uppercase text-[11px]">
                        {previewMode === 'preview'
                          ? (artifacts[activeArtifactIndex].name.endsWith('.md') || artifacts[activeArtifactIndex].name.endsWith('.markdown')) ? 'MARKDOWN PREVIEW' : 'LIVE RENDER'
                          : 'SOURCE CODE'}
                      </Text>
                      <div className="w-16" /> {/* Balance spacer */}
                    </div>

                    {/* Window Content */}
                    <div className="flex-1 relative overflow-hidden bg-[#0f1115] flex flex-col">
                      {artifacts[activeArtifactIndex].type === 'image' ? (
                        <div className="w-full h-full flex items-center justify-center p-8 bg-[#0f1115]">
                          <img
                            src={artifacts[activeArtifactIndex].content}
                            alt="Generated Artifact"
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                          />
                        </div>
                      ) : previewMode === 'preview' && artifacts[activeArtifactIndex].type === 'html' ? (
                        <iframe
                          title="Artifact Preview"
                          srcDoc={artifacts[activeArtifactIndex].content}
                          className="w-full h-full border-none bg-white"
                          sandbox="allow-scripts allow-forms allow-same-origin"
                        />
                      ) : previewMode === 'preview' && (artifacts[activeArtifactIndex].name.endsWith('.md') || artifacts[activeArtifactIndex].name.endsWith('.markdown')) ? (
                        <div className="p-8 overflow-y-auto h-full custom-scrollbar flex-1 relative bg-[#0f1115]">
                          <div className="prose prose-sm prose-invert max-w-none">
                            <Text size="body-medium" className="text-[#f8fafc] whitespace-pre-wrap leading-relaxed">
                              {artifacts[activeArtifactIndex].content}
                            </Text>
                          </div>
                        </div>
                      ) : previewMode === 'preview' && (artifacts[activeArtifactIndex].name.endsWith('.tsx') || artifacts[activeArtifactIndex].name.endsWith('.jsx')) ? (
                        <div className="flex-1 w-full h-full relative sandpack-container h-full">
                          <Sandpack
                            template={artifacts[activeArtifactIndex].name.endsWith('.tsx') ? "react-ts" : "react"}
                            theme="dark"
                            files={{
                              [`/App.${artifacts[activeArtifactIndex].name.endsWith('.tsx') ? 'tsx' : 'jsx'}`]: artifacts[activeArtifactIndex].content,
                            }}
                            options={{
                              showLineNumbers: true,
                              showInlineErrors: true,
                              editorHeight: "100%",
                              classes: {
                                "sp-wrapper": "h-full w-full border-none",
                                "sp-layout": "h-full w-full border-none bg-transparent rounded-none",
                                "sp-stack": "h-full w-full"
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="p-6 overflow-y-auto h-full custom-scrollbar flex-1 relative bg-[#0f1115]">
                          <pre className="text-[#e2e8f0] font-mono text-[13px] leading-relaxed whitespace-pre-wrap word-break selection:bg-primary/30">
                            {artifacts[activeArtifactIndex].content}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
