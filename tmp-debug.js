import { prisma } from './packages/zap-db/index.js'; // or similar

async function main() {
    const users = await prisma.user.findMany({
        include: { 
            employee: { 
                include: { 
                    organization: true,
                    brand: true,
                    location: true
                } 
            } 
        },
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error);
