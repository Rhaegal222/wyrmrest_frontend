import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hub-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hub-footer.component.html',
  styleUrl: './hub-footer.component.scss',
})
export class HubFooterComponent {
  @Input() year = new Date().getFullYear();
}
