import type { ChatCompletionTool } from "openai/resources/chat/completions.js";
import { SafeExecutor, SafeExecutorError } from "../security/safe-executor.js";
import * as fs from "fs";
import * as path from "path";

const MAX_OUTPUT_SIZE = 50000; // 50KB

export const definition: ChatCompletionTool = {
    type: "function",
    function: {
        name: "run_command",
        description: "Execute a bash command or script and return its output. Large outputs are truncated for safety. Uses SafeExecutor to prevent shell injections.",
        parameters: {
            type: "object",
            properties: {
                command: {
                    type: "string",
                    description: "The bash command to run.",
                },
                cwd: {
                    type: "string",
                    description: "The current working directory (optional).",
                }
            },
            required: ["command"],
        },
    },
};

// Simple shell lexer to split command strings into executable + arguments
function parseCommand(cmd: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < cmd.length; i++) {
        const char = cmd[i];
        if (inQuotes) {
            if (char === quoteChar) {
                inQuotes = false; // Add quote content
            } else {
                current += char;
            }
        } else {
            if (char === '"' || char === "'") {
                inQuotes = true;
                quoteChar = char;
            } else if (char === ' ') {
                if (current.trim().length > 0) {
                    args.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
    }
    if (current.trim().length > 0) args.push(current);
    return args;
}

export async function handler(input: Record<string, unknown>): Promise<string> {
    const { command, cwd } = input as { command: string; cwd?: string };
    
    try {
        const parsedArgs = parseCommand(command);
        if (parsedArgs.length === 0) throw new Error("Empty command");
        
        const executable = parsedArgs[0] as string;
        const args = parsedArgs.slice(1);

        const executor = new SafeExecutor({
            allowedCommands: [
                'ls', 'cat', 'echo', 'git', 'npm', 'pnpm', 'node', 'npx', 'tsc', 
                'find', 'grep', 'mkdir', 'touch', 'cp', 'mv', 'python', 'python3', 'bash'
            ],
            cwd: cwd || process.cwd(),
            maxBuffer: 10 * 1024 * 1024
        });

        const { stdout, stderr } = await executor.execute(executable, args);

        const fullOutput = `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
        const outputSize = Buffer.byteLength(fullOutput);

        if (outputSize > MAX_OUTPUT_SIZE) {
            const tempFile = path.join("/tmp", `cmd_output_${Date.now()}.txt`);
            fs.writeFileSync(tempFile, fullOutput);

            const preview = fullOutput.substring(0, 1000);
            return `[TRUNCATED: Output too large (${outputSize} bytes). Full output saved to ${tempFile}]\n\nPREVIEW (first 1000 chars):\n${preview}...`;
        }

        return fullOutput;
    } catch (e: any) {
        let errOutput: string = "";
        if (e instanceof SafeExecutorError) {
             errOutput = `SafeExecutor Security Block [${e.code}]: ${e.message || "Unknown error"}`;
        } else {
             errOutput = `Command failed: ${e.message || "Unknown error"}\nSTDOUT: ${e.stdout ?? ""}\nSTDERR: ${e.stderr ?? ""}`;
        }
        
        const errSize = Buffer.byteLength(errOutput);

        if (errSize > MAX_OUTPUT_SIZE) {
            const tempFile = path.join("/tmp", `cmd_error_${Date.now()}.txt`);
            fs.writeFileSync(tempFile, errOutput || "");
            return `[TRUNCATED: Error output too large (${errSize} bytes). Full error saved to ${tempFile}]`;
        }

        throw new Error(errOutput || "");
    }
}
