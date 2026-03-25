import { PrismaClient } from '@prisma/zap-db-client'

const prisma = new PrismaClient()

async function main() {
  console.log('Beginning massive Omni-Tier structured seeding process...')

  // LEVEL 0: ZAP PLATFORM
  // Zeus Tom exists entirely outside the multi-tenant Organization silos.
  const zapRoot = await prisma.user.upsert({
    where: { email: 'tom@zap.vn' },
    update: {},
    create: {
      email: 'tom@zap.vn',
      name: 'Zeus Tom',
      avatarUrl: 'https://i.pravatar.cc/150?u=tom@zap.vn',
      role: 'SUPERADMIN',
      password: '1234',
      employee: {
        create: {
          assignedLevel: 0,
          department: 'Security & Infrastructure',
          position: 'Chief Security Officer',
          pinCode: '0000',
        }
      }
    }
  })
  console.log(`ZAP Root user initialized: ${zapRoot.email}`)

  // LEVEL 1: ORGANIZATION
  // Frank C's multi-brand holding company.
  const orgFrankHoldings = await prisma.organization.upsert({
    where: { name: 'Frank C Holdings' },
    update: {},
    create: {
      name: 'Frank C Holdings'
    }
  })

  // Frank C is explicitly bound to Level 1.
  const frank = await prisma.user.upsert({
    where: { email: 'frank@pho24.com.vn' },
    update: {},
    create: {
      email: 'frank@pho24.com.vn',
      name: 'Frank C',
      avatarUrl: 'https://i.pravatar.cc/150?u=frank@pho24.com.vn',
      role: 'ADMIN',
      password: '1234',
      employee: {
        create: {
          assignedLevel: 1,
          organizationId: orgFrankHoldings.id,
          department: 'Executive',
          position: 'Brand Manager',
          pinCode: '1000'
        }
      }
    }
  })
  console.log(`Org Node initialized: ${frank.email} -> ${orgFrankHoldings.name}`)

  // LEVEL 2: BRANDS
  // Frank owns both Pho24 and Pendolasco and shares loyalty points across the brand layer.
  const brandPho24 = await prisma.brand.upsert({
    where: { name: 'Pho24' },
    update: {},
    create: {
      name: 'Pho24',
      organizationId: orgFrankHoldings.id,
      shareCustomers: true
    }
  })
  
  const brandPendolasco = await prisma.brand.upsert({
    where: { name: 'Pendolasco' },
    update: {},
    create: {
      name: 'Pendolasco',
      organizationId: orgFrankHoldings.id,
      shareCustomers: true
    }
  })

  // LEVEL 6: LOCATIONS (The physical endpoints)
  const locPho24D1 = await prisma.location.upsert({
    where: { name: 'Pho24 - District 1' },
    update: {},
    create: {
      name: 'Pho24 - District 1',
      brandId: brandPho24.id
    }
  })

  const locPho24HN = await prisma.location.upsert({
    where: { name: 'Pho24 - Hanoi Tower' },
    update: {},
    create: {
      name: 'Pho24 - Hanoi Tower',
      brandId: brandPho24.id
    }
  })

  const locPendoThaoDien = await prisma.location.upsert({
    where: { name: 'Pendolasco - Thao Dien' },
    update: {},
    create: {
      name: 'Pendolasco - Thao Dien',
      brandId: brandPendolasco.id
    }
  })

  // LEVEL 6 EMPLOYEE (Pho24 D1 Cashier - Locked out of other locations)
  const danCashier = await prisma.user.upsert({
    where: { email: 'dan@pho24.com.vn' },
    update: {},
    create: {
      email: 'dan@pho24.com.vn',
      name: 'Dan (D1 Cashier)',
      avatarUrl: 'https://i.pravatar.cc/150?u=dan@pho24.com.vn',
      role: 'USER',
      password: '1234',
      employee: {
        create: {
          assignedLevel: 6,
          locationId: locPho24D1.id,
          department: 'Operations',
          position: 'Cashier',
          pinCode: '4567'
        }
      }
    }
  })
  console.log(`Added Level 6 Floor Employee: ${danCashier.email}`)

  // LEVEL 10: CUSTOMERS
  // Absolutely no internal access, strictly a consumer record mapping.
  const hungryConsumer = await prisma.user.upsert({
    where: { email: 'hungry_guy@gmail.com' },
    update: {},
    create: {
      email: 'hungry_guy@gmail.com',
      name: 'Hungry Customer',
      avatarUrl: 'https://i.pravatar.cc/150?u=hungry_guy@gmail.com',
      role: 'USER',
      password: 'password'
    }
  })
  console.log(`Added Level 10 Consumer: ${hungryConsumer.email}`)

  console.log('Seeding procedure complete. Omni-Tier state achieved.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
