import fs from "node:fs";
import path from "node:path";

const markerFile = path.resolve("docs/.nojekyll");
const generatedHtmlFile = path.resolve("docs/index.html");

fs.mkdirSync(path.dirname(markerFile), { recursive: true });
fs.writeFileSync(markerFile, "");

if (fs.existsSync(generatedHtmlFile)) {
  const html = fs.readFileSync(generatedHtmlFile, "utf8");
  fs.writeFileSync(generatedHtmlFile, html.replace(/\r\n?/g, "\n"));
}

console.log("GitHub Pages marker ensured at docs/.nojekyll");
