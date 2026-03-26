import "dotenv/config";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

export class VectorStore {
    private chromaClient: Chroma;

    constructor() {
        const googleApiKey = process.env["GOOGLE_API_KEY"];
        if (!googleApiKey) {
            console.warn("[vector_store] ⚠️ GOOGLE_API_KEY not found. Semantic search embeddings will fail.");
        }
        
        const embeddingParams = {
            openAIApiKey: googleApiKey || "dummy", 
            modelName: "gemini-embedding-001",
            configuration: {
                baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
            }
        };

        this.chromaClient = new Chroma(new OpenAIEmbeddings(embeddingParams), {
            collectionName: "zap-knowledge",
            url: process.env.CHROMA_URL || "http://localhost:8100"
        });
    }

    async getEmbedding(text: string): Promise<number[]> {
        // Embeddings are now handled natively by the LangChain Chroma retriever during search/add operations.
        // This is kept for legacy compatibility if strict manual embedding extraction is requested.
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env["GOOGLE_API_KEY"] || "dummy", 
            modelName: "gemini-embedding-001",
            configuration: {
                baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
            }
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
            const texts = documents.map(d => d.fact);
            const metadatas = documents.map(d => ({
                merchantId: d.merchantId,
                accountType: d.accountType,
                factType: d.factType,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));
            
            await this.chromaClient.addDocuments(
                texts.map((text, i) => ({ pageContent: text, metadata: metadatas[i] as Record<string, any> }))
            );
        } catch (error: any) {
             console.error(`[vector_store] ❌ Failed to insert into Chroma: ${error.message}`);
        }
    }

    async close() {
        // Chroma HTTP Client doesn't require structured close like Mongo
    }
}

export const vectorStore = new VectorStore();
