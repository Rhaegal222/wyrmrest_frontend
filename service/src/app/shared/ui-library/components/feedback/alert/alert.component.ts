import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertType } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Input() closeable = false;
  @Input() icon?: string;
  
  @Output() closed = new EventEmitter<void>();

  get defaultIcon(): string {
    const icons: Record<AlertType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return this.icon || icons[this.type];
  }

  close(): void {
    this.closed.emit();
  }

  get classes(): string[] {
    return [
      'ui-alert',
      'ui-alert--' + this.type
    ];
  }
}
