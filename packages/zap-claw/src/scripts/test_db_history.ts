import { MongoClient } from "mongodb";
async function main() {
    const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
    await client.connect();
    const db = client.db("zap-claw");
    const msgs = await db.collection("SYS_OS_messages").find({ userId: 12345 }).toArray();
    console.log(JSON.stringify(msgs, null, 2));
    await client.close();
}
main().catch(console.error);
