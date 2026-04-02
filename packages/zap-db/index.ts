let PrismaClient: any;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (e) {
  // Turbopack + pnpm: engine binary resolution can fail.
  // Pages that don't use Prisma should not be blocked.
  console.warn('[zap-db] PrismaClient import failed, database calls will be unavailable:', (e as Error).message);
  PrismaClient = null;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let prismaInstance: any = null;
if (PrismaClient && process.env.DATABASE_URL) {
  try {
    prismaInstance = new PrismaClient();
  } catch (e) {
    console.warn('[zap-db] PrismaClient instantiation failed:', (e as Error).message);
    prismaInstance = null;
  }
} else if (!process.env.DATABASE_URL) {
  console.warn('[zap-db] DATABASE_URL not set, Prisma client will be unavailable');
}

export const prisma = globalForPrisma.prisma ?? prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from './api'

