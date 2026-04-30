import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { PlatformCardComponent } from './components/platform-card/platform-card.component';
import { Platform } from './platform.model';
import { AuthService } from '../../shared/services/auth.service';
import { SidebarComponent } from '../../shared/ui-library/components/layout/sidebar/sidebar.component';
import { OffcanvasComponent } from '../../shared/ui-library/components/layout/offcanvas/offcanvas.component';
import { ModalComponent } from '../../shared/ui-library/components/feedback/modal/modal.component';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [PlatformCardComponent, RouterLink, SidebarComponent, OffcanvasComponent, ModalComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
})
export class HubComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly internalRequestStarted = signal(false);

  readonly publicPlatforms = signal<Platform[]>([]);
  readonly internalPlatforms = signal<Platform[]>([]);
  readonly internalLoaded = signal(false);
  readonly isDrawerOpen = signal(false);
  readonly isLogoutModalOpen = signal(false);
  readonly year = new Date().getFullYear();
  readonly publicCount = computed(() => this.publicPlatforms().length);
  readonly internalCount = computed(() => this.internalPlatforms().length);
  readonly currentUser = this.auth.user;
  readonly canViewInternalTools = this.auth.canViewInternalTools;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly authError = this.auth.error;
  private readonly internalAccessEffect = effect(() => {
    if (!this.auth.initialized()) {
      return;
    }

    if (!this.canViewInternalTools()) {
      this.internalPlatforms.set([]);
      this.internalLoaded.set(true);
      return;
    }

    if (this.internalRequestStarted()) {
      return;
    }

    this.internalRequestStarted.set(true);
    this.http.get<Platform[]>('/api/hub/platforms/internal', { withCredentials: true }).pipe(
      catchError(() => of([])),
      finalize(() => this.internalLoaded.set(true)),
    ).subscribe({
      next: (data) => this.internalPlatforms.set(data),
    });
  });

  ngOnInit(): void {
    this.http.get<Platform[]>('/api/hub/platforms/public').subscribe({
      next: (data) => this.publicPlatforms.set(data),
    });
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  confirmLogout(): void {
    this.auth.logout().pipe(
      catchError(() => of(null)),
    ).subscribe(() => {
      this.closeLogoutModal();
      this.internalRequestStarted.set(false);
      this.internalPlatforms.set([]);
      this.internalLoaded.set(false);
    });
  }

  logout(): void {
    this.openLogoutModal();
  }
}
