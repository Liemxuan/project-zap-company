import { MongoClient, GridFSBucket } from "mongodb";

async function check() {
  const mclient = new MongoClient(process.env.MONGODB_URI!);
  await mclient.connect();
  const db = mclient.db("olympus");
  const bucket = new GridFSBucket(db, { bucketName: "ZVN_SYS_ARTIFACTS" });
  const files = await bucket.find({}).sort({ uploadDate: -1 }).limit(1).toArray();
  console.log("Latest File:", files);
  await mclient.close();
}
check().catch(console.error);
