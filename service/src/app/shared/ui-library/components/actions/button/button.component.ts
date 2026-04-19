import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonVariant, ButtonSize } from '../../../models/component-theme.model';
import { RippleDirective } from '../../../directives/ripple.directive';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, RippleDirective],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClickHandler(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get classes(): string[] {
    return [
      'ui-button',
      'ui-button--' + this.variant,
      'ui-button--' + this.size,
      this.fullWidth ? 'ui-button--full-width' : '',
      this.loading ? 'ui-button--loading' : ''
    ].filter(Boolean);
  }
}
