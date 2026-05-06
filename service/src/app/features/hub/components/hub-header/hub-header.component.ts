import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../shared/ui-library/services/theme.service';

@Component({
  selector: 'app-hub-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hub-header.component.html',
  styleUrl: './hub-header.component.scss',
})
export class HubHeaderComponent {
  @Input() activeSection: 'overview' | 'core-modules' | 'public-tools' | 'internal-tools' = 'overview';
  @Input() drawerOpen = false;
  @Output() menuRequested = new EventEmitter<void>();

  protected themeService = inject(ThemeService);

  get isDark(): boolean {
    return this.themeService.currentTheme() !== 'default-light';
  }
}
