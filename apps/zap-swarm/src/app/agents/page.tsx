"use client";

import { useState, Suspense } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Inspector } from "zap-design/src/zap/layout/Inspector";
import { InspectorAccordion } from "zap-design/src/zap/organisms/laboratory/InspectorAccordion";
import { Settings2, BarChart3, Search, Bot } from "lucide-react";

function AgentsCanvas() {
  const agents = [
    { name: "Jerry", role: "Chief of Staff", port: 3901, status: "active", uptime: "2h 15m" },
    { name: "Spike", role: "Analyst", port: 3902, status: "active", uptime: "4h 02m" },
    { name: "Athena", role: "Researcher", port: 3903, status: "active", uptime: "1h 45m" },
    { name: "Gateway", role: "Omni-Router", port: 3900, status: "active", uptime: "5h 11m" },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <div key={agent.name} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:-translate-y-1 hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.1))] transition-all cursor-pointer group">
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


  // ─── Inspector Content ─────────────────────────────────────
  const inspectorContent = (
    <Inspector title="ZAP Inspector" width={320}>
      <InspectorAccordion title="OmniRouter Matrix" icon={Settings2} defaultOpen>
        <div className="flex flex-col gap-3">
          <Text size="body-small" className="text-on-surface-variant">Active Model Override</Text>
          <select
            title="OmniRouter Model Override"
            className="bg-layer-base border border-[var(--color-outline-variant,rgba(0,0,0,0.2))] text-on-surface text-sm rounded-[var(--button-border-radius,8px)] p-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full cursor-pointer"
          >
            <option>gemini-3.1-pro-preview</option>
            <option>gemini-2.5-flash</option>
            <option>gemini-embedding-2-preview</option>
          </select>
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

      <InspectorAccordion title="Titan Memory Stats" icon={BarChart3} defaultOpen>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Text size="body-small" className="text-on-surface-variant">VFS Image Vectors</Text>
            <div className="bg-layer-base px-2 py-1 rounded text-primary">
              <Text size="label-small" weight="bold">42,109</Text>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Text size="body-small" className="text-on-surface-variant">Buffer Cache Load</Text>
            <div className="bg-layer-base px-2 py-1 rounded text-state-warning">
              <Text size="label-small" weight="bold">14.3%</Text>
            </div>
          </div>
        </div>
      </InspectorAccordion>
    </Inspector>
  );

  return (
    <AppShell inspector={inspectorContent}>
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Canonical ThemeHeader */}
        <ThemeHeader 
           breadcrumb="Zap Swarm / Deerflow Command"
           title="Fleet Command"
           badge={`${telemetry.length} Vectors Registered`}
           liveIndicator={true}
        />

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          <AgentsCanvas />
        </main>
      </div>
    </AppShell>
  );
}

export default function DeerflowCommandCenter() {
  return (
    <Suspense fallback={<div className="p-8 text-on-surface">Initializing Command Center...</div>}>
      <CommandDashboard />
    </Suspense>
  );
}
