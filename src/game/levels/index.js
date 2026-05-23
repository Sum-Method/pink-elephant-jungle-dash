import level1 from "./level1.js";
import level2 from "./level2.js";

// When adding Level 2, import `level2.js` and register it here.
export const LEVEL_REGISTRY = {
  [level1.id]: level1,
  [level2.id]: level2,
};

export function getLevelConfig(levelId) {
  return LEVEL_REGISTRY[levelId] ?? level1;
}
