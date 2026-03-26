/**
 * ZAP WORKSPACE REGISTRY
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all Olympus workspaces.
 * Consumed by: Context Switcher, Mission Control, Health Monitor, Spotlight.
 *
 * Port Allocation Bands:
 *   DESIGN     :3000–3099
 *   POS        :3100–3499
 *   AGENT      :3500–3999
 *   OPERATION  :4000–4499
 *   INFRA      :4500–4699
 *   HUMAN      :4700–4999
 *   REF        :5000–6999
 */

// ─── Types ───────────────────────────────────────────────────

export type WorkspaceDomain =
  | 'DESIGN'
  | 'POS'
  | 'AGENT'
  | 'OPERATION'
  | 'INFRA'
  | 'HUMAN'
  | 'REF';

export interface WorkspaceEntry {
  /** Unique slug, e.g. "pos-terminal" */
  id: string;
  /** Human-readable name */
  name: string;
  /** Primary domain grouping */
  domain: WorkspaceDomain;
  /** Sub-category within the domain */
  sub: string;
  /** Assigned port */
  port: number;
  /** Internal route path (if hosted within zap-design server) */
  route?: string;
  /** Monorepo folder relative to olympus root */
  folder?: string;
  /** If true, opens in a new browser tab */
  external?: boolean;
  /** Endpoint to ping for health checks (relative to localhost:port) */
  healthEndpoint: string;
  /** Short description */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Searchable tags for Spotlight */
  tags: string[];
}

export interface PortRange {
  start: number;
  end: number;
}

// ─── Port Ranges ─────────────────────────────────────────────

export const PORT_RANGES: Record<WorkspaceDomain, PortRange> = {
  DESIGN:    { start: 3000, end: 3099 },
  POS:       { start: 3100, end: 3499 },
  AGENT:     { start: 3500, end: 3999 },
  OPERATION: { start: 4000, end: 4499 },
  INFRA:     { start: 4500, end: 4699 },
  HUMAN:     { start: 4700, end: 4999 },
  REF:       { start: 5000, end: 6999 },
};

// ─── Domain Metadata ─────────────────────────────────────────

export const DOMAIN_META: Record<WorkspaceDomain, { label: string; icon: string; color: string }> = {
  DESIGN:    { label: 'Design',        icon: 'palette',       color: '#7C4DFF' },
  POS:       { label: 'Point of Sale', icon: 'shopping_cart', color: '#00BFA5' },
  AGENT:     { label: 'Agent',         icon: 'smart_toy',     color: '#FF6D00' },
  OPERATION: { label: 'Operations',    icon: 'tune',          color: '#2979FF' },
  INFRA:     { label: 'Infrastructure',icon: 'dns',           color: '#546E7A' },
  HUMAN:     { label: 'Human',         icon: 'verified_user', color: '#D50000' },
  REF:       { label: 'Reference',     icon: 'menu_book',     color: '#9E9E9E' },
};

// ─── Registry ────────────────────────────────────────────────

