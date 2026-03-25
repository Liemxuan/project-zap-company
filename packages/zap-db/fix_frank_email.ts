import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const employeeId = 'cmn50rzf20002yxrle4fhs9bl';
  
  // Find employee and the connected user
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { user: true }
  });

  if (!employee) {
    console.log(`Employee ${employeeId} not found.`);
    return;
  }

  if (!employee.userId) {
    console.log(`Employee ${employeeId} has no associated user.`);
    return;
  }

  // Update the user's email
  const updatedUser = await prisma.user.update({
    where: { id: employee.userId },
    data: { email: 'frank@pho24.com.vn' }
  });

  console.log(`Successfully updated email to ${updatedUser.email} for user ID ${updatedUser.id}`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
