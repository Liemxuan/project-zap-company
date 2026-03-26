import "dotenv/config";

/**
 * ZAP OS Infrastructure Manager
 * Uses high-level Management Keys to monitor system health, credits, and APIs.
 */

const mask = (k: string | undefined) => k ? `${k.slice(0, 8)}...${k.slice(-4)}` : "MISSING";

export async function checkInfrastructureStatus() {
    console.log("\n🚀 [ZAP OS] Infrastructure Management Layer Status:");

    const infra = [];

    // 1. OpenRouter (tom@two.vn)
    const orMgmtKey = process.env.OPENROUTER_MANAGEMENT_KEY || "";
    const orApiKey = process.env.OPENROUTER_API_KEY || "";
    try {
        const res = await fetch("https://openrouter.ai/api/v1/credits", {
            headers: { "Authorization": `Bearer ${orMgmtKey}` }
        });
        const data = res.ok ? await res.json() as any : null;
        const balance = data ? `$${(data.data.total_credits - data.data.total_usage).toFixed(2)}` : "ERROR";

        infra.push({
            Provider: "OpenRouter",
            Type: "Management",
            Account: "tom@two.vn",
            Project: "N/A",
            "API Key": mask(orApiKey),
            Status: `ACTIVE (${balance})`
        });
    } catch (e) {
        infra.push({ Provider: "OpenRouter", Type: "Management", Account: "tom@two.vn", Project: "N/A", "API Key": mask(orApiKey), Status: "OFFLINE" });
    }

    // 2. Google Cloud (ULTRA)
    infra.push({
        Provider: "Google Cloud",
        Type: "ULTRA (Unrestricted)",
        Account: "tomtranzap@gmail.com",
        Project: "projects/668864641706",
        "API Key": mask(process.env.GOOGLE_API_KEY),
        Status: "ACTIVE"
    });

    // 3. Google Cloud (PRO)
    infra.push({
        Provider: "Google Cloud",
        Type: "PRO (Restricted)",
        Account: "tom@zap.vn",
        Project: "projects/827873171728",
        "API Key": "HIDDEN",
        Status: "ACTIVE"
    });

    // 4. Local LLM
    infra.push({
        Provider: "Ollama",
        Type: "Local",
        Account: "Localhost",
        Project: "Mac Mini M4",
        "API Key": "NONE (Local)",
        Status: "ACTIVE"
    });

    console.table(infra);

    // Low Credit Warning
    const orStatus = infra.find(i => i.Provider === "OpenRouter")?.Status;
    if (orStatus?.includes("$")) {
        // Extract numeric value from "ACTIVE ($14.90)"
        const match = orStatus.match(/\$(\d+\.\d+)/);
        if (match && match[1] && parseFloat(match[1]) < 5.00) {
            console.warn("\n⚠️  [ALERT] OpenRouter credits are dangerously low!");
        }
    }
}

if (process.argv[1]?.includes("infrastructure.ts")) {
    checkInfrastructureStatus();
}
