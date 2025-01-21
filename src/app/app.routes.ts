import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ContentComponent } from './components/content/content.component';

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
        outlet: 'content'
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
    path: 'login',
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
        component: LoginComponent,
        outlet: 'content'
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
