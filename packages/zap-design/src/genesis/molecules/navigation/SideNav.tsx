'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronDown,
    Palette,
    Box,
    Component,
    Layers,
    Layout,
    Columns,
    FileText,
    Database
} from 'lucide-react';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { cn } from '../../../lib/utils';
import Link from 'next/link';
import { useTheme, AppTheme } from '../../../components/ThemeContext';
import { ContainerDevWrapper } from '../../../components/dev/ContainerDevWrapper';
import { Switch } from '../../../genesis/atoms/interactive/switch';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { motion, AnimatePresence } from 'framer-motion';
import { getTheme } from '../../../themes/registry';
import { getMoleculesForTheme, getMoleculesByCategory } from '../../../themes/molecule-registry';
import { getAtomsForTheme, getAtomsByCategory } from '../../../themes/atom-registry';
import { getFoundationsForTheme, getFoundationsByCategory } from '../../../themes/foundation-registry';
import { useWorkspaceStore } from '../../../store/workspace-store';

type NavItem = string | { title: string; items: string[] };

interface Category {
    id: string;
    title: string;
    icon: React.ElementType;
    items: NavItem[];
}

const NAV_DATA: Category[] = [
    // L1 to L4 are populated dynamically from their respective registries inside the component.
    {
        id: 'L5', title: 'L5: Organisms (0)', icon: Layout, items: []
    },
    {
        id: 'L6', title: 'L6: Layouts (0)', icon: Columns, items: []
    },
    {
        id: 'L7', title: 'L7: Pages (3)', icon: FileText, items: [
            'User Management',
            { title: 'Tables', items: ['System Logs'] },
            { title: 'Authentication', items: ['Signin'] }
        ]
    },
    {
        id: 'SYS',
        title: 'System: Build',
        icon: Database,
        items: [
            'Design Audit',
            'Typography Architect',
            'Data Grid',
            'Kanban Board',
            'Navigation Menu',
            'Interactive Elements Gallery',
            'User Profile Header',
            'Authentication Scaffolds',
            'Master Vertical Shell',
            'Auth Layout Split',
            'Empty State Container',
            'Settings/Account Layout'
        ]
    }
];

const THEMES: AppTheme[] = ['core', 'metro', 'neo', 'wix'];

// Helper functions for readability
// Builds the L4 molecule items dynamically from the active theme's registry.
const buildDynamicL4 = (theme: string): Category => {
    const themeConfig = getTheme(theme);
    const moleculeIds = themeConfig?.features.hasMolecules || [];
    const grouped = getMoleculesByCategory(moleculeIds);
    const categories = Object.keys(grouped);

    const items: NavItem[] = [];
    const flatItems: string[] = [];

    // 1. Gather all items that do not have another level of navigation (<= 4 items), EXCLUDING the strictly ordered groups
    const orderedGroups = ['Feedback', 'Navigation'];
    for (const cat of categories) {
        const mols = grouped[cat];
        if (mols.length <= 4 && !orderedGroups.includes(cat)) {
            for (const mol of mols) flatItems.push(mol.label);
        }
    }

    // Sort the flat items alphabetically and push them to the nav list
    flatItems.sort((a, b) => a.localeCompare(b));
    for (const item of flatItems) {
        items.push(item);
    }

    // 2. Append the grouped categories in the explicitly requested order
    for (const cat of orderedGroups) {
        if (grouped[cat]) {
            const sortedLabels = grouped[cat].map(a => a.label).sort((a, b) => a.localeCompare(b));
            items.push({ title: cat, items: sortedLabels });
        }
    }

    // 3. Catch any other grouped categories and sort them alphabetically
    const otherGroups = categories.filter(c => grouped[c].length > 4 && !orderedGroups.includes(c)).sort();
    for (const cat of otherGroups) {
        const sortedLabels = grouped[cat].map(a => a.label).sort((a, b) => a.localeCompare(b));
        items.push({ title: cat, items: sortedLabels });
    }

    return {
        id: 'L4',
        title: `L4: Molecules (${moleculeIds.length})`,
        icon: Layers,
        items,
    };
};

