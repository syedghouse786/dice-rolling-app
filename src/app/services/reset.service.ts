import { Injectable } from '@angular/core';
import { Observable, Subject, timer, of } from 'rxjs';
import { take, map, takeUntil, finalize, delay } from 'rxjs/operators';
import { GameSnapshot, ResetPhase } from '../models/reset.models';
import { NothingToResetError, CorruptedSnapshotError } from '../models/reset.errors';

@Injectable({ providedIn: 'root' })
export class ResetService {
  resetPhase: ResetPhase = 'idle';
  countdown$: Observable<number> | null = null;
  error: string | null = null;

  private snapshot: GameSnapshot | null = null;
  private cancel$ = new Subject<void>();

  initiateReset(state: GameSnapshot): void {
    if (state.attemptsUsed === 0) {
      throw new NothingToResetError();
    }
    this.snapshot = { ...state };
    this.resetPhase = 'confirming';
    this.error = null;
  }

  confirmReset(): void {
    this.resetPhase = 'countdown';
    this.countdown$ = timer(0, 1000).pipe(
      take(6),
      map(i => 5 - i),
      takeUntil(this.cancel$),
      finalize(() => {
        if (this.resetPhase === 'countdown') {
          // Countdown completed naturally — reset is permanent
          this.snapshot = null;
          this.countdown$ = null;
          this.resetPhase = 'idle';
        }
      })
    );
  }

  undo(): Observable<GameSnapshot> {
    if (!this.snapshot) {
      throw new CorruptedSnapshotError();
    }
    // Grab snapshot and set phase BEFORE cancelling countdown
    // so finalize() sees 'restoring' and doesn't wipe the snapshot
    const restored = { ...this.snapshot };
    this.snapshot = null;
    this.resetPhase = 'restoring';
    this.cancel$.next();
    this.countdown$ = null;

    return of(restored).pipe(
      delay(300),
      finalize(() => {
        this.resetPhase = 'idle';
      })
    );
  }

  cancel(): void {
    this.cancel$.next();
    this.snapshot = null;
    this.countdown$ = null;
    this.resetPhase = 'idle';
  }
}
