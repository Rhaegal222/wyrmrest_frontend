import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/hub/hub.component').then((m) => m.HubComponent),
  },
];
