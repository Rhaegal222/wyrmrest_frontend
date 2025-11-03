import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonVariant } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() dot = false;
  @Input() outlined = false;

  get classes(): string[] {
    return [
      'ui-badge',
      'ui-badge--',
      'ui-badge--',
      this.dot ? 'ui-badge--dot' : '',
      this.outlined ? 'ui-badge--outlined' : ''
    ].filter(Boolean);
  }
}
