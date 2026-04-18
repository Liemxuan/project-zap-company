/**
 * Organism & Layout Registry — Maps L5/L6 template IDs to shared showcase components.
 *
 * Architecture:
 *   - The catch-all route at /design/[theme]/organisms/[organism]/ uses this
 *     to resolve which complex layout or organism to render.
 *   - 'page' type: Self-contained templates (e.g. Dashboard) that include their 
 *     own layout / AppShell boundaries.
 *   - 'showcase' type: Body-only organisms rendered inside a standard
 *     ComponentSandboxTemplate layout.
 */

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

export type OrganismStatus = 'Verified' | 'In Progress' | 'Beta' | 'Legacy';
export type OrganismDisplayType = 'page' | 'showcase';

export interface OrganismEntry {
    id: string;
    label: string;
    tier: string;
    status: OrganismStatus;
    type: OrganismDisplayType;
    /** Lazy-loaded component — either a full page or a body section */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ComponentType<any>;
    icon?: string;
    category?: string;
}

// ─── DYNAMIC IMPORTS ────────────────────────────────────────────────────────────
// Initial templates migrated from legacy metro layouts
const Dashboard = dynamic(() => import('../genesis/templates/dashboard/DashboardTemplate'), { ssr: false });
const Profile = dynamic(() => import('../genesis/templates/profile/ProfileTemplate'), { ssr: false });
const Kanban = dynamic(() => import('../genesis/templates/kanban/KanbanTemplate'), { ssr: false });
const Settings = dynamic(() => import('../genesis/templates/settings/SettingsTemplate'), { ssr: false });
const Billing = dynamic(() => import('../genesis/templates/billing/BillingTemplate'), { ssr: false });
const Login = dynamic(() => import('../genesis/templates/login/LoginTemplate'), { ssr: false });
const Activities = dynamic(() => import('../genesis/templates/activities/ActivitiesTemplate'), { ssr: false });
const SignInB = dynamic(() => import('../genesis/templates/login/SignInBTemplate'), { ssr: false });
const SystemLogsTable = dynamic(() => import('../zap/organisms/system-logs-table').then(m => ({ default: m.SystemLogsTable })), { ssr: false });
const SystemLogsTemplate = dynamic(() => import('../genesis/templates/tables/SystemLogsTemplate'), { ssr: false });
const ListTable = dynamic(() => import('../zap/organisms/list-table').then(m => ({ default: m.ListTable })), { ssr: false });
const ProductListTemplate = dynamic(() => import('../genesis/templates/tables/ProductListTemplate'), { ssr: false });
const PageLocationsTemplate = dynamic(() => import('../genesis/templates/tables/location/PageLocation'), { ssr: false });
const PageCategoryTemplate = dynamic(() => import('../genesis/templates/tables/categories/PageCategories'), { ssr: false });
const PageBrandTemplate = dynamic(() => import('../genesis/templates/tables/brand/PageBrand'), { ssr: false });
const PageDiningOptionTemplate = dynamic(() => import('../genesis/templates/tables/dining-option/PageDiningOption'), { ssr: false });
const PageModifierGroupTemplate = dynamic(() => import('../genesis/templates/tables/modifier-group/PageModifierGroup'), { ssr: false });
const PageProductTemplate = dynamic(() => import('../genesis/templates/tables/product/PageProduct'), { ssr: false });
const PageUnitTemplate = dynamic(() => import('../genesis/templates/tables/units/PageUnit'), { ssr: false });
const PageGroupProductTemplate = dynamic(() => import('../genesis/templates/tables/group-product/PageGroupProduct'), { ssr: false });
const PageCollectionTemplate = dynamic(() => import('../genesis/templates/tables/collections/PageCollection'), { ssr: false });
const PageMenusTemplate = dynamic(() => import('../genesis/templates/tables/menus/PageMenus'), { ssr: false });
const PageModifierItemTemplate = dynamic(() => import('../genesis/templates/tables/modifier-item/PageModifierItem'), { ssr: false });
const PageCustomerTemplate = dynamic(() => import('../genesis/templates/tables/customers/PageCustomer'), { ssr: false });
const PageMembershipTemplate = dynamic(() => import('../genesis/templates/tables/memberships/PageMembership'), { ssr: false });
const PagePromotionsTemplate = dynamic(() => import('../genesis/templates/tables/promotions/PagePromotion'), { ssr: false });
const PageCountryTemplate = dynamic(() => import('../genesis/templates/tables/countries/PageCountry'), { ssr: false });
const PagePolicyTemplate = dynamic(() => import('../genesis/templates/tables/policies/PagePolicy'), { ssr: false });
const PageTaxTemplate = dynamic(() => import('../genesis/templates/tables/taxes/PageTax'), { ssr: false });
const PageSurchargesTemplate = dynamic(() => import('../genesis/templates/tables/surcharges/PageSurcharges'), { ssr: false });
const PageServicesTemplate = dynamic(() => import('../genesis/templates/tables/services/PageServices'), { ssr: false });
const EmployeeTemplate = dynamic(() => import('../genesis/templates/tables/EmployeeTemplate'), { ssr: false });
const UserManagementTable = dynamic(() => import('@/genesis/organisms/auth/UserManagementTable').then(m => ({ default: m.UserManagementTable })), { ssr: false });
const Body = dynamic(() => import('../genesis/templates/body/BodyOrganism').then(m => ({ default: m.BodyOrganism })), { ssr: false });
const CanvasGuide = dynamic(() => import('../genesis/templates/canvas-guide/CanvasGuideOrganism').then(m => ({ default: m.CanvasGuideOrganism })), { ssr: false });


