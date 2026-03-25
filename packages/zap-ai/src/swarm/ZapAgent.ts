import { AgentConfig, Task, TaskResult } from './types.js';
import { SafeExecutor } from '../../../zap-claw/src/security/safe-executor.js';

export class Agent {
  public readonly id: string;
  public readonly type: string;
  public status: 'active' | 'busy' | 'idle' | 'terminated';
  public capabilities: string[];
  public role?: string;
  public parent?: string;
  public logger: any;

  constructor(config: AgentConfig) {
    this.id = config.id;
    this.type = config.type;
    this.status = 'active';
    this.capabilities = config.capabilities || [];
    this.role = config.role;
    this.parent = config.parent;
  }

  async executeTask(task: Task): Promise<TaskResult> {
    if (this.status !== 'active' && this.status !== 'idle') {
      return { taskId: task.id, status: 'failed', error: 'Agent unavailable' };
    }
    
    this.status = 'busy';
    const startTime = Date.now();
    
    try {
      if (task.type === 'cli' && task.executable && task.args) {
          // Strictly force SafeExecutor for ANY shell tasks requested by Swarm
          const executor = new SafeExecutor({
              allowedCommands: ['echo', 'ls', 'node', 'npx', 'npm', 'tsc', 'find', 'grep', 'git'],
              cwd: process.cwd()
          });
          const { stdout, stderr } = await executor.execute(task.executable, task.args);
          this.status = 'active';
          return {
              taskId: task.id,
              status: 'completed',
              result: stdout,
              duration: Date.now() - startTime
          };
      }
      
      // Basic AI or non-cli processing simulation
      await new Promise(r => setTimeout(r, 50));
      this.status = 'active';
      return {
          taskId: task.id,
          status: 'completed',
          result: `Non-CLI Task ${task.id} handled securely by ZAP.`,
          duration: Date.now() - startTime
      };
      
    } catch (err: any) {
      this.status = 'active';
      return {
          taskId: task.id,
          status: 'failed',
          error: `Execution block: ${err.message}`,
          duration: Date.now() - startTime
      };
    }
  }
  
  canExecute(taskType: string): boolean {
    return true; // Simplified gating
  }
  
  terminate(): void {
    this.status = 'terminated';
  }
}
