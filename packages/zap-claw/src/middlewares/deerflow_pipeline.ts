// packages/zap-claw/src/middlewares/deerflow_pipeline.ts
import { ToolMiddleware } from './pipeline.js';
import { GuardrailMiddleware } from './guardrail.js';
import { MemoryInjectMiddleware } from './memory_inject.js';
import { ContextSummarizeMiddleware } from './context_summarize.js';
import { SubagentLimitMiddleware } from './subagent_limit.js';
import { LoopDetectionMiddleware } from './loop_detection.js';
import { TodoListMiddleware } from './todolist.js';
import { TitleAutoGenMiddleware } from './title_autogen.js';
import { FollowupSuggestMiddleware } from './followup_suggest.js';
import { HitlMiddleware } from './hitl.js';
import { SandboxMiddleware } from './sandbox.js';
import { FallbackMiddleware } from './fallback.js';

/**
 * Canonical DeerFlow Middleware Pipeline
 *
 * Execution order:
 * 1. Guardrail (ZSS) — content safety + prompt injection
 * 2. Memory Inject — recall relevant context
 * 3. Context Summarize — compress long threads
 * 4. Subagent Limit — cap concurrent spawns
 * 5. Loop Detection — prevent infinite loops
 * 6. TodoList — enforce plan-before-delegate
 * 7. Sandbox - check environment bounds
 * 8. HITL — human confirmation for destructive actions
 * 9. Title Auto-Gen — generate thread title (first turn)
 * 10. Follow-up Suggest — generate next-step suggestions
 * 11. Fallback
 */
export const DEERFLOW_PIPELINE: ToolMiddleware[] = [
  GuardrailMiddleware,
  MemoryInjectMiddleware,
  ContextSummarizeMiddleware,
  SubagentLimitMiddleware,
  LoopDetectionMiddleware,
  TodoListMiddleware,
  SandboxMiddleware,
  HitlMiddleware,
  TitleAutoGenMiddleware,
  FollowupSuggestMiddleware,
  FallbackMiddleware,
];
