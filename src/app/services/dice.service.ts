import { Injectable } from '@angular/core';
import { RollResult, RollEntry } from '../models/dice.models';

@Injectable({ providedIn: 'root' })
export class DiceService {
  private history: RollEntry[] = [];
  private readonly MAX_HISTORY = 20;

  roll(count: number): RollResult {
    const clampedCount = Math.max(1, Math.min(6, Math.floor(count)));
    const values = Array.from({ length: clampedCount }, () => this.randomDieValue());
    const total = values.reduce((sum, v) => sum + v, 0);
    const entry: RollEntry = { values, total, timestamp: Date.now() };
    this.addToHistory(entry);
    return { values, total };
  }

  getHistory(): ReadonlyArray<RollEntry> {
    return this.history;
  }

  private randomDieValue(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private addToHistory(entry: RollEntry): void {
    this.history = [entry, ...this.history].slice(0, this.MAX_HISTORY);
  }
}
