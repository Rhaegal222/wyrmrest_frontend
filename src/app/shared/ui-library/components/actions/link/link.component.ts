import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  @Input() href?: string;
  @Input() routerLink?: string | any[];
  @Input() target: '_blank' | '_self' | '_parent' | '_top' = '_self';
  @Input() underline = true;
  @Input() disabled = false;

  get isExternal(): boolean {
    return !!this.href;
  }
}
