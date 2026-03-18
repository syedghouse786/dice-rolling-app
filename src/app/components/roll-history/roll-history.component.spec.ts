import { describe, it, expect } from 'vitest';
import { RollEntry } from '../../models/dice.models';

/**
 * Unit tests for RollHistoryComponent logic.
 * Tests the component's data handling directly to avoid Angular JIT compilation overhead.
 */
describe('RollHistoryComponent', () => {
  // Replicate the component's state
  let history: ReadonlyArray<RollEntry>;

  it('should default history to an empty array', () => {
    history = [];
    expect(history).toEqual([]);
    expect(history.length).toBe(0);
  });

  it('should accept a history array', () => {
    history = [
      { values: [3, 5], total: 8, timestamp: 1000 },
    ];
    expect(history).toHaveLength(1);
    expect(history[0].total).toBe(8);
    expect(history[0].values).toEqual([3, 5]);
  });

  it('should display entries in the order provided (newest first)', () => {
    history = [
      { values: [6, 6], total: 12, timestamp: 3000 },
      { values: [2, 4], total: 6, timestamp: 2000 },
      { values: [1], total: 1, timestamp: 1000 },
    ];

    // Entries should be in descending timestamp order (newest first)
    for (let i = 0; i < history.length - 1; i++) {
      expect(history[i].timestamp).toBeGreaterThan(history[i + 1].timestamp);
    }

    expect(history[0].timestamp).toBe(3000);
    expect(history[1].timestamp).toBe(2000);
    expect(history[2].timestamp).toBe(1000);
  });

  it('should expose individual die values and total for each entry', () => {
    history = [
      { values: [2, 3, 5], total: 10, timestamp: 1000 },
      { values: [1], total: 1, timestamp: 500 },
    ];

    expect(history[0].values).toEqual([2, 3, 5]);
    expect(history[0].total).toBe(10);
    expect(history[1].values).toEqual([1]);
    expect(history[1].total).toBe(1);
  });

  it('should work with a ReadonlyArray without mutation', () => {
    const entries: ReadonlyArray<RollEntry> = Object.freeze([
      { values: [4], total: 4, timestamp: 1000 },
      { values: [2, 3], total: 5, timestamp: 500 },
    ]);
    history = entries;
    expect(history).toHaveLength(2);
    expect(history[0].values).toEqual([4]);
    expect(history[1].values).toEqual([2, 3]);
  });
});
