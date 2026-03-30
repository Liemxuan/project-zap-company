let PrismaClient: any;
try {
  PrismaClient = require('@prisma/zap-db-client').PrismaClient;
} catch (e) {
  // Turbopack + pnpm: engine binary resolution can fail.
  // Pages that don't use Prisma should not be blocked.
  console.warn('[zap-db] PrismaClient import failed, database calls will be unavailable:', (e as Error).message);
  PrismaClient = null;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const prisma = globalForPrisma.prisma ?? (PrismaClient ? new PrismaClient() : null);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from './api'

