/**
 * Molecule Registry — Maps molecule IDs to shared showcase components.
 *
 * Architecture:
 *   - The catch-all route at /design/[theme]/molecules/[molecule]/ uses this
 *     to resolve which component to render.
 *   - 'page' type: Self-contained pages that include their own layout
 *     (ComponentSandboxTemplate or custom). Imported from existing zap/ pages.
 *   - 'showcase' type: Body-only components rendered inside a standard layout
 *     by the catch-all route. Imported from zap/sections/molecules/.
 *
 * Why zap/ pages? Several Core pages already re-export Zap pages directly
 * (profile-switcher, rating, user-session). This confirms
 * the Zap pages are theme-agnostic — they use useTheme() for context.
 */

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

export type MoleculeStatus = 'Verified' | 'In Progress' | 'Beta' | 'Legacy';
export type MoleculeDisplayType = 'page' | 'showcase';

export interface MoleculeEntry {
    id: string;
    label: string;
    tier: string;
    status: MoleculeStatus;
    type: MoleculeDisplayType;
    /** Lazy-loaded component — either a full page or a body section */
    component: ComponentType;
    icon?: string;
    category?: string;
}

// ─── DYNAMIC IMPORTS ────────────────────────────────────────────────────────────
// 'page' type — self-contained pages from zap/molecules/* (include their own layout)
const Dropzone = dynamic(() => import('../app/design/zap/molecules/dropzone/page'), { ssr: false });
// card-number, currency-input, date-range-picker, input-otp, multi-select, phone-number, tag-input
// → consolidated into MoleculeInputsBody showcase (see zap/sections/molecules/inputs/body.tsx)
const Inputs = dynamic(() => import('../app/design/zap/molecules/inputs/page'), { ssr: false });
const ProfileSwitcher = dynamic(() => import('../app/design/zap/molecules/profile-switcher/page'), { ssr: false });
const QuickNavigate = dynamic(() => import('../app/design/zap/molecules/quick-navigate/page'), { ssr: false });
const Rating = dynamic(() => import('../app/design/zap/molecules/rating/page'), { ssr: false });
// select-date removed
const Steppers = dynamic(() => import('../app/design/zap/molecules/steppers/page'), { ssr: false });
const UserSession = dynamic(() => import('../app/design/zap/molecules/user-session/page'), { ssr: false });
const HorizontalNavigation = dynamic(() => import('../app/design/zap/molecules/horizontal-navigation/page'), { ssr: false });

// 'showcase' type — shared body components from zap/sections/molecules/*
const Cards = dynamic(
    () => import('../zap/sections/molecules/containment/CardsSection').then(m => ({ default: m.CardsSection })),
    { ssr: false }
);
const Dialogs = dynamic(
    () => import('../zap/sections/molecules/containment/DialogsSection').then(m => ({ default: m.DialogsSection })),
    { ssr: false }
);

// Additional zap-only molecules (their pages are self-contained)
const Alert = dynamic(() => import('../app/design/zap/molecules/alert/page'), { ssr: false });
const Breadcrumb = dynamic(() => import('../app/design/zap/molecules/breadcrumb/page'), { ssr: false });
const DropdownMenu = dynamic(() => import('../app/design/zap/molecules/dropdown-menu/page'), { ssr: false });
const Form = dynamic(() => import('../app/design/zap/molecules/form/page'), { ssr: false });
const Pagination = dynamic(() => import('../app/design/zap/molecules/pagination/page'), { ssr: false });
const Progress = dynamic(() => import('../app/design/zap/molecules/progress/page'), { ssr: false });
const Tabs = dynamic(() => import('../app/design/zap/molecules/tabs/page'), { ssr: false });
const Tooltip = dynamic(() => import('../app/design/zap/molecules/tooltip/page'), { ssr: false });
const ThemeHeaderShowcase = dynamic(() => import('../app/design/zap/molecules/theme-header/page'), { ssr: false });

// ─── REGISTRY ───────────────────────────────────────────────────────────────────

