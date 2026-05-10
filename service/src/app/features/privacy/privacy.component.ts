import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../shared/layout/page-shell/page-shell.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, PageShellComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  readonly year = new Date().getFullYear();
}
