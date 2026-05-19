export const LOOP_LENGTH = 245;
export const COURSE_START_Z = 6;

export const LEVEL_SECTIONS = Object.freeze({
  FRUIT_GUIDE: "fruit guide",
  SWAY_TRAIL: "sway trail",
  JUMP_LOG: "jump log",
  HIGH_FRUIT: "high fruit",
  SLIDE_BRANCH: "slide branch",
  SMASH_CRATE: "smash crate",
  RIVER_CROC: "river/croc",
  HEALTH_RECOVERY: "health recovery",
  MONKEY: "monkey",
  PINEAPPLE: "pineapple",
});

export const LOOP_DIFFICULTIES = Object.freeze(["intro", "building", "advanced"]);

export function sectionDifficulty(loopIndex) {
  return LOOP_DIFFICULTIES[loopIndex] ?? "advanced";
}

export function sectionMetadata(section, difficulty, tutorialPrompt) {
  return Object.freeze({
    section,
    difficulty,
    ...(tutorialPrompt ? { tutorialPrompt } : {}),
  });
}

export const LOOP_PROMPT_PLANS = Object.freeze([
  Object.freeze({
    sectionLabel: "Learning Trail",
    prompts: Object.freeze([
      { localStart: 0, localEnd: 14, text: "Hold ↑ to build Elephant Charge.", cues: ["start"] },
      { localStart: 14, localEnd: 42, text: "Follow the golden fruit and feel the big pink rhythm.", cues: ["fruit"] },
      { localStart: 42, localEnd: 64, text: "Monkey patrol ahead — tap E for a Spin Attack.", cues: ["monkey"] },
      { localStart: 64, localEnd: 96, text: "Use ← → to sway through the jungle trail.", cues: ["fruit"] },
      { localStart: 96, localEnd: 116, text: "Tap Space to leap the log. Watch the shadow, not the ears.", cues: ["log"] },
      { localStart: 116, localEnd: 126, text: "Tap Space again in the air for a BIG Bounce.", cues: ["fruit"] },
      { localStart: 126, localEnd: 148, text: "Low vines ahead — hold Space now to Belly-Slide.", cues: ["branch"] },
      { localStart: 162, localEnd: 192, text: "Wooden crate ahead — press Z for a Trunk-Smash.", cues: ["crate"] },
      { localStart: 192, localEnd: 224, text: "Crocodile creek ahead. Stop, read the jaws, then charge.", cues: ["river"] },
      { localStart: 224, localEnd: 245, text: "Sugar cane restores energy after a jungle bump.", cues: ["health"] },
    ]),
  }),
  Object.freeze({
    sectionLabel: "Practice Grove",
    prompts: Object.freeze([
      { localStart: 0, localEnd: 42, text: "Practice Grove: build a braver Elephant Charge.", cues: ["start"] },
      { localStart: 42, localEnd: 64, text: "Monkey patrol returning — tap E to Spin Attack.", cues: ["monkey"] },
      { localStart: 64, localEnd: 96, text: "Sway through the fruit trail. Big feet, gentle steering.", cues: ["fruit"] },
      { localStart: 96, localEnd: 116, text: "Leap the log. Keep the shadow clear.", cues: ["log"] },
      { localStart: 116, localEnd: 126, text: "Reach the high fruit with a BIG Bounce.", cues: ["fruit"] },
      { localStart: 126, localEnd: 148, text: "Belly-Slide low before the branch.", cues: ["branch"] },
      { localStart: 162, localEnd: 192, text: "Trunk-Smash the crate with Z as it enters reach.", cues: ["crate"] },
      { localStart: 192, localEnd: 224, text: "Crocodile creek again. Stop, read, then stampede.", cues: ["river"] },
      { localStart: 224, localEnd: 245, text: "Sugar cane ahead. Gather your elephant energy.", cues: ["health"] },
    ]),
  }),
  Object.freeze({
    sectionLabel: "Stampede Hollow",
    prompts: Object.freeze([
      { localStart: 0, localEnd: 42, text: "Stampede Hollow: final loop, steer wide before hazards.", cues: ["start"] },
      { localStart: 42, localEnd: 64, text: "Fast monkey patrol — spin early, then recover your lane.", cues: ["monkey"] },
      { localStart: 64, localEnd: 96, text: "Wide fruit weave. Ease off charge if the path bends away.", cues: ["fruit"] },
      { localStart: 96, localEnd: 116, text: "Narrower log: jump from the center of your shadow.", cues: ["log"] },
      { localStart: 116, localEnd: 126, text: "BIG Bounce only if the high route is lined up.", cues: ["fruit"] },
      { localStart: 126, localEnd: 148, text: "Hold Space sooner: this branch lane is tighter.", cues: ["branch"] },
      { localStart: 162, localEnd: 192, text: "Crate cluster ahead — smash one, dodge the rest.", cues: ["crate"] },
      { localStart: 192, localEnd: 224, text: "Three crocodiles. Pause, pick a gap, then charge through.", cues: ["river"] },
      { localStart: 224, localEnd: 245, text: "Sugar cane on the exit line. Breathe before the gate.", cues: ["health"] },
    ]),
  }),
]);

export function promptPlanHasCue(plan, cue) {
  return plan.prompts.some((prompt) => prompt.cues.includes(cue));
}
