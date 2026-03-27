import React from 'react';
import { Card } from 'zap-design/src/genesis/atoms/surfaces/card';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { 
  BarChart, 
  Store, 
  Sparkles, 
  Users, 
  Settings, 
  CreditCard,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

export default function MerchantDigitalWorkspace() {
  const activeDepartment = 'Command Center'; // Hardcoded for visual layout phase
  
  return (
    <div className="min-h-screen bg-layer-canvas font-body flex flex-col">
      {/* 
        TOP NAVIGATION SHELL
        Adheres to L4 Surface Elevation for global actions
      */}
      <header 
        className="h-16 border-b border-border bg-layer-panel flex items-center justify-between px-6"
        style={Object.assign({}, {
            borderRadius: 'var(--layer-2-border-radius)' // Inspector tethering
        })}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[length:var(--radius-btn,8px)] bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <Heading level={4} className="tracking-tight text-foreground font-display font-semibold">
              Acme Corp
            </Heading>
          </div>
          
          <div className="h-6 w-[1px] bg-border mx-2" />
          
          {/* Mocked Dropdown Menu for Phase 1 Layout */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 hover:bg-neutral-muted px-3 py-1.5 rounded-[length:var(--radius-btn,6px)] transition-colors">
              <span className="text-sm font-medium text-foreground">{activeDepartment}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </div>
            
            {/* Expanded State (Hidden default, showing for structural review) */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-layer-popover border border-border shadow-elevated rounded-[length:var(--radius-card,12px)] p-2 hidden group-hover:block z-50">
              <div className="px-2 py-1.5 mb-1">
                <Text className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Departments</Text>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 bg-neutral-muted rounded-[length:var(--radius-btn,8px)] cursor-pointer">
                <BarChart size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Command Center</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-subtle rounded-[length:var(--radius-btn,8px)] cursor-pointer transition-colors mt-1">
                <Store size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Store Builder</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-subtle rounded-[length:var(--radius-btn,8px)] cursor-pointer transition-colors mt-1">
                <Sparkles size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">ZAP-AI Automation</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-subtle rounded-[length:var(--radius-btn,8px)] cursor-pointer transition-colors mt-1">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Swarm Operations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search anywhere..." 
               className="w-64 h-9 bg-neutral-subtle border border-border rounded-[length:var(--radius-input,6px)] pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
             />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell size={18} />
          </Button>
          <div className="w-8 h-8 rounded-full bg-theme-base border border-border flex items-center justify-center cursor-pointer">
            <span className="text-sm font-bold text-foreground font-display">ZT</span>
          </div>
        </div>
      </header>

      {/* DEPARTMENT WORKSPACE CONTENT */}
      <main className="flex-1 overflow-x-hidden p-8">
        
        {/* Department Header */}
        <div className="flex justify-between items-end mb-8 w-full max-w-7xl mx-auto">
          <div>
            <Heading level={2} className="text-3xl font-display font-semibold tracking-tight text-foreground">
              Command Center
            </Heading>
            <Text className="text-muted-foreground mt-2 text-lg">
              Good morning. Here is your operational pulse for today.
            </Text>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Settings size={16} />
              Configure Pulse
            </Button>
            <Button variant="primary" className="gap-2">
              <Sparkles size={16} />
              Ask ZAP-AI
            </Button>
          </div>
        </div>

        {/* Dashboard Grid using Atomic Cards */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Metric 1 */}
          <Card 
            className="p-6 flex flex-col justify-between"
            style={Object.assign({}, {
              borderRadius: 'var(--layer-2-border-radius)'
            })}
          >
             <div className="flex justify-between items-start">
               <div>
                  <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Gross Volume</Text>
                  <Heading level={3} className="text-3xl font-display font-bold text-foreground mt-2">
                    $124,500
                  </Heading>
               </div>
               <div className="p-2 bg-primary/10 rounded-[length:var(--radius-btn,6px)] text-primary">
                 <CreditCard size={20} />
               </div>
             </div>
             <Text className="text-sm text-feedback-success mt-4 font-medium">+14.2% from last week</Text>
          </Card>

          {/* Metric 2 */}
          <Card 
            className="p-6 flex flex-col justify-between"
            style={Object.assign({}, {
              borderRadius: 'var(--layer-2-border-radius)'
            })}
          >
             <div className="flex justify-between items-start">
               <div>
                  <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Active Swarm Tasks</Text>
                  <Heading level={3} className="text-3xl font-display font-bold text-foreground mt-2">
                    7
                  </Heading>
               </div>
               <div className="p-2 bg-theme-base/10 rounded-[length:var(--radius-btn,6px)] text-theme-base">
                 <Users size={20} />
               </div>
             </div>
             <Text className="text-sm text-muted-foreground mt-4 font-medium">Athena, Ralph, Spike active</Text>
          </Card>

          {/* Metric 3 */}
          <Card 
            className="p-6 flex flex-col justify-between"
            style={Object.assign({}, {
              borderRadius: 'var(--layer-2-border-radius)'
            })}
          >
             <div className="flex justify-between items-start">
               <div>
                  <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">AI Confidence Score</Text>
                  <Heading level={3} className="text-3xl font-display font-bold text-foreground mt-2">
                    98.2%
                  </Heading>
               </div>
               <div className="p-2 bg-feedback-success/10 rounded-[length:var(--radius-btn,6px)] text-feedback-success">
                 <Sparkles size={20} />
               </div>
             </div>
             <Text className="text-sm text-muted-foreground mt-4 font-medium">Network optimization verified</Text>
          </Card>

          {/* Full Width Chart Skeleton */}
          <div className="md:col-span-3 mt-4">
             <Card 
               className="p-6 h-96 flex flex-col"
               style={Object.assign({}, {
                 borderRadius: 'var(--layer-2-border-radius)'
               })}
             >
                <div className="flex justify-between items-center mb-6">
                  <Heading level={4} className="text-xl font-display font-semibold text-foreground">
                    Revenue Trajectory
                  </Heading>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">7D</Button>
                    <Button variant="primary" size="sm">30D</Button>
                    <Button variant="outline" size="sm">YTD</Button>
                  </div>
                </div>
                {/* Mocked Chart Area */}
                <div className="flex-1 w-full bg-neutral-subtle rounded-[length:var(--radius-card,8px)] border border-dashed border-border flex items-center justify-center">
                   <Text className="text-muted-foreground font-medium">Chart visualization pending Swarm data hook</Text>
                </div>
             </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
