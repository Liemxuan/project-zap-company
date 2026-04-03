import { MongoClient } from "mongodb";
import { Redis } from "ioredis";
import dotenv from "dotenv";

async function revive() {
    dotenv.config();
    const mUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    const rUri = process.env.REDIS_URL || "redis://127.0.0.1:6379";

    const client = new MongoClient(mUri);
    await client.connect();
    const db = client.db("olympus");
    const res = await db.collection("SYS_API_KEYS").updateMany({ status: "DEAD" }, { $set: { status: "ACTIVE" } });
    console.log(`Revived ${res.modifiedCount} keys in Mongo [Database: ${db.databaseName}].`);
    
    const redis = new Redis(rUri);
    await redis.del("dead_keys:google");
    await redis.del("dead_keys:openrouter");
    console.log("Cleared Redis dead keys.");
    
    await client.close();
    redis.disconnect();
}
revive();
