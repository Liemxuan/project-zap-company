import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

export type AtomStatus = 'Verified' | 'In Progress' | 'Beta' | 'Legacy';

export interface AtomEntry {
    id: string;
    label: string;
    tier: string;
    status: AtomStatus;
    /** Lazy-loaded component — standard sandbox page for the atom */
    component: ComponentType;
    icon?: string;
    category?: string;
}

// ─── DYNAMIC IMPORTS ────────────────────────────────────────────────────────────

const Accordion = dynamic(() => import('../app/design/zap/atoms/accordion/page'), { ssr: false });
const Avatar = dynamic(() => import('../app/design/zap/atoms/avatar/page'), { ssr: false });
const Badge = dynamic(() => import('../app/design/zap/atoms/badge/page'), { ssr: false });
const BreadcrumbPillAtom = dynamic(() => import('../app/design/zap/atoms/breadcrumb-pill/page'), { ssr: false });
const Button = dynamic(() => import('../app/design/zap/atoms/button/page'), { ssr: false });
const Canvas = dynamic(() => import('../app/design/zap/atoms/canvas/page'), { ssr: false });
const Card = dynamic(() => import('../app/design/zap/atoms/card/page'), { ssr: false });
const Checkbox = dynamic(() => import('../app/design/zap/atoms/checkbox/page'), { ssr: false });
const FormattersAtom = dynamic(() => import('../app/design/zap/atoms/formatters/page'), { ssr: false });
const Indicator = dynamic(() => import('../app/design/zap/atoms/indicator/page'), { ssr: false });
const Input = dynamic(() => import('../app/design/zap/atoms/input/page'), { ssr: false });
const NavLinkAtom = dynamic(() => import('../app/design/zap/atoms/navlink/page'), { ssr: false });
const Label = dynamic(() => import('../app/design/zap/atoms/label/page'), { ssr: false });
const LiveBlinkerAtom = dynamic(() => import('../app/design/zap/atoms/live-blinker/page'), { ssr: false });
const Panel = dynamic(() => import('../app/design/zap/atoms/panel/page'), { ssr: false });
const Pill = dynamic(() => import('../app/design/zap/atoms/pill/page'), { ssr: false });
const PropertyBoxAtom = dynamic(() => import('../app/design/zap/atoms/property-box/page'), { ssr: false });
const Radio = dynamic(() => import('../app/design/zap/atoms/radio/page'), { ssr: false });
const ScrollArea = dynamic(() => import('../app/design/zap/atoms/scroll-area/page'), { ssr: false });
// search-input removed → covered by /atoms/input and /molecules/inputs
const Select = dynamic(() => import('../app/design/zap/atoms/select/page'), { ssr: false });
const Separator = dynamic(() => import('../app/design/zap/atoms/separator/page'), { ssr: false });
const Skeleton = dynamic(() => import('../app/design/zap/atoms/skeleton/page'), { ssr: false });
const Slider = dynamic(() => import('../app/design/zap/atoms/slider/page'), { ssr: false });
const TableAtom = dynamic(() => import('../app/design/zap/atoms/table/page'), { ssr: false });
const TabsAtom = dynamic(() => import('../app/design/zap/atoms/tabs/page'), { ssr: false });
const Switch = dynamic(() => import('../app/design/zap/atoms/switch/page'), { ssr: false });
const SurfaceAtom = dynamic(() => import('../app/design/zap/atoms/surface/page'), { ssr: false });
const Textarea = dynamic(() => import('../app/design/zap/atoms/textarea/page'), { ssr: false });
const Toggle = dynamic(() => import('../app/design/zap/atoms/toggle/page'), { ssr: false });

// ─── REGISTRY ───────────────────────────────────────────────────────────────────

