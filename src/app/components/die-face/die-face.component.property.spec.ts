import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { DOT_POSITIONS } from './dot-positions';

describe('DieFaceComponent Property Tests', () => {
  /**
   * Feature: dice-rolling-app, Property 3: Dot pattern count matches die value
   * For any die value V in [1,6], the dot-position mapping for V should contain exactly V dot positions.
   * Validates: Requirements 2.1
   */
  it('Property 3: dot-position mapping for value V contains exactly V positions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        (value) => {
          const positions = DOT_POSITIONS[value];
          expect(positions).toBeDefined();
          expect(positions).toHaveLength(value);
        }
      ),
      { numRuns: 100 }
    );
  });
});
