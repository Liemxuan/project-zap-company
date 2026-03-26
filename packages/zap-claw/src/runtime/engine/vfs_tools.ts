import { vfsRouter } from './vfs_router.js';
import { TmpAdapter } from './vfs_backends/tmp_adapter.js';
import { MongoAdapter } from './vfs_backends/mongo_adapter.js';

// Initialize and register the baseline VFS backends
vfsRouter.registerBackend('tmp', new TmpAdapter());
vfsRouter.registerBackend('shared', new MongoAdapter());

export const VFS_TOOL_SCHEMAS = [
    {
        type: "function",
        function: {
            name: "vfs_read",
            description: "Read from the Virtual File System. Use 'tmp://' for temporary storage and 'shared://{collection}/' for persistent MongoDB storage.",
            parameters: {
                type: "object",
                properties: {
                    path: { type: "string", description: "The VFS URI path to read (e.g. tmp://task/file.md or shared://users/123)" }
                },
                required: ["path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "vfs_write",
            description: "Write to the Virtual File System. Supports tmp:// and shared:// protocols.",
            parameters: {
                type: "object",
                properties: {
                    path: { type: "string", description: "The VFS URI path to write to." },
                    content: { type: "string", description: "The content payload to write." }
                },
                required: ["path", "content"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "vfs_list",
            description: "List files or keys in a given VFS prefix.",
            parameters: {
                type: "object",
                properties: {
                    prefix: { type: "string", description: "The VFS URI prefix to list (e.g. shared://users/)" }
                },
                required: ["prefix"]
            }
        }
    }
];

export async function executeVfsTool(toolName: string, args: Record<string, any>): Promise<any> {
    try {
        switch (toolName) {
            case "vfs_read":
                return await vfsRouter.read(args.path);
            case "vfs_write":
                await vfsRouter.write(args.path, args.content);
                return "Successfully written to " + args.path;
            case "vfs_list":
                const list = await vfsRouter.list(args.prefix);
                return JSON.stringify(list);
            default:
                throw new Error(`Unknown VFS Tool: ${toolName}`);
        }
    } catch (e: any) {
        return `[VFS Error] ${e.message}`;
    }
}
