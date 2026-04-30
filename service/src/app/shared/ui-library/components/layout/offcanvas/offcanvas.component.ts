import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-offcanvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss'],
})
export class OffcanvasComponent implements AfterViewInit {
  @Input() title = 'WYRMREST';
  @Input() eyebrow = 'Menu';
  @Input() isOpen = false;
  @Input() ariaLabel = 'Menu Wyrmrest';
  @Output() closeEvent = new EventEmitter<void>();
  @ViewChild('drawer', { static: false }) drawer?: ElementRef<HTMLElement>;
  private previouslyFocused?: HTMLElement | null;

  ngAfterViewInit(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    if (this.isOpen) {
      queueMicrotask(() => this.focusFirstElement());
    }
  }

  onBackdropClick(): void {
    this.close();
  }

  close(): void {
    this.closeEvent.emit();
    queueMicrotask(() => this.previouslyFocused?.focus());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.drawer) {
      return;
    }

    const focusables = this.getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusFirstElement(): void {
    const focusables = this.getFocusableElements();
    (focusables[0] ?? this.drawer?.nativeElement)?.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.drawer) {
      return [];
    }

    return Array.from(
      this.drawer.nativeElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(element => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));
  }
}
