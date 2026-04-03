"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgentForensicsPage() {
    const params = useParams();
    const router = useRouter();
    const agentName = (params?.name as string) || 'unknown';
    
    // In a real implementation this would fetch from a database or live metrics socket.
    // For now we simulate an agent's deep forensics data.
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const timestamp = new Date().toISOString();
            setLogs(prev => [
                `[${timestamp}] [INFO] Handshake verified with Omni-Router`,
                `[${timestamp}] [O/P] Process memory footprint: 124MB`,
                ...prev.slice(0, 19)
            ]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 capitalize">
                                <Monitor className="h-6 w-6 text-primary" />
                                {agentName} Agent
                            </h1>
 <p className="text-xs font-mono text-transform-tertiary text-primary/80 mt-1 tracking-wider">Deep Forensics Level 2</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* System Readouts */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Process State</h3>
                        <div className="text-xl font-mono text-transform-tertiary text-green-400 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            RUNNING
                        </div>
                    </div>
                    
                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Memory Utilization</h3>
                        <div className="text-xl font-mono text-transform-tertiary text-on-surface">124 MB</div>
                    </div>

                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Active Connects</h3>
                        <div className="text-xl font-mono text-transform-tertiary text-on-surface">3</div>
                    </div>
                    
                    <div className="p-6 bg-surface-variant/30 border border-outline/10 rounded-xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Task Volume</h3>
                        <div className="text-xl font-mono text-transform-tertiary text-on-surface">1,024 OK</div>
                    </div>
                </div>

                {/* Live Console Output */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-on-surface-variant" />
                        Live STDOUT Stream
                    </h2>
                    
                    <div className="p-6 border border-white/5 bg-black/50 rounded-xl text-left h-96 overflow-y-auto font-mono text-transform-tertiary text-xs text-green-400 space-y-2 relative">
                        {/* Fake scanline effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                        
                        {logs.length === 0 && <span className="animate-pulse opacity-50">Listening on port...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100">{log}</div>
                        ))}
                    </div>
                </section>
                
            </main>
        </div>
    );
}
