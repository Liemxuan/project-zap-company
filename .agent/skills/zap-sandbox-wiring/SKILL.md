---
name: zap-sandbox-wiring
description: Standard Operating Procedure for wiring ZAP Sandbox Dynamic Properties and Theme Publishing
---

# ZAP Sandbox Wiring Standard Operating Procedure

This SOP governs the process for ensuring ZAP Design Engine Sandbox components (e.g., Badge, Canvas, Card, Avatar) correctly respond to dynamic property sliders and can publish their variables to the Active Theme's global source via the Theme API.

## Problem Statement

Often, Sandbox sliders (e.g., Border Radius, Height, Padding) fail to alter the visualized component because the component's internal CSS structure does not accept dynamic CSS variables. Furthermore, the "Publish to Theme" functionality may be hardcoded, saving data to the wrong root theme or failing to hydrate the loaded sandbox with previously saved variables.

## Step 1: Component CSS Variable Injection (The Atom)

Locate the actual atomic component in `src/genesis/atoms/...` and ensure it can accept dynamic parameters injected via its parent.

1.  **Tailwind Merge Validation:** Ensure the component accepts the `className` prop and merges it using the `cn()` utility (`import { cn } from '@/lib/utils';`). This acts as the foundation that permits overrides.
2.  **Translate Static Utilities to Dynamic Arbitrary Values:** Convert static Tailwind classes (e.g., `rounded-lg`) into bracket syntax that falls back to a default but allows a CSS variable to assume control.
    *   *Bad:* `rounded-lg`
    *   *Good:* `rounded-[length:var(--canvas-radius,var(--rounded-canvas,12px))]`
    *   *Bad:* `p-4`
    *   *Good:* `p-[var(--card-padding,16px)]`
    *   *Bad:* `border`
    *   *Good:* `border-[length:var(--card-border-width,1px)]`

## Step 2: Sandbox Parent Wiring (The Preview)

Navigate to the Sandbox page (`src/app/design/zap/atoms/[component]/page.tsx`) and wire the state variables to the preview component.

1.  **Wrap the Preview with a CSS Variable Injector:** The component preview must be wrapped in a container that translates React State (e.g., `radius[0]`) into the CSS Variables expected by the Atom (e.g., `--canvas-radius`).

```tsx
<div 
    style={{
        '--canvas-height': `${height[0]}px`,
        '--canvas-border-width': `${borderWidth[0]}px`,
        '--canvas-radius': `${borderRadius[0]}px`
    } as React.CSSProperties}
>
    <Canvas />
</div>
```

## Step 3: Theme Publish API Integration (The Save Button)

The Sandbox must utilize the ZAP Theme Engine to load and save to the currently active theme (Core, Metro, Neo).

1.  **Import the Active Theme:**
    ```tsx
    import { useTheme } from '@/components/ThemeContext';
    // Inside the component:
    const { theme } = useTheme();
    const activeTheme = theme;
    ```
2.  **Hydrate on Mount (useEffect):** Fetch the saved parameters from the API when the sandbox loads so the sliders match what is actually published in the global source.
    ```tsx
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch(`/api/theme/publish?theme=${activeTheme}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.variables) {
                        // Example state hydration:
                        if (data.variables['--canvas-height']) setHeight([parseInt(data.variables['--canvas-height'])]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch component settings:", error);
            }
        }
        fetchSettings();
    }, [activeTheme]);
    ```
3.  **Execute the Publish POST Request:** Modify `handlePublish` to build a `variables` object containing the CSS strings (often needing 'px' appended if it's a structural measurement).
    ```tsx
    const handlePublish = async () => {
        const variables = {
            '--canvas-height': height[0] + 'px',
            '--canvas-border-width': borderWidth[0] + 'px',
            // ...
        };

        try {
            const res = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables })
            });

            if (res.ok) {
                alert(`Parameters saved to ${activeTheme.toUpperCase()} Global Source.`);
            } else {
                const data = await res.json();
                alert(`Error publishing theme: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
        }
    };
    ```
4.  **Update the Publish Button Text:** Ensure the user knows exactly where the data is going.
    *   *Bad:* `<span>Publish to Global Source</span>`
    *   *Good:* `<span>Publish to {activeTheme.toUpperCase()} Theme</span>`
