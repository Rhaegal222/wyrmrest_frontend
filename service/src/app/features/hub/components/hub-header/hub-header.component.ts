import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ThemeService } from '../../../../shared/ui-library/services/theme.service';

@Component({
  selector: 'app-hub-header',
  standalone: true,
  templateUrl: './hub-header.component.html',
  styleUrl: './hub-header.component.scss',
})
export class HubHeaderComponent {
  @Input() drawerOpen = false;
  @Output() menuRequested = new EventEmitter<void>();

  protected themeService = inject(ThemeService);

  get isDark(): boolean {
    return this.themeService.currentTheme() !== 'sh-light';
  }
}
