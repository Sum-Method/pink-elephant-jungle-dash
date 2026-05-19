import { CONFIG, MOVEMENT } from "./config.js";
import { trackCenter } from "./track.js";

export function createPlayerBody(overrides = {}) {
  return {
    localX: 0,
    x: trackCenter(CONFIG.startZ),
    y: CONFIG.playerSize / 2,
    z: CONFIG.startZ,
    speed: 0,
    yVelocity: 0,
    coyoteTimer: MOVEMENT.coyoteTime,
    jumpBufferTimer: 0,
    grounded: true,
    jumpHeld: false,
    doubleUsed: false,
    spaceHeldTimer: 0,
    spaceActionResolved: false,
    bufferedSlide: false,
    slideTimer: 0,
    hurtTimer: 0,
    smashTimer: 0,
    smashActionTimer: 0,
    spinTimer: 0,
    yaw: 0,
    health: 100,
    lives: 5,
    fruit: 0,
    fruitLifeCounter: 0,
    crates: 0,
    score: 0,
    multiplier: 1,
    multiplierCombo: 0,
    multiplierTimer: 0,
    state: "Ready",
    completed: false,
    lastPrompt: "",
    ...overrides,
  };
}

export {
  getPlayerInputIntent,
  startDoubleJump,
  startGroundJump,
  startPlayerSlide,
  tickPlayerTimers,
  triggerJumpOrDoubleJump,
  updateJumpAndSlideInput,
  updatePlayerAir,
  updatePlayerSpeed,
  updatePlayerSteering,
} from "./movement.js";

export function triggerPlayerSmash(body, playing) {
  if (!playing || body.smashActionTimer > 0) return false;
  body.smashActionTimer = MOVEMENT.smashActionDuration;
  body.smashTimer = Math.max(body.smashTimer, MOVEMENT.smashFeedbackDuration);
  return true;
}

export function triggerPlayerSpin(body, playing) {
  if (!playing || body.spinTimer > 0) return false;
  body.spinTimer = MOVEMENT.spinDuration;
  return true;
}

export function selectPlayerStateLabel(body, charge) {
  if (body.completed) return "Jungle Gate";
  if (body.lives <= 0) return "Herd Resting";
  if (body.hurtTimer > 0) return "Jungle Bump";
  if (body.spinTimer > 0) return "Spin Attack";
  if (body.smashTimer > 0) return "Trunk-Smash";
  if (body.slideTimer > 0) return "Belly-Slide";
  if (!body.grounded) return body.doubleUsed ? "BIG Bounce" : "Leap";
  if (charge > MOVEMENT.mightyChargeThreshold) return "Mighty Charge";
  if (body.speed > MOVEMENT.movingStateMinSpeed) return "Charging";
  return "Ready";
}
