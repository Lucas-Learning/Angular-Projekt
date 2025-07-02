import { Routes } from '@angular/router';
import { AppLayout } from './app-layout/app-layout';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Chat } from './chat/chat';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
  },
  {
    path: 'chat',
    component:Chat
  },
  {
    path: 'login',
    component:Login
  },
  {
    path: 'signup',
    component:Signup
  }
];