"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LaboratoryTemplate } from "@/zap/templates/LaboratoryTemplate";
import { Text } from "@/genesis/atoms/typography/text";
import { Heading } from "@/genesis/atoms/typography/headings";
import { Slider } from "@/genesis/atoms/interactive/slider";
import { Select } from "@/genesis/atoms/interactive/option-select";
import { MerchantLayout, MerchantSideNav, MerchantCanvas } from "@/genesis/organisms/merchant-workspace-layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/genesis/molecules/accordion";

import { ThemeHeader } from "@/genesis/molecules/layout/ThemeHeader";
import { MetroHeader } from "@/genesis/molecules/layout/MetroHeader";
import { L5Inspector, L5InspectorFooter } from "@/genesis/organisms/inspector";
import { InspectorAccordion } from "@/zap/organisms/laboratory/InspectorAccordion";
import { useBorderProperties } from "@/zap/sections/atoms/border_radius/use-border-properties";
import { Sparkles, BarChart, Store, Activity } from 'lucide-react';
import { Button } from "@/genesis/atoms/interactive/button";

export default function MerchantWorkspaceSandbox() {
//... (unchanged inner state)
  const { theme } = useParams() as { theme: string };
  const [activeDepartment, setActiveDepartment] = useState<'command' | 'builder' | 'ai' | 'swarm'>('command');
  
  // State Container mapped to css variables
  const [sidenavWidth, setSidenavWidth] = useState([256]);
  const [canvasPadding, setCanvasPadding] = useState([32]);
  const [merchantRadius, setMerchantRadius] = useState([12]);
  const [headerHeight, setHeaderHeight] = useState([64]);

  // Hydration
  useEffect(() => {
    if (!theme) return;
    fetch(`/api/theme/settings?theme=${theme}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.variables) {
          if (data.variables['--merchant-sidenav-width']) setSidenavWidth([parseInt(data.variables['--merchant-sidenav-width'], 10)]);
          if (data.variables['--merchant-canvas-padding']) setCanvasPadding([parseInt(data.variables['--merchant-canvas-padding'], 10)]);
          if (data.variables['--merchant-radius']) setMerchantRadius([parseInt(data.variables['--merchant-radius'], 10)]);
          if (data.variables['--merchant-header-height']) setHeaderHeight([parseInt(data.variables['--merchant-header-height'], 10)]);
        }
      })
      .catch(console.error);
  }, [theme]);

  const {
      state: borderState,
      setComponentOverride,
      clearComponentOverride,
      getEffectiveProps
  } = useBorderProperties();

  const effectiveProps = getEffectiveProps('Merchant Workspace');
  return (
    <LaboratoryTemplate
      componentName="Merchant Workspace Sandbox"
      tier="WORKSPACE INTEGRATION"
      flush={true}
      coverTitle=""
      coverBadge=""
      headerMode={
        <ThemeHeader
            title="Merchant Workspace"
            badge="L4/L5 Organism Layout"
            breadcrumb={`Zap Design Engine / Metro / Organisms`}
            liveIndicator={false}
        />
      }
      inspectorConfig={{
        width: 320,
        footer: <L5InspectorFooter 
            borderState={borderState}
            publishContext={{
              activeTheme: theme,
              filePath: "app/design/[theme]/merchant-workspace/page.tsx",
              customVariables: {
                '--merchant-sidenav-width': `${sidenavWidth[0]}px`,
                '--merchant-canvas-padding': `${canvasPadding[0]}px`,
                '--merchant-radius': `${merchantRadius[0]}px`,
                '--merchant-header-height': `${headerHeight[0]}px`
              }
            }}
        />,
        content: (
          <L5Inspector 
            componentName="Merchant Workspace"
            borderState={borderState}
            setComponentOverride={setComponentOverride}
            clearComponentOverride={clearComponentOverride}
            effectiveProps={effectiveProps}
            docsLabel="Merchant Workspace Layout Protocol"
            docsHref="vscode://file/Users/zap/Workspace/olympus/packages/zap-design/src/genesis/organisms/merchant-workspace-layout.tsx"
            publishContext={{
              activeTheme: theme,
              filePath: "app/design/[theme]/merchant-workspace/page.tsx",
              customVariables: {
                '--merchant-sidenav-width': `${sidenavWidth[0]}px`,
                '--merchant-canvas-padding': `${canvasPadding[0]}px`,
                '--merchant-radius': `${merchantRadius[0]}px`,
                '--merchant-header-height': `${headerHeight[0]}px`
              }
            }}
          >
            <div className="space-y-3 pt-2">
               {/* Preview State Controls */}
               <InspectorAccordion title="Preview State" icon="visibility" defaultOpen={true}>
                 <div className="px-2 pb-4 pt-2">
                   <div className="flex flex-col gap-6">
                     <div className="flex flex-col gap-3">
                       <div className="text-[10px] font-medium text-muted-foreground uppercase opacity-80">Active Department</div>
                       <Select
                         value={activeDepartment}
                         onChange={(val) => setActiveDepartment(val as 'command' | 'builder' | 'ai' | 'swarm')}
                         options={[
                           { label: "Command Center", value: "command" },
                           { label: "Store Builder", value: "builder" },
                           { label: "AI Assistant", value: "ai" },
                           { label: "Swarm Ops", value: "swarm" }
                         ]}
                         className="w-full bg-layer-base border-border/30 text-foreground"
                         placeholder="Select Department"
                       />
                     </div>
                   </div>
                 </div>
               </InspectorAccordion>

               
               {/* Layout Controls */}
               <InspectorAccordion title="Structural Dimensions" icon="straighten" defaultOpen={true}>
                 <div className="px-2 pb-4 pt-2">
                   <div className="flex flex-col gap-6">
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between">
                         <span className="text-[10px] font-medium text-muted-foreground uppercase opacity-80">SideNav Width</span>
                         <span className="text-[10px] font-medium">{sidenavWidth[0]}px</span>
                       </div>
                       <Slider 
                         value={sidenavWidth} 
                         onValueChange={setSidenavWidth} 
                         min={240} 
                         max={320} 
                         step={8} 
                         className="w-full"
                       />
                     </div>
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between">
                         <span className="text-[10px] font-medium text-muted-foreground uppercase opacity-80">Header Height</span>
                         <span className="text-[10px] font-medium">{headerHeight[0]}px</span>
                       </div>
                       <Slider 
                         value={headerHeight} 
                         onValueChange={setHeaderHeight} 
                         min={56} 
                         max={96} 
                         step={8} 
                         className="w-full"
                       />
                     </div>
                   </div>
                 </div>
               </InspectorAccordion>

               {/* Spacing Controls */}
               <InspectorAccordion title="Canvas Spacing" icon="format_line_spacing" defaultOpen={true}>
                 <div className="px-2 pb-4 pt-2">
                   <div className="flex flex-col gap-6">
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between">
                         <span className="text-[10px] font-medium text-muted-foreground uppercase opacity-80">Global Padding</span>
                         <span className="text-[10px] font-medium">{canvasPadding[0]}px</span>
                       </div>
                       <Slider 
                         value={canvasPadding} 
                         onValueChange={setCanvasPadding} 
                         min={16} 
                         max={64} 
                         step={8} 
                         className="w-full"
                       />
                     </div>
                   </div>
                 </div>
               </InspectorAccordion>

               {/* Border Controls */}
               <InspectorAccordion title="Shape & Borders" icon="rounded_corner" defaultOpen={true}>
                 <div className="px-2 pb-4 pt-2">
                   <div className="flex flex-col gap-6">
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between">
                         <span className="text-[10px] font-medium text-muted-foreground uppercase opacity-80">Corner Radius</span>
                         <span className="text-[10px] font-medium">{merchantRadius[0]}px</span>
                       </div>
                       <Slider 
                         value={merchantRadius} 
                         onValueChange={setMerchantRadius} 
                         min={0} 
                         max={24} 
                         step={4} 
                         className="w-full"
                       />
                     </div>
                   </div>
                 </div>
               </InspectorAccordion>
             </div>
          </L5Inspector>
        )
      }}
    >
      <div className="w-full min-h-[800px] h-full p-6 flex items-start">
        
        {/* Isolated Preview Container */}
        <div className="w-full h-[800px] rounded-xl overflow-hidden shadow-sm border border-border">
          <MerchantLayout style={Object.assign({}, { 
            '--merchant-sidenav-width': `${sidenavWidth[0]}px`,
            '--merchant-canvas-padding': `${canvasPadding[0]}px`,
            '--merchant-radius': `${merchantRadius[0]}px`,
            '--merchant-header-height': `${headerHeight[0]}px`
          } as React.CSSProperties)}>
            <MerchantSideNav 
              activeDepartment={activeDepartment} 
              navItems={[
                { id: 'command', label: 'Command Center', icon: <BarChart size={16} />, onClick: () => setActiveDepartment('command') },
                { id: 'builder', label: 'Store Builder', icon: <Store size={16} />, onClick: () => setActiveDepartment('builder') },
                { id: 'ai', label: 'AI Assistant', icon: <Sparkles size={16} />, onClick: () => setActiveDepartment('ai') },
                { id: 'swarm', label: 'Swarm Ops', icon: <Activity size={16} />, onClick: () => setActiveDepartment('swarm') }
              ]}
            />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <MerchantCanvas>
                  {activeDepartment === 'command' && <CommandCenterSkeleton />}
                  {activeDepartment === 'builder' && <BuilderSkeleton />}
                  {activeDepartment === 'ai' && <AISkeleton />}
                  {activeDepartment === 'swarm' && <SwarmSkeleton />}
              </MerchantCanvas>
            </div>
          </MerchantLayout>
        </div>
      </div>
    </LaboratoryTemplate>
  );
}

const CommandCenterSkeleton = () => (
  <div className="w-full h-full flex flex-col gap-6">
    <MetroHeader 
      breadcrumb="Merchant Workspace / Home"
      title="Command Center"
      badge={null}
      rightSlot={
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            Configure Pulse
          </Button>
          <Button variant="primary" className="gap-2">
            Ask ZAP-AI
          </Button>
        </div>
      }
    />
    <div className="grid grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="h-32 bg-layer-cover"
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
    <div className="w-1/3 h-full bg-layer-cover flex flex-col p-4 gap-4" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <MetroHeader 
        breadcrumb="Store Building / ZAP Design Engine"
        title={
          <Heading level={3}>Claw Prompt</Heading>
        }
        badge={null}
        showBackground={false}
      />
      <div className="w-full h-24 bg-layer-base border-dashed border-2 border-border rounded" />
      <div className="w-full h-8 bg-primary/20 rounded mt-auto" />
    </div>
    <div className="w-2/3 h-full bg-layer-canvas border-dashed border-2 border-border flex items-center justify-center" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <Text size="body-main" className="text-muted-foreground">Live POS Preview Rendered Here</Text>
    </div>
  </div>
);

const AISkeleton = () => (
  <div className="w-full h-full max-w-3xl mx-auto flex flex-col gap-6">
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
      {/* AI Bubble */}
      <div className="self-start max-w-[80%] bg-layer-panel p-4" style={Object.assign({}, { borderRadius: 'var(--layer-3-border-radius)' })}>
        <Text size="body-main" className="text-foreground">Hello. I am ZAP-AI. How can I assist your store operations today?</Text>
      </div>
      {/* Merchant Bubble */}
      <div className="self-end max-w-[80%] bg-primary/20 p-4" style={Object.assign({}, { borderRadius: 'var(--layer-3-border-radius)' })}>
        <Text size="body-main" className="text-foreground">What are the top 3 selling items this week?</Text>
      </div>
      {/* AI Bubble */}
      <div className="self-start max-w-[80%] bg-layer-panel p-4" style={Object.assign({}, { borderRadius: 'var(--layer-3-border-radius)' })}>
        <div className="flex flex-col gap-2">
          <div className="w-3/4 h-4 bg-primary/10 rounded" />
          <div className="w-full h-4 bg-primary/10 rounded" />
          <div className="w-2/3 h-4 bg-primary/10 rounded" />
        </div>
      </div>
    </div>
    {/* Input Box */}
    <div className="w-full h-14 bg-layer-canvas border border-border flex items-center px-4" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <Text size="body-main" className="text-muted-foreground opacity-50">Ask Zeuz-AI anything about your store...</Text>
    </div>
  </div>
);

const SwarmSkeleton = () => (
  <div className="w-full h-full flex flex-col gap-6">
    <div className="px-1">
      <MetroHeader 
        breadcrumb="Autonomous Ops Hub / Active Threads"
        title="Autonomous Feed"
        badge={null}
        showBackground={false}
      />
    </div>
    <div className="w-full flex-1 bg-layer-canvas overflow-hidden" style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}>
      <div className="w-full h-full flex flex-col p-4 gap-1 font-mono text-sm">
        <Text size="body-small" className="text-muted-foreground/70">[08:00:21] Jerry executed routine stock check on DB-A.</Text>
        <Text size="body-small" className="text-muted-foreground/70">[08:05:14] Spike verified UI rendering against newly pushed CSS.</Text>
        <Text size="body-small" className="text-muted-foreground/70">[08:12:00] ZAP-AI processed 4 inbound customer emails.</Text>
        <Text size="body-small" className="text-muted-foreground/70">[08:15:33] Swarm optimization completed. Awaiting tasks.</Text>
        {/* Blinking cursor */}
        <div className="w-2 h-4 bg-primary animate-pulse mt-4" />
      </div>
    </div>
  </div>
);
