/**
 * ZAP-OS Safe Executor
 *
 * Adapted from Ruflo v3 Security Architecture to prevent Command Injection.
 * Replaces unsafe `exec()` and `spawn({shell: true})` calls with validated `execFile()`.
 *
 * Security Properties:
 * - Shell interpretation disabled
 * - Blocked char patterns (;, &&, ||)
 * - Dangerous commands blacklisted (rm, chmod, etc.)
 */

import { execFile, spawn, ChildProcess } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';

const execFileAsync = promisify(execFile);

export interface ExecutorConfig {
  allowedCommands: string[];
  blockedPatterns?: string[];
  timeout?: number;
  maxBuffer?: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  allowSudo?: boolean;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  command: string;
  args: string[];
  duration: number;
}

export class SafeExecutorError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly command?: string,
    public readonly args?: string[],
  ) {
    super(message);
    this.name = 'SafeExecutorError';
  }
}

const DEFAULT_BLOCKED_PATTERNS = [
  ';', '&&', '||', '|', '`', '$(', '${', '>', '<', '>>', '&', '\n', '\r', '\0', '$()',
];

const DANGEROUS_COMMANDS = [
  'rm', 'rmdir', 'del', 'format', 'mkfs', 'dd', 'chmod', 'chown', 'kill', 'killall', 'pkill', 'reboot', 'shutdown', 'init', 'poweroff', 'halt',
];

export class SafeExecutor {
  private readonly config: Required<ExecutorConfig>;
  private readonly blockedPatterns: RegExp[];

  constructor(config: ExecutorConfig) {
    this.config = {
      allowedCommands: config.allowedCommands,
      blockedPatterns: config.blockedPatterns ?? DEFAULT_BLOCKED_PATTERNS,
      timeout: config.timeout ?? 30000,
      maxBuffer: config.maxBuffer ?? 10 * 1024 * 1024,
      cwd: config.cwd ?? process.cwd(),
      env: config.env ?? process.env,
      allowSudo: config.allowSudo ?? false,
    };

    this.blockedPatterns = this.config.blockedPatterns.map(
      pattern => new RegExp(this.escapeRegExp(pattern), 'i')
    );

    this.validateConfig();
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private validateConfig(): void {
    if (this.config.allowedCommands.length === 0) {
      throw new SafeExecutorError('At least one allowed command must be specified', 'EMPTY_ALLOWLIST');
    }

    const dangerousAllowed = this.config.allowedCommands.filter(
      cmd => DANGEROUS_COMMANDS.includes(path.basename(cmd))
    );

    if (dangerousAllowed.length > 0) {
      throw new SafeExecutorError(`Dangerous commands cannot be allowed: ${dangerousAllowed.join(', ')}`, 'DANGEROUS_COMMAND_ALLOWED');
    }
  }

  private validateCommand(command: string): void {
    const basename = path.basename(command);

    const isAllowed = this.config.allowedCommands.some(allowed => {
      const allowedBasename = path.basename(allowed);
      return command === allowed || basename === allowedBasename;
    });

    if (!isAllowed) {
      throw new SafeExecutorError(`Command not in allowlist: ${command}`, 'COMMAND_NOT_ALLOWED', command);
    }

    if (!this.config.allowSudo && (command === 'sudo' || basename === 'sudo')) {
      throw new SafeExecutorError('Sudo commands are not allowed', 'SUDO_NOT_ALLOWED', command);
    }
  }

  private validateArguments(args: string[]): void {
    for (const arg of args) {
      if (arg.includes('\0')) {
        throw new SafeExecutorError('Null byte detected in argument', 'NULL_BYTE_INJECTION', undefined, args);
      }

      for (const pattern of this.blockedPatterns) {
        if (pattern.test(arg)) {
          throw new SafeExecutorError(`Dangerous pattern detected in argument: ${arg}`, 'DANGEROUS_PATTERN', undefined, args);
        }
      }

      if (/^-.*[;&|]/.test(arg)) {
        throw new SafeExecutorError(`Potential command chaining in argument: ${arg}`, 'COMMAND_CHAINING', undefined, args);
      }
    }
  }

  public sanitizeArgument(arg: string): string {
    let sanitized = arg.replace(/\0/g, '');
    sanitized = sanitized.replace(/[;&|`$(){}><\n\r]/g, '');
    return sanitized;
  }

  async execute(command: string, args: string[] = []): Promise<ExecutionResult> {
    const startTime = Date.now();
    this.validateCommand(command);
    this.validateArguments(args);

    try {
      // Excecute strictly without shell interpretation
      const { stdout, stderr } = await execFileAsync(command, args, {
        cwd: this.config.cwd,
        env: this.config.env,
        timeout: this.config.timeout,
        maxBuffer: this.config.maxBuffer,
        shell: false, // Core security constraint
        windowsHide: true,
      });

      return { stdout: stdout.toString(), stderr: stderr.toString(), exitCode: 0, command, args, duration: Date.now() - startTime };
    } catch (error: any) {
      if (error.killed) {
        throw new SafeExecutorError('Command execution timed out', 'TIMEOUT', command, args);
      }
      if (error.code === 'ENOENT') {
        throw new SafeExecutorError(`Command not found: ${command}`, 'COMMAND_NOT_FOUND', command, args);
      }
      return {
        stdout: error.stdout?.toString() ?? '',
        stderr: error.stderr?.toString() ?? error.message,
        exitCode: error.code ?? 1,
        command,
        args,
        duration: Date.now() - startTime,
      };
    }
  }
}
