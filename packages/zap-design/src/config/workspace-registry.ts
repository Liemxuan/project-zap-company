/**
 * ZAP WORKSPACE REGISTRY (V4.2 - RADAR COMPLETE EYES)
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all Olympus workspaces, agent fleet,
 * and data vaults. If it runs in the Swarm, it has eyes here.
 */

export type WorkspaceDomain =
  | 'MERCHANT'    // The storefronts & tools we sell to customers
  | 'AGENT'       // The Swarm UI
  | 'FLEET'       // The Headless Docker Agents
  | 'DESIGN'      // ZAP Design Engine & Foundations
  | 'CONTROL'     // Internal ZAP tooling & global operations
  | 'VAULT'       // Data Stores & Memory
  | 'REF';        // Legacy/Archive

export interface WorkspaceEntry {
  id: string;
  name: string;
  domain: WorkspaceDomain;
  sub: string;
  port: number;
  route?: string;
  folder?: string;
  external?: boolean;
  healthEndpoint: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface PortRange {
  start: number;
  end: number;
}

export const PORT_RANGES: Record<WorkspaceDomain, PortRange> = {
  DESIGN:    { start: 3000, end: 3099 },
  MERCHANT:  { start: 3100, end: 3499 },
  AGENT:     { start: 3500, end: 3999 },
  CONTROL:   { start: 4000, end: 4699 },
  REF:       { start: 5000, end: 6999 },
  VAULT:     { start: 7000, end: 7999 },
  FLEET:     { start: 8000, end: 9999 },
};

export const DOMAIN_META: Record<WorkspaceDomain, { label: string; icon: string; color: string }> = {
  MERCHANT:  { label: 'Merchant Suite', icon: 'storefront',    color: '#00BFA5' },
  AGENT:     { label: 'Agent Hub',      icon: 'psychology',    color: '#FF6D00' },
  FLEET:     { label: 'Swarm Fleet',    icon: 'smart_toy',     color: '#FF9100' },
  DESIGN:    { label: 'Design Engine',  icon: 'palette',       color: '#7C4DFF' },
  CONTROL:   { label: 'Control Plane',  icon: 'tune',          color: '#2979FF' },
  VAULT:     { label: 'Data Vault',     icon: 'database',      color: '#546E7A' },
  REF:       { label: 'Reference',      icon: 'menu_book',     color: '#9E9E9E' },
};

export const WORKSPACE_REGISTRY: WorkspaceEntry[] = [
  // ══════════════════════════════════════════════════════════
  // ZAP INTERNAL: THE FOUNDATION
  // ══════════════════════════════════════════════════════════
  {
    id: 'zap-design',
    name: '[ZAP] Design Engine',
    domain: 'DESIGN',
    sub: 'ENGINE',
    port: 3000,
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'Internal foundry where the Vietnam team builds UI components',
    icon: 'palette',
    tags: ['design', 'components', 'atoms', 'theme', 'zap-internal'],
  },

  // ══════════════════════════════════════════════════════════
  // MERCHANT: REVENUE SUITE
  // ══════════════════════════════════════════════════════════
  {
    id: 'pos-terminal',
    name: '[MERCHANT] POS Terminal',
    domain: 'MERCHANT',
    sub: 'POS',
    port: 3100,
    folder: 'apps/pos',
    healthEndpoint: '/',
    description: 'In-store physical checkout module for their staff',
    icon: 'monitor',
    tags: ['pos', 'sales', 'terminal', 'checkout', 'merchant-facing'],
  },
  {
    id: 'kiosk',
    name: '[MERCHANT] Kiosk',
    domain: 'MERCHANT',
    sub: 'KIOSK',
    port: 3200,
    folder: 'apps/kiosk',
    healthEndpoint: '/',
    description: 'Customer-facing self-service touch module',
    icon: 'tablet_mac',
    tags: ['kiosk', 'customer', 'self-service', 'merchant-facing'],
  },
  {
    id: 'web-app',
    name: '[MERCHANT] Web App',
    domain: 'MERCHANT',
    sub: 'WEB',
    port: 3300,
    folder: 'apps/web',
    healthEndpoint: '/',
    description: 'The merchant\'s consumer-facing storefront',
    icon: 'public',
    tags: ['web', 'frontend', 'storefront', 'revenue', 'merchant-facing'],
  },
  {
    id: 'portal',
    name: '[MERCHANT] Customer Portal',
    domain: 'MERCHANT',
    sub: 'LOYALTY',
    port: 3400,
    folder: 'apps/portal',
    healthEndpoint: '/',
    description: 'Consumer loyalty and account portal',
    icon: 'dashboard',
    tags: ['portal', 'dashboard', 'loyalty', 'merchant-facing'],
  },
  {
    id: 'merchant-admin',
    name: '[MERCHANT] Admin Ops',
    domain: 'MERCHANT',
    sub: 'ADMIN',
    port: 4700,
    folder: 'apps/settings',
    healthEndpoint: '/',
    description: 'Where our merchants log in to manage their specific accounts/roles',
    icon: 'tune',
    tags: ['admin', 'roles', 'account', 'operations', 'merchant-facing'],
  },

  // ══════════════════════════════════════════════════════════
  // ZAP INTERNAL: AGENT HUB & ORCHESTRATION
  // ══════════════════════════════════════════════════════════
  {
    id: 'zap-swarm',
    name: '[ZAP] Swarm Monitor',
    domain: 'AGENT',
    sub: 'MONITOR',
    port: 3500,
    folder: 'apps/zap-swarm',
    healthEndpoint: '/',
    description: 'Internal dashboard to monitor agent fleets globally',
    icon: 'psychology',
    tags: ['swarm', 'command', 'agent', 'deerflow', 'zap-internal'],
  },
  {
    id: 'kairos-daemon',
    name: '[ZAP] Kairos Daemon',
    domain: 'AGENT',
    sub: 'RUST',
    port: 3999,
    folder: 'rust/crates/gateway',
    healthEndpoint: '/',
    description: 'Native Rust Daemon that orchestrates the entire agent fleet',
    icon: 'radar',
    tags: ['rust', 'kairos', 'gateway', 'zap-internal', 'backend'],
  },

  // ══════════════════════════════════════════════════════════
  // ZAP INTERNAL: CONTROL PLANE
  // ══════════════════════════════════════════════════════════
  {
    id: 'operations',
    name: '[ZAP] Global Ops',
    domain: 'CONTROL',
    sub: 'CRM',
    port: 4200,
    folder: 'apps/operations',
    healthEndpoint: '/',
    description: 'How WE run Olympus (Targeting, global CRM, billing)',
    icon: 'inventory_2',
    tags: ['operations', 'sales', 'crm', 'tenant', 'zap-internal'],
  },
  {
    id: 'infrastructure',
    name: '[ZAP] Infrastructure',
    domain: 'CONTROL',
    sub: 'DASHBOARD',
    port: 4300,
    route: '/admin/infrastructure',
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'Monitoring the health of our cloud and databases',
    icon: 'monitoring',
    tags: ['infrastructure', 'pipeline', 'telemetry', 'health', 'zap-internal'],
  },
  {
    id: 'mission-control',
    name: '[ZAP] Mission Control',
    domain: 'CONTROL',
    sub: 'RADAR',
    port: 4600,
    route: '/mission-control',
    folder: 'packages/zap-design',
    healthEndpoint: '/',
    description: 'Global port radar and service pulse',
    icon: 'radar',
    tags: ['mission', 'control', 'dashboard', 'radar', 'zap-internal'],
  },

  // ══════════════════════════════════════════════════════════
  // CORE VAULT SERVICES
  // ══════════════════════════════════════════════════════════
  {
    id: 'zap-db',
    name: '[VAULT] PostgreSQL',
    domain: 'VAULT',
    sub: 'DB',
    port: 5432,
    folder: 'packages/zap-db',
    healthEndpoint: '/',
    description: 'Cloud PostgreSQL Multi-Tenant Database',
    icon: 'database',
    tags: ['database', 'postgres', 'vault'],
  },
  {
    id: 'redis',
    name: '[VAULT] Redis Inbox',
    domain: 'VAULT',
    sub: 'BROKER',
    port: 6379,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'High-speed message broker for job ticketing',
    icon: 'archive',
    tags: ['redis', 'broker', 'vault'],
  },
  {
    id: 'chromadb',
    name: '[VAULT] ChromaDB',
    domain: 'VAULT',
    sub: 'VECTOR',
    port: 8000,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'The semantic memory store for the Swarm fleet',
    icon: 'database',
    tags: ['chroma', 'vector', 'memory', 'agent'],
  },

  // ══════════════════════════════════════════════════════════
  // ZAP-CLAW FLEET (DOCKERIZED WORKERS)
  // ══════════════════════════════════════════════════════════
  {
    id: 'agent-jerry',
    name: '[FLEET] Jerry',
    domain: 'FLEET',
    sub: 'WATCHDOG',
    port: 8100,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Internal watchdog monitoring code sanity',
    icon: 'shield',
    tags: ['agent', 'jerry', 'watchdog', 'docker'],
  },
  {
    id: 'agent-spike',
    name: '[FLEET] Spike',
    domain: 'FLEET',
    sub: 'BUILDER',
    port: 8101,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Structural component integration builder',
    icon: 'smart_toy',
    tags: ['agent', 'spike', 'builder', 'docker'],
  },
  {
    id: 'agent-thomas',
    name: '[FLEET] Thomas',
    domain: 'FLEET',
    sub: 'FINANCE',
    port: 8102,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Analytics and financial reporting handler',
    icon: 'smart_toy',
    tags: ['agent', 'thomas', 'finance', 'docker'],
  },
  {
    id: 'agent-athena',
    name: '[FLEET] Athena',
    domain: 'FLEET',
    sub: 'ARCHITECT',
    port: 8103,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'System-wide architectural review',
    icon: 'smart_toy',
    tags: ['agent', 'athena', 'architect', 'docker'],
  },
  {
    id: 'agent-hermes',
    name: '[FLEET] Hermes',
    domain: 'FLEET',
    sub: 'ROUTER',
    port: 8104,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'API routing and integration logic',
    icon: 'smart_toy',
    tags: ['agent', 'hermes', 'router', 'docker'],
  },
  {
    id: 'agent-hawk',
    name: '[FLEET] Hawk',
    domain: 'FLEET',
    sub: 'SECURITY',
    port: 8105,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Threat detection and endpoint auditing',
    icon: 'smart_toy',
    tags: ['agent', 'hawk', 'security', 'docker'],
  },
  {
    id: 'agent-nova',
    name: '[FLEET] Nova',
    domain: 'FLEET',
    sub: 'CREATOR',
    port: 8106,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Content and UI copy generation',
    icon: 'smart_toy',
    tags: ['agent', 'nova', 'copy', 'docker'],
  },
  {
    id: 'agent-raven',
    name: '[FLEET] Raven',
    domain: 'FLEET',
    sub: 'EXTRACTION',
    port: 8107,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Deep data parsing and file extraction',
    icon: 'smart_toy',
    tags: ['agent', 'raven', 'parser', 'docker'],
  },
  {
    id: 'agent-scout',
    name: '[FLEET] Scout',
    domain: 'FLEET',
    sub: 'OSINT',
    port: 8108,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Open-Source intelligence and web research',
    icon: 'smart_toy',
    tags: ['agent', 'scout', 'research', 'docker'],
  },
  {
    id: 'agent-coder',
    name: '[FLEET] Coder',
    domain: 'FLEET',
    sub: 'ENGINEER',
    port: 8109,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'Execution loop programming',
    icon: 'smart_toy',
    tags: ['agent', 'coder', 'engineer', 'docker'],
  },
  {
    id: 'agent-architect',
    name: '[FLEET] Architect',
    domain: 'FLEET',
    sub: 'SCALER',
    port: 8110,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'System scaling and infrastructure design',
    icon: 'smart_toy',
    tags: ['agent', 'architect', 'infra', 'docker'],
  },
  {
    id: 'agent-cleo',
    name: '[FLEET] Cleo',
    domain: 'FLEET',
    sub: 'UX',
    port: 8111,
    folder: 'docker',
    healthEndpoint: '/',
    description: 'User experience and M3 design token compliance',
    icon: 'smart_toy',
    tags: ['agent', 'cleo', 'design', 'docker'],
  },

  // ══════════════════════════════════════════════════════════
  // REFERENCE & LEGACY
  // ══════════════════════════════════════════════════════════
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
    tags: ['metronic', 'reference'],
  }
];

export const getWorkspacesByDomain = (domain: WorkspaceDomain): WorkspaceEntry[] =>
  WORKSPACE_REGISTRY.filter(w => w.domain === domain);

export const getWorkspaceById = (id: string): WorkspaceEntry | undefined =>
  WORKSPACE_REGISTRY.find(w => w.id === id);

export const getWorkspaceUrl = (workspace: WorkspaceEntry): string => {
  if (workspace.route) return `http://localhost:${workspace.port}${workspace.route}`;
  return `http://localhost:${workspace.port}`;
};

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
