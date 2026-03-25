import { PrismaClient } from './node_modules/@prisma/zap-db-client/index.js';

const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users.length);
  console.log(users.map((u: any) => u.email).join(", "));
}
main().catch(console.error).finally(() => prisma.$disconnect());
