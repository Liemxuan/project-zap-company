'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hexFromArgb } from "@material/material-color-utilities";
import { ArrowLeft, MoreVertical, Leaf, Check } from 'lucide-react';

// =============================================================================
// M3 Window Classes & Device Specs
// =============================================================================
type WindowClass = 'compact' | 'medium' | 'expanded';

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

type DevicePlatform = keyof typeof DEVICE_SPECS | 'both';

const IOSStatusBar = ({ color }: { color: string }) => (
    <div className="w-full relative flex-shrink-0" style={{ height: 54, color }}>
        <div className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20" style={{ top: 10, width: 115, height: 34 }} />
        <span className="absolute left-6 text-[12px] font-semibold tabular-nums" style={{ bottom: 6 }}>22:50</span>
        <div className="absolute right-5 flex gap-1.5 items-center" style={{ bottom: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22Z" /></svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L1 3C5 1 19 1 23 3L12 21Z" /></svg>
            <div className="w-[18px] h-[10px] rounded-[3px] border-[1.5px] border-current relative">
                <div className="w-[1px] h-[4px] bg-current absolute -right-[3px] top-[1.5px] rounded-r-sm" />
                <div className="w-[11px] h-[5px] bg-current absolute top-[1px] left-[1px] rounded-[1px]" />
            </div>
        </div>
    </div>
);

const AndroidStatusBar = ({ color }: { color: string }) => (
    <div className="w-full flex items-center justify-between flex-shrink-0 relative" style={{ height: 28, paddingInline: 16, color }}>
        <span className="text-[10px] font-medium tabular-nums">22:50</span>
        <div className="absolute left-1/2 -translate-x-1/2 top-[9px] w-[10px] h-[10px] bg-black rounded-full" />
        <div className="flex gap-1.5 items-center opacity-85">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L1 3C5 1 19 1 23 3L12 21Z" /></svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22Z" /></svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z" /></svg>
        </div>
    </div>
);

const PhoneFrame = ({ deviceKey, s }: { deviceKey: keyof typeof DEVICE_SPECS; s: Record<string, string> }) => {
    const spec = DEVICE_SPECS[deviceKey];
    const isIOS = deviceKey === 'ios';
    return (
        <div
            className="relative flex flex-col overflow-hidden shadow-2xl shrink-0"
            style={{
                width: spec.width,
                height: spec.height,
                borderRadius: spec.radius,
                borderWidth: spec.borderWidth,
                borderStyle: 'solid',
                borderColor: s.outlineVariant,
                backgroundColor: s.surfaceContainerLowest,
                color: s.onBg,
            }}
        >
            {isIOS ? <IOSStatusBar color={s.onBg} /> : <AndroidStatusBar color={s.onBg} />}
            {isIOS ? <IOSScreenContent s={s} /> : <AndroidScreenContent s={s} />}
        </div>
    );
};

const IOSScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-6 pt-2">
        <div className="flex justify-between items-center mb-5">
            <button aria-label="Back" className="p-1 rounded-full hover:opacity-70" style={{ color: s.onBg }}><ArrowLeft size={18} /></button>
            <button aria-label="More options" className="p-1 rounded-full hover:opacity-70" style={{ color: s.onBg }}><MoreVertical size={18} /></button>
        </div>
        <h2 className="text-[30px] leading-tight text-center mb-5 font-display" style={{ color: s.primary }}>Monstera<br />Siltepecana</h2>
        <div className="w-[200px] h-[200px] mx-auto rounded-[70px] shadow-inner mb-5 flex items-center justify-center text-[90px] overflow-hidden relative" style={{ backgroundColor: s.surfaceVariant }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: s.shadow }} />🌿
        </div>
        <div className="flex gap-2 mb-6">
            {[
                { title: 'Most Popular', desc: 'A popular plant in the community', icon: '🌟' },
                { title: 'Faux Ready', desc: 'No maintenance required', icon: '🌲' },
                { title: 'Easy Care', desc: 'Perfect for beginners', icon: '✨' },
            ].map((c, i) => (
                <div key={i} className="flex-1 rounded-2xl p-2 pb-2.5 flex flex-col gap-1 shadow-sm" style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] mb-0.5" style={{ backgroundColor: s.onTertiaryContainer + '1A' }}>{c.icon}</div>
                    <span className="text-[9px] font-bold leading-tight">{c.title}</span>
                    <span className="text-[7px] leading-tight opacity-75 line-clamp-2">{c.desc}</span>
                </div>
            ))}
        </div>
        <h3 className="text-[14px] mb-3 font-display" style={{ color: s.onBg }}>Care</h3>
        <div className="flex flex-col gap-3 text-[11px] font-medium" style={{ color: s.onSurfaceVariant }}>
            {[{ label: 'Water every 1–2 weeks' }, { label: 'Feed once monthly' }, { label: 'Moderate indirect light' }].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span style={{ color: s.onSurfaceVariant }}>•</span>
                    <span>{row.label}</span>
                </div>
            ))}
        </div>
        <div className="mt-auto pt-4 flex justify-center">
            <div className="w-28 h-1 rounded-full" style={{ backgroundColor: s.onBg + '30' }} />
        </div>
    </div>
);

const AndroidScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-5 pt-3 gap-3">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-[26px] font-sans font-normal tracking-tight font-display">Today</h2>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: s.secondaryContainer, color: s.onSecondaryContainer }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>person</span>
            </div>
        </div>
        <div className="rounded-[16px] p-4 flex gap-3" style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}>
            <Leaf size={14} className="mt-0.5 shrink-0" />
            <p className="text-[11px] leading-snug font-medium">During winter, your plants slow down and need less water</p>
        </div>
        {[
            { title: 'Living Room', icon: '🪴', tasks: [['Water', 'hoya australis'], ['Feed', 'monstera siltepecana']] },
            { title: 'Kitchen', icon: '🌿', tasks: [['Water', 'clinacanthus nutans'], ['Water', 'hoya australis']] },
            { title: 'Bedroom', icon: '🌵', tasks: [['Feed', 'monstera siltepecana'], ['Water', 'opuntia basilaris']] },
        ].map((room, i) => (
            <div key={i} className="rounded-[16px] p-4 relative overflow-hidden flex flex-col gap-3" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                <h3 className="text-[13px] font-semibold" style={{ color: s.primary }}>{room.title}</h3>
                <div className="flex flex-col gap-2 relative z-10 w-[65%]">
                    {room.tasks.map((task, j) => (
                        <div key={j} className="flex items-start gap-2">
                            <div className="w-[14px] h-[14px] rounded-[3px] flex items-center justify-center mt-[1px] shrink-0" style={{ backgroundColor: s.primary, color: s.onPrimary }}>
                                <Check size={9} strokeWidth={3.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-medium leading-none mb-0.5">{task[0]}</span>
                                <span className="text-[9px] italic opacity-60 leading-none">{task[1]}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute -bottom-3 -right-2 text-[70px] opacity-90 z-0">{room.icon}</div>
            </div>
        ))}
        <div className="mt-auto pt-3 flex justify-center">
            <div className="w-24 h-1 rounded-full" style={{ backgroundColor: s.onBg + '30' }} />
        </div>
    </div>
);

const TabletScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col items-center py-4 gap-6 shrink-0" style={{ width: 72, backgroundColor: s.surfaceContainerHigh, color: s.onSurfaceVariant }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>eco</span>
            </div>
            {['home', 'search', 'notifications', 'person'].map((icon) => (
                <div key={icon} className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{icon}</span>
                    <span className="text-[8px] capitalize">{icon}</span>
                </div>
            ))}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-5" style={{ backgroundColor: s.surfaceContainerLow }}>
            <h2 className="text-[22px] tracking-tight font-display" style={{ color: s.onBg }}>My Garden</h2>
            <div className="rounded-[16px] p-4 flex gap-3" style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}>
                <Leaf size={16} className="mt-0.5 shrink-0" />
                <p className="text-[12px] leading-snug font-medium">Winter care: reduce watering frequency for all indoor plants.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { title: 'Living Room', icon: '🪴', count: 4 },
                    { title: 'Kitchen', icon: '🌿', count: 3 },
                    { title: 'Bedroom', icon: '🌵', count: 5 },
                    { title: 'Bathroom', icon: '🌺', count: 2 },
                ].map((room, i) => (
                    <div key={i} className="rounded-[16px] p-4 relative overflow-hidden" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                        <h3 className="text-[14px] font-semibold mb-1 font-display" style={{ color: s.primary }}>{room.title}</h3>
                        <p className="text-[11px] opacity-70">{room.count} plants</p>
                        <div className="absolute -bottom-2 -right-1 text-[50px] opacity-80">{room.icon}</div>
                    </div>
                ))}
            </div>
            <div className="flex gap-3">
                {['Water All', 'Schedule', 'Add Plant'].map((label, i) => (
                    <button key={i} className="flex-1 rounded-full py-2.5 text-[11px] font-bold text-transform-secondary tracking-wider transition-colors" style={{ backgroundColor: i === 0 ? s.primary : 'transparent', color: i === 0 ? s.onPrimary : s.primary, border: i === 0 ? 'none' : `1px solid ${s.outlineVariant}` }}>{label}</button>
                ))}
            </div>
        </div>
    </div>
);

const DesktopScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col py-2 px-1 gap-1 shrink-0 overflow-y-auto no-scrollbar" style={{ width: 200, backgroundColor: s.surfaceContainerHigh, color: s.onSurfaceVariant }}>
            <div className="flex items-center gap-2 px-3 py-2 mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.primary, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>eco</span>
                <span className="text-[14px] font-bold font-display" style={{ color: s.onBg }}>Plantify</span>
            </div>
            {[
                { icon: 'home', label: 'Home', active: true },
                { icon: 'search', label: 'Explore', active: false },
                { icon: 'calendar_month', label: 'Schedule', active: false },
                { icon: 'notifications', label: 'Alerts', active: false },
                { icon: 'settings', label: 'Settings', active: false },
            ].map((item) => (
                <div key={item.icon} className="flex items-center gap-3 px-3 py-2 rounded-full text-[12px] font-medium cursor-pointer transition-colors" style={{ backgroundColor: item.active ? s.secondaryContainer : 'transparent', color: item.active ? s.onSecondaryContainer : s.onSurfaceVariant }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: `'FILL' ${item.active ? 1 : 0}, 'wght' 400` }}>{item.icon}</span>
                    {item.label}
                </div>
            ))}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col gap-6" style={{ backgroundColor: s.surfaceContainerLow }}>
            <div className="flex items-center justify-between">
                <h2 className="text-[24px] tracking-tight font-display" style={{ color: s.onBg }}>My Garden</h2>
                <div className="flex gap-2">
                    <button className="rounded-full px-4 py-2 text-[11px] font-bold text-transform-secondary tracking-wider" style={{ backgroundColor: s.primary, color: s.onPrimary }}>Add Plant</button>
                </div>
            </div>
            <div className="rounded-[16px] p-4 flex gap-3" style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}>
                <Leaf size={16} className="mt-0.5 shrink-0" />
                <p className="text-[12px] leading-snug font-medium">Winter care tip: Most houseplants need 30-50% less water during the cold months.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {[
                    { title: 'Living Room', icon: '🪴', count: 4, tasks: 2 },
                    { title: 'Kitchen', icon: '🌿', count: 3, tasks: 1 },
                    { title: 'Bedroom', icon: '🌵', count: 5, tasks: 3 },
                    { title: 'Bathroom', icon: '🌺', count: 2, tasks: 0 },
                    { title: 'Office', icon: '🌱', count: 6, tasks: 2 },
                    { title: 'Balcony', icon: '🌻', count: 3, tasks: 1 },
                ].map((room, i) => (
                    <div key={i} className="rounded-[16px] p-4 relative overflow-hidden" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                        <h3 className="text-[13px] font-semibold mb-1 font-display" style={{ color: s.primary }}>{room.title}</h3>
                        <p className="text-[11px] opacity-70 mb-1">{room.count} plants</p>
                        {room.tasks > 0 && (
                            <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: s.primary, color: s.onPrimary }}>{room.tasks} tasks</span>
                        )}
                        <div className="absolute -bottom-2 -right-1 text-[44px] opacity-80">{room.icon}</div>
                    </div>
                ))}
            </div>
        </div>
        <div className="shrink-0 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 border-l" style={{ width: 220, backgroundColor: s.surfaceContainerHigh, borderColor: s.outlineVariant, color: s.onSurfaceVariant }}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <h3 className="text-[14px] font-semibold font-display" style={{ color: s.onBg }}>Today's Tasks</h3>
            {[
                { action: 'Water', plant: 'Monstera', room: 'Living Room' },
                { action: 'Feed', plant: 'Hoya', room: 'Kitchen' },
                { action: 'Prune', plant: 'Ficus', room: 'Bedroom' },
                { action: 'Repot', plant: 'Cactus', room: 'Bedroom' },
            ].map((task, i) => (
                <div key={i} className="flex items-start gap-2">
                    <div className="w-[14px] h-[14px] rounded-[3px] flex items-center justify-center mt-0.5 shrink-0" style={{ backgroundColor: s.primary, color: s.onPrimary }}>
                        <Check size={9} strokeWidth={3.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium leading-tight">{task.action} {task.plant}</span>
                        <span className="text-[9px] opacity-60">{task.room}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PreviewSelector = ({
    windowClass, onWindowClassChange,
    platform, onPlatformChange,
    scheme,
}: {
    windowClass: WindowClass;
    onWindowClassChange: (wc: WindowClass) => void;
    platform: DevicePlatform;
    onPlatformChange: (p: DevicePlatform) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scheme: any;
}) => {
    const activeBg = hexFromArgb(scheme.primary);
    const activeText = hexFromArgb(scheme.onPrimary);
    const inactiveText = hexFromArgb(scheme.onSurface);
    const trackBg = hexFromArgb(scheme.surfaceContainerHigh);
    const border = hexFromArgb(scheme.outlineVariant);
    const wcInfo = WINDOW_CLASSES.find(w => w.id === windowClass)!;

    return (
        <div className="flex flex-col items-center gap-3 mb-4">
            <div className="flex rounded-full p-[3px] gap-[3px]" style={{ backgroundColor: trackBg, border: `1px solid ${border}` }}>
                {WINDOW_CLASSES.map(({ id, label }) => {
                    const isActive = windowClass === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onWindowClassChange(id)}
                            className="px-5 py-2 rounded-full text-[12px] font-bold text-transform-secondary tracking-widest transition-all duration-200"
                            style={{ backgroundColor: isActive ? activeBg : 'transparent', color: isActive ? activeText : inactiveText }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
            {windowClass === 'compact' && (
                <div className="flex rounded-full p-[2px] gap-[2px]" style={{ backgroundColor: hexFromArgb(scheme.surfaceContainer), border: `1px solid ${border}` }}>
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
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold text-transform-secondary tracking-widest transition-all duration-200"
                                style={{ backgroundColor: isActive ? hexFromArgb(scheme.secondaryContainer) : 'transparent', color: isActive ? hexFromArgb(scheme.onSecondaryContainer) : inactiveText }}
                            >
                                <span className="text-[12px] leading-none">{emoji}</span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
            <div className="flex items-center gap-2 text-[10px] font-dev text-transform-tertiary px-3 py-1 rounded-sm" style={{ color: hexFromArgb(scheme.onSurfaceVariant), backgroundColor: hexFromArgb(scheme.surfaceContainerLow) }}>
                <span>{wcInfo.desc}</span>
            </div>
        </div>
    );
};

export interface DevicePreviewStageProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scheme: any;
}

export const DevicePreviewStage: React.FC<DevicePreviewStageProps> = ({ scheme }) => {
    const [windowClass, setWindowClass] = useState<WindowClass>('compact');
    const [platform, setPlatform] = useState<DevicePlatform>('ios');

    const s: Record<string, string> = {
        bg: hexFromArgb(scheme.surface),
        onBg: hexFromArgb(scheme.onSurface),
        primary: hexFromArgb(scheme.primary),
        onPrimary: hexFromArgb(scheme.onPrimary),
        primaryContainer: hexFromArgb(scheme.primaryContainer),
        onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
        secondaryContainer: hexFromArgb(scheme.secondaryContainer),
        onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
        tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
        onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
        outlineVariant: hexFromArgb(scheme.outlineVariant),
        surfaceVariant: hexFromArgb(scheme.surfaceVariant),
        onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
        surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
        surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
        surfaceContainer: hexFromArgb(scheme.surfaceContainer),
        surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
        surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
        shadow: hexFromArgb(scheme.shadow),
    };

    const isBoth = platform === 'both';

    return (
        <div className="w-full flex flex-col items-center">
            <PreviewSelector windowClass={windowClass} onWindowClassChange={setWindowClass} platform={platform} onPlatformChange={setPlatform} scheme={scheme} />
            <motion.div
                key={`${windowClass}-${platform}`}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="flex items-start gap-8"
            >
                {windowClass === 'compact' ? (
                    isBoth ? (
                        <>
                            <div className="flex flex-col items-center gap-3">
                                <PhoneFrame deviceKey="android" s={s} />
                                <p className="text-[9px] font-dev text-transform-tertiary opacity-50 text-transform-secondary tracking-widest" style={{ color: s.onBg }}>{DEVICE_SPECS.android.name} · {DEVICE_SPECS.android.spec}</p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <PhoneFrame deviceKey="ios" s={s} />
                                <p className="text-[9px] font-dev text-transform-tertiary opacity-50 text-transform-secondary tracking-widest" style={{ color: s.onBg }}>{DEVICE_SPECS.ios.name} · {DEVICE_SPECS.ios.spec}</p>
                            </div>
                        </>
                    ) : (
                        <PhoneFrame deviceKey={platform as keyof typeof DEVICE_SPECS} s={s} />
                    )
                ) : windowClass === 'medium' ? (
                    <div className="relative flex flex-col overflow-hidden shadow-2xl rounded-[20px]" style={{ width: 600, height: 820, border: `6px solid ${s.outlineVariant}`, backgroundColor: s.surfaceContainerLowest, color: s.onBg }}>
                        <div className="h-7 w-full flex items-center justify-between px-5 shrink-0 text-[10px] font-medium" style={{ color: s.onBg }}>
                            <span className="tabular-nums">22:50</span>
                            <div className="flex gap-1.5 items-center opacity-80">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L1 3C5 1 19 1 23 3L12 21Z" /></svg>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22Z" /></svg>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z" /></svg>
                            </div>
                        </div>
                        <TabletScreenContent s={s} />
                    </div>
                ) : (
                    <div className="relative flex flex-col overflow-hidden shadow-2xl rounded-[12px]" style={{ width: 1040, height: 680, border: `4px solid ${s.outlineVariant}`, backgroundColor: s.surfaceContainerLowest, color: s.onBg }}>
                        <div className="h-8 w-full flex items-center px-4 gap-2 shrink-0 border-b" style={{ backgroundColor: s.surfaceContainerHighest, borderColor: s.outlineVariant }}>
                            <div className="flex gap-1.5">
                                <div className="w-[10px] h-[10px] rounded-full bg-red-400" />
                                <div className="w-[10px] h-[10px] rounded-full bg-yellow-400" />
                                <div className="w-[10px] h-[10px] rounded-full bg-green-400" />
                            </div>
                            <span className="text-[10px] font-medium opacity-50 ml-2 flex-1 text-center" style={{ color: s.onSurfaceVariant }}>Plantify — Material 3 Desktop</span>
                        </div>
                        <DesktopScreenContent s={s} />
                    </div>
                )}
            </motion.div>
            {windowClass === 'compact' && !isBoth && (
                <p className="mt-5 text-[10px] font-dev text-transform-tertiary opacity-40" style={{ color: hexFromArgb(scheme.onSurface) }}>
                    1px ≈ 1.09{platform === 'ios' ? 'pt' : 'dp'} at this preview scale
                </p>
            )}
        </div>
    );
};
