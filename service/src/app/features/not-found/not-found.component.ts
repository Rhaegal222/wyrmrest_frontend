import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../shared/layout/page-shell/page-shell.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, PageShellComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
