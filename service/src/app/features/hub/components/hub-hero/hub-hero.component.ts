import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-hero',
  standalone: true,
  templateUrl: './hub-hero.component.html',
  styleUrl: './hub-hero.component.scss',
})
export class HubHeroComponent {
  @Input() publicCount = 0;
  @Input() internalCount = 0;
}
