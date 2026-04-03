"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Inspector } from "zap-design/src/zap/layout/Inspector";
import { InspectorAccordion } from "zap-design/src/zap/organisms/laboratory/InspectorAccordion";
import { DataFilter } from "zap-design/src/genesis/molecules/data-filter";
import { AlertCircle, Activity, CheckCircle2, Bot, Filter, Clock, RotateCcw } from "lucide-react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { useQuery } from "@tanstack/react-query";

interface JobTicket {
  _id: string;
  status: string;
  queueName?: string;
  priority?: number;
  tenantId: string;
  createdAt?: string;
  timestamp?: string;
  payload?: {
    intent?: string;
    systemPrompt?: string;
  };
  config?: {
    agentId?: string;
    defaultModel?: string;
  };
  details?: string;
  interceptType?: string;
  historyContext?: {
    sessionId?: string;
  };
}

export default function JobTicketDashboard() {
  const [filter, setFilter] = useState("all");

  const { data, isLoading, error, refetch } = useQuery<{ tasks: JobTicket[] }>({
    queryKey: ['swarm-omni-jobs'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/jobs?tenantId=ZVN');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 5000 // Poll every 5s
  });

  const jobs = data?.tasks || [];
  
  // Normalize internal DLQ structural diffs
  const normalizedJobs = jobs.map(j => {
      const isDLQ = !!j.interceptType || j.status === 'DEAD_LETTER' || (!j.queueName && !j.payload);
      const status = isDLQ ? 'FAILED/DLQ' : j.status || 'UNKNOWN';
      return { ...j, _normalizedStatus: status, isDLQ };
  });

  const filteredJobs = normalizedJobs.filter(j => {
      if (filter === "all") return true;
      if (filter === "active") return j._normalizedStatus === "PENDING" || j._normalizedStatus === "ACTIVE";
      if (filter === "completed") return j._normalizedStatus === "COMPLETED";
      if (filter === "dlq") return j.isDLQ;
      return true;
  });

  const getStatusIcon = (status: string) => {
      if (status.includes("FAILED") || status.includes("DLQ")) return <AlertCircle className="size-5 text-state-error" />;
      if (status === "ACTIVE" || status === "PENDING") return <Activity className="size-5 text-state-info animate-pulse" />;
      if (status === "COMPLETED") return <CheckCircle2 className="size-5 text-state-success" />;
      return <Clock className="size-5 text-on-surface-variant/50" />;
  };

  const getStatusBadgeColors = (status: string) => {
      if (status.includes("FAILED") || status.includes("DLQ")) return "bg-state-error/10 text-state-error";
      if (status === "ACTIVE" || status === "PENDING") return "bg-state-info/10 text-state-info";
      if (status === "COMPLETED") return "bg-state-success/10 text-state-success";
      return "bg-outline/5 text-on-surface-variant";
  };

  const inspectorContent = (
    <Inspector title="Audit Matrix" width={320}>
      <InspectorAccordion title="Queue Analytics" icon={Filter} defaultOpen>
        <div className="px-1 py-2">
          <DataFilter 
            groups={[
              {
                id: "status",
                title: "Ticket Status",
                options: [
                  { id: "all", label: "All Tickets", selected: filter === 'all' },
                  { id: "active", label: "Active Queue", selected: filter === 'active' },
                  { id: "completed", label: "Completed", selected: filter === 'completed' },
                  { id: "dlq", label: "Dead Letter (DLQ)", selected: filter === 'dlq' }
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
    <AppShell inspector={inspectorContent}>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="Zap Swarm / Auditing"
          title="JobTicket DLQ & OmniQueue"
          badge={`${filteredJobs.length} records`}
          liveIndicator={true}
        />
        
        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          <div className="flex justify-between items-center mb-8 bg-layer-cover p-6 rounded-[var(--card-radius,12px)] border border-outline/10 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))]">
            <div className="flex flex-col gap-1 max-w-2xl">
              <Heading level={3} className="text-on-surface">OmniRouter Global Registry</Heading>
              <Text size="body-small" className="text-on-surface-variant">
                Real-time visibility into the Merchant Swarm execution matrix. Monitor running tickets across all backend departmental agents or triage dead letter trace rejections caught by the Watchdog.
              </Text>
            </div>
            <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
               <RotateCcw className="size-4" /> Refresh
            </Button>
          </div>

          {isLoading && <div className="text-on-surface-variant animate-pulse p-4">Loading Job Tickets...</div>}
          {error && <div className="text-state-error bg-state-error/10 p-4 rounded-lg">Failed to connect to SYS_OS queue clusters.</div>}

          {!isLoading && !error && filteredJobs.length === 0 && (
             <div className="flex flex-col items-center justify-center p-20 text-on-surface-variant opacity-60">
                 <Bot className="size-16 mb-4 opacity-50" />
                 <Text size="body-medium">No job tickets found in the selected queue.</Text>
             </div>
          )}

          {!isLoading && !error && filteredJobs.length > 0 && (
            <section className="grid grid-cols-1 gap-4">
              {filteredJobs.map((j) => (
                <div key={j._id} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,8px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:border-outline/20 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                  {/* Left Edge Status Strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${j.isDLQ ? 'bg-state-error' : (j._normalizedStatus === 'COMPLETED' ? 'bg-state-success' : 'bg-state-info')}`} />

                  <div className="flex flex-col gap-3 min-w-[200px] shrink-0 pl-2">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 shrink-0 rounded-full flex justify-center items-center ${getStatusBadgeColors(j._normalizedStatus)}`}>
                        {getStatusIcon(j._normalizedStatus)}
                      </div>
                      <div className="flex flex-col">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide w-fit ${getStatusBadgeColors(j._normalizedStatus)}`}>
                           {j._normalizedStatus.toUpperCase()}
                         </span>
                         <Text size="label-small" className="text-on-surface-variant font-mono text-[10px] max-w-[120px] truncate" title={j._id}>
                           id: {j._id}
                         </Text>
                      </div>
                    </div>
                    {j.createdAt || j.timestamp ? (
                      <Text size="label-small" className="text-on-surface-variant text-[11px] pl-1">
                        {new Date(j.createdAt || j.timestamp || "").toLocaleString()}
                      </Text>
                    ) : null}
                  </div>

                  <div className="flex-1 flex flex-col min-w-0 border-l border-outline/5 pl-4 md:pl-6">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {j.config?.agentId && <span className="bg-layer-panel px-2 border border-outline/10 rounded-sm text-[11px] font-medium text-on-surface flex items-center gap-1"><Bot className="size-3"/> Agent {j.config.agentId}</span>}
                        {j.tenantId && <span className="bg-layer-panel px-2 border border-outline/10 rounded-sm text-[11px] font-medium text-on-surface tracking-wide uppercase">TENANT: {j.tenantId}</span>}
                        {j.payload?.intent && <span className="bg-layer-panel px-2 border border-outline/10 rounded-sm text-[11px] font-medium text-primary">INTENT: {j.payload.intent}</span>}
                        {j.queueName && <span className="bg-layer-panel px-2 border border-outline/10 rounded-sm text-[11px] font-medium text-on-surface-variant">Queue: {j.queueName} (Priority {j.priority})</span>}
                        {j.historyContext?.sessionId && <span className="bg-layer-panel px-2 border border-outline/10 rounded-sm text-[11px] font-medium text-on-surface-variant font-mono">Trace ID: {j.historyContext.sessionId}</span>}
                    </div>

                    <div className="mt-2 text-[13px] font-mono text-on-surface/80 bg-layer-base p-3 rounded-md border border-outline/10 max-h-32 overflow-y-auto custom-scrollbar">
                        {j.isDLQ ? (
                            <div className="text-state-error/90 flex flex-col gap-1">
                                <span className="font-bold underline">WATCHDOG REJECTION / TRACE FAULT:</span>
                                {j.details || j.interceptType || "Unknown Fatal Exception"}
                            </div>
                        ) : (
                            j.payload?.systemPrompt || "No operational payload registered."
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </AppShell>
  );
}
