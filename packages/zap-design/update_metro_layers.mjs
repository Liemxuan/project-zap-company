import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, 'src/components/pages');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const targetRegex = /bg-white\s+dark:bg-zinc-[0-9]{3}/g;

let count = 0;
walkDir(PAGES_DIR, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (targetRegex.test(content)) {
      count++;
      content = content.replace(targetRegex, 'bg-layer-dialog');
      // Also catch any `bg-white` inside buttons that might be floating around that shouldn't be touched? 
      // The regex targets `bg-white dark:bg-zinc-900` explicitly, so it's safe.
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${path.relative(PAGES_DIR, filePath)}`);
    }
  }
});

console.log(`\nCompleted. Updated ${count} files to use L4 (bg-layer-dialog).`);
