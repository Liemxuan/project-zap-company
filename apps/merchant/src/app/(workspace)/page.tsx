"use client";

import React from 'react';
import { MerchantCanvas } from 'zap-design/src/genesis/organisms/merchant-workspace-layout';
import { MetroHeader } from 'zap-design/src/genesis/molecules/layout/MetroHeader';
import { Card } from 'zap-design/src/genesis/atoms/surfaces/card';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from 'zap-design/src/lib/animations';
import { 
  Sparkles, 
  Settings, 
  CreditCard,
  Users,
  Activity,
  Zap,
  ArrowUpRight,
  Bot,
  Box,
  Palette
} from 'lucide-react';

// Mock Data for Swarm Pulse
const SWARM_ACTIVITIES = [
  { id: 1, agent: 'Athena', role: 'Operations', action: 'Routed 14 orders to fulfillment center', time: '2m ago', icon: Box, color: 'text-blue-500' },
  { id: 2, agent: 'Spike', role: 'Frontend', action: 'Optimized hero assets for mobile viewport', time: '12m ago', icon: Palette, color: 'text-pink-500' },
  { id: 3, agent: 'Ralph', role: 'Security', action: 'Blocked 3 suspicious login attempts', time: '1h ago', icon: Activity, color: 'text-red-500' },
  { id: 4, agent: 'Zeus', role: 'Commander', action: 'Deployed new seasonal campaign rules', time: '3h ago', icon: Zap, color: 'text-yellow-500' },
];

