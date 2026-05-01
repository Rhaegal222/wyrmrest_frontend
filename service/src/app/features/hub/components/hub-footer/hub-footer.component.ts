import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-footer',
  standalone: true,
  templateUrl: './hub-footer.component.html',
  styleUrl: './hub-footer.component.scss',
})
export class HubFooterComponent {
  @Input() year = new Date().getFullYear();
}
