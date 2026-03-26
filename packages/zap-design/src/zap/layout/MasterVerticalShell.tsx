'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { HorizontalNav } from './HorizontalNav';
import { HorizontalNavigation } from '../../genesis/molecules/navigation/HorizontalNavigation';
import { VerticalNav, ATOM_ROUTES, designSystemLevels } from './VerticalNav';
import { Breadcrumbs } from '../../genesis/molecules/navigation/Breadcrumbs';
import { Inspector } from './Inspector';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { LayoutProvider, useLayout } from '../../components/LayoutContext';

interface MasterVerticalShellProps {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string; active?: boolean }[];
    inspectorTitle?: string;
    inspectorContent?: React.ReactNode;
    showInspector?: boolean;
    activeItem?: string;
}

import { getSession, logoutAction } from '../../../../zap-auth/src/actions';

// ─── Layout Component ───────────────────────────────────────────────────────────

interface SessionUser {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    status: "online" | "offline" | "busy" | "away";
    position?: string;
}

export const MasterVerticalShell = (props: MasterVerticalShellProps) => {
    return (
        <LayoutProvider>
            <MasterVerticalShellContent {...props} />
        </LayoutProvider>
    );
};

const MasterVerticalShellContent = ({
    children,
    breadcrumbs: propBreadcrumbs,
    inspectorTitle = 'Technical Specs',
    inspectorContent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showInspector = true,
    activeItem: propActiveItem
}: MasterVerticalShellProps) => {
    const pathname = usePathname();

    const [userSession, setUserSession] = React.useState<SessionUser | null>(null);

    React.useEffect(() => {
        getSession().then((session: unknown) => {
            if (session && typeof session === 'object') {
                const s = session as Record<string, string>;
                setUserSession({
                    name: s.name || "Unknown User",
                    email: s.email || "",
                    role: s.role || "USER",
                    avatarUrl: s.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || "Unknown")}`,
                    status: 'online',
                    position: (session as { employee?: { position?: string } }).employee?.position || 'Unknown Position'
                });
            }
        });
    }, []);

    // Dynamic Breadcrumb Calculation
    const breadcrumbs = React.useMemo(() => {
        if (propBreadcrumbs) return propBreadcrumbs;

        const crumbs: { label: string; href?: string; active?: boolean }[] = [
            { label: 'SYSTEMS' },
        ];

        // Find active category
        const activeLevel = designSystemLevels.find(l =>
            l.items.some(item => ATOM_ROUTES[item] === pathname)
        );

        if (activeLevel) {
            crumbs.push({ label: activeLevel.label.toUpperCase() });

            // Find active item
            const activeItemName = activeLevel.items.find(item => ATOM_ROUTES[item] === pathname);
            if (activeItemName) {
                crumbs.push({ label: activeItemName.toUpperCase(), active: true });
            }
        } else if (pathname === '/') {
            crumbs.push({ label: 'DASHBOARD', active: true });
        }

        return crumbs;
    }, [pathname, propBreadcrumbs]);

    const activeItem = React.useMemo(() => {
        if (propActiveItem) return propActiveItem;
        const activeLevel = designSystemLevels.find(l =>
            l.items.some(item => ATOM_ROUTES[item] === pathname)
        );
        return activeLevel?.items.find(item => ATOM_ROUTES[item] === pathname) || 'Typography';
    }, [pathname, propActiveItem]);

    const {
        sidebarWidth, setSidebarWidth,
        isSidebarCollapsed, setIsSidebarCollapsed,
        inspectorWidth, setInspectorWidth,
         setIsInspectorCollapsed
    } = useLayout();

    // AI Command Bar State
    const [command, setCommand] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [hudReply, setHudReply] = React.useState<string | null>(null);

    const handleCommandSubmit = async (e?: React.FormEvent, overrideCommand?: string) => {
        e?.preventDefault();
        const textToSubmit = overrideCommand || command;
        if (!textToSubmit.trim()) return;

        setIsProcessing(true);
        setHudReply("Analyzing request and calculating execution path...");

        try {
            const res = await fetch('http://localhost:8000/api/hud/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSubmit,
                    botName: 'Jerry',
                    activePage: pathname
                })
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            // Clear prior response and prepare to receive stream
            setHudReply("");

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // SSE chunks are prefixed with 'data: ' and end with '\n\n'
                const events = chunk.split('\n\n');

                for (const event of events) {
                    if (event.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(event.replace('data: ', ''));
                            if (data.status) {
                                setHudReply(prev => (prev ? prev + '\n' + data.status : data.status));
                            } else if (data.reply) {
                                setHudReply(data.reply);
                            } else if (data.error) {
                                setHudReply(prev => (prev ? prev + '\n[Error] ' + data.error : '[Error] ' + data.error));
                            }
                        } catch {
                            // ignore JSON parse errors for incomplete chunks
                        }
                    }
                }
            }

        } catch {
            setHudReply("Error: Could not reach Agent Gateway running on port 8000.");
        } finally {
            setIsProcessing(false);
            if (!overrideCommand) {
                setCommand('');
            }
        }
    };

    const quickActions = React.useMemo(() => {
        if (!hudReply || isProcessing) return [];
        // Match [Action: Something] or [Quick Action: Something]
        const regex = /\[(?:Quick\s*)?Action:\s*([^\]]+)\]/gi;
        const matches: string[] = [];
        let m;
        while ((m = regex.exec(hudReply)) !== null) {
            matches.push(m[1].trim());
        }

        // If the reply ends with a question, provide a generic Yes/Proceed option
        if (matches.length === 0 && hudReply.trim().endsWith('?')) {
            matches.push("Yes / Proceed");
        }

        return matches;
    }, [hudReply, isProcessing]);

    const handleResize = (e: React.MouseEvent, type: 'sidebar' | 'inspector') => {
        const startX = e.clientX;
        const startWidth = type === 'sidebar' ? sidebarWidth : inspectorWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
            window.requestAnimationFrame(() => {
                const delta = moveEvent.clientX - startX;
                const newWidth = type === 'sidebar' ? startWidth + delta : startWidth - delta;

                if (type === 'sidebar') {
                    if (newWidth < 100) {
                        setIsSidebarCollapsed(true);
                        setSidebarWidth(64);
                    } else {
                        setIsSidebarCollapsed(false);
                        setSidebarWidth(Math.min(Math.max(newWidth, 160), 400));
                    }
                } else {
                    if (newWidth < 80) {
                        setIsInspectorCollapsed(true);
                        setInspectorWidth(0);
                    } else {
                        setIsInspectorCollapsed(false);
                        setInspectorWidth(Math.min(Math.max(newWidth, 180), 400));
                    }
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
        <div className="h-screen flex flex-col bg-brand-midnight text-black antialiased overflow-hidden font-sans">
            {/* 1. Full-Width Header */}
            <HorizontalNav />

            {/* 2. Full-Width Breadcrumbs Bar */}
            <div className="h-10 bg-layer-panel border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex items-center px-4 shrink-0 z-40">
                <Breadcrumbs items={breadcrumbs} showDevWrapper={false} />
            </div>

            {/* 3. Main Workspace Area */}
            <main className="flex-1 flex overflow-hidden bg-brand-midnight relative">
                {/* Vertical Navigation */}
                <VerticalNav width={sidebarWidth} isCollapsed={isSidebarCollapsed} activeItem={activeItem} />

                {/* Sidebar Resize Handle */}
                <div
                    onMouseDown={(e) => handleResize(e, 'sidebar')}
                    className="w-3 bg-white border-l-2 border-r-2 border-black flex flex-col items-center justify-center cursor-col-resize hover:bg-acid-yellow z-30 group transition-colors touch-none"
                >
                    <div className="h-8 w-1 bg-acid-yellow border-2 border-black group-hover:h-12 transition-all shadow-[1px_1px_0px_0px_#000]"></div>
                </div>

                {/* Center Content Section - Using Surface tokens */}
                <section className="flex-1 flex flex-col overflow-hidden relative bg-cream-white m-0.5 border-l-2 border-black">
                    <HorizontalNavigation
                        user={userSession || undefined}
                        isLoggedIn={!!userSession}
                        onLoginClick={() => window.location.href = '/'}
                        onLogoutClick={async () => {
                            console.log('LOGOUT BUTTON CLICKED IN SHELL!');
                            try {
                                await logoutAction();
                                console.log('LOGOUT ACTION COMPLETED, REDIRECTING...');
                                window.location.href = '/';
                            } catch (e) {
                                console.error('LOGOUT ACTION FAILED:', e);
                            }
                        }}
                    />
                    <AnimatePresence>
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="flex-1 overflow-y-auto scrollbar-hide"
                        >
                            <div className="max-w-4xl mx-auto">
                                {children}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Minimalist AI Command Bar */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none z-50">
                        {/* HUD Reply */}
                        <AnimatePresence>
                            {hudReply && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full mb-3 left-0 w-full pointer-events-auto bg-acid-yellow border-2 border-black p-5 shadow-[6px_6px_0px_0px_#000] max-h-[600px] overflow-y-auto z-50"
                                >
                                    {/* Speech Bubble Tail */}
                                    <div className="absolute -bottom-[9px] left-8 w-4 h-4 bg-acid-yellow border-b-2 border-r-2 border-black transform rotate-45 z-10"></div>

                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-black flex items-center justify-center shrink-0">
                                            <Icon name="auto_awesome" size={16} className="text-acid-yellow" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold font-sans uppercase tracking-wider text-[13px] mt-1 pt-0.5">
                                                    ANALYSIS COMPLETE
                                                </h4>
                                                <button onClick={() => setHudReply(null)} className="text-black hover:text-black/60 transition-colors" aria-label="Close HUD" title="Close HUD">
                                                    <Icon name="close" size={18} />
                                                </button>
                                            </div>

                                            <div className="text-sm font-sans whitespace-pre-wrap leading-relaxed text-slate-800">
                                                {hudReply}
                                            </div>

                                            {/* Contextual Action Buttons */}
                                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                                {quickActions.map((action, idx) => (
                                                    <button
                                                        key={`action-${idx}`}
                                                        onClick={() => handleCommandSubmit(undefined, action)}
                                                        className="bg-white text-black border-2 border-black font-bold text-xs uppercase px-4 py-2 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_#000] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_#000]"
                                                    >
                                                        {action}
                                                    </button>
                                                ))}
                                                <button onClick={() => setHudReply(null)} className="bg-acid-yellow border-2 border-black text-black font-bold text-xs uppercase px-4 py-2 hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_#000] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_#000]">
                                                    Dismiss
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reportMessage = `[ISSUE REPORT] Interface report: "Not Working" triggered. Current error: ${hudReply}`;
                                                        handleCommandSubmit(undefined, reportMessage);
                                                        setHudReply(null);
                                                    }}
                                                    className="bg-white text-black border-2 border-black font-bold text-xs uppercase px-4 py-2 hover:bg-zinc-100 transition-colors shadow-[2px_2px_0px_0px_#000] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_#000] flex items-center gap-2"
                                                >
                                                    <Icon name="report" size={14} className="text-red-600" />
                                                    Not Working
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleCommandSubmit} className="pointer-events-auto bg-white p-1.5 flex items-stretch gap-3 border-2 border-black shadow-[6px_6px_0px_0px_#000]">
                            {/* Left: User Avatar representation */}
                            <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                                <Icon name="person" size={20} className="text-white" />
                            </div>

                            {/* Input Field */}
                            <input
                                className="flex-1 bg-transparent border-none focus:ring-0 text-black placeholder-slate-400 font-bold font-sans text-sm outline-none"
                                placeholder={isProcessing ? "Jerry is thinking..." : "Issue command to ZAP Engine..."}
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                disabled={isProcessing}
                            />

                            {/* Right: Submit Button */}
                            <button
                                type="submit"
                                aria-label="Submit command"
                                title="Submit command"
                                disabled={isProcessing || !command.trim()}
                                className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-colors shadow-none
                                    ${isProcessing ? 'bg-zinc-300 opacity-50 cursor-not-allowed' : 'bg-acid-yellow hover:bg-yellow-400'}
                               `}
                            >
                                <Icon name={isProcessing ? "hourglass_empty" : "arrow_upward"} size={20} className={isProcessing ? "animate-pulse" : ""} />
                            </button>
                        </form>
                    </div>
                </section>

                {/* Inspector Resize Handle */}
                <div
                    onMouseDown={(e) => handleResize(e, 'inspector')}
                    className="w-3 bg-white border-l-2 border-r-2 border-black flex flex-col items-center justify-center cursor-col-resize hover:bg-acid-yellow z-30 group transition-colors touch-none"
                >
                    <div className="h-8 w-1 bg-acid-yellow border-2 border-black group-hover:h-12 transition-all shadow-[1px_1px_0px_0px_#000]"></div>
                </div>

                {/* Inspector */}
                <Inspector title={inspectorTitle} width={inspectorWidth}>
                    {inspectorContent}
                </Inspector>
            </main>
        </div>
    );
};
