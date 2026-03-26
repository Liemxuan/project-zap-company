import { MongoClient, ObjectId } from 'mongodb';
import { VFSBackend } from '../vfs_router.js';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

export class MongoAdapter implements VFSBackend {
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(MONGO_URI);
    }

    private parseUri(uriPath: string) {
        // Expected format: collection/key or collection/documents/key
        const parts = uriPath.split('/');
        if (parts.length < 2) {
            throw new Error(`[VFS shared://] Invalid format. Expected 'collection/key'. Got: ${uriPath}`);
        }
        const collectionName = parts[0] as string;
        const key = parts.slice(1).join('/');
        return { collectionName, key };
    }

    async read(uriPath: string): Promise<string> {
        const { collectionName, key } = this.parseUri(uriPath);
        await this.client.connect();
        const db = this.client.db(DB_NAME);
        const col = db.collection(collectionName);

        const doc = await col.findOne({ _id: key as any });
        if (!doc) {
            throw new Error(`[VFS shared://] Document not found: ${uriPath}`);
        }
        
        // Try to decode back nicely if it's JSON
        return doc.content || JSON.stringify(doc, null, 2);
    }

    async write(uriPath: string, content: string): Promise<void> {
        const { collectionName, key } = this.parseUri(uriPath);
        await this.client.connect();
        const db = this.client.db(DB_NAME);
        const col = db.collection(collectionName);

        let parsedContent: any = { content };
        try {
            // Attempt to store as native JSON if valid
            parsedContent = JSON.parse(content);
            if (typeof parsedContent !== 'object' || parsedContent === null) {
                parsedContent = { content };
            }
        } catch (e) {
            // Leave as literal text content
        }

        await col.updateOne(
            { _id: key as any },
            { $set: { ...parsedContent, updatedAt: new Date() } },
            { upsert: true }
        );
    }

    async list(prefix: string): Promise<string[]> {
        // Expected prefix: collection/ or collection/some_prefix
        const parts = prefix.split('/');
        if (parts.length === 0 || parts[0] === '') return [];
        
        const collectionName = parts[0] as string;
        const keyPrefix = parts.slice(1).join('/');
        
        await this.client.connect();
        const db = this.client.db(DB_NAME);
        const col = db.collection(collectionName);

        // Find all documents where _id starts with keyPrefix
        const filter: any = keyPrefix ? { _id: { $regex: `^${keyPrefix}` } } : {};
        const docs = await col.find(filter).toArray();

        return docs.map(d => `${collectionName}/${d._id}`);
    }
}
