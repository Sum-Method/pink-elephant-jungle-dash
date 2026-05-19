import fs from 'fs';
import path from 'path';

const filesToFetch = [
  'src/game/types.js'
];

async function download() {
  for (const file of filesToFetch) {
    const url = `https://raw.githubusercontent.com/jedcov/pink-elephant-jungle-runner/main/${file}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to fetch ${file}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      const localPath = path.join(process.cwd(), file);
      
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, text);
      console.log(`Downloaded ${file}`);
    } catch (e) {
      console.error(`Error fetching ${file}:`, e.message);
    }
  }
}

download();