// ─── REGISTRY ───────────────────────────────────────────────────────────────────

export const ORGANISM_REGISTRY: Record<string, OrganismEntry> = {
    // ── Page (self-contained Templates, L6 LAYOUTS) ──────────────
    'dashboard': { id: 'dashboard', label: 'Dashboard', tier: 'L6 TEMPLATE', status: 'In Progress', type: 'page', component: Dashboard, icon: 'dashboard', category: 'Layouts' },
    'profile': { id: 'profile', label: 'Profile', tier: 'L6 TEMPLATE', status: 'In Progress', type: 'page', component: Profile, icon: 'person', category: 'Layouts' },
    'kanban': { id: 'kanban', label: 'Kanban', tier: 'L6 TEMPLATE', status: 'In Progress', type: 'page', component: Kanban, icon: 'view_kanban', category: 'Layouts' },
    'settings': { id: 'settings', label: 'Settings', tier: 'L6 TEMPLATE', status: 'In Progress', type: 'page', component: Settings, icon: 'settings', category: 'Layouts' },
    'billing': { id: 'billing', label: 'Billing', tier: 'L6 TEMPLATE', status: 'In Progress', type: 'page', component: Billing, icon: 'receipt', category: 'Layouts' },
    'login': { id: 'login', label: 'Login', tier: 'L5 ORGANISM', status: 'In Progress', type: 'page', component: Login, icon: 'login', category: 'Auth' },
    'signin-a': { id: 'signin-a', label: 'Sign-in A', tier: 'L6 TEMPLATE', status: 'Verified', type: 'page', component: Login, icon: 'splitscreen', category: 'Layouts' },
    'signin-b': { id: 'signin-b', label: 'Sign-in B', tier: 'L6 TEMPLATE', status: 'Verified', type: 'page', component: SignInB, icon: 'web_asset', category: 'Layouts' },
    'activities': { id: 'activities', label: 'Activities', tier: 'L6 TEMPLATE', status: 'In Progress', type: 'page', component: Activities, icon: 'list', category: 'Layouts' },
    'system-logs-layout': { id: 'system-logs-layout', label: 'system logs', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: SystemLogsTemplate, icon: 'list_alt', category: 'Tables' },
    'system-logs': { id: 'system-logs', label: 'System Logs', tier: 'L7 PAGE', status: 'Verified', type: 'showcase', component: SystemLogsTable, icon: 'list_alt', category: 'Tables' },
    'list-table': { id: 'list-table', label: 'List Table', tier: 'L7 PAGE', status: 'Verified', type: 'showcase', component: ListTable, icon: 'list', category: 'Tables' },
    'product-list': { id: 'product-list', label: 'Product List', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageProductTemplate, icon: 'inventory', category: 'Tables' },
    'locations': { id: 'locations', label: 'Locations', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageLocationsTemplate, icon: 'storefront', category: 'Tables' },
    'categories': { id: 'categories', label: 'Categories', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageCategoryTemplate, icon: 'category', category: 'Tables' },
    'brands': { id: 'brands', label: 'Brands', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageBrandTemplate, icon: 'verified_user', category: 'Tables' },
    'dining-options': { id: 'dining-options', label: 'Dining Options', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageDiningOptionTemplate, icon: 'restaurant', category: 'Tables' },
    'modifier-groups': { id: 'modifier-groups', label: 'Modifier Groups', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageModifierGroupTemplate, icon: 'settings_input_component', category: 'Tables' },
    'products': { id: 'products', label: 'Products', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageProductTemplate, icon: 'inventory_2', category: 'Tables' },
    'units': { id: 'units', label: 'Units', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageUnitTemplate, icon: 'straighten', category: 'Tables' },
    'group-products': { id: 'group-products', label: 'Group Products', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageGroupProductTemplate, icon: 'inventory_2', category: 'Tables' },
    'collections': { id: 'collections', label: 'Collections', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageCollectionTemplate, icon: 'collections', category: 'Tables' },
    'menus': { id: 'menus', label: 'Menus', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageMenusTemplate, icon: 'restaurant_menu', category: 'Tables' },
    'modifier-items': { id: 'modifier-items', label: 'Modifier Items', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageModifierItemTemplate, icon: 'settings_input_component', category: 'Tables' },
    'customers': { id: 'customers', label: 'Customers', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageCustomerTemplate, icon: 'groups', category: 'Tables' },
    'memberships': { id: 'memberships', label: 'Memberships', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageMembershipTemplate, icon: 'card_membership', category: 'Tables' },
    'promotions': { id: 'promotions', label: 'Promotions', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PagePromotionsTemplate, icon: 'campaign', category: 'Tables' },
    'countries': { id: 'countries', label: 'Countries', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PageCountryTemplate, icon: 'public', category: 'Tables' },
    'policies': { id: 'policies', label: 'Policies', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: PagePolicyTemplate, icon: 'policy', category: 'Tables' },
    'taxes': { id: 'taxes', label: 'Taxes', tier: 'L6 LAYOUT', status: 'In Progress', type: 'page', component: PageTaxTemplate, icon: 'payments', category: 'Tables' },
    'surcharges': { id: 'surcharges', label: 'Surcharges', tier: 'L6 LAYOUT', status: 'In Progress', type: 'page', component: PageSurchargesTemplate, icon: 'receipt', category: 'Tables' },
    'services': { id: 'services', label: 'Services', tier: 'L6 LAYOUT', status: 'In Progress', type: 'page', component: PageServicesTemplate, icon: 'add_task', category: 'Tables' },
    'employees': { id: 'employees', label: 'Employees', tier: 'L6 LAYOUT', status: 'Verified', type: 'page', component: EmployeeTemplate, icon: 'groups', category: 'Tables' },
    'user-management': { id: 'user-management', label: 'User Management', tier: 'L5 ORGANISM', status: 'Verified', type: 'showcase', component: UserManagementTable, icon: 'manage_accounts', category: 'Tables' },
    'body': { id: 'body', label: 'Body', tier: 'L4 ORGANISM', status: 'Verified', type: 'showcase', component: Body, icon: 'grid_view', category: 'Layouts' },
    'canvas-guide': { id: 'canvas-guide', label: 'Canvas Guide', tier: 'L4 ORGANISM', status: 'Verified', type: 'page', component: CanvasGuide, icon: 'dashboard_customize', category: 'Layouts' },
};


// ─── HELPERS ────────────────────────────────────────────────────────────────────

export function getOrganism(organismId: string): OrganismEntry | undefined {
    return ORGANISM_REGISTRY[organismId];
}

export function getAllOrganisms(): OrganismEntry[] {
    return Object.values(ORGANISM_REGISTRY);
}

export function getOrganismsForTheme(organismIds: string[]): OrganismEntry[] {
    return organismIds
        .map(id => ORGANISM_REGISTRY[id])
        .filter((entry): entry is OrganismEntry => entry !== undefined);
}

export function getOrganismsByCategory(organismIds: string[]): Record<string, OrganismEntry[]> {
    const organisms = getOrganismsForTheme(organismIds);
    return organisms.reduce((acc, catItem) => {
        const cat = catItem.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(catItem);
        return acc;
    }, {} as Record<string, OrganismEntry[]>);
}
