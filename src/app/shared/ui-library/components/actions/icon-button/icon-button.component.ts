import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleDirective } from '../../../directives/ripple.directive';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { ButtonVariant, ButtonSize } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [CommonModule, RippleDirective, TooltipDirective],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent {
  @Input() icon!: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled = false;
  @Input() rounded = true;
  @Input() tooltip?: string;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClickHandler(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  get classes(): string[] {
    return [
      'ui-icon-button',
      'ui-icon-button--',
      'ui-icon-button--',
      this.rounded ? 'ui-icon-button--rounded' : ''
    ].filter(Boolean);
  }
}
