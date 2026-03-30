# Motion — L2 Primitive Specification

**Tier:** L2 (Primitive) | **Category:** Motion
**Source:** `frontend-motion` (Motion / Framer Motion), `@/lib/animations.ts` | **Last Updated:** 2026-03-28

## 1. Purpose & Scope
The Motion primitive defines exactly how components translate, scale, mount, and unmount within ZAP. Driven entirely by the `motion/react` package, it controls hardware-accelerated animations like drag-drops, layout FLIP transitions, staggered reveals, and `AnimatePresence` unmounts. ZAP expressly forbids standard Tailwind CSS transitions when interacting with this engine to prevent layout calculation stutter.

## 2. API / Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initial` | `object` | undefined | Starting animation state before mount |
| `animate` | `object` | undefined | End target state of the animation |
| `exit` | `object` | undefined | Target state upon `AnimatePresence` unmounting |
| `layout` | `boolean/string` | `false` | Enables automatic FLIP physics during structural parent reflow |
| `transition`| `object` | spring | Custom timing curves (`stiffness`, `damping`, `duration`) |

## 3. L1 Token Dependencies
None explicitly; Motion instead wraps existing tokens (e.g. morphing `--color-state-success` or scaling `var(--radius-shape-large)`).

## 4. Composition Patterns
- **Exit Animations**: Must be wrapped inside `<AnimatePresence>` to orchestrate the unmounting of `Tooltip`, `Dialog`, and conditional atoms.
- **Scroll Sync**: Uses `whileInView` for viewport-triggered reveals.
- **Performance**: Heavy UI lists demand `react-window` combined with `layout` tracking instead of standard mass-rendering to preserve 60fps framerates.

## 5. Theme Behavior
- **CORE**: Fluid, soft spring physics with slight ease-in-out curves.
- **NEO**: Snappy, bounce-heavy, elastic gestures replicating aggressive mechanical switches.
- **METRO**: Nondescript, nearly instantaneous linear fades to maintain maximum productivity flow.
- **WIX**: Slow, floaty, 'cinematic' ease dynamics that pair well with dark UI.
