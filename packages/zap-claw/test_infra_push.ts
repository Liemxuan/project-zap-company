
async function test() {
    try {
        console.log("Testing POST /api/admin/infra-registry...");
        const res = await fetch("http://localhost:3000/api/admin/infra-registry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "TEST_KEY_PROBE",
                project: "zap-test-project",
                apiKey: "sk-test-12345"
            })
        });

        if (res.ok) {
            console.log("✅ Success! Server responded specifically.");
            const json = await res.json();
            console.log("Response:", json);
        } else {
            console.error("❌ Failed. Status:", res.status);
            const text = await res.text();
            console.error("Body:", text);
        }
    } catch (e) {
        console.error("❌ Network error:", e);
    }
}

test();