export const WORKSPACE_REGISTRY: WorkspaceEntry[] = [
  // ── DESIGN (:3000) ─────────────────────────────────────────
  {
    id: 'zap-design',
    name: 'ZAP Design Engine',
    domain: 'DESIGN',
    sub: 'L1-L7',
    port: 3000,
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'L1–L7 component system, foundations, atoms, molecules',
    icon: 'palette',
    tags: ['design', 'components', 'atoms', 'molecules', 'foundations', 'tokens', 'theme'],
  },

  // ── POS (:3100–3400) ──────────────────────────────────────
  {
    id: 'pos-terminal',
    name: 'POS Terminal',
    domain: 'POS',
    sub: 'POS',
    port: 3100,
    folder: 'apps/pos',
    healthEndpoint: '/',
    description: 'Point of Sale application',
    icon: 'monitor',
    tags: ['pos', 'sales', 'terminal', 'checkout'],
  },
  {
    id: 'kiosk',
    name: 'Kiosk',
    domain: 'POS',
    sub: 'KIOSK',
    port: 3200,
    folder: 'apps/kiosk',
    healthEndpoint: '/',
    description: 'Customer-facing kiosk',
    icon: 'tablet_mac',
    tags: ['kiosk', 'customer', 'self-service'],
  },
  {
    id: 'web-app',
    name: 'Web App',
    domain: 'POS',
    sub: 'WEB',
    port: 3300,
    folder: 'apps/web',
    healthEndpoint: '/',
    description: 'Main web frontend',
    icon: 'public',
    tags: ['web', 'frontend', 'storefront'],
  },
  {
    id: 'portal',
    name: 'Portal',
    domain: 'POS',
    sub: 'APP',
    port: 3400,
    folder: 'apps/portal',
    healthEndpoint: '/',
    description: 'Portal application',
    icon: 'dashboard',
    tags: ['portal', 'dashboard', 'app'],
  },

  // ── AGENT (:3500–3900) ────────────────────────────────────
  {
    id: 'zap-claw',
    name: 'ZAP-Claw Agent',
    domain: 'AGENT',
    sub: 'CLAW',
    port: 3500,
    folder: 'packages/zap-claw',
    healthEndpoint: '/health',
    description: 'Backend agent runtime',
    icon: 'memory',
    tags: ['agent', 'claw', 'backend', 'runtime'],
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    domain: 'AGENT',
    sub: 'DASHBOARD',
    port: 3600,
    route: '/mission-control',
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'Swarm pulse & port monitoring radar',
    icon: 'radar',
    tags: ['mission', 'control', 'dashboard', 'radar', 'monitoring'],
  },
  {
    id: 'zap-ai',
    name: 'ZAP-AI',
    domain: 'AGENT',
    sub: 'AI',
    port: 3700,
    folder: 'packages/zap-ai',
    healthEndpoint: '/health',
    description: 'LangChain/AI package',
    icon: 'psychology',
    tags: ['ai', 'langchain', 'intelligence', 'llm'],
  },
  {
    id: 'agent-swarm',
    name: 'Agent Swarm',
    domain: 'AGENT',
    sub: 'SWARM',
    port: 3800,
    route: '/design/swarm',
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'Fleet monitoring & job tickets',
    icon: 'group',
    tags: ['swarm', 'fleet', 'agents', 'jobs', 'tickets'],
  },

  // ── OPERATION (:4000–4200) ────────────────────────────────
  {
    id: 'operations',
    name: 'Operations',
    domain: 'OPERATION',
    sub: 'SALES',
    port: 4000,
    folder: 'apps/operations',
    healthEndpoint: '/',
    description: 'Managing sales, orders, PO, PR, inventory',
    icon: 'inventory_2',
    tags: ['operations', 'sales', 'orders', 'purchase', 'inventory', 'po', 'pr'],
  },
  {
    id: 'settings',
    name: 'Settings',
    domain: 'OPERATION',
    sub: 'SETTING',
    port: 4100,
    folder: 'apps/settings',
    healthEndpoint: '/',
    description: 'Merchants, locations, timezone, system, devices, gateway, keys, MCP',
    icon: 'tune',
    tags: ['settings', 'merchants', 'location', 'timezone', 'devices', 'gateway', 'keys', 'mcp'],
  },
  {
    id: 'reports',
    name: 'Reports',
    domain: 'OPERATION',
    sub: 'REPORT',
    port: 4200,
    folder: 'apps/reports',
    healthEndpoint: '/',
    description: 'Financial reporting, history, sales projections, cost analysis',
    icon: 'bar_chart',
    tags: ['reports', 'financial', 'history', 'sales', 'projection', 'cost', 'analytics'],
  },

  // ── INFRA (:4500–4600) ────────────────────────────────────
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    domain: 'INFRA',
    sub: 'DASHBOARD',
    port: 4500,
    route: '/admin/infrastructure',
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'Pipeline health, DB telemetry',
    icon: 'monitoring',
    tags: ['infrastructure', 'pipeline', 'telemetry', 'health'],
  },
  {
    id: 'zap-db',
    name: 'ZAP-DB',
    domain: 'INFRA',
    sub: 'DB',
    port: 4600,
    folder: 'packages/zap-db',
    healthEndpoint: '/health',
    description: 'Database/Prisma layer',
    icon: 'database',
    tags: ['database', 'prisma', 'postgres', 'mongo', 'db'],
  },

  // ── HUMAN (:4700) ─────────────────────────────────────────
  {
    id: 'zap-auth',
    name: 'ZAP-Auth',
    domain: 'HUMAN',
    sub: 'AUTH',
    port: 4700,
    route: '/auth/metro/user-management',
    folder: 'packages/zap-auth',
    healthEndpoint: '/health',
    description: 'Authentication package',
    icon: 'shield',
    tags: ['auth', 'authentication', 'security', 'login', 'session'],
  },

  // ── REF (:5000–6000) ──────────────────────────────────────
  {
    id: 'legacy-ref',
    name: 'ZAP Legacy Reference',
    domain: 'REF',
    sub: 'LEGACY',
    port: 5000,
    external: true,
    healthEndpoint: '/',
    description: 'Prototype reference (graveyard)',
    icon: 'archive',
    tags: ['legacy', 'reference', 'prototype', 'graveyard'],
  },
  {
    id: 'metronic-ref',
    name: 'Metronic Reference',
    domain: 'REF',
    sub: 'METRONIC',
    port: 6000,
    external: true,
    healthEndpoint: '/',
    description: 'Tailwind/React mirroring source',
    icon: 'menu_book',
    tags: ['metronic', 'reference', 'tailwind', 'mirror'],
  },
];

// ─── Helpers ─────────────────────────────────────────────────

/** Get all workspaces for a given domain */
export const getWorkspacesByDomain = (domain: WorkspaceDomain): WorkspaceEntry[] =>
  WORKSPACE_REGISTRY.filter(w => w.domain === domain);

/** Get a single workspace by ID */
export const getWorkspaceById = (id: string): WorkspaceEntry | undefined =>
  WORKSPACE_REGISTRY.find(w => w.id === id);

/** Get the full URL for a workspace */
export const getWorkspaceUrl = (workspace: WorkspaceEntry): string => {
  if (workspace.route) return `http://localhost:${workspace.port}${workspace.route}`;
  return `http://localhost:${workspace.port}`;
};

/** Get all unique domains in registry order */
export const getDomains = (): WorkspaceDomain[] => {
  const seen = new Set<WorkspaceDomain>();
  return WORKSPACE_REGISTRY.reduce<WorkspaceDomain[]>((acc, w) => {
    if (!seen.has(w.domain)) {
      seen.add(w.domain);
      acc.push(w.domain);
    }
    return acc;
  }, []);
};

/** Search workspaces by fuzzy tag match */
export const searchWorkspaces = (query: string): WorkspaceEntry[] => {
  const q = query.toLowerCase().trim();
  if (!q) return WORKSPACE_REGISTRY;
  return WORKSPACE_REGISTRY.filter(w =>
    w.name.toLowerCase().includes(q) ||
    w.sub.toLowerCase().includes(q) ||
    w.domain.toLowerCase().includes(q) ||
    w.description.toLowerCase().includes(q) ||
    w.tags.some(t => t.includes(q))
  );
};
