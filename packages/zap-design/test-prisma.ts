import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function test() {
  const count = await prisma.assetTicket.count();
  console.log("AssetTicket count:", count);
}
test().catch(e => console.error("Error:", e.message));
