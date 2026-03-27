"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { LaboratoryTemplate } from "@/zap/organisms/laboratory-template";
import { Button as GenesisButton } from "@/genesis/atoms/interactive/button";
import { Text } from "@/genesis/atoms/typography/text";
import { Heading } from "@/genesis/atoms/typography/headings";
import { LayoutDashboard, Hammer, Brain, Activity, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/genesis/molecules/dropdown-menu";

export default function MerchantWorkspaceSandbox() {
  const { theme } = useParams() as { theme: string };
  const [activeDepartment, setActiveDepartment] = useState<'command' | 'builder' | 'ai' | 'swarm'>('command');

  const CanvasContent = () => (
    <div className="w-full h-full flex flex-col bg-layer-base rounded-xl border border-border overflow-hidden">
      {/* L1 Header - The App Switcher */}
      <header 
        className="w-full h-16 bg-surface-container-low border-b border-border flex items-center px-4 shrink-0 transition-colors"
        style={Object.assign({}, { borderRadius: 'var(--layer-1-border-radius) var(--layer-1-border-radius) 0 0' })}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded shrink-0 bg-primary/10 text-primary flex items-center justify-center">
                <StoreIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <Text.Primary className="text-sm font-semibold truncate leading-tight group-hover:text-primary transition-colors">Acme Coffee Roasters</Text.Primary>
                <div className="flex items-center gap-1 opacity-70">
                  <Text.Secondary className="text-xs">
                    {activeDepartment === 'command' && "Command Center"}
                    {activeDepartment === 'builder' && "Store Builder"}
                    {activeDepartment === 'ai' && "ZAP-AI Assistant"}
                    {activeDepartment === 'swarm' && "Swarm Ops"}
                  </Text.Secondary>
                  <ChevronDown className="w-3 h-3 group-hover:translate-y-[1px] transition-transform" />
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px]">
            <DropdownMenuItem onClick={() => setActiveDepartment('command')} className="flex items-start gap-3 p-3 cursor-pointer">
              <LayoutDashboard className="w-5 h-5 mt-0.5 opacity-80" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Command Center</span>
                <span className="text-xs text-muted-foreground">Analytics & Alerts</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDepartment('builder')} className="flex items-start gap-3 p-3 cursor-pointer">
              <Hammer className="w-5 h-5 mt-0.5 opacity-80" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Store Builder</span>
                <span className="text-xs text-muted-foreground">Modify Layouts (ZAP-Claw)</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDepartment('ai')} className="flex items-start gap-3 p-3 cursor-pointer">
              <Brain className="w-5 h-5 mt-0.5 opacity-80" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">AI Assistant</span>
                <span className="text-xs text-muted-foreground">Ask anything (ZAP-AI)</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDepartment('swarm')} className="flex items-start gap-3 p-3 cursor-pointer">
              <Activity className="w-5 h-5 mt-0.5 opacity-80" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Swarm Ops</span>
                <span className="text-xs text-muted-foreground">Autonomous logs</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="ml-auto flex items-center gap-2">
            <GenesisButton>Settings</GenesisButton>
            <GenesisButton visualStyle="solid">Publish</GenesisButton>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 w-full bg-layer-base p-6 overflow-y-auto">
        {activeDepartment === 'command' && <CommandCenterSkeleton />}
        {activeDepartment === 'builder' && <BuilderSkeleton />}
        {activeDepartment === 'ai' && <AISkeleton />}
        {activeDepartment === 'swarm' && <SwarmSkeleton />}
      </main>
    </div>
  );

  return (
    <LaboratoryTemplate
      headerMode="design"
      inspectorConfig={{}}
    >
      <div className="w-full h-[800px] p-6">
        <CanvasContent />
      </div>
    </LaboratoryTemplate>
  );
}

// Custom simple icon for the store logo
const StoreIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
  </svg>
);

const CommandCenterSkeleton = () => (
  <div className="w-full h-full flex flex-col gap-6">
    <Heading.H2>Command Center</Heading.H2>
    <div className="grid grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="h-32 bg-surface-container-low border border-border"
          style={Object.assign({}, { 
            boxShadow: 'var(--elevation-1)',
            borderRadius: 'var(--layer-2-border-radius)'
          })}
        >
          <div className="p-4 flex flex-col gap-2">
            <div className="w-1/2 h-4 bg-primary/20 rounded" />
            <div className="w-1/3 h-8 bg-primary/10 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BuilderSkeleton = () => (
  <div className="w-full h-full flex gap-6">
    <div className="w-1/3 h-full bg-surface-container-low border border-border flex flex-col p-4 gap-4" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <Heading.H3>Claw Prompt</Heading.H3>
      <div className="w-full h-24 bg-layer-base border-dashed border-2 border-border rounded" />
      <div className="w-full h-8 bg-primary/20 rounded mt-auto" />
    </div>
    <div className="w-2/3 h-full bg-layer-base border-dashed border-2 border-border flex items-center justify-center" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <Text.Secondary>Live POS Preview Rendered Here</Text.Secondary>
    </div>
  </div>
);

const AISkeleton = () => (
  <div className="w-full h-full max-w-3xl mx-auto flex flex-col gap-6">
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
      {/* AI Bubble */}
      <div className="self-start max-w-[80%] bg-surface-container-high p-4" style={Object.assign({}, { borderRadius: 'var(--layer-3-border-radius)' })}>
        <Text.Primary>Hello. I am ZAP-AI. How can I assist your store operations today?</Text.Primary>
      </div>
      {/* Merchant Bubble */}
      <div className="self-end max-w-[80%] bg-primary/20 p-4" style={Object.assign({}, { borderRadius: 'var(--layer-3-border-radius)' })}>
        <Text.Primary>What are the top 3 selling items this week?</Text.Primary>
      </div>
      {/* AI Bubble */}
      <div className="self-start max-w-[80%] bg-surface-container-high p-4" style={Object.assign({}, { borderRadius: 'var(--layer-3-border-radius)' })}>
        <div className="flex flex-col gap-2">
          <div className="w-3/4 h-4 bg-primary/10 rounded" />
          <div className="w-full h-4 bg-primary/10 rounded" />
          <div className="w-2/3 h-4 bg-primary/10 rounded" />
        </div>
      </div>
    </div>
    {/* Input Box */}
    <div className="w-full h-14 bg-surface-container-low border border-border flex items-center px-4" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <Text.Secondary className="opacity-50">Ask Zeuz-AI anything about your store...</Text.Secondary>
    </div>
  </div>
);

const SwarmSkeleton = () => (
  <div className="w-full h-full flex flex-col gap-6">
    <Heading.H2>Autonomous Feed</Heading.H2>
    <div className="w-full flex-1 bg-surface-container-low border border-border overflow-hidden" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <div className="w-full h-full flex flex-col p-4 gap-1 font-mono text-sm">
        <Text.Tertiary>[08:00:21] Jerry executed routine stock check on DB-A.</Text.Tertiary>
        <Text.Tertiary>[08:05:14] Spike verified UI rendering against newly pushed CSS.</Text.Tertiary>
        <Text.Tertiary>[08:12:00] ZAP-AI processed 4 inbound customer emails.</Text.Tertiary>
        <Text.Tertiary>[08:15:33] Swarm optimization completed. Awaiting tasks.</Text.Tertiary>
        {/* Blinking cursor */}
        <div className="w-2 h-4 bg-primary animate-pulse mt-4" />
      </div>
    </div>
  </div>
);
