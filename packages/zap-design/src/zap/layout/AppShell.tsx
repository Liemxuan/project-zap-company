'use client';

import React from 'react';
import { useTheme } from '../../components/ThemeContext';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { SideNav } from '../../genesis/molecules/navigation/SideNav';

interface AppShellProps {
    children: React.ReactNode;
    inspector?: React.ReactNode;
}

export const AppShell = ({ children, inspector }: AppShellProps) => {
    const { sidebarState, setSidebarState, inspectorState, setInspectorState } = useTheme();
    const isSidebarCollapsed = sidebarState === 'collapsed';
    const isInspectorCollapsed = inspectorState === 'collapsed';

    return (
        <div className="flex h-screen w-full bg-layer-base overflow-hidden relative">
            {/* Collapsed Sidebar Trigger */}
            {isSidebarCollapsed && (
                <button
                    onClick={() => setSidebarState('expanded')}
                    title="Expand Sidebar"
                    className="absolute left-4 top-3.5 z-[200] w-5 h-5 bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-outline rounded-[var(--button-border-radius,8px)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                >
                    <div className="flex items-center justify-center translate-x-[0.5px]">
                        <Icon name="chevron_right" size={14} weight={700} />
                    </div>
                </button>
            )}

            {/* Global Left Navigation */}
            <SideNav showDevWrapper={true} />

            {/* Center Area (Main Content Box) */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <main className="flex-1 flex flex-col overflow-y-auto relative bg-transparent">
                    {children}
                </main>
            </div>

            {/* Inspector collapsed — show expand button with right padding */}
            {inspector && isInspectorCollapsed && (
                <button
                    onClick={() => setInspectorState('expanded')}
                    title="Expand Inspector"
                    className="absolute right-4 top-3.5 z-[60] w-5 h-5 bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-outline rounded-[var(--button-border-radius,8px)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                >
                    <Icon name="chevron_left" size={14} weight={700} />
                </button>
            )}

            {/* Right Area (Full-Height Inspector) */}
            {inspector && !isInspectorCollapsed && (
                <div className="relative h-full shrink-0 z-20" data-region="inspector">
                    {inspector}
                </div>
            )}
        </div>
    );
};
