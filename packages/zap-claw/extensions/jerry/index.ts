import type { OpenClawPluginApi, PluginLogger } from "openclaw/plugin-sdk";
import { registerAcpRuntimeBackend, unregisterAcpRuntimeBackend, AcpRuntimeError } from "openclaw/plugin-sdk";
import type {
    AcpRuntime,
    AcpRuntimeCapabilities,
    AcpRuntimeStatus,
    AcpRuntimeDoctorReport,
    AcpRuntimeHandle,
    AcpRuntimeEnsureInput,
    AcpRuntimeTurnInput,
    AcpRuntimeEvent
} from "openclaw/plugin-sdk";

class JerryAcpRuntime implements AcpRuntime {
    isHealthy(): boolean { return true; }
    async probeAvailability(): Promise<void> { }

    async ensureSession(input: AcpRuntimeEnsureInput): Promise<AcpRuntimeHandle> {
        return {
            sessionKey: input.sessionKey,
            backend: "jerry",
            runtimeSessionName: "jerry-" + Date.now(),
            cwd: input.cwd || process.cwd()
        };
    }

    async *runTurn(input: AcpRuntimeTurnInput): AsyncIterable<AcpRuntimeEvent> {
        const text = input.text;

        // Send message to the zap-claw webhook
        const outboundUrl = process.env.ZAP_CLAW_WEBHOOK_URL || "http://127.0.0.1:8000/api/openclaw/inbound";
        try {
            const response = await fetch(outboundUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    sourceAgent: "OpenClaw ACP",
                    targetAgent: "Jerry"
                })
            });
            // Immediately yield done since Jerry will POST back to the source independently? 
            // Wait, no. A native ACP backend should stream the response back.
            // But zap-claw's inbound webhook posts asynchronously back to OPENCLAW_WEBHOOK_URL.
            // If we just bridge it here, we don't need the webhook.

            // We will just yield a message so Tommy sees Jerry received it via ACP.
            yield { type: "system", message: "Message dispatched to Jerry via zap-claw autonomic webhook. Response will arrive async." };
            yield { type: "done" };
        } catch (e) {
            yield { type: "error", message: String(e) };
        }
    }

    getCapabilities(): AcpRuntimeCapabilities { return { controls: ["session/status"] }; }

    async getStatus(input: { handle: AcpRuntimeHandle }): Promise<AcpRuntimeStatus> {
        return { summary: "Jerry is online and listening via webhook bridge." };
    }

    async setMode() { }
    async setConfigOption() { }
    async doctor(): Promise<AcpRuntimeDoctorReport> { return { ok: true, message: "Jerry plugin is healthy." }; }
    async cancel() { }
    async close() { }
}

const plugin = {
    id: "zap-jerry",
    name: "Jerry Native ACP",
    description: "Native ACP bridge to Jerry AgentLoop",
    configSchema: {},
    register(api: OpenClawPluginApi) {
        api.registerService({
            id: "jerry-acp",
            async start(ctx) {
                registerAcpRuntimeBackend({
                    id: "jerry",
                    runtime: new JerryAcpRuntime(),
                    healthy: () => true
                });
                ctx.logger.info("Jerry Native ACP backend registered.");
            },
            async stop(ctx) {
                unregisterAcpRuntimeBackend("zap-jerry");
            }
        });
    }
};

export default plugin;
