"use client";

export const dynamic = 'force-dynamic';


import * as React from "react";
import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { MessageSquare, Users, Settings, Filter, X, Plus, Trash2, RefreshCw, Globe, Send, Hash, MessageCircle, CreditCard, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "zap-design/src/lib/utils";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { toast } from "sonner";
import { LiveBlinker } from "zap-design/src/genesis/atoms/indicators/LiveBlinker";
import { Switch } from "zap-design/src/genesis/atoms/interactive/switch";

interface ChannelData {
  name: string;
  status: string;
  users: number;
  ping: string;
  config?: any;
}

function getChannelMeta(name: string) {
  const n = name.toLowerCase();

  if (n.includes('slack')) {
    return {
      icon: Hash,
      imageUrl: "/logos/slack.png?v=4",
      desc: "Native Slack bridge for swarm messaging and automated channel notifications.",
      brand: "bg-layer-elevated text-[#E01E5A] border-[#E01E5A]/20"
    };
  }

  if (n.includes('discord')) {
    return {
      icon: MessageSquare,
      imageUrl: "/logos/discord.png?v=4",
      desc: "Discord webhooks and bot integration for community moderation and fleet logs.",
      brand: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
    };
  }

  if (n.includes('telegram')) {
    return {
      icon: Send,
      imageUrl: "/logos/telegram.png?v=4",
      desc: "MTProto and Bot API integration for encrypted swarm communication.",
      brand: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    };
  }

  if (n.includes('whatsapp')) {
    return {
      icon: MessageCircle,
      imageUrl: "/logos/whatsapp.png?v=4",
      desc: "WhatsApp Business API bridge for high-priority customer notifications.",
      brand: "bg-green-500/10 text-green-600 border-green-500/20"
    };
  }


  if (n.includes('line')) {
    return {
      icon: MessageSquare,
      imageUrl: "/logos/line.png?v=4",
      desc: "LINE Messaging API integration for SEA and Japan market connectivity.",
      brand: "bg-green-500/10 text-green-600 border-green-500/20"
    };
  }

  if (n.includes('zalo')) {
    return {
      icon: Globe,
      imageUrl: "/logos/zalo.png?v=4",
      desc: "Zalo OA and Messenger bridge for Vietnam localization.",
      brand: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    };
  }

  if (n.includes('imessage')) {
    return {
      icon: MessageSquare,
      imageUrl: "/logos/imessage.png?v=4",
      desc: "Apple iMessage gateway for direct mobile fleet synchronization.",
      brand: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    };
  }

  return {
    icon: MessageSquare,
    desc: "Generic message-bus channel linked to the swarm distribution router.",
    brand: "bg-outline/5 text-on-surface-variant border-outline/10"
  };
}

function ChannelConfigModal({
  channel,
  onSave,
  onDelete,
  onCancel,
  isSaving
}: {
  channel: ChannelData;
  onSave: (config: any) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [val, setVal] = useState(JSON.stringify(channel.config || { name: channel.name, webhook: "", apiKey: "" }, null, 2));
  const [isPurging, setIsPurging] = useState(false);
  const meta = getChannelMeta(channel.name);
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-layer-base border border-outline/20 w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-outline/10 bg-layer-cover flex flex-col gap-6 relative">
          <div className="flex items-center gap-4">
            <div className={cn("rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-outline/10", meta.imageUrl ? "size-24 bg-white" : cn("size-24", meta.brand))}>
              {meta.imageUrl ? (
                <img src={meta.imageUrl} alt={channel.name} className="size-full object-contain p-0" />
              ) : (
                <Icon className="size-12" />
              )}
            </div>
            <div className="space-y-1">
              <Heading level={2} className="text-on-surface tracking-tight font-black">{channel.name}</Heading>
              <Text size="body-small" className="text-on-surface-variant font-medium max-w-xl leading-relaxed">
                {meta.desc}
              </Text>
            </div>
          </div>

          <button onClick={onCancel} title="Close Configuration" className="absolute top-8 right-8 p-2 rounded-xl hover:bg-outline/10 transition-colors">
            <X className="size-6 text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 flex flex-col bg-layer-base overflow-hidden min-h-0">
          <div className="px-8 py-3 bg-layer-base/50 border-b border-outline/5">
            <Text size="label-small" className="text-on-surface-variant font-mono uppercase tracking-widest font-black">
              JSON Connectivity Mapping
            </Text>
          </div>
          <div className="flex-1 relative pb-8 h-full min-h-[400px]">
            <textarea
              autoFocus
              title="Channel configuration map"
              className="absolute inset-0 w-full h-full p-8 bg-transparent text-on-surface font-mono text-sm leading-relaxed resize-none focus:outline-none"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="px-8 py-6 border-t border-outline/10 bg-layer-cover flex justify-between items-center gap-4">
          <Button variant="ghost" className="text-destructive font-bold" onClick={() => setIsPurging(true)}>
            Purge Channel
          </Button>
          <Button variant="primary" className="px-10 font-bold" disabled={isSaving} onClick={() => {
            try {
              const parsed = JSON.parse(val);
              onSave({ ...parsed });
            } catch (e) {
              toast.error("Invalid JSON configuration.");
            }
          }}>
            {isSaving ? "Saving..." : "Apply Changes"}
          </Button>
        </div>

        {isPurging && (
          <div className="absolute inset-0 z-[10001] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8">
            <div className="bg-layer-base border border-destructive/20 rounded-[32px] p-12 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-destructive/10 text-destructive rounded-full">
                <Trash2 size={48} />
              </div>
              <div className="space-y-2">
                <Heading level={3} className="text-on-surface font-black">PURGE CHANNEL</Heading>
                <Text className="text-on-surface-variant leading-relaxed">
                  This will permanently disconnect the <span className="font-bold text-on-surface">{channel.name}</span> bridge from the swarm fleet.
                </Text>
              </div>
              <div className="flex flex-col gap-3 w-full pt-4">
                <Button variant="outline" className="w-full font-bold h-12" onClick={() => setIsPurging(false)}>Cancel</Button>
                <Button variant="destructive" className="w-full font-bold h-12" onClick={() => onDelete(channel.name)}>Yes, Purge</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChannelsDashboard() {
  const [editingChannel, setEditingChannel] = useState<ChannelData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useQuery<{ success: boolean; channels: ChannelData[] }>({
    queryKey: ['swarm-channels'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/channels');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const handleSave = async (config: any) => {
    setIsSaving(true);
    try {
      // Mock API call - in production this would be real
      await new Promise(r => setTimeout(r, 800));
      toast.success("Channel configuration synchronized.");
      setEditingChannel(null);
      refetch();
    } catch (e) {
      toast.error("Failed to sync channel.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (name: string) => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 800));
      toast.success(`${name} purged from registry.`);
      setEditingChannel(null);
      refetch();
    } catch (e) {
      toast.error("Operation failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <AppShell>
      <div className="p-12 animate-pulse space-y-8 bg-layer-base h-screen">
        <div className="h-20 w-1/3 bg-outline/5 rounded-2xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-outline/5 rounded-3xl" />)}
        </div>
      </div>
    </AppShell>
  );

  if (error) return (
    <AppShell>
      <div className="p-20 text-center space-y-4 flex flex-col items-center justify-center bg-layer-base h-screen">
        <X className="size-20 text-destructive opacity-20" />
        <Heading level={2} className="text-on-surface font-black">REGISTRY OFFLINE</Heading>
        <Text className="text-on-surface-variant max-w-md">Failed to connect to SYS_CHANNELS telemetry cluster. Verify gateway availability.</Text>
      </div>
    </AppShell>
  );

  const channels = data?.channels || [];
  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="Zap Swarm / Distribution Matrix"
          title="Communication Channels"
          badge={`${channels.filter(c => c.status === 'active').length} connected`}
          liveIndicator={true}
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          <div className="w-full space-y-6">

            <div className="mb-2">
               <Heading level={3} className="text-on-surface mb-1 tracking-tight">Communication</Heading>
               <Text size="body-small" className="text-on-surface-variant font-medium">
                 Manage real-time message broadcasting and gateway telemetry for external messaging platforms.
               </Text>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
              <div className="w-full sm:w-auto flex-1 max-w-sm relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50" />
                <input 
                  type="text"
                  title="Search channels"
                  aria-label="Search channels"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-layer-base border border-outline/15 text-sm rounded-[var(--input-radius,8px)] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-outline/30 focus:bg-layer-base shadow-sm transition-colors"
                />
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                  <span className="text-on-surface-variant/70 tracking-wide whitespace-nowrap">{filteredChannels.length} channels</span>
                  <span className="w-1 h-1 rounded-full bg-outline/20 shrink-0"></span>
                  <span className="text-state-success/90 flex items-center gap-1.5 tracking-wide whitespace-nowrap">
                    <LiveBlinker iconOnly color="green" />
                    {channels.filter(c => c.status === 'active').length} connected
                  </span>
                </div>

                <Button 
                  variant="ghost" 
                  title="Refresh Channel Status"
                  className="p-2 h-9 w-9 border border-outline/15 rounded-lg bg-layer-base hover:bg-outline/5 transition-all active:scale-95"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="size-4 text-on-surface-variant" />
                </Button>
              </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
              {filteredChannels.map((c) => {
            const meta = getChannelMeta(c.name);
            const Icon = meta.icon;

            return (
              <div key={c.name} className="bg-layer-cover border border-outline/10 shadow-sm rounded-[32px] p-6 flex flex-col group hover:shadow-2xl transition-all relative overflow-hidden h-full">
                {/* Visual Accent */}
                <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-all group-hover:scale-125 group-hover:opacity-[0.08]", meta.brand.split(' ')[1])}>
                  <Icon className="size-full" />
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={cn("rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 border border-outline/5 overflow-hidden", meta.imageUrl ? "size-16 bg-white" : cn("size-16", meta.brand))}>
                    {meta.imageUrl ? (
                      <img src={meta.imageUrl} alt={c.name} className="size-full object-contain p-0" />
                    ) : (
                      <Icon className="size-7" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold px-0 mt-0.5 shrink-0 transition-colors -translate-x-2">
                    {c.status === 'active' ? (
                      <LiveBlinker color="green" iconOnly />
                    ) : (
                      <span className="size-1.5 rounded-full bg-on-surface-variant/30" />
                    )}
                    <span className={cn(
                      "text-[11px] uppercase tracking-wider",
                      c.status === 'active' ? "text-state-success/90" : "text-on-surface-variant/50"
                    )}>
                      {c.status === "active" ? "Connected" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="mb-6 relative z-10 flex-1">
                  <Heading level={3} className="text-on-surface tracking-tight mb-2 font-black truncate leading-tight">{c.name}</Heading>
                  <Text size="body-small" className="text-on-surface-variant font-medium leading-relaxed line-clamp-2">
                    {meta.desc}
                  </Text>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-6 border-t border-outline/10 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <div className="flex items-center gap-1.5" title="Daily Active Users">
                      <Users size={16} />
                      <Text size="body-small" weight="bold" className="leading-tight">{c.users} DAU</Text>
                    </div>

                  </div>

                  <button
                    onClick={() => setEditingChannel(c)}
                    className="flex items-center gap-2 group/btn px-4 py-2 rounded-xl hover:bg-outline/5 transition-colors border border-transparent hover:border-outline/10 shadow-sm hover:shadow-inner"
                  >
                    <Settings size={14} className="group-hover/btn:rotate-90 transition-transform duration-500 text-on-surface-variant" />
                    <Text size="body-tiny" weight="bold" className="text-on-surface-variant uppercase tracking-widest text-[10px]">Config</Text>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Channel Card */}
          <button 
            onClick={() => toast.info("Provisioning new channel via MCP...")}
            title="Add New Channel"
            className="group bg-transparent p-6 rounded-[var(--card-radius,16px)] border-2 border-dashed border-outline/15 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[190px] gap-3 relative overflow-hidden h-full"
          >
            <div className="p-3 rounded-xl bg-outline/5 border border-outline/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all group-hover:scale-110">
              <Plus className="size-6 text-on-surface-variant group-hover:text-primary" />
            </div>
            <Text size="label-small" className="text-on-surface-variant/50 group-hover:text-primary font-bold tracking-widest uppercase">Add Channel</Text>
            
            {/* Subtle grid pattern background for the empty shell */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle,_currentColor_1px,_transparent_1px)] bg-[length:16px_16px]" />
          </button>
        </section>
        </div>
        </main>
      </div>

      {editingChannel && (
        <ChannelConfigModal
          channel={editingChannel}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => setEditingChannel(null)}
          isSaving={isSaving}
        />
      )}
    </AppShell>
  );
}
