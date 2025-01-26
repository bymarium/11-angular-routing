import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { BodyComponent } from '../body/body.component';
import { FormComponent } from '../form/form.component';
import { ClientComponent } from '../client/client.component';
import { MenuComponent } from '../menu/menu.component';
import { DishComponent } from '../dish/dish.component';

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
            component: MenuComponent,
          },
          {
            path: 'dishes',
            component: DishComponent,
          },
          {
            path: 'orders',
            component: FormComponent,
          },
          {
            path: 'clients',
            component: ClientComponent,
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
