import {
  Component,
  Renderer2,
  Inject,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UiLibraryModule } from './shared/ui-library/ui-library.module';
import { IconComponent } from './shared/components/icon/icon.component';
import { TranslatePipe } from './shared/pipes/translate.pipe';
import { TranslationService } from './shared/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslatePipe, UiLibraryModule, IconComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // ===== SERVICES =====
  private readonly translationService = inject(TranslationService);

  // ===== SIGNALS =====
  readonly title = 'Wyrmrest UI Library';
  readonly isDarkMode = signal(false);
  readonly searchValue = signal<string>('');
  readonly activeSection = signal<string | null>(null);
  readonly currentLanguage = this.translationService.getLanguage();

  readonly searchValueLower = computed(() =>
    this.searchValue().toLowerCase().trim()
  );

  // ===== CONSTRUCTOR =====
  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly r: Renderer2
  ) {
    this.initTheme();
  }

  // ===== THEME INITIALIZATION =====
  private initTheme(): void {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const savedTheme = localStorage.getItem('wyrmrest-theme');
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.setTheme(isDark);
  }

  // ===== THEME TOGGLE =====
  toggleTheme(): void {
    const newDarkMode = !this.isDarkMode();
    this.setTheme(newDarkMode);
    localStorage.setItem('wyrmrest-theme', newDarkMode ? 'dark' : 'light');
  }

  private setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);

    if (isDark) {
      this.r.addClass(this.doc.body, 'theme-dark');
      this.r.removeClass(this.doc.body, 'theme-light');
    } else {
      this.r.addClass(this.doc.body, 'theme-light');
      this.r.removeClass(this.doc.body, 'theme-dark');
    }

    this.r.addClass(this.doc.body, 'wyrmrest');
  }

  // ===== LANGUAGE TOGGLE =====
  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  // ===== SEARCH FUNCTIONALITY =====
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchValue.set(target.value);
    }
  }

  shouldShowCard(keywords: string): boolean {
    const search = this.searchValueLower();
    if (!search) return true;
    return keywords.toLowerCase().includes(search);
  }

  clearSearch(): void {
    this.searchValue.set('');
  }

  setSearchFilter(keyword: string): void {
    if (this.searchValue() === keyword) {
      this.searchValue.set('');
    } else {
      this.searchValue.set(keyword);
    }
  }

  // ===== NAVIGATION =====
  scrollToSection(sectionId: string): void {
    this.activeSection.set(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  isSectionActive(sectionId: string): boolean {
    return this.activeSection() === sectionId;
  }

  isSearchActive(): boolean {
    return this.searchValueLower().length > 0;
  }
}
