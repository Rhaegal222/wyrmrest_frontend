import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleDirective } from '../../../directives/ripple.directive';
import { TooltipDirective } from '../../../directives/tooltip.directive';

@Component({
  selector: 'ui-fab',
  standalone: true,
  imports: [CommonModule, RippleDirective, TooltipDirective],
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {
  @Input() icon!: string;
  @Input() position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() tooltip?: string;
  @Input() extended = false;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClickHandler(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  get classes(): string[] {
    return [
      'ui-fab',
      'ui-fab--',
      'ui-fab--',
      this.extended ? 'ui-fab--extended' : ''
    ].filter(Boolean);
  }
}
