---
name: excalidraw-diagram
description: Generate architecture diagrams, flowcharts, and system maps using Excalidraw's JSON scene format. Triggers on "diagram", "create a diagram", "make a diagram", "draw a diagram", "flowchart", "architecture diagram". Outputs .excalidraw files that open natively in Excalidraw, VS Code (with extension), or Obsidian.
---

# Excalidraw Diagram Skill

Generate visual diagrams as `.excalidraw` JSON files that can be opened in:

- [excalidraw.com](https://excalidraw.com) (paste or import)
- VS Code with the Excalidraw extension
- Obsidian with the Excalidraw plugin

## When to Use

Trigger on any of these user intents:

- "diagram", "create a diagram", "make a diagram", "draw a diagram"
- "flowchart", "architecture diagram", "system diagram"
- "draw the flow", "visualize this", "map this out"
- Any request that would benefit from a visual representation of components, flows, or relationships

## Scene Format

Excalidraw files are JSON with this structure:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "zap-design-engine",
  "elements": [],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20,
    "theme": "light"
  },
  "files": {}
}
```

## Element Types

### Rectangle (boxes, containers)

```json
{
  "id": "unique-id",
  "type": "rectangle",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 80,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 3 },
  "seed": 12345,
  "version": 1,
  "isDeleted": false,
  "boundElements": null,
  "groupIds": [],
  "frameId": null,
  "link": null,
  "locked": false,
  "updated": 1
}
```

### Text (labels)

```json
{
  "id": "text-id",
  "type": "text",
  "x": 130,
  "y": 125,
  "width": 140,
  "height": 25,
  "text": "Component Name",
  "fontSize": 16,
  "fontFamily": 1,
  "textAlign": "center",
  "verticalAlign": "middle",
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "roundness": null,
  "seed": 12346,
  "version": 1,
  "isDeleted": false,
  "boundElements": null,
  "groupIds": [],
  "frameId": null,
  "link": null,
  "locked": false,
  "updated": 1,
  "containerId": null,
  "originalText": "Component Name",
  "autoResize": true,
  "lineHeight": 1.25
}
```

### Arrow (connections/flows)

```json
{
  "id": "arrow-id",
  "type": "arrow",
  "x": 300,
  "y": 140,
  "width": 100,
  "height": 0,
  "points": [[0, 0], [100, 0]],
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 2 },
  "seed": 12347,
  "version": 1,
  "isDeleted": false,
  "boundElements": null,
  "groupIds": [],
  "frameId": null,
  "link": null,
  "locked": false,
  "updated": 1,
  "startBinding": { "elementId": "source-id", "focus": 0, "gap": 1, "fixedPoint": null },
  "endBinding": { "elementId": "target-id", "focus": 0, "gap": 1, "fixedPoint": null },
  "startArrowhead": null,
  "endArrowhead": "arrow",
  "elbowed": false
}
```

### Ellipse (for states, events, decisions)

```json
{
  "id": "ellipse-id",
  "type": "ellipse",
  "x": 100,
  "y": 100,
  "width": 120,
  "height": 80
}
```

### Diamond (for decision points)

```json
{
  "id": "diamond-id",
  "type": "diamond",
  "x": 100,
  "y": 100,
  "width": 120,
  "height": 120
}
```

## Color Palette (ZAP-aligned)

Use these colors for consistency with the ZAP Design Engine:

| Purpose | Color | Hex |
|---|---|---|
| Primary nodes | Blue | `#a5d8ff` |
| Secondary nodes | Green | `#b2f2bb` |
| Warning/caution | Yellow | `#fff3bf` |
| Error/danger | Red | `#ffc9c9` |
| Neutral/infrastructure | Gray | `#dee2e6` |
| Highlight/active | Purple | `#d0bfff` |
| Stroke (dark) | Dark | `#1e1e1e` |
| Stroke (medium) | Medium | `#495057` |
| Background | White | `#ffffff` |
| Background (dark) | Dark | `#1e1e1e` |

## Execution Steps

1. **Understand the request**: Parse what the user wants to visualize (architecture, flow, ERD, sequence, etc.)
2. **Plan the layout**: Determine node count, relationships, and spatial arrangement
3. **Generate unique IDs**: Use a pattern like `node-{name}-{random}` for each element
4. **Generate unique seeds**: Each element needs a unique integer `seed` for Excalidraw's hand-drawn rendering
5. **Build the elements array**: Create rectangles for nodes, text for labels, arrows for connections
6. **Use grid alignment**: Place elements on a 20px grid (x/y values divisible by 20)
7. **Bind text to containers**: For labeled boxes, set `containerId` on the text and `boundElements` on the rectangle
8. **Write the `.excalidraw` file**: Save to the project or artifacts directory
9. **Provide opening instructions**: Tell the user they can open it at excalidraw.com or in VS Code

## Layout Guidelines

- **Horizontal spacing**: 280px between nodes (200px box + 80px gap)
- **Vertical spacing**: 160px between rows (80px box + 80px gap)
- **Arrow length**: Typically 80px (the gap between nodes)
- **Font sizes**: 20px for titles, 16px for node labels, 12px for annotations
- **Canvas origin**: Start at x=100, y=100 to give breathing room

## Bound Text Pattern

When a rectangle contains text, you must create a bidirectional binding:

**On the rectangle:**

```json
"boundElements": [{ "id": "text-id", "type": "text" }]
```

**On the text:**

```json
"containerId": "rect-id",
"textAlign": "center",
"verticalAlign": "middle"
```

Set the text x/y to be roughly centered within the rectangle. Excalidraw will auto-adjust.

