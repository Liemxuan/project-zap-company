'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; import {
    ChevronDown,
    Palette,
    Box,
    Component,
    Layers,
    Layout,
    Columns,
    FileText,
    Database,
    Activity,
    Settings,
    Plus
} from 'lucide-react';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../genesis/molecules/accordion';
import { cn } from '../../../lib/utils';
import Link from 'next/link';
import { NavLink } from '../../../genesis/atoms/interactive/NavLink';
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
import { WORKSPACE_REGISTRY } from '../../../config/workspace-registry';
import { QuickNavigate } from '../../../genesis/molecules/quick-navigate';
import { UserSession } from '../user-session';
import { getSession, logoutAction } from '../../../../../zap-auth/src/actions';

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
        id: 'L5', title: 'L5: Organisms (3)', icon: Layout, items: [
            'Inspector System',
            'Login',
            { title: 'Tables', items: ['System Logs'] }
        ]
    },
    {
        id: 'L6', title: 'L6: Layouts', icon: Columns, items: [
            { title: 'Authentication', items: ['Sign-in A', 'Sign-in B'] },
            { title: 'Tables', items: ['system logs', 'Product List', 'Locations', 'Categories'] }
        ]
    },
    {
        id: 'L7', title: 'L7: Pages (1)', icon: FileText, items: [
            { title: 'Authentication', items: ['Signin'] }
        ]
    },
    {
        id: 'SYS',
        title: 'System: Build',
        icon: Database,
        items: [
            'Merchant Workspace',
            'Design Audit',
            'Typography Architect',
            'Presentation Presets',
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

const getHref = (item: string, theme: string, activeWorkspaceId?: string | null, currentPort?: string | null, pathname?: string | null) => {
    let finalPath = '';

    // If we're in zap-auth workspace, try to detect merchant/lang prefix from current pathname
    let prefix = '';
    if ((activeWorkspaceId === 'merchant-admin' || activeWorkspaceId === 'zap-auth') && pathname) {
        const segments = pathname.split('/').filter(Boolean);
        // Pattern: /[merchant]/[lang]/...
        // Lang is usually 2 chars or matches en/vi/fr/ja
        if (segments.length >= 2 && segments[0] !== 'auth' && segments[0] !== 'design') {
            // If second segment looks like a language code
            if (['en', 'vi', 'fr', 'ja', 'es'].includes(segments[1].toLowerCase())) {
                prefix = `/${segments[0]}/${segments[1]}`;
            }
        }
    }

    // Check dynamic registries first (theme-aware)
    const foundationHrefs = buildFoundationHrefs(theme);
    if (foundationHrefs[item]) finalPath = foundationHrefs[item];

    const atomHrefs = buildAtomHrefs(theme);
    if (!finalPath && atomHrefs[item]) finalPath = atomHrefs[item];

    const moleculeHrefs = buildMoleculeHrefs(theme);
    if (!finalPath && moleculeHrefs[item]) finalPath = moleculeHrefs[item];

    if (!finalPath) {
        const map: Record<string, string> = {
            // L1 Virtual
            'Materials': `/design/${theme}`,

            // System
            'Inspector System': `/design/${theme}/organisms/inspector`,
            'Design Audit': '/design/audit',
            'Typography Architect': `/design/${theme}/labs/typography-architect`,
            'Presentation Presets': `/design/${theme}/features/ppt-presets`,

            // Static fallbacks
            'Wireframe': `/design/${theme}/template`,
            'Component Registry': '/design/swarm/registry',

            // L6 Layouts
            'Merchant Workspace': `/design/${theme}/merchant-workspace`,
            'Sign-in A': `/design/${theme}/organisms/signin-a`,
            'Sign-in B': `/design/${theme}/organisms/signin-b`,
            'system logs': `/design/${theme}/organisms/system-logs-layout`,
            'Product List': `/design/${theme}/organisms/product-list`,
            'Locations': prefix ? `${prefix}/locations` : `/zap/en/locations`,
            'Categories': `/design/${theme}/organisms/categories`,

            // L5 Organisms — use theme path
            'Data Grid': `/design/${theme}/organisms/data-grid`,
            'Kanban Board': `/design/${theme}/organisms/kanban-board`,
            'Navigation Menu': `/design/${theme}/organisms/navigation-menu`,
            'Interactive Elements Gallery': `/design/${theme}/organisms/interactive-gallery`,
            'User Profile Header': `/design/${theme}/organisms/user-profile-header`,
            'Authentication Scaffolds': `/design/${theme}/organisms/auth-scaffold`,
            'Login': `/design/${theme}/organisms/login`,
            'Table List': `/design/${theme}/organisms/table-list`,

            // L7 Pages
            'Signin': `/auth/${theme}/signin`,
            'Infrastructure': '/admin/infrastructure',
            'System Logs': `/design/${theme}/organisms/system-logs`,
            'Product': prefix ? `${prefix}/products` : `/zap/en/products`,
            'Category': prefix ? `${prefix}/categories` : `/zap/en/categories`,
            'Unit': prefix ? `${prefix}/units` : `/zap/en/units`,
            'Brand': prefix ? `${prefix}/brands` : `/zap/en/brands`,
            
            'User Management': `/auth/${theme}/user-management`,
            'Product Management': `/auth/${theme}/product-management`,
            'Modifier Groups': prefix ? `${prefix}/modifier-groups` : `/zap/en/modifier-groups`,
            'Units': `/auth/${theme}/units`,
            'Catalog Vault': `/auth/${theme}/catalog-vault`,
            'Brand Vault': `/auth/${theme}/brand-vault`,

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
            'Radar': `/design/${theme}/mission-control`,
            'Fleet Status': `/design/${theme}/mission-control/fleet`,
            'Jobs': `/design/${theme}/mission-control/jobs`,
            'Agents': `/design/${theme}/mission-control/agents`,
            'Registry': `/design/${theme}/mission-control/swarm/registry`,

            // Swarm Command Center (:3500)
            'Telemetry Monitor': '/swarm/monitor',
            'Port Registry': '/swarm/ports',
            'Swarm Dashboard': '/swarm/',
            'New Chat': '/swarm/chats/new',
            'System Models': '/swarm/models',
            'Agent Roster': '/swarm/agents',
            'API Keys': '/swarm/fleet',
            'Skills Library': '/swarm/skills',
            'Active Sessions': '/swarm/sessions',
            'Communication': '/swarm/channels',
            'Financial': '/swarm/payments',
            'Cost Intelligence': '/swarm/cost',
            'Security Posture': '/swarm/security',
            'Execution History': '/swarm/execution',
            'Audit Log': '/swarm/approvals',
            'Swarm Jobs': '/swarm/jobs',
            'Tools': '/swarm/tools',
        };
        finalPath = map[item] || '';
    }

    if (!finalPath) return '';

    // If already fully qualified
    if (finalPath.startsWith('http')) return finalPath;

    const activeWs = WORKSPACE_REGISTRY.find(w => w.id === activeWorkspaceId);
    const assumedPort = activeWs ? activeWs.port : 3000;

    let targetPort = assumedPort;
    if (finalPath.startsWith('/kiosk')) targetPort = 3200;
    else if (finalPath.startsWith('/pos')) targetPort = 3100;
    else if (finalPath.startsWith('/storefront')) targetPort = 3300;
    else if (finalPath.startsWith('/inventory') || finalPath.startsWith('/ops')) targetPort = 4000;
    else if (finalPath.startsWith('/settings') || finalPath.startsWith('/provisioning')) targetPort = 4100;
    else if (finalPath.startsWith('/infrastructure') || finalPath.startsWith('/admin')) targetPort = 4500;
    else if (finalPath.startsWith('/auth/')) targetPort = 4700;
    else if (finalPath.startsWith('/mission-control')) targetPort = 3600;
    else if (finalPath.startsWith('/reports')) targetPort = 4200;
    else if (finalPath.startsWith('/swarm/') || finalPath === '/swarm/') targetPort = 3500;

    const evaluatingPort = currentPort ? parseInt(currentPort, 10) : assumedPort;

    if (evaluatingPort !== targetPort) {
        return `http://localhost:${targetPort}${finalPath}`;
    }

    // Strip domain prefix when we're already on the target port
    // e.g., on port 3500, '/swarm/agents' becomes '/agents'
    if (targetPort === 3500 && finalPath.startsWith('/swarm')) {
        const stripped = finalPath.replace(/^\/swarm/, '') || '/';
        return stripped;
    }

    return finalPath;
};

import zapLogo from '../../../../public/zap-logo.png';

const SwarmChatNavBody = ({ currentPath }: { currentPath: string }) => {
    const [sessions, setSessions] = React.useState<any[]>([]);
    const searchParams = useSearchParams();
    const agentId = searchParams?.get('agent');

    React.useEffect(() => {
        let mounted = true;
        const fetchSessions = () => {
            const url = agentId ? `/api/swarm/sessions?agent=${agentId}` : '/api/swarm/sessions';
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (mounted && data.success) setSessions(data.sessions || []);
                })
                .catch(() => { });
        };
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000);
        return () => { mounted = false; clearInterval(interval); };
    }, [agentId]);


    const getStatusTheme = (status: string) => {
        if (status === 'COMPLETED') return "bg-state-success";
        if (status === 'PENDING') return "bg-state-warning";
        if (status === 'RUNNING') return "bg-primary";
        return "bg-outline/20";
    };

    return (
        <div className="flex flex-col space-y-2 w-full">
            <Link href="/chats/new" className="w-full mb-2 block">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-md transition-colors w-full overflow-hidden bg-primary/10 border border-primary/10 text-primary hover:bg-primary/20 group justify-center">
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-xs tracking-widest uppercase">NEW CHAT</span>
                </div>
            </Link>

            <div className="flex flex-col gap-0.5">
                {sessions.map(s => {
                    const isActive = currentPath === `/chats/${s.id}` || currentPath.endsWith(s.id);
                    return (
                        <Link
                            key={s.id}
                            href={`/chats/${s.id}`}
                            className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors w-full overflow-hidden",
                                isActive ? "bg-primary/5 text-primary" : "hover:bg-on-surface/5 text-on-surface-variant font-medium",
                                isActive ? "border-none" : "border-none"
                            )}
                        >
                            <div className={cn("shrink-0 size-[5px] rounded-full", getStatusTheme(s.status))} />
                            <span className={cn("font-display text-[10px] tracking-widest uppercase truncate flex-1 leading-tight", isActive ? "font-bold" : "font-semibold opacity-70")}>
                                {s.title || (s.id.startsWith('chat_') ? s.id.toUpperCase() : s.id)}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export interface SideNavProps {
    showDevWrapper?: boolean;
}

const SideNavContent: React.FC<SideNavProps> = ({ showDevWrapper = false }) => {
    const { theme, setTheme, devMode, setDevMode, sidebarState, setSidebarState, openCategories, setOpenCategories, isThemeLocked, setIsThemeLocked } = useTheme();
    const isDev = showDevWrapper && devMode;
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPort, setCurrentPort] = React.useState<string | null>(null);
    const [userSession, setUserSession] = React.useState<any>(null);

    React.useEffect(() => {
        setCurrentPort(window.location.port);

        // Fetch session for the user session pill
        getSession().then((session: any) => {
            if (session && typeof session === 'object') {
                setUserSession({
                    name: session.name || "Unknown User",
                    email: session.email || "",
                    role: session.role || "USER",
                    avatarUrl: session.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.name || "Unknown")}`,
                    status: 'online',
                    position: session.employee?.position || 'Unknown Position'
                });
            }
        }).catch(console.error);
    }, []);

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
            if (activeWorkspaceId === 'merchant-admin' || activeWorkspaceId === 'zap-auth') {
                return [
                    { 
                        id: 'auth-main', 
                        title: 'ZAP-AUTH MAIN', 
                        icon: Layout, 
                        items: [
                            'Dashboard', 
                            'Overview', 
                            'Reports'
                        ] 
                    },
                    {
                        id: 'auth-inventory',
                        title: 'CATALOG & INVENTORY',
                        icon: Box,
                        items: [
                            'Product',
                            'Category',
                            'Unit',
                            'Brand',
                            'Locations',
                            'Modifier Groups'
                        ]
                    },
                    { 
                        id: 'auth-prefs', 
                        title: 'SYSTEM PREFERENCES', 
                        icon: Columns, 
                        items: ['User Management', 'Settings', 'Access Control'] 
                    }
                ];
            }
            if (activeWorkspaceId === 'zap-swarm') {
                return [
                    { id: 'swarm-telemetry', title: 'CORE TELEMETRY', icon: Activity, items: ['Telemetry Monitor', 'Port Registry', 'Swarm Dashboard', 'Active Sessions', 'Cost Intelligence', 'Execution History'] },
                    { id: 'swarm-deerflow', title: 'GENERAL SETTING', icon: Settings, items: ['New Chat', 'System Models', 'Agent Roster', 'API Keys', 'Skills Library', 'Communication', 'Financial', 'Tools'] },
                    { id: 'swarm-security', title: 'SECURITY & OPS', icon: Database, items: ['Security Posture', 'Audit Log', 'Swarm Jobs'] }
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
        const currentPathWithParams = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

        for (const category of EFFECTIVE_NAV) {
            for (const item of category.items) {
                if (typeof item === 'string') {
                    const href = getHref(item, theme, activeWorkspaceId, currentPort, pathname);
                    if (href && (currentPathWithParams === href || pathname === href || pathname.startsWith(href + '/'))) {
                        if (href.length > bestMatch.length) bestMatch = href;
                    }
                } else {
                    for (const subItem of item.items) {
                        const href = getHref(subItem, theme, activeWorkspaceId, currentPort, pathname);
                        if (href && (currentPathWithParams === href || pathname === href || pathname.startsWith(href + '/'))) {
                            if (href.length > bestMatch.length) bestMatch = href;
                        }
                    }
                }
            }
        }
        return bestMatch || pathname;
    }, [pathname, theme, EFFECTIVE_NAV, activeWorkspaceId, searchParams, currentPort]);

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
        if (activeLayout && activeLayout !== theme && !isThemeLocked) {
            setTheme(activeLayout);
        }

        // 1. Ensure the category containing the active item is open
        let activeCategoryId: string | null = null;
        let activeSubGroupKey: string | null = null;
        for (const category of EFFECTIVE_NAV) {
            for (const item of category.items) {
                if (typeof item === 'string') {
                    const href = getHref(item, theme, activeWorkspaceId, currentPort);
                    if (href !== '' && href === activeHref) {
                        activeCategoryId = category.id;
                        break;
                    }
                } else {
                    for (const subItem of item.items) {
                        const href = getHref(subItem, theme, activeWorkspaceId, currentPort);
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
                "group/sidebar relative flex flex-col h-full bg-layer-panel border-r border-outline/5 text-on-surface text-transform-primary transition-all duration-300 ease-in-out z-[100]",
                isMinified && !isPeeking ? "w-[72px]" : "w-[280px]",
                isPeeking && "shadow-2xl translate-x-0"
            )}
        >
            <div className={cn(
                "h-[50px] flex items-center shrink-0 w-full overflow-hidden transition-all duration-300 border-b border-outline/10 bg-layer-base/50 backdrop-blur-md relative z-20",
                effectivelyExpanded ? "px-6 justify-between" : "px-0 justify-center"
            )}>
                <div className="flex items-center gap-3">
                    <Image
                        src={zapLogo}
                        alt="ZAP Logo"
                        width={effectivelyExpanded ? 32 : 40}
                        height={effectivelyExpanded ? 32 : 40}
                        className="cursor-pointer hover:scale-110 transition-transform shrink-0 object-contain"
                        priority
                    />
                    <AnimatePresence>
                        {effectivelyExpanded && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="overflow-hidden pointer-events-auto"
                            >
                                <QuickNavigate className="bg-transparent border-none shadow-none text-on-surface hover:bg-on-surface/5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {effectivelyExpanded && (
                    <button
                        onClick={toggleSidebar}
                        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                        className="px-1 py-0.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-outline rounded-[4px] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 outline-none z-10"
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 0 : 180 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex items-center justify-center"
                        >
                            <Icon name="chevron_left" size={12} weight={700} />
                        </motion.div>
                    </button>
                )}
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-6 space-y-1">
                {(mounted && activeWorkspaceId === 'zap-swarm' && pathname && pathname.startsWith('/chats')) ? (
                    <SwarmChatNavBody currentPath={pathname} />
                ) : (
                    <Accordion
                        type="multiple"
                        value={Object.keys(openCategories).filter(k => openCategories[k] && effectivelyExpanded)}
                        onValueChange={(val) => {
                            const newCat = { ...openCategories };
                            EFFECTIVE_NAV.forEach(cat => {
                                newCat[cat.id] = val.includes(cat.id);
                            });
                            setOpenCategories(newCat);
                        }}
                        className="w-full space-y-1"
                        variant="navigation"
                        indicator="none"
                    >
                        {mounted && EFFECTIVE_NAV.map((category) => {
                            const hasItems = category.items.length > 0;
                            const IconComp = category.icon;

                            let isActive = false;
                            if (mounted && activeHref) {
                                for (const item of category.items) {
                                    if (typeof item === 'string') {
                                        const href = getHref(item, theme, activeWorkspaceId, currentPort);
                                        if (href && href === activeHref) isActive = true;
                                    } else {
                                        for (const subItem of item.items) {
                                            const href = getHref(subItem, theme, activeWorkspaceId, currentPort);
                                            if (href && href === activeHref) isActive = true;
                                        }
                                    }
                                }
                            }

                            return (
                                <AccordionItem key={category.id} value={category.id} className="border-none w-full">
                                    <AccordionTrigger
                                        onClick={() => {
                                            if (!effectivelyExpanded) {
                                                setSidebarState('expanded');
                                            }
                                        }}
                                        className={cn(
                                            !effectivelyExpanded ? "justify-center py-3 px-0 h-11" : "px-2 py-2 gap-3 transition-all duration-300",
                                            isActive && effectivelyExpanded ? "bg-primary/10 text-on-surface" : "hover:bg-on-surface/5 text-on-surface-variant",
                                            isActive && !effectivelyExpanded ? "bg-primary/10 text-primary" : ""
                                        )}
                                        style={{
                                            borderRadius: 'var(--navlink-border-radius, 8px)',
                                            borderWidth: 'var(--navlink-border-width, 0px)',
                                            borderStyle: 'solid',
                                            borderColor: isActive ? 'var(--color-primary-container)' : 'transparent',
                                        }}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden text-left flex-1 min-w-0">
                                            <IconComp
                                                size={20}
                                                strokeWidth={isActive ? 2.5 : 1.5}
                                                className={cn(
                                                    "shrink-0 transition-colors",
                                                    isActive ? "text-primary" : "text-on-surface-variant opacity-70 group-data-[state=open]:text-primary"
                                                )}
                                            />
                                            {effectivelyExpanded && (
                                                <span className="font-display font-medium text-titleSmall text-transform-primary tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {category.title}
                                                </span>
                                            )}
                                        </div>
                                        {/* Manual indicator for effectivelyExpanded cases */}
                                        {effectivelyExpanded && (
                                            <ChevronDown className="size-4 shrink-0 transition-transform duration-200 text-on-surface-variant/50 group-data-[state=open]:rotate-180" strokeWidth={2.5} />
                                        )}
                                    </AccordionTrigger>

                                    {/* Inner Items */}
                                    {hasItems && effectivelyExpanded && (
                                        <AccordionContent>
                                            <div className="flex flex-col m-0 pl-8 overflow-hidden group/navlist space-y-[2px]">
                                                {category.items.map((item, itemIdx) => {
                                                    if (typeof item === 'string') {
                                                        const href = getHref(item, theme, activeWorkspaceId, currentPort, pathname);
                                                        const isItemActive = mounted && href !== '' && href === activeHref;


                                                        return (
                                                            <NavLink
                                                                key={`str-${item}`}
                                                                href={href || '#'}
                                                                isActive={isItemActive}
                                                                variant="default"
                                                            >
                                                                {item}
                                                            </NavLink>
                                                        );
                                                    } else {
                                                        return (
                                                            <div key={`grp-${item.title}`} className="flex flex-col mt-2 mb-1">
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
                                                                                const href = getHref(subItem, theme, activeWorkspaceId, currentPort);
                                                                                const isItemActive = mounted && href !== '' && href === activeHref;
                                                                                return (
                                                                                    <NavLink
                                                                                        href={href || '#'}
                                                                                        key={subItem}
                                                                                        isActive={isItemActive}
                                                                                        variant="default"
                                                                                    >
                                                                                        {subItem}
                                                                                    </NavLink>
                                                                                );
                                                                            })}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>

                                                        );
                                                    }
                                                })}
                                            </div>
                                        </AccordionContent>
                                    )}
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                )}
            </div>

            {/* Bottom Footer Area */}
            {effectivelyExpanded && (
                <div className="mt-auto px-6 pb-3 pt-3 flex flex-col gap-3 bg-transparent border-t border-outline/5">
                    {/* Theme Switcher */}
                    <div className="flex w-full bg-layer-dialog border border-outline-variant/50 rounded-[var(--button-border-radius,9999px)] p-1 shadow-inner gap-0.5">
                        <Button
                            onClick={() => setIsThemeLocked(!isThemeLocked)}
                            title={isThemeLocked ? "Global Theme Settings Locked" : "Lock Theme Globally"}
                            visualStyle={isThemeLocked ? "solid" : "ghost"}
                            color={isThemeLocked ? "primary" : "secondary"}
                            size="tiny"
                            className="w-8 shrink-0 flex items-center justify-center !rounded-[var(--button-border-radius,9999px)] transition-all"
                            tabIndex={-1}
                        >
                            <Icon name={isThemeLocked ? "lock" : "lock_open"} size={14} />
                        </Button>
                        {THEMES.map(t => (
                            <Button
                                key={t}
                                onClick={() => {
                                    if (isThemeLocked) return;
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
                                disabled={isThemeLocked}
                                className={`flex-1 w-auto min-w-0 ${isThemeLocked ? 'opacity-40 cursor-not-allowed' : ''}`} // Flexible inner pills
                            >
                                {t}
                            </Button>
                        ))}
                    </div>

                    {/* User Session */}
                    <div className="flex items-center justify-between rounded-lg w-full">
                        <UserSession
                            dropdownSide="top"
                            size="small"
                            variant="ghost"
                            showLabel={false}
                            isLoggedIn={!!userSession}
                            user={userSession ? {
                                name: userSession.name || "User",
                                role: userSession.role,
                                avatarUrl: userSession.avatarUrl || undefined,
                                status: userSession.status || "online"
                            } : undefined}
                            onLoginClick={() => window.location.href = '/'}
                            onLogoutClick={async () => {
                                try {
                                    await logoutAction();
                                    window.location.href = '/';
                                } catch (e) {
                                    console.error('Logout failed:', e);
                                }
                            }}
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

export const SideNav: React.FC<SideNavProps> = (props) => (
    <Suspense fallback={<div className="w-[72px] h-full bg-layer-panel border-r border-black shrink-0" />}>
        <SideNavContent {...props} />
    </Suspense>
);
