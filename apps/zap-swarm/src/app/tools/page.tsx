"use client";

import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Inspector } from "zap-design/src/zap/layout/Inspector";
import { InspectorAccordion } from "zap-design/src/zap/organisms/laboratory/InspectorAccordion";
import { DataFilter } from "zap-design/src/genesis/molecules/data-filter";
import { Wrench, Edit2, Play, Square, Settings, Component, Filter } from "lucide-react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { useQuery } from "@tanstack/react-query";

interface MCPConfig {
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  status: "online" | "offline";
  type: string;
}

function MCPConfigModal({
  server,
  onSave,
  onCancel,
  isSaving
}: {
  server: MCPConfig;
  onSave: (val: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [val, setVal] = useState(JSON.stringify(server, null, 2));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-layer-base border border-outline/20 w-full max-w-4xl max-h-[75vh] flex flex-col rounded-[var(--card-radius,12px)] shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-outline/10 bg-layer-cover shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-primary" />
            <Text size="body-small" weight="bold" className="text-on-surface">
              Configure MCP Server: {server.name}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onCancel} className="text-on-surface-variant hover:text-on-surface">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => onSave(val)}
              disabled={isSaving}
              className="min-w-24"
            >
              {isSaving ? "Saving..." : "Save Config"}
            </Button>
          </div>
        </div>
        <textarea
          autoFocus
          title="MCP JSON Config"
          className="w-full flex-1 p-6 bg-transparent text-on-surface font-mono text-sm resize-none focus:outline-none"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function MCPToolsDashboard() {
  const [editingServer, setEditingServer] = useState<MCPConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const { data, isLoading, error, refetch } = useQuery<{ success: boolean; servers: MCPConfig[] }>({
    queryKey: ['swarm-mcp-servers'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/mcp');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const servers = data?.servers || [];
  const filteredServers = servers.filter(s => filter === "all" ? true : s.status === filter);

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

  const inspectorContent = (
    <Inspector title="Tool Registry" width={320}>
      <InspectorAccordion title="Data View Filters" icon={Filter} defaultOpen>
        <div className="px-1 py-2">
          <DataFilter 
            groups={[
              {
                id: "status",
                title: "Connection Status",
                options: [
                  { id: "all", label: "All Servers", selected: filter === 'all' },
                  { id: "online", label: "Online", selected: filter === 'online' },
                  { id: "offline", label: "Offline", selected: filter === 'offline' }
                ]
              }
            ]}
            onToggle={(_, optionId) => setFilter(optionId)}
          />
        </div>
      </InspectorAccordion>
    </Inspector>
  );

  return (
    <>
      {editingServer && (
        <MCPConfigModal
          server={editingServer}
          onSave={handleSaveModal}
          onCancel={() => setEditingServer(null)}
          isSaving={isSaving}
        />
      )}
      <AppShell inspector={inspectorContent}>
        <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
          <ThemeHeader 
            breadcrumb="Zap Swarm / MCP"
            title="External Tool Matrix"
            badge={`${servers.filter(s => s.status === 'online').length} active`}
            liveIndicator={true}
          />
          
          <main className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-8 bg-layer-cover p-6 rounded-[var(--card-radius,12px)] border border-outline/10 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))]">
              <div className="flex flex-col gap-1 max-w-2xl">
                <Heading level={3} className="text-on-surface">Model Context Protocol Servers</Heading>
                <Text size="body-small" className="text-on-surface-variant">
                  ZAP Swarm utilizes the Model Context Protocol to seamlessly integrate external APIs and functions. Manage the running transport configurations and environmental tokens.
                </Text>
              </div>
            </div>

            {isLoading && <div className="text-on-surface-variant animate-pulse p-4">Loading Fleet Connections...</div>}
            {error && <div className="text-state-error bg-state-error/10 p-4 rounded-lg">Failed to connect to SYS_MCP_SERVERS collection.</div>}

            {!isLoading && !error && (
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredServers.map((s) => (
                  <div key={s.name} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-6 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:border-outline/20 transition-all flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 shrink-0 rounded-[var(--button-border-radius,8px)] flex justify-center items-center ${s.status === 'online' ? 'bg-state-success/10' : 'bg-outline/5'}`}>
                            {s.status === 'online' ? <Wrench className="size-5 text-state-success" /> : <Component className="size-5 text-on-surface-variant/50" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Heading level={4} className="text-on-surface tracking-tight leading-tight truncate">{s.name}</Heading>
                            <Text size="label-small" className="text-on-surface-variant font-mono truncate">{s.type.toUpperCase()} • {s.command}</Text>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide shrink-0 ${s.status === 'online' ? 'bg-state-success/10 text-state-success' : 'bg-outline/5 text-on-surface-variant'}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mt-auto flex flex-col gap-2 p-3 bg-layer-base rounded-[var(--card-radius,8px)] border border-outline/5 overflow-hidden">
                        <Text size="label-small" className="text-on-surface-variant font-mono truncate">
                          args: [{s.args.join(", ")}]
                        </Text>
                        <Text size="label-small" className="text-on-surface-variant font-mono truncate">
                          env keys: {Object.keys(s.env).length > 0 ? Object.keys(s.env).join(", ") : "none"}
                        </Text>
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex sm:flex-col gap-2 shrink-0 justify-end sm:justify-start pt-2">
                       <Button variant="secondary" onClick={() => {}} className="w-full justify-center">
                         {s.status === 'online' ? <Square className="size-4" /> : <Play className="size-4" />} 
                         {s.status === 'online' ? "Stop" : "Boot"}
                       </Button>
                       <Button variant="ghost" onClick={() => setEditingServer(s)} className="w-full justify-center bg-layer-base border border-outline/10 text-on-surface hover:text-primary hover:border-primary/30">
                         <Edit2 className="size-4" /> Edit Config
                       </Button>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>
      </AppShell>
    </>
  );
}
