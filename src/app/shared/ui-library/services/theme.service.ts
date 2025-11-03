import { Injectable, signal } from '@angular/core';
import { ComponentTheme } from '../models/component-theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<ComponentTheme>({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    successColor: '#28a745',
    dangerColor: '#dc3545',
    warningColor: '#ffc107',
    infoColor: '#17a2b8'
  });

  theme = this.currentTheme.asReadonly();

  setTheme(theme: Partial<ComponentTheme>): void {
    this.currentTheme.update(current => ({ ...current, ...theme }));
  }

  resetTheme(): void {
    this.setTheme({
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      successColor: '#28a745',
      dangerColor: '#dc3545',
      warningColor: '#ffc107',
      infoColor: '#17a2b8'
    });
  }
}
