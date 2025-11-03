import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevation: 0 | 1 | 2 | 3 = 1;
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  @Input() hoverable = false;

  get classes(): string[] {
    return [
      'ui-card',
      'ui-card--elevation-',
      'ui-card--padding-',
      this.hoverable ? 'ui-card--hoverable' : ''
    ].filter(Boolean);
  }
}
