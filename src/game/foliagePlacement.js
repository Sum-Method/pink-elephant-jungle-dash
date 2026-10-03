export function getFoliageCenterOffset(safeHalfWidth, halfWidth, clearance = 0.85) {
  return Math.max(0, safeHalfWidth) + Math.max(0, halfWidth) + Math.max(0, clearance);
}
