"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GitMerge } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { MermaidBox } from '../../../../../components/ui/MermaidBox';

export default function TopologyForensicsPage() {
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

    if (!data) return <div className="flex items-center justify-center p-24 text-on-surface font-mono text-transform-tertiary animate-pulse">Scanning System Topology...</div>;

    const chart = `
    graph TD
        subgraph Front-End Client
            Client[User Device]
        end
        
        subgraph "ZAP Design Engine"
            Arbiter[Arbitration Layer]
            MissionControl[Mission Control Telemetry]
        end
        
        subgraph "Gateway Matrix"
            Router{Omni-Router}
            Ultra[Ultra Pool<br/>(${data.ultraKeys} Keys)]
            Pro[Pro Pool<br/>(${data.proKeys} Keys)]
            Dead[Dead Keys<br/>(${data.deadKeys} Quarantined)]
        end
        
        subgraph "ZAP Swarm Fleet"
            Jerry[Jerry<br/>(Watchdog Token Sync)]
            Spike[Spike<br/>(Structural Engine)]
            Athena[Athena<br/>(Research & Web)]
            Ralph[Ralph<br/>(Stitch MCP Scraper)]
        end
        
        subgraph "Cloud Infrastructure"
            Redis[(Redis State<br/>Blocks: ${data.blockedProjects.length})]
            Postgres[(Cloud SQL<br/>Core Database)]
        end
        
        Client --> Arbiter
        Arbiter --> MissionControl
        Arbiter --> Router
        
        Router -->|1. Priority Fill| Ultra
        Router -->|2. Fallback Fill| Pro
        Router -.->|403/400 Ban| Dead
        
        Ultra --> Jerry
        Ultra --> Spike
        Pro --> Athena
        Pro --> Ralph
        
        Router <--> Redis
        Arbiter <--> Postgres
        Jerry <--> Postgres
        Spike <--> Postgres
        
        classDef default fill:#1a1a1a,stroke:#333,stroke-width:2px,color:#fff;
        classDef pool fill:#101124,stroke:#3b5bdb,stroke-width:2px,color:#fff;
        classDef dead fill:#321010,stroke:#e03131,stroke-width:2px,color:#fff;
        classDef swarm fill:#102210,stroke:#2b8a3e,stroke-width:2px,color:#fff;
        classDef db fill:#241f10,stroke:#e67700,stroke-width:2px,color:#fff;
        
        class Ultra,Pro pool;
        class Dead dead;
        class Jerry,Spike,Athena,Ralph swarm;
        class Redis,Postgres db;
    `;

    return (
        <div className="flex h-full flex-col bg-layer-base text-on-surface pb-24 selection:bg-primary/20 cursor-default">
            {/* Header */}
            <header className="flex-none border-b border-outline/10 bg-layer-base sticky top-0 z-10">
                <div className="flex items-center justify-between px-8 py-5">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-on-surface flex items-center gap-2">
                                <GitMerge className="h-6 w-6 text-primary" />
                                Topology Viewer
                            </h1>
 <p className="text-xs font-mono text-transform-tertiary text-primary/80 mt-1 tracking-wider font-bold">Live System Flow</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 flex justify-center py-12">
                <div className="w-full max-w-5xl bg-surface-container-low border border-outline/10 rounded-2xl p-8">
                   <MermaidBox chart={chart} />
                </div>
            </main>
        </div>
    );
}
