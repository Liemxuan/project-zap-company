import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: "/Users/zap/Workspace/zap-core/.env", override: true });

async function migrateEnvKeys() {
    console.log("🚀 Starting MongoDB API Key Fleet Migration...");
    
    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not set!");
        process.exit(1);
    }

    const t0 = Date.now();
    const mclient = new MongoClient(process.env.MONGODB_URI);
    await mclient.connect();
    
    const db = mclient.db("olympus");
    const col = db.collection("SYS_API_KEYS");
    
    // Clear out testing cruft if any
    // await col.deleteMany({}); 
    
    let totalIngested = 0;

    const processPool = async (tier: string, envString: string | undefined) => {
        if (!envString) return;
        try {
            const projects = JSON.parse(envString);
            for (const proj of projects) {
                if (!proj.keys || !Array.isArray(proj.keys)) continue;
                for (let i = 0; i < proj.keys.length; i++) {
                    const rawKey = proj.keys[i];
                    if (!rawKey) continue;
                    
                    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex").substring(0, 16);
                    
                    await col.updateOne(
                        { keyHash },
                        {
                            $setOnInsert: {
                                keyHash,
                                encryptedKey: rawKey, // Placeholder: implement symmetric AES-256 in prod
                                provider: "google",
                                tier: tier,
                                allocation: "MERCHANT_SHARED",
                                status: "ACTIVE",
                                projectId: proj.id,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }
                        },
                        { upsert: true }
                    );
                    totalIngested++;
                }
            }
        } catch (e) {
            console.error(`❌ Failed to parse ${tier} pool:`, e);
        }
    };

    await processPool("ULTRA", process.env.GOOGLE_ULTRA_POOL);
    await processPool("PRO", process.env.GOOGLE_PRO_POOL);

    await mclient.close();
    console.log(`✅ Migration Complete in ${Date.now() - t0}ms. Ingested ${totalIngested} keys into SYS_API_KEYS.`);
}

migrateEnvKeys().catch(console.error);
