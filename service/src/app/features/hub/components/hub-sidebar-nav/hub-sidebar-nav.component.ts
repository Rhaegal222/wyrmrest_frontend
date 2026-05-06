import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthUser } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-hub-sidebar-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hub-sidebar-nav.component.html',
  styleUrl: './hub-sidebar-nav.component.scss',
})
export class HubSidebarNavComponent {
  @Input() currentUser: AuthUser | null = null;
  @Input() isAuthenticated = false;
  @Input() activeSection: 'overview' | 'public-tools' | 'internal-tools' = 'overview';
  @Output() logoutRequested = new EventEmitter<void>();
}
