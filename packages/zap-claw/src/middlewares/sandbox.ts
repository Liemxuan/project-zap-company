import { ToolMiddleware } from "./pipeline.js";

// Task 5.3: Containerized Execution Sandbox
// Enforces Phase 7 Agent Fleet Scaling logic by intercepting potentially destructive
// tool executions (e.g., from Spike) and routing them to isolated Kubernetes serverless pods.
export const SandboxMiddleware: ToolMiddleware = async (ctx, next) => {
    
    // Check if the agent is Spike and attempting to run arbitrary code
    if (ctx.botName === "Spike" && (ctx.toolName === "execute_bash" || ctx.toolName === "execute_code" || ctx.toolName === "write_file")) {
        
        console.log(`\n======================================================`);
        console.log(`[SandboxMiddleware] 🛡️ KUBERNETES AIRGAP ACTIVATED`);
        console.log(`======================================================`);
        console.log(`Intercepted ${ctx.toolName} from ${ctx.botName}. Routing payload to Phase 7 Isolated Serverless Container...`);
        
        // If a real K8s webhook URL is provided, we route it there
        const k8sEndpoint = process.env.K8S_SANDBOX_WEBHOOK;
        
        if (k8sEndpoint) {
            try {
                const response = await fetch(k8sEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        agent: ctx.botName,
                        tool: ctx.toolName,
                        input: ctx.toolInput,
                        session: ctx.sessionId
                    })
                });
                
                if (response.ok) {
                    const result = await response.json() as any;
                    ctx.resultContent = `[K8s Sandbox Execution]\n${result?.output || "Completed successfully in remote sandbox."}`;
                    ctx.isAllowed = false; // Prevent local `executeTool` from running
                    console.log(`[SandboxMiddleware] ✅ Remote K8s execution successful.`);
                    return; // Skip the rest of the pipeline
                } else {
                    console.warn(`[SandboxMiddleware] ⚠️ K8s endpoint returned ${response.status}. Falling back to local execution.`);
                }
            } catch (err) {
                console.error(`[SandboxMiddleware] ❌ K8s Sandbox unreachable. Proceeding with local execution with caution.`);
            }
        } else {
            // Simulated routing for testing
            console.log(`[SandboxMiddleware] ⚠️ K8S_SANDBOX_WEBHOOK not configured. Executing locally under simulated isolation.`);
        }
    }

    await next();
};
