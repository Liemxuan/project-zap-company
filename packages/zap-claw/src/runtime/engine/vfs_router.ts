import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface VFSBackend {
    read(uriPath: string): Promise<string>;
    write(uriPath: string, content: string): Promise<void>;
    list(prefix: string): Promise<string[]>;
}

export class VFSRouter {
    private backends: Map<string, VFSBackend> = new Map();

    registerBackend(protocol: string, backend: VFSBackend) {
        this.backends.set(protocol.toLowerCase(), backend);
    }

    private resolveBackend(uri: string): { protocol: string; backend: VFSBackend; resourcePath: string } {
        const match = uri.match(/^([a-z0-9]+):\/\/(.*)$/i);
        if (!match) {
            throw new Error(`Invalid VFS URI format. Must be protocol://path (e.g., tmp://draft.md). Got: ${uri}`);
        }
        const protocol = (match[1] as string).toLowerCase();
        const resourcePath = match[2] as string;

        const backend = this.backends.get(protocol);
        if (!backend) {
            throw new Error(`No VFS Backend registered for protocol: ${protocol}://`);
        }

        return { protocol, backend, resourcePath };
    }

    async read(uri: string): Promise<string> {
        const { backend, resourcePath } = this.resolveBackend(uri);
        return await backend.read(resourcePath);
    }

    async write(uri: string, content: string): Promise<void> {
        const { backend, resourcePath } = this.resolveBackend(uri);
        return await backend.write(resourcePath, content);
    }

    async list(uriPrefix: string): Promise<string[]> {
        const { backend, resourcePath } = this.resolveBackend(uriPrefix);
        return await backend.list(resourcePath);
    }
}

// Global VFS instance
export const vfsRouter = new VFSRouter();
