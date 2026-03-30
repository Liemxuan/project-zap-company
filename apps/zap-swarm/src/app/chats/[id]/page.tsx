"use client";

import Link from "next/link";
import { TerminalSquare, Send, Bot, User, Paperclip, Loader2, Download, Files, Code2, Eye, ExternalLink, Copy, X, ChevronDown, Circle, CircleDashed, GraduationCap, ArrowUp, Zap, Lightbulb, Rocket, Check, Blocks, Brain, LineChart, Mic2 } from "lucide-react";
import { use, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { OmniJobGraphNode, WorkflowGraph } from "@/components/WorkflowGraph";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
};

export default function TraceExecution({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [logs, setLogs] = useState<string>("> Booting trace interface connection...\n");
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Focus and Click Outside Refs
  const inputBarRef = useRef<HTMLFormElement>(null);
  const artifactsHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputBarRef.current && !inputBarRef.current.contains(e.target as Node)) {
        setModeDropdownOpen(false);
        setSkillsDropdownOpen(false);
      }
      if (artifactsHeaderRef.current && !artifactsHeaderRef.current.contains(e.target as Node)) {
        setFileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resize Handler State
  const [rightPaneWidth, setRightPaneWidth] = useState(450);
  const [isDragging, setIsDragging] = useState(false);

  // Mode Selection State
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Pro");

  // Conversational Mock State
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [jobs, setJobs] = useState<OmniJobGraphNode[]>([]);
  
  // Skill Invocation State
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
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
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  // Phase 5: Unified Continuous Polling for State Consistency
  const hasLoadedHistoryRef = useRef(false);

  useEffect(() => {
    if (!resolvedParams.id) return;
    
    const fetchState = async () => {
      try {
        // 1. Fetch Real-time Queue Status
        const resJobs = await fetch(`/api/swarm/jobs?sessionId=${resolvedParams.id}`);
        if (resJobs.ok) {
          const dataJobs = await resJobs.json();
          if (dataJobs.tasks) setJobs(dataJobs.tasks);
        }
        
        // 2. Fetch Immutable Conversation History
        const resHist = await fetch(`/api/swarm/history/${resolvedParams.id}`);
        if (resHist.ok) {
          const dataHist = await resHist.json();
          if (dataHist.history && dataHist.history.length > 0) {
            setMessages(prev => {
              const newMessages = dataHist.history.map((h: any) => ({
                id: h.id.toString(),
                role: h.role === 'user' ? 'user' : 'agent',
                content: h.tool_name ? `[Tool: ${h.tool_name}]\n${h.content}` : h.content,
                timestamp: new Date(h.created_at).toLocaleTimeString()
              }));
              
              if (prev.length !== newMessages.length || prev[prev.length - 1]?.content !== newMessages[newMessages.length - 1]?.content) {
                setIsTyping(false);
                if (!hasLoadedHistoryRef.current) {
                  setLogs((l: string) => l + `\n> 📦 [system] Restored ${dataHist.history.length} historical messages from database.\n`);
                  hasLoadedHistoryRef.current = true;
                } else if (newMessages.length > prev.length) {
                  setLogs((l: string) => l + `> 📥 [system] Received new agent response via memory pipeline.\n`);
                }
                return newMessages;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error("State sync failed:", err);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2500);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  // Artifacts State
  const [artifacts, setArtifacts] = useState<{name: string, content: string, type: 'html' | 'image' | 'text'}[]>([]);
  const [activeArtifactIndex, setActiveArtifactIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('preview');
  const [showArtifacts, setShowArtifacts] = useState(true);

  // VFS Artifacts Sync
  useEffect(() => {
    if (!resolvedParams.id) return;
    
    const fetchArtifacts = async () => {
      try {
        const res = await fetch(`/api/swarm/threads/${resolvedParams.id}/artifacts`);
        if (res.ok) {
          const data = await res.json();
          if (data.artifacts) {
             const parsed = data.artifacts.map((a: any) => ({
                 name: a.filename,
                 content: a.content,
                 type: a.filename.endsWith('.html') ? 'html' : a.filename.match(/\\.(png|jpg|jpeg|gif|webp)$/i) ? 'image' : 'text'
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
      } catch (err) {}
    };

    fetchArtifacts();
    const interval = setInterval(fetchArtifacts, 2500);
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


  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const sessionId = resolvedParams.id;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentSkillTag = currentInput.trim().match(/^\/(df-[^\s]+)/)?.[1];
    setInput("");
    setIsTyping(true);

    // Initial reasoning step log
    setLogs(prev => prev + `\n> 👤 [user] ${currentInput}\n> ⚙️ [system] Enqueueing job to OmniQueue...\n`);

    try {
      const response = await fetch('/api/swarm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          agentId: "Spike", // Default for structural tasks
          message: currentInput,
          tenantId: "ZVN",
          contextParams: currentSkillTag ? selectedSkillContext : undefined
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const data = await response.json();
      setLogs(prev => prev + `> ✅ [system] Job enqueued (ID: ${data.jobId}). Waiting for agent execution...\n`);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setLogs(prev => prev + `> ❌ [error] ${err.message}\n`);
      setIsTyping(false);
    }
  };

  // SSE Log parsing removed: Phase 5 mandates polling from actual backend history

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  // Header UI Functions
  const [copied, setCopied] = useState(false);
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [todosOpen, setTodosOpen] = useState(true);

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

    const blob = new Blob([content], { type });
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
          <div className="flex-1 flex flex-col bg-layer-canvas relative z-10 min-w-0">

            {/* Functional Chat Header */}
            <div className="h-[50px] shrink-0 border-b border-outline/10 flex items-center justify-between px-6 bg-layer-base/50 backdrop-blur-md relative z-20">
              <div className="flex items-center gap-2">
                <Text size="label-large" className="text-on-surface font-medium">OmniRouter Trace: {resolvedParams.id}</Text>
              </div>
              <div className="flex bg-transparent items-center gap-4">
                <button onClick={handleDownload} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <Download className="size-4" /> <Text size="label-large">Export</Text>
                </button>
                <button 
                  onClick={() => setShowArtifacts(!showArtifacts)}
                  className={`flex items-center gap-2 transition-colors ${showArtifacts ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <Files className="size-4" /> <Text size="label-large">Artifacts</Text>
                </button>
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 w-full max-w-4xl mx-auto custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'agent' && (
                    <div className="size-8 shrink-0 rounded-[var(--button-border-radius,8px)] bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary mt-1 shadow-[0_2px_8px_rgba(var(--color-primary-rgb),0.1)]">
                      <Bot className="size-4" />
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <Text size="label-large" className="text-on-surface-variant font-medium">
                        {msg.role === 'user' ? 'Operator' : 'OmniRouter AI'}
                      </Text>
                      <span className="text-on-surface-variant/40 text-[10px]">•</span>
                      <Text size="label-medium" className="text-on-surface-variant/70 uppercase">{msg.timestamp}</Text>
                    </div>
                    <div
                      className={`p-4 
                        ${msg.role === 'user'
                          ? 'bg-layer-panel text-on-surface rounded-[var(--layer-3-border-radius,16px)] rounded-tr-sm shadow-sm border border-outline/10'
                          : 'text-on-surface rounded-[var(--layer-3-border-radius,16px)] rounded-tl-sm'
                        }`}
                    >
                      <Text size="dev-wrapper" className="antialiased leading-relaxed">{msg.content}</Text>
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="size-8 shrink-0 rounded-[var(--button-border-radius,8px)] bg-layer-panel border border-outline/10 flex flex-col items-center justify-center text-on-surface-variant mt-1 shadow-sm">
                      <User className="size-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 w-full justify-start">
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
            <div className="shrink-0 p-4 md:px-8 md:pb-8 bg-layer-canvas flex justify-center">
              <div className="w-full max-w-4xl flex flex-col gap-4 min-w-0 transition-[width] duration-300 ease-in-out relative group/resizer">

                {/* To-dos Accordion - Decoupled */}
                <div className="bg-layer-panel border border-outline/10 rounded-none shadow-sm flex flex-col">
                  <div className="transition-all duration-300">
                    <button
                      onClick={() => setTodosOpen(prev => !prev)}
                      type="button"
                      className="w-full flex items-center justify-between px-5 py-3.5 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Circle className="size-3.5" />
                        <Text size="body-small" className="font-medium">To-dos</Text>
                      </div>
                      <ChevronDown className={`size-4 transition-transform ${todosOpen ? '' : 'rotate-180'}`} />
                    </button>

                    {todosOpen && (
                      <div className="px-5 pb-5 flex flex-col gap-3.5 border-t border-outline/10 mt-2 pt-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                        {jobs.length > 0 ? jobs.map((job) => (
                           <div key={job._id || Math.random().toString()} className="flex items-start gap-3 text-on-surface-variant hover:text-on-surface group cursor-pointer transition-colors">
                             {job.status === "COMPLETED" ? (
                               <Check className="size-[14px] shrink-0 mt-0.5 text-primary" strokeWidth={2} />
                             ) : job.status === "FAILED" || job.status === "DEAD_LETTER" ? (
                               <X className="size-[14px] shrink-0 mt-0.5 text-error" />
                             ) : (
                               <CircleDashed className={`size-[14px] shrink-0 mt-0.5 ${job.status === 'PENDING' ? 'animate-spin-slow text-primary/70' : ''}`} />
                             )}
                             <Text size="body-small" className={job.status === 'COMPLETED' ? 'line-through opacity-70' : ''}>
                               {job.payload?.intent || job.payload?.messages?.[0]?.content?.slice(0, 60) + (job.payload?.messages?.[0]?.content?.length > 60 ? "..." : "") || `Task ${job._id}`}
                             </Text>
                           </div>
                        )) : (
                           <Text size="body-small" className="text-on-surface-variant/50 italic px-1">No active tasks in OmniQueue.</Text>
                        )}
                      </div>
                    )}
                  </div>

                  <form
                    ref={inputBarRef}
                    onSubmit={handleSendMessage}
                    className="relative flex flex-col bg-surface-container-highest border border-outline/10 rounded-none shadow-lg mt-2 overflow-visible"
                  >
                    {activeSkillTag === 'df-deep-research' && (
                      <div className="w-full bg-layer-panel/60 border-b border-outline/10 p-4 pb-3 space-y-3 shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="size-4 text-primary" strokeWidth={2} />
                          <Text size="label-large" className="font-semibold text-on-surface tracking-wide uppercase text-[10px]">Deep Research Parameters</Text>
                        </div>
                        <input
                          type="text"
                          placeholder="Target URL or Domain (e.g. docs.stripe.com)"
                          value={selectedSkillContext.url}
                          onChange={(e) => setSelectedSkillContext({...selectedSkillContext, url: e.target.value})}
                          className="w-full bg-layer-base border border-outline/20 p-2.5 text-[13px] text-on-surface rounded-sm outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Specific query or extraction focus (e.g. Find all pricing tiers)"
                          value={selectedSkillContext.query}
                          onChange={(e) => setSelectedSkillContext({...selectedSkillContext, query: e.target.value})}
                          className="w-full bg-layer-base border border-outline/20 p-2.5 text-[13px] text-on-surface rounded-sm outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40 transition-colors"
                        />
                      </div>
                    )}

                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="How can I assist you today?"
                      className="w-full bg-transparent border-none text-on-surface p-5 pb-16 resize-y outline-none min-h-[60px] max-h-[60vh] text-[length:var(--type-body-small-desktop,13px)] font-normal antialiased leading-relaxed placeholder:text-on-surface-variant custom-scrollbar"
                    />

                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <button type="button" title="Attach context or files" className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors">
                          <Paperclip className="size-[15px]" strokeWidth={2} />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => { setSkillsDropdownOpen(prev => !prev); setModeDropdownOpen(false); }}
                            type="button"
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
                                <button onClick={() => setSkillsDropdownOpen(false)} className="hover:text-on-surface" title="Close"><X className="size-3.5" /></button>
                              </div>
                              {dfSkills.map(s => (
                                <button key={s.id} onClick={() => injectSkill(s)} className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group">
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

                        <div className="relative">
                          <button
                            onClick={() => { setModeDropdownOpen(prev => !prev); setSkillsDropdownOpen(false); }}
                            type="button"
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors ${modeDropdownOpen ? 'bg-layer-cover text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                          >
                            {selectedMode === "Flash" && <Zap className="size-[15px]" strokeWidth={2} />}
                            {selectedMode === "Reasoning" && <Lightbulb className="size-[15px]" strokeWidth={2} />}
                            {selectedMode === "Pro" && <GraduationCap className="size-[15px]" strokeWidth={2} />}
                            {selectedMode === "Ultra" && <Rocket className="size-[15px]" strokeWidth={2} />}
                            {selectedMode}
                            <ChevronDown className={`size-3 ml-0.5 opacity-60 transition-transform ${modeDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {modeDropdownOpen && (
                            <div className="absolute bottom-full left-0 mb-4 w-[320px] bg-surface-container-high border border-outline/10 rounded-none shadow-2xl flex flex-col py-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">

                              <div className="px-3 md:px-4 py-2 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1 flex items-center justify-between">
                                Mode
                                <button onClick={() => setModeDropdownOpen(false)} className="hover:text-on-surface"><X className="size-3.5" /></button>
                              </div>

                              <button onClick={() => { setSelectedMode("Flash"); setModeDropdownOpen(false); }} className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group">
                                <div className="w-6 shrink-0 mt-0.5"><Zap className="size-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors" strokeWidth={2} /></div>
                                <div className="flex flex-col gap-0.5 flex-1 pr-6">
                                  <span className="text-[13px] font-semibold text-on-surface">Flash</span>
                                  <span className="text-[11px] text-on-surface-variant/70 leading-snug">Fast and efficient, but may not be accurate</span>
                                </div>
                                {selectedMode === "Flash" && <Check className="size-4 text-primary absolute right-4 top-3.5" />}
                              </button>
                              <button onClick={() => { setSelectedMode("Reasoning"); setModeDropdownOpen(false); }} className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group">
                                <div className="w-6 shrink-0 mt-0.5"><Lightbulb className="size-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors" strokeWidth={2} /></div>
                                <div className="flex flex-col gap-0.5 flex-1 pr-6">
                                  <span className="text-[13px] font-semibold text-on-surface">Reasoning</span>
                                  <span className="text-[11px] text-on-surface-variant/70 leading-snug">Reasoning before action, balance between time and accuracy</span>
                                </div>
                                {selectedMode === "Reasoning" && <Check className="size-4 text-primary absolute right-4 top-3.5" />}
                              </button>
                              <button onClick={() => { setSelectedMode("Pro"); setModeDropdownOpen(false); }} className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group">
                                <div className="w-6 shrink-0 mt-0.5"><GraduationCap className="size-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors" strokeWidth={2} /></div>
                                <div className="flex flex-col gap-0.5 flex-1 pr-6">
                                  <span className="text-[13px] font-semibold text-on-surface">Pro</span>
                                  <span className="text-[11px] text-on-surface-variant/70 leading-snug">Reasoning, planning and executing, get more accurate results, may take more time</span>
                                </div>
                                {selectedMode === "Pro" && <Check className="size-4 text-primary absolute right-4 top-3.5" />}
                              </button>
                              <button onClick={() => { setSelectedMode("Ultra"); setModeDropdownOpen(false); }} className="w-full flex items-start text-left px-3 md:px-4 py-2.5 hover:bg-surface-container-highest transition-colors relative group">
                                <div className="w-6 shrink-0 mt-0.5"><Rocket className="size-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors" strokeWidth={2} /></div>
                                <div className="flex flex-col gap-0.5 flex-1 pr-6">
                                  <span className="text-[13px] font-semibold text-on-surface">Ultra</span>
                                  <span className="text-[11px] text-on-surface-variant/70 leading-snug">Pro mode with subagents to divide work; best for complex multi-step tasks</span>
                                </div>
                                {selectedMode === "Ultra" && <Check className="size-4 text-primary absolute right-4 top-3.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pointer-events-auto pr-1">
                        <Text size="body-small" className="font-medium text-on-surface-variant">OmniRouter Seed 1.8</Text>
                        <button
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

                <Text size="label-small" className="text-center text-on-surface-variant/60 mt-1 block tracking-wider uppercase truncate max-w-full px-4">
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
            style={{ width: `${rightPaneWidth}px` }}
          >
            {/* Functional Artifacts Header */}
            <div className="h-[50px] bg-layer-base/90 backdrop-blur-md border-b border-outline/10 px-4 flex items-center shrink-0 justify-between absolute top-0 inset-x-0 z-20">

              {/* Left: Artifacts Dropdown */}
              <div className="relative" ref={artifactsHeaderRef}>
                <button
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
                    <button 
                      onClick={() => { setActiveArtifactIndex(null); setFileDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface-container-highest flex items-center justify-between ${activeArtifactIndex === null ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}
                    >
                      execution_trace.log {activeArtifactIndex === null && <span className="text-[10px] text-primary">✓</span>}
                    </button>
                    <button 
                      onClick={() => { setActiveArtifactIndex(-1); setFileDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-surface-container-highest flex items-center justify-between ${activeArtifactIndex === -1 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}
                    >
                      <span className="flex items-center gap-1.5"><CircleDashed className="size-3.5 opacity-60" /> omni_queue_dag.graph</span> {activeArtifactIndex === -1 && <span className="text-[10px] text-primary">✓</span>}
                    </button>
                    {artifacts.map((art, idx) => (
                      <button 
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

              {/* Middle: Editor Toggles */}
              <div className="flex items-center bg-layer-panel rounded-md border border-outline/10 p-0.5 absolute left-1/2 -translate-x-1/2 hidden md:flex">
                <button 
                  onClick={() => setPreviewMode('code')}
                  title="Switch to Code View"
                  className={`group p-1.5 rounded-[4px] transition-all relative ${previewMode === 'code' ? 'bg-layer-cover text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
                >
                  <Code2 className="size-3.5" aria-hidden="true" />
                  <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">View Code</div>
                </button>
                <button 
                  onClick={() => setPreviewMode('preview')}
                  title="Switch to Preview Mode"
                  className={`group p-1.5 rounded-[4px] transition-all relative ${previewMode === 'preview' ? 'bg-layer-cover text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
                >
                  <Eye className="size-3.5" aria-hidden="true" />
                  <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Preview Mode</div>
                </button>
              </div>

              {/* Right: Sandbox Actions */}
              <div className="flex items-center gap-1">
                <button onClick={handleOpenNewWindow} className="group relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                  <ExternalLink className="size-3.5" />
                  <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Open New Window</div>
                </button>
                <button onClick={handleCopy} className="group relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                  {copied ? <span className="text-[10px] text-primary font-medium px-1">Copied!</span> : <Copy className="size-3.5" />}
                  {!copied && <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Copy to Clipboard</div>}
                </button>
                <button onClick={handleDownload} className="group relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-layer-panel rounded-md transition-colors">
                  <Download className="size-3.5" />
                  <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Download Source</div>
                </button>
                <div className="w-[1px] h-3 bg-outline/20 mx-1 border-r border-transparent" />
                <button 
                  onClick={() => setRightPaneWidth(0)}
                  title="Close Artifacts Panel"
                  className="group relative p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors"
                >
                  <X className="size-3.5" />
                  <div className="absolute top-[-30px] right-0 px-2 py-1 bg-layer-panel border border-outline/10 text-[10px] text-on-surface rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Close Panel</div>
                </button>
              </div>
            </div>

            <div className="flex-1 p-0 pt-[50px] overflow-hidden bg-layer-canvas">
              {activeArtifactIndex === null ? (
                <div className="p-6 overflow-y-auto h-full custom-scrollbar">
                  <pre className="text-on-surface-variant font-mono text-[12px] leading-relaxed whitespace-pre-wrap word-break selection:bg-primary/30">
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
                <div className="h-full flex flex-col overflow-hidden bg-white">
                  {artifacts[activeArtifactIndex].type === 'image' ? (
                    <div className="flex-1 flex items-center justify-center p-8 bg-layer-canvas">
                      <div className="relative group max-w-full max-h-full shadow-2xl overflow-hidden border border-outline/10">
                        <img 
                          src={artifacts[activeArtifactIndex].content} 
                          alt="Generated Artifact" 
                          className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                           <button title="Download Image" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"><Download className="size-5" /> </button>
                           <button title="Open in New Window" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"><ExternalLink className="size-5" /> </button>
                        </div>
                      </div>
                    </div>
                  ) : previewMode === 'preview' ? (
                    <iframe 
                      title="Artifact Preview"
                      srcDoc={artifacts[activeArtifactIndex].content}
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-forms allow-same-origin"
                    />
                  ) : (
                    <div className="p-6 overflow-y-auto h-full bg-layer-base custom-scrollbar">
                      <pre className="text-on-surface-variant font-mono text-[11px] leading-relaxed whitespace-pre-wrap word-break selection:bg-primary/30">
                        {artifacts[activeArtifactIndex].content}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
