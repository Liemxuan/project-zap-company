import { ToolMiddleware } from "./pipeline.js";
import { activePlans } from "../tools/write_todos.js";

export const TodoListMiddleware: ToolMiddleware = async (ctx, next) => {
    const delegationTools = ["task", "deploy_hydra_team"];
    
    if (delegationTools.includes(ctx.toolName)) {
        // Enforce the ZSS / DeerFlow rule: No delegation without a written plan
        const threadKey = `${ctx.userId}:${ctx.sessionId || 'default'}`;
        const currentPlan = activePlans.get(threadKey);
        
        if (!currentPlan || currentPlan.length === 0) {
             ctx.isAllowed = false;
             ctx.hadError = true;
             ctx.resultContent = `[DEERFLOW GUARDRAIL] Execution Denied. You cannot delegate a concurrent background task without first using the 'write_todos' tool to explicitly draft an orchestration plan. Enacting structural delegation blindly is a massive violation.`;
             console.warn(`[TODOLIST MIDDLEWARE] 🛑 Blocked ${ctx.toolName} execution: No plan exists for thread ${threadKey}.`);
             
             // Halt pipeline explicitly by NOT calling next
             return;
        } else {
             console.log(`[TODOLIST MIDDLEWARE] ✅ Allowed ${ctx.toolName}: Active plan detected for thread ${threadKey}.`);
        }
    }

    await next();
};
