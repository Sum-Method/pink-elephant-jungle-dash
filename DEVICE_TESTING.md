# DEVICE_TESTING.md

This checklist verifies universal device compatibility for **Pink Elephant Jungle Dash**.

## Phone checks (small + large)

- [ ] Open in mobile browser (portrait): rotate-helper appears and gameplay waits for landscape.
- [ ] Rotate to landscape-left and landscape-right: HUD and controls stay inside notch/home-bar safe areas.
- [ ] Confirm no horizontal scrolling in title screen, settings, and active gameplay.
- [ ] Confirm all touch controls are easy to tap (minimum 48px targets).
- [ ] Hold one movement control and tap an action at the same time (multi-touch) — both inputs work.
- [ ] Pause and resume — no stuck movement/action input.
- [ ] Put app in background, return, and rotate device — run state is preserved (no forced reset).

## Tablet checks

- [ ] Test portrait and landscape where practical.
- [ ] Confirm responsive layout scales up cleanly (no clipped HUD cards, no overlap).
- [ ] Confirm typography is readable and still proportional.
- [ ] Confirm touch controls remain comfortably tappable.
- [ ] Confirm safe-area spacing still protects controls near edges.

## Desktop checks

- [ ] Resize from narrow window to wide monitor and back — game remains usable and state is preserved.
- [ ] Confirm centered scalable app frame (not stretched awkwardly on ultra-wide screens).
- [ ] Confirm no horizontal scrolling at any browser width.
- [ ] Confirm keyboard-first flow still works normally.

## PWA install and offline checks

- [ ] Install from browser prompt and launch from home screen/app launcher.
- [ ] Confirm app opens in standalone/fullscreen style (feels like an app, not a browser tab).
- [ ] Disable network and relaunch — app still loads offline.
- [ ] Re-enable network and publish a new build — update banner appears and refresh works.

## Notes log

For each issue found, capture:

- Device and OS version
- Browser/app wrapper version
- Orientation at time of issue
- What happened
- Repro steps
- Screenshot/video
