export const NOTES = ["D2", "A3", "F4", "C4", "F2", "G3", "A4", "G3", "G2", "D4", "G4", "A3"];

const NOTE_OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function noteToFrequency(note) {
  const name = note.slice(0, 1);
  const octave = Number(note.slice(1));
  const midi = 12 * (octave + 1) + (NOTE_OFFSETS[name] ?? 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
}
