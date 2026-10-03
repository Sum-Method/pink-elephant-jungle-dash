import React, { useEffect, useState } from "react";

const creditsTabs = [
  ["game", "Game"],
  ["controls", "Controls"],
  ["media", "Media"],
  ["technology", "Technology"],
  ["credits", "Credits"],
];

export function CreditsOverlay({ open, onClose }) {
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
      case "controls":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Choose your controls</h3>
              <p>Play with keyboard, touch controls, or a connected gamepad. Open Settings for the full control mapping and accessibility options.</p>
            </article>
            <article className="credits-card">
              <h3>Made to be playable</h3>
              <p>Touch movement and action buttons stay within reach on phones and tablets. Keyboard and gamepad play remain supported.</p>
            </article>
          </div>
        );
      case "media":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Cut scenes</h3>
              <p>The opening, blue butterfly reward, and finale videos were generated with Google Gemini.</p>
            </article>
            <article className="credits-card">
              <h3>Snake Gate model</h3>
              <p>Created with Microsoft Copilot image-to-3D experiments using reference images generated with ChatGPT.</p>
            </article>
          </div>
        );
      case "technology":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Built for the browser</h3>
              <p>React, Vite, and Three.js power the menus and real-time 3D trail.</p>
            </article>
            <article className="credits-card">
              <h3>Sound and saves</h3>
              <p>The score and sound effects are synthesized with the Web Audio API. Browser storage and a service worker support saved progress and offline play.</p>
            </article>
          </div>
        );
      case "credits":
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Made with love</h3>
              <p>Created by Jed / Sum Method for Georgia.</p>
            </article>
            <article className="credits-card">
              <h3>Reuse and attribution</h3>
              <p>Code and media have separate reuse terms. See the project’s license and media notes for details.</p>
            </article>
          </div>
        );
      case "game":
      default:
        return (
          <div className="credits-panel-grid credits-panel-grid-two">
            <article className="credits-card">
              <h3>Game</h3>
              <p>Created by Jed / Sum Method. Made with love for Georgia.</p>
            </article>
            <article className="credits-card">
              <h3>About</h3>
              <p>A colorful three-level adventure with fruit to gather, hazards to outsmart, and a jungle trail to explore.</p>
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
            <p className="game-modal-copy">A three-level browser runner created by Jed / Sum Method for Georgia.</p>
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
