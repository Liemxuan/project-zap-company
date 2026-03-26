import { NextResponse } from 'next/server';
import net from 'net';
import dns from 'dns/promises';

/**
 * GET /api/tcp-ping
 * 
 * Server-side raw TCP port ping to verify if a local or remote network service
 * is listening on a specific port. Used by Mission Control to bypass browser 
 * CORS and HTTP-only protocol limitations when checking database health.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const portString = searchParams.get('port');
    const serviceName = searchParams.get('service');
    
    let finalPort = parseInt(portString || '', 10);
    let finalHost = searchParams.get('host') || '127.0.0.1';

    // Intercept targeted core services and map to actual remote hosts if defined
    try {
        if (serviceName === 'Postgres' && process.env.DATABASE_URL) {
            const url = new URL(process.env.DATABASE_URL);
            finalHost = url.hostname;
            finalPort = parseInt(url.port, 10) || 5432;
        } else if (serviceName === 'MongoDB' && process.env.MONGODB_URI) {
            const url = new URL(process.env.MONGODB_URI);
            if (process.env.MONGODB_URI.startsWith('mongodb+srv:')) {
                const srvUrl = `_mongodb._tcp.${url.hostname}`;
                const records = await dns.resolveSrv(srvUrl);
                if (records && records.length > 0) {
                    finalHost = records[0].name;
                    finalPort = records[0].port;
                }
            } else {
                finalHost = url.hostname;
                finalPort = parseInt(url.port, 10) || 27017;
            }
        }
    } catch (e) {
        // Fallback to localhost if URL parsing or DNS resolution fails
        console.warn(`[TCP-Ping] Failed to resolve remote host for ${serviceName}`, e);
    }

    if (!finalPort || isNaN(finalPort)) {
        return NextResponse.json({ status: 'error', message: 'Invalid port' }, { status: 400 });
    }

    const isOnline = await new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(2500);
        
        socket.once('connect', () => {
            socket.destroy();
            resolve(true);
        });
        
        socket.once('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.once('error', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.connect(finalPort, finalHost);
    });

    return NextResponse.json({ status: isOnline ? 'online' : 'offline', parsedHost: finalHost });
}
