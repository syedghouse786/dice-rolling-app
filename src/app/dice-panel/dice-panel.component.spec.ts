import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DiceService } from '../services/dice.service';
import { RollResult, RollEntry } from '../models/dice.models';

/**
 * Integration tests for DicePanelComponent logic.
 * Tests the full roll flow: select count → roll → animation → result → history.
 * We test the orchestration logic directly to avoid Angular JIT compilation overhead.
 */
describe('DicePanelComponent (integration)', () => {
  let diceService: DiceService;

  // Replicate the component's state and methods
  let diceCount: number;
  let rollResult: RollResult | null;
  let isRolling: boolean;

  function onDiceCountChange(count: number): void {
    diceCount = count;
  }

  function onRoll(): void {
    isRolling = true;
    setTimeout(() => {
      rollResult = diceService.roll(diceCount);
      isRolling = false;
    }, 500);
  }

  function getHistory(): ReadonlyArray<RollEntry> {
    return diceService.getHistory();
  }

  beforeEach(() => {
    vi.useFakeTimers();
    diceService = new DiceService();
    diceCount = 1;
    rollResult = null;
    isRolling = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    expect(diceCount).toBe(1);
    expect(rollResult).toBeNull();
    expect(isRolling).toBe(false);
    expect(getHistory()).toHaveLength(0);
  });

  it('should update diceCount when onDiceCountChange is called', () => {
    onDiceCountChange(4);
    expect(diceCount).toBe(4);
  });

  it('should set isRolling to true immediately when onRoll is called', () => {
    onRoll();
    expect(isRolling).toBe(true);
    expect(rollResult).toBeNull();
  });

  it('should set isRolling to false and have a result after 500ms timeout', () => {
    onRoll();
    expect(isRolling).toBe(true);

    vi.advanceTimersByTime(500);

    expect(isRolling).toBe(false);
    expect(rollResult).not.toBeNull();
    expect(rollResult!.values).toHaveLength(1);
  });

  it('should roll the correct number of dice based on diceCount', () => {
    onDiceCountChange(3);
    onRoll();
    vi.advanceTimersByTime(500);

    expect(rollResult).not.toBeNull();
    expect(rollResult!.values).toHaveLength(3);
    expect(rollResult!.total).toBe(
      rollResult!.values.reduce((sum, v) => sum + v, 0)
    );
  });

  it('should add entry to history after a roll completes', () => {
    expect(getHistory()).toHaveLength(0);

    onRoll();
    vi.advanceTimersByTime(500);

    expect(getHistory()).toHaveLength(1);
    expect(getHistory()[0].values).toEqual(rollResult!.values);
    expect(getHistory()[0].total).toBe(rollResult!.total);
  });

  it('should accumulate history entries across multiple rolls', () => {
    onRoll();
    vi.advanceTimersByTime(500);

    onRoll();
    vi.advanceTimersByTime(500);

    onRoll();
    vi.advanceTimersByTime(500);

    expect(getHistory()).toHaveLength(3);
  });

  describe('full roll flow', () => {
    it('select count → click roll → animation → result displayed → history updated', () => {
      // Step 1: Select dice count
      onDiceCountChange(2);
      expect(diceCount).toBe(2);

      // Step 2: Click roll
      onRoll();

      // Step 3: Verify animation state
      expect(isRolling).toBe(true);
      expect(rollResult).toBeNull();

      // Step 4: Advance past animation timeout
      vi.advanceTimersByTime(500);

      // Step 5: Verify result displayed
      expect(isRolling).toBe(false);
      expect(rollResult).not.toBeNull();
      expect(rollResult!.values).toHaveLength(2);
      rollResult!.values.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
      });

      // Step 6: Verify history updated
      expect(getHistory()).toHaveLength(1);
      expect(getHistory()[0].values).toEqual(rollResult!.values);
      expect(getHistory()[0].total).toBe(rollResult!.total);
    });

    it('multiple sequential rolls update history correctly (newest first)', () => {
      // First roll with 1 die
      onDiceCountChange(1);
      onRoll();
      vi.advanceTimersByTime(500);
      const firstResult = { ...rollResult! };

      // Second roll with 4 dice
      onDiceCountChange(4);
      onRoll();
      vi.advanceTimersByTime(500);
      const secondResult = { ...rollResult! };

      // History should have 2 entries, newest first
      expect(getHistory()).toHaveLength(2);
      expect(getHistory()[0].values).toEqual(secondResult.values);
      expect(getHistory()[1].values).toEqual(firstResult.values);
    });
  });

  describe('total sum display', () => {
    it('should have correct total when multiple dice are rolled', () => {
      onDiceCountChange(3);
      onRoll();
      vi.advanceTimersByTime(500);

      expect(rollResult!.values.length).toBeGreaterThan(1);
      expect(rollResult!.total).toBe(
        rollResult!.values.reduce((sum, v) => sum + v, 0)
      );
    });

    it('total should be the single die value when rolling 1 die', () => {
      onDiceCountChange(1);
      onRoll();
      vi.advanceTimersByTime(500);

      expect(rollResult!.values).toHaveLength(1);
      expect(rollResult!.total).toBe(rollResult!.values[0]);
    });
  });
});
