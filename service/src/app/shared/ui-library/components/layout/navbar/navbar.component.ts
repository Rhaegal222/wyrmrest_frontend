import { Component, Input, inject, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

export interface NavItem {
  label: string;
  href: string;
}

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() navItems: NavItem[] = [];
  @Input() activeSection = '';

  protected readonly auth = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  get isDark(): boolean {
    return this.themeService.currentTheme() !== 'default-light';
  }

  get userInitials(): string {
    const user = this.auth.user();
    if (!user) return '';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
