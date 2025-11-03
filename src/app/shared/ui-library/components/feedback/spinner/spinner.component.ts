import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'secondary' | 'white' = 'primary';
  @Input() overlay = false;

  get classes(): string[] {
    return [
      'ui-spinner',
      'ui-spinner--' + this.size,
      'ui-spinner--' + this.color,
      this.overlay ? 'ui-spinner--overlay' : ''
    ].filter(Boolean);
  }
}
