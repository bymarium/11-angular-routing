import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { BodyComponent } from '../body/body.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BodyComponent,
      }
    ]
  },
  {
    path: 'menus',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BodyComponent,
      }
    ]
  },
  {
    path: 'dishes',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LayoutComponent,
      }
    ]
  },
  {
    path: 'orders',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LayoutComponent,
      }
    ]
  },
  {
    path: 'clients',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LayoutComponent,
      }
    ]
  },
  {
    path: 'about',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LayoutComponent,
      }
    ]
  }
];
