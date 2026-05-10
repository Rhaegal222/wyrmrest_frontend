import { Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthUser } from '../../../../shared/services/auth.service';
import { ThemeService } from '../../../../shared/ui-library/services/theme.service';

@Component({
  selector: 'app-hub-mobile-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hub-mobile-nav.component.html',
  styleUrl: './hub-mobile-nav.component.scss',
})
export class HubMobileNavComponent {
  @Input() currentUser: AuthUser | null = null;
  @Input() isAuthenticated = false;
  @Input() isOpen = false;
  @Input() activeSection: 'overview' | 'core-modules' | 'public-tools' | 'internal-tools' = 'overview';
  @Output() closeRequested = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  protected readonly themeService = inject(ThemeService);

  get isDark(): boolean {
    return this.themeService.currentTheme() !== 'default-light';
  }

  get userInitials(): string {
    if (!this.currentUser?.name) return '?';
    return this.currentUser.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  close(): void {
    this.closeRequested.emit();
  }

  requestLogout(): void {
    this.closeRequested.emit();
    this.logoutRequested.emit();
  }
}
