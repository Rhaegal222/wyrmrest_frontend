import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type WrTheme = 'sh-dark' | 'sh-light';

const STORAGE_KEY = 'wr-theme';
const DEFAULT_THEME: WrTheme = 'sh-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<WrTheme>(DEFAULT_THEME);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(STORAGE_KEY) as WrTheme | null;
      this.applyTheme(saved ?? DEFAULT_THEME);
    }
  }

  setTheme(theme: WrTheme): void {
    this.applyTheme(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  toggleTheme(): void {
    const next: WrTheme = this.currentTheme() === 'sh-dark' ? 'sh-light' : 'sh-dark';
    this.setTheme(next);
  }

  private applyTheme(theme: WrTheme): void {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-wr-theme', theme);
    }
  }
}
