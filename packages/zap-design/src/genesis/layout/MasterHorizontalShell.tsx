'use client';

import React from 'react';
import { HorizontalNav } from './HorizontalNav';
import { Breadcrumbs } from '../molecules/navigation/Breadcrumbs';
import { Inspector } from './Inspector';

interface MasterHorizontalShellProps {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string; active?: boolean }[];
    inspectorTitle?: string;
    inspectorContent?: React.ReactNode;
    showInspector?: boolean;
}

export const MasterHorizontalShell = ({
    children,
    breadcrumbs = [
        { label: 'My Sites' },
        { label: 'ZAP.vn' },
        { label: 'Dashboard', active: true }
    ],
    inspectorTitle,
    inspectorContent,
    showInspector = false
}: MasterHorizontalShellProps) => {
    const [inspectorWidth, setInspectorWidth] = React.useState(280);
    const [isInspectorCollapsed, setIsInspectorCollapsed] = React.useState(false);

    const handleResize = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = inspectorWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            window.requestAnimationFrame(() => {
                const delta = moveEvent.clientX - startX;
                const newWidth = startWidth - delta;

                if (newWidth < 100) {
                    setIsInspectorCollapsed(true);
                    setInspectorWidth(0);
                } else {
                    setIsInspectorCollapsed(false);
                    setInspectorWidth(Math.min(Math.max(newWidth, 200), 500));
                }
            });
        };

        const onMouseUp = () => {
            document.body.style.cursor = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="h-screen flex flex-col bg-layer-canvas text-theme-base antialiased overflow-hidden select-none">
            {/* 1. Full-Width Header */}
            <HorizontalNav />

            {/* 2. Full-Width Breadcrumbs Bar */}
            <div className="h-8 bg-layer-panel border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex items-center px-6 shrink-0 z-40">
                <Breadcrumbs items={breadcrumbs} showDevWrapper={false} />
            </div>

            {/* 3. Main Workspace Area */}
            <main className="flex-1 flex overflow-hidden bg-layer-canvas relative">
                {/* Center Content Section */}
                <section className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>

                    {/* Floating AI Command Bar */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none">
                        <div className="pointer-events-auto bg-layer-panel p-1.5 flex items-center gap-2 border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] shadow-dialog rounded-card">
                            <div className="w-8 h-8 bg-[var(--color-brand-primary)] border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex items-center justify-center shrink-0 rounded-[calc(var(--card-radius)/2)] text-theme-inverted">
                                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            </div>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-theme-base placeholder:text-theme-base/50 w-full text-sm font-bold font-display text-transform-primary py-1"
                                placeholder="Ask ZAP AI to manage your site..."
                                type="text"
                            />
                            <button className="p-1.5 bg-theme-base text-theme-inverted border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] hover:bg-theme-base/80 transition-colors shadow-btn hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none rounded-btn">
                                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Resize Divider Decoration (Right) */}
                <div
                    onMouseDown={handleResize}
                    className="w-3 bg-layer-panel border-x-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex flex-col items-center justify-center cursor-col-resize hover:bg-layer-cover z-30 group transition-colors h-full shrink-0"
                >
                    <div className="h-8 w-1 bg-theme-base/30 border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] group-hover:h-12 transition-all shadow-sm rounded-full"></div>
                </div>

                {/* Optional Inspector - Now nested inside workspace */}
                <Inspector title={inspectorTitle} isOpen={showInspector && !isInspectorCollapsed} width={inspectorWidth}>
                    {inspectorContent}
                </Inspector>
            </main>
        </div>
    );
};
