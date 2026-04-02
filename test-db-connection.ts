
import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://postgres:Pg%40Secret2026%21@136.118.121.105:5432/postgres?schema=public'

async function main() {
    console.log('Attempting to connect to database...')
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: DATABASE_URL,
            },
        },
    })

    try {
        await prisma.$connect()
        console.log('SUCCESS: Connection established.')
        
        // Let's try to query something or just list databases if possible
        // Since we are using Prisma we probably would want a query but we don't have a model yet
        // So we can use raw query
        const result = await prisma.$queryRaw`SELECT 1 as "test"`
        console.log('RAW QUERY SUCCESS:', result)
        
    } catch (error) {
        console.error('ERROR: Database connection failed.')
        console.error(error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
