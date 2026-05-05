import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthUser } from '../../../../shared/services/auth.service';
import { SidebarComponent } from '../../../../shared/ui-library/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-hub-sidebar-nav',
  standalone: true,
  imports: [RouterLink, SidebarComponent],
  templateUrl: './hub-sidebar-nav.component.html',
  styleUrl: './hub-sidebar-nav.component.scss',
})
export class HubSidebarNavComponent {
  @Input() currentUser: AuthUser | null = null;
  @Input() isAuthenticated = false;
  @Output() logoutRequested = new EventEmitter<void>();
}
