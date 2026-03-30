'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../components/ThemeContext';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { SideNav } from '../../genesis/molecules/navigation/SideNav';

interface HeaderProps {
    className?: string;
    title?: string;
}

export const Header = ({ className, title }: HeaderProps) => {


    return (
        <header className={cn(
            "h-[var(--sys-header-height,3.5rem)] flex-shrink-0 flex items-center justify-between px-16 bg-slate-50 border-b border-slate-300 z-50 relative overflow-visible",
            className
        )}>
            {/* Overlay: Technical Information (Floating above structure) */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-50">
 <span className="text-[9px] font-dev text-transform-tertiary text-slate-500 tracking-widest bg-slate-100 px-2 py-0.5 rounded shadow-sm border border-slate-200">
                     L4: Global Horizontal Navigation Shell
                 </span>
            </div>

            {/* Left Zone: Global Title / Primary Route Block */}
            <div className="flex items-center gap-4 h-full pt-2">
                <div className="w-56 h-6 border-2 border-dashed border-slate-300 bg-white flex items-center justify-center">
                    {title ? (
 <span className="text-[10px] text-slate-600 font-dev text-transform-tertiary font-bold tracking-widest ">{title}</span>
                    ) : (
 <span className="text-[9px] text-slate-400 font-dev text-transform-tertiary font-bold ">MOLECULE: HORIZONTAL_NAVIGATION</span>
                    )}
                </div>
            </div>

            {/* Middle Zone: Global Search Box (Optional, usually centered) */}
            <div className="flex items-center justify-center flex-1 h-full px-8 pt-2">
                <div className="w-full max-w-md h-8 border-2 border-dashed border-slate-300 bg-white rounded-md flex items-center px-3">
                     <span className="text-[10px] text-slate-400 font-dev text-transform-tertiary font-bold">MOLECULE: GLOBAL_SEARCH_BAR</span>
                </div>
            </div>

            {/* Right Zone: Global Utilities (Profile, Notification, Settings) */}
            <div className="flex items-center gap-3 h-full pt-2">
                 <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 bg-white"></div>
                 <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 bg-white"></div>
                 <div className="w-px h-6 bg-slate-300 mx-1"></div>
                 {/* The floating Inspector toggle button sits to the right of this vertically aligned */}
            </div>
        </header>
    );
};

interface WireframeShellProps {
    children: React.ReactNode;
    inspector?: React.ReactNode;
}

export const WireframeShell = ({ children, inspector }: WireframeShellProps) => {
    const { sidebarState, setSidebarState, inspectorState, setInspectorState } = useTheme();
    const isSidebarCollapsed = sidebarState === 'collapsed';
    const isInspectorCollapsed = inspectorState === 'collapsed';

    return (
        <div 
            className="flex h-screen w-full overflow-hidden relative"
            style={{ '--sys-header-height': '3.5rem' } as React.CSSProperties}
        >
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

            {/* Center Area (Header + Main) */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <Header />
                <main className="flex-1 flex flex-col overflow-y-auto relative bg-surface-container-low">
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
                <div className="relative h-full shrink-0 border-l border-border/50 z-20 bg-surface-container">
                    {/* Toggle straddles the border — half in nav, half in inspector */}
                    <button
                        onClick={() => setInspectorState('collapsed')}
                        title="Collapse Inspector"
                        className="absolute left-0 top-3.5 -translate-x-1/2 z-[60] w-5 h-5 bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-outline rounded-[var(--button-border-radius,8px)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                    >
                        <Icon name="chevron_right" size={14} weight={700} />
                    </button>
                    {inspector}
                </div>
            )}
        </div>
    );
};