## Diagram Types

### Architecture Diagram

- Use rectangles for services/components
- Arrows for data flow or dependencies
- Group related items with frames or visual proximity
- Color-code by layer (frontend=blue, backend=green, infra=gray)

### Flowchart

- Use diamonds for decisions
- Rectangles for processes
- Ellipses for start/end
- Arrows with labels for yes/no branches

### Entity Relationship

- Rectangles for entities
- Lines (not arrows) for relationships
- Text labels on lines for cardinality

### Sequence / Timeline

- Vertical arrangement
- Dashed lines for lifelines
- Horizontal arrows for messages

## File Output

Save generated diagrams to:

- **Project context**: `docs/diagrams/{name}.excalidraw` (if in a project)
- **Standalone**: Artifacts directory as `{name}.excalidraw`

## Example: Simple 3-Node Architecture

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "zap-design-engine",
  "elements": [
    {
      "id": "frontend",
      "type": "rectangle",
      "x": 100, "y": 100, "width": 200, "height": 80,
      "strokeColor": "#1e1e1e", "backgroundColor": "#a5d8ff",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100, "roundness": {"type": 3},
      "seed": 1001, "version": 1, "isDeleted": false,
      "boundElements": [{"id": "frontend-label", "type": "text"}],
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0
    },
    {
      "id": "frontend-label",
      "type": "text",
      "x": 150, "y": 127, "width": 100, "height": 25,
      "text": "Frontend", "fontSize": 20, "fontFamily": 1,
      "textAlign": "center", "verticalAlign": "middle",
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "roundness": null,
      "seed": 1002, "version": 1, "isDeleted": false,
      "boundElements": null, "containerId": "frontend",
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0,
      "originalText": "Frontend", "autoResize": true, "lineHeight": 1.25
    },
    {
      "id": "arrow-fe-api",
      "type": "arrow",
      "x": 300, "y": 140, "width": 80, "height": 0,
      "points": [[0,0],[80,0]],
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100, "roundness": {"type": 2},
      "seed": 1003, "version": 1, "isDeleted": false,
      "boundElements": null,
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0,
      "startBinding": {"elementId": "frontend", "focus": 0, "gap": 1, "fixedPoint": null},
      "endBinding": {"elementId": "api", "focus": 0, "gap": 1, "fixedPoint": null},
      "startArrowhead": null, "endArrowhead": "arrow", "elbowed": false
    },
    {
      "id": "api",
      "type": "rectangle",
      "x": 380, "y": 100, "width": 200, "height": 80,
      "strokeColor": "#1e1e1e", "backgroundColor": "#b2f2bb",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100, "roundness": {"type": 3},
      "seed": 1004, "version": 1, "isDeleted": false,
      "boundElements": [{"id": "api-label", "type": "text"}],
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0
    },
    {
      "id": "api-label",
      "type": "text",
      "x": 440, "y": 127, "width": 80, "height": 25,
      "text": "API", "fontSize": 20, "fontFamily": 1,
      "textAlign": "center", "verticalAlign": "middle",
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "roundness": null,
      "seed": 1005, "version": 1, "isDeleted": false,
      "boundElements": null, "containerId": "api",
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0,
      "originalText": "API", "autoResize": true, "lineHeight": 1.25
    },
    {
      "id": "arrow-api-db",
      "type": "arrow",
      "x": 580, "y": 140, "width": 80, "height": 0,
      "points": [[0,0],[80,0]],
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100, "roundness": {"type": 2},
      "seed": 1006, "version": 1, "isDeleted": false,
      "boundElements": null,
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0,
      "startBinding": {"elementId": "api", "focus": 0, "gap": 1, "fixedPoint": null},
      "endBinding": {"elementId": "database", "focus": 0, "gap": 1, "fixedPoint": null},
      "startArrowhead": null, "endArrowhead": "arrow", "elbowed": false
    },
    {
      "id": "database",
      "type": "rectangle",
      "x": 660, "y": 100, "width": 200, "height": 80,
      "strokeColor": "#1e1e1e", "backgroundColor": "#dee2e6",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100, "roundness": {"type": 3},
      "seed": 1007, "version": 1, "isDeleted": false,
      "boundElements": [{"id": "db-label", "type": "text"}],
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0
    },
    {
      "id": "db-label",
      "type": "text",
      "x": 710, "y": 127, "width": 100, "height": 25,
      "text": "Database", "fontSize": 20, "fontFamily": 1,
      "textAlign": "center", "verticalAlign": "middle",
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "roundness": null,
      "seed": 1008, "version": 1, "isDeleted": false,
      "boundElements": null, "containerId": "database",
      "groupIds": [], "frameId": null, "link": null, "locked": false, "updated": 1, "angle": 0,
      "originalText": "Database", "autoResize": true, "lineHeight": 1.25
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20,
    "theme": "light"
  },
  "files": {}
}
```

## Security Notes

- **CLAUDE.md audit (2026-03-10)**: Clean. Contains only project structure docs and dev commands. No prompt injection.
- **copilot-instructions.md audit (2026-03-10)**: Clean. Standard coding guidelines (TypeScript, React, naming conventions). No injection payloads.
- **License**: MIT — clear for use.
- **No runtime dependency needed**: This skill generates static JSON files. We do NOT install or execute Excalidraw code. Zero supply chain risk.

## Do NOT

- Do NOT install `@excalidraw/excalidraw` as a dependency — we only generate the JSON format
- Do NOT use the Excalidraw React component — this is file generation only
- Do NOT embed external URLs or load remote assets in generated diagrams
- Do NOT use `eval()` or dynamic code execution in any generated content
