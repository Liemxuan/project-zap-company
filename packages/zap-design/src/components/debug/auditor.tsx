"use client";

import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../components/ThemeContext';
import { AppShell } from '../../zap/layout/AppShell';
import { Inspector } from '../../zap/layout/Inspector';
import { ContainerDevWrapper } from '../../components/dev/ContainerDevWrapper';

export interface DebugAuditorProps {
    children: React.ReactNode;
    componentName: string;
    tier: string;
    status: 'Verified' | 'In Progress' | 'Beta' | 'Legacy' | 'Refactor Required';
    filePath: string;
    importPath: string;
    inspector?: React.ReactNode;
    className?: string;
}

/**
 * SOP-021 Required Auditor Wrapper
 * Centralizes technical metadata and theme parity validation for all debug pages.
 */
export const DebugAuditor: React.FC<DebugAuditorProps> = ({
    children,
    componentName,
    tier,
    status,
    filePath,
    importPath,
    inspector,
    className
}) => {
    const { devMode } = useTheme();

    const identity = {
        displayName: componentName,
        type: tier,
        status: status,
        filePath: filePath,
        importPath: importPath,
        architecture: "GENESIS / M3"
    };

    return (
        <AppShell
            inspector={
                inspector || (
                    <Inspector title={componentName} width={340}>
                        <div className="p-4 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Status</p>
                                <div className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                    status === 'Verified' ? "bg-green-500/10 text-green-500" :
                                    status === 'Beta' || status === 'In Progress' ? "bg-amber-500/10 text-amber-500" :
                                    "bg-red-500/10 text-red-500"
                                )}>
                                    {status}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Tier</p>
                                <p className="text-xs font-mono text-transform-tertiary font-medium">{tier}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Import</p>
                                <code className="text-[10px] block p-2 bg-muted rounded border border-border/50 font-mono text-transform-tertiary">
                                    import &#123; {componentName} &#125; from &apos;{importPath}&apos;;
                                </code>
                            </div>
                        </div>
                    </Inspector>
                )
            }
        >
            <div className={cn("relative flex-1 flex flex-col min-h-full", className)}>
                <ContainerDevWrapper
                    identity={identity}
                    showClassNames={devMode}
                    className="flex-1 w-full flex flex-col"
                >
                    {children}
                </ContainerDevWrapper>
            </div>
        </AppShell>
    );
};
