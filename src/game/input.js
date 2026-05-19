// @ts-check

/**
 * @typedef {"ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Space" | "KeyW" | "KeyA" | "KeyS" | "KeyD" | "KeyZ" | "KeyE" | "ShiftLeft" | "ShiftRight" | "Backquote" | "Escape" | "KeyP" | "KeyM"} InputCode
 */

/**
 * @typedef {Record<InputCode, boolean>} PressedKeys
 */

/**
 * Keyboard state consumed by gameplay systems. Arrow keys include virtual WASD mappings; Space is reserved for jump and hold-slide.
 *
 * @typedef {PressedKeys & { __pressed: PressedKeys }} GameKeys
 */

/** @type {InputCode[]} */
const ALLOWED_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyZ",
  "KeyE",
  "ShiftLeft",
  "ShiftRight",
  "Backquote",
  "Escape",
  "KeyP",
  "KeyM",
];

/**
 * Mirror physical key presses to virtual gameplay controls.
 *
 * @param {GameKeys} keys
 * @returns {void}
 */
function syncVirtualControls(keys) {
  const pressed = keys.__pressed;
  keys.ArrowUp = Boolean(pressed.ArrowUp || pressed.KeyW);
  keys.ArrowDown = Boolean(pressed.ArrowDown || pressed.KeyS);
  keys.ArrowLeft = Boolean(pressed.ArrowLeft || pressed.KeyA);
  keys.ArrowRight = Boolean(pressed.ArrowRight || pressed.KeyD);
  keys.Space = Boolean(pressed.Space);
  keys.KeyZ = Boolean(pressed.KeyZ);
  keys.KeyE = Boolean(pressed.KeyE);
  keys.KeyW = Boolean(pressed.KeyW);
  keys.KeyA = Boolean(pressed.KeyA);
  keys.KeyS = Boolean(pressed.KeyS);
  keys.KeyD = Boolean(pressed.KeyD);
  keys.ShiftLeft = Boolean(pressed.ShiftLeft);
  keys.ShiftRight = Boolean(pressed.ShiftRight);
  keys.Backquote = Boolean(pressed.Backquote);
  keys.Escape = Boolean(pressed.Escape);
  keys.KeyP = Boolean(pressed.KeyP);
  keys.KeyM = Boolean(pressed.KeyM);
}

/**
 * Create the mutable key state object used by the app.
 *
 * @returns {GameKeys}
 */
export function createKeys() {
  /** @type {GameKeys} */
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyZ: false,
    KeyE: false,
    ShiftLeft: false,
    ShiftRight: false,
    Backquote: false,
    Escape: false,
    KeyP: false,
    KeyM: false,
    __pressed: /** @type {PressedKeys} */ (Object.fromEntries(ALLOWED_KEYS.map((code) => [code, false]))),
  };
  syncVirtualControls(keys);
  return keys;
}

/**
 * Update a physical key's pressed state and resync virtual controls.
 *
 * @param {GameKeys} keys
 * @param {string} code
 * @param {boolean} isPressed
 * @returns {GameKeys}
 */
export function setKeyState(keys, code, isPressed) {
  if (!isAllowedKey(code)) return keys;
  keys.__pressed[code] = isPressed;
  syncVirtualControls(keys);
  return keys;
}

/**
 * @param {string} code
 * @returns {code is InputCode}
 */
export function isAllowedKey(code) {
  return ALLOWED_KEYS.includes(/** @type {InputCode} */ (code));
}
