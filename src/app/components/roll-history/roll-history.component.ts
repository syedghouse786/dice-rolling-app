import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RollEntry } from '../../models/dice.models';

@Component({
  selector: 'app-roll-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roll-history.component.html',
  styleUrls: ['./roll-history.component.css'],
})
export class RollHistoryComponent {
  @Input() history: ReadonlyArray<RollEntry> = [];
}
