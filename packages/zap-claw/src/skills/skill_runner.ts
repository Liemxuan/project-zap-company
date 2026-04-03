// packages/zap-claw/src/skills/skill_runner.ts
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface SkillPromptInput {
  skillName: string;
  instructions: string;
  userInput: string;
  agentSlug: string;
}

export function buildSkillSystemPrompt(input: SkillPromptInput): string {
  return [
    `# Skill Execution: ${input.skillName}`,
    `**Assigned Agent:** ${input.agentSlug}`,
    '',
    '## Skill Instructions',
    input.instructions,
    '',
    '## User Request',
    input.userInput,
  ].join('\n');
}

export async function resolveSkillPrompt(
  skillDirName: string,
  skillsBasePath: string
): Promise<string | null> {
  const skillMdPath = join(skillsBasePath, skillDirName, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    return null;
  }

  return readFileSync(skillMdPath, 'utf-8');
}

export async function executeSkill(opts: {
  skillDirName: string;
  skillsBasePath: string;
  userInput: string;
  agentSlug: string;
  sessionId: string;
  tenantId: string;
  trusted?: boolean; // BLAST-IRONCLAD: Default true for built-in skills
}): Promise<{ systemPrompt: string; agentSlug: string } | null> {
  const isTrusted = opts.trusted !== false; // Backwards compatible: undefined = trusted
  const instructions = await resolveSkillPrompt(opts.skillDirName, opts.skillsBasePath);

  if (!instructions) {
    return null;
  }

  // BLAST-IRONCLAD: If untrusted, check for executable scripts and sandbox them
  if (!isTrusted) {
    const scriptPath = join(opts.skillsBasePath, opts.skillDirName, 'scripts', 'index.js');
    if (existsSync(scriptPath)) {
      try {
        const { executeSkillInSandbox } = await import('../security/skill_sandbox.js');
        const result = await executeSkillInSandbox({
          entryPath: scriptPath,
          timeoutMs: 3000,
          injectedContext: { userInput: opts.userInput, agentSlug: opts.agentSlug }
        });
        console.log(`[SkillRunner] 🔒 Sandboxed skill ${opts.skillDirName} executed in ${result.durationMs}ms`);
      } catch (err: any) {
        console.error(`[SkillRunner] 🛑 Sandboxed skill ${opts.skillDirName} BLOCKED: ${err.message}`);
        return null;
      }
    }
  }

  // Extract skill name from directory (e.g., "df-deep-research" → "Deep Research")
  const skillName = opts.skillDirName
    .replace(/^df-/, '')
    .replace(/^zap-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const systemPrompt = buildSkillSystemPrompt({
    skillName,
    instructions,
    userInput: opts.userInput,
    agentSlug: opts.agentSlug,
  });

  return { systemPrompt, agentSlug: opts.agentSlug };
}
