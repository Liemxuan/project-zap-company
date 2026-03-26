import { prisma } from "../db/client.js";
import { appendMessage } from "../history.js";
import { runRalphExtraction } from "../memory/ralph.js";

async function testLargePayload() {
    console.log("🚀 Starting Large Payload Protection Test...");

    const sessionId = 999999; // Mock session
    const largeContent = "X".repeat(1000000); // 1MB content

    try {
        console.log("📝 Attempting to append 1MB tool result...");
        await appendMessage(sessionId, "tool", largeContent, "PERSONAL", "test_tool");

        // Verify truncation in history
        const interactions = await prisma.interaction.findMany({
            where: { sessionId: sessionId.toString() },
            orderBy: { createdAt: "desc" },
            take: 1
        });

        if (!interactions[0]) {
            console.error("❌ No interaction found for testing.");
            process.exit(1);
        }
        const savedContent = interactions[0].content;
        console.log(`📊 Saved content length: ${savedContent.length}`);

        if (savedContent.length < 60000 && savedContent.includes("[TRUNCATED")) {
            console.log("✅ History Truncation Verified.");
        } else {
            console.error("❌ History Truncation FAILED.");
            process.exit(1);
        }

        // Verify Ralph can process it without crashing
        console.log("🤖 Running Ralph Extraction on truncated payload...");
        await runRalphExtraction(); // No args needed as it scans all unprocessed

        const interactionAfter = await prisma.interaction.findUnique({
            where: { id: interactions[0].id }
        });

        if (interactionAfter?.processed === true) {
            console.log("✅ Ralph Batch Processing Verified.");
        } else {
            console.error("❌ Ralph Batch Processing FAILED (Interaction not marked processed).");
            process.exit(1);
        }

        // Cleanup
        await prisma.interaction.deleteMany({ where: { sessionId: sessionId.toString() } });
        console.log("🧹 Test Data Cleaned Up.");
        console.log("🏁 TEST PASSED.");

    } catch (error) {
        console.error("💥 TEST FAILED with error:", error);
        process.exit(1);
    }
}

testLargePayload();
