import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { EventEmitter } from 'events';

// Global Event Emitter for bridging OmniQueue completions instantly to active WebSocket clients
export const websocketNotifier = new EventEmitter();

interface ClientContext {
    id: string;
    role: "client" | "node";
    tenantId: string;
    subscribedEvents: Set<string>;
}

export class GatewayWebSocketServer {
    private wss: WebSocketServer;
    private clients: Map<WebSocket, ClientContext> = new Map();

    constructor(server: any) {
        this.wss = new WebSocketServer({ server });
        this.initialize();
    }

    private initialize() {
        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            console.log(`[WSS Gateway] 🔌 New connection from ${req.socket.remoteAddress}`);

            const ctx: ClientContext = {
                id: `ws-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                role: "client",
                tenantId: "ZVN", // Defaulting, should extract from headers
                subscribedEvents: new Set(['tick', 'status'])
            };

            this.clients.set(ws, ctx);

            // Send initial connection ACK
            ws.send(JSON.stringify({ type: 'connected', id: ctx.id, status: 'authenticated' }));

            ws.on('message', (message: string) => {
                try {
                    const parsed = JSON.parse(message);
                    this.handleMessage(ws, ctx, parsed);
                } catch (e) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON payload' }));
                }
            });

            ws.on('close', () => {
                console.log(`[WSS Gateway] ❌ Connection closed for ${ctx.id}`);
                this.clients.delete(ws);
            });
        });

        // Bridge OmniQueue completions to WebSocket push events
        websocketNotifier.on('job_completed', (data: any) => {
            this.broadcast('chat', data);
        });

        // Sub-Phase 2A: M3 Artifact Creation Emitter bridging
        websocketNotifier.on('artifact_created', (data: any) => {
            this.broadcast('artifact', data);
        });

        // Sub-Phase 2B: HITL Challenge Emitter bridging
        websocketNotifier.on('hitl_challenge', (data: any) => {
            this.broadcast('hitl', data);
        });
    }

    private handleMessage(ws: WebSocket, ctx: ClientContext, payload: any) {
        switch (payload.type) {
            case 'subscribe':
                if (payload.event) {
                    ctx.subscribedEvents.add(payload.event);
                    ws.send(JSON.stringify({ type: 'subscribed', event: payload.event }));
                }
                break;
            case 'send':
                // A client is attempting to send a raw payload via WS instead of webhook
                console.log(`[WSS Gateway] Received inline send command from ${ctx.id}`, payload);
                // In full implementation, this routes into inbound.ts -> getOrCreateSession -> OmniQueue
                ws.send(JSON.stringify({ type: 'ack', messageId: payload.messageId || 'unknown' }));
                break;
            default:
                ws.send(JSON.stringify({ type: 'error', message: `Unknown command type: ${payload.type}` }));
        }
    }

    public broadcast(eventType: string, payload: any) {
        const message = JSON.stringify({ type: eventType, data: payload });
        for (const [ws, ctx] of this.clients.entries()) {
            if (ctx.subscribedEvents.has(eventType)) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(message);
                }
            }
        }
    }
}
