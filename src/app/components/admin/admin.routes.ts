import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent
  }
];
