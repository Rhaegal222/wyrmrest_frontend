import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { WYRMREST_ICONS, IconKey } from '../../services/icon.service';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  template: `
    <hugeicons-icon
      *ngIf="iconObject"
      [icon]="iconObject"
      [size]="size"
      [strokeWidth]="strokeWidth"
      [class]="customClass"
      [attr.style]="'color:' + color"
    ></hugeicons-icon>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
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
}
