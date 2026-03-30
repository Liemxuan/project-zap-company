"use client";

import { useState, Suspense } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Inspector } from "zap-design/src/zap/layout/Inspector";
import { InspectorAccordion } from "zap-design/src/zap/organisms/laboratory/InspectorAccordion";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { Settings2, BarChart3, Search, Bot, ChevronRight, ChevronDown, X, Edit3 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

interface AgentData {
  name: string;
  role: string;
  port: number;
  status: string;
  uptime: string;
}

function FileEditModal({ 
  title, 
  content, 
  onSave, 
  onCancel, 
  isSaving 
}: { 
  title: string, 
  content: string, 
  onSave: (val: string) => void, 
  onCancel: () => void, 
  isSaving: boolean 
}) {
  const [val, setVal] = useState(content);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-layer-base rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-3,0_8px_16px_rgba(0,0,0,0.2))] w-full max-w-4xl h-[75vh] flex flex-col overflow-hidden border border-[var(--color-outline-variant,rgba(0,0,0,0.1))]">
        <div className="p-4 border-b border-[var(--color-outline-variant,rgba(0,0,0,0.1))] flex justify-between items-center bg-layer-cover">
          <Heading level={4} className="text-on-surface mb-0">Editing {title}</Heading>
          <button title="Close" aria-label="Close Modal" onClick={onCancel} className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-outline/5 transition-colors"><X className="size-5" /></button>
        </div>
        <div className="p-0 flex-1 min-h-0 bg-layer-base">
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full h-full bg-layer-base border-none text-on-surface text-sm font-mono p-5 resize-none focus:outline-none focus:ring-0"
            placeholder={`Enter ${title} contents...`}
          />
        </div>
        <div className="p-4 border-t border-[var(--color-outline-variant,rgba(0,0,0,0.1))] bg-layer-cover flex justify-end gap-3 items-center">
          <Button 
            variant="ghost"
            onClick={onCancel} 
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={() => onSave(val)}
            disabled={isSaving}
            className="min-w-24"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExpandableFileSnippet({ 
  title, 
  content, 
  onEdit 
}: { 
  title: string; 
  content: string; 
  onEdit: () => void; 
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 mb-2">
      <div 
        className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors w-fit pr-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        <Text size="body-small" className="font-medium text-on-surface-variant hover:text-on-surface">{title}</Text>
      </div>
      
      {expanded && (
        <div 
          onClick={onEdit}
          className="bg-[var(--color-layer-cover,#F8F9FA)] border border-[var(--color-outline-variant,rgba(0,0,0,0.1))] rounded-[8px] p-3 text-xs font-mono text-on-surface whitespace-pre-wrap max-h-40 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors relative group"
        >
          <div className="line-clamp-[8] pointer-events-none">
            {content || <span className="text-on-surface-variant italic opacity-50">Empty file.</span>}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--color-layer-cover,#F8F9FA)] to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}

function AgentsCanvas({ onSelectAgent }: { onSelectAgent: (name: string) => void }) {
  const { data, isLoading, error } = useQuery<{ success: boolean; agents: AgentData[] }>({
    queryKey: ['swarm-agents'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/agents');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  if (isLoading) return <div className="text-on-surface-variant animate-pulse">Scanning Agent Fleet...</div>;
  if (error) return <div className="text-state-error bg-state-error/10 p-4 rounded-lg">Failed to connect to OmniRouter fleet registry.</div>;

  const agents = data?.agents || [];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <div key={agent.name} onClick={() => onSelectAgent(agent.name)} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:-translate-y-1 hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.1))] transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div className="size-10 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center group-hover:bg-primary/20 transition-colors">
              <Bot className="size-5 text-primary" />
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wide bg-state-success/10 text-state-success">
              {agent.status.toUpperCase()}
            </span>
          </div>
          <Heading level={4} className="text-on-surface mb-1 truncate">{agent.name}</Heading>
          <Text size="body-small" className="text-on-surface-variant block mb-2">{agent.role}</Text>
          <div className="flex justify-between pt-3 border-t border-[var(--color-outline-variant,rgba(0,0,0,0.05))] mt-auto">
            <Text size="label-small" weight="bold" className="text-state-warning">Port: {agent.port}</Text>
            <Text size="label-small" className="text-on-surface-variant border border-outline/10 px-1.5 py-0.5 rounded-sm">Uptime: {agent.uptime}</Text>
          </div>
        </div>
      ))}
    </section>
  );
}


