/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
let content = fs.readFileSync('src/zap/sections/layout-layers/body.tsx', 'utf8');

content = content.replace(/shadow-\[6px_6px_0px_0px_#000\]/g, '');

content = content.replace(/02\. Layer 1: The Canvas/g, '02. LAYER 1: THE CANVAS');
content = content.replace(/03\. Layer 2: The Cover/g, '03. LAYER 2: THE COVER');
content = content.replace(/04\. Layer 3: Panels/g, '04. LAYER 3: PANELS');

fs.writeFileSync('src/zap/sections/layout-layers/body.tsx', content);
