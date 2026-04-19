import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = '';
  @Input() initials?: string;
  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() status?: 'online' | 'offline' | 'away' | 'busy';

  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }

  get displayInitials(): string {
    if (this.initials) return this.initials;
    if (this.alt) {
      return this.alt
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return '?';
  }

  get classes(): string[] {
    return [
      'ui-avatar',
      'ui-avatar--' + this.size,
      'ui-avatar--' + this.shape,
      this.status ? 'ui-avatar--with-status' : ''
    ].filter(Boolean);
  }
}
