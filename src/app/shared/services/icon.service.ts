// src/app/shared/services/icon.service.ts

import * as HugeIcons from '@hugeicons/core-free-icons';

/**
 * Genera automaticamente il dizionario delle icone da HugeIcons
 * Tutte le icone esportate da @hugeicons/core-free-icons vengono automaticamente mappate
 */
function generateIconDictionary() {
  const icons: Record<string, any> = {};
  
  // Itera su tutte le esportazioni del modulo HugeIcons
  Object.entries(HugeIcons).forEach(([key, value]) => {
    // Filtra solo le icone (esclude altri exports come utils, types, etc.)
    if (key.endsWith('Icon') && typeof value === 'object') {
      // Converte il nome da PascalCase a kebab-case
      // Es: Home01Icon -> home-01
      const iconName = key
        .replace(/Icon$/, '') // Rimuove 'Icon' alla fine
        .replace(/([A-Z])/g, '-$1') // Aggiunge trattino prima delle maiuscole
        .toLowerCase()
        .replace(/^-/, ''); // Rimuove il trattino iniziale
      
      icons[iconName] = value;
    }
  });
  
  return icons;
}

// Genera automaticamente il dizionario
export const WYRMREST_ICONS = generateIconDictionary();

// Mappa di alias per nomi più user-friendly
export const ICON_ALIASES: Record<string, string> = {
  // Navigation & UI
  'home': 'home-01',
  'search': 'search-01',
  'settings': 'settings-01',
  'bell': 'notification-01',
  'menu': 'menu-01',
  'close': 'cancel-01',
  'download': 'download-01',
  'share': 'share-01',
  'more': 'more-vertical',
  'more-horizontal': 'more-horizontal',
  'logout': 'logout-01',
  'login': 'login-01',
  
  // Status & Feedback
  'success': 'checkmark-circle',
  'error': 'alert-circle',
  'warning': 'alert-diamond',
  'info': 'circle',
  'alert': 'alert-diamond',
  'loader': 'layers-01',
  
  // Actions
  'plus': 'add-01',
  'edit': 'edit-02',
  'delete': 'delete-01',
  'star': 'star',
  'trash': 'delete-01',
  'copy': 'copy-01',
  'link': 'link-01',
  'archive': 'archive-01',
  'send': 'mail-send-01',
  
  // Theme
  'sun': 'sun-01',
  'moon': 'moon-01',
  
  // Components
  'users': 'user-group',
  'grid': 'layout-grid',
  'list': 'list-view',
  'type': 'type-cursor',
  'toggle': 'toggle-on',
  'checkbox': 'tick-01',
  'input': 'edit-04',
  'table': 'table',
  'arrow': 'arrow-right-01',
  
  // Vision
  'eye': 'eye',
  'eye-off': 'view-off',
  
  // Security
  'lock': 'lock',
  
  // Filtering & Sorting
  'filter': 'filter',
  'sort': 'sorting-01',
  
  // File & Folder
  'folder': 'folder-01',
  'upload': 'upload-01',
  'mail': 'mail-01',
  'message': 'mail-send-01',
  
  // Date & Time
  'calendar': 'calendar-01',
  'clock': 'clock-01',
  
  // Devices
  'mobile': 'smart-phone-01',
  'laptop': 'laptop',
  'monitor': 'computer',
  
  // Audio
  'headphone': 'headphones',
  'volume': 'volume-high',
  'mic': 'mic-01',
  'mic-off': 'mic-off-01',
  
  // Media
  'music': 'music-note-01',
  'play': 'play',
  'pause': 'pause',
};

// Helper per ottenere l'icona con supporto per alias
export function getIcon(name: string): any {
  const iconName = ICON_ALIASES[name] || name;
  return WYRMREST_ICONS[iconName];
}

// Type per tutte le icone disponibili (dinamico)
export type IconKey = keyof typeof WYRMREST_ICONS | keyof typeof ICON_ALIASES;

// Utility per elencare tutte le icone disponibili (utile per debug/docs)
export function listAvailableIcons(): string[] {
  return Object.keys(WYRMREST_ICONS).sort();
}

// Utility per cercare icone per nome parziale
export function searchIcons(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  return Object.keys(WYRMREST_ICONS)
    .filter(name => name.includes(lowerQuery))
    .sort();
}
