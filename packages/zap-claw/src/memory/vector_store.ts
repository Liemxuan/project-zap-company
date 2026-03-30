import "dotenv/config";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export class VectorStore {
    private chromaClient: Chroma;

    constructor() {
        const googleApiKey = process.env["GOOGLE_API_KEY"];
        if (!googleApiKey) {
            console.warn("[vector_store] ⚠️ GOOGLE_API_KEY not found. Semantic search embeddings will fail.");
        }
        
        const bindings = new GoogleGenerativeAIEmbeddings({
            apiKey: googleApiKey || "dummy",
            modelName: "gemini-embedding-2-preview", // SOP-036: Multimodal Embedding 2 for native VFS image mapping
        });

        this.chromaClient = new Chroma(bindings, {
            collectionName: "zap-knowledge",
            url: process.env.CHROMA_URL || "http://localhost:8100"
        });
    }

    async getEmbedding(text: string): Promise<number[]> {
        // Embeddings are now handled natively by the LangChain Chroma retriever during search/add operations via gemini-embedding-2-preview.
        // This is kept for legacy compatibility if strict manual embedding extraction is requested.
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env["GOOGLE_API_KEY"] || "dummy",
            modelName: "gemini-embedding-2-preview",
        });
        return await embeddings.embedQuery(text);
    }

    async search(query: string, merchantId: string, accountType: string = "PERSONAL", limit = 5): Promise<any[]> {
        try {
            // LangChain Chroma search with metadata filtering for hard Account Isolation
            // Chroma requires $and/$or wrappers when filtering on multiple distinct fields
            const results = await this.chromaClient.similaritySearch(query, limit, {
                $and: [
                    { merchantId: { $eq: merchantId } },
                    { accountType: { $eq: accountType } }
                ]
            });
            
            return results.map(doc => ({
                fact: doc.pageContent,
                factType: doc.metadata?.factType || "UNKNOWN",
                accountType: doc.metadata?.accountType || "PERSONAL",
                merchantId: doc.metadata?.merchantId || "UNKNOWN"
            }));
            
        } catch (error: any) {
            console.warn(`[vector_store] ⚠️ Chroma search failed: ${error.message}`);
            return [];
        }
    }
    
    async insertMany(documents: { merchantId: string, accountType: string, factType: string, fact: string }[]) {
        try {
            const texts: string[] = [];
            const metadatas: Record<string, any>[] = [];
            const ids: string[] = [];
            const crypto = await import("crypto");
            
            for (const d of documents) {
                // Phase 8 (DeerFlow Pattern): Aggressive memory deduplication:
                // Normalizing whitespace and creating a deterministic hash ID
                const normalizedFact = d.fact.replace(/\s+/g, " ").trim().toLowerCase();
                const hashId = crypto.createHash("sha256").update(`${d.merchantId}:${d.accountType}:${normalizedFact}`).digest("hex");
                
                texts.push(d.fact);
                metadatas.push({
                    merchantId: d.merchantId,
                    accountType: d.accountType,
                    factType: d.factType,
                    dedupHash: hashId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                ids.push(hashId);
            }
            
            await this.chromaClient.addDocuments(
                texts.map((text, i) => ({ pageContent: text, metadata: metadatas[i] as Record<string, any> })),
                { ids }
            );
            console.log(`[vector_store] 🧠 Inserted/Upserted ${documents.length} facts with deterministic deduplication hashes.`);
        } catch (error: any) {
             console.error(`[vector_store] ❌ Failed to insert into Chroma: ${error.message}`);
        }
    }

    async close() {
        // Chroma HTTP Client doesn't require structured close like Mongo
    }
}

export const vectorStore = new VectorStore();
