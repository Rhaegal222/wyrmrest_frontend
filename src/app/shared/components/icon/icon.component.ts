import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { WYRMREST_ICONS, IconKey } from '../../services/icon.service';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  template: `
    @if (iconObject) {
    <hugeicons-icon
      [icon]="iconObject"
      [size]="size"
      [strokeWidth]="strokeWidth"
      [class]="customClass"
      [attr.style]="'color:' + color"
    ></hugeicons-icon>
    } @else {
    <span
      class="icon-fallback"
      [style.font-size.px]="size"
      [style.color]="color"
    >
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
export class IconComponent {
  @Input() icon: IconKey = 'home';
  @Input() size: number = 24;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
  @Input() customClass: string = '';

  get iconObject() {
    return WYRMREST_ICONS[this.icon];
  }

  getFallbackIcon(): string {
    const fallbackMap: Record<IconKey, string> = {
      home: '🏠',
      search: '🔍',
      settings: '⚙️',
      bell: '🔔',
      menu: '☰',
      close: '✕',
      download: '⬇',
      share: '↗',
      more: '⋮',
      moreHorizontal: '⋯',
      logout: '→',
      login: '←',
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
      alert: '⚠',
      loader: '⟳',
      plus: '+',
      edit: '✎',
      delete: '🗑',
      star: '★',
      trash: '🗑',
      copy: '📋',
      link: '🔗',
      archive: '📦',
      send: '✉',
      sun: '☀',
      moon: '🌙',
      users: '👥',
      grid: '⊞',
      list: '☰',
      type: 'T',
      toggle: '⏻',
      checkbox: '☑',
      input: '⌨',
      table: '⊞',
      arrow: '→',
      eye: '👁',
      eyeOff: '👁',
      lock: '🔒',
      filter: '⊲',
      sort: '⇅',
      folder: '📁',
      upload: '⬆',
      mail: '✉',
      message: '💬',
      calendar: '📅',
      clock: '🕐',
      mobile: '📱',
      laptop: '💻',
      monitor: '🖥',
      headphone: '🎧',
      volume: '🔊',
      mic: '🎤',
      micOff: '🎤',
      music: '♪',
      play: '▶',
      pause: '⏸',
    };
    return fallbackMap[this.icon] || '◆';
  }
}
