---
name: ZAP Dynamic Properties
description: Standard operating procedure for wiring component Dynamic Properties (like Border Radius and Border Width) to inherit from the global L1 settings in the Inspector, ensuring defaults match L1 and publishing links back.
---

# ZAP Dynamic Properties Protocol

This skill dictates the standard operating procedure (SOP) for integrating component-level "Dynamic Properties" (e.g., `--select-border-radius`, `--select-border-width`) with the global L1 theme (Metro/Core). This guarantees that sandbox variables inherit the L1 Border and Radius settings by default, and that publishing these properties links them back to the root registry.

## When to Use This Skill

Trigger this skill when:
- The user asks to "link dynamic properties to L1" or "wire up Dynamic Properties".
- The user requests to "use border and width from L1 to set default of the dynamic properties".
- You need to ensure the Inspector's Dynamic Properties inherit the L1 Border and Radius settings by default.

## The 7-Step Dynamic Properties Integration Protocol

To successfully link a component to the L1 Dynamic Properties system, you must systematically update the Sandbox, the API route, and the Component itself. Follow these steps exactly (using `Select` component as an example):

### 1. Identify and Audit the Sandbox
Locate the component's sandbox page (e.g., `src/app/design/zap/atoms/select/page.tsx`). Look for hardcoded sliders managing border radius or width. These must be replaced with the exact `--select-border-radius` and `--select-border-width` CSS variable mappings.

### 2. Implement \`useBorderProperties\` in the Sandbox
Import the necessary hooks and schemas:
\`\`\`tsx
import { useBorderProperties } from '@/zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '@/zap/sections/atoms/foundations/schema';
\`\`\`

Initialize the hook and fetch the current L1 theme state on mount:
\`\`\`tsx
const { state, setComponentOverride, clearComponentOverride, hydrateState, getEffectiveProps } = useBorderProperties();

useEffect(() => {
    let mounted = true;
    const loadSettings = async () => {
        try {
            const res = await fetch(\`/api/border_radius/publish?theme=\${activeTheme}\`);
            if (res.ok && mounted) {
                const data = await res.json();
                if (data.success && data.data && data.data.state) hydrateState(data.data.state);
            }
        } catch (err) { console.error(err); }
    };
    loadSettings();
    return () => { mounted = false; };
}, [activeTheme, hydrateState]);
\`\`\`

### 3. Replace Sliders with Dynamic Selectors (Inheriting M3 L1 by Default)
Remove the pixel sliders and implement the Standardized Token Selectors for Width and Radius. These selectors read from the M3 schemas:
\`\`\`tsx
const effectiveProps = getEffectiveProps('ComponentName');
// By picking the 'value' up from effectiveProps, it defaults perfectly to what L1 has defined if no override exists!
const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '8px';
const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';

// Example Select Renderer for the Inspector
const renderRadiusSelect = (value: string, onChange: (val: string) => void) => (
    <select 
        className={\`w-full bg-layer-base border \${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'} rounded px-2 py-1 text-xs\`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
    >
        <option value="">(Inherit Universal)</option>
        {BORDER_RADIUS_TOKENS.map(t => (
            <option key={t.token} value={t.token}>{t.name} ({t.token})</option>
        ))}
    </select>
);
\`\`\`
*Wire these selectors to `setComponentOverride('ComponentName', 'radius', val)`.*

### 4. Implement Dual-Publishing Configuration
When published, the "Publish to Theme" handler must dispatch *component-specific* variables local theme route, AND dispatch the *global border state* directly to the border radius route linking it back up.

\`\`\`tsx
const handlePublish = async () => {
    setIsSubmitting(true);
    try {
        // 1. Publish component-specific variables (like height, padding)
        const res1 = await fetch('/api/theme/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: activeTheme, variables: { '--component-height': height[0] + 'px' }})
        });

        // 2. Publish border radius & width globally, linking them back!
        const res2 = await fetch('/api/border_radius/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: activeTheme, state })
        });

        if (res1.ok && res2.ok) {
            toast.success(\`Settings Published\`);
        } else throw new Error("Failed to publish");
    } finally {
        setIsSubmitting(false);
    }
};
\`\`\`

### 5. API Mapping (CRITICAL LINKAGE STEP)
For the global L1 changes to actually convert into CSS Variables, you MUST update \`src/app/api/border_radius/publish/route.ts\`.
Map the exact CSS custom properties used by the component to the override engine. **Example mappings for Select:**

\`\`\`typescript
const variablesToPublish: Record<string, string> = {
    // ... existing mappings ...
    '--select-border-radius': getOverride('Select', 'radius') || compiledRadius,
    '--select-border-width': getOverride('Select', 'width') || compiledWidth,
};
\`\`\`

### 6. Component Consumption & Fallbacks
Finally, ensure the actual React component consumes the target CSS variables, and falls back to universal L1 tokens if undefined so they mirror L1 exactly.
\`\`\`tsx
className={cn(
    // Fallback to var(--radius-shape-small) or Universal Radius
    "rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))]",
    // Fallback to var(--layer-border-width)
    "border-[length:var(--select-border-width,var(--layer-border-width,1px))]"
)}
\`\`\`
