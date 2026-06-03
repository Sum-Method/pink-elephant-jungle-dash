import React, { useEffect, useState } from "react";

const creditsTabs = [
  ["game", "Game"],
  ["template", "Template"],
  ["audio", "Audio"],
  ["engine", "Engine"],
  ["attribution", "Credits"],
  ["build", "Build"],
];

export function CreditsOverlay({ open, appVersion, appBuildLabel, onClose }) {
  const [activeSection, setActiveSection] = useState("game");

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setActiveSection("game");
  }, [open]);

  if (!open) return null;

  const currentTab = creditsTabs.find(([id]) => id === activeSection) ?? creditsTabs[0];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "template":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Template Defaults</h3>
              <p>Start, settings, pause, level complete, game over, level select, credits, save tools, PWA install, offline cache, and update prompts.</p>
            </article>
            <article className="credits-card">
              <h3>Reusable Shell</h3>
              <p>This screen stays ready for future game credits without making the menu scroll.</p>
            </article>
          </div>
        );
      case "audio":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Audio</h3>
              <p>Generated title music and gameplay sound effects are wired through the local AudioManager.</p>
            </article>
            <article className="credits-card">
              <h3>Sound Slots</h3>
              <p>Replace or expand these notes with final music, SFX, and license credits before shipping a new game.</p>
            </article>
          </div>
        );
      case "engine":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Engine</h3>
              <p>React, Vite, Three.js, browser storage, and a service worker form the current web game shell.</p>
            </article>
            <article className="credits-card">
              <h3>Browser Game</h3>
              <p>The UI is DOM-based over the 3D scene so menus stay readable and quick to adjust.</p>
            </article>
          </div>
        );
      case "attribution":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Attribution Slots</h3>
              <p>Replace this section with final art, music, SFX, font, model, and license credits before shipping a new game.</p>
            </article>
            <article className="credits-card">
              <h3>Project Notes</h3>
              <p>Keep third-party asset names, license links, and creator credits here when final assets are chosen.</p>
            </article>
          </div>
        );
      case "build":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card credits-build-card">
              <h3>Version</h3>
              <p>{appVersion}</p>
            </article>
            <article className="credits-card credits-build-card">
              <h3>Build</h3>
              <p>{appBuildLabel}</p>
            </article>
          </div>
        );
      case "game":
      default:
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Game</h3>
              <p>Pink Elephant Jungle Dash is made with love for Georgia, by Uncle Jed.</p>
            </article>
            <article className="credits-card">
              <h3>About</h3>
              <p>A playful 3D jungle runner with fruit, hazards, handcrafted trails, touch controls, and a reusable web-game shell.</p>
            </article>
          </div>
        );
    }
  };

  return (
    <section className="game-modal-overlay pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6" aria-modal="true" role="dialog" aria-labelledby="credits-title">
      <div className="game-modal-card credits-modal">
        <div className="game-modal-header">
          <div>
            <div className="game-modal-kicker">Credits & About</div>
            <h2 id="credits-title" className="display-title game-modal-title">Pink Elephant Jungle Dash</h2>
            <p className="game-modal-copy">A reusable credits screen for game, template, music, SFX, art, engine, and license notes.</p>
          </div>
          <button type="button" onClick={onClose} className="jungle-focus-ring jungle-menu-button-secondary game-modal-close">Close</button>
        </div>

        <div className="credits-tab-list" role="tablist" aria-label="Credits sections">
          {creditsTabs.map(([id, label]) => {
            const selected = currentTab[0] === id;
            return (
              <button
                key={id}
                id={`credits-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`credits-panel-${id}`}
                onClick={() => setActiveSection(id)}
                className={`jungle-focus-ring credits-tab${selected ? " is-active" : ""}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          id={`credits-panel-${currentTab[0]}`}
          role="tabpanel"
          aria-labelledby={`credits-tab-${currentTab[0]}`}
          className="credits-active-panel"
        >
          {renderActiveSection()}
        </div>
      </div>
    </section>
  );
}
