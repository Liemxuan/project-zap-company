'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { NavLink } from '../../genesis/atoms/interactive/NavLink';
import { Switch } from '../../genesis/atoms/interactive/switch';
import { useTheme } from '../../components/ThemeContext';
import { ContainerDevWrapper } from '../../components/dev/ContainerDevWrapper';
import { Wrapper } from '../../components/dev/Wrapper';
import { Text } from '../../genesis/atoms/typography/text';

// ─── Route Map ────────────────────────────────────────────────────────────────
export const ATOM_ROUTES: Record<string, string> = {
    'Typography': '/debug/zap/atoms/typography',
    'Color Palette': '/debug/zap/atoms/colors',
    'Grids & Spacing': '/debug/zap/atoms/layout',
    'Iconography': '/debug/zap/atoms/icons',
    'Interactive Elements': '/debug/zap/atoms/interactive',
    'Status & Indicators': '/debug/zap/atoms/status',
    'Canvas, Cover & Panels': '/debug/zap/atoms/layout-layers',
    'Inputs': '/debug/zap/molecules/inputs',
    'Stitch Magic Test': '/debug/zap/labs/stitch-test',
    'Stitch Dropzone': '/debug/zap/labs/stitch-dropzone',
    'Molecule Target': '/debug/zap/labs/stitch-brand-test',
    'Playful Target': '/debug/zap/labs/stitch-playful-test',
};

export const designSystemLevels = [
    { id: 1, label: 'Atoms', items: ['Typography', 'Color Palette', 'Grids & Spacing', 'Iconography', 'Interactive Elements', 'Status & Indicators', 'Canvas, Cover & Panels'], icon: 'widgets', defaultOpen: true },
    { id: 2, label: 'Molecules', items: ['Inputs'], icon: 'hub', defaultOpen: true },
    { id: 3, label: 'Organisms', items: [], icon: 'layers', defaultOpen: false },
    { id: 4, label: 'Templates', items: [], icon: 'grid_view', defaultOpen: false },
    { id: 5, label: 'Pages', items: [], icon: 'article', defaultOpen: false },
    { id: 6, label: 'Utilities', items: [], icon: 'construction', defaultOpen: false },
    { id: 7, label: 'Guidelines', items: [], icon: 'rule', defaultOpen: false },
    { id: 8, label: 'Labs', items: ['Stitch Dropzone', 'Molecule Target', 'Playful Target', 'Stitch Magic Test'], icon: 'science', defaultOpen: true },
];

interface VerticalNavProps {
    width?: number;
    isCollapsed?: boolean;
    activeItem?: string; // kept for backwards compat but pathname wins
}

