const { MongoClient } = require('mongodb');
require('dotenv').config();

async function check() {
  const mclient = new MongoClient(process.env.MONGODB_URI);
  await mclient.connect();
  const db = mclient.db("olympus");
  const count = await db.collection("SYS_API_KEYS").countDocuments();
  console.log("Total keys in DB:", count);
  await mclient.close();
}
check().catch(console.error);
