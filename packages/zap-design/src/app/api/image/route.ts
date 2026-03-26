import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // "original" or "generated"
    let filePath = searchParams.get('path'); // e.g. "/media/avatars/300-1.jpg"

    if (!filePath) {
        return new NextResponse("Missing path parameter", { status: 400 });
    }

    // Ensure the path starts with /media
    if (!filePath.startsWith('/media')) {
        filePath = '/media' + (filePath.startsWith('/') ? filePath.substring(1) : filePath);
    }

    let fullPath = "";
    if (type === "original") {
        fullPath = path.join("/Users/zap/Workspace/metronic-v9.4.5/metronic-tailwind-react-demos/typescript/nextjs/public", filePath);
    } else {
        // Look in the actual ZAP Design public folder
        fullPath = path.join(process.cwd(), "public", filePath);
    }

    if (!fs.existsSync(fullPath)) {
        // Return a transparent 1x1 pixel instead of 404 to avoid broken image icons ruining the UI
        const transparentPixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
        return new NextResponse(transparentPixel, {
            headers: { 'Content-Type': 'image/png' }
        });
    }

    try {
        const fileBuffer = fs.readFileSync(fullPath);

        let mime = 'image/jpeg'; // Default fallback
        if (fileBuffer.length > 4) {
            const header = fileBuffer.toString('hex', 0, 4).toUpperCase();
            if (header === '89504E47') {
                mime = 'image/png';
            } else if (header.startsWith('FFD8FF')) {
                mime = 'image/jpeg';
            } else if (header === '47494638') {
                mime = 'image/gif';
            } else if (fileBuffer.toString('utf8', 0, 100).includes('<svg') || fileBuffer.toString('utf8', 0, 100).includes('<?xml')) {
                mime = 'image/svg+xml';
            } else {
                // Fallback to extension if magic bytes fail
                const ext = path.extname(fullPath).toLowerCase();
                if (ext === '.svg') mime = 'image/svg+xml';
                if (ext === '.png') mime = 'image/png';
                if (ext === '.webp') mime = 'image/webp';
                if (ext === '.gif') mime = 'image/gif';
            }
        }

        return new NextResponse(fileBuffer, { headers: { 'Content-Type': mime } });
    {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    } catch (e) {
        return new NextResponse("Error reading file", { status: 500 });
    }
}