export const ATOM_REGISTRY: Record<string, AtomEntry> = {
    'accordion':       { id: 'accordion',    label: 'Accordion',    tier: 'L3 ATOM', status: 'Verified', component: Accordion,   icon: 'expand_more',     category: 'Navigation' },
    'avatar':          { id: 'avatar',       label: 'Avatar',       tier: 'L3 ATOM', status: 'Verified', component: Avatar,      icon: 'account_circle',  category: 'Data Display' },
    'badge':           { id: 'badge',        label: 'Badge',        tier: 'L3 ATOM', status: 'Verified', component: Badge,       icon: 'label',           category: 'Data Display' },
    'breadcrumb-pill':  { id: 'breadcrumb-pill', label: 'Breadcrumb Pill', tier: 'L3 ATOM', status: 'Verified', component: BreadcrumbPillAtom, icon: 'more_horiz', category: 'Navigation' },
    'button':          { id: 'button',       label: 'Button',       tier: 'L3 ATOM', status: 'Verified', component: Button,      icon: 'smart_button',    category: 'Inputs' },
    'canvas':          { id: 'canvas',       label: 'Canvas',       tier: 'L3 ATOM', status: 'Verified', component: Canvas,      icon: 'layers',          category: 'Layout' },
    'card':            { id: 'card',         label: 'Card',         tier: 'L3 ATOM', status: 'Verified', component: Card,        icon: 'crop_portrait',   category: 'Layout' },
    'checkbox':        { id: 'checkbox',     label: 'Checkbox',     tier: 'L3 ATOM', status: 'Verified', component: Checkbox,    icon: 'check_box',       category: 'Inputs' },
    'indicator':       { id: 'indicator',    label: 'Indicator',    tier: 'L3 ATOM', status: 'Verified', component: Indicator,   icon: 'fiber_manual_record', category: 'Data Display' },
    'formatters':      { id: 'formatters',   label: 'Formatters',   tier: 'L3 ATOM', status: 'Verified', component: FormattersAtom, icon: 'pin',          category: 'Inputs' },
    'input':           { id: 'input',        label: 'Input',        tier: 'L3 ATOM', status: 'Verified', component: Input,       icon: 'edit',            category: 'Inputs' },
    'label':           { id: 'label',        label: 'Label',        tier: 'L3 ATOM', status: 'Verified', component: Label,       icon: 'title',           category: 'Typography' },
    'live-blinker':    { id: 'live-blinker', label: 'Live Blinker', tier: 'L3 ATOM', status: 'Verified', component: LiveBlinkerAtom, icon: 'fiber_manual_record', category: 'Feedback' },
    'navlink':         { id: 'navlink',      label: 'NavLink',      tier: 'L3 ATOM', status: 'Verified', component: NavLinkAtom, icon: 'link',            category: 'Navigation' },
    'panel':           { id: 'panel',        label: 'Panel',        tier: 'L3 ATOM', status: 'Verified', component: Panel,       icon: 'view_sidebar',    category: 'Layout' },
    'pill':            { id: 'pill',         label: 'Pill',         tier: 'L3 ATOM', status: 'Verified', component: Pill,        icon: 'hdr_strong',      category: 'Data Display' },
    'property-box':    { id: 'property-box', label: 'Property Box', tier: 'L3 ATOM', status: 'Verified', component: PropertyBoxAtom, icon: 'view_list',  category: 'Data Display' },
    'radio':           { id: 'radio',        label: 'Radio',        tier: 'L3 ATOM', status: 'Verified', component: Radio,       icon: 'radio_button_checked', category: 'Inputs' },
    'scroll-area':     { id: 'scroll-area',  label: 'Scroll Area',  tier: 'L3 ATOM', status: 'Verified', component: ScrollArea,  icon: 'swap_vert',       category: 'Layout' },

    'select':          { id: 'select',       label: 'Select',       tier: 'L3 ATOM', status: 'Verified', component: Select,      icon: 'arrow_drop_down_circle', category: 'Inputs' },
    'separator':       { id: 'separator',    label: 'Separator',    tier: 'L3 ATOM', status: 'Verified', component: Separator,   icon: 'horizontal_rule', category: 'Layout' },
    'skeleton':        { id: 'skeleton',     label: 'Skeleton',     tier: 'L3 ATOM', status: 'Verified', component: Skeleton,    icon: 'hourglass_empty', category: 'Feedback' },
    'slider':          { id: 'slider',       label: 'Slider',       tier: 'L3 ATOM', status: 'Verified', component: Slider,      icon: 'linear_scale',    category: 'Inputs' },
    'switch':          { id: 'switch',       label: 'Switch',       tier: 'L3 ATOM', status: 'Verified', component: Switch,      icon: 'toggle_on',       category: 'Inputs' },
    'surface':         { id: 'surface',      label: 'Surface',      tier: 'L3 ATOM', status: 'Verified', component: SurfaceAtom, icon: 'crop_square',     category: 'Layout' },
    'table':           { id: 'table',        label: 'Table',        tier: 'L3 ATOM', status: 'Verified', component: TableAtom,   icon: 'table_chart',     category: 'Data Display' },
    'tabs':            { id: 'tabs',         label: 'Tabs',         tier: 'L3 ATOM', status: 'Verified', component: TabsAtom,    icon: 'tab',             category: 'Navigation' },
    'textarea':        { id: 'textarea',     label: 'Textarea',     tier: 'L3 ATOM', status: 'Verified', component: Textarea,    icon: 'notes',           category: 'Inputs' },
    'toggle':          { id: 'toggle',       label: 'Toggle',       tier: 'L3 ATOM', status: 'Verified', component: Toggle,      icon: 'check_circle',    category: 'Inputs' },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────────

export function getAtom(atomId: string): AtomEntry | undefined {
    return ATOM_REGISTRY[atomId];
}

export function getAllAtoms(): AtomEntry[] {
    return Object.values(ATOM_REGISTRY);
}

export function getAtomsForTheme(atomIds: string[]): AtomEntry[] {
    return atomIds
        .map(id => ATOM_REGISTRY[id])
        .filter((entry): entry is AtomEntry => entry !== undefined);
}

export function getAtomsByCategory(atomIds: string[]): Record<string, AtomEntry[]> {
    const atoms = getAtomsForTheme(atomIds);
    return atoms.reduce((acc, atom) => {
        const cat = atom.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(atom);
        return acc;
    }, {} as Record<string, AtomEntry[]>);
}
