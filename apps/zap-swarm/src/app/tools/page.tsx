"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Inspector } from "zap-design/src/zap/layout/Inspector";
import { InspectorAccordion } from "zap-design/src/zap/organisms/laboratory/InspectorAccordion";
import { DataFilter } from "zap-design/src/genesis/molecules/data-filter";
import { Settings, Filter, Network, Search, TerminalSquare, Github, Database, Globe, Component, X, RefreshCw, ShieldCheck, ShieldAlert, ShieldX, Zap } from "lucide-react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { ToggleGroup, ToggleGroupItem } from "zap-design/src/genesis/atoms/interactive/toggle-group";
import { useQuery } from "@tanstack/react-query";
import { LiveBlinker } from "zap-design/src/genesis/atoms/indicators/LiveBlinker";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "zap-design/src/lib/utils";

interface MCPConfig {
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  status: "online" | "offline";
  type: string;
}

// Helper to provide brand colors and rich descriptions for standard tools
function getServerMeta(name: string) {
  const n = name.toLowerCase();
  
  if (n.includes('github')) {
    return { 
      icon: Github, 
      imageUrl: "/logos/github.png?v=4",
      desc: "Manage repositories, collaborate on code, and track issues directly via Model Context Protocol.", 
      brand: "bg-surface-elevated border-outline/20 text-on-surface" 
    };
  }
  
  if (n.includes('testsprite')) {
    return { 
      icon: TerminalSquare, 
      imageUrl: "/logos/testsprite.png?v=4",
      desc: "Automated end-to-end testing and production debugging for swarm validation.", 
      brand: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500" 
    };
  }
  
  if (n.includes('notebooklm')) {
    return { 
      icon: Database, 
      imageUrl: "/logos/notebooklm.png?v=4",
      desc: "Access and query Google NotebookLM personal knowledge graphs seamlessly.", 
      brand: "bg-amber-500/10 border-amber-500/20 text-amber-600" 
    };
  }
  
  if (n.includes('figma')) {
    return { 
      icon: Globe, 
      desc: "Retrieve UI/UX designs and layout properties securely from Figma workspaces.", 
      brand: "bg-pink-500/10 border-pink-500/20 text-pink-500" 
    };
  }
  
  if (n.includes('notion')) {
    return { 
      icon: Component, 
      desc: "Read and write project management and planning specs across Notion databases.", 
      brand: "bg-surface-elevated border-outline/10 text-on-surface" 
    };
  }
  
  if (n.includes('google') || n.includes('gws')) {
    return { 
      icon: Globe, 
      imageUrl: "/logos/google.png?v=4",
      desc: "Native Google Workspace integration via MCP for Drive, Gmail, and Calendar automation.", 
      brand: "bg-blue-500/10 border-blue-500/20 text-blue-600" 
    };
  }
  
  return { 
    icon: Network, 
    desc: "Custom JSON-RPC external tool endpoint linked to the internal ZAP router.", 
    brand: "bg-outline/5 border-outline/10 text-on-surface-variant" 
  };
}

