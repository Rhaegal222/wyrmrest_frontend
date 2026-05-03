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

  readonly audienceLabel = computed(() => {
    const audience = this.platform().audience;
    if (audience === 'internal') return 'Interno';
    return 'Pubblico';
  });

  readonly badgeLabel = computed(() => {
    const badge = this.platform().badge;
    if (badge === 'live') return 'Live';
    if (badge === 'wip') return 'In sviluppo';
    return 'Strumento';
  });

  readonly accessLabel = computed(() => {
    const platform = this.platform();

    if (platform.audience === 'public') {
      return 'Libero accesso';
    }

    if ((platform.required_permissions?.length ?? 0) > 0) {
      return 'Permesso dedicato';
    }

    if ((platform.required_roles?.length ?? 0) > 0) {
      return 'Ruolo dedicato';
    }

    if (platform.auth_required) {
      return 'Autenticazione';
    }

    return 'Riservato';
  });
}
