const fs = require('fs');
const file = '/Users/zap/Workspace/olympus/packages/zap-design/src/app/design/[theme]/mission-control/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Dashboard Quick Stats (L2)
code = code.replace(/bg-surface-container-low rounded-xl/g, 'bg-layer-cover rounded-xl');

// Grid Items (L2, with L3 hover)
code = code.replace(/bg-surface-container-low hover:bg-surface-container/g, 'bg-layer-cover hover:bg-layer-panel');

// Gateway Telemetry Cards (L3)
code = code.replace(/bg-surface-container rounded-xl/g, 'bg-layer-panel rounded-xl');
code = code.replace(/bg-surface-container'}/g, "bg-layer-panel'}");

// Inspector Sheet (L4)
code = code.replace(/bg-surface-container-low border-l/g, 'bg-layer-dialog border-l');

// Inspector Items (L5)
code = code.replace(/bg-surface-container shadow-sm/g, 'bg-layer-modal shadow-sm');
code = code.replace(/bg-surface-container px-3\.5/g, 'bg-layer-modal px-3.5');

// Inspector Sub-items (Inside L5, use subtle outline opacity)
code = code.replace(/bg-surface-container-high/g, 'bg-outline/5');
code = code.replace(/bg-surface-container-highest/g, 'bg-outline/10');
code = code.replace(/bg-surface-container\/50/g, 'bg-layer-modal');

fs.writeFileSync(file, code);
console.log('Refactored page.tsx');
