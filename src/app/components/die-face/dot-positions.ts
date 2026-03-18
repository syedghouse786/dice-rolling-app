/**
 * Dot-position mapping for die values 1–6.
 * Each key maps to an array of grid cell positions (1-9) in a 3×3 grid.
 */
export const DOT_POSITIONS: Record<number, number[]> = {
  1: [5],
  2: [3, 7],
  3: [3, 5, 7],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};
