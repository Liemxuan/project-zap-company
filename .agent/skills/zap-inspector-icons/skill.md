---
name: zap-inspector-icons
description: Standardized procedure for adding visual icons to Inspector Accordions in the ZAP Design Engine.
---

# Inspector Icon Standardization Skill

This skill outlines the process for enhancing Inspector UI readability by adding micro-animated icons to section headers.

## Context

The ZAP Inspector uses `InspectorAccordion` components to organize controls. Icons provide visual anchors for these sections, improving scanability.

## Procedure

### 1. Identify Target Section

Locate the `InspectorAccordion` in the relevant Inspector file (e.g., `UiKitInspector.tsx`, `ButtonInspector.tsx`).

```tsx
<InspectorAccordion title="Visual Style" ... >
```

### 2. Select Icon

Choose a semantic icon from `lucide-react`.

| Section Type | Recommended Icon |
| :--- | :--- |
| **Typography / Text** | `Type`, `AlignLeft` |
| **Colors / Palette** | `Palette`, `Droplet` |
| **Layout / Geometry** | `Layout`, `Ruler`, `Maximize` |
| **Behavior / Logic** | `Zap`, `Eye` (Visibility) |
| **Library / Presets** | `Library`, `BookOpen` |
| **Forms / Input** | `Box`, `Type` |

### 3. Implementation

1. **Import** the icon from `lucide-react`.
2. **Pass** the icon component to the `icon` prop of `InspectorAccordion`.

```tsx
import { Eye } from 'lucide-react';

// ...

<InspectorAccordion 
    title="Visual Style" 
    icon={Eye} // <--- Add this prop
    defaultOpen={true}
    // ...
>
```

### 4. Micro-Animation Behavior

The `InspectorAccordion` inherently handles the micro-animation logic (rotation/scaling on collapse) if an `icon` prop is provided. No additional logic is required in the consuming component.

## Verification

- Verify the icon appears to the left of the title.
- Verify the icon performs a "nod" (rotate -10deg, scale 0.90) animation when the accordion is **collapsed**.
