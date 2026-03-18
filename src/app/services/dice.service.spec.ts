import { describe, it, expect, beforeEach } from 'vitest';
import { DiceService } from './dice.service';

describe('DiceService', () => {
  let service: DiceService;

  beforeEach(() => {
    service = new DiceService();
  });

  describe('roll()', () => {
    it('should return a result with 1 value when called with default count of 1', () => {
      const result = service.roll(1);
      expect(result.values).toHaveLength(1);
      expect(result.values[0]).toBeGreaterThanOrEqual(1);
      expect(result.values[0]).toBeLessThanOrEqual(6);
    });

    it('should return values all in range [1,6]', () => {
      const result = service.roll(4);
      expect(result.values).toHaveLength(4);
      result.values.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
      });
    });

    it('should compute total as sum of values', () => {
      const result = service.roll(3);
      const expectedTotal = result.values.reduce((sum, v) => sum + v, 0);
      expect(result.total).toBe(expectedTotal);
    });

    it('should clamp count below 1 to 1', () => {
      const result = service.roll(0);
      expect(result.values).toHaveLength(1);
    });

    it('should clamp negative count to 1', () => {
      const result = service.roll(-5);
      expect(result.values).toHaveLength(1);
    });

    it('should clamp count above 6 to 6', () => {
      const result = service.roll(10);
      expect(result.values).toHaveLength(6);
    });

    it('should floor fractional count values', () => {
      const result = service.roll(3.7);
      expect(result.values).toHaveLength(3);
    });
  });

  describe('getHistory()', () => {
    it('should return empty history initially', () => {
      expect(service.getHistory()).toHaveLength(0);
    });

    it('should add entry to history after a roll', () => {
      const result = service.roll(2);
      const history = service.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].values).toEqual(result.values);
      expect(history[0].total).toBe(result.total);
    });

    it('should store entries in reverse chronological order (newest first)', () => {
      service.roll(1);
      service.roll(2);
      service.roll(3);
      const history = service.getHistory();
      expect(history).toHaveLength(3);
      expect(history[0].values).toHaveLength(3);
      expect(history[1].values).toHaveLength(2);
      expect(history[2].values).toHaveLength(1);
    });

    it('should not exceed 20 entries', () => {
      for (let i = 0; i < 25; i++) {
        service.roll(1);
      }
      expect(service.getHistory()).toHaveLength(20);
    });

    it('should remove oldest entry when at capacity and new roll is added', () => {
      // Fill history to capacity
      for (let i = 0; i < 20; i++) {
        service.roll(1);
      }
      const historyBefore = service.getHistory();
      const oldestBefore = historyBefore[19];

      // Add one more
      service.roll(6);
      const historyAfter = service.getHistory();
      expect(historyAfter).toHaveLength(20);
      expect(historyAfter[0].values).toHaveLength(6);
      // The oldest entry from before should no longer be present
      expect(historyAfter).not.toContain(oldestBefore);
    });
  });
});
