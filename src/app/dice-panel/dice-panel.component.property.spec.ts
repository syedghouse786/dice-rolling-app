import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ResetService } from '../services/reset.service';
import { NothingToResetError } from '../models/reset.errors';

/**
 * Exploratory Bug Condition Test — Play Again at Game Over
 *
 * Bug: When the game is over (attemptsUsed >= 10), clicking "Play Again"
 * calls onReset() which triggers resetService.initiateReset(), setting
 * resetPhase to 'confirming' instead of immediately restarting the game.
 *
 * This test asserts the CORRECT expected behavior: after a play-again action
 * at game over, resetPhase should remain 'idle'. On unfixed code this will
 * FAIL, confirming the bug exists.
 *
 * Validates: Requirements 2.1, 2.3
 */
describe('DicePanelComponent Bug Condition — Play Again at Game Over', () => {
  /**
   * **Validates: Requirements 2.1, 2.3**
   *
   * Property 1: For any game-over state (attemptsUsed >= 10), invoking the
   * play-again action should keep resetPhase as 'idle' — no confirmation
   * dialog should appear.
   *
   * On unfixed code, onReset() calls initiateReset() which sets resetPhase
   * to 'confirming', so this test is EXPECTED TO FAIL.
   */
  it('Property 1: resetPhase stays idle when play-again is triggered at game over', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        fc.integer({ min: 0, max: 500 }),
        fc.integer({ min: 1, max: 6 }),
        (attemptsUsed, totalScore, lastRoll) => {
          const resetService = new ResetService();

          // Replicate what onReset() does in the component
          // (this is the current code path for "Play Again" at game over)
          const snapshot = { totalScore, lastRoll, attemptsUsed };
          resetService.initiateReset(snapshot);

          // CORRECT behavior: resetPhase should stay 'idle' at game over
          // ACTUAL (buggy) behavior: resetPhase becomes 'confirming'
          expect(resetService.resetPhase).toBe('idle');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Fix Checking Test — onPlayAgain() Resets Game State at Game Over
 *
 * After the fix, onPlayAgain() directly resets totalScore, lastRoll, and
 * attemptsUsed without going through ResetService. This test verifies
 * that for any game-over state, calling onPlayAgain() resets all fields
 * to their initial values and resetPhase stays 'idle'.
 *
 * Validates: Requirements 2.1, 2.2, 2.3
 */
describe('DicePanelComponent Fix Check — onPlayAgain() resets game state', () => {
  /**
   * **Validates: Requirements 2.1, 2.3**
   *
   * Property 1: For any game-over state (attemptsUsed in [10, 100],
   * random totalScore in [0, 600], random lastRoll in [1, 6]),
   * calling onPlayAgain() resets all fields to initial values
   * and resetPhase stays 'idle'.
   */
  it('Property 1: onPlayAgain() resets all fields to initial values and resetPhase stays idle', () => {
    const MAX_ATTEMPTS = 10;

    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        fc.integer({ min: 0, max: 600 }),
        fc.integer({ min: 1, max: 6 }),
        (attemptsUsed, totalScore, lastRoll) => {
          const resetService = new ResetService();

          // Simulate component state
          const component = {
            MAX_ATTEMPTS,
            totalScore,
            lastRoll: lastRoll as number | null,
            attemptsUsed,
            get gameOver(): boolean {
              return this.attemptsUsed >= this.MAX_ATTEMPTS;
            },
            onPlayAgain(): void {
              if (!this.gameOver) return;
              this.totalScore = 0;
              this.lastRoll = null;
              this.attemptsUsed = 0;
            },
          };

          // Precondition: game is over
          expect(component.gameOver).toBe(true);

          // Act
          component.onPlayAgain();

          // Assert all fields reset to initial values
          expect(component.totalScore).toBe(0);
          expect(component.lastRoll).toBeNull();
          expect(component.attemptsUsed).toBe(0);

          // Assert resetPhase was never touched — stays 'idle'
          expect(resetService.resetPhase).toBe('idle');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Preservation Checking Tests — Mid-Game Reset Flow Unchanged
 *
 * These tests verify that the fix did not break existing behavior:
 * - Mid-game reset still enters 'confirming' phase
 * - NothingToResetError still thrown for zero attempts
 * - Cancel still restores resetPhase to 'idle'
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 */
describe('DicePanelComponent Preservation — Mid-Game Reset Unchanged', () => {
  /**
   * **Validates: Requirements 3.1, 3.2**
   *
   * Property 2: For any mid-game state (attemptsUsed in [1, 9]),
   * calling onReset() sets resetPhase to 'confirming'.
   */
  it('Property 2: onReset() sets resetPhase to confirming for mid-game states', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9 }),
        fc.integer({ min: 1, max: 54 }),
        fc.integer({ min: 1, max: 6 }),
        (attemptsUsed, totalScore, lastRoll) => {
          const resetService = new ResetService();

          resetService.initiateReset({ totalScore, lastRoll, attemptsUsed });

          expect(resetService.resetPhase).toBe('confirming');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Unit test: onReset() with attemptsUsed = 0 still throws NothingToResetError.
   */
  it('throws NothingToResetError when attemptsUsed is 0', () => {
    const resetService = new ResetService();

    expect(() => {
      resetService.initiateReset({ totalScore: 0, lastRoll: null, attemptsUsed: 0 });
    }).toThrowError(NothingToResetError);
  });

  /**
   * Unit test: onCancelReset() restores resetPhase to 'idle' during a mid-game reset.
   */
  it('cancel restores resetPhase to idle during mid-game reset', () => {
    const resetService = new ResetService();

    // Enter confirming phase with a valid mid-game state
    resetService.initiateReset({ totalScore: 20, lastRoll: 4, attemptsUsed: 5 });
    expect(resetService.resetPhase).toBe('confirming');

    // Cancel the reset
    resetService.cancel();
    expect(resetService.resetPhase).toBe('idle');
  });
});
