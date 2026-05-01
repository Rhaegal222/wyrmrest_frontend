import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hub-header',
  standalone: true,
  templateUrl: './hub-header.component.html',
  styleUrl: './hub-header.component.scss',
})
export class HubHeaderComponent {
  @Input() drawerOpen = false;
  @Output() menuRequested = new EventEmitter<void>();
}
