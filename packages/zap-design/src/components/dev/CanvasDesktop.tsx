"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { motion, AnimatePresence } from 'framer-motion';

export type WindowClass = 'compact' | 'medium' | 'expanded';
export type DevicePlatform = 'ios' | 'android' | 'both';

export interface CanvasDesktopProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    fullScreenHref?: string;
    defaultWindowClass?: WindowClass;
    defaultPlatform?: DevicePlatform;
}

const WINDOW_CLASSES: { id: WindowClass; label: string; desc: string; cols: number; margins: number; gutters: number }[] = [
    { id: 'compact', label: 'Compact', desc: 'Phone · 4 col · 16dp margins', cols: 4, margins: 16, gutters: 8 },
    { id: 'medium', label: 'Medium', desc: 'Tablet · 8 col · 24dp margins', cols: 8, margins: 24, gutters: 16 },
    { id: 'expanded', label: 'Expanded', desc: 'Desktop · 12 col · 24dp margins', cols: 12, margins: 24, gutters: 24 },
];

const DEVICE_SPECS = {
    ios: {
        label: 'iOS',
        name: 'iPhone 16',
        spec: '393 × 852pt · @3x',
        width: 360,
        height: 780,
        radius: 50,
        borderWidth: 10,
        statusBarHeight: 54,
        safeBottom: 28,
    },
    android: {
        label: 'Android',
        name: 'Pixel 9',
        spec: '406 × 913dp · @2.625x',
        width: 372,
        height: 836,
        radius: 27,
        borderWidth: 8,
        statusBarHeight: 28,
        safeBottom: 16,
    },
} as const;

// iOS Dynamic Island status bar — accurate 115×34px island pill
const IOSStatusBar = () => (
    <div className="w-full relative flex-shrink-0 z-50 pointer-events-none" style={{ height: 54 }}>
        {/* Dynamic Island pill */}
        <div
            className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20 shadow-sm"
            style={{ top: 10, width: 115, height: 34 }}
        />
        {/* Time — bottom-left of status bar */}
        <span
            className="absolute left-6 text-[12px] font-semibold tabular-nums text-foreground"
            style={{ bottom: 12 }}
        >22:50</span>
        {/* Status icons — bottom-right */}
        <div className="absolute right-5 flex gap-1.5 items-center text-foreground" style={{ bottom: 14 }}>
            <Icon name="signal_cellular_4_bar" size={14} />
            <Icon name="wifi" size={14} />
            <Icon name="battery_full" size={14} />
        </div>
    </div>
);

