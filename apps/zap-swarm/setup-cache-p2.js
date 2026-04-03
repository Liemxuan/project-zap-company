const fs = require('fs');
const path = require('path');

const optimizations = {
  'api/swarm/chat/route.ts': 'export const dynamic = "force-dynamic";',
  'api/swarm/approvals/route.ts': 'export const revalidate = 5;',
  'api/swarm/models/route.ts': 'export const revalidate = 86400;',
  'api/fleet/route.ts': 'export const revalidate = 30;',
  'api/swarm/mcp/route.ts': 'export const revalidate = false;'
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
