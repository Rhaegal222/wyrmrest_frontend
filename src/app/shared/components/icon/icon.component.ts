import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { getIcon, IconKey, ICON_ALIASES } from '../../services/icon.service';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  template: `
    @if (iconObject) {
      <hugeicons-icon
        [icon]="iconObject"
        [size]="size"
        [color]="color"
        [strokeWidth]="strokeWidth"
        [class]="customClass"
      />
    } @else {
      <span class="icon-fallback" [style.font-size.px]="size">
        {{ getFallbackIcon() }}
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .icon-fallback {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
    `,
  ],
})
export class IconComponent implements OnChanges {
  @Input() icon: IconKey = 'home';
  @Input() size: number = 24;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
  @Input() customClass: string = '';

  iconObject: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon']) {
      this.updateIcon();
    }
  }

  ngOnInit(): void {
    this.updateIcon();
  }

  private updateIcon(): void {
    this.iconObject = getIcon(this.icon);
    
    // Log in development per debugging
    if (!this.iconObject && typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.warn(`Icon "${this.icon}" not found in WYRMREST_ICONS. Available aliases:`, 
        Object.keys(ICON_ALIASES));
    }
  }

  getFallbackIcon(): string {
    const fallbackMap: Record<string, string> = {
      'home': '🏠',
      'search': '🔍',
      'settings': '⚙️',
      'bell': '🔔',
      'menu': '☰',
      'close': '✕',
      'download': '⬇',
      'share': '↗',
      'more': '⋮',
      'more-horizontal': '⋯',
      'logout': '→',
      'login': '←',
      'success': '✓',
      'error': '✕',
      'warning': '⚠',
      'info': 'ℹ️',
      'alert': '⚠',
      'loader': '⟳',
      'plus': '+',
      'edit': '✎',
      'delete': '❌',
      'star': '★',
      'trash': '🗑️',
      'copy': '📋',
      'link': '🔗',
      'archive': '📦',
      'send': '✉',
      'sun': '☀️',
      'moon': '🌕',
      'users': '👥',
      'grid': '⊞',
      'list': '☰',
      'type': 'T',
      'toggle': '⏻',
      'checkbox': '☑',
      'input': '⌨',
      'table': '⊞',
      'arrow': '→',
      'eye': '👁',
      'eye-off': '👁',
      'lock': '🔒',
      'filter': '⊲',
      'sort': '⇅',
      'folder': '📁',
      'upload': '⬆',
      'mail': '✉',
      'message': '💬',
      'calendar': '📅',
      'clock': '🕐',
      'mobile': '📱',
      'laptop': '💻',
      'monitor': '🖥',
      'headphone': '🎧',
      'volume': '🔊',
      'mic': '🎤',
      'mic-off': '🎤',
      'music': '♪',
      'play': '▶',
      'pause': '⏸',
    };

    return fallbackMap[this.icon] || '◆';
  }
}
