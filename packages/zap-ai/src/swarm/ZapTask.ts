import { Task as ITask } from './types.js';

export class Task implements ITask {
  public id: string;
  public type: string;
  public priority: 'high' | 'medium' | 'low';
  public executable?: string;
  public args?: string[];
  public payload?: any;
  public status?: string;

  constructor(task: ITask) {
    this.id = task.id;
    this.type = task.type;
    this.priority = task.priority;
    this.executable = task.executable;
    this.args = task.args;
    this.payload = task.payload;
    this.status = task.status || 'pending';
  }

  static sortByPriority(tasks: Task[]): Task[] {
    const weights = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => weights[b.priority] - weights[a.priority]);
  }

  static resolveExecutionOrder(tasks: Task[]): Task[] {
    // Basic resolution: just sort by priority for now
    return Task.sortByPriority(tasks);
  }
}
