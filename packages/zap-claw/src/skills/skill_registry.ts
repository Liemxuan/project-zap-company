// packages/zap-claw/src/skills/skill_registry.ts
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface SkillEntry {
  dirName: string;
  name: string;
  command: string;
  description: string;
  agentSlug: string;
  path: string;
}

/**
 * Scan the .agent/skills/ directory and return all discovered skills.
 */
export function discoverSkills(skillsBasePath: string): SkillEntry[] {
  if (!existsSync(skillsBasePath)) return [];

  return readdirSync(skillsBasePath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const skillMdPath = join(skillsBasePath, d.name, 'SKILL.md');
      if (!existsSync(skillMdPath)) return null;

      const content = readFileSync(skillMdPath, 'utf-8');
      const firstLine = content.split('\n').find(l => l.trim().length > 0) || d.name;
      const desc = content.slice(0, 200).replace(/^#.*\n/, '').trim();

      // Determine agent from prefix
      let agentSlug = 'spike';
      if (d.name.startsWith('df-')) agentSlug = 'athena';
      if (d.name.includes('chart') || d.name.includes('data-analysis')) agentSlug = 'raven';
      if (d.name.includes('design') || d.name.includes('frontend')) agentSlug = 'nova';
      if (d.name.includes('github')) agentSlug = 'scout';

      return {
        dirName: d.name,
        name: firstLine.replace(/^#+\s*/, ''),
        command: `/${d.name}`,
        description: desc,
        agentSlug,
        path: skillMdPath,
      };
    })
    .filter(Boolean) as SkillEntry[];
}
