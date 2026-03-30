import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

const globalForMongo = globalThis as unknown as { mongoClient: MongoClient };
let mongoClient = globalForMongo.mongoClient;

export async function GET() {
    try {
        if (!mongoClient) {
            const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
            mongoClient = new MongoClient(uri);
            if (process.env.NODE_ENV !== 'production') globalForMongo.mongoClient = mongoClient;
        }

        const db = mongoClient.db('olympus');
        const rawTickets = await db.collection("SYS_OS_form_registry").find({}).sort({ sqlitePath: 1 }).toArray();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tickets = rawTickets.map((t: any, index: number) => ({
            ...t,
            indexId: `ZAP-${String(index + 1).padStart(3, '0')}`,
            urlPath: t.sqlitePath || t.urlPath || '',
            l5Organisms: Array.isArray(t.l5Organisms) ? t.l5Organisms : (typeof t.l5Organisms === 'string' ? JSON.parse(t.l5Organisms || '[]') : []),
            l4Molecules: Array.isArray(t.l4Molecules) ? t.l4Molecules : (typeof t.l4Molecules === 'string' ? JSON.parse(t.l4Molecules || '[]') : []),
            l3Atoms: Array.isArray(t.l3Atoms) ? t.l3Atoms : (typeof t.l3Atoms === 'string' ? JSON.parse(t.l3Atoms || '[]') : []),
            l2Primitives: Array.isArray(t.l2Primitives) ? t.l2Primitives : (typeof t.l2Primitives === 'string' ? JSON.parse(t.l2Primitives || '[]') : []),
            l1Tokens: Array.isArray(t.l1Tokens) ? t.l1Tokens : (typeof t.l1Tokens === 'string' ? JSON.parse(t.l1Tokens || '[]') : [])
        }));

        return NextResponse.json(tickets);
    } catch (err: unknown) {
        console.error("Mongo Error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}
