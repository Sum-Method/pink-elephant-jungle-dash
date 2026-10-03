// Maintainer note: update this deployment marker on every visible release,
// especially GitHub Pages publishes.
export const APP_VERSION = "1.1.0";
export const APP_BUILD_LABEL = "portfolio-baseline-v1.1.0-2026-10-03";
export const APP_UPDATE_NOTE = "A polished portfolio build with clearer guidance, gentler early play, and smaller game media";

if (typeof window !== "undefined") {
  window.__PEJD_BOOT__ = {
    ...(window.__PEJD_BOOT__ || {}),
    moduleStarted: true,
  };
}
