import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load directly to olympus DB
const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/olympus';
const KNOWLEDGE_DIR = '/Users/zap/.gemini/antigravity/knowledge';

async function syncKnowledge() {
    console.log('🔗 Connecting to MongoDB...');
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('olympus');
        const knowledgeCollection = db.collection('knowledge_items');

        console.log(`📂 Scanning directory: ${KNOWLEDGE_DIR}`);
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            console.log('⚠️ Knowledge directory not found. Exiting.');
            return;
        }

        const items = fs.readdirSync(KNOWLEDGE_DIR, { withFileTypes: true });

        for (const item of items) {
            if (item.isDirectory()) {
                const itemPath = path.join(KNOWLEDGE_DIR, item.name);
                const metadataPath = path.join(itemPath, 'metadata.json');

                if (fs.existsSync(metadataPath)) {
                    console.log(`🧠 Processing knowledge node: ${item.name}`);
                    const rawMetadata = fs.readFileSync(metadataPath, 'utf-8');
                    let metadata;
                    try {
                        metadata = JSON.parse(rawMetadata);
                    } catch (e) {
                        console.error(`Failed to parse metadata for ${item.name}`);
                        continue;
                    }

                    // Package up artifacts
                    const artifactsPath = path.join(itemPath, 'artifacts');
                    let artifacts: any[] = [];
                    if (fs.existsSync(artifactsPath)) {
                        const crawlArtifacts = (dir: string, base: string = '') => {
                            const entries = fs.readdirSync(dir, { withFileTypes: true });
                            for (const entry of entries) {
                                const entryPath = path.join(dir, entry.name);
                                const relativePath = path.join(base, entry.name);
                                if (entry.isDirectory()) {
                                    crawlArtifacts(entryPath, relativePath);
                                } else if (entry.isFile() && entry.name.endsWith('.md')) {
                                    const content = fs.readFileSync(entryPath, 'utf-8');
                                    artifacts.push({
                                        id: relativePath,
                                        content: content,
                                        size: content.length,
                                    });
                                }
                            }
                        };
                        crawlArtifacts(artifactsPath);
                    }

                    const document = {
                        nodeId: item.name,
                        title: metadata.title || item.name,
                        summary: metadata.summary,
                        createdAt: metadata.created_at,
                        updatedAt: metadata.updated_at,
                        artifacts: artifacts,
                        lastSyncedAt: new Date(),
                    };

                    // Upsert into MongoDB
                    await knowledgeCollection.updateOne(
                        { nodeId: item.name },
                        { $set: document },
                        { upsert: true }
                    );
                    console.log(`   ✅ Synced: ${document.title} (${artifacts.length} artifacts)`);
                }
            }
        }

        console.log('🚀 Knowledge Vault sync complete!');
    } catch (error) {
        console.error('❌ Sync failed:', error);
    } finally {
        await client.close();
    }
}

syncKnowledge();
