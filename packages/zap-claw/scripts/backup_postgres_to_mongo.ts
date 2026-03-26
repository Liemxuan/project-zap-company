import { PrismaClient } from '@prisma/client';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env vars are loaded (Prisma handles its own, but MongoClient needs MONGODB_URI)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zap_os_mongo';
const BACKUP_DB_NAME = 'zap_os_pg_backup';

const prisma = new PrismaClient();
const mongoClient = new MongoClient(MONGODB_URI);

async function performBackup() {
    let db: Db;

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoClient.connect();
        db = mongoClient.db(BACKUP_DB_NAME);
        console.log(`✅ Connected to MongoDB Database: ${BACKUP_DB_NAME}`);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        console.log(`⏰ Starting backup at ${timestamp}`);

        // Define the tables to backup. Order matters slightly for referential integrity if restoring, 
        // though Mongo doesn't enforce it, it's good practice.
        const backupTargets = [
            { name: 'tenants', fetcher: () => prisma.tenants.findMany() },
            { name: 'locations', fetcher: () => prisma.locations.findMany() },
            { name: 'product_variants', fetcher: () => prisma.product_variants.findMany() },
            { name: 'inventory_counts', fetcher: () => prisma.inventory_counts.findMany() },
            { name: 'inventory_movements', fetcher: () => prisma.inventory_movements.findMany() },
            { name: 'purchase_orders', fetcher: () => prisma.purchase_orders.findMany() }
        ];

        for (const target of backupTargets) {
            console.log(`\n📦 Fetching data from PostgreSQL table: ${target.name}...`);
            const data = await target.fetcher();
            
            if (data.length === 0) {
                console.log(`⚠️ No records found in ${target.name}. Skipping.`);
                continue;
            }

            console.log(`📊 Found ${data.length} records in ${target.name}.`);

            // We append the timestamp to the collection name to keep historical backups separate
            const collectionName = `${target.name}_${timestamp}`;
            const collection = db.collection(collectionName);

            console.log(`💾 Inserting records into MongoDB collection: ${collectionName}...`);
            const result = await collection.insertMany(data);
            
            console.log(`✅ Successfully inserted ${result.insertedCount} records into ${collectionName}.`);
        }

        console.log('\n🎉 Postgres-to-Mongo Backup Sync Completed Successfully!');

    } catch (error) {
        console.error('❌ Error during Postgres-to-Mongo backup:', error);
        process.exit(1);
    } finally {
        console.log('🔒 Closing database connections...');
        await prisma.$disconnect();
        await mongoClient.close();
    }
}

// Execute the backup
performBackup();
