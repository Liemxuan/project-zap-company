/**
 * V3 Agent Registry
 * Manages registration, lifecycle, and capabilities of all 15 agents
 *
 * Based on ADR-002 (DDD) and 15-Agent Swarm Architecture
 */

import { Agent } from './ZapAgent.js';
import type {
  Task as ITask,
  TaskResult,
  AgentConfig,
  AgentMetrics,
  SwarmTopology
} from './types.js';

type AgentId = string;
type AgentRole = string;
type AgentDomain = string;
type AgentStatus = 'idle' | 'active' | 'error' | 'terminated';
type TaskType = string;
type TaskId = string;
type SwarmEvent = any;
type EventHandler = any;

export interface AgentCapability {
  name: string;
  description: string;
  supportedTaskTypes: string[];
}
export interface AgentDefinition {
  id: string;
  role: string;
  domain: string;
  description: string;
  capabilities: AgentCapability[];
  dependencies: string[];
  priority: number;
}
export interface AgentState {
  id: string;
  role: string;
  status: AgentStatus;
  currentTask: string | null;
  completedTasks: string[];
  metrics: AgentMetrics;
  lastHeartbeat: number;
}

// Minimal mock event bus to decouple from Ruflo's raw event bus package
export interface IEventBus {
  emit(event: any): Promise<void>;
  emitSync(event: any): void;
  subscribe(event: string, handler: any): () => void;
}
export const agentSpawnedEvent = (id: string, role: string) => ({ type: 'agent:spawned', id, role });
export const agentStatusChangedEvent = (id: string, from: string, to: string) => ({ type: 'agent:status-changed', id, from, to });
export const agentErrorEvent = (id: string, err: Error) => ({ type: 'agent:error', id, err });

// =============================================================================
// Agent Registry Interface
// =============================================================================

export interface IAgentRegistry {
  // Registration
  register(definition: AgentDefinition): void;
  unregister(agentId: AgentId): boolean;
  isRegistered(agentId: AgentId): boolean;

  // Lifecycle
  spawn(agentId: AgentId): Promise<AgentState>;
  terminate(agentId: AgentId): Promise<boolean>;

  // State Management
  getState(agentId: AgentId): AgentState | undefined;
  updateStatus(agentId: AgentId, status: AgentStatus): void;
  assignTask(agentId: AgentId, taskId: TaskId): void;
  completeTask(agentId: AgentId, taskId: TaskId): void;

  // Queries
  getDefinition(agentId: AgentId): AgentDefinition | undefined;
  getAllAgents(): AgentDefinition[];
  getActiveAgents(): AgentState[];
  getAgentsByDomain(domain: AgentDomain): AgentDefinition[];
  getAgentsByCapability(taskType: TaskType): AgentDefinition[];

  // Health
  heartbeat(agentId: AgentId): void;
  getHealthStatus(): Map<AgentId, HealthStatus>;

  // Events
  onAgentEvent(handler: EventHandler): () => void;
}

export interface HealthStatus {
  agentId: AgentId;
  healthy: boolean;
  lastHeartbeat: number;
  consecutiveMisses: number;
  status: AgentStatus;
}

// =============================================================================
// Agent Registry Implementation
// =============================================================================