// Builds the L3 atom items dynamically from the active theme's registry.
const buildDynamicL3 = (theme: string): Category => {
    const themeConfig = getTheme(theme);
    const atomIds = themeConfig?.features.hasAtoms || [];
    const grouped = getAtomsByCategory(atomIds);
    const categories = Object.keys(grouped);

    const items: NavItem[] = [];
    const flatItems: string[] = [];

    // 1. Gather all items that do not have another level of navigation (<= 4 items), EXCLUDING the strictly ordered groups
    const orderedGroups = ['Inputs', 'Data Display', 'Layout'];
    for (const cat of categories) {
        const atoms = grouped[cat];
        if (atoms.length <= 4 && !orderedGroups.includes(cat)) {
            for (const atom of atoms) flatItems.push(atom.label);
        }
    }

    // Sort the flat items alphabetically and push them to the nav list
    flatItems.sort((a, b) => a.localeCompare(b));
    for (const item of flatItems) {
        items.push(item);
    }

    // 2. Append the grouped categories in the explicitly requested order
    for (const cat of orderedGroups) {
        if (grouped[cat]) {
            const sortedLabels = grouped[cat].map(a => a.label).sort((a, b) => a.localeCompare(b));
            items.push({ title: cat, items: sortedLabels });
        }
    }

    // 3. Catch any other grouped categories and sort them alphabetically
    const otherGroups = categories.filter(c => grouped[c].length > 4 && !orderedGroups.includes(c)).sort();
    for (const cat of otherGroups) {
        const sortedLabels = grouped[cat].map(a => a.label).sort((a, b) => a.localeCompare(b));
        items.push({ title: cat, items: sortedLabels });
    }

    return {
        id: 'L3',
        title: `L3: Atoms (${atomIds.length})`,
        icon: Component,
        items,
    };
};

// Builds foundation navigation dynamically from active theme registry (L1/L2)
const buildDynamicFoundations = (theme: string, type: 'L1: Tokens' | 'L2: Primitives'): Category => {
    const themeConfig = getTheme(theme);
    const foundationIds = themeConfig?.features.hasFoundations || [];
    const grouped = getFoundationsByCategory(foundationIds);
    const targets = grouped[type] || [];
    
    const items = targets.map(f => f.label);
    
    if (type === 'L1: Tokens') {
        items.unshift('Materials');
    }

    return {
        id: type === 'L1: Tokens' ? 'L1' : 'L2',
        title: `${type} (${items.length})`,
        icon: type === 'L1: Tokens' ? Palette : Box,
        items,
    };
};

// Builds the atom-label → href mapping from the registry.
const buildAtomHrefs = (theme: string): Record<string, string> => {
    const themeConfig = getTheme(theme);
    const atomIds = themeConfig?.features.hasAtoms || [];
    const atoms = getAtomsForTheme(atomIds);
    const hrefs: Record<string, string> = {};
    for (const atom of atoms) {
        hrefs[atom.label] = `/design/${theme}/atoms/${atom.id}`;
    }
    return hrefs;
};

// Builds the foundation-label → href mapping from the registry.
const buildFoundationHrefs = (theme: string): Record<string, string> => {
    const themeConfig = getTheme(theme);
    const foundationIds = themeConfig?.features.hasFoundations || [];
    const foundations = getFoundationsForTheme(foundationIds);
    const hrefs: Record<string, string> = {};
    for (const f of foundations) {
        hrefs[f.label] = `/design/${theme}/foundations/${f.id}`;
    }
    return hrefs;
};

// Builds the molecule-label → href mapping from the registry.
const buildMoleculeHrefs = (theme: string): Record<string, string> => {
    const themeConfig = getTheme(theme);
    const moleculeIds = themeConfig?.features.hasMolecules || [];
    const molecules = getMoleculesForTheme(moleculeIds);
    const hrefs: Record<string, string> = {};
    for (const mol of molecules) {
        hrefs[mol.label] = `/design/${theme}/molecules/${mol.id}`;
    }
    return hrefs;
};

