import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function catalogPages(dirPath, theme, basePath = '') {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
         await catalogPages(fullPath, theme, `${basePath}/${entry.name}`);
      } else if (entry.name === 'page.tsx') {
         const routePath = basePath || '/';
         
         // Upsert the tracking record
         await prisma.zapPageAudit.upsert({
            where: { pagePath: routePath },
            update: { theme },
            create: {
                pagePath: routePath,
                theme: theme,
                overallStatus: 'PENDING',
                aiReviewNotes: 'Awaiting Spike / Team Claud Analysis...'
            }
         });
         console.log(`[${theme}] Seeded Ticket -> ${routePath}`);
      }
    }
  } catch (err) {
      // Directory might not exist yet, that's fine.
  }
}

async function main() {
    console.log("🔥 INITIATING L1-L7 ZAP ARCHITECTURE AUDIT 🔥");
    
    // 1. Seed CORE Database Pages
    console.log("\n--- Traversing CORE Routes ---");
    await catalogPages('/Users/zap/Workspace/olympus/packages/zap-design/src/app/design/core', 'CORE', '/design/core');
    
    // 2. Seed METRO Database Pages
    console.log("\n--- Traversing METRO Routes ---");
    await catalogPages('/Users/zap/Workspace/olympus/packages/zap-design/src/app/design/(metro)', 'METRO', '/design/metro');

    console.log("\n✅ Seeding Complete.");
    console.log("⚡ Database is now primed for Spike and Team Claud to begin the localized audits.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
