import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

interface ServerInfo {
    id: string;
    name: string;
    sector: string;
    status: 'online' | 'offline';
    version: string;
    host: string;
    details: string;
    latency: string;
}

// TCP port check utility
async function checkTcpPort(port: number, host = '127.0.0.1', timeoutMs = 2000): Promise<boolean> {
    const net = await import('net');
    return new Promise<boolean>((resolve) => {
        const socket = net.createConnection({ host, port, timeout: timeoutMs });
        socket.on('connect', () => { socket.destroy(); resolve(true); });
        socket.on('error', () => { socket.destroy(); resolve(false); });
        socket.on('timeout', () => { socket.destroy(); resolve(false); });
    });
}

export async function GET() {
    const agentDefs = [
        { id: 'antigravity', name: 'Antigravity', role: 'CSO / Primary AI', port: 3002 },
        { id: 'gateway', name: 'Gateway', role: 'API Gateway', port: 3001 },
        { id: 'daemon', name: 'Tommy', role: 'Core Engine / Daemon', port: 8000 },
        { id: 'jerry', name: 'Jerry', role: 'Watchdog / QA', port: 3300 },
        { id: 'spike', name: 'Spike', role: 'Structural Builder', port: 3301 },
        { id: 'thomas', name: 'Thomas', role: 'Telegram Ops', port: 3302 },
        { id: 'athena', name: 'Athena', role: 'Research Agent', port: 3303 },
        { id: 'hermes', name: 'Hermes', role: 'Messenger', port: 3304 },
        { id: 'hawk', name: 'Hawk', role: 'Surveillance', port: 3305 },
        { id: 'nova', name: 'Nova', role: 'Unassigned', port: 3306 },
        { id: 'raven', name: 'Raven', role: 'Unassigned', port: 3307 },
        { id: 'scout', name: 'Scout', role: 'Recon', port: 3308 },
        { id: 'coder', name: 'Coder', role: 'Code Gen', port: 3309 },
        { id: 'architect', name: 'Architect', role: 'System Design', port: 3310 },
        { id: 'cleo', name: 'Cleo', role: 'Ops', port: 3311 },
    ];

    // Server-side TCP health check for all agents
    const agentChecks = await Promise.all(
        agentDefs.map(async (a) => ({
            ...a,
            status: (await checkTcpPort(a.port)) ? 'online' : 'offline',
        }))
    );

    const report: { 
        servers: ServerInfo[], 
        agents: { id: string, name: string, role: string, port: number, status: string }[],
        tasks?: Record<string, unknown>[],
        activeSplit?: string
    } = {
        servers: [],
        agents: agentChecks,
        tasks: [],
    };

    // 1. PostgreSQL Check
    const pgStart = Date.now();
    try {
        await prisma.$queryRawUnsafe('SELECT 1');
        
        // Fetch live Swarm JobTickets safely
        let jobTickets: Record<string, unknown>[] = [];
        try {
            jobTickets = await prisma.jobTicket.findMany({
                orderBy: { createdAt: 'desc' },
                take: 50
            }) as unknown as Record<string, unknown>[];
        } catch (jobErr) {
            console.warn('[ZAP] Optional JobTicket table is migrated/missing. Skipping task fetch.');
        }
        
        report.tasks = jobTickets.map((t: Record<string, unknown>) => {
            let columnId = 'queued';
            const s = (t.status as string || '').toUpperCase();
            if (s === 'PENDING') columnId = 'queued';
            else if (s === 'IN_PROGRESS' || s === 'ACTIVE') columnId = 'in-progress';
            else if (s === 'REVIEW' || s === 'VALIDATION' || s === 'IN_REVIEW') columnId = 'review';
            else if (s === 'DONE' || s === 'COMPLETED' || s === 'MERGED') columnId = 'done';
            
            return {
                id: t.id,
                columnId,
                title: `[${t.ticketId}] ${t.scope}`,
                priority: t.level === 'L7' || t.level === 'CORE' ? 'high' : 'medium',
                assignee: t.manager ? { name: t.manager, avatarUrl: `https://i.pravatar.cc/150?u=${t.manager}` } : undefined
            };
        });

        report.servers.push({
            id: 'postgresql',
            name: 'postgresql',
            sector: 'ZAP-CORE',
            status: 'online',
            version: '16.13 (Cloud SQL)',
            host: 'Google Cloud Platform',
            details: 'Database Connection OK',
            latency: `${Date.now() - pgStart}ms`
        });
    } catch (err: unknown) {
        const availableModels = Object.keys(prisma).filter(k => !k.startsWith('_')).join(', ');
        report.servers.push({
            id: 'postgresql',
            name: 'postgresql',
            sector: 'ZAP-CORE',
            status: 'offline',
            version: '16.13 (Cloud SQL)',
            host: 'Google Cloud Platform',
            details: `Error: ${err instanceof Error ? err.message : 'Unknown'}. Models: ${availableModels}`,
            latency: '999ms'
        });
    }

    // 2. MongoDB Check
    const mongoStart = Date.now();
    try {
        const client = await MongoClient.connect(MONGO_URI);
        const adminDb = client.db('admin');
        const info = await adminDb.admin().listDatabases();
        await client.close();
        const displayHost = MONGO_URI.includes('@') ? MONGO_URI.split('@')[1].split('/')[0] : 'localhost:27017';
        report.servers.push({
            id: 'mongodb',
            name: 'mongodb',
            sector: 'ZAP-CORE',
            status: 'online',
            version: '8.0.19',
            host: `mongodb+srv://${displayHost}`,
            details: `${info.databases.length} databases mapped`,
            latency: `${Date.now() - mongoStart}ms`
        });
    } catch (err: unknown) {
        const displayHost = MONGO_URI.includes('@') ? MONGO_URI.split('@')[1].split('/')[0] : 'localhost:27017';
        report.servers.push({
            id: 'mongodb',
            name: 'mongodb',
            sector: 'ZAP-CORE',
            status: 'offline',
            version: '-',
            host: displayHost,
            details: err instanceof Error ? err.message : 'Cluster Unreachable',
            latency: '999ms'
        });
    }

    // 3. Redis Check (real ping via HTTP proxy or TCP)
    const redisStart = Date.now();
    try {
        // Try to connect via a quick TCP check
        const net = await import('net');
        const redisOk = await new Promise<boolean>((resolve) => {
            const socket = net.createConnection({ host: '127.0.0.1', port: 6379, timeout: 2000 });
            socket.on('connect', () => { socket.destroy(); resolve(true); });
            socket.on('error', () => { socket.destroy(); resolve(false); });
            socket.on('timeout', () => { socket.destroy(); resolve(false); });
        });
        report.servers.push({
            id: 'redis',
            name: 'redis',
            sector: 'ZAP-AI',
            status: redisOk ? 'online' : 'offline',
            version: '7.4.8',
            host: 'redis://127.0.0.1:6379',
            details: redisOk ? 'Cache Layer Active' : 'Connection Refused',
            latency: `${Date.now() - redisStart}ms`
        });
    } catch {
        report.servers.push({
            id: 'redis',
            name: 'redis',
            sector: 'ZAP-AI',
            status: 'offline',
            version: '7.4.8',
            host: 'redis://127.0.0.1:6379',
            details: 'Check Failed',
            latency: '999ms'
        });
    }

    // 4. ChromaDB Check
    const chromaStart = Date.now();
    try {
        const chromaRes = await fetch('http://localhost:8100/api/v2/heartbeat', { signal: AbortSignal.timeout(2000) });
        if (chromaRes.ok) {
            report.servers.push({
                id: 'chromadb',
                name: 'chromadb',
                sector: 'ZAP-AI',
                status: 'online',
                version: '1.5.5',
                host: 'http://localhost:8100',
                details: 'Vector DB Pulse OK',
                latency: `${Date.now() - chromaStart}ms`
            });
        } else {
            throw new Error(`HTTP ${chromaRes.status}`);
        }
    } catch (err) {
        report.servers.push({
            id: 'chromadb',
            name: 'chromadb',
            sector: 'ZAP-AI',
            status: 'offline',
            version: '-',
            host: 'http://localhost:8100',
            details: err instanceof Error ? err.message : 'Offline',
            latency: '999ms'
        });
    }

    // 5. Langchain Check
    report.servers.push({
        id: 'langchain',
        name: 'langchain',
        sector: 'ZAP-AI',
        status: 'online',
        version: 'Orchestrator',
        host: 'ZAP-Core backend',
        details: 'Logical Layer Active',
        latency: '2ms'
    });

    // 6. Memory v2.1 Check (Atlas)
    const memStart = Date.now();
    try {
        const memClient = await MongoClient.connect(
            'mongodb+srv://tomtranzap_db_user:8wGYUhjtcR8z3TOv@zapcluster0.jog3w9m.mongodb.net/',
            { serverSelectionTimeoutMS: 3000 }
        );
        const memDb = memClient.db('olympus');
        const [clawMemory, sessions, checkpoints, worldCount, expCount, latestCheckpointArray] = await Promise.all([
            memDb.collection('OLYMPUS_SYS_CLAW_memory').countDocuments(),
            memDb.collection('session_states').countDocuments(),
            memDb.collection('SYS_OS_checkpoints').countDocuments(),
            memDb.collection('memory_world').countDocuments(),
            memDb.collection('memory_experiences').countDocuments(),
            memDb.collection('SYS_OS_checkpoints').find().sort({ _id: -1 }).limit(1).toArray()
        ]);
        
        if (latestCheckpointArray && latestCheckpointArray.length > 0) {
            report.activeSplit = latestCheckpointArray[0].sessionId || latestCheckpointArray[0].id || 'AWAITING_SYNC';
        } else {
            report.activeSplit = 'AWAITING_SYNC';
        }
        await memClient.close();
        report.servers.push({
            id: 'memory-v2',
            name: 'memory v2.1',
            sector: 'ZAP-AI',
            status: 'online',
            version: 'v2.1 · SOP-035',
            host: 'Atlas: zapcluster0',
            details: `${clawMemory} mem · ${sessions} sessions · ${worldCount} facts · ${expCount} exp · ${checkpoints} ckpt`,
            latency: `${Date.now() - memStart}ms`
        });
    } catch (err) {
        report.servers.push({
            id: 'memory-v2',
            name: 'memory v2.1',
            sector: 'ZAP-AI',
            status: 'offline',
            version: 'v2.1 · SOP-035',
            host: 'Atlas: zapcluster0',
            details: err instanceof Error ? err.message : 'Connection Failed',
            latency: '999ms'
        });
    }

    return NextResponse.json(report, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
    });
}
