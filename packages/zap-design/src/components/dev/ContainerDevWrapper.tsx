"use client";

import React, { useState, useId, useEffect } from 'react';

export interface DevIdentity {
    displayName: string;
    filePath: string;
    parentComponent?: string;
    type: string; // e.g., 'Organism/Block'
    architecture?: string; // e.g., 'SYSTEMS // PALETTE'
    codeSnippet?: string;
}

export interface ContainerDevWrapperProps {
    children: React.ReactNode;
    showClassNames?: boolean;
    identity: DevIdentity;
    className?: string;
    style?: React.CSSProperties;
    align?: 'left' | 'right';
}

export const ContainerDevWrapper: React.FC<ContainerDevWrapperProps> = ({
    children,
    showClassNames = false,
    identity,
    className = '',
    style,
    align = 'left'
}) => {
    // Generate a unique identifier for this specific instance wrapper
    const instanceId = useId();

    // Determine whether this is a root page that needs internal spacing
    const isPage = identity.type.includes('Page') || identity.type.includes('Shell');

    // Add margin if it's a page, the dev mode is active, to push content down
    const structuralClasses = (showClassNames && isPage) ? 'mt-4 ' : '';
    const devClasses = showClassNames ? 'border-2 border-dashed border-red-500 bg-red-50/10 ' : '';

    const [copied, setCopied] = useState(false);
    const [copiedJSX, setCopiedJSX] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<'left' | 'right'>(align);

    const alignClasses = position === 'right' ? 'right-2' : 'left-4';

    useEffect(() => {
        const handleOtherWrapperOpen = (e: Event) => {
            const customEvent = e as CustomEvent;
            // If another wrapper opened, and it's not us, close ourselves.
            if (customEvent.detail !== instanceId) {
                setIsOpen(false);
            }
        };

        const handleGlobalClick = () => {
            setIsOpen(false);
        };

        window.addEventListener('zap-dev-wrapper-open', handleOtherWrapperOpen);
        if (isOpen) {
            window.addEventListener('click', handleGlobalClick);
        }

        return () => {
            window.removeEventListener('zap-dev-wrapper-open', handleOtherWrapperOpen);
            window.removeEventListener('click', handleGlobalClick);
        };
    }, [instanceId, isOpen]);

    const handleToggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(prev => {
            const nextState = !prev;
            if (nextState) {
                // Broadcast that this wrapper opened
                window.dispatchEvent(new CustomEvent('zap-dev-wrapper-open', { detail: instanceId }));
            }
            return nextState;
        });
    };

    const handleCopyContext = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const codeBlock = identity.codeSnippet
            ? `\n\`\`\`tsx\n${identity.codeSnippet}\n\`\`\``
            : `\n// No code snippet provided to Wrapper`;

        const snippet = `**Task Target:** \`${identity.displayName}\`
**File Path:** \`${identity.filePath}\`
**Architecture:** \`${identity.architecture || 'N/A'}\`
**Type:** \`${identity.type}\`
**Code Snippet:**${codeBlock}

**Directive:** `;

        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyJSX = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (identity.codeSnippet) {
            navigator.clipboard.writeText(identity.codeSnippet);
            setCopiedJSX(true);
            setTimeout(() => setCopiedJSX(false), 2000);
        }
    };

    const handleTogglePosition = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setPosition(prev => prev === 'left' ? 'right' : 'left');
    };

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Next.js or Biome inline style lint rule bypass
        <div className={`relative w-full ${structuralClasses} ${devClasses} ${className} ${showClassNames ? 'hover:z-50' : ''} ${isOpen ? 'z-[999999]' : ''}`} style={style}>
            {showClassNames && (
                <div
                    onClick={handleToggleOpen}
                    title={isOpen ? "Click to close" : "Click to view Dev Wrapper Context"}
                    className={`absolute ${alignClasses} group/pill bg-red-500/20 hover:bg-red-500/50 border border-dotted border-red-500/50 hover:border-red-400 backdrop-blur-md z-[999999] flex items-center justify-center top-0 -translate-y-1/2 shadow-sm transition-all duration-200 cursor-pointer ${isOpen ? 'h-auto w-max max-w-xs sm:max-w-[400px] px-2 py-1 rounded-md' : 'h-4 w-4 rounded-sm hover:rounded-md'}`}
                >
                    {/* Minimized Icon State */}
                    {!isOpen && (
                        <div className="flex w-full h-full items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-red-500/80 rounded-full" />
                        </div>
                    )}

                    {/* Expanded Content State */}
                    {isOpen && (
 <div className="flex items-center justify-between gap-2 text-[9px] font-dev text-transform-tertiary tracking-widest text-white w-full">
                            {/* Component Identity Line */}
                            <div className="flex items-center gap-2 px-1 min-w-0 flex-1">
                                <span className="font-semibold shrink-0">{identity.type}</span>
                                <span className="opacity-40 shrink-0">|</span>
                                <span className="font-bold min-w-0 whitespace-normal break-all leading-tight">{identity.displayName}</span>
                            </div>

                            {/* Action Toolbar */}
                            <div className="flex items-center gap-1 shrink-0 ml-1 border-l border-white/30 pl-2">
                                {/* Toggle Position Button */}
                                <button
                                    onClick={handleTogglePosition}
                                    className="flex items-center justify-center cursor-pointer hover:bg-white/20 p-1 rounded transition-all active:scale-95 text-white/90 hover:text-white"
                                    title="Move Pill to Opposite Side"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </button>
                                {/* Raw JSX Code Button */}
                                {identity.codeSnippet && (
                                    <button
                                        onClick={handleCopyJSX}
                                        className="flex items-center justify-center cursor-pointer hover:bg-white/20 p-1 rounded transition-all active:scale-95 text-white/90 hover:text-white"
                                        title="Copy JSX Snippet"
                                    >
                                        {copiedJSX ? (
                                            <svg className="w-4 h-4 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                        )}
                                    </button>
                                )}

                                {/* Full AI Dev Context Button */}
                                <button
                                    onClick={handleCopyContext}
                                    className="flex items-center justify-center cursor-pointer hover:bg-white/20 p-1 rounded transition-all active:scale-95 text-white/90 hover:text-white"
                                    title="Copy AI Context"
                                >
                                    {copied ? (
                                        <svg className="w-4 h-4 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};
