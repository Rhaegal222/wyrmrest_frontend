import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthUser } from '../../../../shared/services/auth.service';
import { OffcanvasComponent } from '../../../../shared/ui-library/components/layout/offcanvas/offcanvas.component';

@Component({
  selector: 'app-hub-mobile-nav',
  standalone: true,
  imports: [RouterLink, OffcanvasComponent],
  templateUrl: './hub-mobile-nav.component.html',
  styleUrl: './hub-mobile-nav.component.scss',
})
export class HubMobileNavComponent {
  @Input() currentUser: AuthUser | null = null;
  @Input() isAuthenticated = false;
  @Input() isOpen = false;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  close(): void {
    this.closeRequested.emit();
  }

  requestLogout(): void {
    this.closeRequested.emit();
    this.logoutRequested.emit();
  }
}
