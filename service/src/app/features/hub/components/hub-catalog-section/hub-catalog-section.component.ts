import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformCardComponent } from '../platform-card/platform-card.component';
import { Platform } from '../../platform.model';

@Component({
  selector: 'app-hub-catalog-section',
  standalone: true,
  imports: [PlatformCardComponent, RouterLink],
  templateUrl: './hub-catalog-section.component.html',
  styleUrl: './hub-catalog-section.component.scss',
})
export class HubCatalogSectionComponent {
  @Input() sectionId = '';
  @Input() title = '';
  @Input() eyebrow = 'Catalogo';
  @Input() countLabel = '';
  @Input() locked = false;
  @Input() platforms: Platform[] = [];
  @Input() loaded = true;
  @Input() authenticated = false;
}
