import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { ContentComponent } from '../content/content.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ContentComponent,
        outlet: 'header'
      },
      {
        path: '',
        component: ContentComponent,
        outlet: 'left-side'
      },
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: '',
        component: ContentComponent,
        outlet: 'right-side'
      },
      {
        path: '',
        component: ContentComponent,
        outlet: 'footer'
      }
    ]
  },
  {
    path: 'login/:manuel/:id',
    component: LayoutComponent,
    canActivate: [adminGuard],
    data: { isLogged: true },
    children: [
      {
        path: '',
        component: ContentComponent,
        outlet: 'header'
      },
      {
        path: '',
        component: ContentComponent,
        outlet: 'left-side',
        data: { isBrota: true }
      },
      {
        path: '',
        component: LoginComponent,
        data: { isCurrent: true }
      },
      {
        path: '',
        component: ContentComponent,
        outlet: 'right-side'
      },
      {
        path: '',
        component: ContentComponent,
        outlet: 'footer'
      }
    ]
  }
];
