export type SwarmTopology = 'hierarchical' | 'mesh' | 'flat';

export interface SwarmConfig {
  id?: string;
  name?: string;
}

export interface AgentConfig {
  id: string;
  type: string;
  capabilities?: string[];
  role?: string;
  parent?: string;
  metadata?: Record<string, unknown>;
}

export interface Task {
  id: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  executable?: string;
  args?: string[];
  payload?: any;
  status?: string;
}

export interface TaskResult {
  taskId: string;
  status: 'completed' | 'failed' | 'timeout';
  result?: string;
  error?: string;
  agentId?: string;
  duration?: number;
}

export interface AgentMetrics {
  agentId: string;
  tasksCompleted: number;
  tasksFailed: number;
  averageExecutionTime: number;
  successRate: number;
  health: 'healthy' | 'unhealthy';
}

export interface TaskAssignment {
  taskId: string;
  agentId: string;
  assignedAt: number;
  priority: string;
}

export interface AgentMessage {
  from: string;
  to?: string;
  type: string;
  payload: any;
  timestamp?: number;
}

export interface MeshConnection {
  from: string;
  to: string;
  type: 'peer' | 'leader';
}

export interface SwarmState {
  agents: any[];
  topology: SwarmTopology;
  leader?: string;
  activeConnections: number;
}

export interface SwarmHierarchy {
  leader: string;
  workers: Array<{ id: string; parent: string }>;
}

export interface ConsensusDecision {
  topic: string;
  payload: any;
}

export interface ConsensusResult {
  decision: any;
  votes: Array<{ agentId: string; vote: unknown }>;
  consensusReached: boolean;
}

export interface MemoryBackend {
  store(data: any): Promise<void>;
}

export interface PluginManagerInterface {
  register(plugin: any): void;
}