function CommandDashboard() {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Provider State
  const [searchProvider, setSearchProvider] = useState("InfoQuest");
  const [searchApiKey, setSearchApiKey] = useState("");
  
  // Selected Agent State
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<{ id: string, filename: string, content: string } | null>(null);
  const [isSavingDocs, setIsSavingDocs] = useState(false);

  const { data: globalMemoryData } = useQuery<{ success: boolean; memories: any[] }>({
    queryKey: ['swarm-memory'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/memory');
      return res.json();
    }
  });

  const { data: agentFilesData, refetch: refetchFiles } = useQuery<{ success: boolean; files: { id: string, filename: string, content: string }[] }>({
    queryKey: ['swarm-agent-files', selectedAgent],
    queryFn: async () => {
      const res = await fetch(`/api/swarm/agents/${selectedAgent?.toLowerCase()}/files`);
      return res.json();
    },
    enabled: !!selectedAgent,
  });

  const saveSearchConfig = async () => {
    try {
      await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'ZVN',
          llmConfig: { provider: 'OPENROUTER' },
          searchConfig: {
            provider: searchProvider,
            [`${searchProvider.toLowerCase() === 'infoquest' ? 'infoQuest' : searchProvider.toLowerCase()}ApiKey`]: searchApiKey
          }
        })
      });
    } catch(e) {
      console.error(e);
    }
  };

  const handleSaveModal = async (newContent: string) => {
    if (!selectedAgent || !editingFile) return;
    setIsSavingDocs(true);
    
    await fetch(`/api/swarm/agents/${selectedAgent.toLowerCase()}/${editingFile.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent })
    });

    refetchFiles();
    setIsSavingDocs(false);
    setEditingFile(null);
  };


  // ─── Inspector Content ─────────────────────────────────────
  const inspectorContent = (
    <Inspector title="ZAP Inspector" width={320}>
      {selectedAgent && (
        <InspectorAccordion title={`IDENTITY: ${selectedAgent.toUpperCase()}`} icon={Bot} defaultOpen>
          <div className="flex flex-col gap-1 pb-1">
            {agentFilesData?.files && agentFilesData.files.length > 0 ? (
              agentFilesData.files.map(file => (
                <ExpandableFileSnippet 
                  key={file.id}
                  title={file.filename} 
                  content={file.content}
                  onEdit={() => setEditingFile(file)}
                />
              ))
            ) : (
              <span className="text-on-surface-variant text-sm italic p-2">No files found.</span>
            )}
          </div>
        </InspectorAccordion>
      )}

      <InspectorAccordion title="Titan Memory Stats" icon={BarChart3} defaultOpen={!selectedAgent}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Text size="body-small" className="text-on-surface-variant">Global Memory Facts</Text>
            <div className="bg-layer-base px-2 py-1 rounded text-primary">
              <Text size="label-small" weight="bold">{globalMemoryData?.memories?.length || 0}</Text>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Text size="body-small" className="text-on-surface-variant">Buffer Cache Load</Text>
            <div className="bg-layer-base px-2 py-1 rounded text-state-warning">
              <Text size="label-small" weight="bold">{(Math.random() * 20 + 5).toFixed(1)}%</Text>
            </div>
          </div>
        </div>
      </InspectorAccordion>

      <InspectorAccordion title="Search & Intelligence" icon={Search} defaultOpen={false}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Text size="body-small" className="text-on-surface-variant">Provider Engine</Text>
            <select
              title="Search Provider Override"
              value={searchProvider}
              onChange={(e) => setSearchProvider(e.target.value)}
              className="bg-layer-base border border-[var(--color-outline-variant,rgba(0,0,0,0.2))] text-on-surface text-sm rounded-[var(--button-border-radius,8px)] p-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full cursor-pointer"
            >
              <option value="InfoQuest">InfoQuest (Default)</option>
              <option value="Brave">Brave Search API</option>
              <option value="Perplexity">Perplexity API</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Text size="body-small" className="text-on-surface-variant">API Key</Text>
            <input 
              type="password" 
              value={searchApiKey}
              onChange={(e) => setSearchApiKey(e.target.value)}
              placeholder={`Enter ${searchProvider} Key...`}
              className="bg-layer-base border border-[var(--color-outline-variant,rgba(0,0,0,0.2))] text-on-surface text-sm rounded-[var(--button-border-radius,8px)] p-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
            />
          </div>
          <button 
             onClick={saveSearchConfig}
             className="w-full bg-primary text-primary-foreground py-2 rounded-[var(--button-border-radius,8px)] font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
             Commit Provider
          </button>
        </div>
      </InspectorAccordion>

    </Inspector>
  );

  return (
    <>
      {editingFile && selectedAgent && (
        <FileEditModal 
          title={`${selectedAgent} - ${editingFile.filename}`}
          content={editingFile.content}
          onSave={handleSaveModal}
          onCancel={() => setEditingFile(null)}
          isSaving={isSavingDocs}
        />
      )}
      <AppShell inspector={inspectorContent}>
        <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Canonical ThemeHeader */}
        <ThemeHeader 
           breadcrumb="Zap Swarm / Deerflow Command"
           title="Fleet Command"
           badge={`${telemetry.length} Nodes Active`}
           liveIndicator={true}
        />

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          <AgentsCanvas onSelectAgent={setSelectedAgent} />
        </main>
        </div>
      </AppShell>
    </>
  );
}

import dynamic from "next/dynamic";

const CommandDashboardDynamic = dynamic(() => Promise.resolve(CommandDashboard), {
  ssr: false,
  loading: () => <div className="p-8 text-on-surface">Initializing Command Center...</div>
});

export default function DeerflowCommandCenter() {
  return <CommandDashboardDynamic />;
}
