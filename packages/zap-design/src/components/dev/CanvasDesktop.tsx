import React from 'react';
import { cn } from '../../lib/utils';

export interface CanvasDesktopProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

/**
 * A dev wrapper that simulates a high-fidelity macOS desktop window.
 * Useful for showcasing L6 Layouts in their natural 16:9/full-screen desktop environment
 * without having them bleed into the laboratory sandbox UI.
 */
export const CanvasDesktop = ({ children, title = "ZAP Desktop Engine", className }: CanvasDesktopProps) => {
    return (
        <div className="flex items-center justify-center w-full h-full pb-10">
            <div className={cn(
                "relative flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-[12px] bg-layer-base border border-border w-full max-w-[1440px] h-[780px]",
                className
            )}>
                {/* macOS Mockup Header */}
                <div className="h-[38px] w-full flex items-center px-4 gap-4 shrink-0 border-b border-border bg-layer-panel z-50">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EC6A5E] border border-black/10 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-[#F4BF4F] border border-black/10 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-[#61C554] border border-black/10 shadow-sm" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <span className="text-[10px] font-bold font-display text-on-surface-variant tracking-[0.25em] uppercase opacity-60">
                            {title}
                        </span>
                    </div>
                    <div className="w-[52px]" /> {/* Spacer to balance the traffic lights */}
                </div>
                
                {/* Injection Frame */}
                <div className="flex-1 w-full relative overflow-hidden bg-layer-cover flex flex-col items-stretch">
                    {children}
                </div>
            </div>
        </div>
    );
};
