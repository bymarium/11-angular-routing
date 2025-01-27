import { Routes } from '@angular/router';
import { BodyComponent } from '../body/body.component';
import { ClientComponent } from '../client/client.component';
import { DishComponent } from '../dish/dish.component';
import { LayoutComponent } from '../layout/layout.component';
import { MenuComponent } from '../menu/menu.component';
import { OrderComponent } from '../order/order.component';

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
            component: OrderComponent,
          },
          {
            path: 'clients',
            component: ClientComponent,
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
  }
];