export class AgentRegistry implements IAgentRegistry {
  private definitions: Map<AgentId, AgentDefinition> = new Map();
  private states: Map<AgentId, AgentState> = new Map();
  private healthChecks: Map<AgentId, HealthStatus> = new Map();
  private eventBus: IEventBus;
  private healthCheckInterval: number = 5000;
  private healthCheckTimer: ReturnType<typeof setInterval> | null = null;
  private maxMissedHeartbeats: number = 3;

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
    this.registerDefaultAgents();
  }

  // ==========================================================================
  // Registration
  // ==========================================================================

  register(definition: AgentDefinition): void {
    if (this.definitions.has(definition.id)) {
      throw new Error(`Agent ${definition.id} is already registered`);
    }

    this.definitions.set(definition.id, definition);

    this.healthChecks.set(definition.id, {
      agentId: definition.id,
      healthy: false,
      lastHeartbeat: 0,
      consecutiveMisses: 0,
      status: 'idle'
    });
  }

  unregister(agentId: AgentId): boolean {
    if (this.states.has(agentId)) {
      throw new Error(`Cannot unregister active agent ${agentId}`);
    }

    this.healthChecks.delete(agentId);
    return this.definitions.delete(agentId);
  }

  isRegistered(agentId: AgentId): boolean {
    return this.definitions.has(agentId);
  }

  // ==========================================================================
  // Lifecycle
  // ==========================================================================

  async spawn(agentId: AgentId): Promise<AgentState> {
    const definition = this.definitions.get(agentId);
    if (!definition) {
      throw new Error(`Agent ${agentId} is not registered`);
    }

    if (this.states.has(agentId)) {
      throw new Error(`Agent ${agentId} is already spawned`);
    }

    const state: AgentState = {
      id: agentId,
      role: definition.role,
      status: 'idle',
      currentTask: null,
      completedTasks: [],
      metrics: this.createInitialMetrics(agentId),
      lastHeartbeat: Date.now()
    };

    this.states.set(agentId, state);

    const healthStatus = this.healthChecks.get(agentId)!;
    healthStatus.healthy = true;
    healthStatus.lastHeartbeat = Date.now();
    healthStatus.status = 'idle';

    await this.eventBus.emit(agentSpawnedEvent(agentId, definition.role));

    return state;
  }

  async terminate(agentId: AgentId): Promise<boolean> {
    const state = this.states.get(agentId);
    if (!state) {
      return false;
    }

    if (state.currentTask) {
      throw new Error(`Cannot terminate agent ${agentId} with active task ${state.currentTask}`);
    }

    this.states.delete(agentId);

    const healthStatus = this.healthChecks.get(agentId);
    if (healthStatus) {
      healthStatus.healthy = false;
      healthStatus.status = 'idle';
    }

    await this.eventBus.emit(agentStatusChangedEvent(agentId, state.status, 'terminated'));

    return true;
  }

  // ==========================================================================
  // State Management
  // ==========================================================================

  getState(agentId: AgentId): AgentState | undefined {
    return this.states.get(agentId);
  }

  updateStatus(agentId: AgentId, status: AgentStatus): void {
    const state = this.states.get(agentId);
    if (!state) {
      throw new Error(`Agent ${agentId} is not spawned`);
    }

    const previousStatus = state.status;
    state.status = status;

    const healthStatus = this.healthChecks.get(agentId);
    if (healthStatus) {
      healthStatus.status = status;
    }

    this.eventBus.emitSync(agentStatusChangedEvent(agentId, previousStatus, status));
  }

  assignTask(agentId: AgentId, taskId: TaskId): void {
    const state = this.states.get(agentId);
    if (!state) {
      throw new Error(`Agent ${agentId} is not spawned`);
    }

    if (state.currentTask) {
      throw new Error(`Agent ${agentId} already has task ${state.currentTask}`);
    }

    state.currentTask = taskId;
    this.updateStatus(agentId, 'active');
  }

  completeTask(agentId: AgentId, taskId: TaskId): void {
    const state = this.states.get(agentId);
    if (!state) {
      throw new Error(`Agent ${agentId} is not spawned`);
    }

    if (state.currentTask !== taskId) {
      throw new Error(`Agent ${agentId} current task is ${state.currentTask}, not ${taskId}`);
    }

    state.completedTasks.push(taskId);
    state.currentTask = null;
    state.metrics.tasksCompleted++;

    this.updateStatus(agentId, 'idle');
  }

  // ==========================================================================
  // Queries
  // ==========================================================================

  getDefinition(agentId: AgentId): AgentDefinition | undefined {
    return this.definitions.get(agentId);
  }

  getAllAgents(): AgentDefinition[] {
    return Array.from(this.definitions.values());
  }

  getActiveAgents(): AgentState[] {
    return Array.from(this.states.values()).filter(s => s.status === 'active');
  }

  getAgentsByDomain(domain: AgentDomain): AgentDefinition[] {
    return Array.from(this.definitions.values()).filter(d => d.domain === domain);
  }

  getAgentsByCapability(taskType: TaskType): AgentDefinition[] {
    return Array.from(this.definitions.values()).filter(d =>
      d.capabilities.some(c => c.supportedTaskTypes.includes(taskType))
    );
  }

  // ==========================================================================
  // Health Management
  // ==========================================================================

  heartbeat(agentId: AgentId): void {
    const state = this.states.get(agentId);
    if (state) {
      state.lastHeartbeat = Date.now();
    }

    const healthStatus = this.healthChecks.get(agentId);
    if (healthStatus) {
      healthStatus.lastHeartbeat = Date.now();
      healthStatus.consecutiveMisses = 0;
      healthStatus.healthy = true;
    }
  }

  getHealthStatus(): Map<AgentId, HealthStatus> {
    return new Map(this.healthChecks);
  }

  startHealthChecks(): void {
    if (this.healthCheckTimer) {
      return;
    }

    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);
  }

  stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  private performHealthCheck(): void {
    const now = Date.now();

    for (const [agentId, healthStatus] of this.healthChecks) {
      const state = this.states.get(agentId);
      if (!state) {
        continue;
      }

      const timeSinceHeartbeat = now - healthStatus.lastHeartbeat;

      if (timeSinceHeartbeat > this.healthCheckInterval) {
        healthStatus.consecutiveMisses++;

        if (healthStatus.consecutiveMisses >= this.maxMissedHeartbeats) {
          healthStatus.healthy = false;
          this.updateStatus(agentId, 'error');

          this.eventBus.emitSync(agentErrorEvent(
            agentId,
            new Error(`Agent ${agentId} missed ${healthStatus.consecutiveMisses} heartbeats`)
          ));
        }
      }
    }
  }

  // ==========================================================================
  // Events
  // ==========================================================================

  onAgentEvent(handler: EventHandler): () => void {
    const unsubscribers = [
      this.eventBus.subscribe('agent:spawned', handler),
      this.eventBus.subscribe('agent:status-changed', handler),
      this.eventBus.subscribe('agent:task-assigned', handler),
      this.eventBus.subscribe('agent:task-completed', handler),
      this.eventBus.subscribe('agent:error', handler)
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  // ==========================================================================
  // Default Agent Registration
  // ==========================================================================

  private registerDefaultAgents(): void {
    const agentDefinitions: AgentDefinition[] = [
      { id: 'athena', role: 'Data Logic', domain: 'core', description: 'Core data orchestration', capabilities: [], dependencies: [], priority: 1 },
      { id: 'architect', role: 'System Design', domain: 'planning', description: 'High-level system design', capabilities: [], dependencies: [], priority: 2 },
      { id: 'cleo', role: 'Context Manager', domain: 'memory', description: 'Context and state management', capabilities: [], dependencies: [], priority: 3 },
      { id: 'coder', role: 'Implementation', domain: 'engineering', description: 'Software engineering', capabilities: [], dependencies: ['architect'], priority: 4 },
      { id: 'thomas', role: 'Testing & QA', domain: 'quality', description: 'Test generation and verification', capabilities: [], dependencies: ['coder'], priority: 5 },
      { id: 'nova', role: 'Innovation', domain: 'research', description: 'Advanced problem solving', capabilities: [], dependencies: [], priority: 6 },
      { id: 'hermes', role: 'Communications', domain: 'network', description: 'Message routing', capabilities: [], dependencies: [], priority: 7 },
      { id: 'raven', role: 'Security Ops', domain: 'security', description: 'Vulnerability assessment', capabilities: [], dependencies: [], priority: 8 },
      { id: 'scout', role: 'Discovery', domain: 'intelligence', description: 'Information gathering', capabilities: [], dependencies: [], priority: 9 },
      { id: 'spike', role: 'Structural Builder', domain: 'core', description: 'Primary Structural Builder - Agent 2 in Hydra', capabilities: [{ name: 'component-generation', description: 'Builds React components', supportedTaskTypes: ['implementation'] }], dependencies: [], priority: 10 },
      { id: 'hawk', role: 'Oversight', domain: 'management', description: 'Workflow supervision', capabilities: [], dependencies: [], priority: 11 },
      { id: 'jerry', role: 'Watchdog Sync', domain: 'security', description: 'Watchdog and Token Sync Master', capabilities: [{ name: 'token-sync', description: 'Syncs M3 tokens', supportedTaskTypes: ['security-audit'] }], dependencies: ['spike'], priority: 12 }
    ];

    for (const definition of agentDefinitions) {
      this.register(definition);
    }
  }

  private createInitialMetrics(agentId: string): AgentMetrics {
    return {
      agentId,
      tasksCompleted: 0,
      tasksFailed: 0,
      averageExecutionTime: 0,
      successRate: 0,
      health: 'healthy'
    };
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createAgentRegistry(eventBus: IEventBus): IAgentRegistry {
  return new AgentRegistry(eventBus);
}
