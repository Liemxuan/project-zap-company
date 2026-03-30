"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

export default function AgentFactory() {
  const router = useRouter();
  const [agentId, setAgentId] = useState("");
  const [taskPayload, setTaskPayload] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoadingIdentity, setIsLoadingIdentity] = useState(false);

  const handleSlugBlur = async () => {
    if (!agentId) return;
    setIsLoadingIdentity(true);
    try {
      const res = await fetch(`/api/swarm/agent/identity?slug=${agentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.payload) {
          setTaskPayload(data.payload);
        }
      }
    } catch(e) {
      console.error("Failed to load identity");
    } finally {
      setIsLoadingIdentity(false);
    }
  };

  const handleDeploy = async () => {
    if (!agentId || !taskPayload) return;
    setIsDeploying(true);
    try {
      await fetch("/api/swarm/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, taskPayload, tenantId: "ZVN" })
      });
      // Redirect to the active trace
      router.push(`/chats/${agentId}`);
    } catch (err) {
      console.error("Failed to deploy");
      setIsDeploying(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 px-8 py-8 items-center w-full">
      <motion.div 
         initial={{opacity: 0, scale: 0.98, y: 10}}
         animate={{opacity: 1, scale: 1, y: 0}}
         transition={{duration: 0.4}}
         className="max-w-3xl w-full flex flex-col gap-6"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <Link href="/agents" className="group inline-flex items-center gap-2 w-min whitespace-nowrap mb-2 hover:text-on-surface transition-colors py-1">
            <ArrowLeft className="size-4 text-on-surface-variant group-hover:-translate-x-1 transition-transform" />
            <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant group-hover:text-on-surface">
              Back to Roster
            </Text>
          </Link>
          <Heading level={1} className="text-on-surface tracking-tight">Deploy Subagent</Heading>
          <Text size="body-medium" className="text-on-surface-variant mt-1">Configure parameters and constraints before deploying a new swarm node into the environment.</Text>
        </div>

        {/* L3 FORM CONTAINER */}
        <div className="bg-layer-2/80 backdrop-blur-xl border border-outline/5 p-8 flex flex-col gap-8 rounded-[var(--layer-2-border-radius,20px)] shadow-xl mt-4">
          <div className="flex flex-col gap-2.5">
            <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">Agent Identity (Slug)</Text>
            <div className="relative group">
               <input 
                 type="text" 
                 value={agentId}
                 onChange={(e) => setAgentId(e.target.value)}
                 onBlur={handleSlugBlur}
                 placeholder="e.g. spike"
                 className="w-full bg-layer-1/50 border border-outline/10 px-4 py-3 text-[length:var(--type-body-small-desktop,14px)] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all rounded-[var(--input-border-radius,10px)]"
               />
               <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-b" />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">System Prompt Directive</Text>
              {isLoadingIdentity && <Loader2 className="size-3 animate-spin text-primary" />}
            </div>
            <div className="relative group">
               <textarea 
                 rows={12}
                 value={taskPayload}
                 onChange={(e) => setTaskPayload(e.target.value)}
                 placeholder="You are an expert React engineer..." 
                 className="w-full bg-layer-1/50 border border-outline/10 px-4 py-3 text-[length:var(--type-body-small-desktop,14px)] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none rounded-[var(--input-border-radius,10px)] font-mono text-sm leading-relaxed"
               />
               <div className="absolute inset-x-0 bottom-1 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-b pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2.5 flex-1">
              <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">LLM Provider</Text>
              <select 
                 className="w-full bg-layer-1/50 border border-outline/10 px-4 py-3 text-[length:var(--type-body-small-desktop,14px)] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all rounded-[var(--input-border-radius,10px)] appearance-none select-custom-arrow"
                 title="LLM Provider"
              >
                <option>Anthropic (Claude 3.7)</option>
                <option>Google (Gemini 2.5 Pro)</option>
                <option>OpenAI (GPT-4o)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">Memory Sandbox Limit</Text>
              <select 
                 className="w-full bg-layer-1/50 border border-outline/10 px-4 py-3 text-[length:var(--type-body-small-desktop,14px)] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all rounded-[var(--input-border-radius,10px)] appearance-none select-custom-arrow"
                 title="Memory Sandbox Limit"
              >
                <option>Ephemeral (Phase 7)</option>
                <option>Persistent (Shared)</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-4 mt-6 pt-8 border-t border-outline/10">
             <Link href="/agents" className="px-5 py-2.5 border border-transparent hover:bg-layer-3 transition-colors rounded-[var(--button-border-radius,10px)]">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant hover:text-on-surface">
                   Cancel
                </Text>
             </Link>
             <button 
               onClick={handleDeploy}
               disabled={isDeploying || !agentId || !taskPayload}
               className="group relative overflow-hidden bg-primary px-6 py-2.5 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale rounded-[var(--button-border-radius,10px)] shadow-md hover:shadow-lg hover:-translate-y-0.5" 
             >
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                {isDeploying ? <Loader2 className="size-4 animate-spin text-on-primary" /> : <Sparkles className="size-4 text-on-primary" />}
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-primary">
                   Deploy Swarm Node
                </Text>
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
