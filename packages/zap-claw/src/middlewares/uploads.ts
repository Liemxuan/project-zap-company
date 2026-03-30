import { ToolMiddleware } from "./pipeline.js";
import { generateOmniContent } from "../runtime/engine/omni_router.js";
import * as fs from "fs";

export const UploadsMiddleware: ToolMiddleware = async (ctx, next) => {
    if (ctx.toolName === "analyze_asset") {
        console.log(`[UPLOADS MIDDLEWARE] 📸 Intercepted Asset OCR Request...`);
        const filePath = ctx.toolInput.path as string;

        if (!filePath || !fs.existsSync(filePath)) {
            ctx.resultContent = `[SYSTEM ERROR] UploadsMiddleware: Asset file not found at path: ${filePath}`;
            ctx.hadError = true;
            ctx.isAllowed = false;
            return;
        }

        const ext = filePath.split('.').pop()?.toLowerCase() || "bin";
        const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext);
        const isPdf = ["pdf"].includes(ext);

        if (!isImage && !isPdf) {
            ctx.resultContent = `[SYSTEM ERROR] UploadsMiddleware: Unsupported asset type '${ext}'. Currently only images (png/jpg/webp) and PDFs are supported.`;
            ctx.hadError = true;
            ctx.isAllowed = false;
            return;
        }

        try {
            console.log(`[UPLOADS MIDDLEWARE] 🧠 Igniting Vision API for ${filePath}...`);
            const base64Data = fs.readFileSync(filePath).toString("base64");
            const mimeType = isPdf ? "application/pdf" : `image/${ext === "jpg" ? "jpeg" : ext}`;

            // Pumping directly into Flash for high-speed OCR ingestion
            const ocrResponse = await generateOmniContent({
                apiKey: process.env.GOOGLE_API_KEY || process.env.OPENROUTER_API_KEY || "",
                defaultModel: "google/gemini-2.5-flash",
                agentId: ctx.botName
            }, {
                systemPrompt: "You are the ZAP-OS Vision OCR pipeline. Your job is to extract all visible text, structured UI layouts, and describe any diagrams or handwritten notes present in the document. Provide the raw Markdown extraction directly with no preamble. If it's code, wrap it in appropriate markdown blocks.",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Please extract the text and describe the layout and content of this asset." },
                            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
                        ] as any
                    }
                ],
                theme: "A_ECONOMIC",
                intent: "GENERAL",
                tools: [] // No tools necessary for pure OCR extraction
            });

            ctx.isAllowed = true;
            ctx.hadError = false;
            ctx.resultContent = `[OCR INGESTION COMPLETE - UploadsMiddleware] \n\n${ocrResponse.text || "No text detected."}`;
            console.log(`[UPLOADS MIDDLEWARE] ✅ OCR extraction complete for ${filePath}`);

            // Halt the pipeline so ExecutionMiddleware doesn't try to run 'analyze_asset' natively
            return;
        } catch (err: any) {
            console.error(`[UPLOADS MIDDLEWARE] 💥 Vision Pipeline Failed: ${err.message}`);
            ctx.resultContent = `[SYSTEM ERROR] Vision OCR failed: ${err.message}`;
            ctx.hadError = true;
            ctx.isAllowed = false;
            return;
        }
    }

    await next();
};
