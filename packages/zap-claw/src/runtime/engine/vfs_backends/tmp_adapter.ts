import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { VFSBackend } from '../vfs_router.js';

export class TmpAdapter implements VFSBackend {
    private basePath: string;

    constructor(namespace: string = 'zap-vfs') {
        this.basePath = path.join(os.tmpdir(), namespace);
    }

    private resolvePath(uriPath: string): string {
        // Prevent directory traversal
        const safePath = path.normalize(uriPath).replace(/^(\.\.[\/\\])+/, '');
        return path.join(this.basePath, safePath);
    }

    async read(uriPath: string): Promise<string> {
        const fullPath = this.resolvePath(uriPath);
        try {
            return await fs.readFile(fullPath, 'utf-8');
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new Error(`[VFS tmp://] File not found: ${uriPath}`);
            }
            throw error;
        }
    }

    async write(uriPath: string, content: string): Promise<void> {
        const fullPath = this.resolvePath(uriPath);
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf-8');
    }

    async list(prefix: string): Promise<string[]> {
        const fullPath = this.resolvePath(prefix);
        try {
            const entries = await fs.readdir(fullPath, { withFileTypes: true });
            return entries.map(entry => {
                const relative = path.posix.join(prefix, entry.name);
                return entry.isDirectory() ? `${relative}/` : relative;
            });
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return []; // Directory doesn't exist yet, return empty list
            }
            throw error;
        }
    }
}
