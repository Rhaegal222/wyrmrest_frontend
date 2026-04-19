import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title = '';
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  close(): void {
    this.isOpen = false;
    this.closeEvent.emit();
  }

  onBackdropClick(): void {
    this.close();
  }
}
