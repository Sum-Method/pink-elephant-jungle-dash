import { COURSE_START_Z, LOOP_LENGTH, LOOP_PROMPT_PLANS } from "./levelPromptMetadata.js";

function loopPromptToWorldPrompt(loopIndex, prompt) {
  const loopStartZ = -loopIndex * LOOP_LENGTH;
  const promptStartZ = loopIndex === 0 && prompt.localStart === 0 ? COURSE_START_Z : loopStartZ - prompt.localStart;
  return Object.freeze({
    startZ: promptStartZ,
    endZ: loopStartZ - prompt.localEnd,
    text: prompt.text,
    cues: Object.freeze([...prompt.cues]),
  });
}

export const LEVEL_PROMPTS = Object.freeze([
  ...LOOP_PROMPT_PLANS.flatMap((loopPlan, loopIndex) => loopPlan.prompts.map((prompt) => loopPromptToWorldPrompt(loopIndex, prompt))),
  Object.freeze({
    startZ: -735,
    endZ: -760,
    text: "Final stretch. Trumpet proudly towards the Jungle Gate!",
    cues: Object.freeze(["finish"]),
  }),
]);

export function isZInPromptRange(z, prompt) {
  return z <= prompt.startZ && z > prompt.endZ;
}

export function promptForZ(z, prompts = LEVEL_PROMPTS) {
  return prompts.find((prompt) => isZInPromptRange(z, prompt))?.text || "";
}
