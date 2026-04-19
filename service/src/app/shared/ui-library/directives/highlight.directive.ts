import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[uiHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input() highlightColor = '#ffeb3b';
  private originalColor = '';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.originalColor = this.el.nativeElement.style.backgroundColor;
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = this.originalColor;
  }
}
