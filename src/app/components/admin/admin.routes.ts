import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { adminGuard } from './admin.guard';
import { ItemComponent } from '../aside/item/item.component';
import { AsideComponent } from '../aside/aside.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'menus',
        component: AsideComponent
      },
      {
        path: 'dishes',
        component: AsideComponent
      },
      {
        path: 'orders',
        component: AsideComponent
      },
      {
        path: 'clients',
        component: LayoutComponent
      },
      {
        path: 'about',
        component: ItemComponent
      }
    ]
  }
];
