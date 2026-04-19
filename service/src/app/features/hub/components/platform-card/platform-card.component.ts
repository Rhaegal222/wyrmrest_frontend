import { Component, input, computed } from '@angular/core';
import { Platform } from '../../platform.model';

@Component({
  selector: 'app-platform-card',
  standalone: true,
  templateUrl: './platform-card.component.html',
  styleUrl: './platform-card.component.scss',
})
export class PlatformCardComponent {
  readonly platform = input.required<Platform>();

  readonly badgeLabel = computed(() => {
    const badge = this.platform().badge;
    if (badge === 'live') return '● Live';
    if (badge === 'wip') return '⧖ In sviluppo';
    return 'Strumento';
  });
}
