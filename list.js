import fs from 'fs';
import path from 'path';

function walk(dir) {
  if (dir.includes('node_modules')) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.startsWith('.')) continue; // ignore hidden
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      console.log('DIR: ' + fullPath);
      walk(fullPath);
    } else {
      console.log('FILE: ' + fullPath);
    }
  }
}
walk('.');
