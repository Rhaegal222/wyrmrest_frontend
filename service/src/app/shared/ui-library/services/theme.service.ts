import { Injectable, signal, Inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ComponentTheme } from '../models/component-theme.model';

export type ThemeStyle = 'professional' | 'fantasy';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Colori custom (se necessari)
  private currentTheme = signal<ComponentTheme>({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    successColor: '#28a745',
    dangerColor: '#dc3545',
    warningColor: '#ffc107',
    infoColor: '#17a2b8',
  });

  // Stato dello stile (Fantasy vs Professional)
  readonly currentStyle = signal<ThemeStyle>('professional');

  theme = this.currentTheme.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Recupera stile salvato
      const savedStyle = localStorage.getItem('wyrmrest-style') as ThemeStyle;
      if (savedStyle) {
        this.setStyle(savedStyle);
      } else {
        this.setStyle('professional');
      }
    }
  }

  setTheme(theme: Partial<ComponentTheme>): void {
    this.currentTheme.update((current) => ({ ...current, ...theme }));
  }

  setStyle(style: ThemeStyle): void {
    this.currentStyle.set(style);
    if (isPlatformBrowser(this.platformId)) {
      document.body.setAttribute('data-style', style);
      localStorage.setItem('wyrmrest-style', style);
    }
  }

  toggleStyle(): void {
    const newStyle =
      this.currentStyle() === 'professional' ? 'fantasy' : 'professional';
    this.setStyle(newStyle);
  }

  resetTheme(): void {
    this.setTheme({
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      successColor: '#28a745',
      dangerColor: '#dc3545',
      warningColor: '#ffc107',
      infoColor: '#17a2b8',
    });
  }
}
