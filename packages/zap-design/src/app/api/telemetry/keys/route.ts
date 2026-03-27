import { NextResponse } from 'next/server';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/zap/Workspace/zap-core/.env', override: true });
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    connectTimeout: 1500,
});

export const dynamic = 'force-dynamic';

interface ProjectObj {
    project_id?: string;
    project?: string;
    keys?: string[];
}

interface MaskedKey {
    key: string;
    project: string;
    status: string;
    tier: string;
}

export async function GET() {
    try {
        const ultraPoolStr = process.env.GOOGLE_ULTRA_POOL || '[]';
        const proPoolStr = process.env.GOOGLE_PRO_POOL || '[]';

        let blockedProjects: string[] = [];
        let deadKeys: string[] = [];
        let redisStatus = 'online';

        try {
            // Query Redis for 429 rate limits and 403 dead keys
            const blockKeys = await redisClient.keys('block:project:*');
            blockedProjects = blockKeys.map(k => k.replace('block:project:', ''));
            deadKeys = await redisClient.smembers('dead_keys:google');
        } catch (e: unknown) {
            console.error("Redis Telemetry Error:", e instanceof Error ? e.message : String(e));
            redisStatus = 'offline';
        }

        let ultraCount = 0;
        let proCount = 0;

        const ultraMasked: MaskedKey[] = [];
        const proMasked: MaskedKey[] = [];

        try {
            const ultraArr: ProjectObj[] = JSON.parse(ultraPoolStr);
            ultraCount = ultraArr.reduce((acc: number, p: ProjectObj) => {
                const projName = p.project_id || p.project || 'Unknown';
                if (p.keys) {
                    p.keys.forEach((k: string) => {
                        let status = 'Active';
                        if (deadKeys.includes(k)) status = 'Dead';
                        else if (blockedProjects.includes(projName)) status = 'Rate Limited';
                        ultraMasked.push({
                            key: `••••••••••••${k.slice(-5)}`,
                            project: projName,
                            status,
                            tier: 'Ultra'
                        });
                    });
                }
                return acc + (p.keys?.length || 0);
            }, 0);
        } catch {
            // ignore JSON parse error
        }

        try {
            const proArr: ProjectObj[] = JSON.parse(proPoolStr);
            proCount = proArr.reduce((acc: number, p: ProjectObj) => {
                const projName = p.project_id || p.project || 'Unknown';
                if (p.keys) {
                    p.keys.forEach((k: string) => {
                        let status = 'Active';
                        if (deadKeys.includes(k)) status = 'Dead';
                        else if (blockedProjects.includes(projName)) status = 'Rate Limited';
                        proMasked.push({
                            key: `••••••••••••${k.slice(-5)}`,
                            project: projName,
                            status,
                            tier: 'Pro'
                        });
                    });
                }
                return acc + (p.keys?.length || 0);
            }, 0);
        } catch {
            // ignore JSON parse error
        }

        return NextResponse.json({
            status: redisStatus,
            ultraKeys: ultraCount,
            proKeys: proCount,
            ultraKeysList: ultraMasked,
            proKeysList: proMasked,
            blockedProjects,
            deadKeysCount: deadKeys.length,
            deadKeys: deadKeys.map(k => `${k.substring(0, 8)}...${k.slice(-4)}`) // Mask keys for safety
        });
    } catch (e: unknown) {
        return NextResponse.json({ status: 'offline', error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
