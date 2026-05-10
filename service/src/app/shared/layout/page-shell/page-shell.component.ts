import { Component, Input, signal, HostListener } from '@angular/core';
import { NavbarComponent, NavItem } from '../../ui-library/components/layout/navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'page-shell',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './page-shell.component.html',
  styleUrl: './page-shell.component.scss',
})
export class PageShellComponent {
  @Input() navItems: NavItem[] = [];
  @Input() activeSection = '';

  readonly showBackToTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.showBackToTop.set(window.scrollY > 500);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