export const VerticalNav = ({ width = 260, isCollapsed = false }: VerticalNavProps) => {
    const pathname = usePathname();
    const { devMode, setDevMode, theme, setTheme } = useTheme();
    const [openLevelId, setOpenLevelId] = React.useState<number | null>(() => {
        const defaultOpen = designSystemLevels.find(l => l.defaultOpen);
        return defaultOpen ? defaultOpen.id : null;
    });

    // Auto-open the section that contains the current page
    React.useEffect(() => {
        const activeLevel = designSystemLevels.find(l =>
            l.items.some(item => ATOM_ROUTES[item] === pathname)
        );
        if (activeLevel && openLevelId !== activeLevel.id) {
            setOpenLevelId(activeLevel.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleLevel = (id: number) => {
        setOpenLevelId(prev => (prev === id ? null : id));
    };

    return (
        <ContainerDevWrapper
            showClassNames={devMode}
            identity={{
                displayName: "Navigation Sidebar",
                filePath: "zap/layout/VerticalNav.tsx",
                parentComponent: "MasterVerticalShell",
                type: "Organism/Shell",
                architecture: "ZAP // LAYOUT"
            }}
            className="flex-shrink-0 h-full"
            style={{ width: isCollapsed ? 64 : width }}
        >
            <aside
                className="bg-layer-cover flex flex-col w-full overflow-hidden z-20 h-full font-body text-transform-secondary"
            >
                {/* Top Meta Label */}
                {!isCollapsed && (
                    <div className="h-[48px] px-5 flex items-center border-b border-card-border/10">
                        <Wrapper identity={{ displayName: "Nav Header: STYLE ENGINE", type: "Wrapped Snippet", filePath: "zap/layout/VerticalNav.tsx" }}>
                            <Text size="iso-100" weight="black" className="font-display text-transform-primary tracking-[0.2em] text-brand-midnight leading-none">
                                STYLE ENGINE
                            </Text>
                        </Wrapper>
                    </div>
                )}

                <div
                    className="flex-1 px-4 overflow-y-auto scrollbar-hide flex flex-col pt-2 gap-[var(--nav-gap-category,8px)]"
                >
                    {designSystemLevels.map((level) => {
                        const isOpen = openLevelId === level.id;

                        if (isCollapsed) {
                            return (
                                <Wrapper key={level.id} identity={{ displayName: `Nav Category: ${level.label} (Icon)`, type: "Atom/Action", filePath: "zap/layout/VerticalNav.tsx" }}>
                                    <button
                                        onClick={() => toggleLevel(level.id)}
                                        title={level.label}
                                        className={`w-12 h-12 mx-auto flex items-center justify-center transition-all outline-none rounded-btn border-2
                                            ${isOpen
                                                ? 'bg-brand-midnight text-brand-primary border-brand-primary'
                                                : 'bg-white text-brand-midnight border-brand-midnight/10 hover:border-brand-midnight'
                                            }
                                      `}
                                    >
                                        <Icon name={level.icon} size={20} />
                                    </button>
                                </Wrapper>
                            );
                        }

                        return (
                            <div
                                key={level.id}
                                className="flex flex-col gap-[var(--nav-gap-item,4px)]"
                            >
                                {/* Category Header (L1) */}
                                <Wrapper identity={{ displayName: `Nav Category: ${level.id}. ${level.label}`, type: "Organism/Block", filePath: "zap/layout/VerticalNav.tsx" }}>
                                    <button
                                        onClick={() => toggleLevel(level.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 border-b-4 cursor-pointer transition-all outline-none
                                            ${isOpen
                                                ? 'bg-brand-midnight text-white border-brand-primary'
                                                : 'bg-brand-midnight/5 text-brand-midnight border-brand-midnight'
                                            }
                                      `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon name={level.icon} size={16} className={isOpen ? 'text-brand-primary' : ''} />
                                            <Text size="iso-200" weight="black" className="font-display text-transform-primary tracking-tight">{level.id}. {level.label}</Text>
                                        </div>
                                        <Icon name={isOpen ? "expand_more" : "chevron_right"} size={16} />
                                    </button>
                                </Wrapper>

                                {/* Item List (L2) */}
                                {isOpen && level.items.length > 0 && (
                                    <div
                                        className="flex flex-col pl-8 gap-[var(--nav-gap-item,4px)] pb-[var(--nav-expansion-pad,8px)]"
                                    >
                                        {level.items.map((item) => {
                                            const href = ATOM_ROUTES[item] ?? '#';
                                            const isActive = pathname === href;
                                            return (
                                                <Wrapper key={item} identity={{ displayName: `Nav Item: ${item} ${isActive ? '(Active)' : ''}`, type: "Atom/Action", filePath: "zap/layout/VerticalNav.tsx" }}>
                                                    <NavLink
                                                        href={href}
                                                        isActive={isActive}
                                                        className={`w-full py-3 px-5 transition-all border-[3px] border-brand-midnight
                                                            ${isActive
                                                                ? 'bg-brand-primary text-brand-midnight shadow-[4px_4px_0px_0px_#000]'
                                                                : 'bg-white text-brand-midnight hover:bg-layer-panel shadow-none'
                                                            }
                                                      `}
                                                    >
                                                        <Text size="iso-100" weight="black" className="font-display text-transform-primary tracking-[0.05em] whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {item.replace(/ & /g, " ").replace(/,/g, "").split(" ")[0]}
                                                        </Text>
                                                    </NavLink>
                                                </Wrapper>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Tools & Status */}
                {!isCollapsed && (
                    <div className="border-t border-[#0000000a] mt-auto">

                        {/* Theme Switcher */}
                        <div className="p-3 border-b border-[#0000000a]">
                            <div className="flex items-center justify-between gap-1 bg-gray-100 p-1 rounded-sm border border-black/5">
                                {(['core', 'metro', 'neo', 'wix'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`flex-1 text-[9px] font-bold uppercase py-1.5 transition-all outline-none 
                                            ${theme === t
                                                ? 'bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border shadow-card text-brand-midnight'
                                                : 'text-iso-gray-400 hover:text-brand-midnight hover:bg-layer-panel/50 border-[length:var(--card-border-width,0px)] border-transparent'
                                            }
                                      `}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dev Mode Toggle */}
                        <div className="p-3 border-b border-[#0000000a]">
                            <div
                                onClick={() => setDevMode(!devMode)}
                                className={`w-full text-[10px] font-black uppercase px-3 py-2 border-[length:var(--btn-border-width,0px)] rounded-btn transition-all flex items-center justify-between group cursor-pointer ${devMode
                                    ? 'bg-brand-yellow border-btn-border text-brand-midnight shadow-btn'
                                    : 'bg-layer-panel border-transparent text-iso-gray-500 hover:border-btn-border hover:text-brand-midnight'
                                    }`}
                            >
                                <span>Dev Mode</span>
                                <Switch
                                    size="sm"
                                    checked={devMode}
                                    onCheckedChange={setDevMode}
                                    className={!devMode ? 'opacity-70 group-hover:opacity-100 group-hover:border-black' : ''}
                                />
                            </div>
                        </div>

                    </div>
                )}
            </aside>
        </ContainerDevWrapper>
    );
};
