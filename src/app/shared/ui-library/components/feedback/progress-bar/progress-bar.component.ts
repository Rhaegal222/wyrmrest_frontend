import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() showLabel = false;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() striped = false;
  @Input() animated = false;

  get percentage(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  get barClasses(): string[] {
    return [
      'ui-progress-bar__fill',
      'ui-progress-bar__fill--',
      this.striped ? 'ui-progress-bar__fill--striped' : '',
      this.animated ? 'ui-progress-bar__fill--animated' : ''
    ].filter(Boolean);
  }
}
