import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { ResetPhase } from '../../models/reset.models';

@Component({
  selector: 'app-reset-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-confirm.component.html',
  styleUrls: ['./reset-confirm.component.css'],
})
export class ResetConfirmComponent implements OnInit, OnDestroy {
  @Input() currentScore = 0;
  @Input() countdown: number | null = null;
  @Input() phase: ResetPhase = 'confirming';
  @Input() errorMessage: string | null = null;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancelReset = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Subscriptions would use takeUntil(this.destroy$) for cleanup
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
