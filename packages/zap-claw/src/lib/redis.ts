import { Redis } from 'ioredis';
import 'dotenv/config';

// Initialize the ioredis client with a retry strategy to prevent startup crashes.
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('error', (err: any) => {
    // Only log once every 30 seconds to prevent log bloating in dev
    if (!global.lastRedisError || Date.now() - global.lastRedisError > 30000) {
        console.warn('[Redis Connection Warning] Offline. Features like Swarm Status will be disabled.');
        global.lastRedisError = Date.now();
    }
});

redis.on('connect', () => {
    console.log('[Redis] Connected successfully.');
});

declare global {
    var lastRedisError: number;
}

// Type definition for the Sync payloads that will be queued
export interface SyncQueuePayload {
    clientId: string;
    timestamp: string;
    data: any;
    channel: 'mobile' | 'web' | 'kiosk' | 'pos' | 'admin';
}
