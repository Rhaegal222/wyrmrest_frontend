import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { PlatformCardComponent } from './components/platform-card/platform-card.component';
import { Platform } from './platform.model';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [PlatformCardComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
})
export class HubComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly publicPlatforms = signal<Platform[]>([]);
  readonly internalPlatforms = signal<Platform[]>([]);
  readonly internalLoaded = signal(false);
  readonly year = new Date().getFullYear();
  readonly publicCount = computed(() => this.publicPlatforms().length);
  readonly internalCount = computed(() => this.internalPlatforms().length);

  ngOnInit(): void {
    this.http.get<Platform[]>('/api/hub/platforms/public').subscribe({
      next: (data) => this.publicPlatforms.set(data),
    });

    this.http.get<Platform[]>('/api/hub/platforms/internal').pipe(
      catchError(() => of([])),
      finalize(() => this.internalLoaded.set(true)),
    ).subscribe({
      next: (data) => this.internalPlatforms.set(data),
    });
  }
}
