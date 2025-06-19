import { Routes } from '@angular/router';
import { AppLayout } from './app-layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    // Only child routes that should share the layout go here
    children: [
      // e.g. dashboard, home, etc
    ]
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat').then(m => m.Chat), // independent
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login),
  },
];