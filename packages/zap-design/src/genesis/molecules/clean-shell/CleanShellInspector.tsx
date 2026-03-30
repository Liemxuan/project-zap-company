import React from 'react';
import { cn } from '../../../lib/utils';
import { Wrapper } from '../../../components/dev/Wrapper';
import { Icon } from '../../atoms/icons/Icon';
import { Switch } from '../../atoms/interactive/switch';
import { useTheme } from '../../../components/ThemeContext';

export interface CleanShellInspectorProps {
    children: React.ReactNode;
    className?: string;
    width?: string;
    isOpen?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    title?: string;
    showDevToggle?: boolean;
}

export function CleanShellInspector({ 
    children, 
    className,
    width = 'w-[320px]',
    isOpen = true,
    header,
    footer,
    title,
    showDevToggle = false
}: CleanShellInspectorProps) {
    const { devMode, setDevMode } = useTheme();

    if (!isOpen) return null;

    // Use explicit header OR construct the standard ZAP Inspector header
    const resolvedHeader = header || (title && (
         <div className="h-14 px-4 flex items-center justify-between shrink-0 border-b border-border/50 bg-layer-panel">
             <div className="flex items-center gap-2">
                 <Icon name="palette" size={18} className="text-on-surface" />
                 <h2 className="font-black text-on-surface text-[11px] tracking-widest font-display text-transform-primary uppercase">
                     {title}
                 </h2>
             </div>
             {showDevToggle && (
                 <div className="flex items-center" title="Toggle Dev Mode">
                     <Switch
                         checked={devMode}
                         onCheckedChange={setDevMode}
                         className="scale-75 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                     />
                 </div>
             )}
         </div>
    ));

    return (
        <Wrapper 
            identity={{ displayName: "CleanShell Inspector", filePath: "genesis/molecules/clean-shell/CleanShellInspector.tsx", type: "Panel" }}
            className={cn("h-full shrink-0 flex flex-col items-stretch", width, className)}
        >
            <aside className="h-full border-l border-border bg-layer-panel z-10 flex flex-col w-full flex-1">
                {/* Header (Stationary Top) */}
                {resolvedHeader && (
                    <div className="shrink-0 bg-layer-panel z-20 relative shadow-sm">
                        {resolvedHeader}
                    </div>
                )}
                
                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto relative z-10">
                    <div className="px-4 py-4 space-y-4">
                        {children}
                    </div>
                </div>

                {/* Footer (Stationary Bottom) */}
                {footer && (
                    <div className="shrink-0 p-4 border-t border-border/50 bg-layer-panel flex items-center justify-center relative z-20">
                        {footer}
                    </div>
                )}
            </aside>
        </Wrapper>
    );
}
