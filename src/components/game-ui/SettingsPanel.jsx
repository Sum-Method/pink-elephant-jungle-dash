import React, { useEffect } from "react";

import { AchievementsPanel } from "./AchievementsPanel.jsx";
import { PwaInstallCard } from "./PwaInstallCard.jsx";
import { SaveDebugTools } from "./SaveDebugTools.jsx";

const sectionCardClass = "settings-section-card";
const infoCardClass = "settings-info-card";
const segmentedButtonClass = "jungle-focus-ring settings-segmented-button";

function segmentedClass(active, extraClass = "") {
  return `${segmentedButtonClass}${active ? " is-active" : ""}${extraClass ? ` ${extraClass}` : ""}`;
}

export function SettingsPanel({
  open,
  context,
  onClose,
  audioState,
  onToggleAudio,
  graphicsQuality,
  onGraphicsQualityChange,
  touchControlsMode,
  onTouchControlsModeChange,
  gamepadStatus,
  hapticsEnabled,
  hapticsSupported,
  onHapticsChange,
  accessibilitySettings,
  onAccessibilityChange,
  isStandalone,
  canInstall,
  showInstallCard,
  onInstall,
  onDismissInstall,
  showSaveTools,
  onToggleSaveTools,
  onExportSave,
  onImportSave,
  onResetSave,
  achievementRecords,
  onOpenCredits,
  appVersion,
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const modeLabel = isStandalone ? "Installed app mode" : "Browser tab mode";
  const gamepadLabel = gamepadStatus?.gamepadConnected ? gamepadStatus.gamepadName : "No gamepad connected";
  const accessibilityRows = [
    ["reduceMotionEnabled", "Reduce Motion", "Calms transitions and decorative motion."],
    ["softFlashesEnabled", "Soft Flashes", "Uses gentler end-screen and warning effects."],
    ["highContrastEnabled", "High Contrast", "Strengthens menu and HUD contrast."],
    ["largeTextEnabled", "Larger Text", "Makes menu text easier to read."],
  ];

  return (
    <section className="settings-overlay pointer-events-auto absolute inset-0 z-40 flex" aria-modal="true" role="dialog" aria-labelledby="settings-title">
      <div className="jungle-menu-card settings-modal-card">
        <div className="settings-modal-header">
          <div>
            <div className="settings-kicker">Settings</div>
            <h2 id="settings-title" className="display-title settings-title">Game Settings</h2>
            <p className="settings-context-note">From {context === "pause" ? "Pause" : "Title"}. Esc closes this panel.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings" className="jungle-focus-ring jungle-menu-button-secondary game-modal-close">Close</button>
        </div>

        <div className="settings-modal-grid">
          <div id="settings-audio" className={sectionCardClass}>
            <h3 className="settings-section-title">Audio</h3>
            <div className="settings-stack">
              {[
                ["Master Audio", !(audioState.muted), "muted"],
                ["Music", !(audioState.muted || audioState.musicMuted), "musicMuted"],
                ["SFX", !(audioState.muted || audioState.sfxMuted), "sfxMuted"],
              ].map(([label, enabled, key]) => (
                <div key={key} className="settings-option-row">
                  <span className="settings-option-label">{label}</span>
                  <button
                    type="button"
                    onClick={() => onToggleAudio(key)}
                    aria-pressed={Boolean(enabled)}
                    className={segmentedClass(Boolean(enabled))}
                  >
                    {enabled ? "ON" : "OFF"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div id="settings-controls" className={sectionCardClass}>
            <h3 className="settings-section-title">Controls</h3>
            <div className="settings-card-grid settings-card-grid-two">
              <div className={infoCardClass}>
                <p className="settings-info-title">Desktop</p>
                <p>Move: WASD / Arrows</p>
                <p>Jump / Slide: Space</p>
                <p>Smash: F</p>
              </div>
              <div className={infoCardClass}>
                <p className="settings-info-title">Mobile</p>
                <p>Drag: Steer</p>
                <p>Buttons: Jump / Smash</p>
              </div>
            </div>
            <fieldset className="settings-fieldset">
              <legend className="settings-fieldset-legend">Touch Controls</legend>
              <div className="settings-button-grid settings-button-grid-three">
                {[
                  ["auto", "Automatic"],
                  ["always", "Always Visible"],
                  ["off", "Disabled"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onTouchControlsModeChange(value)}
                    aria-pressed={touchControlsMode === value}
                    className={segmentedClass(touchControlsMode === value, "settings-segmented-button-full")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="settings-card-grid settings-card-grid-two">
              <div className={infoCardClass}>
                <p className="settings-info-title">Gamepad</p>
                <p>{gamepadStatus?.gamepadSupported ? gamepadLabel : "Gamepad API unavailable"}</p>
                <p className="settings-info-muted">Left stick / D-pad move, A jumps, B/X/L/R smashes, Start pauses.</p>
              </div>
              <div className={infoCardClass}>
                <div className="settings-option-row settings-option-row-plain">
                  <span>
                    <span className="settings-info-title">Haptics</span>
                    <span className="settings-info-muted">{hapticsSupported ? "Phone vibration feedback" : "Not supported here"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onHapticsChange(!hapticsEnabled)}
                    aria-pressed={Boolean(hapticsEnabled)}
                    disabled={!hapticsSupported}
                    className={segmentedClass(Boolean(hapticsEnabled))}
                  >
                    {hapticsEnabled ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="settings-display" className={sectionCardClass}>
            <h3 className="settings-section-title">Graphics</h3>
            <p className="settings-section-copy">Graphics Quality</p>
            <div className="settings-button-grid settings-button-grid-three">
              {[
                ["high", "High", ""],
                ["balanced", "Balanced", "Recommended"],
                ["battery-saver", "Saver", ""],
              ].map(([value, label, sub]) => (
                <button key={value} type="button" onClick={() => onGraphicsQualityChange(value)} aria-pressed={graphicsQuality === value} className={segmentedClass(graphicsQuality === value, "settings-graphics-button")}>
                  <span className="settings-graphics-label">{label}</span>
                  {sub ? <span className="settings-graphics-sub">({sub})</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div id="settings-accessibility" className={sectionCardClass}>
            <h3 className="settings-section-title">Accessibility</h3>
            <div className="settings-stack">
              {accessibilityRows.map(([key, label, description]) => {
                const enabled = Boolean(accessibilitySettings?.[key]);
                return (
                  <div key={key} className="settings-toggle-row">
                    <span>
                      <span className="settings-toggle-label">{label}</span>
                      <span className="settings-toggle-description">{description}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onAccessibilityChange(key, !enabled)}
                      aria-pressed={enabled}
                      className={segmentedClass(enabled)}
                    >
                      {enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="settings-gameplay" className={sectionCardClass}>
            <h3 className="settings-section-title">Gameplay</h3>
            <dl className="settings-stack">
              <div className={infoCardClass}>
                <dt>Auto Pause</dt>
                <dd>The run pauses on blur, tab hide, and app background.</dd>
              </div>
              <div className={infoCardClass}>
                <dt>Input Safety</dt>
                <dd>Pause, complete, game over, and settings clear held keyboard/touch input.</dd>
              </div>
            </dl>
          </div>

          <div id="settings-save" className={sectionCardClass}>
            <h3 className="settings-section-title">Save Data</h3>
            <SaveDebugTools visible={showSaveTools} onToggle={onToggleSaveTools} onExport={onExportSave} onImport={onImportSave} onReset={onResetSave} />
            <div className="settings-section-divider">
              <p>{modeLabel}</p>
              <PwaInstallCard visible={showInstallCard} canInstall={canInstall && !isStandalone} onInstall={onInstall} onDismiss={onDismissInstall} />
            </div>
          </div>

          <div id="settings-achievements" className={sectionCardClass}>
            <h3 className="settings-section-title">Achievements</h3>
            <AchievementsPanel records={achievementRecords} />
          </div>

          <div id="settings-credits" className={sectionCardClass}>
            <h3 className="settings-section-title">Credits & Template</h3>
            <dl className="settings-stack">
              <div className={infoCardClass}>
                <dt>Game</dt>
                <dd>Pink Elephant Jungle Dash</dd>
              </div>
              <div className={infoCardClass}>
                <dt>Template Defaults</dt>
                <dd>PWA install, offline cache, save tools, audio, touch controls, and release markers.</dd>
              </div>
              <div className={infoCardClass}>
                <dt>Attribution Slot</dt>
                <dd>Replace this with project art, music, SFX, engine, and license credits.</dd>
              </div>
            </dl>
            <button type="button" onClick={onOpenCredits} className="jungle-focus-ring jungle-menu-button-secondary settings-wide-action">
              Open Credits
            </button>
          </div>
        </div>

        <div className="settings-footer">
          <p>Pink Elephant Jungle Dash</p>
          <p>Made with love for Georgia, by Uncle Jed</p>
          <p>Version {appVersion}</p>
        </div>
      </div>
    </section>
  );
}
