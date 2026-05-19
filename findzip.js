import fs from 'fs';
import path from 'path';

function findZip(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.zip')) {
        console.log('ZIP: ' + path.join(dir, file));
      }
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules')) {
        findZip(fullPath);
      }
    }
  } catch(e){}
}
findZip('/app');
findZip('/tmp');
