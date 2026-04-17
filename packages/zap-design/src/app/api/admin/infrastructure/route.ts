import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const report = {
        servers: [
            { id: 'postgresql', name: 'postgresql', sector: 'ZAP-CORE', status: 'online', version: '16.13 (Mock)', host: 'Mock', details: 'Database Connection OK (Mock)', latency: '0ms' },
            { id: 'mongodb', name: 'mongodb', sector: 'ZAP-CORE', status: 'online', version: '8.0.19 (Mock)', host: 'Mock', details: 'Mock', latency: '0ms' },
            { id: 'redis', name: 'redis', sector: 'ZAP-AI', status: 'online', version: '7.4.8 (Mock)', host: 'Mock', details: 'Cache Layer Active (Mock)', latency: '0ms' },
            { id: 'chromadb', name: 'chromadb', sector: 'ZAP-AI', status: 'online', version: '1.5.5 (Mock)', host: 'Mock', details: 'Vector DB Pulse OK (Mock)', latency: '0ms' },
            { id: 'langchain', name: 'langchain', sector: 'ZAP-AI', status: 'online', version: 'Orchestrator', host: 'Mock', details: 'Logical Layer Active', latency: '0ms' },
            { id: 'memory-v2', name: 'memory v2.1', sector: 'ZAP-AI', status: 'online', version: 'v2.1 · SOP-035', host: 'Mock', details: 'Mock', latency: '0ms' }
        ],
        agents: [
            { id: 'antigravity', name: 'Antigravity', role: 'CSO / Primary AI', port: 3002, status: 'online' },
            { id: 'gateway', name: 'Gateway', role: 'API Gateway', port: 3001, status: 'online' },
            { id: 'daemon', name: 'Tommy', role: 'Core Engine / Daemon', port: 8000, status: 'online' }
        ],
        tasks: [],
        activeSplit: 'MOCK_SPLIT'
    };

    return NextResponse.json(report, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
    });
}
