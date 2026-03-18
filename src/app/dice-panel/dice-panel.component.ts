import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RollButtonComponent } from '../components/roll-button/roll-button.component';
import { DieFaceComponent } from '../components/die-face/die-face.component';
import { ResetConfirmComponent } from '../components/reset-confirm/reset-confirm.component';
import { ResetService } from '../services/reset.service';
import { NothingToResetError } from '../models/reset.errors';

@Component({
  selector: 'app-dice-panel',
  standalone: true,
  imports: [CommonModule, RollButtonComponent, DieFaceComponent, ResetConfirmComponent],
  templateUrl: './dice-panel.component.html',
  styleUrls: ['./dice-panel.component.css'],
})
export class DicePanelComponent implements OnDestroy {
  readonly MAX_ATTEMPTS = 10;
  totalScore = 0;
  lastRoll: number | null = null;
  attemptsUsed = 0;
  isRolling = false;
  countdownValue: number | null = null;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    public resetService: ResetService,
  ) {}

  get gameOver(): boolean {
    return this.attemptsUsed >= this.MAX_ATTEMPTS;
  }

  onRoll(): void {
    if (this.gameOver || this.isRolling || this.resetService.resetPhase !== 'idle') return;
    this.isRolling = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.lastRoll = Math.floor(Math.random() * 6) + 1;
      this.totalScore += this.lastRoll;
      this.attemptsUsed++;
      this.isRolling = false;
      this.cdr.detectChanges();
    }, 500);
  }

  onReset(): void {
    try {
      this.resetService.initiateReset({
        totalScore: this.totalScore,
        lastRoll: this.lastRoll,
        attemptsUsed: this.attemptsUsed,
      });
    } catch (e) {
      if (e instanceof NothingToResetError) {
        this.showError(e.message);
      }
    }
  }

  onConfirmReset(): void {
    this.resetService.confirmReset();
    this.totalScore = 0;
    this.lastRoll = null;
    this.attemptsUsed = 0;

    if (this.resetService.countdown$) {
      this.resetService.countdown$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (val) => {
            this.countdownValue = val;
            this.cdr.detectChanges();
          },
          complete: () => {
            this.countdownValue = null;
            // Use setTimeout to let the service's finalize() run first
            setTimeout(() => this.cdr.detectChanges());
          },
        });
    }
  }

  onUndo(): void {
    try {
      this.resetService.undo()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (snapshot) => {
            this.totalScore = snapshot.totalScore;
            this.lastRoll = snapshot.lastRoll;
            this.attemptsUsed = snapshot.attemptsUsed;
            this.cdr.detectChanges();
          },
          complete: () => {
            setTimeout(() => this.cdr.detectChanges());
          },
        });
    } catch (e) {
      if (e instanceof Error) {
        this.showError(e.message);
      }
    }
  }

  onCancelReset(): void {
    this.resetService.cancel();
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
