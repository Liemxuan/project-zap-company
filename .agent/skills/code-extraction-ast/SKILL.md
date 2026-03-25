---
name: code-extraction-ast
description: Standard operation for extracting large React components using ts-morph to prevent context bloat and token exhaustion. Mandatory for Spike on files > 200 lines.
---

# AST Component Extraction Protocol

## The Problem
Reading massive (+400 line) UI files to extract a single component wastes tokens, degrades LLM attention, and leads to hallucinations or truncation. We cannot rely on LLM context windows to filter out noise from raw text files.

## The Solution
Use the `extract_ast.ts` sniper tool built into `zap-claw`. This script parses the TypeScript AST and surgically extracts *only* the requested component, its props, and immediately associated interfaces. 

## When to Use This Skill
- You are Spike, Recon, or any agent tasked with extracting or inspecting a component from a massive file (e.g., standard Metronic template files).
- The target file is > 200 lines long.
- You know the exact file path and the name of the exported component.

## Execution
Run the AST extractor via `run_command`:

```bash
npx tsx packages/zap-claw/src/scripts/extract_ast.ts --file=<path_to_file.tsx> --export=<ComponentName>
```

### Example
To extract the `UserHero` component from a giant dashboard page:
```bash
npx tsx packages/zap-claw/src/scripts/extract_ast.ts --file=packages/zap-design/src/components/ui/user-hero.tsx --export=UserHero
```

## The Return Value
The script will output the clean TypeScript code directly to the standard output.
You will see:
1. The target function, variable declaration, or class.
2. The associated props interface (e.g., `UserHeroProps`).
3. The associated state interface (e.g., `UserHeroState`), if any.

**Do not** use `cat` or blindly view massive UI files when extracting a specific component. Use the AST sniper.
