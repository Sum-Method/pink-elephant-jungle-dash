import { SCORING } from "./config.js";

export function applyFruitLifeCounter(currentCounter, amount, threshold = SCORING.fruitLifeThreshold) {
  const nextTotal = Math.max(0, currentCounter) + Math.max(0, amount);
  const livesAwarded = Math.floor(nextTotal / threshold);
  return {
    counter: nextTotal % threshold,
    livesAwarded,
  };
}

export function applyComboScore(state, basePoints, comboWindowSeconds = SCORING.comboWindowSeconds) {
  const multiplier = Math.max(1, state?.multiplier ?? 1);
  const multiplierCombo = Math.max(0, state?.multiplierCombo ?? 0) + 1;
  const pointsAwarded = Math.max(0, basePoints) * multiplier;

  return {
    score: Math.max(0, state?.score ?? 0) + pointsAwarded,
    multiplierCombo,
    multiplierTimer: Math.max(state?.multiplierTimer ?? 0, comboWindowSeconds),
    multiplier: Math.min(SCORING.maxMultiplier, 1 + Math.floor(multiplierCombo / SCORING.comboPerMultiplier)),
    pointsAwarded,
  };
}