function MCPConfigModal({
  server,
  onSave,
  onDelete,
  onCancel,
  isSaving
}: {
  server: MCPConfig;
  onSave: (val: string) => void;
  onDelete: (name: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [val, setVal] = useState(JSON.stringify(server, null, 2));
  const [statusVal, setStatusVal] = useState<"online" | "offline">(server.status);
  const [isTesting, setIsTesting] = useState(false);
  const [checkpointAction, setCheckpointAction] = useState<{ type: 'test' | 'enable', onConfirm: () => void } | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  
  const meta = getServerMeta(server.name);
  const Icon = meta.icon;
  const isAuthHeavy = server.name.toLowerCase().includes('google') || 
                     server.name.toLowerCase().includes('github') || 
                     server.name.toLowerCase().includes('notion') ||
                     server.name.toLowerCase().includes('figma');

  const handleTestInternal = async () => {
    setIsTesting(true);
    setCheckpointAction(null);
    try {
      const res = await fetch('/api/swarm/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: server.name, config: JSON.parse(val) })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error || "Internal connection error.");
      }
    } catch (e) {
      toast.error("Network error during connector ping.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleTest = () => {
    if (isAuthHeavy) {
      setCheckpointAction({ type: 'test', onConfirm: handleTestInternal });
    } else {
      handleTestInternal();
    }
  };

  const handleToggleOnline = () => {
    if (statusVal === 'online') {
       setStatusVal('offline');
       return;
    }

    if (isAuthHeavy) {
       setCheckpointAction({ type: 'enable', onConfirm: () => { setStatusVal('online'); setCheckpointAction(null); } });
    } else {
       setStatusVal('online');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-layer-base border border-outline/20 w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[var(--card-radius,16px)] shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-outline/10 bg-layer-cover shrink-0 relative flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className={cn("rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-outline/10", meta.imageUrl ? "size-24 bg-white" : cn("size-24", meta.brand))}>
                {meta.imageUrl ? (
                  <img src={meta.imageUrl} alt={server.name} className="size-full object-contain p-0" />
                ) : (
                  <Icon className="size-12" />
                )}
             </div>
             <Heading level={3} className="text-on-surface tracking-tight">
               {server.name} Connector
             </Heading>
          </div>
          
          <div className="flex justify-between items-center gap-8 pr-8">
             <Text size="body-small" className="text-on-surface-variant font-medium leading-relaxed max-w-lg">
               {meta.desc}
             </Text>
             
             {/* Power Toggle buttons */}
             <div className="flex bg-layer-base border border-outline/10 p-1 rounded-[8px] shadow-sm shrink-0">
                <button 
                  onClick={handleToggleOnline}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${statusVal === 'online' ? 'bg-state-success/10 text-state-success' : 'text-on-surface-variant hover:bg-outline/5'}`}
                >
                  Enabled 
                </button>
                <button 
                  onClick={() => setStatusVal('offline')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${statusVal === 'offline' ? 'bg-outline/10 border-transparent text-on-surface' : 'text-on-surface-variant hover:bg-outline/5'}`}
                >
                  Disabled
                </button>
             </div>
          </div>

          <button onClick={onCancel} aria-label="Close configuration" title="Close" className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors">
            <X className="size-5" />
          </button>
        </div>
        
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col bg-layer-base overflow-hidden min-h-0">
           <div className="px-6 py-3 border-b border-outline/5 flex items-center bg-layer-base">
             <Text size="label-small" className="text-on-surface-variant font-mono uppercase tracking-wider font-semibold">
               Transport JSON-RPC Configuration Data Map
             </Text>
           </div>
           
           <div className="flex-1 relative pb-6 h-full min-h-[300px]">
             <textarea
               autoFocus
               title="MCP JSON Config"
               className="absolute inset-0 w-full h-full p-6 bg-transparent text-on-surface font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-outline/40"
               value={val}
               onChange={(e) => setVal(e.target.value)}
               spellCheck={false}
             />
           </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-outline/10 bg-layer-cover gap-3 shrink-0">
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setIsPurging(true)} disabled={isSaving || isTesting}>
            Purge Connector
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  Testing...
                </div>
              ) : "Test"}
          </Button>
          <Button variant="primary" onClick={() => {
            try {
              const parsed = JSON.parse(val);
              parsed.status = statusVal;
              onSave(JSON.stringify(parsed, null, 2));
            } catch (e) {
              alert("Invalid JSON syntax in configuration.");
            }
          }} disabled={isSaving || isTesting}>
            {isSaving ? "Saving..." : "Save Config & State"}
          </Button>
        </div>
      </div>
    </div>

      {checkpointAction && (
        <div className="absolute inset-0 z-[10000] bg-black/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-layer-base border border-amber-500/30 rounded-3xl p-10 max-w-lg w-full shadow-2xl space-y-8 flex flex-col items-center text-center">
              <div className="p-5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
                <ShieldAlert size={48} />
              </div>
              <div className="space-y-3">
                <Heading level={2} className="text-on-surface font-bold font-mono uppercase tracking-tighter italic">Identity Checkpoint</Heading>
                <Text className="text-on-surface-variant leading-relaxed">
                   This tool requires external API credentials or OAuth tokens to function. Have you verified your 
                   <span className="text-amber-600 font-bold mx-1 lowercase font-mono underline decoration-wavy">
                      {server.name.split('-')[0] || "primary"}
                   </span>
                   secrets are correctly injected into the config map?
                </Text>
              </div>
              <div className="flex gap-4 w-full pt-4">
                <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setCheckpointAction(null)}>
                  Not Yet
                </Button>
                <Button variant="primary" className="flex-1 font-bold h-12 bg-amber-500 border-amber-500 hover:bg-amber-600 text-white" onClick={checkpointAction.onConfirm}>
                  Yes, Proceed
                </Button>
              </div>
           </div>
        </div>
      )}
      {isPurging && (
        <div className="absolute inset-0 z-[10001] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
           <div className="bg-layer-base border border-destructive/30 rounded-[32px] p-12 max-w-md w-full shadow-[0_0_80px_rgba(239,68,68,0.2)] space-y-8 flex flex-col items-center text-center">
              <div className="p-6 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
                <Trash2 size={56} />
              </div>
              <div className="space-y-4">
                <Heading level={2} className="text-on-surface font-black tracking-tight uppercase leading-none">Purge Infrastructure</Heading>
                <Text size="body-small" className="text-on-surface-variant leading-relaxed">
                   Are you absolutely sure you want to permanently delete the <span className="text-on-surface font-bold font-mono underline decoration-red-500">{server.name}</span> connector? This configuration will be wiped from the ZAP registry.
                </Text>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button variant="outline" className="w-full font-bold h-12 rounded-xl" onClick={() => setIsPurging(false)}>
                  Cancel Operation
                </Button>
                <Button variant="primary" className="w-full font-bold h-12 bg-destructive border-destructive hover:bg-red-700 text-white rounded-xl" onClick={() => onDelete(server.name)}>
                  Yes, Purge Connector
                </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function NewConnectorModal({
  onAdd,
  onCancel,
}: {
  onAdd: (name: string, config: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [type, setType] = useState<"MCP" | "CLI">("MCP");
  const [input, setInput] = useState("");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedConfig, setProvisionedConfig] = useState<MCPConfig | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanReport, setScanReport] = useState<{ threatLevel: string; details: string[]; recommendation: string; vulnerabilities?: string[] } | null>(null);
  const [verdict, setVerdict] = useState<"allowed" | "blocked" | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);

  const handleAdd = async () => {
    setIsProvisioning(true);
    try {
      const res = await fetch('/api/swarm/mcp/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, input })
      });
      const data = await res.json();
      if (data.success) {
        setProvisionedConfig(data.config);
        setInstructions(data.instructions || null);
        toast.success(`Connector ${data.config.name} provisioned!`);
        
        // Auto-trigger security scan
        handleScan(data.config);
      } else {
        toast.error(data.error || "Failed to provision.");
      }
    } catch (e) {
      toast.error("Provisioning error.");
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleScan = async (config: any) => {
    setIsScanning(true);
    setScanReport(null);
    setVerdict(null);
    setInstructions(null);
    try {
       const res = await fetch('/api/swarm/mcp/scan', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ config })
       });
       const data = await res.json();
       if (data.success) {
          setScanReport(data.report);
          toast.success("Security reconnaissance complete.");
       }
    } catch (e) {
       toast.error("Security scan engine failed.");
    } finally {
       setIsScanning(false);
    }
  };

  const handleTest = async () => {
    if (!provisionedConfig) return;
    setIsTesting(true);
    try {
      const res = await fetch('/api/swarm/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: provisionedConfig.name, config: provisionedConfig })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error || "Connection failure.");
      }
    } catch (e) {
      toast.error("Network error.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <div className="bg-layer-base border border-outline/20 w-full max-w-6xl h-[85vh] flex flex-col rounded-[24px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-outline/10 bg-layer-cover shrink-0 relative flex flex-col gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl border flex shrink-0 bg-primary/10 border-primary/20 text-primary shadow-sm">
               <Plus className="size-6" />
             </div>
             <div className="space-y-1">
               <Heading level={3} className="text-on-surface tracking-tight font-bold">
                 Add New Connector
               </Heading>
               <Text size="body-small" className="text-on-surface-variant font-medium">Provision third-party MCP or CLI tools to the Swarm fleet.</Text>
             </div>
          </div>
          
          <div className="flex justify-between items-end gap-12">
              <div className="flex flex-col gap-4">
                <ToggleGroup 
                  type="single" 
                  value={type} 
                  onValueChange={(val) => val && setType(val as 'MCP' | 'CLI')}
                  visualStyle="segmented"
                  size="sm"
                >
                    <ToggleGroupItem value="MCP" className="px-6 font-bold">MCP Protocol</ToggleGroupItem>
                    <ToggleGroupItem value="CLI" className="px-6 font-bold">CLI Bridge</ToggleGroupItem>
                </ToggleGroup>
                
                {instructions && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-sm animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2 mb-1 text-amber-600">
                      <ShieldAlert size={14} />
                      <Text size="body-tiny" className="font-bold uppercase tracking-wider">Setup Required</Text>
                    </div>
                    <Text size="body-tiny" className="text-amber-800 font-medium leading-tight">
                       {instructions}
                    </Text>
                  </div>
                )}
              </div>

             <div className="flex-1 max-w-md p-3 bg-primary/5 border border-primary/10 rounded-xl">
                <Text size="body-tiny" className="text-primary font-bold leading-relaxed">
                   The ZAP Security Sandbox will automatically audit the provisioned code for prompt injection paths before final authorization.
                </Text>
             </div>
          </div>

          <button 
            onClick={onCancel} 
            title="Close"
            className="absolute top-8 right-8 p-2 rounded-xl hover:bg-outline/10 text-on-surface-variant transition-all"
          >
            <X className="size-6" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="flex-1 flex flex-col bg-layer-base overflow-hidden relative">
           {isScanning ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-layer-base z-50 gap-6 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                 <div className="size-20 rounded-full border-[6px] border-primary/10 border-t-primary animate-spin shadow-inner" />
                 <div className="space-y-2">
                    <Heading level={3} className="text-on-surface font-black uppercase tracking-tight">Initializing Sec-Sandbox</Heading>
                    <Text size="body-medium" className="text-on-surface-variant max-w-md font-medium">Running deep reconnaissance on code manifests, repo structure, and prompt boundaries...</Text>
                 </div>
              </div>
           ) : scanReport ? (
              <div className="absolute inset-0 flex flex-col bg-layer-base z-40 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                 <div className="flex-1 flex min-h-0">
                    {/* Security Dossier - Left Side */}
                    <div className="flex-1 flex flex-col border-r border-outline/10 bg-layer-base/30 overflow-y-auto scrollbar-none">
                       <div className="p-10 space-y-10">
                          <div className="space-y-6">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-on-surface">
                                   <div className={`p-2 rounded-lg border bg-primary/5 border-primary/20 text-primary cursor-pointer hover:bg-primary/10 transition-colors shadow-xs`} title="Edit Identity">
                                      {provisionedConfig ? (
                                        React.createElement(getServerMeta(provisionedConfig.name).icon, { size: 20 })
                                      ) : (
                                        <ShieldCheck size={20} />
                                      )}
                                   </div>
                                   <div className="flex flex-col">
                                      <input 
                                         value={provisionedConfig?.name || ""}
                                         onChange={(e) => setProvisionedConfig(prev => prev ? { ...prev, name: e.target.value } : null)}
                                         className="bg-transparent border-none p-0 text-lg font-bold text-on-surface focus:outline-none focus:ring-0 w-80 placeholder:text-on-surface-variant/30"
                                         placeholder="Connector Name..."
                                      />
                                      <Text size="body-tiny" className="text-on-surface-variant/60 font-medium">Security Reconnaissance Dossier</Text>
                                   </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${scanReport.threatLevel === 'Low' ? 'bg-state-success/10 text-state-success border-state-success/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                   Threat: {scanReport.threatLevel}
                                </div>
                             </div>
                             
                             <div className="p-6 bg-layer-cover border border-outline/10 rounded-2xl shadow-sm space-y-4 relative overflow-hidden group">
                                <div className="relative z-10">
                                   <Heading level={6} className="text-on-surface-variant font-bold text-[10px] tracking-wide mb-1">Jerry-Watchdog Recommendation</Heading>
                                   <Text size="body-small" className="text-on-surface leading-relaxed font-bold">{scanReport.recommendation}</Text>
                                </div>
                                <ShieldCheck className="absolute -bottom-4 -right-4 size-24 opacity-[0.05] text-state-success pointer-events-none group-hover:scale-110 transition-transform" />
                             </div>
                          </div>

                          <div className="space-y-6">
                             <Heading level={6} className="text-on-surface-variant font-bold text-[10px] tracking-wide px-2 flex items-center gap-2">
                                <TerminalSquare size={14} />
                                Sandboxed Audit Logs
                             </Heading>
                             <div className="grid grid-cols-1 gap-4">
                                {scanReport.details.map((log: string, i: number) => (
                                   <div key={i} className="flex items-start gap-4 p-5 bg-layer-cover border border-outline/5 rounded-2xl transition-all hover:translate-x-1 group">
                                      <div className="mt-2 size-2 rounded-full bg-state-success shrink-0 shadow-[0_0_12px_var(--state-success)] opacity-50 group-hover:opacity-100 transition-opacity" />
                                      <code className="text-[13px] text-on-surface-variant font-mono leading-relaxed">{log}</code>
                                   </div>
                                ))}
                             </div>
                          </div>
                          
                          {scanReport.vulnerabilities && scanReport.vulnerabilities.length > 0 && (
                             <div className="p-8 bg-state-error/5 border-2 border-state-error/10 rounded-3xl space-y-6 animate-in shake duration-500">
                                <div className="flex items-center gap-2 text-state-error">
                                   <ShieldX size={24} />
                                   <Heading level={5} className="font-black text-[11px] uppercase tracking-[0.2em]">Kill-Chain Warnings Detected</Heading>
                                </div>
                                <ul className="space-y-3 list-disc list-inside">
                                   {scanReport.vulnerabilities.map((v: string, i: number) => (
                                      <li key={i} className="text-[13px] text-state-error font-mono leading-relaxed font-black">{v}</li>
                                   ))}
                                </ul>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Decision Zone - Right Side */}
                    <div className="w-[420px] shrink-0 bg-layer-cover flex flex-col overflow-hidden relative shadow-[-16px_0_32px_rgba(0,0,0,0.1)]">
                       <div className="p-8 border-b border-outline/10 space-y-1 bg-layer-base/50">
                          <Heading level={6} className="text-on-surface font-bold text-[10px] tracking-wide">Configuration Surface</Heading>
                          <Text size="body-tiny" className="text-on-surface-variant font-semibold">Review extracted logic before team injection.</Text>
                       </div>
                       
                       <div className="flex-1 p-8 overflow-hidden bg-layer-base/20">
                          <div className="h-full relative group">
                             <textarea
                                readOnly
                                title="Raw Provisioned JSON"
                                className="w-full h-full p-8 bg-black/20 text-state-success font-mono text-[12px] leading-relaxed resize-none focus:outline-none border border-outline/10 rounded-3xl shadow-inner scrollbar-none group-hover:border-primary/20 transition-colors"
                                value={JSON.stringify(provisionedConfig, null, 2)}
                             />
                             <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 text-state-success opacity-40 hover:opacity-100 transition-opacity">
                                <Database size={14} />
                             </div>
                          </div>
                       </div>

                       <div className="p-10 border-t border-outline/10 bg-layer-cover space-y-8">
                          <div className="space-y-6">
                             <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                                   <Zap size={24} />
                                </div>
                                <div className="space-y-1">
                                   <Heading level={5} className="text-on-surface font-black uppercase text-sm tracking-tight">Swarm Authorization</Heading>
                                   <Text size="body-tiny" className="text-on-surface-variant font-bold">Granting access binds this tool to the global Identity Cortex.</Text>
                                </div>
                             </div>
                             
                             <div className="flex flex-col gap-4">
                                <button 
                                   onClick={() => setVerdict('allowed')}
                                   className={`w-full py-4 px-6 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all border-2 flex items-center justify-between group shadow-sm ${verdict === 'allowed' ? 'bg-state-success border-state-success text-white shadow-xl shadow-state-success/40' : 'bg-state-success/5 border-state-success/20 text-state-success hover:bg-state-success/10'}`}
                                >
                                   <span>Deploy to Swarm Fleet</span>
                                   <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                                <button 
                                   onClick={() => setVerdict('blocked')}
                                   className={`w-full py-4 px-6 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all border-2 flex items-center justify-between group shadow-sm ${verdict === 'blocked' ? 'bg-state-error border-state-error text-white shadow-xl shadow-state-error/40' : 'bg-state-error/5 border-state-error/20 text-state-error hover:bg-state-error/10'}`}
                                >
                                   <span>Block / Purge Tool</span>
                                   <ShieldX size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ) : provisionedConfig ? (
              <div className="flex-1 flex flex-col p-10 bg-layer-base animate-in fade-in duration-300">
                 <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                       <Text size="label-small" className="text-on-surface-variant font-black uppercase tracking-[0.2em]">Provisioned Logic Map</Text>
                       <Text size="body-tiny" className="text-on-surface-variant">Review the extracted configuration before starting the sandbox audit.</Text>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-sm transition-all hover:bg-amber-500/20">
                       <div className="size-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_var(--amber-500)]" />
                       <Text size="label-small" className="text-amber-600 font-black uppercase tracking-widest text-[11px]">Audit Pending</Text>
                    </div>
                 </div>
                 <div className="flex-1 bg-layer-cover border border-outline/10 rounded-3xl p-8 relative group overflow-hidden shadow-inner">
                    <textarea
                      readOnly
                      title="Provisioned MCP Configuration"
                      className="w-full h-full bg-transparent text-state-success font-mono text-sm leading-relaxed resize-none focus:outline-none scrollbar-none"
                      value={JSON.stringify(provisionedConfig, null, 2)}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-layer-base/60 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                       <div className="p-10 text-center space-y-6 max-w-sm">
                          <div className="size-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/50">
                             <ShieldAlert size={32} />
                          </div>
                          <div className="space-y-2">
                             <Heading level={4} className="text-on-surface font-black uppercase tracking-tight">Initiate Security Review</Heading>
                             <Text size="body-small" className="text-on-surface-variant font-medium">Provisioning is a read-only stage. You must run the sandbox audit before authorization.</Text>
                          </div>
                          <Button variant="primary" onClick={() => handleScan(provisionedConfig)} className="w-full shadow-lg py-3 font-bold uppercase tracking-wider text-[10px]">
                             Launch Security Sandbox
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
             <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
                <div className="px-10 py-4 border-b border-outline/5 bg-layer-base/50 shrink-0">
                  <Text size="body-tiny" className="text-on-surface-variant font-bold tracking-wide">
                    Source Integration Payload
                  </Text>
                </div>
                <div className="flex-1 relative bg-layer-base/20 group">
                  <textarea
                    autoFocus
                    title="MCP Connector Input"
                    className="absolute inset-0 w-full h-full p-10 bg-transparent text-on-surface font-mono text-[16px] leading-relaxed resize-none focus:outline-none placeholder:text-outline/40 scrollbar-none"
                    placeholder="e.g. https://github.com/googleworkspace/cli"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    spellCheck={false}
                  />
                  <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none group-focus-within:opacity-40 transition-opacity">
                     <Github size={120} />
                  </div>
                </div>
             </div>
           )}
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-6 border-t border-outline/10 bg-layer-cover flex justify-between items-center shrink-0">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                 <Text size="body-tiny" className="text-on-surface-variant font-bold tracking-wide">Protocol Type</Text>
                 <Text size="body-small" className="text-on-surface font-bold">{type === 'MCP' ? 'Model Context Protocol' : 'CLI Native Bridge'}</Text>
              </div>
              <div className="h-8 w-px bg-outline/10" />
              <div className="flex flex-col">
                 <Text size="body-tiny" className="text-on-surface-variant font-bold tracking-wide">Verification Status</Text>
                 <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${verdict === 'allowed' ? 'bg-state-success shadow-[0_0_8px_var(--state-success)]' : verdict === 'blocked' ? 'bg-state-error shadow-[0_0_8px_var(--state-error)]' : 'bg-outline/30'}`} />
                    <Text size="body-small" className="text-on-surface font-bold">{verdict === 'allowed' ? 'Authorized' : verdict === 'blocked' ? 'Rejected' : 'Pending Verification'}</Text>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {verdict === 'allowed' ? (
                <>
                  <Button variant="outline" onClick={handleTest} disabled={isTesting} size="lg" className="px-6 font-bold">
                    {isTesting ? "Testing..." : "Connectivity Test"}
                  </Button>
                  <Button variant="primary" onClick={() => onAdd(provisionedConfig!.name, provisionedConfig)} size="lg" className="px-8 font-bold tracking-wide">
                    Inject into Fleet
                  </Button>
                </>
              ) : verdict === 'blocked' ? (
                <Button variant="destructive" onClick={() => { setProvisionedConfig(null); setScanReport(null); setVerdict(null); setInput(""); }} size="lg" className="px-8 font-bold">
                  Purge & Re-Initialize
                </Button>
              ) : isScanning || isProvisioning ? (
                 <div className="flex items-center gap-3 py-2 px-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <RefreshCw className="size-4 text-amber-500 animate-spin" />
                    <Text size="body-tiny" className="text-amber-600 font-bold uppercase tracking-wide">
                      {isProvisioning ? "Deriving Logic..." : "Auditing Security..."}
                    </Text>
                 </div>
              ) : provisionedConfig && !scanReport ? (
                 <Button variant="primary" onClick={() => handleScan(provisionedConfig)} size="lg" className="px-10 bg-amber-500 border-amber-500 hover:bg-amber-600 text-white font-bold tracking-wide">
                   Re-Initiate Scan
                 </Button>
              ) : !provisionedConfig ? (
                <Button 
                  variant="primary" 
                  onClick={handleAdd} 
                  disabled={isProvisioning || !input.trim()}
                  size="lg"
                  className="px-12 font-bold tracking-widest"
                >
                  Provision Connector
                </Button>
              ) : (
                <div className="px-6 py-2 bg-on-surface/5 rounded-xl">
                   <Text size="body-tiny" className="text-on-surface-variant font-bold uppercase tracking-wide">Reviewing Reconnaissance</Text>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default function MCPToolsDashboard() {
  const [editingServer, setEditingServer] = useState<MCPConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useQuery<{ success: boolean; servers: MCPConfig[] }>({
    queryKey: ['swarm-mcp-servers'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/mcp');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const servers = data?.servers || [];
  
  const filteredServers = servers.filter(s => {
    const matchStatus = filter === "all" ? true : s.status === filter;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleSaveModal = async (newConfigJson: string) => {
    try {
      const parsed = JSON.parse(newConfigJson);
      setIsSaving(true);
      
      await fetch(`/api/swarm/mcp`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: parsed.name, config: parsed })
      });

      refetch();
    } catch (e) {
      console.error("Invalid JSON format");
      alert("Invalid JSON format.");
    } finally {
      setIsSaving(false);
      setEditingServer(null);
    }
  };



  const handleDeleteConnector = async (name: string) => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/swarm/mcp`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.error || "Purge failed.");
      }
    } catch (e) {
      toast.error("Network error during purge.");
    } finally {
      setIsSaving(false);
      setEditingServer(null);
    }
  };

  const handleAddNew = async (name: string, config: any) => {
    try {
      setIsSaving(true);
      await fetch(`/api/swarm/mcp`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, config })
      });
      refetch();
      toast.success(`Connector ${name} registered successfully.`);
    } catch (e) {
      toast.error("Registration failed.");
    } finally {
      setIsSaving(false);
      setShowAddModal(false);
    }
  };

  return (
    <>
      {editingServer && (
        <MCPConfigModal
          server={editingServer}
          onSave={handleSaveModal}
          onDelete={handleDeleteConnector}
          onCancel={() => setEditingServer(null)}
          isSaving={isSaving}
        />
      )}
      {showAddModal && (
        <NewConnectorModal
          onAdd={handleAddNew}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      <AppShell>
        <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
          <ThemeHeader 
            breadcrumb="Zap Swarm / Integrations"
            title="Connectors"
            badge={`${servers.filter(s => s.status === 'online').length} active`}
            liveIndicator={true}
          />
          
          <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
            <div className="w-full space-y-6">
              
              <div className="mb-2">
                 <Heading level={3} className="text-on-surface mb-1 tracking-tight">Tools</Heading>
                 <Text size="body-small" className="text-on-surface-variant font-medium">
                   Authorize third-party platforms to let the Background Swarm agents access data on your behalf.
                 </Text>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
                <div className="w-full sm:w-auto flex-1 max-w-sm relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50" />
                  <input 
                    type="text"
                    title="Search tools"
                    aria-label="Search tools"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-layer-base border border-outline/15 text-sm rounded-[var(--input-radius,8px)] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-outline/30 focus:bg-layer-base shadow-sm transition-colors"
                  />
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                    <span className="text-on-surface-variant/70 tracking-wide whitespace-nowrap">{filteredServers.length} tools</span>
                    <span className="w-1 h-1 rounded-full bg-outline/20 shrink-0"></span>
                    <span className="text-state-success/90 flex items-center gap-1.5 tracking-wide whitespace-nowrap">
                      <LiveBlinker iconOnly color="green" />
                      {servers.filter(s => s.status === 'online').length} connected
                    </span>
                  </div>

                  <Button 
                    variant="ghost" 
                    title="Refresh Fleet Status"
                    className="p-2 h-9 w-9 border border-outline/15 rounded-lg bg-layer-base hover:bg-outline/5 transition-all active:scale-95"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    <RefreshCw className={`size-4 text-on-surface-variant ${isFetching ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {isLoading && <div className="text-on-surface-variant animate-pulse py-8 text-sm">Loading Fleet Connections...</div>}
              {error && <div className="text-state-error bg-state-error/10 p-4 rounded-lg text-sm font-medium">Failed to connect to SYS_MCP_SERVERS collection.</div>}

              {!isLoading && !error && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 pb-20">
                  
                  {filteredServers.map((s) => {
                    const meta = getServerMeta(s.name);
                    const Icon = meta.icon;
                    
                    return (
                      <div key={s.name} className="group bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.02))] p-6 rounded-[var(--card-radius,16px)] border border-outline/10 hover:border-outline/20 hover:shadow-md transition-all flex flex-col min-h-[190px]">
                        
                        {/* Card Header */}
                        <div className="flex justify-between items-start gap-3">
                          <div className={cn(
                            "rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 overflow-hidden",
                            meta.imageUrl ? "size-16 bg-white border border-outline/10" : cn("size-16", meta.brand)
                          )}>
                             {meta.imageUrl ? (
                               <img src={meta.imageUrl} alt={s.name} className="size-full object-contain p-0" />
                             ) : (
                               <Icon className="size-7" />
                             )}
                          </div>
                          
                          {/* Status Badge */}
                          <div className={`flex items-center gap-1.5 text-xs font-bold rounded-md px-0 mt-0.5 shrink-0 transition-colors`}>
                            {s.status === 'online' ? (
                               <LiveBlinker iconOnly color="green" />
                            ) : (
                               <span className="size-1.5 rounded-full bg-on-surface-variant/30" />
                            )}
                            <span className={`text-[11px] uppercase tracking-wider ${s.status === 'online' ? 'text-state-success/90' : 'text-on-surface-variant/50'}`}>
                              {s.status === 'online' ? 'Connected' : 'Not Connected'}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="mt-5 flex flex-col gap-1.5 flex-1 min-h-0">
                          <Heading level={5} className="text-on-surface tracking-tight truncate capitalize">{s.name}</Heading>
                          <Text size="body-small" className="text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                            {meta.desc}
                          </Text>
                        </div>

                        {/* Card Footer / Controls */}
                        <div className="mt-6 flex justify-between gap-3 items-center pt-2">
                           <div className="flex-1 min-w-0 pr-2">
                             {/* Optional tech string footprint */}
                             {s.status === 'online' && (
                               <Text size="label-small" className="text-state-success/60 font-mono truncate text-[10px] hidden sm:block">
                                 {s.command} tcp
                               </Text>
                             )}
                           </div>
                           
                           <Button 
                             variant="ghost" 
                             className={`text-sm shrink-0 font-bold px-3 py-1.5 h-8 rounded-lg group-hover:bg-outline/5 transition-colors ${s.status === 'online' ? 'text-on-surface-variant hover:text-state-error/90' : 'text-primary'}`} 
                             onClick={() => setEditingServer(s)}
                           >
                               <Settings className="size-3.5 mr-1.5" /> Config
                           </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Dotted 'Add Connector' Card */}
                  <button 
                    onClick={() => setShowAddModal(true)}
                    title="Add New Connector"
                    className="group bg-transparent p-6 rounded-[var(--card-radius,16px)] border-2 border-dashed border-outline/15 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[190px] gap-3 relative overflow-hidden"
                  >
                    <div className="p-3 rounded-xl bg-outline/5 border border-outline/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all group-hover:scale-110">
                      <Plus className="size-6 text-on-surface-variant group-hover:text-primary" />
                    </div>
                    <Text size="label-small" className="text-on-surface-variant/50 group-hover:text-primary font-bold tracking-widest uppercase">Add Connector</Text>
                    
                    {/* Subtle grid pattern background for the empty shell */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle,_currentColor_1px,_transparent_1px)] bg-[length:16px_16px]" />
                  </button>
                </section>
              )}
            </div>
          </main>
        </div>
      </AppShell>
    </>
  );
}
