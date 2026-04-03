"use client";

export const dynamic = 'force-dynamic';

import * as React from "react";
import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { CreditCard, DollarSign, Lock, X, Users, Settings, Plus, Search, RefreshCw } from "lucide-react";
import { cn } from "zap-design/src/lib/utils";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LiveBlinker } from "zap-design/src/genesis/atoms/indicators/LiveBlinker";

export default function PaymentsDashboard() {
  const [activeConfig, setActiveConfig] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="zap swarm / financial telemetry"
          title="financial endpoints"
          badge="1 offline"
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          <div className="w-full space-y-6">

            <div className="mb-2">
               <Heading level={3} className="text-on-surface mb-1 tracking-tight">Payments</Heading>
               <Text size="body-small" className="text-on-surface-variant font-medium">
                 Manage risk intervention, dispute automation, and payment gateway telemetry.
               </Text>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
              <div className="w-full sm:w-auto flex-1 max-w-sm relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50" />
                <input 
                  type="text"
                  title="Search payments"
                  aria-label="Search payments"
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-layer-base border border-outline/15 text-sm rounded-[var(--input-radius,8px)] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-outline/30 focus:bg-layer-base shadow-sm transition-colors"
                />
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                  <span className="text-on-surface-variant/70 tracking-wide whitespace-nowrap">1 gateway</span>
                  <span className="w-1 h-1 rounded-full bg-outline/20 shrink-0"></span>
                  <span className="text-on-surface-variant/50 flex items-center gap-1.5 tracking-wide whitespace-nowrap">
                    <span className="size-1.5 rounded-full bg-on-surface-variant/30" />
                    0 connected
                  </span>
                </div>

                <Button 
                  variant="ghost" 
                  title="Refresh Payment Status"
                  className="p-2 h-9 w-9 border border-outline/15 rounded-lg bg-layer-base hover:bg-outline/5 transition-all active:scale-95"
                >
                  <RefreshCw className="size-4 text-on-surface-variant" />
                </Button>
              </div>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 pb-20">
            {/* Stripe Card */}
            <div className="bg-layer-cover border border-outline/10 shadow-sm rounded-[32px] p-6 flex flex-col group hover:shadow-2xl transition-all relative overflow-hidden h-full">
              {/* Visual Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-all group-hover:scale-125 group-hover:opacity-[0.08] text-purple-600">
                <CreditCard className="size-full" />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 border border-outline/5 overflow-hidden size-16 bg-purple-500/10 text-purple-600">
                  <CreditCard className="size-7" />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold px-0 mt-0.5 shrink-0 transition-colors -translate-x-2">
                  <span className="size-1.5 rounded-full bg-on-surface-variant/30" />
                  <span className="text-[11px] uppercase tracking-wider text-on-surface-variant/50">
                    Offline
                  </span>
                </div>
              </div>

              <div className="mb-6 relative z-10 flex-1">
                <Heading level={3} className="text-on-surface tracking-tight mb-2 font-black truncate leading-tight">stripe</Heading>
                <Text size="body-small" className="text-on-surface-variant font-medium leading-relaxed line-clamp-2">
                  Proactive telemetry ingress for financial dispute and risk intervention.
                </Text>
              </div>

              {/* Footer Metrics & Actions */}
              <div className="pt-6 border-t border-outline/10 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Users size={16} />
                  <div className="flex flex-col">
                    <Text size="body-small" weight="bold" className="leading-tight">0 DAU</Text>
                  </div>
                </div>

                <button
                  onClick={() => setActiveConfig("Stripe")}
                  className="flex items-center gap-2 group/btn px-4 py-2 rounded-xl hover:bg-outline/5 transition-colors border border-transparent hover:border-outline/10 shadow-sm hover:shadow-inner"
                >
                  <Settings size={14} className="group-hover/btn:rotate-90 transition-transform duration-500 text-on-surface-variant" />
                  <Text size="body-tiny" weight="bold" className="text-on-surface-variant uppercase tracking-widest text-[10px]">Config</Text>
                </button>
              </div>
            </div>

            {/* Add Gateway Card */}
            <div
              onClick={() => toast.info("Provisioning new gateway via MCP...")}
              className="border-2 border-dashed border-outline/10 rounded-[32px] flex flex-col items-center justify-center gap-6 p-10 group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all min-h-[300px]"
            >
              <div className="size-16 rounded-3xl bg-outline/5 flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Plus size={32} />
              </div>
              <Text size="label-small" weight="bold" className="text-on-surface-variant font-black uppercase tracking-widest text-[11px] group-hover:text-primary transition-colors">Add Gateway</Text>
            </div>

            </section>
          </div>
        </main>
      </div>

      {/* Basic Mock Config Modal to match Channels parity */}
      <AnimatePresence>
        {activeConfig && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-layer-base border border-outline/20 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[24px] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 border-b border-outline/10 bg-layer-cover flex flex-col gap-6 relative">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl size-20 flex items-center justify-center shrink-0 border border-purple-500/20 bg-purple-500/10 text-purple-600">
                                <CreditCard className="size-10" />
                            </div>
                            <div className="space-y-1">
                                <Heading level={2} className="text-on-surface tracking-tight font-black">stripe webhooks</Heading>
                                <Text size="body-small" className="text-on-surface-variant font-medium max-w-md leading-relaxed">
                                    Financial telemetry integration mapped via HMAC signature verification. Connection is secured but inactive.
                                </Text>
                            </div>
                        </div>

                        <button onClick={() => setActiveConfig(null)} title="Close Configuration" className="absolute top-8 right-8 p-2 rounded-xl hover:bg-outline/10 transition-colors">
                            <X className="size-6 text-on-surface-variant" />
                        </button>
                    </div>

                    <div className="p-8 flex flex-col gap-6 bg-layer-base overflow-y-auto">
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-state-warning/20 bg-state-warning/5 text-state-warning">
                            <Lock className="size-5 shrink-0" />
                            <Text size="body-small">
                                Gateway HMAC required. Set <code className="bg-black/20 text-state-warning px-1.5 py-0.5 rounded font-mono mx-1">STRIPE_WEBHOOK_SECRET</code> in the gateway vault to securely process payloads.
                            </Text>
                        </div>
                        
                        <div className="flex gap-4">
                            <Button 
                                variant="ghost" 
                                onClick={() => setActiveConfig(null)}
                                className="flex-1 rounded-xl font-bold tracking-wide text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                Disconnect
                            </Button>
                            <Button 
                                variant="primary" 
                                className="flex-1 rounded-xl font-bold tracking-wide bg-purple-600 hover:bg-purple-700 text-white" 
                                onClick={() => {
                                    toast.error("Stripe is locked via BLAST phase 2 protocol. Please unlock in gateway/ingress_webhooks.ts");
                                    setActiveConfig(null);
                                }}
                            >
                                Activate Node
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
