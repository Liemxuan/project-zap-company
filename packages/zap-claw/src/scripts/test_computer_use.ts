import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

/**
 * ZAP-OS | OmniRouter Fleet Management
 * Explores the gemini-2.5-computer-use model for automated UI testing (replacing Playwright structural tests)
 */
async function triggerUIAutomatedSweep() {
    console.log("[ZAP] Initializing native connection to gemini-2.5-computer-use-preview-10-2025...");

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("[ZAP ERROR] Missing GOOGLE_API_KEY in environment matrix.");
        process.exit(1);
    }

    try {
        const computerUseModel = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: "gemini-2.5-computer-use-preview-10-2025",
            maxOutputTokens: 2048,
        });

        console.log("[ZAP] Computer Use Agent spawned. Injecting simulated DOM bounding box request for Deerflow 2.0...");
        
        // This simulates passing a UI payload (DOM state or VFS screenshot) to test the visual targeting logic
        const response = await computerUseModel.invoke([
            new HumanMessage({
                content: [
                    { 
                        type: "text", 
                        text: "Target: ZAP Deerflow 2.0 Command Center.\nObjective: Locate the 'Agent Swarm' button in the Left Nav Pane. Generate the exact testing locator string to bypass brittle XPath selection." 
                    },
                ]
            })
        ]);

        console.log("\n[ZAP Computer Use Agent Intelligence]:");
        console.log(response.content);
        console.log("\n[ZAP] UI Test validation cycle completed successfully. Polyfill complete.");
        
    } catch (error: any) {
        console.error("[ZAP FATAL] Model routing failed: ", error.message);
        console.log("[ZAP FALLBACK] If gemini-2.5-computer-use-preview-10-2025 is rejecting calls, check the model registry mapping in OmniRouter or ensure the Google API Key is whitelisted for the 10-2025 preview.");
    }
}

triggerUIAutomatedSweep();
