import { OmniQueueManager } from './omni_queue.js';
import { executeVfsTool } from './vfs_tools.js';

async function verifyVfs() {
    console.log("Connecting to OmniQueue (Tenant: ZVN_TEST)...");
    const queue = new OmniQueueManager();
    await queue.connect("ZVN_TEST");

    console.log("Enqueueing VFS tool test job...");
    const payload = {
        systemPrompt: "You are a test agent. You have access to the Virtual File System tools (vfs_read, vfs_write, vfs_list). Please write the exact string 'Hello VFS Swarm!' to the path 'tmp://test_hello.txt'. You must use the tool call. Do not return chat.",
        messages: [{ role: "user", content: "Write the file now." }],
        theme: "A_ECONOMIC",
        intent: "EXECUTE"
    } as any;

    const jobId = await queue.enqueue(
        "Queue-Short",
        0,
        "ZVN_TEST",
        payload,
        { defaultModel: "google/gemini-2.5-flash", regionInfo: "US" } as any
    );

    console.log("Processing job", jobId);
    const processed = await queue.processNextJob("ZVN_TEST");
    if (!processed) {
        console.error("Failed to process job.");
        process.exit(1);
    }

    const jobResult = await queue.getJobStatus(jobId, "ZVN_TEST");
    const response = jobResult?.result;
    
    console.log("\n--- Agent Response ---");
    console.log(response ? JSON.stringify(response, null, 2) : "No Response");
    console.log("----------------------\n");

    if (response?.toolCalls && response.toolCalls.length > 0) {
        const toolCall = response.toolCalls[0];
        console.log(`Executing tool: ${toolCall.function.name}`);
        console.log(`Arguments: ${toolCall.function.arguments}`);
        
        const args = JSON.parse(toolCall.function.arguments);
        const output = await executeVfsTool(toolCall.function.name, args);
        
        console.log(`\n--- Tool Execution Output ---`);
        console.log(output);
        console.log(`-----------------------------\n`);
        
        // Verify Read
        if (toolCall.function.name === 'vfs_write') {
             console.log("Verifying written data with vfs_read...");
             const readOut = await executeVfsTool('vfs_read', { path: args.path });
             console.log(`Read back: ${readOut}`);
             
             if (readOut === args.content || String(readOut).includes('Hello VFS Swarm!')) {
                 console.log("✅ VFS Verification Passed!");
                 process.exit(0);
             } else {
                 console.log("❌ VFS Verification Failed: Content mismatch.");
                 process.exit(1);
             }
        }
    } else {
        console.log("❌ Agent did not return tool calls. Verification Failed.");
        process.exit(1);
    }
}

verifyVfs().catch(e => {
    console.error(e);
    process.exit(1);
});
