import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOT_POSITIONS } from './dot-positions';

export { DOT_POSITIONS };

@Component({
  selector: 'app-die-face',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './die-face.component.html',
  styleUrls: ['./die-face.component.css'],
})
export class DieFaceComponent {
  @Input() value: number = 1;
  @Input() isRolling: boolean = false;

  /** Returns array of 9 booleans indicating whether each grid cell has a dot. */
  get gridCells(): boolean[] {
    const positions = DOT_POSITIONS[this.value] || [];
    return Array.from({ length: 9 }, (_, i) => positions.includes(i + 1));
  }
}
