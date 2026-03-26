import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const mongoClient = new MongoClient(MONGO_URI);

export interface CaseRecord {
    _id?: ObjectId;
    caseId: string;
    tenantId: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    priority: number;
    payload: any;
    result?: any;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function createCase(tenantId: string, priority: number, payload: any): Promise<string> {
    const caseId = `CASE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    await mongoClient.connect();
    const db = mongoClient.db("olympus");
    const cases = db.collection<CaseRecord>("cases");

    const record: CaseRecord = {
        caseId,
        tenantId,
        status: "PENDING",
        priority,
        payload,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await cases.insertOne(record);
    return caseId;
}

export async function updateCaseStatus(caseId: string, status: CaseRecord["status"], result?: any, error?: string) {
    await mongoClient.connect();
    const db = mongoClient.db("olympus");
    const cases = db.collection<CaseRecord>("cases");

    const updateDoc: any = { 
        status, 
        updatedAt: new Date() 
    };
    if (result) updateDoc.result = result;
    if (error) updateDoc.error = error;

    await cases.updateOne(
        { caseId },
        { $set: updateDoc }
    );
}

export async function getCaseStatus(caseId: string): Promise<CaseRecord | null> {
    await mongoClient.connect();
    const db = mongoClient.db("olympus");
    const cases = db.collection<CaseRecord>("cases");

    return await cases.findOne({ caseId });
}
