import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[uiRipple]',
  standalone: true
})
export class RippleDirective {
  @Input() rippleColor = 'rgba(255, 255, 255, 0.5)';

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.style.overflow = 'hidden';
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const ripple = document.createElement('span');
    const rect = this.el.nativeElement.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = this.rippleColor;
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple-animation 0.6s ease-out';

    this.el.nativeElement.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
}
