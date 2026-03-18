import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { RollButtonComponent } from './roll-button.component';

describe('RollButtonComponent Property Tests', () => {
  /**
   * Feature: dice-rolling-app, Property 7: Roll button disabled during animation
   * For any roll action, while the rolling state is active (isRolling === true),
   * the roll button should be disabled — clicking it should NOT emit the roll event.
   * Validates: Requirements 5.3
   */
  it('Property 7: when disabled is true, clicking the button does not emit roll event', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.integer({ min: 1, max: 10 }),
        (isDisabled, clickCount) => {
          const component = new RollButtonComponent();
          component.disabled = isDisabled;

          const emitSpy = vi.fn();
          component.roll.subscribe(emitSpy);

          for (let i = 0; i < clickCount; i++) {
            component.onClick();
          }

          if (isDisabled) {
            // When disabled (isRolling === true), no roll events should be emitted
            expect(emitSpy).not.toHaveBeenCalled();
          } else {
            // When enabled, every click should emit a roll event
            expect(emitSpy).toHaveBeenCalledTimes(clickCount);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
