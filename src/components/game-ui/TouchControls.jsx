import React, { useCallback, useEffect, useRef, useState } from "react";

const JOYSTICK_ZERO = Object.freeze({ x: 0, y: 0, strength: 0 });

const RIGHT_CLUSTER_BUTTONS = [
  { code: "Space", label: "Jump", icon: "JUMP", hint: "Hold Slide" },
  { code: "KeyF", label: "SmashSlide", displayLabel: "Smash", icon: "HIT", hint: "Tap" },
];

const BUTTON_LABELS = {
  Jump: "Jump, double jump, or hold to slide",
  SmashSlide: "Smash",
};

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundJoystickValue(value) {
  return Number(value.toFixed(3));
}

function isTouchPointer(event) {
  return !event.pointerType || event.pointerType === "touch" || event.pointerType === "pen";
}

export function TouchControls({
  visible,
  disabled,
  interactionLocked = false,
  onControlChange,
  onJoystickChange = () => {},
}) {
  const controlsRef = useRef(null);
  const joystickRef = useRef(null);
  const joystickPointerRef = useRef(null);
  const joystickOriginRef = useRef({ x: 0, y: 0 });
  const activePointersByCodeRef = useRef(new Map());
  const [joystickActive, setJoystickActive] = useState(false);

  const publishJoystickValues = useCallback((nextValues) => {
    const values = {
      x: roundJoystickValue(clampNumber(nextValues.x, -1, 1)),
      y: roundJoystickValue(clampNumber(nextValues.y, -1, 1)),
      strength: roundJoystickValue(clampNumber(nextValues.strength, 0, 1)),
    };
    const controls = controlsRef.current;
    if (controls) {
      controls.dataset.joystickX = String(values.x);
      controls.dataset.joystickY = String(values.y);
      controls.dataset.joystickStrength = String(values.strength);
    }
    onJoystickChange(values);
  }, [onJoystickChange]);

  const resetJoystickVisual = useCallback(() => {
    const joystick = joystickRef.current;
    if (!joystick) return;
    joystick.style.setProperty("--joystick-nub-x", "0px");
    joystick.style.setProperty("--joystick-nub-y", "0px");
    joystick.style.setProperty("--joystick-glow-x", "0%");
    joystick.style.setProperty("--joystick-glow-y", "0%");
    joystick.style.setProperty("--joystick-strength", "0");
  }, []);

  const releaseJoystick = useCallback((event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.currentTarget?.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
    joystickPointerRef.current = null;
    setJoystickActive(false);
    resetJoystickVisual();
    publishJoystickValues(JOYSTICK_ZERO);
  }, [publishJoystickValues, resetJoystickVisual]);

  const updateJoystickFromPointer = useCallback((event) => {
    if (disabled || interactionLocked) return;
    if (joystickPointerRef.current !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();

    const joystick = joystickRef.current;
    const outerSize = joystick?.getBoundingClientRect().width || 140;
    const maxDistance = clampNumber(outerSize * 0.4, 45, 60);
    const deadZone = clampNumber(outerSize * 0.11, 10, 18);
    const dx = event.clientX - joystickOriginRef.current.x;
    const dy = event.clientY - joystickOriginRef.current.y;
    const distance = Math.hypot(dx, dy);
    const angleX = distance > 0 ? dx / distance : 0;
    const angleY = distance > 0 ? dy / distance : 0;
    const visualDistance = Math.min(distance, maxDistance);
    const visualX = angleX * visualDistance;
    const visualY = angleY * visualDistance;
    const movementStrength = distance <= deadZone
      ? 0
      : clampNumber((visualDistance - deadZone) / (maxDistance - deadZone), 0, 1);

    if (joystick) {
      joystick.style.setProperty("--joystick-nub-x", `${visualX.toFixed(1)}px`);
      joystick.style.setProperty("--joystick-nub-y", `${visualY.toFixed(1)}px`);
      joystick.style.setProperty("--joystick-glow-x", `${(angleX * movementStrength * 36).toFixed(1)}%`);
      joystick.style.setProperty("--joystick-glow-y", `${(angleY * movementStrength * 36).toFixed(1)}%`);
      joystick.style.setProperty("--joystick-strength", String(movementStrength.toFixed(3)));
    }

    publishJoystickValues({
      x: movementStrength > 0 ? angleX * movementStrength : 0,
      y: movementStrength > 0 ? angleY * movementStrength : 0,
      strength: movementStrength,
    });
  }, [disabled, interactionLocked, publishJoystickValues]);

  const handleJoystickPointerDown = (event) => {
    if (disabled || interactionLocked || !isTouchPointer(event)) return;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    if (event.clientX > viewportWidth / 2) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    joystickPointerRef.current = event.pointerId;

    const joystick = joystickRef.current;
    const joystickRect = joystick?.getBoundingClientRect();
    joystickOriginRef.current = joystickRect
      ? { x: joystickRect.left + joystickRect.width / 2, y: joystickRect.top + joystickRect.height / 2 }
      : { x: event.clientX, y: event.clientY };

    setJoystickActive(true);
    updateJoystickFromPointer(event);
  };

  const releaseAll = useCallback(() => {
    for (const [code] of activePointersByCodeRef.current.entries()) {
      onControlChange(code, false);
    }
    activePointersByCodeRef.current.clear();
    releaseJoystick();
  }, [onControlChange, releaseJoystick]);

  useEffect(() => {
    if (disabled || interactionLocked || !visible) releaseAll();
  }, [disabled, interactionLocked, releaseAll, visible]);

  useEffect(() => () => releaseAll(), [releaseAll]);

  const addPointerPress = (code, pointerId) => {
    if (disabled || interactionLocked) return;
    const activePointers = activePointersByCodeRef.current.get(code) ?? new Set();
    activePointers.add(pointerId);
    activePointersByCodeRef.current.set(code, activePointers);
    onControlChange(code, true);
  };

  const removePointerPress = (code, pointerId) => {
    const activePointers = activePointersByCodeRef.current.get(code);
    if (!activePointers) return;
    activePointers.delete(pointerId);
    if (activePointers.size === 0) {
      activePointersByCodeRef.current.delete(code);
      onControlChange(code, false);
    }
  };

  const handlePointerDown = (event, code) => {
    if (disabled || interactionLocked) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    addPointerPress(code, event.pointerId);
  };

  const handlePointerUp = (event, code) => {
    if (interactionLocked) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    removePointerPress(code, event.pointerId);
  };

  const handlePointerCancel = (event, code) => {
    if (interactionLocked) return;
    event.preventDefault();
    event.stopPropagation();
    removePointerPress(code, event.pointerId);
  };

  const pressStart = (event, code) => {
    event.currentTarget.dataset.pressed = "true";
    handlePointerDown(event, code);
  };

  const pressEnd = (event, code) => {
    event.currentTarget.dataset.pressed = "false";
    handlePointerUp(event, code);
  };

  const pressCancel = (event, code) => {
    event.currentTarget.dataset.pressed = "false";
    handlePointerCancel(event, code);
  };

  if (!visible) return null;

  return (
    <div
      ref={controlsRef}
      className="touch-controls mobile-controls"
      aria-label="Touch game controls"
      data-interaction-locked={interactionLocked ? "true" : "false"}
      data-joystick-active={joystickActive ? "true" : "false"}
      data-joystick-x="0"
      data-joystick-y="0"
      data-joystick-strength="0"
    >
      <div
        className="mobile-joystick-touch-zone"
        aria-label="Movement joystick touch area"
        onContextMenu={(event) => event.preventDefault()}
        onPointerDown={handleJoystickPointerDown}
        onPointerMove={updateJoystickFromPointer}
        onPointerUp={releaseJoystick}
        onPointerCancel={releaseJoystick}
        onPointerLeave={(event) => {
          if (joystickPointerRef.current === event.pointerId) releaseJoystick(event);
        }}
      />
      <div
        id="mobileJoystick"
        ref={joystickRef}
        className={`mobile-joystick${joystickActive ? " active" : ""}`}
        aria-hidden="true"
      >
        <div className="joystick-direction-glow" />
        <div id="joystickNub" className="joystick-nub" />
      </div>
      <div className="mobile-right-cluster" aria-label="Action controls">
        {RIGHT_CLUSTER_BUTTONS.map(({ code, label, displayLabel, icon, hint }) => (
          <div key={`${code}-${label}`} className={`touch-control-hitbox touch-control-hitbox-${label.toLowerCase()}`}>
            <button
              type="button"
              className={`touch-control-button touch-control-${label.toLowerCase()}`}
              data-pressed="false"
              aria-label={BUTTON_LABELS[label]}
              title={BUTTON_LABELS[label]}
              disabled={disabled}
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={(event) => pressStart(event, code)}
              onPointerUp={(event) => pressEnd(event, code)}
              onPointerCancel={(event) => pressCancel(event, code)}
              onPointerLeave={(event) => pressCancel(event, code)}
            >
              <span className="touch-control-icon" aria-hidden="true">{icon}</span>
              <span className="touch-control-label">{displayLabel ?? label}</span>
              <span className="touch-control-hint">{hint}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
