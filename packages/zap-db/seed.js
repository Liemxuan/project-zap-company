const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial developer user...');
  
  const user = await prisma.user.upsert({
    where: { email: 'name@zap' },
    update: {
      password: '1234',
      name: 'Nui / Newbie',
      role: 'ADMIN'
    },
    create: {
      email: 'name@zap',
      password: '1234',
      name: 'Nui / Newbie',
      role: 'ADMIN',
      employee: {
        create: {
          department: 'ENGINEERING',
          pinCode: '0000'
        }
      }
    }
  });

  console.log('User synced:', user.email);

  console.log('Seeding Pho24 merchant...');
  const pho24 = await prisma.user.upsert({
    where: { email: 'name@pho24' },
    update: { password: '4567', name: 'Pho24 Admin' },
    create: { email: 'name@pho24', password: '4567', name: 'Pho24 Admin' }
  });

  console.log('Seeding Pendolasco merchant...');
  const pendo = await prisma.user.upsert({
    where: { email: 'name@pendolasco' },
    update: { password: '4567', name: 'Pendolasco Admin' },
    create: { email: 'name@pendolasco', password: '4567', name: 'Pendolasco Admin' }
  });

  console.log('Merchants synced:', pho24.email, pendo.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
