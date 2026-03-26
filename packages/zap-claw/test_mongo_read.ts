import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const MONGO_URI = process.env.MONGODB_URI || "";
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("olympus");
        const doc = await db.collection("SYS_OS_global_models").findOne({ _id: "global_registry" });
        console.log(JSON.stringify(doc?.overrides, null, 2));
    } finally {
        await client.close();
    }
}
run().catch(console.error);
