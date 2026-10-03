# Release Build Plan

Use Node.js 20.19+ or 22.12+ from the repository root.

## Prepare and validate

```sh
npm ci
npm run lint
npm test
npm run build
npm run build:pages
```

Review the generated `docs/` build, verify `docs/.nojekyll` is present, and smoke-test the player-facing flows touched by the change. Automated checks do not replace visual playtesting or assistive-input checks.

## Release metadata

For a player-facing release, keep `package.json`, `src/appInfo.js`, the README release note, and `public/service-worker.js` cache version aligned. Do not commit secrets or generated build output other than the intentional GitHub Pages `docs/` site.

## Product export

When a release is ready, copy the verified Pages output to `D:\Products\games\pink-elephant-jungle-dash\releases\v<version>\`. Development builds and scratch exports are not published products.
