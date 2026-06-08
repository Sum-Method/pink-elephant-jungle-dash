import { CONFIG, MOVEMENT } from "./config.js";
import { clamp, lerp } from "./math.js";
import { trackAngle } from "./track.js";

export function tickPlayerTimers(body, dt) {
  body.hurtTimer = Math.max(0, body.hurtTimer - dt);
  body.smashTimer = Math.max(0, body.smashTimer - dt);
  body.smashActionTimer = Math.max(0, body.smashActionTimer - dt);
  body.slideTimer = Math.max(0, body.slideTimer - dt);
  body.jumpBufferTimer = Math.max(0, body.jumpBufferTimer - dt);
  body.spinTimer = Math.max(0, body.spinTimer - dt);
  body.autoChargeTimer = Math.max(0, body.autoChargeTimer - dt);
  body.multiplierTimer = Math.max(0, body.multiplierTimer - dt);
  if (body.multiplierTimer <= 0 && body.multiplier > 1) {
    body.multiplier = 1;
    body.multiplierCombo = 0;
  }
  if (body.grounded) body.coyoteTimer = MOVEMENT.coyoteTime;
  else body.coyoteTimer = Math.max(0, body.coyoteTimer - dt);
  return body;
}

function joystickAxis(joystick, axis) {
  if (!joystick || joystick.strength <= 0) return 0;
  return clamp(Number(joystick[axis] ?? 0), -1, 1);
}

export function getPlayerInputIntent(body, keys, playing, joystick = null) {
  const joystickY = joystickAxis(joystick, "y");
  const joystickForwardStrength = Math.max(0, -joystickY);
  const joystickReverseStrength = Math.max(0, joystickY);
  const wantsReverse = playing && body.grounded && (keys.ArrowDown || joystickReverseStrength > 0);
  const hasStartAssist = body.autoChargeTimer > 0;
  const forwardStrength = keys.ArrowUp || hasStartAssist ? 1 : joystickForwardStrength;
  const reverseStrength = keys.ArrowDown ? 1 : joystickReverseStrength;
  const wantsForward = playing && forwardStrength > 0 && !wantsReverse;
  return { wantsReverse, wantsForward, forwardStrength, reverseStrength };
}

export function updatePlayerSpeed(body, dt, playing, intent, speedConfig = MOVEMENT) {
  if (playing && (body.hurtTimer === 0 || intent.wantsReverse)) {
    if (intent.wantsForward) {
      const strength = clamp(intent.forwardStrength ?? 1, 0, 1);
      body.speed = Math.min(speedConfig.maxSpeed, body.speed + speedConfig.acceleration * strength * dt);
    } else if (intent.wantsReverse) {
      const strength = clamp(intent.reverseStrength ?? 1, 0, 1);
      body.speed = Math.max(-speedConfig.reverseMaxSpeed, body.speed - speedConfig.reverseAcceleration * strength * dt);
    } else {
      body.speed *= Math.exp(-speedConfig.friction * dt);
      const idleStep = speedConfig.idleDeceleration * dt;
      body.speed = Math.abs(body.speed) <= idleStep ? 0 : body.speed - Math.sign(body.speed) * idleStep;
    }
    if (Math.abs(body.speed) < speedConfig.minSpeed) body.speed = 0;
  } else if (playing) {
    body.speed *= Math.exp(-speedConfig.friction * dt);
    if (Math.abs(body.speed) < speedConfig.minSpeed) body.speed = 0;
  } else {
    body.speed = 0;
  }
  return body.speed;
}

export function updatePlayerSteering(body, keys, dt, playing, z, joystick = null) {
  let nextLocalX = body.localX;
  if (playing && body.hurtTimer === 0) {
    const joystickX = joystickAxis(joystick, "x");
    const steer = Math.abs(joystickX) > 0 ? joystickX : (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    nextLocalX = clamp(nextLocalX + steer * MOVEMENT.steerSpeed * dt, -CONFIG.corridorHalfWidth, CONFIG.corridorHalfWidth);
    body.yaw = lerp(body.yaw, steer * MOVEMENT.steeringYawLean + trackAngle(z), 1 - Math.exp(-MOVEMENT.turnDamping * dt));
  }
  return nextLocalX;
}

export function startPlayerSlide(body) {
  if (body.slideTimer > 0 || body.speed <= MOVEMENT.slideStartMinSpeed) return false;
  body.slideTimer = MOVEMENT.slideDuration;
  body.bufferedSlide = false;
  return true;
}

export function startGroundJump(body) {
  body.yVelocity = MOVEMENT.jumpVelocity;
  body.grounded = false;
  body.coyoteTimer = 0;
  body.jumpBufferTimer = 0;
  body.doubleUsed = false;
  return "ground";
}

export function startDoubleJump(body) {
  body.yVelocity = MOVEMENT.doubleJumpVelocity;
  body.doubleUsed = true;
  body.jumpBufferTimer = 0;
  return "double";
}

export function triggerJumpOrDoubleJump(body, playing) {
  if (!playing || body.slideTimer > 0) return null;
  if (body.grounded || body.coyoteTimer > 0) return startGroundJump(body);
  if (!body.doubleUsed) return startDoubleJump(body);
  body.jumpBufferTimer = MOVEMENT.jumpBufferTime;
  return "buffered";
}

export function updateJumpAndSlideInput(body, keys, dt, playing) {
  const events = [];
  const spaceDown = keys.Space;
  const spaceJustReleased = !spaceDown && body.jumpHeld;

  if (spaceDown && !body.jumpHeld) {
    body.spaceHeldTimer = 0;
    body.spaceActionResolved = false;
    body.bufferedSlide = false;
  }
  if (spaceDown && !body.spaceActionResolved && playing) {
    body.spaceHeldTimer += dt;
    if (body.spaceHeldTimer >= MOVEMENT.slideHoldThreshold) {
      body.spaceActionResolved = true;
      if (body.grounded) {
        if (startPlayerSlide(body)) events.push("slide");
      } else {
        body.bufferedSlide = true;
        events.push("slide-buffered");
      }
    }
  }
  if (spaceJustReleased && !body.spaceActionResolved) {
    events.push(triggerJumpOrDoubleJump(body, playing));
    body.spaceActionResolved = true;
  }

  body.jumpHeld = spaceDown;
  if (playing && body.bufferedSlide && body.grounded) {
    if (startPlayerSlide(body)) events.push("slide");
  }
  return events.filter(Boolean);
}

export function updatePlayerAir(body, y, dt) {
  if (body.grounded) return { y, landed: false, bufferedJump: false };

  const gravityMultiplier = body.yVelocity < 0 ? MOVEMENT.fallGravityMultiplier : 1;
  body.yVelocity += MOVEMENT.gravity * gravityMultiplier * dt;
  let nextY = y + body.yVelocity * dt;
  const groundY = CONFIG.playerSize / 2;
  let landed = false;
  let bufferedJump = false;

  if (nextY <= groundY) {
    nextY = groundY;
    body.yVelocity = 0;
    body.grounded = true;
    body.coyoteTimer = MOVEMENT.coyoteTime;
    body.doubleUsed = false;
    landed = true;
    if (body.jumpBufferTimer > 0 && body.slideTimer <= 0) {
      startGroundJump(body);
      nextY = body.y;
      bufferedJump = true;
    }
  }

  return { y: nextY, landed, bufferedJump };
}
