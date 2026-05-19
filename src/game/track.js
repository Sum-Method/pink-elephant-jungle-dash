// @ts-check

/**
 * @typedef {object} PathSection
 * @property {string} name
 * @property {number} start
 * @property {number} end
 * @property {number} from
 * @property {number} to
 */

/**
 * @typedef {object} WorldPosition
 * @property {number} x
 * @property {number} z
 */

/** @type {PathSection[]} */
const PATH_SECTIONS = [
  { name: "trailhead gentle bend", start: 0, end: 70, from: 0, to: 2.8 },
  { name: "sweeping jungle curve", start: 70, end: 150, from: 2.8, to: -6.6 },
  { name: "river approach turn", start: 150, end: 235, from: -6.6, to: 5.8 },
  { name: "canopy S bend", start: 235, end: 325, from: 5.8, to: -4.9 },
  { name: "wide grove sweep", start: 325, end: 420, from: -4.9, to: 6.9 },
  { name: "hollow left hander", start: 420, end: 520, from: 6.9, to: -6.8 },
  { name: "tight river approach", start: 520, end: 620, from: -6.8, to: 6.2 },
  { name: "final gate approach", start: 620, end: 760, from: 6.2, to: -2.4 },
  { name: "finish straightener", start: 760, end: 840, from: -2.4, to: 0 },
];

/**
 * @param {number} t
 * @returns {number}
 */
function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * @param {number} z
 * @returns {number}
 */
function pathProgress(z) {
  return Math.max(0, Math.abs(z));
}

/**
 * Get the world-space X centerline for a Z position on the course.
 *
 * @param {number} z
 * @returns {number}
 */
export function trackCenter(z) {
  const p = pathProgress(z);
  const section = PATH_SECTIONS.find(({ start, end }) => p >= start && p < end) ?? PATH_SECTIONS[PATH_SECTIONS.length - 1];
  const sectionT = smoothstep((p - section.start) / (section.end - section.start));
  const sectionCenter = section.from + (section.to - section.from) * sectionT;

  // A low-amplitude trail meander keeps long bends organic without creating sudden steering changes.
  const meander = Math.sin(p / 46) * 0.55 + Math.sin(p / 93 + 0.9) * 0.35;
  return sectionCenter + meander;
}

/**
 * @param {number} z
 * @returns {number}
 */
export function trackAngle(z) {
  return Math.atan2(trackCenter(z - 6) - trackCenter(z + 6), 12);
}

/**
 * Convert a local track X coordinate to world-space X at the given Z.
 *
 * @param {number} localX
 * @param {number} z
 * @returns {number}
 */
export function worldX(localX, z) {
  return trackCenter(z) + localX * Math.cos(trackAngle(z));
}

/**
 * Convert local track coordinates into a world-space position.
 *
 * @param {number} localX
 * @param {number} z
 * @returns {WorldPosition}
 */
export function worldPosition(localX, z) {
  return { x: worldX(localX, z), z };
}
