import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() spacing: 'small' | 'medium' | 'large' = 'medium';
  @Input() text?: string;

  get classes(): string[] {
    return [
      'ui-divider',
      'ui-divider--' + this.orientation,
      'ui-divider--spacing-' + this.spacing,
      this.text ? 'ui-divider--with-text' : ''
    ].filter(Boolean);
  }
}
