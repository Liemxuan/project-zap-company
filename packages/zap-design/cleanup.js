/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

console.log('Copying foundation pages to target locations...');
const foundationsDir = '/Users/zap/Workspace/olympus/packages/zap-design/src/zap/foundations';
const srcDir = '/Users/zap/Workspace/olympus/packages/zap-design/src/app/design/metro';
const dirs = ['colors', 'typography', 'elevation', 'spacing', 'icons', 'layout', 'overlay', 'motion'];

dirs.forEach(d => {
  const targetDir = path.join(foundationsDir, d);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const sourceFile = path.join(srcDir, d, 'page.tsx');
  const targetFile = path.join(targetDir, 'index.tsx');
  
  // If the source exists, copy it. We overwrite to ensure it is named index.tsx and is the fresh file.
  if (fs.existsSync(sourceFile)) {
    try {
      fs.copyFileSync(sourceFile, targetFile);
      console.log('Copied ->', targetFile);
    } catch (e) {
      console.log('Failed to copy', d, e.message);
    }
  } else {
    console.log('Missing source ->', sourceFile);
  }
});

console.log('Foundation extraction complete.');
