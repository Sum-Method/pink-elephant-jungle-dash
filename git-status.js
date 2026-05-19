import { execSync } from 'child_process';
console.log(execSync('git status').toString());
