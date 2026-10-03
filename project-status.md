# Project Status

**Project:** Pink Elephant Jungle Dash  
**Current portfolio baseline:** v1.1.0  
**Type:** Three-level 3D browser runner and installable PWA  
**Stack:** React, Three.js, and Vite

## Current state

The game has a complete title-to-finale flow, three playable levels, touch/keyboard/gamepad controls, saved progress, accessibility settings, browser-synthesized audio, and skippable story scenes. The v1.1.0 pass focuses on a reliable portfolio baseline: accurate project information, repeatable checks, smaller media, clearer early-game guidance, and more readable gameplay sightlines.

## Baseline gates

- `npm run lint` checks the JavaScript and React source.
- `npm test` runs CSS/TypeScript checks and deterministic gameplay self-tests.
- `npm run build` creates the regular production bundle.
- `npm run build:pages` prepares the GitHub Pages build in `docs/`.
- Manual acceptance remains separate: play through the title, opening, both level transitions, pause/settings/credits, a retry, and the finale; verify phone landscape and gamepad input where available.

## Next

Continue refining the game from player feedback while keeping the level chain, controls, saved-data compatibility, and accessibility settings intact. Keep this status file factual as each release changes the baseline.
