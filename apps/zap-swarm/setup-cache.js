const fs = require('fs');
const path = require('path');

const optimizations = {
  'api/swarm/docker/route.ts': 'export const revalidate = 5;',
  'api/swarm/jobs/route.ts': 'export const revalidate = 5;',
  'api/swarm/agents/route.ts': 'export const revalidate = 3600;',
  'api/swarm/sessions/route.ts': 'export const revalidate = 1;',
  'api/swarm/channels/route.ts': 'export const revalidate = 86400;',
  'api/swarm/cost/route.ts': 'export const revalidate = 300;',
  'api/swarm/skills/route.ts': 'export const revalidate = false;',
  'api/swarm/zss/route.ts': 'export const dynamic = "force-dynamic";',
  'api/swarm/security/route.ts': 'export const dynamic = "force-dynamic";'
};

const basePath = '/Users/zap/Workspace/olympus/apps/zap-swarm/src/app';

for (const [routePath, configStr] of Object.entries(optimizations)) {
  const fullPath = path.join(basePath, routePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('export const revalidate') && !content.includes('export const dynamic')) {
      content = `${configStr}\n${content}`;
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${routePath} with ${configStr}`);
    } else {
      console.log(`Skipped ${routePath} (already has config)`);
    }
  } else {
    console.log(`Not found: ${routePath}`);
  }
}
