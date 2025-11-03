import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations = {
    it: {
      'catalog.title': 'Catalogo Componenti',
      'catalog.search':
        'Cerca componenti (es. button, select, table, input...)',
      'catalog.clearSearch': 'Cancella ricerca',
      'hero.title': 'UI Components',
      'hero.subtitle': 'Wyrmrest',
      'hero.description':
        "Una libreria di componenti Angular completa e pronta all'uso, costruita con design tokens, tema scuro/chiaro, accessibilità integrata e performance ottimizzata.",
      'hero.explore': 'Inizia a esplorare',
      'hero.documentation': 'Documentazione',
      'nav.actions': 'Actions',
      'nav.inputs': 'Inputs',
      'nav.layout': 'Layout',
      'nav.feedback': 'Feedback',
      'nav.informational': 'Informational',
      'components.button.name': 'Button',
      'components.button.description':
        'Pulsante con varianti, dimensioni, stati e icone.',
      'components.link.name': 'Link',
      'components.link.description':
        'Collegamenti esterni e interni con underline opzionale.',
      'components.iconButton.name': 'IconButton',
      'components.iconButton.description':
        'Pulsante icona con tooltip e ripple effect.',
      'components.fab.name': 'Floating Action Button',
      'components.fab.description': 'Pulsante flottante per azione primaria.',
      'components.textInput.name': 'TextInput',
      'components.textInput.description':
        'Campo testo con label, hint, error e icone.',
      'components.checkbox.name': 'Checkbox',
      'components.checkbox.description':
        'Selettore booleano con stato indeterminate.',
      'components.toggle.name': 'Toggle',
      'components.toggle.description': 'Interruttore on/off in più dimensioni.',
      'components.select.name': 'Select',
      'components.select.description':
        'Selettore a menu con placeholder e validazione.',
      'components.card.name': 'Card',
      'components.card.description':
        'Contenitore con header, contenuto e footer.',
      'components.container.name': 'Container',
      'components.container.description':
        'Contenitore responsivo con max-width.',
      'components.divider.name': 'Divider',
      'components.divider.description':
        'Separatore orizzontale/verticale con testo.',
      'components.alert.name': 'Alert',
      'components.alert.description':
        'Messaggi informativi per status e avvisi.',
      'components.spinner.name': 'Spinner',
      'components.spinner.description':
        'Indicatore di caricamento in vari size/colori.',
      'components.progress.name': 'Progress Bar',
      'components.progress.description': 'Avanzamento con valore e animazione.',
      'components.toast.name': 'Toast Container',
      'components.toast.description': 'Contenitore notifiche non-modale.',
      'components.badge.name': 'Badge',
      'components.badge.description':
        'Etichette compatte per stato e conteggio.',
      'components.avatar.name': 'Avatar',
      'components.avatar.description': 'Immagini profilo con iniziali e stato.',
      'components.table.name': 'Table',
      'components.table.description': 'Tabella con colonne ordinabili e hover.',
      'footer.text':
        'Una collezione completa di componenti Angular per costruire interfacce moderne.',
      'footer.details':
        'Tema scuro/chiaro dinamico, design tokens centralizzati, accessibilità e performance ottimizzate.',
    },
    en: {
      'catalog.title': 'Component Catalog',
      'catalog.search':
        'Search components (e.g. button, select, table, input...)',
      'catalog.clearSearch': 'Clear search',
      'hero.title': 'UI Components',
      'hero.subtitle': 'Wyrmrest',
      'hero.description':
        'A complete and ready-to-use Angular component library, built with design tokens, light/dark theme, integrated accessibility and optimized performance.',
      'hero.explore': 'Start exploring',
      'hero.documentation': 'Documentation',
      'nav.actions': 'Actions',
      'nav.inputs': 'Inputs',
      'nav.layout': 'Layout',
      'nav.feedback': 'Feedback',
      'nav.informational': 'Informational',
      'components.button.name': 'Button',
      'components.button.description':
        'Button with variants, sizes, states and icons.',
      'components.link.name': 'Link',
      'components.link.description':
        'External and internal links with optional underline.',
      'components.iconButton.name': 'IconButton',
      'components.iconButton.description':
        'Icon button with tooltip and ripple effect.',
      'components.fab.name': 'Floating Action Button',
      'components.fab.description': 'Floating button for primary action.',
      'components.textInput.name': 'TextInput',
      'components.textInput.description':
        'Text field with label, hint, error and icons.',
      'components.checkbox.name': 'Checkbox',
      'components.checkbox.description':
        'Boolean selector with indeterminate state.',
      'components.toggle.name': 'Toggle',
      'components.toggle.description': 'On/off switch in multiple sizes.',
      'components.select.name': 'Select',
      'components.select.description':
        'Menu selector with placeholder and validation.',
      'components.card.name': 'Card',
      'components.card.description':
        'Container with header, content and footer.',
      'components.container.name': 'Container',
      'components.container.description':
        'Responsive container with max-width.',
      'components.divider.name': 'Divider',
      'components.divider.description':
        'Horizontal/vertical separator with text.',
      'components.alert.name': 'Alert',
      'components.alert.description':
        'Informational messages for status and warnings.',
      'components.spinner.name': 'Spinner',
      'components.spinner.description':
        'Loading indicator in various sizes/colors.',
      'components.progress.name': 'Progress Bar',
      'components.progress.description': 'Progress with value and animation.',
      'components.toast.name': 'Toast Container',
      'components.toast.description': 'Non-modal notification container.',
      'components.badge.name': 'Badge',
      'components.badge.description': 'Compact labels for status and count.',
      'components.avatar.name': 'Avatar',
      'components.avatar.description':
        'Profile images with initials and status.',
      'components.table.name': 'Table',
      'components.table.description': 'Table with sortable columns and hover.',
      'footer.text':
        'A complete collection of Angular components for building modern interfaces.',
      'footer.details':
        'Dynamic light/dark theme, centralized design tokens, accessibility and optimized performance.',
    },
  };

  readonly currentLanguage = signal<'it' | 'en'>('it');

  constructor() {
    const saved = localStorage.getItem('app-language');
    if (saved === 'en' || saved === 'it') {
      this.currentLanguage.set(saved);
    }
  }

  get(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage()];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  setLanguage(lang: 'it' | 'en'): void {
    this.currentLanguage.set(lang);
    localStorage.setItem('app-language', lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'it' ? 'en' : 'it';
    this.setLanguage(newLang);
  }

  getLanguage() {
    return this.currentLanguage;
  }
}
