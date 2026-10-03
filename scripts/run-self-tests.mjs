import { runSelfTests } from "../src/game/selfTests.js";

const results = runSelfTests();
const failures = results.filter((result) => !result.pass);
const passedCount = results.length - failures.length;

for (const failure of failures) {
  console.error(`FAIL ${failure.name}`);
}

console.log(`Game self-tests: ${passedCount}/${results.length} passed.`);
process.exitCode = failures.length === 0 ? 0 : 1;
