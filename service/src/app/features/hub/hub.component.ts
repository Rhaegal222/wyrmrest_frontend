import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  readonly platforms = signal<Platform[]>([]);
  readonly year = new Date().getFullYear();

  ngOnInit(): void {
    this.http.get<Platform[]>('/api/hub/platforms').subscribe({
      next: (data) => this.platforms.set(data),
    });
  }
}
