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

class SpikeAcpRuntime implements AcpRuntime {
    isHealthy(): boolean { return true; }
    async probeAvailability(): Promise<void> { }

    async ensureSession(input: AcpRuntimeEnsureInput): Promise<AcpRuntimeHandle> {
        return {
            sessionKey: input.sessionKey,
            backend: "spike",
            runtimeSessionName: "spike-" + Date.now(),
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
                    targetAgent: "Spike"
                })
            });
            // Immediately yield done since Spike will POST back to the source independently? 
            // Wait, no. A native ACP backend should stream the response back.
            // But zap-claw's inbound webhook posts asynchronously back to OPENCLAW_WEBHOOK_URL.
            // If we just bridge it here, we don't need the webhook.

            // We will just yield a message so Tommy sees Spike received it via ACP.
            yield { type: "system", message: "Message dispatched to Spike via zap-claw autonomic webhook. Response will arrive async." };
            yield { type: "done" };
        } catch (e) {
            yield { type: "error", message: String(e) };
        }
    }

    getCapabilities(): AcpRuntimeCapabilities { return { controls: ["session/status"] }; }

    async getStatus(input: { handle: AcpRuntimeHandle }): Promise<AcpRuntimeStatus> {
        return { summary: "Spike is online and listening via webhook bridge." };
    }

    async setMode() { }
    async setConfigOption() { }
    async doctor(): Promise<AcpRuntimeDoctorReport> { return { ok: true, message: "Spike plugin is healthy." }; }
    async cancel() { }
    async close() { }
}

const plugin = {
    id: "zap-spike",
    name: "Spike Native ACP",
    description: "Native ACP bridge to Spike AgentLoop",
    configSchema: {},
    register(api: OpenClawPluginApi) {
        api.registerService({
            id: "spike-acp",
            async start(ctx) {
                registerAcpRuntimeBackend({
                    id: "spike",
                    runtime: new SpikeAcpRuntime(),
                    healthy: () => true
                });
                ctx.logger.info("Spike Native ACP backend registered.");
            },
            async stop(ctx) {
                unregisterAcpRuntimeBackend("spike");
            }
        });
    }
};

export default plugin;
