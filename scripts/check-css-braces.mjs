import fs from "node:fs";
import path from "node:path";

const cssFile = path.resolve("src/styles/game-ui.css");
const css = fs.readFileSync(cssFile, "utf8");

let balance = 0;
for (let i = 0; i < css.length; i += 1) {
  const ch = css[i];
  if (ch === "{") balance += 1;
  if (ch === "}") balance -= 1;
  if (balance < 0) {
    const line = css.slice(0, i + 1).split("\n").length;
    console.error(`CSS brace check failed: unexpected closing brace near line ${line} in ${cssFile}`);
    process.exit(1);
  }
}

if (balance !== 0) {
  console.error(`CSS brace check failed: unbalanced braces (${balance}) in ${cssFile}`);
  process.exit(1);
}

console.log("CSS brace check passed for src/styles/game-ui.css");