export default function MerchantDigitalWorkspace() {
  return (
    <MerchantCanvas>
      {/* Department Header */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <MetroHeader 
          breadcrumb="Merchant Workspace / Home"
          title="Command Center"
          badge={null}
          rightSlot={
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-layer-base/50 backdrop-blur-md">
                <Settings size={16} />
                Configure Pulse
              </Button>
              <Button variant="primary" className="gap-2 shadow-[0_0_20px_rgba(var(--sys-color-primary-rgb),0.3)]">
                <Sparkles size={16} />
                Ask ZAP-AI
              </Button>
            </div>
          }
        />
      </div>

      {/* Dashboard Grid using Atomic Cards */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20"
      >
        
        {/* Metric 1 */}
        <motion.div variants={fadeUp} className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)] transition-transform hover:-translate-y-1 duration-300">
             <div className="flex justify-between items-start">
               <div>
                  <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gross Volume</Text>
                  <Heading level={2} className="text-4xl font-display font-bold text-on-surface mt-2 tracking-tighter">
                    $124,500
                  </Heading>
               </div>
               <div className="p-3 bg-primary-container/30 rounded-[length:var(--radius-btn,6px)] text-primary">
                 <CreditCard size={24} />
               </div>
             </div>
             <div className="flex items-center gap-2 mt-6">
               <span className="flex items-center text-xs font-bold text-feedback-success bg-feedback-success/10 px-2 py-1 rounded-full">
                 <ArrowUpRight size={14} className="mr-1" />
                 14.2%
               </span>
               <Text className="text-xs text-on-surface-variant font-medium">from last week</Text>
             </div>
          </Card>
        </motion.div>

        {/* Metric 2 */}
        <motion.div variants={fadeUp} className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)] transition-transform hover:-translate-y-1 duration-300">
             <div className="flex justify-between items-start">
               <div>
                  <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Swarm Tasks</Text>
                  <Heading level={2} className="text-4xl font-display font-bold text-on-surface mt-2 tracking-tighter">
                    7
                  </Heading>
               </div>
               <div className="p-3 bg-secondary-container/30 rounded-[length:var(--radius-btn,6px)] text-secondary relative overflow-hidden">
                 <motion.div 
                   animate={{ rotate: 360 }} 
                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary/20 to-transparent"
                 />
                 <Users size={24} className="relative z-10" />
               </div>
             </div>
             <Text className="text-sm text-on-surface-variant mt-6 border-l-2 border-secondary pl-3 font-medium">
               Athena, Ralph, Spike active
             </Text>
          </Card>
        </motion.div>

        {/* Metric 3 */}
        <motion.div variants={fadeUp} className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)] transition-transform hover:-translate-y-1 duration-300">
             <div className="flex justify-between items-start">
               <div>
                  <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">System Health</Text>
                  <Heading level={2} className="text-4xl font-display font-bold text-on-surface mt-2 tracking-tighter">
                    Optimal
                  </Heading>
               </div>
               <div className="p-3 bg-feedback-info/20 rounded-[length:var(--radius-btn,6px)] text-feedback-info">
                 <Activity size={24} />
               </div>
             </div>
             <div className="w-full bg-layer-base rounded-full h-1.5 mt-6 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: '98%' }} 
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="bg-feedback-info h-1.5 rounded-full" 
               />
             </div>
             <Text className="text-xs text-on-surface-variant mt-2 font-medium flex justify-between">
               <span>Memory: 42%</span>
               <span>Edge: 12ms</span>
             </Text>
          </Card>
        </motion.div>

        {/* Swarm Pulse Feed */}
        <motion.div variants={fadeUp} className="lg:col-span-8">
           <Card className="p-6 h-[400px] flex flex-col bg-layer-panel border-black [border-radius:var(--layer-2-border-radius)] overflow-hidden relative">
             <div className="flex justify-between items-center z-10 mb-6">
                <Heading level={3} className="text-xl font-bold font-display flex items-center gap-2">
                  <Bot className="text-primary" size={20} />
                  Swarm Pulse
                </Heading>
                <Button variant="ghost" size="sm" className="text-xs">
                  View Full Logs
                </Button>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide z-10">
               {SWARM_ACTIVITIES.map((activity, index) => (
                 <motion.div 
                   key={activity.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 + 0.3 }}
                   className="group p-4 rounded-lg bg-layer-base/50 hover:bg-layer-base border border-transparent hover:border-border transition-all duration-200 flex items-start gap-4"
                 >
                   <div className={`p-2 rounded-md bg-layer-canvas ${activity.color} bg-opacity-10 shrink-0`}>
                     <activity.icon size={18} />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-baseline justify-between">
                       <Text className="font-bold text-on-surface">{activity.agent}</Text>
                       <Text className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{activity.time}</Text>
                     </div>
                     <Text className="text-xs text-on-surface-variant font-medium mt-1">{activity.role}</Text>
                     <Text className="text-sm mt-1">{activity.action}</Text>
                   </div>
                 </motion.div>
               ))}
             </div>
             
             {/* Decorative Background Glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col gap-4">
           <Card className="p-6 flex-1 flex flex-col bg-gradient-to-br from-primary to-primary-container text-on-primary [border-radius:var(--layer-2-border-radius)] border-none shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Heading level={3} className="text-2xl font-display font-bold mb-2 text-inherit tracking-tight">
                Launch Campaign
              </Heading>
              <Text className="text-sm font-medium opacity-90 mb-6 text-inherit">
                Trigger Zeus to provision a new ad cluster and landing pages instantly.
              </Text>
              <Button className="mt-auto bg-on-primary text-primary hover:bg-white w-full font-bold shadow-lg">
                <Zap size={16} className="mr-2" /> Activate Zeus
              </Button>
           </Card>

           <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="h-24 flex-col gap-2 bg-layer-panel hover:bg-layer-dialog border-black border [border-radius:var(--radius-btn,6px)]">
               <Palette size={20} className="text-secondary" />
               <span className="text-xs font-bold">Theme Editor</span>
             </Button>
             <Button variant="outline" className="h-24 flex-col gap-2 bg-layer-panel hover:bg-layer-dialog border-black border [border-radius:var(--radius-btn,6px)]">
               <Box size={20} className="text-blue-500" />
               <span className="text-xs font-bold">Inventory</span>
             </Button>
           </div>
        </motion.div>

      </motion.div>
    </MerchantCanvas>
  );
}