const getHref = (item: string, theme: string, activeWorkspaceId?: string | null) => {
    // Check dynamic registries first (theme-aware)
    const foundationHrefs = buildFoundationHrefs(theme);
    if (foundationHrefs[item]) return foundationHrefs[item];

    const atomHrefs = buildAtomHrefs(theme);
    if (atomHrefs[item]) return atomHrefs[item];

    const moleculeHrefs = buildMoleculeHrefs(theme);
    if (moleculeHrefs[item]) return moleculeHrefs[item];

    const map: Record<string, string> = {
        // L1 Virtual
        'Materials': `/design/${theme}`,

        // System
        'Design Audit': '/design/audit',
        'Typography Architect': `/design/${theme}/labs/typography-architect`,

        // Static fallbacks
        'Wireframe': `/design/${theme}/template`,
        'Component Registry': '/design/swarm/registry',

        // L5 Organisms — use theme path
        'Data Grid': `/design/${theme}/organisms/data-grid`,
        'Kanban Board': `/design/${theme}/organisms/kanban-board`,
        'Navigation Menu': `/design/${theme}/organisms/navigation-menu`,
        'Interactive Elements Gallery': `/design/${theme}/organisms/interactive-gallery`,
        'User Profile Header': `/design/${theme}/organisms/user-profile-header`,
        'Authentication Scaffolds': `/design/${theme}/organisms/auth-scaffold`,

        // L7 Pages
        'Signin': `/design/${theme}/signin`,
        'Infrastructure': '/admin/infrastructure',
        'System Logs': `/design/${theme}/organisms/system-logs`,
        'User Management': `/design/${theme}/organisms/user-management`,

        // Pos/Kiosk/Web
        'Terminal': '/kiosk',
        'Orders': '/kiosk/orders',
        'Overview': '/storefront',
        'Products': '/storefront/products',
        'Customers': '/storefront/customers',

        // Ops
        'Master Data': '/inventory/master',
        'Receive Goods': '/inventory/receive',
        'Waste Logging': '/inventory/waste',
        'Daily Ops': '/ops',
        'Shifts': '/ops/shifts',

        // Settings
        'General': '/settings',
        'Security': '/settings/security',
        'Devices': '/provisioning',
        'Fleet': '/provisioning/fleet',
        'Telemetry': '/infrastructure',
        'Database': '/infrastructure/db',

        // Mission Control
        'Radar': '/mission-control',
        'Fleet Status': '/mission-control/fleet',
        'Jobs': '/mission-control/jobs',
        'Agents': '/mission-control/agents',
        'Registry': '/mission-control/swarm/registry',
    };

    if (activeWorkspaceId === 'zap-auth' && item === 'User Management') {
        return `/auth/${theme}/user-management`;
    }

    return map[item] || '#';
};

