import React from 'react';
import { cn } from '../../../lib/utils';
import { Wrapper } from '../../../components/dev/Wrapper';

export interface CleanShellCoverProps {
    children: React.ReactNode;
    className?: string;
    /** Defines the padding value using Tailwind spacing scale (e.g. '0', '4', '8', '12'). Default is '8'. */
    spacing?: '0' | '4' | '6' | '8' | '10' | '12' | '16' | '24';
    /** Optional header component (like ThemeHeader) to mount permanently at the top of the Cover column */
    header?: React.ReactNode;
}

export function CleanShellCover({ 
    children, 
    className,
    spacing = '8',
    header
}: CleanShellCoverProps) {
    const spacingClass = {
        '0': 'p-0',
        '4': 'p-4',
        '6': 'p-6',
        '8': 'p-8',
        '10': 'p-10',
        '12': 'p-12',
        '16': 'p-16',
        '24': 'p-24'
    }[spacing];

    return (
        <Wrapper identity={{ displayName: "CleanShell Cover", filePath: "genesis/molecules/clean-shell/CleanShellCover.tsx", type: "Section" }}>
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Optional Sticky Header */}
                {header && (
                    <div className="shrink-0 w-full z-20 shadow-sm relative">
                        {header}
                    </div>
                )}
                
                {/* Scrollable Canvas Body */}
                <div className={cn(
                    "flex-1 relative overflow-y-auto bg-layer-cover z-10",
                    spacingClass,
                    className
                )}>
                    <div className="w-full h-full max-w-[1200px] mx-auto flex flex-col">
                         {children}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
