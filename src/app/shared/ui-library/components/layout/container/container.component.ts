import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {
  @Input() maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg';
  @Input() padding = true;

  get classes(): string[] {
    return [
      'ui-container',
      'ui-container--',
      this.padding ? 'ui-container--padded' : ''
    ].filter(Boolean);
  }
}
