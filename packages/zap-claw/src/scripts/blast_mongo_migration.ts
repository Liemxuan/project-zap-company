import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const MONGO_URI = process.env.MONGODB_URI;

/**
 * [ZAP-CSO] BLAST: SQLite to MongoDB Sync Coordinator (COPY PHASE)
 * Objective: COPY legacy/mapping data from SQLite to MongoDB Atlas for analysis.
 * Strategy: Copy first, Analyze second, Switch last.
 * Tables: ComponentRegistry, ExtractionTicket
 */
async function blast() {
    if (!MONGO_URI) {
        console.error("❌ MONGODB_URI not found in environment.");
        process.exit(1);
    }

    console.log("🚀 [ZAP-CSO] Initializing Data Blast: SQLite -> MongoDB Atlas");

    const mongoClient = new MongoClient(MONGO_URI);
    try {
        await mongoClient.connect();
        const db = mongoClient.db("olympus");

        // 1. Migrate ComponentRegistry
        console.log("📦 Fetching ComponentRegistry from SQLite...");
        const sqliteComponents = await prisma.componentRegistry.findMany();
        console.log(`✅ Found ${sqliteComponents.length} components.`);

        if (sqliteComponents.length > 0) {
            const componentCol = db.collection("SYS_OS_component_registry");
            // Clear existing if needed (Optional planning decision)
            // await componentCol.deleteMany({});
            
            const componentData = sqliteComponents.map(c => ({
                ...c,
                id: undefined, // Let Mongo handle _id or map specific ID
                sqliteId: c.id,
                migratedAt: new Date()
            }));

            await componentCol.insertMany(componentData);
            console.log(`✅ [DONE] Inserted ${componentData.length} components into Mongo.`);
        }

        // 2. Migrate ExtractionTicket (Navigation Mapping)
        console.log("📦 Fetching ExtractionTicket (Navigation) from SQLite...");
        const sqliteTickets = await prisma.extractionTicket.findMany();
        console.log(`✅ Found ${sqliteTickets.length} tickets.`);

        if (sqliteTickets.length > 0) {
            const navCol = db.collection("SYS_OS_form_registry"); // Mapping to existing nav collection
            
            const navData = sqliteTickets.map(t => ({
                ...t,
                id: undefined,
                sqlitePath: t.urlPath,
                migratedAt: new Date(),
                // Parse JSON strings if they existed in SQLite string fields
                l5Organisms: t.l5Organisms ? JSON.parse(t.l5Organisms) : [],
                l4Molecules: t.l4Molecules ? JSON.parse(t.l4Molecules) : [],
                l3Atoms: t.l3Atoms ? JSON.parse(t.l3Atoms) : []
            }));

            await navCol.insertMany(navData);
            console.log(`✅ [DONE] Inserted ${navData.length} navigation tickets into Mongo.`);
        }

        console.log("🎉 [ZAP-CSO] Data Blast Complete. MongoDB Atlas synchronized for analysis.");

    } catch (err) {
        console.error("💥 Blast Failed:", err);
    } finally {
        await prisma.$disconnect();
        await mongoClient.close();
    }
}

// [ZAP-CSO] EXECUTION AUTHORIZED BY ZEUS.
blast();
