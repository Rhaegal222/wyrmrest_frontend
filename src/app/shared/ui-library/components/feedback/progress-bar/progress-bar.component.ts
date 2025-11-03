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
  @Input() value = 0;               // valore corrente
  @Input() max = 100;               // massimo
  @Input() showLabel = false;       // mostra % nel riempimento
  @Input() color: BarColor = 'primary';
  @Input() striped = false;
  @Input() animated = false;
  @Input() size: BarSize = 'md';    // sm | md | lg
  @Input() theme: BarTheme = 'dragon'; // default | dragon

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
      this.theme === 'dragon' ? 'ui-progress-bar--dragon' : '',
    ].filter(Boolean);
  }
}
