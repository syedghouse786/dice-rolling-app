import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RollButtonComponent } from '../components/roll-button/roll-button.component';
import { DieFaceComponent } from '../components/die-face/die-face.component';

@Component({
  selector: 'app-dice-panel',
  standalone: true,
  imports: [CommonModule, RollButtonComponent, DieFaceComponent],
  templateUrl: './dice-panel.component.html',
  styleUrls: ['./dice-panel.component.css'],
})
export class DicePanelComponent {
  readonly MAX_ATTEMPTS = 10;
  totalScore = 0;
  lastRoll: number | null = null;
  attemptsUsed = 0;
  isRolling = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get gameOver(): boolean {
    return this.attemptsUsed >= this.MAX_ATTEMPTS;
  }

  onRoll(): void {
    if (this.gameOver || this.isRolling) return;
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
    this.totalScore = 0;
    this.lastRoll = null;
    this.attemptsUsed = 0;
    this.isRolling = false;
  }
}