// Android punch-hole status bar — 10px centred camera hole
const AndroidStatusBar = () => (
    <div className="w-full flex items-center justify-between flex-shrink-0 relative z-50 pointer-events-none" style={{ height: 28, paddingInline: 16 }}>
        <span className="text-[10px] font-medium tabular-nums text-foreground mt-1">22:50</span>
        {/* Punch-hole camera */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[9px] w-[10px] h-[10px] bg-black rounded-full shadow-sm" />
        <div className="flex gap-1.5 items-center opacity-85 text-foreground mt-1">
            <Icon name="signal_cellular_4_bar" size={12} />
            <Icon name="wifi" size={12} />
            <Icon name="battery_full" size={12} />
        </div>
    </div>
);

// Phone Frame component
const PhoneFrame = ({
    deviceKey,
    children
}: {
    deviceKey: keyof typeof DEVICE_SPECS;
    children: React.ReactNode;
}) => {
    const spec = DEVICE_SPECS[deviceKey];
    const isIOS = deviceKey === 'ios';
    return (
        <div
            className="relative flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] shrink-0 bg-layer-canvas border-outline-variant"
            style={{
                width: spec.width,
                height: spec.height,
                borderRadius: spec.radius,
                borderWidth: spec.borderWidth,
                borderStyle: 'solid',
            }}
        >
            {/* Absolute positioning of status bar so layouts can reach the top if needed */}
            <div className="absolute top-0 left-0 right-0 z-50">
                {isIOS ? <IOSStatusBar /> : <AndroidStatusBar />}
            </div>
            
            {/* Main Viewport Container */}
            <div className={cn("flex-1 overflow-y-auto no-scrollbar flex flex-col relative", isIOS ? "pt-[54px]" : "pt-[28px]")}>
                {children}
            </div>

            {/* iOS Home Indicator */}
            {isIOS && (
                <div className="absolute bottom-0 left-0 right-0 h-[28px] bg-transparent flex justify-center items-end pb-2 pointer-events-none z-50">
                    <div className="w-[130px] h-[5px] bg-foreground rounded-full opacity-30 shadow-sm" />
                </div>
            )}
            {/* Android Navigation Bar */}
            {!isIOS && (
                <div className="absolute bottom-0 left-0 right-0 h-[16px] bg-transparent flex justify-center items-center pointer-events-none z-50">
                    <div className="w-[64px] h-[3px] bg-foreground rounded-full opacity-30 shadow-sm" />
                </div>
            )}
        </div>
    );
};

// Preview Selector UI Component
const PreviewSelector = ({
    windowClass,
    onWindowClassChange,
    platform,
    onPlatformChange,
}: {
    windowClass: WindowClass;
    onWindowClassChange: (wc: WindowClass) => void;
    platform: DevicePlatform;
    onPlatformChange: (p: DevicePlatform) => void;
}) => {
    const wcInfo = WINDOW_CLASSES.find(w => w.id === windowClass)!;

    return (
        <div className="flex flex-col items-center gap-3 mb-8 z-20">
            {/* Window Class tier */}
            <div className="flex rounded-full p-[3px] gap-[3px] bg-surface-container-high border border-outline-variant shadow-sm backdrop-blur-md">
                {WINDOW_CLASSES.map(({ id, label }) => {
                    const isActive = windowClass === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onWindowClassChange(id)}
                            className={cn(
                                "px-5 py-2 rounded-full text-[12px] font-bold text-transform-secondary tracking-widest transition-all duration-200",
                                isActive ? "bg-primary text-on-primary shadow-sm" : "text-on-surface hover:bg-surface-variant/50"
                            )}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Platform sub-toggle — only visible in Compact */}
            <AnimatePresence>
                {windowClass === 'compact' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.9 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                        className="flex rounded-full p-[2px] gap-[2px] bg-surface-container border border-outline-variant shadow-sm overflow-hidden"
                    >
                        {([
                            { id: 'ios' as DevicePlatform, emoji: '🍎', label: 'iOS' },
                            { id: 'android' as DevicePlatform, emoji: '🤖', label: 'Android' },
                            { id: 'both' as DevicePlatform, emoji: '⚡', label: 'Compare' },
                        ]).map(({ id, emoji, label }) => {
                            const isActive = platform === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => onPlatformChange(id)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold text-transform-secondary tracking-widest transition-all duration-200",
                                        isActive ? "bg-secondary-container text-on-secondary-container shadow-sm" : "text-on-surface hover:bg-surface-variant/50"
                                    )}
                                >
                                    <span className="text-[12px] leading-none">{emoji}</span>
                                    {label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spec label */}
            <p className="mt-2 text-[10px] font-dev text-transform-tertiary text-on-surface-variant/70">
                {wcInfo.desc}
            </p>
        </div>
    );
};

export const CanvasDesktop = ({ 
    children, 
    title = "ZAP Desktop Engine", 
    fullScreenHref, 
    defaultWindowClass = 'expanded', 
    defaultPlatform = 'ios' 
}: CanvasDesktopProps) => {
    const [windowClass, setWindowClass] = useState<WindowClass>(defaultWindowClass);
    const [platform, setPlatform] = useState<DevicePlatform>(defaultPlatform);
    const getMaxScale = (wc: WindowClass) => {
        if (wc === 'compact') return 1.5; // Mobile can zoom up to 1.5x safely 
        if (wc === 'medium') return 0.9;  // Tablet can zoom up to 90%
        return 0.67; // Expanded (Desktop) hard-capped at 0.67 for universal layout fit
    };

    const maxScale = getMaxScale(windowClass);
    const minScale = 0.25;
    const [scale, setScale] = useState<number>(maxScale);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    const isBoth = platform === 'both';

    // Reset scale to max scale for current device class when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setScale(Math.round(maxScale * 100) / 100);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setPan({ x: 0, y: 0 });
    }, [windowClass, maxScale]);

    // ── Zoom Controls ────────────────────────────────────────────────
    const handleZoomIn = () => {
        setScale(Math.min(maxScale, Math.round((scale + 0.1) * 100) / 100));
    };

    const handleZoomOut = () => {
        setScale(Math.max(minScale, Math.round((scale - 0.1) * 100) / 100));
    };

    const handleZoomReset = () => {
        setScale(Math.round(maxScale * 100) / 100);
        setPan({ x: 0, y: 0 });
    };

    const getBoundingBox = () => {
        if (windowClass === 'compact') {
            if (isBoth) {
                return { 
                    width: DEVICE_SPECS.android.width + DEVICE_SPECS.ios.width + 48, 
                    height: Math.max(DEVICE_SPECS.android.height, DEVICE_SPECS.ios.height) + 40 
                };
            }
            const spec = DEVICE_SPECS[platform as keyof typeof DEVICE_SPECS];
            return { width: spec.width, height: spec.height };
        }
        if (windowClass === 'medium') return { width: 1024, height: 768 };
        return { width: 1440, height: 900 };
    };

    const bbox = getBoundingBox();

    return (
        <div className="flex flex-col items-center w-full relative pb-20 pt-4 overflow-visible group">

            {/* ── Selector ────────────────────────────────── */}
            <PreviewSelector
                windowClass={windowClass}
                onWindowClassChange={setWindowClass}
                platform={platform}
                onPlatformChange={setPlatform}
            />

            {/* ── Preview Frame (Scaled Space) ──────────────── */}
            <div 
                className="relative transition-all duration-300 flex justify-center origin-top mt-4"
                style={{ width: bbox.width * scale, height: bbox.height * scale }}
            >
                <div 
                    className="absolute top-0 origin-top flex justify-center"
                    style={{ transform: `scale(${scale})`, width: bbox.width }}
                >
                    <motion.div
                    key={`${windowClass}-${platform}`}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="flex items-start justify-center gap-12"
                >
                    {windowClass === 'compact' ? (
                        /* ── Compact: Phone Frames ─────────────── */
                        isBoth ? (
                            <>
                                <div className="flex flex-col items-center gap-4">
                                    <PhoneFrame deviceKey="android">{children}</PhoneFrame>
                                    <p className="text-[10px] font-dev text-transform-tertiary opacity-50 tracking-widest text-on-surface">
                                        {DEVICE_SPECS.android.name} · {DEVICE_SPECS.android.spec}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <PhoneFrame deviceKey="ios">{children}</PhoneFrame>
                                    <p className="text-[10px] font-dev text-transform-tertiary opacity-50 tracking-widest text-on-surface">
                                        {DEVICE_SPECS.ios.name} · {DEVICE_SPECS.ios.spec}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <PhoneFrame deviceKey={platform as keyof typeof DEVICE_SPECS}>{children}</PhoneFrame>
                        )
                    ) : windowClass === 'medium' ? (
                        /* ── Medium: Tablet frame ──────────────── */
                        <div
                            className="relative flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-layer-canvas border-outline-variant"
                            style={{
                                width: 1024,
                                height: 768,
                                borderRadius: 16,
                                borderWidth: 8,
                                borderStyle: 'solid',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-5 shrink-0 z-50 pointer-events-none text-foreground">
                                <span className="tabular-nums text-[10px] font-medium mt-1">22:50</span>
                                <div className="flex gap-1.5 items-center opacity-80 mt-1">
                                    <Icon name="signal_cellular_4_bar" size={12} />
                                    <Icon name="wifi" size={12} />
                                    <Icon name="battery_full" size={12} />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar pt-7">
                                {children}
                            </div>
                        </div>
                    ) : (
                        /* ── Expanded: Desktop frame ───────────── */
                        <div
                            className="relative flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-layer-canvas border-outline-variant"
                            style={{
                                width: 1440,
                                height: 900,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderStyle: 'solid',
                            }}
                        >
                            {/* Desktop title bar */}
                            <div className="h-[38px] w-full flex items-center px-4 gap-2 shrink-0 border-b border-border bg-layer-panel z-50">
                                <div className="flex gap-2 w-[60px]">
                                    <div className="w-3 h-3 rounded-full bg-[#EC6A5E] border border-black/10 shadow-sm" />
                                    <div className="w-3 h-3 rounded-full bg-[#F4BF4F] border border-black/10 shadow-sm" />
                                    <div className="w-3 h-3 rounded-full bg-[#61C554] border border-black/10 shadow-sm" />
                                </div>
 <span className="text-[10px] font-bold font-display text-transform-primary tracking-[0.25em] opacity-60 ml-2 flex-1 text-center text-on-surface-variant">
                                    {title}
                                </span>
                                <div className="w-[60px]" /> {/* Spacer for symmetry */}
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {children}
                            </div>
                        </div>
                    )}
                </motion.div>
                </div>

                {/* Map-gauge vertical zoom controls — Floating dependably inside the right canvas boundary to avoid viewport clipping when expanded */}
                <div className="absolute top-0 right-4 bottom-0 pointer-events-none w-10 z-[9999]">
                    <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center bg-surface-container-high rounded-full border border-outline-variant shadow-2xl p-1 pointer-events-auto transition-colors hover:bg-surface-container-highest z-[9999]">
                        {scale < maxScale && (
                            <>
                                <button 
                                    onClick={handleZoomIn} 
                                    className="p-2 rounded-full hover:bg-surface-variant hover:text-primary transition-colors text-on-surface flex items-center justify-center cursor-pointer"
                                    title="Zoom In"
                                >
                                    <Icon name="add" size={18} />
                                </button>
                                <div className="my-1 border-t border-outline-variant w-6 mx-auto" />
                            </>
                        )}
                        <button 
                            onClick={handleZoomReset} 
                            className={cn("p-2 rounded-full transition-colors", scale === maxScale ? "text-primary" : "text-on-surface hover:bg-surface-variant hover:text-primary")}
                            title="Reset Zoom (100%)"
                        >
                            <span className="text-[10px] font-bold tracking-tighter w-[20px] text-center block leading-none">
                                {Math.round((scale / maxScale) * 100)}<span className="text-[8px]">%</span>
                            </span>
                        </button>
                        <div className="my-1 border-t border-outline-variant w-5 mx-auto" />
                        <button 
                            onClick={handleZoomOut} 
                            className="p-2 rounded-full hover:bg-surface-variant hover:text-primary transition-colors text-on-surface flex items-center justify-center cursor-pointer"
                            title="Zoom Out"
                        >
                            <Icon name="remove" size={18} />
                        </button>
                        
                        {fullScreenHref && (
                            <>
                                <div className="my-1 border-t border-outline-variant w-5 mx-auto" />
                                <Link 
                                    href={fullScreenHref} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="p-2 rounded-full hover:bg-surface-variant focus:bg-primary focus:text-on-primary hover:text-primary transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer"
                                    title="Open True Size (Full Screen)"
                                >
                                    <Icon name="open_in_new" size={18} />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
