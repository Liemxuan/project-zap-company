/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Component Registry migration...');

  // Update MetroShell -> AppShell
  const shellUpdate = await prisma.componentRegistry.updateMany({
    where: { 
      name: { contains: 'MetroShell' }
    },
    data: { 
      name: 'AppShell',
      sourcePath: 'src/zap/layout/AppShell.tsx'
    },
  });
  console.log(`Updated ${shellUpdate.count} MetroShell entries to AppShell`);

  // Update MetroPageHeader -> PageHeader
  const headerUpdate = await prisma.componentRegistry.updateMany({
    where: { 
      name: { contains: 'MetroPageHeader' }
    },
    data: { 
      name: 'PageHeader',
      sourcePath: 'src/zap/layout/PageHeader.tsx'
    },
  });
  console.log(`Updated ${headerUpdate.count} MetroPageHeader entries to PageHeader`);

}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Migration complete.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
