import { Redis } from 'ioredis';
import 'dotenv/config';

// Initialize the ioredis client using the provided RedisLabs connection string.
// This uses a persistent TCP connection.
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl);

redis.on('error', (err: any) => {
    console.error('[Redis Error]', err);
});

redis.on('connect', () => {
    console.log('[Redis] Connected successfully.');
});

// Type definition for the Sync payloads that will be queued
export interface SyncQueuePayload {
    clientId: string;
    timestamp: string;
    data: any;
    channel: 'mobile' | 'web' | 'kiosk' | 'pos' | 'admin';
}
