import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dice-selector',
  standalone: true,
  templateUrl: './dice-selector.component.html',
  styleUrls: ['./dice-selector.component.css'],
})
export class DiceSelectorComponent {
  @Input() selectedCount = 1;
  @Output() countChange = new EventEmitter<number>();
  options = [1, 2, 3, 4, 5, 6];

  selectCount(count: number): void {
    this.selectedCount = count;
    this.countChange.emit(count);
  }
}
