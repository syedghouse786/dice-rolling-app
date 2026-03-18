import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { DiceService } from './dice.service';

describe('DiceService Property Tests', () => {
  let service: DiceService;

  beforeEach(() => {
    service = new DiceService();
  });

  /**
   * Feature: dice-rolling-app, Property 1: Roll output shape and range
   * For any dice count N in [1,6], roll(N) returns exactly N values, each in [1,6].
   * Validates: Requirements 1.1, 3.3
   */
  it('Property 1: roll(N) returns exactly N values, each in [1,6]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        (count) => {
          const result = service.roll(count);
          expect(result.values).toHaveLength(count);
          result.values.forEach(v => {
            expect(v).toBeGreaterThanOrEqual(1);
            expect(v).toBeLessThanOrEqual(6);
            expect(Number.isInteger(v)).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: dice-rolling-app, Property 2: Roll total is sum of individual values
   * For any roll result, total equals sum of values.
   * Validates: Requirements 3.4
   */
  it('Property 2: total equals sum of values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        (count) => {
          const result = service.roll(count);
          const expectedTotal = result.values.reduce((sum, v) => sum + v, 0);
          expect(result.total).toBe(expectedTotal);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: dice-rolling-app, Property 4: History captures each roll
   * For any roll performed, the newest entry in history matches the roll result.
   * Validates: Requirements 4.1
   */
  it('Property 4: history[0] matches the roll result (same values and total)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        (count) => {
          const result = service.roll(count);
          const history = service.getHistory();
          expect(history[0].values).toEqual(result.values);
          expect(history[0].total).toBe(result.total);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: dice-rolling-app, Property 5: History is in reverse chronological order
   * For any sequence of rolls, history timestamps are in strictly descending order.
   * Validates: Requirements 4.2
   */
  it('Property 5: history timestamps are in strictly descending order', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 6 }), { minLength: 1, maxLength: 25 }),
        (counts) => {
          const freshService = new DiceService();
          counts.forEach(c => freshService.roll(c));
          const history = freshService.getHistory();
          for (let i = 0; i < history.length - 1; i++) {
            expect(history[i].timestamp).toBeGreaterThanOrEqual(history[i + 1].timestamp);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: dice-rolling-app, Property 6: History never exceeds 20 entries
   * For any number of rolls performed, history.length <= 20.
   * Validates: Requirements 4.3, 4.4
   */
  it('Property 6: history length never exceeds 20', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 6 }), { minLength: 1, maxLength: 50 }),
        (counts) => {
          const freshService = new DiceService();
          counts.forEach(c => freshService.roll(c));
          expect(freshService.getHistory().length).toBeLessThanOrEqual(20);
        }
      ),
      { numRuns: 100 }
    );
  });
});
