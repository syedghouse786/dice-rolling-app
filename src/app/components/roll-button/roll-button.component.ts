import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-roll-button',
  standalone: true,
  templateUrl: './roll-button.component.html',
  styleUrls: ['./roll-button.component.css'],
})
export class RollButtonComponent {
  @Input() disabled: boolean = false;
  @Output() roll = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.roll.emit();
    }
  }
}
