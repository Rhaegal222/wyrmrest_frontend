import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BarColor = 'primary' | 'success' | 'warning' | 'danger';
type BarSize = 'sm' | 'md' | 'lg';
type BarTheme = 'default' | 'dragon';

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() showLabel = false;
  @Input() color: BarColor = 'primary';
  @Input() striped = false;
  @Input() animated = false;
  @Input() size: BarSize = 'md';
  @Input() theme: BarTheme = 'dragon';

  get percentage(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  get barClasses(): string[] {
    return [
      'ui-progress-bar__fill',
      `ui-progress-bar__fill--${this.color}`,
      this.striped ? 'ui-progress-bar__fill--striped' : '',
      this.animated ? 'ui-progress-bar__fill--animated' : '',
    ].filter(Boolean);
  }

  get hostClasses(): string[] {
    return [
      'ui-progress-bar',
      `ui-progress-bar--${this.size}`,
      this.showLabel ? 'ui-progress-bar--labeled' : '', // Aggiunta classe per gestire l'altezza con testo
      this.theme === 'dragon' ? 'ui-progress-bar--dragon' : '',
    ].filter(Boolean);
  }
}
