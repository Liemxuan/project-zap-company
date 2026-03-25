# AI-Powered Animation Generation

This guide explains how to generate CSS and Framer Motion animations from natural language descriptions using the internal AI tools.

## The Concept

Describing animations is easy. Writing keyframes and easing functions is not. By telling the AI what you want to see, it can generate production-ready code.

## Quick Start (Project Standard)

While the legacy tool used `npx ai-animation`, the integrated project standard is to use the **Motion Skill** directly via prompting.

### Common Prompting Patterns

- **"fade in from left with bounce"**
- **"pulse glow effect"** (CSS keyframes)
- **"staggered list entrance"** (Framer Motion variants)
- **"smooth slide up reveal"**
- **"shake horizontally three times then settle"**

## Best Practices for Generation

- **Be descriptive**: "bounce twice then fade" is better than "make it move".
- **Mention timing**: Include "slow", "fast", or specific durations like "0.5s".
- **Specify direction**: "from left", "upward", or "diagonal" provides necessary context.
- **Reference Presets**: Always ask the AI to map generated animations to existing `animations.ts` tokens where possible.

## Output Formats

The AI can generate:

1. **CSS Keyframes**: Best for performance-critical background effects.
2. **Framer Motion Variants**: Recommended for interactive UI components.
3. **Combined Sets**: For complex orchestrations.

---
> [!TIP]
> Use these generated snippets as a starting point, then refine them using the technical patterns in `references/motion-vs-auto-animate.md`.
