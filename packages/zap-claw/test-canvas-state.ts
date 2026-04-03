import { createCanvasSession, getCanvasSession } from './src/gateway/canvas.js';

async function runTest() {
    console.log("🚀 Initializing Ephemeral Canvas Test Sandbox...");
    
    // 1. Generate a mock chart payload
    const mockPayload = {
        type: "chart" as const,
        data: {
            title: "Store Performance Q3",
            series: [1000, 3000, 5000, 15000],
            labels: ["July", "August", "September", "October"]
        }
    };
    
    try {
        // 2. Insert into MongoDB
        const canvasId = await createCanvasSession(mockPayload, "TEST_AGENT", "ZVN_MERCHANT_1", 10);
        console.log(`✅ [SUCCESS] Created Ephemeral Canvas Session: ${canvasId}`);
        
        // 3. Immediately fetch it back to verify TTL logic hasn't preemptively nuked it
        const fetched = await getCanvasSession(canvasId);
        if (fetched) {
             console.log(`✅ [SUCCESS] Fetched Canvas Payload verification passed.`);
             console.log(`   Data Preview: ${JSON.stringify(fetched.payload.data).substring(0, 50)}...`);
             console.log(`   Expires At: ${fetched.expiresAt}`);
        } else {
             console.error(`❌ [FAILED] Could not retrieve just-created session: ${canvasId}`);
        }
        
        // 4. Test Invalid Fetch
        const invalidFetch = await getCanvasSession("fake-uuid-1234");
        if (!invalidFetch) {
             console.log(`✅ [SECURITY PASS] Fake UUID correctly rejected / returns null.`);
        } else {
             console.error(`❌ [FAILED] Fake UUID returned data. Critical flaw.`);
        }
        
    } catch (e: any) {
        console.error("❌ Test script crashed:", e.message);
    }
    
    process.exit(0);
}

runTest();
