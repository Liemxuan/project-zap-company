"use client";

import React from "react";
import { ThemeHeader } from "../layout/ThemeHeader";

export interface CanvasPayload {
    type: "chart" | "skills" | "config" | "data";
    data: unknown;
}

export interface EphemeralCanvasCardProps {
    sessionTitle?: string;
    description?: string;
    payload: CanvasPayload;
    expiresAt?: string | Date;
    onExpireClick?: () => void;
}

export const EphemeralCanvasCard: React.FC<EphemeralCanvasCardProps> = ({
    sessionTitle = "Secure Ephemeral Canvas",
    description = "This session is temporary and will automatically expire locally.",
    payload,
    expiresAt,
    onExpireClick
}) => {
    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto rounded-[32px] border border-outline/10 bg-layer-cover shadow-sm hover:shadow-lg transition-all overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ThemeHeader 
                title={sessionTitle}
                breadcrumb={description}
            />
            
            <div className="p-6 md:p-10 flex flex-col gap-6 bg-transparent">
                {payload.type === "chart" && (
                    <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline/10 rounded-[24px] bg-outline/5">
                        <span className="text-4xl material-symbols-rounded text-primary/50 mb-4">monitoring</span>
                        <h3 className="text-xl font-bold text-on-surface tracking-tight">Chart Visualization Data</h3>
                        <p className="text-on-surface-variant font-medium text-center mt-2 max-w-md">
                            Chart rendering mounted from Swarm payload: 
                            <span className="block mt-3 font-mono text-transform-tertiary text-xs opacity-70 bg-layer-base p-2 rounded-lg border border-outline/5">
                                {JSON.stringify(payload.data).slice(0, 100)}...
                            </span>
                        </p>
                    </div>
                )}
                
                {payload.type === "skills" && (
                    <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline/10 rounded-[24px] bg-outline/5">
                        <span className="text-4xl material-symbols-rounded text-primary/50 mb-4">extension</span>
                        <h3 className="text-xl font-bold text-on-surface tracking-tight">Skill Configuration</h3>
                        <p className="text-on-surface-variant font-medium text-center mt-2 max-w-md mb-4">
                            Toggle MCP Skills authorized directly via messaging chat.
                        </p>
                        <pre className="p-4 rounded-xl bg-gray-900 border border-outline/20 text-[#34d399] text-xs text-left w-full overflow-x-auto shadow-inner">
                            {JSON.stringify(payload.data, null, 2)}
                        </pre>
                    </div>
                )}

                {payload.type !== "chart" && payload.type !== "skills" && (
                    <div className="w-full flex flex-col gap-2">
                        <h4 className="font-bold text-[11px] text-on-surface-variant uppercase tracking-widest pl-1">Raw Payload Data</h4>
                        <pre className="p-4 rounded-xl bg-gray-900 border border-outline/20 text-blue-400 text-xs w-full overflow-x-auto shadow-inner">
                            {JSON.stringify(payload.data, null, 2)}
                        </pre>
                    </div>
                )}

                {expiresAt && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-outline/10">
                        <span className="material-symbols-rounded text-sm text-state-warning">timer</span>
                        <span className="text-xs font-bold text-state-warning uppercase tracking-wider">
                            Strict TTL Expiry: {new Date(expiresAt).toLocaleTimeString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