export const MOLECULE_REGISTRY: Record<string, MoleculeEntry> = {
    // ── Showcase (body-only, rendered inside catch-all layout) ───────────
    'cards': { id: 'cards', label: 'Cards', tier: 'L4 MOLECULE', status: 'Verified', type: 'showcase', component: Cards, icon: 'dashboard', category: 'Containment' },
    'dialogs': { id: 'dialogs', label: 'Dialogs', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Dialogs, icon: 'open_in_new', category: 'Containment' },
    'inputs': { id: 'inputs', label: 'Input Modules', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Inputs, icon: 'input', category: 'Forms' },

    // ── Page (self-contained with ComponentSandboxTemplate) ──────────────
    'dropzone': { id: 'dropzone', label: 'File Dropzone', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Dropzone, icon: 'upload_file', category: 'Forms' },
    // card-number, currency-input, date-range-picker, input-otp, multi-select, phone-number, tag-input
    // → consolidated into 'inputs' showcase above
    'profile-switcher': { id: 'profile-switcher', label: 'Profile Switcher', tier: 'L4 MOLECULE', status: 'In Progress', type: 'page', component: ProfileSwitcher, icon: 'switch_account', category: 'Navigation' },
    'quick-navigate': { id: 'quick-navigate', label: 'Quick Navigate', tier: 'L4 MOLECULE', status: 'In Progress', type: 'page', component: QuickNavigate, icon: 'near_me', category: 'Navigation' },
    'rating': { id: 'rating', label: 'Rating', tier: 'L4 MOLECULE', status: 'In Progress', type: 'page', component: Rating, icon: 'star', category: 'Feedback' },
    // select-date removed
    'steppers': { id: 'steppers', label: 'Steppers', tier: 'L4 MOLECULE', status: 'In Progress', type: 'page', component: Steppers, icon: 'linear_scale', category: 'Navigation' },
    'user-session': { id: 'user-session', label: 'User Session', tier: 'L4 MOLECULE', status: 'In Progress', type: 'page', component: UserSession, icon: 'person', category: 'Navigation' },
    'horizontal-navigation': { id: 'horizontal-navigation', label: 'Horizontal Navigation', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: HorizontalNavigation, icon: 'web_asset', category: 'Navigation' },

    // ── Additional zap molecules ────────────────────────────────────────
    'alert': { id: 'alert', label: 'Alert', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Alert, icon: 'warning', category: 'Feedback' },
    'breadcrumb': { id: 'breadcrumb', label: 'Breadcrumb', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Breadcrumb, icon: 'chevron_right', category: 'Navigation' },
    'dropdown-menu': { id: 'dropdown-menu', label: 'Dropdown Menu', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: DropdownMenu, icon: 'arrow_drop_down', category: 'Navigation' },
    'form': { id: 'form', label: 'Form', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Form, icon: 'assignment', category: 'Forms' },
    'pagination': { id: 'pagination', label: 'Pagination', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Pagination, icon: 'last_page', category: 'Navigation' },
    'progress': { id: 'progress', label: 'Progress', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Progress, icon: 'hourglass_top', category: 'Feedback' },
    'tabs': { id: 'tabs', label: 'Tabs', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Tabs, icon: 'tab', category: 'Navigation' },
    'tooltip': { id: 'tooltip', label: 'Tooltip', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: Tooltip, icon: 'info', category: 'Feedback' },
    'theme-header': { id: 'theme-header', label: 'Theme Header', tier: 'L4 MOLECULE', status: 'Verified', type: 'page', component: ThemeHeaderShowcase, icon: 'web_asset', category: 'Navigation' },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────────

export function getMolecule(moleculeId: string): MoleculeEntry | undefined {
    return MOLECULE_REGISTRY[moleculeId];
}

export function getAllMolecules(): MoleculeEntry[] {
    return Object.values(MOLECULE_REGISTRY);
}

export function getMoleculesForTheme(moleculeIds: string[]): MoleculeEntry[] {
    return moleculeIds
        .map(id => MOLECULE_REGISTRY[id])
        .filter((entry): entry is MoleculeEntry => entry !== undefined);
}

export function getMoleculesByCategory(moleculeIds: string[]): Record<string, MoleculeEntry[]> {
    const molecules = getMoleculesForTheme(moleculeIds);
    return molecules.reduce((acc, mol) => {
        const cat = mol.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(mol);
        return acc;
    }, {} as Record<string, MoleculeEntry[]>);
}
