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
import { TranslateModule } from '@ngx-translate/core';
import { listAvailableIcons, searchIcons, ICON_ALIASES } from './shared/services/icon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UiLibraryModule, IconComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // ===== SERVICES =====
  private readonly translationService = inject(TranslationService);

  // ===== SIGNALS =====
  readonly title = 'Wyrmrest UI Library';
  readonly isDarkMode = signal(false);
  readonly searchValue = signal('');
  readonly activeSection = signal<string | null>(null);
  readonly currentLanguage = this.translationService.getLanguage();
  readonly searchValueLower = computed(() =>
    this.searchValue().toLowerCase().trim()
  );
  readonly iconCategoryFilter = signal<string>('all');

  // ===== ICON CATEGORIES =====
  iconCategories: Record<string, string[]> = {
    actions: [
      'plus',
      'edit',
      'delete',
      'download',
      'upload',
      'share',
      'copy',
      'trash',
      'archive',
      'send',
    ],
    navigation: [
      'home',
      'search',
      'menu',
      'arrow',
      'close',
      'more',
      'more-horizontal',
      'logout',
      'login',
      'link',
    ],
    feedback: [
      'success',
      'error',
      'warning',
      'alert',
      'loader',
      'bell',
      'star',
    ],
    ui: [
      'grid',
      'list',
      'type',
      'toggle',
      'checkbox',
      'input',
      'table',
      'eye',
      'eye-off',
      'lock',
      'filter',
      'sort',
    ],
  };

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

  // ===== ICONS SECTION =====
  setIconCategoryFilter(category: string): void {
    this.iconCategoryFilter.set(category);
  }

  getFilteredIcons(): Array<{ name: string; alias?: string; category: string }> {
    let icons: Array<{ name: string; alias?: string; category: string }> = [];

    // Se c'è un filtro di ricerca, usa quello
    if (this.searchValue().trim()) {
      const searchResults = searchIcons(this.searchValue().toLowerCase());
      icons = searchResults.map((name) => ({
        name,
        alias: this.getAliasForIcon(name),
        category: this.getCategoryForIcon(name),
      }));
    } else {
      // Altrimenti mostra le icone in base alla categoria
      if (this.iconCategoryFilter() === 'all') {
        // Mostra tutte le icone dagli alias
        icons = Object.entries(ICON_ALIASES).map(([alias, iconName]) => ({
          name: alias,
          alias: iconName !== alias ? iconName : undefined,
          category: this.getCategoryForIcon(alias),
        }));
      } else {
        // Mostra solo le icone della categoria selezionata
        const categoryIcons =
          this.iconCategories[this.iconCategoryFilter()] || [];
        icons = categoryIcons.map((name) => ({
          name,
          alias: ICON_ALIASES[name],
          category: this.iconCategoryFilter(),
        }));
      }
    }

    return icons;
  }

  getCategoryForIcon(iconName: string): string {
    for (const [category, icons] of Object.entries(this.iconCategories)) {
      if (icons.includes(iconName)) {
        return category;
      }
    }
    return 'other';
  }

  getAliasForIcon(iconName: string): string | undefined {
    // Trova l'alias per un'icona
    for (const [alias, target] of Object.entries(ICON_ALIASES)) {
      if (target === iconName && alias !== iconName) {
        return alias;
      }
    }
    return undefined;
  }

  copyIconName(iconName: string): void {
    navigator.clipboard
      .writeText(iconName)
      .then(() => {
        console.log(`Icon name "${iconName}" copied to clipboard!`);
        // Opzionale: Mostra un toast
        // this.toastService.show({ type: 'success', message: `"${iconName}" copied!` });
      })
      .catch((err) => {
        console.error('Failed to copy icon name:', err);
      });
  }
}
