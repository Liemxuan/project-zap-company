---
name: release-note-generation
description: Toolkit for generating release notes from GitHub milestone PRs or commit ranges. Use when asked to create release notes, summarize milestone PRs, generate changelog, or prepare release documentation.
---

# Release Note Generation Skill

Generate professional release notes by collecting merged PRs, grouping by label, and producing user-facing summaries.

## Output Directory

All generated artifacts are placed under `Generated Files/ReleaseNotes/` at the repository root (gitignored).

```
Generated Files/ReleaseNotes/
├── milestone_prs.json           # Raw PR data from GitHub
├── v{VERSION}-release-notes.md  # Final consolidated release notes
```

## When to Use This Skill

- Generate release notes for a milestone
- Summarize PRs merged in a release
- Assign milestones to PRs missing them
- Collect PRs between two commits/tags
- Update readme.md for a new version

## Workflow Overview

1. **Collect PRs**: Fetch PRs between commits/tags or by milestone.
2. **Label PRs**: Group PRs by category (e.g., Features, Fixes, Documentation).
3. **Summarize**: Generate a high-level summary of the changes.

## Available Scripts

- `scripts/dump-prs-since-commit.ps1`: Fetch PRs between commits/tags.
- `scripts/group-prs-by-label.ps1`: Group PRs into CSVs.

## Detailed Workflow

Refer to the documents in the `references/` directory for step-by-step instructions on collection, labeling, and summarization.
