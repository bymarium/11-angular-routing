import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'jacobo',
    loadChildren: () => import('./components/admin/admin.routes').then((adminRoutes) => adminRoutes.routes)
  }
];
