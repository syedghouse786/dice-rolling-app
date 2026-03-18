import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DiceSelectorComponent } from './dice-selector.component';

describe('DiceSelectorComponent', () => {
  let component: DiceSelectorComponent;

  beforeEach(() => {
    component = new DiceSelectorComponent();
  });

  it('should default selectedCount to 1', () => {
    expect(component.selectedCount).toBe(1);
  });

  it('should have options [1, 2, 3, 4, 5, 6]', () => {
    expect(component.options).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should emit countChange when selectCount is called', () => {
    const emitSpy = vi.spyOn(component.countChange, 'emit');
    component.selectCount(3);
    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should update selectedCount when selectCount is called', () => {
    component.selectCount(4);
    expect(component.selectedCount).toBe(4);
  });

  it('should emit the correct value for each option', () => {
    const emitSpy = vi.spyOn(component.countChange, 'emit');
    for (const option of component.options) {
      component.selectCount(option);
      expect(emitSpy).toHaveBeenCalledWith(option);
    }
    expect(emitSpy).toHaveBeenCalledTimes(6);
  });
});
