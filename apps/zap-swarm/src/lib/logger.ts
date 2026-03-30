/**
 * ZAP Swarm Structured Logger — Phase 9 (Production Hardening)
 * 
 * Replaces raw console.log/error with structured JSON output
 * that can be ingested by any log aggregator (Loki, Datadog, CloudWatch).
 * 
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Job completed', { jobId, agent: 'spike', duration: 1200 });
 *   logger.error('MongoDB timeout', { collection, timeoutMs: 2000 });
 *   logger.warn('Rate limit approaching', { ip, remaining: 5 });
 *   logger.security('ZSS intercept', { type: 'PAYLOAD_TOO_LARGE', ip });
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';

interface LogEntry {
    level: LogLevel;
    service: string;
    message: string;
    timestamp: string;
    data?: Record<string, any>;
}

const SERVICE_NAME = 'zap-swarm';

function emit(level: LogLevel, message: string, data?: Record<string, any>) {
    const entry: LogEntry = {
        level,
        service: SERVICE_NAME,
        message,
        timestamp: new Date().toISOString(),
    };

    if (data && Object.keys(data).length > 0) {
        entry.data = data;
    }

    const jsonLine = JSON.stringify(entry);

    switch (level) {
        case 'ERROR':
        case 'SECURITY':
            console.error(jsonLine);
            break;
        case 'WARN':
            console.warn(jsonLine);
            break;
        case 'DEBUG':
            if (process.env.NODE_ENV === 'development') {
                console.debug(jsonLine);
            }
            break;
        default:
            console.log(jsonLine);
    }
}

export const logger = {
    debug: (msg: string, data?: Record<string, any>) => emit('DEBUG', msg, data),
    info: (msg: string, data?: Record<string, any>) => emit('INFO', msg, data),
    warn: (msg: string, data?: Record<string, any>) => emit('WARN', msg, data),
    error: (msg: string, data?: Record<string, any>) => emit('ERROR', msg, data),
    security: (msg: string, data?: Record<string, any>) => emit('SECURITY', msg, data),
};
