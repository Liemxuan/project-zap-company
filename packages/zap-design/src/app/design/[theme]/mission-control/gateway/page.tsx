"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Key, ShieldAlert, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GatewayForensicsPage() {
    const params = useParams();
    const router = useRouter();
    // Fetch Gateway Telemetry Data
    const [data, setData] = useState<{ultraKeys: number; proKeys: number; deadKeys: number; blockedProjects: string[]} | null>(null);

    useEffect(() => {
        const fetchTelemetry = async () => {
            try {
                const res = await fetch('/api/telemetry/keys');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div className="flex items-center justify-center p-24 text-on-surface font-mono animate-pulse">Initializing Gateway Telemetry...</div>;

    return (
        <div className="flex h-full flex-col bg-surface text-on-surface pb-24">
            {/* Header */}
            <header className="flex-none border-b border-white/5 bg-surface/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center justify-between px-8 py-5">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-on-surface-variant hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                <Key className="h-6 w-6 text-purple-400" />
                                Gateway Matrix
                            </h1>
                            <p className="text-xs font-mono text-purple-400/80 mt-1 uppercase tracking-wider">High-Density Telemetry</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent border border-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Ultra Pool Keys</h3>
                        <div className="text-4xl font-black text-rose-400 font-mono">{data.ultraKeys}</div>
                    </div>
                    
                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Pro Pool Keys</h3>
                        <div className="text-4xl font-black text-blue-400 font-mono">{data.proKeys}</div>
                    </div>

                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Dead Keys Detained</h3>
                        <div className="text-4xl font-black text-purple-400 font-mono">{data.deadKeys}</div>
                    </div>
                </div>

                {/* The 429 Grid */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        Active 429 Quarantines
                    </h2>
                    
                    {data.blockedProjects.length === 0 ? (
                        <div className="p-8 border border-white/5 bg-white/[0.01] rounded-xl text-center flex flex-col items-center justify-center">
                            <Activity className="h-8 w-8 text-green-500/50 mb-3" />
                            <p className="font-mono text-green-400/80 uppercase tracking-widest text-sm">Matrix is Clear. No captchas detected.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.blockedProjects.map((proj: string, i: number) => (
                                <div key={i} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
                                    <span className="font-mono text-red-300 text-sm">{proj}</span>
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">Quarantined</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                
                {/* System Metrics */}
                <section className="bg-surface-variant/20 border border-outline/10 rounded-xl p-8">
                     <h2 className="text-lg font-bold text-white mb-6">Omni-Router State</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-sm">
                         <div>
                             <div className="text-on-surface-variant/60 text-xs mb-1 uppercase tracking-wider">Redis Database</div>
                             <div className="text-green-400">Connected</div>
                         </div>
                         <div>
                             <div className="text-on-surface-variant/60 text-xs mb-1 uppercase tracking-wider">Routing Mode</div>
                             <div className="text-primary">Round Robin</div>
                         </div>
                         <div>
                             <div className="text-on-surface-variant/60 text-xs mb-1 uppercase tracking-wider">Quarantine TTL</div>
                             <div className="text-on-surface">60 Seconds</div>
                         </div>
                         <div>
                             <div className="text-on-surface-variant/60 text-xs mb-1 uppercase tracking-wider">Dead Trap Auto-Ban</div>
                             <div className="text-purple-400">Enabled</div>
                         </div>
                     </div>
                </section>
            </main>
        </div>
    );
}
