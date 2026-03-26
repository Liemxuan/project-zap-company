import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const GENESIS_PATH = "/Users/zap/Workspace/olympus/packages/zap-design/src/genesis";
const RELATIVE_BASE = "src/genesis";

function getFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
        } else {
            if (name.endsWith('.tsx') && !name.endsWith('.spec.tsx') && !name.endsWith('.test.tsx')) {
                fileList.push(name);
            }
        }
    }
    return fileList;
}

async function scanAndRegister() {
    const mongoClient = new MongoClient(MONGO_URI);
    try {
        await mongoClient.connect();
        const db = mongoClient.db("olympus");
        const registryCol = db.collection("SYS_OS_component_registry");

        console.log(`🔍 Scanning for Metro components in ${GENESIS_PATH}...`);

        const metroFiles = getFiles(GENESIS_PATH);

        console.log(`✅ Found ${metroFiles.length} physical Metro files.`);

        const components = metroFiles.map(file => {
            const fileName = path.basename(file, '.tsx');
            const relativePath = path.join(RELATIVE_BASE, path.relative(GENESIS_PATH, file));
            
            // Determine tier based on folder structure
            let tier = "UNKNOWN";
            if (file.includes('/atoms/')) tier = "L3-ATOM";
            else if (file.includes('/molecules/')) tier = "L4-MOLECULE";
            else if (file.includes('/organisms/')) tier = "L5-ORGANISM";
            else if (file.includes('/layout/')) tier = "L6-LAYOUT";
            else if (file.includes('/templates/')) tier = "L7-PAGE";

            return {
                name: fileName,
                path: relativePath,
                tier: tier,
                genesisOrigin: "METRO",
                genesisStatus: "EXISTS",
                migratedAt: new Date()
            };
        });

        console.log(`📦 Upserting ${components.length} Metro components into MongoDB...`);

        for (const comp of components) {
            await registryCol.updateOne(
                { name: comp.name, genesisOrigin: "METRO" },
                { $set: comp },
                { upsert: true }
            );
        }

        console.log("🎉 [ZAP-CSO] Metro Components Registered Successfully.");

    } catch (err) {
        console.error("💥 Registration Failed:", err);
    } finally {
        await mongoClient.close();
    }
}

scanAndRegister();
