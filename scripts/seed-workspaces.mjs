#!/usr/bin/env node
/**
 * Seed script for olympus_config workspace collections.
 * Run with: node scripts/seed-workspaces.mjs
 *
 * Requires: MONGO_URI env var or defaults to local connection.
 */

import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'olympus_config';

const workspaces = [
  { _id: 'zap-design',      domain: 'DESIGN',    sub: 'L1-L7',     port: 3000, folder: 'packages/zap-design' },
  { _id: 'pos-terminal',    domain: 'POS',       sub: 'POS',       port: 3100, folder: 'apps/pos' },
  { _id: 'kiosk',           domain: 'POS',       sub: 'KIOSK',     port: 3200, folder: 'apps/kiosk' },
  { _id: 'web-app',         domain: 'POS',       sub: 'WEB',       port: 3300, folder: 'apps/web' },
  { _id: 'portal',          domain: 'POS',       sub: 'APP',       port: 3400, folder: 'apps/portal' },
  { _id: 'zap-claw',        domain: 'AGENT',     sub: 'CLAW',      port: 3500, folder: 'packages/zap-claw' },
  { _id: 'mission-control', domain: 'AGENT',     sub: 'DASHBOARD', port: 3600, folder: 'packages/zap-design', route: '/design/metro/mission-control' },
  { _id: 'zap-ai',          domain: 'AGENT',     sub: 'AI',        port: 3700, folder: 'packages/zap-ai' },
  { _id: 'agent-swarm',     domain: 'AGENT',     sub: 'SWARM',     port: 3800, folder: 'packages/zap-design', route: '/design/swarm' },
  { _id: 'operations',      domain: 'OPERATION', sub: 'SALES',     port: 4000, folder: 'apps/operations' },
  { _id: 'settings',        domain: 'OPERATION', sub: 'SETTING',   port: 4100, folder: 'apps/settings' },
  { _id: 'reports',         domain: 'OPERATION', sub: 'REPORT',    port: 4200, folder: 'apps/reports' },
  { _id: 'infrastructure',  domain: 'INFRA',     sub: 'DASHBOARD', port: 4500, folder: 'packages/zap-design', route: '/admin/infrastructure' },
  { _id: 'zap-db',          domain: 'INFRA',     sub: 'DB',        port: 4600, folder: 'packages/zap-db' },
  { _id: 'zap-auth',        domain: 'HUMAN',     sub: 'AUTH',      port: 4700, folder: 'packages/zap-auth' },
  { _id: 'legacy-ref',      domain: 'REF',       sub: 'LEGACY',    port: 5000, external: true },
  { _id: 'metronic-ref',    domain: 'REF',       sub: 'METRONIC',  port: 6000, external: true },
];

const globalConfig = {
  _id: 'global',
  portRanges: {
    DESIGN:    { start: 3000, end: 3099 },
    POS:       { start: 3100, end: 3499 },
    AGENT:     { start: 3500, end: 3999 },
    OPERATION: { start: 4000, end: 4499 },
    INFRA:     { start: 4500, end: 4699 },
    HUMAN:     { start: 4700, end: 4999 },
    REF:       { start: 5000, end: 6999 },
  },
  healthCheckIntervalSeconds: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Seed workspaces
    const wsColl = db.collection('workspaces');
    for (const ws of workspaces) {
      await wsColl.updateOne(
        { _id: ws._id },
        {
          $set: ws,
          $setOnInsert: {
            status: 'offline',
            lastHealthCheck: null,
            lastHealthLatencyMs: null,
            healthHistory: [],
            userPrefs: { pinned: false, lastVisited: null, sortOrder: 99 },
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
    console.log(`Upserted ${workspaces.length} workspaces`);

    // Seed global config
    const cfgColl = db.collection('workspace_config');
    await cfgColl.updateOne(
      { _id: 'global' },
      { $set: globalConfig },
      { upsert: true }
    );
    console.log('Upserted global workspace_config');

    console.log('Done.');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
