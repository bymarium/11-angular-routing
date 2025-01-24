import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { BodyComponent } from '../body/body.component';
import { FormComponent } from '../form/form.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BodyComponent,
        children: [
          {
            path: 'menus',
            component: FormComponent,
          },
          {
            path: 'dishes',
            component: FormComponent,
          },
          {
            path: 'orders',
            component: FormComponent,
          },
          {
            path: 'clients',
            component: FormComponent,
          },
          {
            path: 'about',
            component: FormComponent,
          }
        ]
      }
    ]
  },
  {
    path: 'menus',
    component: BodyComponent,
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
        component: BodyComponent,
      }
    ]
  },
  {
    path: 'orders',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BodyComponent,
      }
    ]
  },
  {
    path: 'clients',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BodyComponent,
      }
    ]
  },
  {
    path: 'about',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BodyComponent,
      }
    ]
  }
];
