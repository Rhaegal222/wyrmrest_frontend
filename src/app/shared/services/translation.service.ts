// shared/services/translation.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly translate = inject(TranslateService);
  readonly currentLanguage = signal<'it' | 'en'>(this.getInitial());

  constructor() {
    this.translate.setFallbackLang('it');
    this.translate.use(this.currentLanguage());
  }

  private getInitial(): 'it' | 'en' {
    const saved = localStorage.getItem('app-language');
    return (saved === 'en' ? 'en' : 'it');
  }

  get(key: string): string {
    const v = this.translate.instant(key);
    return v && v !== key ? v : key;
  }

  setLanguage(lang: 'it' | 'en') {
    this.currentLanguage.set(lang);
    this.translate.use(lang);
    localStorage.setItem('app-language', lang);
  }

  toggleLanguage() {
    this.setLanguage(this.currentLanguage() === 'it' ? 'en' : 'it');
  }

  getLanguage() {
    return this.currentLanguage.asReadonly();
  }
}