export interface SideNavProps {
    showDevWrapper?: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({ showDevWrapper = false }) => {
    const { theme, setTheme, devMode, setDevMode, sidebarState, setSidebarState, openCategories, setOpenCategories } = useTheme();
    const isDev = showDevWrapper && devMode;
    const pathname = usePathname();
    const router = useRouter();

    // Build dynamic categories from registries
    const dynamicL1 = React.useMemo(() => buildDynamicFoundations(theme, 'L1: Tokens'), [theme]);
    const dynamicL2 = React.useMemo(() => buildDynamicFoundations(theme, 'L2: Primitives'), [theme]);
    const dynamicL3 = React.useMemo(() => buildDynamicL3(theme), [theme]);
    const dynamicL4 = React.useMemo(() => buildDynamicL4(theme), [theme]);
    
    const { activeWorkspaceId, getActiveWorkspace } = useWorkspaceStore();

    const EFFECTIVE_NAV = React.useMemo(() => {
        if (activeWorkspaceId !== 'zap-design') {
            const ws = getActiveWorkspace();
            
            // Generate domain-specific or workspace-specific navigation trees
            // tracking the newly migrated pages exactly.
            if (ws?.id === 'pos-kiosk') {
                return [{ id: 'kiosk', title: 'Kiosk System', icon: Layout, items: ['Terminal', 'Orders'] }];
            }
            if (ws?.id === 'pos-web') {
                return [{ id: 'web', title: 'Storefront', icon: Layout, items: ['Overview', 'Products', 'Customers'] }];
            }
            if (activeWorkspaceId === 'ops-main') {
                return [
                    { id: 'inventory', title: 'Inventory', icon: Box, items: ['Master Data', 'Receive Goods', 'Waste Logging'] },
                    { id: 'ops', title: 'Operations', icon: Layout, items: ['Daily Ops', 'Shifts'] }
                ];
            }
            if (activeWorkspaceId === 'ops-settings') {
                return [
                    { id: 'settings', title: 'System Settings', icon: Columns, items: ['General', 'Security'] },
                    { id: 'prov', title: 'Provisioning', icon: Database, items: ['Devices', 'Fleet'] },
                    { id: 'infra', title: 'Infrastructure', icon: Database, items: ['Telemetry', 'Database'] }
                ];
            }
            if (activeWorkspaceId === 'agent-dash') {
                return [
                    { id: 'mc', title: 'Mission Control', icon: Layout, items: ['Radar', 'Fleet Status'] },
                    { id: 'swarm', title: 'Swarm Metrics', icon: Box, items: ['Jobs', 'Agents', 'Registry'] }
                ];
            }
            if (activeWorkspaceId === 'zap-auth') {
                return [
                    { id: 'auth-main', title: 'ZAP-AUTH MAIN', icon: Layout, items: ['Dashboard', 'Overview', 'Reports'] },
                    { id: 'auth-prefs', title: 'SYSTEM PREFERENCES', icon: Columns, items: ['User Management', 'Settings', 'Access Control'] }
                ];
            }
            
            // Default generic tree for other workspaces
            return [
                {
                    id: 'ws-main',
                    title: `${ws?.name || 'Workspace'} Main`,
                    icon: Layout,
                    items: ['Dashboard', 'Overview', 'Reports']
                },
                {
                    id: 'ws-settings',
                    title: 'System Preferences',
                    icon: Columns,
                    items: ['Settings', 'Access Control']
                }
            ];
        }

        const nav = [...NAV_DATA];
        const sysIndex = nav.findIndex(c => c.id === 'L5');
        // Insert L1, L2, L3, L4 before L5 (Organisms)
        nav.splice(sysIndex, 0, dynamicL1, dynamicL2, dynamicL3, dynamicL4);
        return nav;
    }, [dynamicL1, dynamicL2, dynamicL3, dynamicL4, activeWorkspaceId, getActiveWorkspace]);

    const activeHref = React.useMemo(() => {
        if (!pathname) return null;
        let bestMatch = '';
        for (const category of EFFECTIVE_NAV) {
            for (const item of category.items) {
                if (typeof item === 'string') {
                    const href = getHref(item, theme, activeWorkspaceId);
                    if (href && (pathname === href || pathname.startsWith(href + '/'))) {
                        if (href.length > bestMatch.length) bestMatch = href;
                    }
                } else {
                    for (const subItem of item.items) {
                        const href = getHref(subItem, theme, activeWorkspaceId);
                        if (href && (pathname === href || pathname.startsWith(href + '/'))) {
                            if (href.length > bestMatch.length) bestMatch = href;
                        }
                    }
                }
            }
        }
        return bestMatch || pathname;
    }, [pathname, theme, EFFECTIVE_NAV, activeWorkspaceId]);

    const [isHovered, setIsHovered] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [openSubGroups, setOpenSubGroups] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isExpanded = sidebarState === 'expanded';
    const isMinified = sidebarState === 'minified';
    const isCollapsed = sidebarState === 'collapsed';

    // The "Peek" logic: if minified and hovered, it should look expanded but overlay
    const isPeeking = isMinified && isHovered;
    const effectivelyExpanded = isExpanded || isPeeking;

    React.useEffect(() => {
        if (!pathname) return;
        const activeLayout = THEMES.find(t => pathname.includes(`/${t}/`));
        if (activeLayout && activeLayout !== theme) {
            setTheme(activeLayout);
        }

        // 1. Ensure the category containing the active item is open
        let activeCategoryId: string | null = null;
        let activeSubGroupKey: string | null = null;
        for (const category of EFFECTIVE_NAV) {
            for (const item of category.items) {
                if (typeof item === 'string') {
                    const href = getHref(item, theme, activeWorkspaceId);
                    if (href !== '' && href === activeHref) {
                        activeCategoryId = category.id;
                        break;
                    }
                } else {
                    for (const subItem of item.items) {
                        const href = getHref(subItem, theme, activeWorkspaceId);
                        if (href !== '' && href === activeHref) {
                            activeCategoryId = category.id;
                            activeSubGroupKey = `${category.id}-${item.title}`;
                            break;
                        }
                    }
                }
            }
            if (activeCategoryId) break;
        }

        if (activeCategoryId) {
            setOpenCategories(prev => {
                // To fulfill "out of focus other": we only keep the active category open.
                // Avoid redundant state updates if it's already the ONLY open category.
                const isOpenOnly = prev[activeCategoryId] && Object.keys(prev).filter(k => prev[k]).length === 1;
                if (isOpenOnly) return prev;
                
                return { [activeCategoryId]: true };
            });
        }

        if (activeSubGroupKey) {
            setOpenSubGroups(prev => {
                const isOpenOnly = prev[activeSubGroupKey] && Object.keys(prev).filter(k => prev[k]).length === 1;
                if (isOpenOnly) return prev;
                return { [activeSubGroupKey]: true };
            });
        } else {
            setOpenSubGroups({});
        }

        // 2. Smooth scroll the active navigation item into view after a short delay
        const scrollActiveItem = () => {
            const activeItem = document.querySelector('[data-sidebar-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        setTimeout(scrollActiveItem, 400); // Wait for AnimatePresence accordion to expand

    }, [pathname, theme, setTheme, setOpenCategories, EFFECTIVE_NAV, activeWorkspaceId, activeHref]);

    const toggleCategory = (id: string) => {
        if (isMinified && !isPeeking) {
            setSidebarState('expanded');
            setOpenCategories({ [id]: true });
            return;
        }
        setOpenCategories(prev => {
            if (prev[id]) return {};
            return { [id]: true };
        });
    };

    const toggleSidebar = () => {
        if (isExpanded) setSidebarState('minified');
        else setSidebarState('expanded');
    };

    if (isCollapsed) return null;

    const content = (
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-region="sidebar"
            className={cn(
                "group/sidebar relative flex flex-col h-full bg-layer-panel border-r border-black text-on-surface text-transform-primary transition-all duration-300 ease-in-out z-[100]",
                isMinified && !isPeeking ? "w-[72px]" : "w-[280px]",
                isPeeking && "shadow-2xl translate-x-0"
            )}
        >
            {/* Edge Toggle Icon - Metronic Reference */}
            <button
                onClick={toggleSidebar}
                title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                className={cn(
                    "absolute -right-3.5 top-3.5 z-[200] w-7 h-7 bg-primary text-on-primary hover:bg-primary/90 rounded-[var(--button-border-radius,8px)] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 outline-none",
                    !isExpanded && "opacity-0 group-hover/sidebar:opacity-100"
                )}
            >
                <div className="flex items-center justify-center w-full h-full">
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex items-center justify-center translate-x-[-0.5px]"
                    >
                        <Icon name="chevron_left" size={16} weight={700} />
                    </motion.div>
                </div>
            </button>

            {/* Top Logo Area - Aligned to MetroHeader */}
            <div className={cn(
                "h-[var(--sys-header-height,3.5rem)] flex items-center shrink-0 w-full overflow-hidden transition-all duration-300 border-b border-black",
                effectivelyExpanded ? "px-6" : "px-0 justify-center"
            )}>
                <Image
                    src="/zap-logo.png"
                    alt="ZAP Logo"
                    width={45}
                    height={45}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    priority
                />
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-1">
                {EFFECTIVE_NAV.map((category) => {
                    const isOpen = openCategories[category.id] && (effectivelyExpanded);
                    const hasItems = category.items.length > 0;
                    const IconComp = category.icon;
                    const isActive = isActiveLevel(category.id);

                    return (
                        <div key={category.id} className="flex flex-col">
                            <motion.button
                                onClick={() => toggleCategory(category.id)}
                                title={!effectivelyExpanded ? category.title : undefined}
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full flex items-center rounded-lg transition-all duration-200 outline-none text-left",
                                    !effectivelyExpanded ? "justify-center py-3" : "justify-between px-3 py-2.5",
                                    isActive ? "bg-primary/10 text-on-surface ring-1 ring-primary/20" : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface"
                                )}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <IconComp size={20} strokeWidth={isActive ? 2.5 : 1.5} className={cn(isActive ? "text-primary" : "text-on-surface-variant opacity-70")} />
                                    {effectivelyExpanded && (
                                        <span className="font-display font-medium text-titleSmall text-transform-primary tracking-tight whitespace-nowrap">
                                            {category.title}
                                        </span>
                                    )}
                                </div>
                                {effectivelyExpanded && (
                                    <div className="text-on-surface-variant text-transform-secondary/50">
                                        <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
                                            <ChevronDown size={14} strokeWidth={2.5} />
                                        </motion.div>
                                    </div>
                                )}
                            </motion.button>

                            {/* Inner Items */}
                            <AnimatePresence>
                                {isOpen && hasItems && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="flex flex-col m-0 pl-11 overflow-hidden group/navlist"
                                    >
                                        {category.items.map((item, itemIdx) => {
                                            if (typeof item === 'string') {
                                                const href = getHref(item, theme, activeWorkspaceId);
                                                const isItemActive = mounted && href !== '' && href === activeHref;

                                                return (
                                                    <motion.div
                                                        key={`str-${item}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: itemIdx * 0.03 }}
                                                    >
                                                            <Link
                                                                href={href || '#'}
                                                                data-sidebar-active={isItemActive}
                                                                className={cn(
                                                                    "relative block py-1.5 px-3 -ml-3 rounded-md text-bodyMedium transition-all duration-300 outline-none font-body text-transform-secondary tracking-tight",
                                                                    isItemActive
                                                                        ? "bg-primary-container text-on-primary-container font-bold border border-primary-container shadow-[var(--md-sys-elevation-level1)]"
                                                                        : "text-on-surface-variant opacity-70 hover:text-on-surface hover:bg-on-surface/5 group-hover/navlist:opacity-40 hover:!opacity-100"
                                                                )}
                                                            >
                                                            {isItemActive && (
                                                                <motion.div
                                                                    layoutId="sidebar-active-indicator"
                                                                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--sys-color-primary-rgb),0.6)]"
                                                                />
                                                            )}
                                                            {item}
                                                        </Link>
                                                    </motion.div>
                                                );
                                            } else {
                                                return (
                                                    <motion.div
                                                        key={`grp-${item.title}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: itemIdx * 0.03 }}
                                                        className="flex flex-col mt-2 mb-1"
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                const key = `${category.id}-${item.title}`;
                                                                setOpenSubGroups(prev => {
                                                                    if (prev[key]) return {};
                                                                    return { [key]: true };
                                                                });
                                                            }}
                                                            className="flex items-center justify-between w-full outline-none group/subgroup cursor-pointer hover:bg-on-surface/5 rounded px-2 py-1.5 -ml-2 mb-1 transition-colors"
                                                        >
                                                            <div className="text-bodyMedium font-body text-on-surface-variant opacity-80 group-hover/subgroup:opacity-100 text-transform-secondary tracking-tight transition-opacity font-medium">
                                                                {item.title}
                                                            </div>
                                                            <motion.div 
                                                                animate={{ rotate: (openSubGroups[`${category.id}-${item.title}`]) ? 0 : -90 }}
                                                                className="text-on-surface-variant opacity-50 group-hover/subgroup:opacity-100 transition-opacity"
                                                            >
                                                                <ChevronDown size={14} strokeWidth={2.5} />
                                                            </motion.div>
                                                        </button>
                                                        <AnimatePresence initial={false}>
                                                            {(openSubGroups[`${category.id}-${item.title}`]) && (
                                                                <motion.div 
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                                    className="flex flex-col border-l border-primary/20 ml-2 pl-3 space-y-0.5 overflow-hidden"
                                                                >
                                                                    {item.items.map((subItem) => {
                                                                        const href = getHref(subItem, theme, activeWorkspaceId);
                                                                        const isItemActive = mounted && href !== '' && href === activeHref;
                                                                        return (
                                                                            <Link
                                                                                href={href || '#'}
                                                                                key={subItem}
                                                                                data-sidebar-active={isItemActive}
                                                                                className={cn(
                                                                                    "relative block py-1.5 px-3 -ml-3 rounded-md text-[12px] transition-all duration-300 outline-none font-body text-transform-secondary",
                                                                                    isItemActive
                                                                                        ? "bg-primary-container text-on-primary-container font-bold border border-primary-container shadow-[var(--md-sys-elevation-level1)]"
                                                                                        : "text-on-surface-variant opacity-60 hover:text-on-surface hover:bg-on-surface/5 group-hover/navlist:opacity-40 hover:!opacity-100"
                                                                                )}
                                                                            >
                                                                                {isItemActive && (
                                                                                    <motion.div
                                                                                        layoutId="sidebar-active-indicator"
                                                                                        className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--sys-color-primary-rgb),0.5)]"
                                                                                    />
                                                                                )}
                                                                                {subItem}
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                );
                                            }
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Footer Area */}
            {effectivelyExpanded && (
                <div className="mt-auto px-6 pb-3 pt-3 flex flex-col gap-3 bg-transparent border-t border-black">
                    {/* Theme Switcher */}
                    <div className="flex w-full bg-layer-dialog border border-outline-variant/50 rounded-[var(--button-border-radius,9999px)] p-1 shadow-inner gap-0.5">
                        {THEMES.map(t => (
                            <Button
                                key={t}
                                onClick={() => {
                                    React.startTransition(() => {
                                        setTheme(t as AppTheme);
                                        // Update local storage to force preference
                                        localStorage.setItem('zap-theme-preference', t);
                                        if (pathname) {
                                            // Replace the current theme in the path with the newly selected theme
                                            const newPath = pathname.replace(`/${theme}`, `/${t}`) + window.location.search;
                                            if (newPath !== pathname) {
                                                router.push(newPath);
                                            }
                                        }
                                    });
                                }}
                                visualStyle={(mounted ? theme : 'metro') === t ? 'tonal' : 'ghost'}
                                color="secondary"
                                size="tiny"
                                className="flex-1 w-auto min-w-0" // Flexible inner pills
                            >
                                {t}
                            </Button>
                        ))}
                    </div>

                    {/* Dev Mode Toggle */}
                    <div className="flex items-center justify-between bg-layer-dialog py-2 px-3 rounded-lg border border-outline-variant/50">
                        <span className="font-dev text-[10px] tracking-widest opacity-70 text-transform-tertiary">Dev Status</span>
                        <Switch
                            checked={devMode}
                            onCheckedChange={setDevMode}
                            className="scale-75"
                        />
                    </div>
                </div>
            )}
        </aside>
    );
    if (isDev) {
        return (
            <ContainerDevWrapper
                showClassNames={true}
                identity={{
                    displayName: "SideNav",
                    filePath: "genesis/molecules/navigation/SideNav.tsx",
                    type: "Molecule/Block",
                    architecture: "SYSTEMS // CORE"
                }}
                className="h-full"
            >
                {content}
            </ContainerDevWrapper>
        );
    }

    return content;
};



function isActiveLevel(id: string) {
    return ['SYS', 'LAB', 'L1', 'L2'].includes(id);
}

